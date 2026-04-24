
import os
import atexit
import signal
import subprocess
import asyncio
from typing import Optional

import httpx
from dotenv import load_dotenv
from fastapi import FastAPI, Request, Response
from fastapi.responses import JSONResponse

load_dotenv()

NODE_PORT = int(os.environ.get("NODE_PORT", "8002"))
BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))

_node_proc: Optional[subprocess.Popen] = None


def _start_node():
    """Start Express backend as child process."""
    global _node_proc

    if _node_proc and _node_proc.poll() is None:
        return

    env = os.environ.copy()
    env.setdefault("NODE_PORT", str(NODE_PORT))

    _node_proc = subprocess.Popen(
        ["node", "server.js"],
        cwd=BACKEND_DIR,
        env=env,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
        start_new_session=True
    )


def _stop_node():
    """Stop Node child process."""
    global _node_proc

    if _node_proc and _node_proc.poll() is None:
        try:
            os.killpg(os.getpgid(_node_proc.pid), signal.SIGTERM)
        except Exception:
            pass


atexit.register(_stop_node)

app = FastAPI(title="EduTech Proxy")

_client = httpx.AsyncClient(
    base_url=f"http://127.0.0.1:{NODE_PORT}",
    timeout=60.0
)


@app.on_event("startup")
async def startup():
    _start_node()

    # wait until node server starts
    for _ in range(40):
        try:
            res = await _client.get("/api/health")
            if res.status_code == 200:
                return
        except Exception:
            pass

        await asyncio.sleep(0.5)


@app.on_event("shutdown")
async def shutdown():
    await _client.aclose()
    _stop_node()


@app.get("/__proxy_health")
async def proxy_health():
    alive = _node_proc is not None and _node_proc.poll() is None

    return {
        "node_alive": alive,
        "node_port": NODE_PORT
    }


EXCLUDED_HEADERS = {
    "host",
    "content-length",
    "connection",
    "transfer-encoding"
}


@app.api_route(
    "/{path:path}",
    methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"]
)
async def proxy(path: str, request: Request):
    global _node_proc

    # restart node if crashed
    if _node_proc is None or _node_proc.poll() is not None:
        _start_node()

        for _ in range(20):
            try:
                await _client.get("/api/health")
                break
            except Exception:
                await asyncio.sleep(0.25)

    url = "/" + path

    if request.url.query:
        url += "?" + request.url.query

    body = await request.body()

    headers = {
        k: v
        for k, v in request.headers.items()
        if k.lower() not in EXCLUDED_HEADERS
    }

    try:
        upstream = await _client.request(
            request.method,
            url,
            content=body,
            headers=headers
        )

    except httpx.RequestError as e:
        return JSONResponse(
            {"message": f"Upstream unavailable: {str(e)}"},
            status_code=502
        )

    response_headers = {
        k: v
        for k, v in upstream.headers.items()
        if k.lower() not in {
            "content-encoding",
            "transfer-encoding",
            "connection"
        }
    }

    return Response(
        content=upstream.content,
        status_code=upstream.status_code,
        headers=response_headers,
        media_type=upstream.headers.get("content-type")
    )

