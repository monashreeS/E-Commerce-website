import React from 'react';

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import {
  AuthProvider,
  useAuth,
} from './context/AuthContext';

import {
  CartProvider,
} from './context/CartContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import Admin from './pages/Admin';

function Protected({
  children,
  adminOnly,
}) {
  const {
    user,
    loading,
  } = useAuth();

  if (loading) {
    return (
      <div className="page-loading">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  if (
    adminOnly &&
    user.role !== 'admin'
  ) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return children;
}

function Shell() {
  return (
    <>
      <Navbar />

      <main className="app-main">
        <Routes>
          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/signup"
            element={<Signup />}
          />

          <Route
            path="/products"
            element={<Products />}
          />

          <Route
            path="/products/:id"
            element={
              <ProductDetails />
            }
          />

          <Route
            path="/cart"
            element={
              <Protected>
                <Cart />
              </Protected>
            }
          />

          <Route
            path="/profile"
            element={
              <Protected>
                <Profile />
              </Protected>
            }
          />

          <Route
            path="/admin"
            element={
              <Protected adminOnly>
                <Admin />
              </Protected>
            }
          />

          <Route
            path="*"
            element={
              <Navigate
                to="/"
                replace
              />
            }
          />
        </Routes>
      </main>

      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Shell />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}