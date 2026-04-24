import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div
      className="pcard"
      data-testid={`product-card-${product._id}`}
    >
      <Link
        to={`/products/${product._id}`}
        className="pcard-img"
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
        />
      </Link>

      <div className="pcard-body">
        <Link
          to={`/products/${product._id}`}
          className="pcard-name"
        >
          {product.name}
        </Link>

        <div className="pcard-foot">
          <div className="pcard-price">
            ₹{product.price.toLocaleString('en-IN')}
          </div>

          <button
            className="pcard-cart"
            onClick={(e) => {
              e.preventDefault();
              addToCart(product, 1);
            }}
            aria-label="Add to cart"
            data-testid={`add-to-cart-${product._id}`}
          >
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}