import React, {
  useEffect,
  useState,
} from 'react';

import {
  useParams,
  useNavigate,
  Link,
} from 'react-router-dom';

import {
  ArrowLeft,
  Star,
} from 'lucide-react';

import api from '../api/axios';
import { useCart } from '../context/CartContext';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { addToCart } = useCart();

  const [product, setProduct] =
    useState(null);

  const [qty, setQty] = useState(1);
  const [thumbIdx, setThumbIdx] =
    useState(0);

  const [notice, setNotice] =
    useState('');

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const { data } =
          await api.get(
            `/products/${id}`
          );

        setProduct(data.product);
      } catch {
        navigate('/products');
      }
    };

    loadProduct();
  }, [id, navigate]);

  if (!product) {
    return (
      <div className="page-loading">
        Loading...
      </div>
    );
  }

  const thumbs =
    product.images?.length
      ? product.images
      : [
          product.image,
          product.image,
          product.image,
        ];

  const mainImg =
    thumbs[thumbIdx] ||
    product.image;

  const addHandler = () => {
    addToCart(product, qty);

    setNotice(
      `Added ${qty} × ${product.name} to cart`
    );

    setTimeout(() => {
      setNotice('');
    }, 1800);
  };

  const buyNow = () => {
    addToCart(product, qty);
    navigate('/cart');
  };

  return (
    <div
      className="container"
      style={{ paddingTop: 20 }}
    >
      <Link
        to="/products"
        className="pdp-back"
        data-testid="pdp-back"
      >
        <ArrowLeft size={16} />
        Back to Products
      </Link>

      <div className="pdp">
        <div className="pdp-gallery">
          <div className="pdp-main-img">
            <img
              src={mainImg}
              alt={product.name}
              data-testid="pdp-main-image"
            />
          </div>

          <div className="pdp-thumbs">
            {thumbs
              .slice(0, 3)
              .map((src, i) => (
                <button
                  key={i}
                  className={
                    i === thumbIdx
                      ? 'active'
                      : ''
                  }
                  onClick={() =>
                    setThumbIdx(i)
                  }
                  data-testid={`pdp-thumb-${i}`}
                >
                  <img
                    src={src}
                    alt={`thumb ${i}`}
                  />
                </button>
              ))}
          </div>
        </div>

        <div className="pdp-info">
          <h1 data-testid="pdp-title">
            {product.name}
          </h1>

          <div
            className="pdp-price"
            data-testid="pdp-price"
          >
            ₹
            {product.price.toLocaleString(
              'en-IN'
            )}
          </div>

          <div className="pdp-rating">
            <span className="pdp-stars">
              ★★★★★
            </span>

            <span>
              {product.rating} (
              {product.reviews}{' '}
              reviews)
            </span>
          </div>

          <div className="pdp-features">
            <h3>Key Features</h3>

            <ul>
              {(product.features ||
                []).map(
                (f, i) => (
                  <li key={i}>
                    {f}
                  </li>
                )
              )}
            </ul>
          </div>

          <div className="pdp-qty">
            <label>
              Quantity:
            </label>

            <div
              className="qty-stepper"
              data-testid="pdp-qty-stepper"
            >
              <button
                onClick={() =>
                  setQty((q) =>
                    Math.max(
                      1,
                      q - 1
                    )
                  )
                }
              >
                –
              </button>

              <span
                className="num"
                data-testid="pdp-qty-value"
              >
                {qty}
              </span>

              <button
                onClick={() =>
                  setQty(
                    (q) => q + 1
                  )
                }
              >
                +
              </button>
            </div>
          </div>

          <div className="pdp-actions">
            <button
              className="btn btn-primary"
              onClick={addHandler}
              data-testid="pdp-add-cart"
            >
              Add to Cart
            </button>

            <button
              className="btn btn-outline"
              onClick={buyNow}
              data-testid="pdp-buy-now"
            >
              Buy Now
            </button>
          </div>
        </div>

        <div className="pdp-description">
          <h3>Description</h3>

          <p>
            {product.description}
          </p>
        </div>
      </div>

      {notice && (
        <div
          className="notice"
          data-testid="pdp-notice"
        >
          <Star
            size={14}
            style={{
              verticalAlign: -2,
              marginRight: 6,
            }}
          />
          {notice}
        </div>
      )}
    </div>
  );
}