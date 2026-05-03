import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../context/AuthContext';
import UserCard from '../components/UserCard';
import SendRequestModal from '../components/SendRequestModal';
import { StarRating, getInitials, getGradient } from '../components/UserCard';

const SkillInput = ({ label, skills, setSkills, color }) => {
  const [input, setInput] = useState('');

  const addSkill = () => {
    const trimmed = input.trim();
    if (trimmed && !skills.includes(trimmed) && skills.length < 15) {
      setSkills([...skills, trimmed]);
      setInput('');
    }
  };

  const removeSkill = (skill) => setSkills(skills.filter(s => s !== skill));

  return (
    <div className="skill-input-section">
      <label className="form-label">{label}</label>
      <div className="skill-input-row">
        <input
          className="form-control"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); }}}
          placeholder="Type a skill and press Enter or +"
        />
        <button type="button" className="btn btn-secondary" onClick={addSkill} disabled={!input.trim()}>+</button>
      </div>
      <div className="skill-tags" style={{ marginTop: 10 }}>
        {skills.map((skill, i) => (
          <span key={i} className={`skill-tag ${color}`}>
            {skill}
            <span className="remove-tag" onClick={() => removeSkill(skill)}>✕</span>
          </span>
        ))}
        {skills.length === 0 && <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>No skills added yet</span>}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [matches, setMatches] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Profile edit state
  const [profile, setProfile] = useState({ name: user?.name || '', bio: user?.bio || '', location: user?.location || '' });
  const [teachSkills, setTeachSkills] = useState(user?.teachSkills || []);
  const [learnSkills, setLearnSkills] = useState(user?.learnSkills || []);

  const fetchMatches = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/users/matches');
      setMatches(data.users || []);
    } catch (e) {}
    setLoading(false);
  }, []);

  const fetchReviews = useCallback(async () => {
    if (!user?._id) return;
    try {
      const { data } = await api.get(`/reviews/user/${user._id}`);
      setReviews(data.reviews || []);
    } catch (e) {}
  }, [user?._id]);

  useEffect(() => {
    if (activeTab === 'matches') fetchMatches();
    if (activeTab === 'reviews') fetchReviews();
  }, [activeTab, fetchMatches, fetchReviews]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const { data } = await api.put('/users/profile', profile);
      updateUser(data.user);
      setMessage('Profile updated successfully!');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleSaveSkills = async () => {
    setSaving(true);
    setMessage('');
    try {
      const { data } = await api.put('/users/skills', { teachSkills, learnSkills });
      updateUser(data.user);
      setMessage('Skills updated successfully!');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to update skills.');
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className="dashboard-page">
      <div className="container">
        {/* Header */}
        <div className="dashboard-header">
          <div className="dashboard-user">
            <div className="avatar dashboard-avatar" style={{ background: getGradient(user?.name) }}>
              {getInitials(user?.name)}
            </div>
            <div>
              <h1>{user?.name}</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 6 }}>
                <StarRating rating={user?.averageRating || 0} size={16} />
                <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>
                  {user?.averageRating > 0 ? `${user.averageRating.toFixed(1)} avg · ${user?.totalReviews || 0} reviews` : 'No reviews yet'}
                </span>
              </div>
              {user?.location && <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>📍 {user.location}</p>}
            </div>
          </div>
          <div className="dashboard-skill-pills">
            <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Teaching:</span>
            {user?.teachSkills?.slice(0, 3).map((s, i) => <span key={i} className="skill-tag skill-tag-teach">{s}</span>)}
            {(user?.teachSkills?.length || 0) > 3 && <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>+{user.teachSkills.length - 3} more</span>}
          </div>
        </div>

        {message && (
          <div className={`alert ${message.includes('success') || message.includes('updated') ? 'alert-success' : 'alert-error'}`}>
            {message}
          </div>
        )}

        {/* Tabs */}
        <div className="tabs">
          {[
            { key: 'profile', label: '👤 Profile' },
            { key: 'skills', label: '🎯 My Skills' },
            { key: 'matches', label: '🔥 Matches' },
            { key: 'reviews', label: '⭐ Reviews' },
          ].map(t => (
            <button key={t.key} className={`tab-btn ${activeTab === t.key ? 'active' : ''}`} onClick={() => setActiveTab(t.key)}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="tab-content animate-in">
            <div className="two-col">
              <div className="card">
                <h2 style={{ marginBottom: 24, fontSize: 20 }}>Edit Profile</h2>
                <form onSubmit={handleSaveProfile}>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input className="form-control" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} placeholder="Your name" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Location</label>
                    <input className="form-control" value={profile.location} onChange={e => setProfile({...profile, location: e.target.value})} placeholder="City, Country" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Bio</label>
                    <textarea className="form-control" value={profile.bio} onChange={e => setProfile({...profile, bio: e.target.value})} placeholder="Tell others about yourself..." rows={4} maxLength={300} />
                    <p style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'right', marginTop: 4 }}>{profile.bio.length}/300</p>
                  </div>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? '⟳ Saving...' : 'Save Profile'}
                  </button>
                </form>
              </div>

              <div className="card profile-stats-card">
                <h2 style={{ marginBottom: 20, fontSize: 20 }}>Your Stats</h2>
                <div className="stat-grid">
                  <div className="stat-item">
                    <span className="stat-big">{user?.teachSkills?.length || 0}</span>
                    <span className="stat-label-sm">Skills Teaching</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-big">{user?.learnSkills?.length || 0}</span>
                    <span className="stat-label-sm">Skills Learning</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-big">{user?.averageRating?.toFixed(1) || '—'}</span>
                    <span className="stat-label-sm">Avg Rating</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-big">{user?.totalReviews || 0}</span>
                    <span className="stat-label-sm">Reviews</span>
                  </div>
                </div>

                <div style={{ marginTop: 24 }}>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 }}>Member since</p>
                  <p style={{ fontWeight: 600 }}>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently'}</p>
                </div>

                {user?.bio && (
                  <div style={{ marginTop: 24, padding: '16px', background: 'var(--bg-3)', borderRadius: 10 }}>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)', fontStyle: 'italic' }}>"{user.bio}"</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Skills Tab */}
        {activeTab === 'skills' && (
          <div className="tab-content animate-in">
            <div className="card" style={{ maxWidth: 700 }}>
              <h2 style={{ marginBottom: 8, fontSize: 20 }}>Manage Your Skills</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 28 }}>Add skills you can teach and skills you want to learn to find great matches.</p>

              <SkillInput label="Skills I Can Teach 🎓" skills={teachSkills} setSkills={setTeachSkills} color="skill-tag-teach" />
              <div style={{ height: 24 }} />
              <SkillInput label="Skills I Want to Learn 📚" skills={learnSkills} setSkills={setLearnSkills} color="skill-tag-learn" />

              <button className="btn btn-primary" style={{ marginTop: 28 }} onClick={handleSaveSkills} disabled={saving}>
                {saving ? '⟳ Saving...' : 'Save Skills'}
              </button>
            </div>
          </div>
        )}

        {/* Matches Tab */}
        {activeTab === 'matches' && (
          <div className="tab-content animate-in">
            <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <h2 style={{ fontSize: 22 }}>Skill Matches</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 4 }}>Users with complementary skills to yours</p>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={fetchMatches}>↻ Refresh</button>
            </div>
            {loading ? (
              <div className="loading-center"><div className="spinner" /><p>Finding your matches...</p></div>
            ) : matches.length === 0 ? (
              <div className="empty-state card">
                <span className="empty-icon">🎯</span>
                <h3>No matches found yet</h3>
                <p>Add your teach and learn skills to discover great matches!</p>
                <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => setActiveTab('skills')}>Add Skills</button>
              </div>
            ) : (
              <div className="grid grid-2">
                {matches.map(u => (
                  <UserCard key={u._id} user={u} matchScore={u.matchScore} onSendRequest={setSelectedUser} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className="tab-content animate-in">
            <h2 style={{ marginBottom: 20, fontSize: 22 }}>Your Reviews</h2>
            {reviews.length === 0 ? (
              <div className="empty-state card">
                <span className="empty-icon">⭐</span>
                <h3>No reviews yet</h3>
                <p>Complete skill exchanges to receive your first review!</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {reviews.map(r => (
                  <div key={r._id} className="card review-card">
                    <div className="review-header">
                      <div className="avatar" style={{ width: 40, height: 40, fontSize: 14, background: getGradient(r.reviewerId?.name) }}>
                        {getInitials(r.reviewerId?.name)}
                      </div>
                      <div>
                        <p className="reviewer-name">{r.reviewerId?.name}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <StarRating rating={r.rating} />
                          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{new Date(r.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    {r.skillExchanged && <span className="skill-tag skill-tag-teach" style={{ marginTop: 10, display: 'inline-flex' }}>🔄 {r.skillExchanged}</span>}
                    <p className="review-comment">"{r.comment}"</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {selectedUser && (
        <SendRequestModal
          targetUser={selectedUser}
          onClose={() => setSelectedUser(null)}
          onSuccess={() => setMessage('Request sent successfully!')}
        />
      )}

      <style>{`
        .dashboard-page { padding: 40px 0 80px; }
        .dashboard-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 20px;
          margin-bottom: 36px;
          padding: 32px;
          background: var(--card);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg);
        }
        .dashboard-user { display: flex; align-items: center; gap: 20px; }
        .dashboard-avatar { width: 72px; height: 72px; font-size: 26px; }
        .dashboard-user h1 { font-size: 28px; }
        .dashboard-skill-pills { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        .tab-content { animation: fadeIn 0.3s ease; }
        .two-col { display: grid; grid-template-columns: 1.2fr 1fr; gap: 24px; }
        .stat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .stat-item { padding: 16px; background: var(--bg-3); border-radius: 12px; text-align: center; }
        .stat-big { display: block; font-family: 'Clash Display', sans-serif; font-size: 32px; font-weight: 700; background: linear-gradient(135deg, var(--primary), var(--accent)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .stat-label-sm { font-size: 12px; color: var(--text-muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
        .skill-input-row { display: flex; gap: 8px; }
        .skill-input-section { margin-bottom: 8px; }
        .review-card { transition: var(--transition); }
        .review-header { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; }
        .reviewer-name { font-weight: 600; font-size: 15px; margin-bottom: 4px; }
        .review-comment { font-size: 14px; color: var(--text-muted); line-height: 1.6; margin-top: 10px; font-style: italic; }
        @media (max-width: 768px) {
          .two-col { grid-template-columns: 1fr; }
          .dashboard-header { flex-direction: column; align-items: flex-start; }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
