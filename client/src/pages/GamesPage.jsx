import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { gamesAPI } from '../utils/api';
import './GamesPage.css';

const GamesPage = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadGames();
  }, []);

  const loadGames = async () => {
    try {
      const response = await gamesAPI.getAll();
      setGames(response.data.games);
    } catch (error) {
      console.error('Failed to load games:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', 'action', 'arcade', 'puzzle', 'strategy', 'racing', 'card', 'music'];

  const filteredGames = filter === 'all' 
    ? games 
    : games.filter(game => game.category === filter);

  return (
    <div className="games-page">
      <div className="games-header">
        <h1 className="neon-glow">Game Library</h1>
        <p>Choose from 20 amazing games</p>
      </div>

      <div className="category-filter glass">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`filter-btn ${filter === cat ? 'active' : ''}`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading">Loading games...</div>
      ) : (
        <div className="games-grid">
          {filteredGames.map(game => (
            <Link key={game.id} to={`/play/${game.id}`} className="game-card glass">
              <div className="game-icon">{getGameIcon(game.category)}</div>
              <h3>{game.name}</h3>
              <p className="game-category">{game.category.toUpperCase()}</p>
              <div className="game-features">
                {game.hasOnline && <span className="feature">🌐 Online</span>}
                {game.hasBots && <span className="feature">🤖 Bots</span>}
              </div>
              <button className="btn btn-primary">Play Now</button>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

const getGameIcon = (category) => {
  const icons = {
    action: '⚔️',
    arcade: '🕹️',
    puzzle: '🧩',
    strategy: '♟️',
    racing: '🏎️',
    card: '🎴',
    music: '🎵',
    platform: '🎮'
  };
  return icons[category] || '🎮';
};

export default GamesPage;
