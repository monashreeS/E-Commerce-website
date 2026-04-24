import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Search,
  ShoppingCart,
  ChevronDown,
  User,
  Package,
  Heart,
  LayoutDashboard,
  LogOut,
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { totals } = useCart();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');

  const ref = useRef();

  useEffect(() => {
    const click = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', click);

    return () => {
      document.removeEventListener('mousedown', click);
    };
  }, []);

  const submitSearch = (e) => {
    e.preventDefault();
    navigate(`/products${q ? `?search=${encodeURIComponent(q)}` : ''}`);
  };

  const initial = (user?.name || 'G').charAt(0).toUpperCase();

  return (
    <header className="navbar">
      <div className="container">
        <Link to="/" className="nav-brand" data-testid="nav-brand">
          EduTech<span> Store</span>
        </Link>

        <form
          className="nav-search"
          onSubmit={submitSearch}
          data-testid="nav-search-form"
        >
          <input
            type="text"
            placeholder="Search for products..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            data-testid="nav-search-input"
          />

          <button
            type="submit"
            aria-label="Search"
            data-testid="nav-search-submit"
          >
            <Search size={16} />
          </button>
        </form>

        <nav className="nav-links">
          <NavLink
            to="/"
            end
            className="nav-link"
            data-testid="nav-home-link"
          >
            Home
          </NavLink>

          <NavLink
            to="/products"
            className="nav-link"
            data-testid="nav-products-link"
          >
            Products
          </NavLink>

          <NavLink
            to="/products"
            className="nav-link nav-link-hide"
            data-testid="nav-categories-link"
          >
            Categories
          </NavLink>

          <Link
            to="/cart"
            className="nav-cart"
            data-testid="nav-cart-link"
          >
            <ShoppingCart size={20} />

            {totals.count > 0 && (
              <span
                className="nav-cart-badge"
                data-testid="nav-cart-count"
              >
                {totals.count}
              </span>
            )}
          </Link>

          {user ? (
            <div className="nav-profile" ref={ref}>
              <button
                className="nav-profile-trigger"
                onClick={() => setOpen(!open)}
                data-testid="nav-profile-trigger"
              >
                <span className="nav-avatar">{initial}</span>

                <span className="nav-link-hide">
                  {user.name.split(' ')[0]}
                </span>

                <ChevronDown size={14} />
              </button>

              {open && (
                <div
                  className="nav-dropdown"
                  data-testid="nav-dropdown"
                >
                  <Link
                    to="/profile"
                    onClick={() => setOpen(false)}
                    data-testid="dropdown-profile"
                  >
                    <User
                      size={14}
                      style={{
                        marginRight: 8,
                        verticalAlign: -2,
                      }}
                    />
                    My Profile
                  </Link>

                  <Link
                    to="/profile"
                    onClick={() => setOpen(false)}
                    data-testid="dropdown-orders"
                  >
                    <Package
                      size={14}
                      style={{
                        marginRight: 8,
                        verticalAlign: -2,
                      }}
                    />
                    My Orders
                  </Link>

                  <Link
                    to="/profile"
                    onClick={() => setOpen(false)}
                    data-testid="dropdown-wishlist"
                  >
                    <Heart
                      size={14}
                      style={{
                        marginRight: 8,
                        verticalAlign: -2,
                      }}
                    />
                    Wishlist
                  </Link>

                  {user.role === 'admin' && (
                    <Link
                      to="/admin"
                      onClick={() => setOpen(false)}
                      data-testid="dropdown-admin"
                    >
                      <LayoutDashboard
                        size={14}
                        style={{
                          marginRight: 8,
                          verticalAlign: -2,
                        }}
                      />
                      Admin Dashboard
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      setOpen(false);
                      logout();
                      navigate('/');
                    }}
                    data-testid="dropdown-logout"
                  >
                    <LogOut
                      size={14}
                      style={{
                        marginRight: 8,
                        verticalAlign: -2,
                      }}
                    />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="nav-link"
                data-testid="nav-login-link"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="btn btn-sm"
                style={{
                  background: '#FDE68A',
                  color: '#5B21B6',
                }}
                data-testid="nav-signup-link"
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}