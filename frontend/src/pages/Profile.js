import React, {
  useEffect,
  useState,
} from 'react';

import {
  LayoutDashboard,
  Package,
  Heart,
  User as UserIcon,
  LogOut,
} from 'lucide-react';

import {
  useNavigate,
} from 'react-router-dom';

import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const TABS = [
  {
    key: 'profile',
    label: 'Profile',
    Icon: UserIcon,
  },
  {
    key: 'orders',
    label: 'My Orders',
    Icon: Package,
  },
  {
    key: 'wishlist',
    label: 'My Wishlist',
    Icon: Heart,
  },
];

export default function Profile() {
  const {
    user,
    logout,
    updateProfile,
  } = useAuth();

  const navigate =
    useNavigate();

  const [tab, setTab] =
    useState('profile');

  const [editing, setEditing] =
    useState(false);

  const [form, setForm] =
    useState({
      name: '',
      branch: '',
      phone: '',
    });

  const [orders, setOrders] =
    useState([]);

  const [notice, setNotice] =
    useState('');

  useEffect(() => {
    if (user) {
      setForm({
        name:
          user.name || '',
        branch:
          user.branch ||
          'CSE',
        phone:
          user.phone || '',
      });
    }
  }, [user]);

  useEffect(() => {
    if (tab === 'orders') {
      api
        .get('/orders/me')
        .then((r) =>
          setOrders(
            r.data.orders
          )
        )
        .catch(() => {});
    }
  }, [tab]);

  const save =
    async () => {
      try {
        await updateProfile(
          form
        );

        setEditing(false);
        setNotice(
          'Profile updated'
        );

        setTimeout(() => {
          setNotice('');
        }, 1500);
      } catch {
        setNotice(
          'Update failed'
        );
      }
    };

  const initial = (
    user?.name || 'U'
  )
    .charAt(0)
    .toUpperCase();

  return (
    <div className="container profile-wrap">
      <aside
        className="profile-side"
        data-testid="profile-sidebar"
      >
        <div className="profile-side-head">
          EduTech Store
        </div>

        <nav>
          {TABS.map(
            ({
              key,
              label,
              Icon,
            }) => (
              <button
                key={key}
                className={
                  tab === key
                    ? 'active'
                    : ''
                }
                onClick={() =>
                  setTab(key)
                }
                data-testid={`profile-tab-${key}`}
              >
                <Icon
                  size={16}
                />{' '}
                {label}
              </button>
            )
          )}

          {user?.role ===
            'admin' && (
            <button
              onClick={() =>
                navigate(
                  '/admin'
                )
              }
              data-testid="profile-tab-admin"
            >
              <LayoutDashboard size={16} />{' '}
              Admin Dashboard
            </button>
          )}

          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            data-testid="profile-logout"
          >
            <LogOut
              size={16}
            />{' '}
            Logout
          </button>
        </nav>
      </aside>

      <section
        className="profile-main"
        data-testid="profile-main"
      >
        {tab ===
          'profile' && (
          <>
            <div className="profile-header">
              <div className="profile-avatar">
                {initial}
              </div>

              <div>
                <h2 className="profile-name">
                  {
                    user.name
                  }
                </h2>

                <p className="profile-email">
                  {
                    user.email
                  }
                </p>

                <span className="badge badge-purple">
                  {
                    user.branch
                  }{' '}
                  Student
                </span>
              </div>
            </div>

            <h3>
              Personal
              Information
            </h3>

            <div className="info-grid">
              <div className="field">
                <label>
                  Full Name
                </label>

                <input
                  className="input"
                  value={
                    form.name
                  }
                  onChange={(
                    e
                  ) =>
                    setForm(
                      {
                        ...form,
                        name:
                          e
                            .target
                            .value,
                      }
                    )
                  }
                  disabled={
                    !editing
                  }
                  data-testid="profile-name-input"
                />
              </div>

              <div className="field">
                <label>
                  Email
                </label>

                <input
                  className="input"
                  value={
                    user.email
                  }
                  disabled
                />
              </div>

              <div className="field">
                <label>
                  Branch
                </label>

                <select
                  className="select"
                  value={
                    form.branch
                  }
                  onChange={(
                    e
                  ) =>
                    setForm(
                      {
                        ...form,
                        branch:
                          e
                            .target
                            .value,
                      }
                    )
                  }
                  disabled={
                    !editing
                  }
                  data-testid="profile-branch-select"
                >
                  {[
                    'CSE',
                    'ECE',
                    'EEE',
                    'ME',
                    'CE',
                    'AIDS',
                    'IT',
                    'Other',
                  ].map(
                    (
                      b
                    ) => (
                      <option
                        key={
                          b
                        }
                        value={
                          b
                        }
                      >
                        {b}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div className="field">
                <label>
                  Phone
                </label>

                <input
                  className="input"
                  value={
                    form.phone
                  }
                  onChange={(
                    e
                  ) =>
                    setForm(
                      {
                        ...form,
                        phone:
                          e
                            .target
                            .value,
                      }
                    )
                  }
                  disabled={
                    !editing
                  }
                  data-testid="profile-phone-input"
                />
              </div>
            </div>

            <div
              style={{
                marginTop: 18,
                display:
                  'flex',
                gap: 10,
              }}
            >
              {editing ? (
                <>
                  <button
                    className="btn btn-primary"
                    onClick={
                      save
                    }
                    data-testid="profile-save"
                  >
                    Save
                    Changes
                  </button>

                  <button
                    className="btn btn-outline"
                    onClick={() =>
                      setEditing(
                        false
                      )
                    }
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  className="btn btn-primary"
                  onClick={() =>
                    setEditing(
                      true
                    )
                  }
                  data-testid="profile-edit"
                >
                  Edit
                  Profile
                </button>
              )}
            </div>
          </>
        )}

        {tab ===
          'orders' && (
          <>
            <h3>
              My Orders
            </h3>

            {orders.length ===
            0 ? (
              <p
                style={{
                  color:
                    'var(--ink-400)',
                }}
              >
                You
                haven't
                placed
                any
                orders
                yet.
              </p>
            ) : (
              orders.map(
                (
                  o
                ) => (
                  <div
                    key={
                      o._id
                    }
                    className="order-row"
                    data-testid={`order-${o._id}`}
                  >
                    <div className="oid">
                      #
                      {o._id
                        .slice(
                          -6
                        )
                        .toUpperCase()}
                    </div>

                    <div className="items">
                      {
                        o
                          .items
                          .length
                      }{' '}
                      item(s):{' '}
                      {o.items
                        .map(
                          (
                            i
                          ) =>
                            i.name
                        )
                        .slice(
                          0,
                          2
                        )
                        .join(
                          ', '
                        )}
                      {o.items
                        .length >
                      2
                        ? '…'
                        : ''}
                    </div>

                    <div className="amount">
                      ₹
                      {o.total.toLocaleString(
                        'en-IN'
                      )}
                    </div>

                    <span className="badge badge-success">
                      {
                        o.status
                      }
                    </span>
                  </div>
                )
              )
            )}
          </>
        )}

        {tab ===
          'wishlist' && (
          <>
            <h3>
              My Wishlist
            </h3>

            <p
              style={{
                color:
                  'var(--ink-400)',
              }}
            >
              Your saved
              products
              will appear
              here.
            </p>
          </>
        )}
      </section>

      {notice && (
        <div className="notice">
          {notice}
        </div>
      )}
    </div>
  );
}