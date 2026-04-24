import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  useSearchParams,
} from 'react-router-dom';

import api from '../api/axios';
import ProductCard from '../components/ProductCard';

const CATEGORIES = [
  'All',
  'Laptops',
  'Accessories',
  'Mobiles',
  'Smart TV',
  'Others',
];

export default function Products() {
  const [searchParams, setSearchParams] =
    useSearchParams();

  const [allProducts, setAllProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const initialCategory =
    searchParams.get('category') ||
    'All';

  const initialSearch =
    searchParams.get('search') || '';

  const [category, setCategory] =
    useState(initialCategory);

  const [search, setSearch] =
    useState(initialSearch);

  const [maxPrice, setMaxPrice] =
    useState(150000);

  const [appliedMax, setAppliedMax] =
    useState(150000);

  const [sort, setSort] =
    useState('newest');

  useEffect(() => {
    const loadProducts =
      async () => {
        setLoading(true);

        try {
          const { data } =
            await api.get(
              '/products?limit=100'
            );

          setAllProducts(
            data.products
          );
        } finally {
          setLoading(false);
        }
      };

    loadProducts();
  }, []);

  useEffect(() => {
    setSearch(
      searchParams.get('search') ||
        ''
    );

    setCategory(
      searchParams.get(
        'category'
      ) || 'All'
    );
  }, [searchParams]);

  const displayed = useMemo(() => {
    let list =
      allProducts.slice();

    if (category !== 'All') {
      list = list.filter(
        (p) =>
          p.category ===
          category
      );
    }

    if (search.trim()) {
      list = list.filter((p) =>
        p.name
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )
      );
    }

    list = list.filter(
      (p) =>
        p.price <=
        appliedMax
    );

    if (sort === 'price-asc') {
      list.sort(
        (a, b) =>
          a.price - b.price
      );
    }

    if (
      sort === 'price-desc'
    ) {
      list.sort(
        (a, b) =>
          b.price - a.price
      );
    }

    if (sort === 'name') {
      list.sort((a, b) =>
        a.name.localeCompare(
          b.name
        )
      );
    }

    return list;
  }, [
    allProducts,
    category,
    search,
    appliedMax,
    sort,
  ]);

  const applyFilters = () => {
    setAppliedMax(maxPrice);
  };

  const onCat = (c) => {
    setCategory(c);

    const sp =
      new URLSearchParams(
        searchParams
      );

    if (c === 'All') {
      sp.delete('category');
    } else {
      sp.set(
        'category',
        c
      );
    }

    setSearchParams(sp);
  };

  return (
    <div className="container products-layout">
      <aside
        className="filters"
        data-testid="filters-sidebar"
      >
        <h3>Filters</h3>

        <div className="filter-group">
          <h4>Category</h4>

          {CATEGORIES.map(
            (c) => (
              <label
                key={c}
                className="check-row"
              >
                <input
                  type="radio"
                  name="cat"
                  checked={
                    category ===
                    c
                  }
                  onChange={() =>
                    onCat(c)
                  }
                  data-testid={`filter-cat-${c}`}
                />

                {c}
              </label>
            )
          )}
        </div>

        <div className="filter-group">
          <h4>
            Price Range
          </h4>

          <div className="price-range">
            <input
              type="range"
              min="0"
              max="150000"
              step="1000"
              value={maxPrice}
              onChange={(e) =>
                setMaxPrice(
                  Number(
                    e.target.value
                  )
                )
              }
              data-testid="filter-price-range"
            />

            <div className="price-labels">
              <span>
                ₹0
              </span>

              <span>
                ₹
                {maxPrice.toLocaleString(
                  'en-IN'
                )}
              </span>
            </div>
          </div>
        </div>

        <button
          className="btn btn-primary btn-block"
          onClick={
            applyFilters
          }
          data-testid="filter-apply"
        >
          Apply
        </button>
      </aside>

      <section>
        <div className="products-head">
          <h2 data-testid="products-title">
            {search
              ? `Results for "${search}"`
              : category ===
                'All'
              ? 'All Products'
              : category}
          </h2>

          <div className="sort-box">
            <span
              style={{
                fontSize: 13,
                color:
                  'var(--ink-400)',
              }}
            >
              Sort by:
            </span>

            <select
              value={sort}
              onChange={(e) =>
                setSort(
                  e.target.value
                )
              }
              data-testid="sort-select"
            >
              <option value="newest">
                Newest
              </option>

              <option value="price-asc">
                Price: Low to
                High
              </option>

              <option value="price-desc">
                Price: High to
                Low
              </option>

              <option value="name">
                Name
              </option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="empty-state">
            Loading
            products...
          </div>
        ) : displayed.length ===
          0 ? (
          <div
            className="empty-state"
            data-testid="no-products"
          >
            No products match
            your filters.
          </div>
        ) : (
          <div
            className="grid-products"
            data-testid="products-grid"
          >
            {displayed.map(
              (p) => (
                <ProductCard
                  key={p._id}
                  product={p}
                />
              )
            )}
          </div>
        )}
      </section>
    </div>
  );
}