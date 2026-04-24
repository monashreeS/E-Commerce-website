import React, { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  LogOut,
  Plus,
  Edit2,
  Trash2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const empty = {
  name: '',
  price: '',
  image: '',
  category: 'Laptops',
  description: '',
  stock: 10,
  features: '',
  branchRecommendation: 'ALL',
  featured: false,
};

export default function Admin() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);

  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [notice, setNotice] = useState('');

  const loadAll = async () => {
    const [s, p, o, u] = await Promise.all([
      api.get('/users/admin/stats'),
      api.get('/products?limit=200'),
      api.get('/orders'),
      api.get('/users'),
    ]);

    setStats(s.data);
    setProducts(p.data.products);
    setOrders(o.data.orders);
    setUsers(u.data.users);
  };

  useEffect(() => {
    loadAll().catch((e) => {
      setNotice(e.response?.data?.message || 'Load failed');
    });
  }, []);

  const openNew = () => {
    setForm(empty);
    setEditing('new');
  };

  const openEdit = (p) => {
    setForm({
      ...p,
      features: (p.features || []).join(', '),
      branchRecommendation:
        (p.branchRecommendation || ['ALL'])[0] || 'ALL',
    });

    setEditing(p);
  };

  const save = async () => {
    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock) || 0,
      features: form.features
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      branchRecommendation: [
        form.branchRecommendation || 'ALL',
      ],
    };

    try {
      if (editing === 'new') {
        await api.post('/products', payload);
        setNotice('Product added');
      } else {
        await api.put(`/products/${editing._id}`, payload);
        setNotice('Product updated');
      }

      setEditing(null);
      loadAll();
    } catch (e) {
      setNotice(e.response?.data?.message || 'Save failed');
    }
  };

  const del = async (p) => {
    if (!window.confirm(`Delete "${p.name}"?`)) return;

    await api.delete(`/products/${p._id}`);
    loadAll();
  };

  return (
    <div className="container admin-wrap">
      <aside
        className="admin-side"
        data-testid="admin-sidebar"
      >
        <div className="admin-side-head">
          Admin Panel
        </div>

        <nav>
          <button
            className={
              tab === 'dashboard' ? 'active' : ''
            }
            onClick={() => setTab('dashboard')}
            data-testid="admin-tab-dashboard"
          >
            <LayoutDashboard size={16} />
            Dashboard
          </button>

          <button
            className={
              tab === 'products' ? 'active' : ''
            }
            onClick={() => setTab('products')}
            data-testid="admin-tab-products"
          >
            <Package size={16} />
            Products
          </button>

          <button
            className={
              tab === 'orders' ? 'active' : ''
            }
            onClick={() => setTab('orders')}
            data-testid="admin-tab-orders"
          >
            <ShoppingBag size={16} />
            Orders
          </button>

          <button
            className={tab === 'users' ? 'active' : ''}
            onClick={() => setTab('users')}
            data-testid="admin-tab-users"
          >
            <Users size={16} />
            Users
          </button>

          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            data-testid="admin-logout"
          >
            <LogOut size={16} />
            Logout
          </button>
        </nav>
      </aside>

      <section className="admin-main">
        {tab === 'dashboard' && stats && (
          <>
            <div
              className="stats-row"
              data-testid="admin-stats"
            >
              <div className="stat-card">
                <div className="k">
                  Total Products
                </div>
                <div className="v">
                  {stats.totalProducts}
                </div>
              </div>

              <div className="stat-card">
                <div className="k">
                  Total Orders
                </div>
                <div className="v">
                  {stats.totalOrders}
                </div>
              </div>

              <div className="stat-card">
                <div className="k">
                  Total Users
                </div>
                <div className="v">
                  {stats.totalUsers.toLocaleString()}
                </div>
              </div>

              <div className="stat-card">
                <div className="k">Revenue</div>
                <div className="v">
                  ₹
                  {stats.revenue.toLocaleString(
                    'en-IN'
                  )}
                </div>
              </div>
            </div>

            <div className="panel">
              <div className="panel-head">
                <h3>Recent Orders</h3>
              </div>

              <table className="tbl">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {orders.slice(0, 8).map((o) => (
                    <tr
                      key={o._id}
                      data-testid={`admin-order-row-${o._id}`}
                    >
                      <td>
                        <strong>
                          #
                          {o._id
                            .slice(-6)
                            .toUpperCase()}
                        </strong>
                      </td>

                      <td>
                        {o.customerName || '—'}
                      </td>

                      <td>{o.items.length}</td>

                      <td>
                        ₹
                        {o.total.toLocaleString(
                          'en-IN'
                        )}
                      </td>

                      <td>
                        <span className="badge badge-success">
                          {o.status}
                        </span>
                      </td>
                    </tr>
                  ))}

                  {!orders.length && (
                    <tr>
                      <td
                        colSpan={5}
                        style={{
                          textAlign: 'center',
                          padding: 20,
                        }}
                      >
                        No orders yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {tab === 'products' && (
          <div className="panel">
            <div className="panel-head">
              <h3>
                Products ({products.length})
              </h3>

              <button
                className="btn btn-primary btn-sm"
                onClick={openNew}
                data-testid="admin-add-product"
              >
                <Plus size={14} />
                Add Product
              </button>
            </div>

            {editing && (
              <div className="product-edit-box">
                <h4>
                  {editing === 'new'
                    ? 'Add New Product'
                    : `Edit: ${editing.name}`}
                </h4>

                <div className="product-form">
                  <div className="field">
                    <label>Name</label>

                    <input
                      className="input"
                      value={form.name}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          name: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="field">
                    <label>Price</label>

                    <input
                      className="input"
                      type="number"
                      value={form.price}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          price: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={save}
                  >
                    Save
                  </button>

                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() =>
                      setEditing(null)
                    }
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <table className="tbl">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {products.map((p) => (
                  <tr key={p._id}>
                    <td>{p.name}</td>
                    <td>{p.category}</td>
                    <td>
                      ₹
                      {p.price.toLocaleString(
                        'en-IN'
                      )}
                    </td>
                    <td>{p.stock}</td>

                    <td>
                      <button
                        onClick={() =>
                          openEdit(p)
                        }
                      >
                        <Edit2 size={14} />
                      </button>

                      <button
                        onClick={() => del(p)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'orders' && (
          <div className="panel">
            <h3>All Orders</h3>
          </div>
        )}

        {tab === 'users' && (
          <div className="panel">
            <h3>Users ({users.length})</h3>

            <table className="tbl">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Branch</th>
                  <th>Role</th>
                </tr>
              </thead>

              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.branch}</td>
                    <td>{u.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {notice && (
        <div className="notice">{notice}</div>
      )}
    </div>
  );
}