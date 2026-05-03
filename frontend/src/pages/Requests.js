import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../context/AuthContext';
import { useAuth } from '../context/AuthContext';
import { StarRating, getInitials, getGradient } from '../components/UserCard';

const STATUS_COLORS = {
  pending: 'badge-warning',
  accepted: 'badge-success',
  rejected: 'badge-error',
  completed: 'badge-primary',
};

const ReviewModal = ({ request, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const otherUser = request.senderId?._id === user?._id ? request.receiverId : request.senderId;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim() || comment.trim().length < 10) { setError('Comment must be at least 10 characters.'); return; }
    setLoading(true);
    try {
      await api.post('/reviews', {
        receiverId: otherUser._id,
        requestId: request._id,
        rating,
        comment,
        skillExchanged: request.senderId?._id === user?._id ? request.senderSkill : request.receiverSkill
      });
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target.classList.contains('modal-overlay') && onClose()}>
      <div className="modal-box animate-in" style={{ maxWidth: 460 }}>
        <div className="modal-header">
          <h2>Rate Your Exchange</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <p style={{ color: 'var(--text-muted)', marginBottom: 24, fontSize: 14 }}>
          How was your skill exchange with <strong style={{ color: 'var(--text)' }}>{otherUser?.name}</strong>?
        </p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Your Rating</label>
            <div className="star-picker">
              {[1, 2, 3, 4, 5].map(s => (
                <button key={s} type="button" className={`star-btn ${s <= rating ? 'active' : ''}`} onClick={() => setRating(s)}>★</button>
              ))}
              <span style={{ marginLeft: 8, fontSize: 13, color: 'var(--text-muted)' }}>
                {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating]}
              </span>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Your Review</label>
            <textarea className="form-control" value={comment} onChange={e => setComment(e.target.value)} placeholder="Share your experience about this skill exchange..." rows={4} maxLength={500} required />
            <p style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'right', marginTop: 4 }}>{comment.length}/500</p>
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? '⟳ Submitting...' : 'Submit Review'}</button>
          </div>
        </form>

        <style>{`
          .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 24px; }
          .modal-box { background: var(--card); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 32px; width: 100%; box-shadow: var(--shadow-lg); }
          .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
          .modal-header h2 { font-size: 22px; }
          .modal-close { background: transparent; border: none; color: var(--text-muted); font-size: 18px; cursor: pointer; padding: 4px 8px; border-radius: 6px; }
          .modal-close:hover { background: var(--bg-3); color: var(--text); }
          .star-picker { display: flex; align-items: center; gap: 4px; }
          .star-btn { background: transparent; border: none; font-size: 32px; cursor: pointer; color: var(--border); transition: var(--transition); padding: 0; line-height: 1; }
          .star-btn.active, .star-btn:hover { color: var(--warning); }
        `}</style>
      </div>
    </div>
  );
};

const RequestCard = ({ request, type, onAction, onReview }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState('');
  const otherUser = type === 'sent' ? request.receiverId : request.senderId;

  const handle = async (action) => {
    setLoading(action);
    try { await onAction(request._id, action); } finally { setLoading(''); }
  };

  const canReview = request.status === 'completed';

  return (
    <div className="request-card card">
      <div className="request-card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="avatar" style={{ width: 44, height: 44, fontSize: 15, background: getGradient(otherUser?.name) }}>
            {getInitials(otherUser?.name)}
          </div>
          <div>
            <p className="request-user-name">{otherUser?.name}</p>
            <p className="request-date">{new Date(request.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
          </div>
        </div>
        <span className={`badge ${STATUS_COLORS[request.status]}`}>{request.status}</span>
      </div>

      <div className="swap-summary">
        <div className="swap-item">
          <span className="swap-direction">You teach</span>
          <span className="swap-skill skill-tag-teach">{request.senderSkill}</span>
        </div>
        <div className="swap-arrow-icon">⟷</div>
        <div className="swap-item">
          <span className="swap-direction">You learn</span>
          <span className="swap-skill skill-tag-learn">{request.receiverSkill}</span>
        </div>
      </div>

      {request.message && (
        <p className="request-message">"{request.message}"</p>
      )}

      <div className="request-actions">
        {type === 'received' && request.status === 'pending' && (
          <>
            <button className="btn btn-accent btn-sm" onClick={() => handle('accept')} disabled={!!loading}>
              {loading === 'accept' ? '⟳' : '✓ Accept'}
            </button>
            <button className="btn btn-danger btn-sm" onClick={() => handle('reject')} disabled={!!loading}>
              {loading === 'reject' ? '⟳' : '✕ Decline'}
            </button>
          </>
        )}
        {request.status === 'accepted' && (
          <button className="btn btn-secondary btn-sm" onClick={() => handle('complete')} disabled={!!loading}>
            {loading === 'complete' ? '⟳' : '🎉 Mark Complete'}
          </button>
        )}
        {canReview && (
          <button className="btn btn-primary btn-sm" onClick={() => onReview(request)}>
            ⭐ Leave Review
          </button>
        )}
      </div>
    </div>
  );
};

const Requests = () => {
  const [sent, setSent] = useState([]);
  const [received, setReceived] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('received');
  const [reviewRequest, setReviewRequest] = useState(null);
  const [message, setMessage] = useState('');

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/requests/all');
      setSent(data.sent || []);
      setReceived(data.received || []);
    } catch (e) {}
    setLoading(false);
  }, []);

  useEffect(() => { fetchRequests(); }, [fetchRequests]);

  const handleAction = async (id, action) => {
    try {
      await api.put(`/requests/${id}/${action}`);
      setMessage(`Request ${action}ed!`);
      setTimeout(() => setMessage(''), 3000);
      fetchRequests();
    } catch (err) {
      setMessage(err.response?.data?.message || `Failed to ${action} request.`);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const pendingReceived = received.filter(r => r.status === 'pending').length;

  return (
    <div className="requests-page">
      <div className="container">
        <div style={{ marginBottom: 36 }}>
          <h1 style={{ fontSize: 36, marginBottom: 8 }}>Skill Requests</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage your incoming and outgoing skill exchange requests.</p>
        </div>

        {message && <div className={`alert ${message.includes('!') ? 'alert-success' : 'alert-error'}`} style={{ marginBottom: 24 }}>{message}</div>}

        <div className="tabs">
          <button className={`tab-btn ${activeTab === 'received' ? 'active' : ''}`} onClick={() => setActiveTab('received')}>
            📨 Received {pendingReceived > 0 && <span className="badge-count">{pendingReceived}</span>}
          </button>
          <button className={`tab-btn ${activeTab === 'sent' ? 'active' : ''}`} onClick={() => setActiveTab('sent')}>
            📤 Sent ({sent.length})
          </button>
        </div>

        {loading ? (
          <div className="loading-center"><div className="spinner" /><p>Loading requests...</p></div>
        ) : activeTab === 'received' ? (
          received.length === 0 ? (
            <div className="empty-state card">
              <span className="empty-icon">📨</span>
              <h3>No requests received</h3>
              <p>When others send you skill swap requests, they'll appear here.</p>
            </div>
          ) : (
            <div className="requests-grid">
              {received.map(r => <RequestCard key={r._id} request={r} type="received" onAction={handleAction} onReview={setReviewRequest} />)}
            </div>
          )
        ) : (
          sent.length === 0 ? (
            <div className="empty-state card">
              <span className="empty-icon">📤</span>
              <h3>No requests sent</h3>
              <p>Browse users and send skill swap requests to get started!</p>
            </div>
          ) : (
            <div className="requests-grid">
              {sent.map(r => <RequestCard key={r._id} request={r} type="sent" onAction={handleAction} onReview={setReviewRequest} />)}
            </div>
          )
        )}
      </div>

      {reviewRequest && (
        <ReviewModal
          request={reviewRequest}
          onClose={() => setReviewRequest(null)}
          onSuccess={() => { setMessage('Review submitted! ✓'); fetchRequests(); }}
        />
      )}

      <style>{`
        .requests-page { padding: 48px 0 80px; }
        .requests-grid { display: flex; flex-direction: column; gap: 16px; }
        .request-card { transition: var(--transition); }
        .request-card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 12px; }
        .request-user-name { font-weight: 700; font-size: 15px; margin-bottom: 2px; }
        .request-date { font-size: 12px; color: var(--text-muted); }
        .swap-summary { display: flex; align-items: center; gap: 16px; padding: 16px; background: var(--bg-3); border-radius: 12px; margin-bottom: 12px; flex-wrap: wrap; }
        .swap-item { display: flex; flex-direction: column; gap: 6px; flex: 1; min-width: 100px; }
        .swap-direction { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text-muted); }
        .swap-skill { padding: 6px 12px; border-radius: 20px; font-size: 13px; font-weight: 600; display: inline-flex; }
        .swap-arrow-icon { font-size: 20px; color: var(--primary); flex-shrink: 0; }
        .request-message { font-size: 13px; color: var(--text-muted); font-style: italic; margin-bottom: 12px; padding: 10px 14px; background: var(--bg-3); border-radius: 8px; border-left: 3px solid var(--primary); }
        .request-actions { display: flex; gap: 10px; flex-wrap: wrap; }
        .badge-count { display: inline-flex; align-items: center; justify-content: center; background: var(--error); color: white; border-radius: 10px; font-size: 11px; font-weight: 700; min-width: 18px; height: 18px; padding: 0 5px; margin-left: 4px; }
      `}</style>
    </div>
  );
};

export default Requests;
