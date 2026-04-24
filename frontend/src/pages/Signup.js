import React, {
  useState,
} from 'react';

import {
  Link,
  useNavigate,
} from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

const BRANCHES = [
  'CSE',
  'ECE',
  'EEE',
  'ME',
  'CE',
  'AIDS',
  'IT',
  'Other',
];

export default function Signup() {
  const { signup } =
    useAuth();

  const navigate =
    useNavigate();

  const [form, setForm] =
    useState({
      name: '',
      email: '',
      password: '',
      branch: 'CSE',
    });

  const [err, setErr] =
    useState('');

  const [loading, setLoading] =
    useState(false);

  const set =
    (key) => (e) =>
      setForm({
        ...form,
        [key]:
          e.target.value,
      });

  const submit =
    async (e) => {
      e.preventDefault();

      setErr('');
      setLoading(true);

      try {
        await signup(form);
        navigate('/');
      } catch (e2) {
        setErr(
          e2.response?.data
            ?.message ||
            'Signup failed'
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="auth-wrap">
      <div
        className="auth-card"
        data-testid="signup-card"
      >
        <div className="auth-logo">
          EduTech Store
        </div>

        <h2>
          Create your
          account
        </h2>

        <p className="auth-sub">
          Get personalized
          picks for your
          branch.
        </p>

        {err && (
          <div
            className="alert-error"
            data-testid="signup-error"
          >
            {err}
          </div>
        )}

        <form
          onSubmit={
            submit
          }
        >
          <div className="field">
            <label>
              Full Name
            </label>

            <input
              className="input"
              value={
                form.name
              }
              onChange={set(
                'name'
              )}
              required
              data-testid="signup-name-input"
            />
          </div>

          <div className="field">
            <label>
              Email
            </label>

            <input
              className="input"
              type="email"
              value={
                form.email
              }
              onChange={set(
                'email'
              )}
              required
              data-testid="signup-email-input"
            />
          </div>

          <div className="field">
            <label>
              Password
            </label>

            <input
              className="input"
              type="password"
              value={
                form.password
              }
              onChange={set(
                'password'
              )}
              required
              minLength={6}
              data-testid="signup-password-input"
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
              onChange={set(
                'branch'
              )}
              data-testid="signup-branch-select"
            >
              {BRANCHES.map(
                (
                  b
                ) => (
                  <option
                    key={b}
                    value={b}
                  >
                    {b}
                  </option>
                )
              )}
            </select>
          </div>

          <button
            className="btn btn-primary btn-block"
            disabled={
              loading
            }
            data-testid="signup-submit-button"
          >
            {loading
              ? 'Creating...'
              : 'Sign Up'}
          </button>
        </form>

        <div className="auth-foot">
          Already have
          an account?{' '}
          <Link
            to="/login"
            data-testid="signup-login-link"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}