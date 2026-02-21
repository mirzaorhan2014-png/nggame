import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './GamesList.css';

const GamesList = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const response = await axios.get('/api/games/list');
      setGames(response.data);
    } catch (error) {
      console.error('Failed to fetch games:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading games...</div>;
  }

  return (
    <div className="games-page">
      <nav className="navbar glass">
        <div className="navbar-brand">
          <Link to="/dashboard">
            <h1 className="neon-text">NGGames</h1>
          </Link>
        </div>
      </nav>

      <div className="container">
        <div className="games-header">
          <h1>Available Games</h1>
          <p>20 Professional Quality Games</p>
        </div>

        <div className="games-grid grid grid-4">
          {games.map((game) => (
            <Link
              key={game.id}
              to={`/games/${game.id}`}
              className="game-card glass"
            >
              <div className="game-icon">🎮</div>
              <h3>{game.name}</h3>
              <p className="game-category">{game.category}</p>
              <p className="game-players">{game.players} players</p>
              <button className="btn btn-primary">Play Now</button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GamesList;
