import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Truck,
  ShieldCheck,
  Percent,
  Lock,
  Laptop,
  Headphones,
  Smartphone,
  Monitor,
  Package,
} from 'lucide-react';

import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../context/AuthContext';

const CATS = [
  { name: 'Laptops', Icon: Laptop },
  { name: 'Accessories', Icon: Headphones },
  { name: 'Mobiles', Icon: Smartphone },
  { name: 'Smart TV', Icon: Monitor },
  { name: 'Others', Icon: Package },
];

export default function Home() {
  const { user } = useAuth();

  const [recommended, setRecommended] = useState([]);
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const branch = user?.branch || 'CSE';

        const [rec, feat] = await Promise.all([
          api.get(`/products?branch=${branch}&limit=6`),
          api.get('/products?featured=true&limit=6'),
        ]);

        setRecommended(rec.data.products);
        setFeatured(feat.data.products);
      } catch (error) {
        console.error(error);
      }
    };

    loadProducts();
  }, [user]);

  return (
    <div className="container">
      {/* Hero */}
      <section
        className="hero"
        data-testid="hero-section"
      >
        <div>
          <h1>Best Tech for Students</h1>

          <p>
            Find the best laptops,
            accessories and electronics for
            your academic journey.
          </p>

          <div className="hero-ctas">
            <Link
              to="/products"
              className="btn btn-primary"
              data-testid="hero-shop-now"
            >
              Shop Now
            </Link>

            <Link
              to="/products"
              className="btn btn-outline"
              data-testid="hero-explore"
            >
              Explore Categories
            </Link>
          </div>
        </div>

        <div className="hero-art">
          <img
            src="https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=900"
            alt="Student laptop setup"
          />
        </div>
      </section>

      {/* Benefits */}
      <section
        className="benefits"
        data-testid="benefits-section"
      >
        {[
          {
            Icon: Truck,
            t: 'Free Shipping',
            s: 'On orders above ₹999',
          },
          {
            Icon: ShieldCheck,
            t: 'Best Quality',
            s: 'Top quality products',
          },
          {
            Icon: Percent,
            t: 'Student Discounts',
            s: 'Extra 10% off',
          },
          {
            Icon: Lock,
            t: 'Secure Payments',
            s: '100% secure checkout',
          },
        ].map(({ Icon, t, s }) => (
          <div
            className="benefit"
            key={t}
          >
            <div className="benefit-icon">
              <Icon size={22} />
            </div>

            <div>
              <h4>{t}</h4>
              <p>{s}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Categories */}
      <section className="section">
        <div className="heading-row">
          <h2>Shop by Category</h2>

          <Link to="/products">
            View All
          </Link>
        </div>

        <div className="category-pills">
          {CATS.map(
            ({ name, Icon }) => (
              <Link
                key={name}
                to={`/products?category=${encodeURIComponent(
                  name
                )}`}
                className="category-pill"
                data-testid={`category-${name}`}
              >
                <div className="pill-ic">
                  <Icon size={24} />
                </div>

                <div className="pill-name">
                  {name}
                </div>
              </Link>
            )
          )}
        </div>
      </section>

      {/* Recommended */}
      <section className="section">
        <div className="heading-row">
          <h2>
            Recommended for{' '}
            {user?.branch || 'CSE'} Students
          </h2>

          <Link to="/products">
            View All
          </Link>
        </div>

        {recommended.length ? (
          <div
            className="product-row"
            data-testid="recommended-list"
          >
            {recommended.map((p) => (
              <ProductCard
                key={p._id}
                product={p}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            Loading recommendations...
          </div>
        )}
      </section>

      {/* Featured */}
      <section className="section">
        <div className="heading-row">
          <h2>Featured Products</h2>

          <Link to="/products">
            View All
          </Link>
        </div>

        {featured.length ? (
          <div
            className="product-row"
            data-testid="featured-list"
          >
            {featured.map((p) => (
              <ProductCard
                key={p._id}
                product={p}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            No featured products yet.
          </div>
        )}
      </section>
    </div>
  );
}