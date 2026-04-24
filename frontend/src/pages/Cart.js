import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag } from 'lucide-react';

import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function Cart() {
  const { items, updateQty, removeItem, totals, clear } =
    useCart();

  const { user } = useAuth();
  const navigate = useNavigate();

  const [placing, setPlacing] = useState(false);
  const [notice, setNotice] = useState('');

  const checkout = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setPlacing(true);

    try {
      await api.post('/orders', {
        items,
        total: totals.total,
      });

      clear();
      setNotice('Order placed successfully!');

      setTimeout(() => {
        navigate('/profile');
      }, 1200);
    } catch (e) {
      setNotice(
        e.response?.data?.message ||
          'Checkout failed'
      );
    } finally {
      setPlacing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div
        className="container"
        style={{ padding: '48px 0' }}
      >
        <div
          className="cart-empty"
          data-testid="cart-empty"
        >
          <ShoppingBag
            size={48}
            style={{
              margin: '0 auto',
            }}
          />

          <h3>Your cart is empty</h3>

          <p>
            Start adding products for your
            academic journey.
          </p>

          <Link
            to="/products"
            className="btn btn-primary"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container cart-wrap">
      <div
        className="cart-card"
        data-testid="cart-card"
      >
        <div className="cart-card-head">
          Shopping Cart
        </div>

        <table className="cart-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {items.map((it) => (
              <tr
                key={it.productId}
                data-testid={`cart-row-${it.productId}`}
              >
                <td>
                  <div className="cart-product">
                    <img
                      src={it.image}
                      alt={it.name}
                    />

                    <div>
                      <div className="pname">
                        {it.name}
                      </div>

                      <div className="pprice">
                        ₹
                        {it.price.toLocaleString(
                          'en-IN'
                        )}
                      </div>
                    </div>
                  </div>
                </td>

                <td>
                  ₹
                  {it.price.toLocaleString(
                    'en-IN'
                  )}
                </td>

                <td>
                  <div
                    className="qty-stepper"
                    style={{ width: 112 }}
                  >
                    <button
                      onClick={() =>
                        updateQty(
                          it.productId,
                          it.quantity - 1
                        )
                      }
                    >
                      –
                    </button>

                    <span className="num">
                      {it.quantity}
                    </span>

                    <button
                      onClick={() =>
                        updateQty(
                          it.productId,
                          it.quantity + 1
                        )
                      }
                    >
                      +
                    </button>
                  </div>
                </td>

                <td>
                  <strong>
                    ₹
                    {(
                      it.price *
                      it.quantity
                    ).toLocaleString(
                      'en-IN'
                    )}
                  </strong>
                </td>

                <td>
                  <button
                    className="cart-remove"
                    onClick={() =>
                      removeItem(it.productId)
                    }
                    aria-label="Remove"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <aside
        className="summary"
        data-testid="cart-summary"
      >
        <div className="cart-card-head">
          Order Summary
        </div>

        <div className="summary-rows">
          <div className="row">
            <span>Subtotal</span>

            <span>
              ₹
              {totals.subtotal.toLocaleString(
                'en-IN'
              )}
            </span>
          </div>

          <div className="row">
            <span>Shipping</span>

            <span className="free">
              Free
            </span>
          </div>

          <div className="row total">
            <span>Total</span>

            <span data-testid="cart-total">
              ₹
              {totals.total.toLocaleString(
                'en-IN'
              )}
            </span>
          </div>
        </div>

        <div className="summary-btn">
          <button
            className="btn btn-primary btn-block"
            onClick={checkout}
            disabled={placing}
          >
            {placing
              ? 'Placing order...'
              : 'Proceed to Checkout'}
          </button>
        </div>
      </aside>

      {notice && (
        <div className="notice">
          {notice}
        </div>
      )}
    </div>
  );
}