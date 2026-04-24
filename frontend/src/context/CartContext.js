
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);
const KEY = 'edu_cart';

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(KEY) || '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = (product, qty = 1) => {
    setItems((prev) => {
      const id = product._id || product.id;
      const existing = prev.find((x) => x.productId === id);
      if (existing) {
        return prev.map((x) =>
          x.productId === id ? { ...x, quantity: x.quantity + qty } : x
        );
      }
      return [
        ...prev,
        {
          productId: id,
          name: product.name,
          image: product.image,
          price: product.price,
          quantity: qty,
        },
      ];
    });
  };

  const updateQty = (productId, quantity) => {
    if (quantity <= 0) return removeItem(productId);
    setItems((prev) => prev.map((x) => (x.productId === productId ? { ...x, quantity } : x)));
  };

  const removeItem = (productId) => {
    setItems((prev) => prev.filter((x) => x.productId !== productId));
  };

  const clear = () => setItems([]);

  const totals = useMemo(() => {
    const subtotal = items.reduce((s, x) => s + x.price * x.quantity, 0);
    const count = items.reduce((s, x) => s + x.quantity, 0);
    return { subtotal, count, total: subtotal };
  }, [items]);

  return (
    <CartContext.Provider value={{ items, addToCart, updateQty, removeItem, clear, totals }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
