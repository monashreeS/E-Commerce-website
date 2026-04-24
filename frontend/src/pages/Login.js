import React, { useState } from 'react';
import {
  Link,
  useNavigate,
  useLocation,
} from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // 👁️ NEW
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();

    setErr('');
    setLoading(true);

    try {
      const u = await login(
        email.trim(),
        password
      );

      navigate(
        u.role === 'admin'
          ? '/admin'
          : location.state?.from || '/'
      );
    } catch (e2) {
      setErr(
        e2.response?.data?.message ||
          'Login failed'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div
        className="auth-card"
        data-testid="login-card"
      >
        <div className="auth-logo">
          EduTech Store
        </div>

        <h2>Welcome back</h2>

        <p className="auth-sub">
          Sign in to continue shopping for
          your academic journey.
        </p>

        {err && (
          <div
            className="alert-error"
            data-testid="login-error"
          >
            {err}
          </div>
        )}

        <form onSubmit={submit}>
          {/* EMAIL */}
          <div className="field">
            <label>Email</label>

            <input
              className="input"
              type="email"
              placeholder="you@college.edu"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
              data-testid="login-email-input"
            />
          </div>

          {/* PASSWORD WITH EYE ICON */}
          <div className="field">
            <label>Password</label>

            <div style={{ position: "relative" }}>
              <input
                className="input"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
                autoComplete="current-password"
                data-testid="login-password-input"
              />

              <span
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  fontSize: "18px"
                }}
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>
          </div>

          {/* BUTTON */}
          <button
            className="btn btn-primary btn-block"
            disabled={loading}
            data-testid="login-submit-button"
          >
            {loading
              ? 'Signing in...'
              : 'Login'}
          </button>
        </form>

        <div
          className="auth-hint"
          data-testid="login-hint"
        >
        </div>

        <div className="auth-foot">
          New here?{' '}
          <Link
            to="/signup"
            data-testid="login-signup-link"
          >
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}
