import React, { useState, useEffect } from 'react';
import { api } from '../context/AuthContext';
import UserCard from '../components/UserCard';
import SendRequestModal from '../components/SendRequestModal';

const POPULAR_SKILLS = ['JavaScript', 'Python', 'React', 'Photoshop', 'Guitar', 'Spanish', 'Cooking', 'Excel', 'Drawing', 'Yoga', 'Photography', 'Writing'];

const Search = () => {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [total, setTotal] = useState(0);

  // Load all users on mount
  useEffect(() => { fetchUsers(''); }, []);

  const fetchUsers = async (skill) => {
    setLoading(true);
    try {
      const params = skill ? `?skill=${encodeURIComponent(skill)}` : '';
      const { data } = await api.get(`/users/search${params}`);
      setUsers(data.users || []);
      setTotal(data.total || 0);
      setSearched(!!skill);
    } catch (e) {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers(query.trim());
  };

  const handleQuickSearch = (skill) => {
    setQuery(skill);
    fetchUsers(skill);
  };

  const handleClear = () => {
    setQuery('');
    fetchUsers('');
  };

  return (
    <div className="search-page">
      <div className="container">
        {/* Hero */}
        <div className="search-hero">
          <h1>Find Your <span className="gradient-text">Skill Match</span></h1>
          <p>Search for users who can teach you the skills you want to learn.</p>

          <form className="search-form" onSubmit={handleSearch}>
            <div className="search-input-wrapper">
              <span className="search-icon">🔍</span>
              <input
                className="search-input"
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search by skill (e.g. Python, Guitar, Design...)"
              />
              {query && <button type="button" className="search-clear" onClick={handleClear}>✕</button>}
            </div>
            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
              {loading ? '⟳' : 'Search'}
            </button>
          </form>

          <div className="popular-skills">
            <span className="popular-label">Popular:</span>
            {POPULAR_SKILLS.map(skill => (
              <button key={skill} className={`popular-tag ${query === skill ? 'active' : ''}`} onClick={() => handleQuickSearch(skill)}>
                {skill}
              </button>
            ))}
          </div>
        </div>

        {successMsg && <div className="alert alert-success" style={{ marginBottom: 24 }}>{successMsg}</div>}

        {/* Results */}
        <div className="results-section">
          <div className="results-header">
            <p className="results-count">
              {loading ? 'Searching...' : (
                searched
                  ? `${total} user${total !== 1 ? 's' : ''} can teach "${query}"`
                  : `${total} member${total !== 1 ? 's' : ''} on SkillSwap`
              )}
            </p>
            {searched && (
              <button className="btn btn-secondary btn-sm" onClick={handleClear}>Show All</button>
            )}
          </div>

          {loading ? (
            <div className="loading-center"><div className="spinner" /><p>Finding skilled people...</p></div>
          ) : users.length === 0 ? (
            <div className="empty-state card">
              <span className="empty-icon">🔍</span>
              <h3>No users found</h3>
              <p>{searched ? `Nobody is currently teaching "${query}". Try a different skill!` : 'No other users yet. Invite friends!'}</p>
            </div>
          ) : (
            <div className="grid grid-2">
              {users.map(u => (
                <UserCard key={u._id} user={u} onSendRequest={setSelectedUser} />
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedUser && (
        <SendRequestModal
          targetUser={selectedUser}
          onClose={() => setSelectedUser(null)}
          onSuccess={() => { setSuccessMsg('Request sent successfully! ✓'); setTimeout(() => setSuccessMsg(''), 4000); }}
        />
      )}

      <style>{`
        .search-page { padding: 48px 0 80px; }
        .search-hero { text-align: center; margin-bottom: 48px; }
        .search-hero h1 { font-size: clamp(32px, 5vw, 52px); margin-bottom: 12px; }
        .search-hero > p { font-size: 16px; color: var(--text-muted); margin-bottom: 32px; }
        .gradient-text { background: linear-gradient(135deg, var(--primary), var(--accent)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .search-form { display: flex; gap: 12px; max-width: 640px; margin: 0 auto 24px; }
        .search-input-wrapper {
          flex: 1;
          display: flex;
          align-items: center;
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          padding: 0 16px;
          gap: 10px;
          transition: var(--transition);
        }
        .search-input-wrapper:focus-within { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(108,71,255,0.15); }
        .search-icon { font-size: 16px; flex-shrink: 0; }
        .search-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: var(--text);
          font-family: 'Sora', sans-serif;
          font-size: 15px;
          padding: 14px 0;
        }
        .search-input::placeholder { color: var(--text-muted); }
        .search-clear { background: transparent; border: none; color: var(--text-muted); cursor: pointer; font-size: 14px; padding: 4px; }
        .search-clear:hover { color: var(--text); }
        .popular-skills { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; align-items: center; }
        .popular-label { font-size: 13px; color: var(--text-muted); font-weight: 600; }
        .popular-tag {
          padding: 6px 14px;
          background: var(--bg-3);
          border: 1px solid var(--border-light);
          border-radius: 20px;
          font-size: 13px;
          color: var(--text-muted);
          cursor: pointer;
          font-family: 'Sora', sans-serif;
          transition: var(--transition);
        }
        .popular-tag:hover, .popular-tag.active {
          background: rgba(108,71,255,0.15);
          border-color: var(--primary);
          color: var(--primary-light);
        }
        .results-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
        .results-count { font-size: 14px; color: var(--text-muted); font-weight: 600; }
        @media (max-width: 560px) { .search-form { flex-direction: column; } }
      `}</style>
    </div>
  );
};

export default Search;
