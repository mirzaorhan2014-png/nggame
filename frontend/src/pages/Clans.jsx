import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Clans.css';

const Clans = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('browse');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [clanForm, setClanForm] = useState({
    name: '',
    tag: '',
    description: '',
    country: ''
  });

  // Mock clan data
  const mockClans = [
    {
      _id: '1',
      name: 'Elite Warriors',
      tag: 'EW',
      description: 'Top-tier competitive clan',
      members: Array(25).fill({}),
      level: 15,
      country: 'United States',
      stats: { totalWins: 150, totalLosses: 45, totalPoints: 15000 }
    },
    {
      _id: '2',
      name: 'Neon Knights',
      tag: 'NK',
      description: 'Friendly and active community',
      members: Array(18).fill({}),
      level: 12,
      country: 'United Kingdom',
      stats: { totalWins: 98, totalLosses: 62, totalPoints: 9800 }
    }
  ];

  const handleCreateClan = (e) => {
    e.preventDefault();
    if (user?.isGuest) {
      alert('You must have an account to create a clan!');
      return;
    }
    alert('Clan created successfully!');
    setShowCreateModal(false);
  };

  const handleJoinClan = (clanId) => {
    if (user?.isGuest) {
      alert('You must have an account to join a clan!');
      return;
    }
    alert('Join request sent!');
  };

  return (
    <div className="clans-page">
      <nav className="navbar glass">
        <div className="navbar-brand">
          <Link to="/dashboard">
            <h1 className="neon-text">NGGames</h1>
          </Link>
        </div>
      </nav>

      <div className="container">
        <div className="clans-header">
          <h1>🛡️ Clans</h1>
          <p>Join a community and compete together</p>
          <button 
            className="btn btn-primary"
            onClick={() => setShowCreateModal(true)}
          >
            Create Clan
          </button>
        </div>

        <div className="clan-tabs glass">
          <button 
            className={activeTab === 'browse' ? 'active' : ''}
            onClick={() => setActiveTab('browse')}
          >
            Browse Clans
          </button>
          <button 
            className={activeTab === 'myclan' ? 'active' : ''}
            onClick={() => setActiveTab('myclan')}
          >
            My Clan
          </button>
          <button 
            className={activeTab === 'leaderboard' ? 'active' : ''}
            onClick={() => setActiveTab('leaderboard')}
          >
            Leaderboard
          </button>
        </div>

        {activeTab === 'browse' && (
          <div className="clans-grid grid grid-2">
            {mockClans.map((clan) => (
              <div key={clan._id} className="clan-card glass">
                <div className="clan-header">
                  <div className="clan-logo">[{clan.tag}]</div>
                  <div className="clan-info-header">
                    <h3>{clan.name}</h3>
                    <p className="clan-country">📍 {clan.country}</p>
                  </div>
                </div>

                <p className="clan-description">{clan.description}</p>

                <div className="clan-stats">
                  <div className="stat">
                    <span className="label">Level</span>
                    <span className="value">{clan.level}</span>
                  </div>
                  <div className="stat">
                    <span className="label">Members</span>
                    <span className="value">{clan.members.length}/50</span>
                  </div>
                  <div className="stat">
                    <span className="label">Wins</span>
                    <span className="value success">{clan.stats.totalWins}</span>
                  </div>
                  <div className="stat">
                    <span className="label">Points</span>
                    <span className="value highlight">{clan.stats.totalPoints}</span>
                  </div>
                </div>

                <button 
                  className="btn btn-primary"
                  onClick={() => handleJoinClan(clan._id)}
                >
                  Request to Join
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'myclan' && (
          <div className="my-clan-content glass-intense">
            <p className="no-clan">You are not in a clan yet</p>
            <button 
              className="btn btn-primary"
              onClick={() => setActiveTab('browse')}
            >
              Browse Clans
            </button>
          </div>
        )}

        {activeTab === 'leaderboard' && (
          <div className="clan-leaderboard glass">
            <div className="leaderboard-table">
              <div className="table-header">
                <div>Rank</div>
                <div>Clan</div>
                <div>Level</div>
                <div>Members</div>
                <div>Points</div>
              </div>
              {mockClans.map((clan, index) => (
                <div key={clan._id} className="table-row">
                  <div className="rank">#{index + 1}</div>
                  <div className="clan-name">
                    <strong>[{clan.tag}]</strong> {clan.name}
                  </div>
                  <div>{clan.level}</div>
                  <div>{clan.members.length}</div>
                  <div className="highlight">{clan.stats.totalPoints}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content glass-intense" onClick={(e) => e.stopPropagation()}>
            <h2>Create Clan</h2>
            <form onSubmit={handleCreateClan}>
              <div className="form-group">
                <label>Clan Name</label>
                <input
                  type="text"
                  value={clanForm.name}
                  onChange={(e) => setClanForm({...clanForm, name: e.target.value})}
                  required
                  minLength={3}
                  maxLength={30}
                  placeholder="Enter clan name"
                />
              </div>
              <div className="form-group">
                <label>Clan Tag (2-5 characters)</label>
                <input
                  type="text"
                  value={clanForm.tag}
                  onChange={(e) => setClanForm({...clanForm, tag: e.target.value.toUpperCase()})}
                  required
                  minLength={2}
                  maxLength={5}
                  placeholder="TAG"
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={clanForm.description}
                  onChange={(e) => setClanForm({...clanForm, description: e.target.value})}
                  maxLength={500}
                  rows={4}
                  placeholder="Describe your clan..."
                />
              </div>
              <div className="form-group">
                <label>Country</label>
                <select
                  value={clanForm.country}
                  onChange={(e) => setClanForm({...clanForm, country: e.target.value})}
                  required
                >
                  <option value="">Select Country</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Canada">Canada</option>
                  <option value="Germany">Germany</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Clan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clans;
