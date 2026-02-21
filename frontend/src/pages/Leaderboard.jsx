import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Leaderboard.css';

const Leaderboard = () => {
  const [leaderboardType, setLeaderboardType] = useState('global');
  const [gameId, setGameId] = useState('');
  const [country, setCountry] = useState('');
  const [leaderboard, setLeaderboard] = useState([]);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGames();
  }, []);

  useEffect(() => {
    fetchLeaderboard();
  }, [leaderboardType, gameId, country]);

  const fetchGames = async () => {
    try {
      const response = await axios.get('/api/games/list');
      setGames(response.data);
      if (response.data.length > 0) {
        setGameId(response.data[0].id);
      }
    } catch (error) {
      console.error('Failed to fetch games:', error);
    }
  };

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      let response;
      if (leaderboardType === 'global') {
        response = await axios.get('/api/games/leaderboard-global', {
          params: { limit: 100 }
        });
      } else if (leaderboardType === 'game' && gameId) {
        response = await axios.get(`/api/games/leaderboard/${gameId}`, {
          params: { country: country || undefined, limit: 100 }
        });
      }
      
      if (response) {
        setLeaderboard(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankColor = (rank) => {
    if (rank === 1) return '#ffff00';
    if (rank === 2) return '#c0c0c0';
    if (rank === 3) return '#cd7f32';
    return '#a0a0b0';
  };

  return (
    <div className="leaderboard-page">
      <nav className="navbar glass">
        <div className="navbar-brand">
          <Link to="/dashboard">
            <h1 className="neon-text">NGGames</h1>
          </Link>
        </div>
      </nav>

      <div className="container">
        <div className="leaderboard-header">
          <h1>🏆 Leaderboards</h1>
          <p>Top Players & Rankings</p>
        </div>

        <div className="leaderboard-controls glass">
          <div className="control-group">
            <label>Type:</label>
            <select 
              value={leaderboardType} 
              onChange={(e) => setLeaderboardType(e.target.value)}
            >
              <option value="global">Global Ranking</option>
              <option value="game">Game Leaderboard</option>
            </select>
          </div>

          {leaderboardType === 'game' && (
            <>
              <div className="control-group">
                <label>Game:</label>
                <select value={gameId} onChange={(e) => setGameId(e.target.value)}>
                  {games.map(game => (
                    <option key={game.id} value={game.id}>{game.name}</option>
                  ))}
                </select>
              </div>

              <div className="control-group">
                <label>Country:</label>
                <select value={country} onChange={(e) => setCountry(e.target.value)}>
                  <option value="">All Countries</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Canada">Canada</option>
                  <option value="Germany">Germany</option>
                  <option value="France">France</option>
                  <option value="Japan">Japan</option>
                  <option value="South Korea">South Korea</option>
                  <option value="Brazil">Brazil</option>
                  <option value="Turkey">Turkey</option>
                </select>
              </div>
            </>
          )}

          <button className="btn btn-primary" onClick={fetchLeaderboard}>
            Refresh
          </button>
        </div>

        <div className="leaderboard-content glass">
          {loading ? (
            <div className="loading">Loading...</div>
          ) : leaderboard.length > 0 ? (
            <div className="leaderboard-table">
              <div className="table-header">
                <div className="col-rank">Rank</div>
                <div className="col-player">Player</div>
                <div className="col-country">Country</div>
                {leaderboardType === 'global' ? (
                  <>
                    <div className="col-stat">Rank Tier</div>
                    <div className="col-stat">RP</div>
                    <div className="col-stat">Wins</div>
                    <div className="col-stat">Win Rate</div>
                  </>
                ) : (
                  <>
                    <div className="col-stat">Score</div>
                    <div className="col-stat">Kills</div>
                    <div className="col-stat">Deaths</div>
                  </>
                )}
              </div>

              {leaderboard.map((entry) => (
                <div key={entry.userId} className="table-row">
                  <div 
                    className="col-rank rank-badge" 
                    style={{ color: getRankColor(entry.rank) }}
                  >
                    {entry.rank <= 3 ? (
                      <span className="medal">
                        {entry.rank === 1 && '🥇'}
                        {entry.rank === 2 && '🥈'}
                        {entry.rank === 3 && '🥉'}
                      </span>
                    ) : (
                      `#${entry.rank}`
                    )}
                  </div>
                  <div className="col-player">
                    <span className="player-name">{entry.username}</span>
                  </div>
                  <div className="col-country">{entry.country}</div>
                  {leaderboardType === 'global' ? (
                    <>
                      <div className={`col-stat rank-${entry.rankTier?.toLowerCase()}`}>
                        {entry.rankTier}
                      </div>
                      <div className="col-stat">{entry.rankPoints}</div>
                      <div className="col-stat">{entry.wins}</div>
                      <div className="col-stat">{entry.winRate}%</div>
                    </>
                  ) : (
                    <>
                      <div className="col-stat highlight">{entry.score?.toLocaleString()}</div>
                      <div className="col-stat">{entry.kills}</div>
                      <div className="col-stat">{entry.deaths}</div>
                    </>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="no-data">
              <p>No leaderboard data available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
