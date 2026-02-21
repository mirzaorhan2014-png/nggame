import React from 'react';
import { useAuthStore } from '../store/authStore';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuthStore();

  const quickStats = [
    { label: 'Rank', value: user?.rank || 'Bronze', color: `var(--rank-${user?.rank?.toLowerCase()})` },
    { label: 'RP', value: user?.rp || 0, color: 'var(--primary)' },
    { label: 'Coins', value: user?.coins || 0, color: 'var(--accent)' },
    { label: 'Win Rate', value: `${user?.stats?.wins || 0}%`, color: 'var(--success)' }
  ];

  return (
    <div className="dashboard">
      <nav className="navbar glass">
        <div className="nav-brand">
          <h2 className="neon-glow">NGGames</h2>
        </div>
        <div className="nav-links">
          <Link to="/games" className="nav-link">Games</Link>
          <Link to="/store" className="nav-link">Store</Link>
          <Link to="/leaderboard" className="nav-link">Leaderboard</Link>
          <Link to="/tournaments" className="nav-link">Tournaments</Link>
          <Link to="/clans" className="nav-link">Clans</Link>
          <Link to="/social" className="nav-link">Social</Link>
          {!user?.isGuest && <Link to="/ai-engine" className="nav-link">AI Engine</Link>}
        </div>
        <div className="nav-user">
          <span className="user-coins">💰 {user?.coins || 0}</span>
          <Link to={`/profile/${user?.id}`} className="user-avatar">
            {user?.username?.charAt(0).toUpperCase()}
          </Link>
          <button onClick={logout} className="btn btn-ghost">Logout</button>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="welcome-section glass">
          <h1>Welcome back, <span className={`rank-${user?.rank?.toLowerCase()}`}>{user?.username}</span>!</h1>
          <p>Ready to dominate the arena?</p>
        </div>

        <div className="quick-stats">
          {quickStats.map((stat, index) => (
            <div key={index} className="stat-card glass">
              <div className="stat-value" style={{ color: stat.color }}>{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="main-actions">
          <Link to="/games" className="action-card glass">
            <h3>🎮 Play Games</h3>
            <p>20 amazing games to choose from</p>
          </Link>
          
          <Link to="/tournaments" className="action-card glass">
            <h3>🏆 Tournaments</h3>
            <p>Compete in daily tournaments</p>
          </Link>
          
          <Link to="/store" className="action-card glass">
            <h3>🛒 Store</h3>
            <p>Unlock cool cosmetics</p>
          </Link>
          
          {!user?.isGuest && (
            <Link to="/ai-engine" className="action-card glass neon-border">
              <h3>🤖 AI Game Engine</h3>
              <p>Create your own games with AI</p>
            </Link>
          )}
        </div>

        {user?.isGuest && (
          <div className="guest-notice glass">
            <h3>⚠️ Guest Mode Limitations</h3>
            <p>As a guest, you can play games but cannot earn coins, save scores, or create custom games.</p>
            <Link to="/register">
              <button className="btn btn-primary">Create Account to Unlock Everything</button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
