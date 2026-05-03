import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', bio: '', location: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    else if (form.name.trim().length < 2) errs.name = 'Name must be at least 2 characters';
    if (!form.email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (!form.confirmPassword) errs.confirmPassword = 'Please confirm your password';
    else if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
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
      await register({ name: form.name, email: form.email, password: form.password, bio: form.bio, location: form.location });
      navigate('/dashboard');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const strength = form.password.length === 0 ? 0 : form.password.length < 6 ? 1 : form.password.length < 10 ? 2 : 3;
  const strengthLabels = ['', 'Weak', 'Good', 'Strong'];
  const strengthColors = ['', '#ff6b6b', '#ffd93d', '#00d4aa'];

  return (
    <div className="auth-page">
      <div className="auth-bg-blob blob-1" />
      <div className="auth-bg-blob blob-2" />

      <div className="auth-box animate-in">
        <div className="auth-logo">
          <span className="brand-icon-lg">⟡</span>
          <span>SkillSwap</span>
        </div>
        <h1 className="auth-title">Create account</h1>
        <p className="auth-subtitle">Start exchanging skills with the community</p>

        {serverError && <div className="alert alert-error">{serverError}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input className={`form-control ${errors.name ? 'input-error' : ''}`} type="text" name="name" value={form.name} onChange={handleChange} placeholder="Jane Doe" />
              {errors.name && <p className="form-error">{errors.name}</p>}
            </div>
            <div className="form-group">
              <label className="form-label">Location</label>
              <input className="form-control" type="text" name="location" value={form.location} onChange={handleChange} placeholder="City, Country" />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <input className={`form-control ${errors.email ? 'input-error' : ''}`} type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" />
            {errors.email && <p className="form-error">{errors.email}</p>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Password *</label>
              <input className={`form-control ${errors.password ? 'input-error' : ''}`} type="password" name="password" value={form.password} onChange={handleChange} placeholder="Min. 6 characters" />
              {form.password && (
                <div className="password-strength">
                  <div className="strength-bar">
                    {[1,2,3].map(l => (
                      <div key={l} className="strength-seg" style={{ background: strength >= l ? strengthColors[strength] : 'var(--border-light)' }} />
                    ))}
                  </div>
                  <span style={{ color: strengthColors[strength], fontSize: 11, fontWeight: 600 }}>{strengthLabels[strength]}</span>
                </div>
              )}
              {errors.password && <p className="form-error">{errors.password}</p>}
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password *</label>
              <input className={`form-control ${errors.confirmPassword ? 'input-error' : ''}`} type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="Repeat password" />
              {errors.confirmPassword && <p className="form-error">{errors.confirmPassword}</p>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Bio <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span></label>
            <textarea className="form-control" name="bio" value={form.bio} onChange={handleChange} placeholder="Tell others a bit about yourself and your experience..." rows={3} maxLength={300} />
            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4, textAlign: 'right' }}>{form.bio.length}/300</p>
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
            {loading ? '⟳ Creating account...' : 'Create Account →'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
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
        .auth-bg-blob { position: absolute; border-radius: 50%; filter: blur(100px); pointer-events: none; }
        .blob-1 { width: 500px; height: 500px; background: rgba(108,71,255,0.12); top: -100px; left: -150px; }
        .blob-2 { width: 400px; height: 400px; background: rgba(0,212,170,0.08); bottom: -100px; right: -100px; }
        .auth-box {
          background: var(--card);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg);
          padding: 48px;
          width: 100%;
          max-width: 580px;
          position: relative;
          z-index: 1;
          box-shadow: var(--shadow-lg);
        }
        .auth-logo { display: flex; align-items: center; gap: 10px; font-family: 'Clash Display', sans-serif; font-size: 20px; font-weight: 700; margin-bottom: 32px; color: var(--text-muted); }
        .brand-icon-lg { font-size: 28px; background: linear-gradient(135deg, var(--primary), var(--accent)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .auth-title { font-size: 32px; margin-bottom: 8px; }
        .auth-subtitle { color: var(--text-muted); margin-bottom: 32px; font-size: 15px; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .input-error { border-color: var(--error) !important; }
        .password-strength { display: flex; align-items: center; gap: 8px; margin-top: 8px; }
        .strength-bar { display: flex; gap: 4px; flex: 1; }
        .strength-seg { height: 4px; flex: 1; border-radius: 2px; transition: background 0.3s; }
        .auth-switch { text-align: center; margin-top: 24px; font-size: 14px; color: var(--text-muted); }
        .auth-switch a { color: var(--primary-light); font-weight: 600; }
        .auth-switch a:hover { text-decoration: underline; }
        @media (max-width: 520px) { .auth-box { padding: 32px 20px; } .form-row { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
};

export default Register;
