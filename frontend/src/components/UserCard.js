import React from 'react';

const StarRating = ({ rating, size = 14 }) => {
  return (
    <span className="stars" style={{ fontSize: size }}>
      {[1, 2, 3, 4, 5].map(s => (
        <span key={s} style={{ color: s <= Math.round(rating) ? '#ffd93d' : '#333' }}>★</span>
      ))}
    </span>
  );
};

const getInitials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';

const GRADIENT_PAIRS = [
  ['#6c47ff', '#00d4aa'],
  ['#ff6b6b', '#6c47ff'],
  ['#00d4aa', '#ffd93d'],
  ['#8b6fff', '#ff6b6b'],
  ['#ffd93d', '#00d4aa'],
];

const getGradient = (name) => {
  const idx = (name?.charCodeAt(0) || 0) % GRADIENT_PAIRS.length;
  const [a, b] = GRADIENT_PAIRS[idx];
  return `linear-gradient(135deg, ${a}, ${b})`;
};

const UserCard = ({ user, onSendRequest, showRequest = true, matchScore }) => {
  return (
    <div className="user-card card animate-in">
      <div className="user-card-header">
        <div className="avatar" style={{
          width: 52, height: 52, fontSize: 18,
          background: getGradient(user.name)
        }}>
          {getInitials(user.name)}
        </div>
        <div className="user-card-info">
          <h3 className="user-card-name">{user.name}</h3>
          {user.location && <p className="user-card-location">📍 {user.location}</p>}
          <div className="user-card-rating">
            <StarRating rating={user.averageRating} />
            <span className="rating-count">
              {user.averageRating > 0
                ? `${user.averageRating.toFixed(1)} (${user.totalReviews || 0})`
                : 'No reviews yet'}
            </span>
          </div>
        </div>
        {matchScore > 0 && (
          <div className="match-badge">
            <span>🎯</span>
            <span>{matchScore}pt match</span>
          </div>
        )}
      </div>

      {user.bio && <p className="user-card-bio">{user.bio}</p>}

      <div className="skill-sections">
        {user.teachSkills?.length > 0 && (
          <div className="skill-section">
            <span className="skill-section-label">Can Teach</span>
            <div className="skill-tags">
              {user.teachSkills.slice(0, 4).map((skill, i) => (
                <span key={i} className="skill-tag skill-tag-teach">{skill}</span>
              ))}
              {user.teachSkills.length > 4 && (
                <span className="skill-tag" style={{ background: 'var(--bg-3)', color: 'var(--text-muted)' }}>
                  +{user.teachSkills.length - 4}
                </span>
              )}
            </div>
          </div>
        )}
        {user.learnSkills?.length > 0 && (
          <div className="skill-section">
            <span className="skill-section-label">Wants to Learn</span>
            <div className="skill-tags">
              {user.learnSkills.slice(0, 4).map((skill, i) => (
                <span key={i} className="skill-tag skill-tag-learn">{skill}</span>
              ))}
              {user.learnSkills.length > 4 && (
                <span className="skill-tag" style={{ background: 'var(--bg-3)', color: 'var(--text-muted)' }}>
                  +{user.learnSkills.length - 4}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {showRequest && onSendRequest && (
        <button className="btn btn-primary btn-sm" style={{ width: '100%', marginTop: 16 }} onClick={() => onSendRequest(user)}>
          ⟡ Request Skill Swap
        </button>
      )}

      <style>{`
        .user-card { position: relative; overflow: hidden; }
        .user-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(108,71,255,0.03), transparent);
          pointer-events: none;
        }
        .user-card-header {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          margin-bottom: 14px;
        }
        .user-card-info { flex: 1; min-width: 0; }
        .user-card-name {
          font-size: 16px;
          font-weight: 700;
          color: var(--text);
          margin-bottom: 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .user-card-location {
          font-size: 12px;
          color: var(--text-muted);
          margin-bottom: 6px;
        }
        .user-card-rating {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .rating-count {
          font-size: 12px;
          color: var(--text-muted);
        }
        .user-card-bio {
          font-size: 13px;
          color: var(--text-muted);
          line-height: 1.5;
          margin-bottom: 14px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .skill-sections { display: flex; flex-direction: column; gap: 10px; }
        .skill-section-label {
          display: block;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.7px;
          color: var(--text-muted);
          margin-bottom: 6px;
        }
        .skill-tags { display: flex; flex-wrap: wrap; gap: 6px; }
        .match-badge {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          padding: 6px 10px;
          background: rgba(0, 212, 170, 0.1);
          border: 1px solid rgba(0, 212, 170, 0.25);
          border-radius: 8px;
          font-size: 11px;
          color: var(--accent);
          font-weight: 700;
          white-space: nowrap;
        }
      `}</style>
    </div>
  );
};

export default UserCard;
export { StarRating, getInitials, getGradient };
