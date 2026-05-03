import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const features = [
  { icon: '🔄', title: 'No Money Needed', desc: 'Exchange your expertise directly. Teach what you know, learn what you need.' },
  { icon: '🎯', title: 'Smart Matching', desc: 'Our algorithm finds users with complementary skills for perfect pairings.' },
  { icon: '⭐', title: 'Rating System', desc: 'Build trust through verified reviews and ratings from past exchanges.' },
  { icon: '🌐', title: 'Any Skill', desc: 'From coding to cooking, music to marketing — every skill has value here.' },
  { icon: '🤝', title: 'Community Driven', desc: 'Join a vibrant community of learners and teachers helping each other grow.' },
  { icon: '🔒', title: 'Secure Platform', desc: 'JWT authentication and request management keep your exchanges safe.' },
];

const steps = [
  { num: '01', title: 'Create Profile', desc: 'Sign up and list the skills you can teach and want to learn.' },
  { num: '02', title: 'Find Matches', desc: 'Browse matched users or search for specific skills you want.' },
  { num: '03', title: 'Send Request', desc: 'Propose a skill exchange specifying what you\'ll teach and learn.' },
  { num: '04', title: 'Swap & Rate', desc: 'Complete your exchange and leave a review for your partner.' },
];

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="home-page">
      {/* Hero */}
      <section className="hero-section">
        <div className="hero-bg-grid" />
        <div className="hero-blob hero-blob-1" />
        <div className="hero-blob hero-blob-2" />
        <div className="container hero-content">
          <div className="hero-badge">
            <span>✨</span> Knowledge Exchange Platform
          </div>
          <h1 className="hero-title">
            Trade Skills,
            <br />
            <span className="gradient-text">Not Money</span>
          </h1>
          <p className="hero-subtitle">
            Connect with people who have the skills you want to learn, and teach what you know best.
            A fair, community-driven way to grow together.
          </p>
          <div className="hero-actions">
            {user ? (
              <>
                <Link to="/dashboard" className="btn btn-primary btn-lg">Go to Dashboard →</Link>
                <Link to="/search" className="btn btn-secondary btn-lg">Find Skills</Link>
              </>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary btn-lg">Start Swapping Free →</Link>
                <Link to="/login" className="btn btn-secondary btn-lg">Sign In</Link>
              </>
            )}
          </div>
          <div className="hero-stats">
            <div className="hero-stat"><span className="stat-number">500+</span><span className="stat-label">Skills Listed</span></div>
            <div className="hero-stat-divider" />
            <div className="hero-stat"><span className="stat-number">2k+</span><span className="stat-label">Exchanges Made</span></div>
            <div className="hero-stat-divider" />
            <div className="hero-stat"><span className="stat-number">4.8★</span><span className="stat-label">Average Rating</span></div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section features-section" id="features">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">Features</div>
            <h2>Everything you need to <span className="gradient-text">grow your skills</span></h2>
            <p>Built for learners and teachers who believe in the power of community knowledge sharing.</p>
          </div>
          <div className="grid grid-3">
            {features.map((f, i) => (
              <div key={i} className="feature-card card" style={{ animationDelay: `${i * 0.07}s` }}>
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section how-section" id="how-it-works">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">Process</div>
            <h2>How <span className="gradient-text">SkillSwap</span> works</h2>
            <p>From sign up to your first skill exchange in minutes.</p>
          </div>
          <div className="steps-grid">
            {steps.map((step, i) => (
              <div key={i} className="step-card">
                <div className="step-num">{step.num}</div>
                <div className="step-connector" />
                <h3 className="step-title">{step.title}</h3>
                <p className="step-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      {!user && (
        <section className="cta-section">
          <div className="container">
            <div className="cta-card">
              <div className="cta-blob" />
              <h2>Ready to start your skill journey?</h2>
              <p>Join thousands of learners and teachers exchanging knowledge for free.</p>
              <div className="cta-actions">
                <Link to="/register" className="btn btn-primary btn-lg">Create Free Account →</Link>
                <Link to="/login" className="btn btn-secondary btn-lg">Sign In</Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="footer">
        <div className="container footer-inner">
          <div className="footer-brand">
            <span style={{ fontSize: 20 }}>⟡</span> SkillSwap
          </div>
          <p className="footer-copy">© 2025 SkillSwap. Built for the community, by the community.</p>
        </div>
      </footer>

      <style>{`
        .home-page { overflow-x: hidden; }

        /* Hero */
        .hero-section {
          position: relative;
          min-height: 90vh;
          display: flex;
          align-items: center;
          overflow: hidden;
          padding: 80px 0;
        }
        .hero-bg-grid {
          position: absolute;
          inset: 0;
          background-image: linear-gradient(rgba(108,71,255,0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(108,71,255,0.07) 1px, transparent 1px);
          background-size: 48px 48px;
        }
        .hero-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
        }
        .hero-blob-1 {
          width: 600px; height: 600px;
          background: rgba(108, 71, 255, 0.15);
          top: -100px; left: -200px;
        }
        .hero-blob-2 {
          width: 400px; height: 400px;
          background: rgba(0, 212, 170, 0.1);
          bottom: -50px; right: -100px;
        }
        .hero-content {
          position: relative;
          z-index: 1;
          text-align: center;
          max-width: 780px;
          margin: 0 auto;
        }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 18px;
          background: rgba(108, 71, 255, 0.12);
          border: 1px solid rgba(108, 71, 255, 0.3);
          border-radius: 20px;
          font-size: 13px;
          color: var(--primary-light);
          font-weight: 600;
          margin-bottom: 28px;
        }
        .hero-title {
          font-size: clamp(48px, 8vw, 88px);
          line-height: 1.05;
          margin-bottom: 24px;
          letter-spacing: -2px;
        }
        .gradient-text {
          background: linear-gradient(135deg, var(--primary), var(--accent));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .hero-subtitle {
          font-size: 18px;
          color: var(--text-muted);
          max-width: 560px;
          margin: 0 auto 36px;
          line-height: 1.7;
        }
        .hero-actions { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; margin-bottom: 56px; }
        .hero-stats {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 32px;
          flex-wrap: wrap;
        }
        .hero-stat { text-align: center; }
        .stat-number {
          display: block;
          font-family: 'Clash Display', sans-serif;
          font-size: 28px;
          font-weight: 700;
          color: var(--text);
        }
        .stat-label { font-size: 13px; color: var(--text-muted); }
        .hero-stat-divider { width: 1px; height: 40px; background: var(--border-light); }

        /* Sections */
        .section { padding: 100px 0; }
        .section-header { text-align: center; margin-bottom: 56px; }
        .section-badge {
          display: inline-block;
          padding: 6px 16px;
          background: rgba(108,71,255,0.1);
          border: 1px solid rgba(108,71,255,0.25);
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--primary-light);
          margin-bottom: 16px;
        }
        .section-header h2 { font-size: clamp(30px, 4vw, 46px); margin-bottom: 16px; }
        .section-header p { font-size: 16px; color: var(--text-muted); max-width: 480px; margin: 0 auto; }

        /* Features */
        .features-section { background: var(--bg-2); }
        .feature-card { text-align: center; animation: fadeIn 0.5s ease both; }
        .feature-icon { font-size: 36px; margin-bottom: 16px; }
        .feature-card h3 { font-size: 18px; margin-bottom: 10px; }
        .feature-card p { font-size: 14px; color: var(--text-muted); line-height: 1.6; }

        /* Steps */
        .steps-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
        .step-card { text-align: center; position: relative; }
        .step-num {
          font-family: 'Clash Display', sans-serif;
          font-size: 48px;
          font-weight: 700;
          background: linear-gradient(135deg, var(--primary), var(--accent));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 16px;
          line-height: 1;
        }
        .step-title { font-size: 18px; margin-bottom: 10px; }
        .step-desc { font-size: 14px; color: var(--text-muted); line-height: 1.6; }

        /* CTA */
        .cta-section { padding: 80px 0; }
        .cta-card {
          position: relative;
          background: var(--bg-3);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 64px;
          text-align: center;
          overflow: hidden;
        }
        .cta-blob {
          position: absolute;
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(108,71,255,0.2) 0%, transparent 70%);
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
        }
        .cta-card h2 { font-size: clamp(28px, 4vw, 42px); margin-bottom: 16px; position: relative; z-index: 1; }
        .cta-card p { font-size: 16px; color: var(--text-muted); margin-bottom: 36px; position: relative; z-index: 1; }
        .cta-actions { display: flex; gap: 14px; justify-content: center; position: relative; z-index: 1; flex-wrap: wrap; }

        /* Footer */
        .footer { border-top: 1px solid var(--border-light); padding: 32px 0; }
        .footer-inner { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; }
        .footer-brand { display: flex; align-items: center; gap: 8px; font-family: 'Clash Display', sans-serif; font-size: 18px; font-weight: 700; }
        .footer-copy { font-size: 13px; color: var(--text-muted); }

        @media (max-width: 768px) {
          .steps-grid { grid-template-columns: repeat(2, 1fr); }
          .cta-card { padding: 40px 24px; }
          .hero-stats { gap: 20px; }
          .hero-stat-divider { display: none; }
        }
        @media (max-width: 480px) {
          .steps-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default Home;
