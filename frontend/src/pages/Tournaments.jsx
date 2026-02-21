import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Tournaments.css';

const Tournaments = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('available');
  const [tournaments, setTournaments] = useState([]);

  // Mock tournament data
  const mockTournaments = {
    available: [
      {
        _id: '1',
        name: 'Daily Shooter Tournament',
        type: 'Daily',
        gameId: 'shooter',
        maxPlayers: 16,
        participants: [{ userId: user?._id }],
        status: 'open',
        startTime: new Date(Date.now() + 3600000).toISOString(),
        rewards: {
          first: { coins: 1000, badge: 'daily_champion' },
          second: { coins: 500, badge: 'daily_runner_up' },
          third: { coins: 250, badge: 'daily_third_place' }
        }
      },
      {
        _id: '2',
        name: 'Weekly Racing Championship',
        type: 'Weekly',
        gameId: 'racing',
        maxPlayers: 32,
        participants: [],
        status: 'open',
        startTime: new Date(Date.now() + 7200000).toISOString(),
        rewards: {
          first: { coins: 5000, badge: 'weekly_champion' },
          second: { coins: 2500, badge: 'weekly_runner_up' },
          third: { coins: 1000, badge: 'weekly_third_place' }
        }
      }
    ],
    active: [
      {
        _id: '3',
        name: 'Puzzle Master Tournament',
        type: 'Daily',
        gameId: 'puzzle',
        maxPlayers: 16,
        participants: Array(16).fill({ userId: 'player' }),
        status: 'in-progress',
        startTime: new Date(Date.now() - 1800000).toISOString(),
        bracket: [
          {
            round: 1,
            matches: [
              { player1: 'Player1', player2: 'Player2', winner: 'Player1', completed: true },
              { player1: 'Player3', player2: 'Player4', winner: null, completed: false }
            ]
          }
        ]
      }
    ],
    completed: [
      {
        _id: '4',
        name: 'Yesterday\'s Tournament',
        type: 'Daily',
        gameId: 'shooter',
        maxPlayers: 16,
        status: 'completed',
        endTime: new Date(Date.now() - 86400000).toISOString(),
        winner: { username: 'ProGamer123' }
      }
    ]
  };

  useEffect(() => {
    // In real app, fetch from API
    setTournaments(mockTournaments[activeTab]);
  }, [activeTab]);

  const handleJoinTournament = (tournamentId) => {
    if (user?.isGuest) {
      alert('You must have an account to join tournaments!');
      return;
    }
    alert('Joined tournament! You will be notified when it starts.');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="tournaments-page">
      <nav className="navbar glass">
        <div className="navbar-brand">
          <Link to="/dashboard">
            <h1 className="neon-text">NGGames</h1>
          </Link>
        </div>
      </nav>

      <div className="container">
        <div className="tournaments-header">
          <h1>🏆 Tournaments</h1>
          <p>Compete in tournaments and win exclusive rewards</p>
        </div>

        <div className="tournament-tabs glass">
          <button 
            className={activeTab === 'available' ? 'active' : ''}
            onClick={() => setActiveTab('available')}
          >
            Available
          </button>
          <button 
            className={activeTab === 'active' ? 'active' : ''}
            onClick={() => setActiveTab('active')}
          >
            In Progress
          </button>
          <button 
            className={activeTab === 'completed' ? 'active' : ''}
            onClick={() => setActiveTab('completed')}
          >
            Completed
          </button>
        </div>

        <div className="tournaments-grid grid grid-2">
          {tournaments.map((tournament) => (
            <div key={tournament._id} className="tournament-card glass">
              <div className="tournament-header-card">
                <h3>{tournament.name}</h3>
                <span className={`tournament-type ${tournament.type.toLowerCase()}`}>
                  {tournament.type}
                </span>
              </div>

              <div className="tournament-info">
                <div className="info-row">
                  <span>🎮 Game:</span>
                  <span className="value">{tournament.gameId}</span>
                </div>
                <div className="info-row">
                  <span>👥 Players:</span>
                  <span className="value">
                    {tournament.participants?.length || 0} / {tournament.maxPlayers}
                  </span>
                </div>
                {tournament.startTime && (
                  <div className="info-row">
                    <span>⏰ {activeTab === 'available' ? 'Starts:' : 'Started:'}</span>
                    <span className="value">{formatDate(tournament.startTime)}</span>
                  </div>
                )}
                {tournament.endTime && (
                  <div className="info-row">
                    <span>✓ Ended:</span>
                    <span className="value">{formatDate(tournament.endTime)}</span>
                  </div>
                )}
              </div>

              {tournament.rewards && activeTab === 'available' && (
                <div className="tournament-rewards">
                  <h4>Rewards</h4>
                  <div className="reward-list">
                    <div className="reward-item">
                      🥇 1st: <span className="coins">{tournament.rewards.first.coins} coins</span>
                    </div>
                    <div className="reward-item">
                      🥈 2nd: <span className="coins">{tournament.rewards.second.coins} coins</span>
                    </div>
                    <div className="reward-item">
                      🥉 3rd: <span className="coins">{tournament.rewards.third.coins} coins</span>
                    </div>
                  </div>
                </div>
              )}

              {tournament.winner && (
                <div className="tournament-winner">
                  <p>🏆 Winner: <strong>{tournament.winner.username}</strong></p>
                </div>
              )}

              <div className="tournament-actions">
                {activeTab === 'available' && (
                  <button 
                    className="btn btn-primary"
                    onClick={() => handleJoinTournament(tournament._id)}
                  >
                    Join Tournament
                  </button>
                )}
                {activeTab === 'active' && (
                  <button className="btn btn-secondary">
                    View Bracket
                  </button>
                )}
                {activeTab === 'completed' && (
                  <button className="btn btn-secondary">
                    View Results
                  </button>
                )}
              </div>
            </div>
          ))}

          {tournaments.length === 0 && (
            <div className="no-tournaments">
              <p>No tournaments {activeTab === 'available' ? 'available' : activeTab} at the moment</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tournaments;
