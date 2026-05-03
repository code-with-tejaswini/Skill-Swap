import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const getInitials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">⟡</span>
          <span className="brand-text">SkillSwap</span>
        </Link>

        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          {user ? (
            <>
              <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <Link to="/search" className={`nav-link ${isActive('/search') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Find Skills</Link>
              <Link to="/requests" className={`nav-link ${isActive('/requests') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Requests</Link>
            </>
          ) : (
            <>
              <a href="#features" className="nav-link" onClick={() => setMenuOpen(false)}>Features</a>
              <a href="#how-it-works" className="nav-link" onClick={() => setMenuOpen(false)}>How It Works</a>
            </>
          )}
        </div>

        <div className="navbar-actions">
          {user ? (
            <div className="user-menu">
              <div className="user-trigger" onClick={() => setMenuOpen(!menuOpen)}>
                <div className="avatar" style={{ width: 38, height: 38, fontSize: 14 }}>
                  {getInitials(user.name)}
                </div>
                <span className="user-name-nav">{user.name.split(' ')[0]}</span>
                <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>▾</span>
              </div>
              {menuOpen && (
                <div className="dropdown">
                  <Link to="/dashboard" className="dropdown-item" onClick={() => setMenuOpen(false)}>👤 Profile</Link>
                  <Link to="/search" className="dropdown-item" onClick={() => setMenuOpen(false)}>🔍 Find Skills</Link>
                  <Link to="/requests" className="dropdown-item" onClick={() => setMenuOpen(false)}>📨 Requests</Link>
                  <div className="dropdown-divider" />
                  <button className="dropdown-item danger" onClick={handleLogout}>🚪 Logout</button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-btns">
              <Link to="/login" className="btn btn-secondary btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .navbar {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(10, 10, 20, 0.85);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border-light);
        }
        .navbar-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 68px;
          gap: 24px;
        }
        .navbar-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: 'Clash Display', sans-serif;
          font-size: 22px;
          font-weight: 700;
          color: var(--text);
        }
        .brand-icon {
          font-size: 24px;
          background: linear-gradient(135deg, var(--primary), var(--accent));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .navbar-links {
          display: flex;
          align-items: center;
          gap: 4px;
          flex: 1;
          justify-content: center;
        }
        .nav-link {
          padding: 8px 14px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          color: var(--text-muted);
          transition: var(--transition);
        }
        .nav-link:hover, .nav-link.active {
          color: var(--text);
          background: var(--card);
        }
        .nav-link.active { color: var(--primary-light); }
        .navbar-actions { display: flex; align-items: center; gap: 12px; }
        .auth-btns { display: flex; gap: 10px; }
        .user-menu { position: relative; }
        .user-trigger {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 10px;
          transition: var(--transition);
        }
        .user-trigger:hover { background: var(--card); }
        .user-name-nav { font-size: 14px; font-weight: 600; }
        .dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 8px;
          min-width: 180px;
          box-shadow: var(--shadow-lg);
          animation: fadeIn 0.15s ease;
        }
        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 8px;
          width: 100%;
          padding: 10px 12px;
          border-radius: 8px;
          font-size: 14px;
          color: var(--text-muted);
          background: transparent;
          border: none;
          cursor: pointer;
          font-family: 'Sora', sans-serif;
          transition: var(--transition);
          text-align: left;
        }
        .dropdown-item:hover { background: var(--bg-3); color: var(--text); }
        .dropdown-item.danger:hover { color: var(--error); background: rgba(255, 107, 107, 0.1); }
        .dropdown-divider { height: 1px; background: var(--border-light); margin: 6px 0; }
        @media (max-width: 640px) {
          .navbar-links { display: none; }
          .user-name-nav { display: none; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
