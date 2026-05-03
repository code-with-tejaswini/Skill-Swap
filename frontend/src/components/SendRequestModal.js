import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../context/AuthContext';

const SendRequestModal = ({ targetUser, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [senderSkill, setSenderSkill] = useState('');
  const [receiverSkill, setReceiverSkill] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!senderSkill || !receiverSkill) {
      setError('Please select skills for both sides of the exchange.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await api.post('/requests', {
        receiverId: targetUser._id,
        senderSkill,
        receiverSkill,
        message
      });
      onSuccess && onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target.classList.contains('modal-overlay') && onClose()}>
      <div className="modal-box animate-in">
        <div className="modal-header">
          <h2>Request Skill Swap</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-user-preview">
          <span>Swapping with</span>
          <strong>{targetUser.name}</strong>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="swap-form">
            <div className="swap-side">
              <div className="swap-label">You'll Teach</div>
              {user?.teachSkills?.length > 0 ? (
                <select
                  className="form-control"
                  value={senderSkill}
                  onChange={(e) => setSenderSkill(e.target.value)}
                  required
                >
                  <option value="">Select your skill...</option>
                  {user.teachSkills.map((skill, i) => (
                    <option key={i} value={skill}>{skill}</option>
                  ))}
                </select>
              ) : (
                <p className="no-skills-note">No skills added yet. Update your profile first.</p>
              )}
            </div>

            <div className="swap-arrow">⟷</div>

            <div className="swap-side">
              <div className="swap-label">You'll Learn</div>
              {targetUser?.teachSkills?.length > 0 ? (
                <select
                  className="form-control"
                  value={receiverSkill}
                  onChange={(e) => setReceiverSkill(e.target.value)}
                  required
                >
                  <option value="">Select their skill...</option>
                  {targetUser.teachSkills.map((skill, i) => (
                    <option key={i} value={skill}>{skill}</option>
                  ))}
                </select>
              ) : (
                <p className="no-skills-note">{targetUser.name} hasn't listed skills to teach.</p>
              )}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Message (optional)</label>
            <textarea
              className="form-control"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={`Hi ${targetUser.name}, I'd love to exchange skills with you!`}
              rows={3}
              maxLength={500}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? '⟳ Sending...' : '⟡ Send Request'}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 24px;
        }
        .modal-box {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 32px;
          width: 100%;
          max-width: 520px;
          box-shadow: var(--shadow-lg);
        }
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .modal-header h2 { font-size: 22px; }
        .modal-close {
          background: transparent;
          border: none;
          color: var(--text-muted);
          font-size: 18px;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 6px;
          transition: var(--transition);
        }
        .modal-close:hover { background: var(--bg-3); color: var(--text); }
        .modal-user-preview {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          background: var(--bg-3);
          border-radius: 10px;
          margin-bottom: 20px;
          font-size: 14px;
          color: var(--text-muted);
        }
        .modal-user-preview strong { color: var(--primary-light); }
        .swap-form {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          margin-bottom: 20px;
        }
        .swap-side { flex: 1; }
        .swap-label {
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: var(--text-muted);
          margin-bottom: 8px;
        }
        .swap-arrow {
          font-size: 24px;
          color: var(--primary);
          margin-top: 28px;
          flex-shrink: 0;
        }
        .no-skills-note {
          font-size: 13px;
          color: var(--text-muted);
          background: var(--bg-3);
          border-radius: 8px;
          padding: 10px;
        }
        .modal-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          margin-top: 8px;
        }
        select.form-control option { background: var(--card); }
        @media (max-width: 480px) {
          .swap-form { flex-direction: column; }
          .swap-arrow { transform: rotate(90deg); align-self: center; margin: 0; }
        }
      `}</style>
    </div>
  );
};

export default SendRequestModal;
