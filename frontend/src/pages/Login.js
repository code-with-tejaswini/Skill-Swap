import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Password must be at least 6 characters';
    return errs;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
    setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg-blob blob-1" />
      <div className="auth-bg-blob blob-2" />

      <div className="auth-box animate-in">
        <div className="auth-logo">
          <span className="brand-icon-lg">⟡</span>
          <span>SkillSwap</span>
        </div>
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">Sign in to continue your skill journey</p>

        {serverError && <div className="alert alert-error">{serverError}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              className={`form-control ${errors.email ? 'input-error' : ''}`}
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              autoComplete="email"
            />
            {errors.email && <p className="form-error">{errors.email}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className={`form-control ${errors.password ? 'input-error' : ''}`}
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              autoComplete="current-password"
            />
            {errors.password && <p className="form-error">{errors.password}</p>}
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
            {loading ? '⟳ Signing in...' : 'Sign In →'}
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account? <Link to="/register">Create one free</Link>
        </p>

        {/* Demo hint */}
        <div className="demo-hint">
          <strong>Demo:</strong> Register a new account to explore all features.
        </div>
      </div>

      <style>{`
        .auth-page {
          min-height: calc(100vh - 68px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 24px;
          position: relative;
          overflow: hidden;
        }
        .auth-bg-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          pointer-events: none;
        }
        .blob-1 { width: 500px; height: 500px; background: rgba(108,71,255,0.12); top: -100px; left: -150px; }
        .blob-2 { width: 400px; height: 400px; background: rgba(0,212,170,0.08); bottom: -100px; right: -100px; }
        .auth-box {
          background: var(--card);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg);
          padding: 48px;
          width: 100%;
          max-width: 460px;
          position: relative;
          z-index: 1;
          box-shadow: var(--shadow-lg);
        }
        .auth-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: 'Clash Display', sans-serif;
          font-size: 20px;
          font-weight: 700;
          margin-bottom: 32px;
          color: var(--text-muted);
        }
        .brand-icon-lg {
          font-size: 28px;
          background: linear-gradient(135deg, var(--primary), var(--accent));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .auth-title { font-size: 32px; margin-bottom: 8px; }
        .auth-subtitle { color: var(--text-muted); margin-bottom: 32px; font-size: 15px; }
        .input-error { border-color: var(--error) !important; }
        .auth-switch { text-align: center; margin-top: 24px; font-size: 14px; color: var(--text-muted); }
        .auth-switch a { color: var(--primary-light); font-weight: 600; }
        .auth-switch a:hover { text-decoration: underline; }
        .demo-hint {
          margin-top: 20px;
          padding: 12px 16px;
          background: var(--bg-3);
          border-radius: 10px;
          font-size: 13px;
          color: var(--text-muted);
          text-align: center;
        }
        @media (max-width: 480px) { .auth-box { padding: 32px 24px; } }
      `}</style>
    </div>
  );
};

export default Login;
