import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="dashboard">
      <nav className="navbar glass">
        <div className="navbar-brand">
          <h1 className="neon-text">NGGames</h1>
        </div>
        
        <div className="navbar-menu">
          <Link to="/games" className="nav-link">Games</Link>
          <Link to="/leaderboard" className="nav-link">Leaderboard</Link>
          <Link to="/store" className="nav-link">Store</Link>
          <Link to="/tournaments" className="nav-link">Tournaments</Link>
          {!user?.isGuest && <Link to="/clans" className="nav-link">Clans</Link>}
          {!user?.isGuest && <Link to="/social" className="nav-link">Social</Link>}
          {!user?.isGuest && <Link to="/ai-creator" className="nav-link">AI Creator</Link>}
        </div>

        <div className="navbar-user">
          <div className="user-info">
            <span className="user-name">{user?.username}</span>
            <span className="user-coins">💰 {user?.coins || 0}</span>
            {user?.rank && (
              <span className={`user-rank rank-${user.rank.tier.toLowerCase()}`}>
                {user.rank.tier}
              </span>
            )}
          </div>
          <button onClick={logout} className="btn btn-secondary btn-sm">Logout</button>
        </div>
      </nav>

      <div className="dashboard-content container">
        <div className="welcome-section glass animate-fadeIn">
          <h2>Welcome back, {user?.username}! 🎮</h2>
          {user?.isGuest && (
            <div className="guest-notice">
              <p>⚠️ You are playing as a guest. Register to save progress and unlock all features!</p>
              <Link to="/register" className="btn btn-primary">Create Account</Link>
            </div>
          )}
        </div>

        <div className="stats-grid grid grid-4">
          <div className="stat-card glass">
            <h3>Total Matches</h3>
            <p className="stat-value">{user?.stats?.totalMatches || 0}</p>
          </div>
          <div className="stat-card glass">
            <h3>Wins</h3>
            <p className="stat-value success">{user?.stats?.wins || 0}</p>
          </div>
          <div className="stat-card glass">
            <h3>Win Rate</h3>
            <p className="stat-value">
              {user?.stats?.totalMatches > 0
                ? ((user.stats.wins / user.stats.totalMatches) * 100).toFixed(1)
                : 0}%
            </p>
          </div>
          <div className="stat-card glass">
            <h3>K/D Ratio</h3>
            <p className="stat-value">
              {user?.stats?.deaths > 0
                ? (user.stats.kills / user.stats.deaths).toFixed(2)
                : user?.stats?.kills || 0}
            </p>
          </div>
        </div>

        <div className="quick-actions grid grid-3">
          <Link to="/games/shooter" className="action-card glass">
            <div className="action-icon">🎯</div>
            <h3>Play Shooter</h3>
            <p>Battle Royale Mode</p>
          </Link>
          
          <Link to="/games" className="action-card glass">
            <div className="action-icon">🎮</div>
            <h3>Browse Games</h3>
            <p>20+ Games Available</p>
          </Link>
          
          <Link to="/tournaments" className="action-card glass">
            <div className="action-icon">🏆</div>
            <h3>Tournaments</h3>
            <p>Compete & Win</p>
          </Link>
        </div>

        {!user?.isGuest && (
          <div className="rank-progress glass">
            <h3>Rank Progress</h3>
            <div className="rank-info">
              <span className={`rank-badge rank-${user?.rank?.tier.toLowerCase()}`}>
                {user?.rank?.tier}
              </span>
              <div className="rank-points">
                <p>{user?.rank?.points || 0} RP</p>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${Math.min((user?.rank?.points % 300) / 3, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
