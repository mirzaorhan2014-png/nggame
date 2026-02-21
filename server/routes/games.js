const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');

// Built-in games list
const builtInGames = [
  { id: 'shooter', name: 'Cyber Shooter', category: 'action', hasOnline: true, hasBots: true },
  { id: 'snake', name: 'Neon Snake', category: 'arcade', hasOnline: false },
  { id: 'tetris', name: 'Space Tetris', category: 'puzzle', hasOnline: false },
  { id: 'pong', name: 'Cyber Pong', category: 'arcade', hasOnline: true },
  { id: 'space-invaders', name: 'Galaxy Invaders', category: 'arcade', hasOnline: false },
  { id: 'breakout', name: 'Plasma Breakout', category: 'arcade', hasOnline: false },
  { id: 'racing', name: 'Neon Racer', category: 'racing', hasOnline: true },
  { id: 'platformer', name: 'Cyber Runner', category: 'platform', hasOnline: false },
  { id: 'puzzle', name: 'Mind Maze', category: 'puzzle', hasOnline: false },
  { id: 'tower-defense', name: 'Base Defense', category: 'strategy', hasOnline: false },
  { id: 'fighting', name: 'Arena Fighter', category: 'action', hasOnline: true },
  { id: 'battle-royale', name: 'Last Stand', category: 'action', hasOnline: true },
  { id: 'moba', name: 'Arena Legends', category: 'strategy', hasOnline: true },
  { id: 'card-game', name: 'Cyber Cards', category: 'card', hasOnline: true },
  { id: 'chess', name: 'Quantum Chess', category: 'strategy', hasOnline: true },
  { id: 'checkers', name: 'Neon Checkers', category: 'strategy', hasOnline: true },
  { id: 'memory', name: 'Memory Matrix', category: 'puzzle', hasOnline: false },
  { id: 'trivia', name: 'Quiz Master', category: 'trivia', hasOnline: true },
  { id: 'rhythm', name: 'Beat Sync', category: 'music', hasOnline: false },
  { id: 'pinball', name: 'Cyber Pinball', category: 'arcade', hasOnline: false }
];

// Get all games
router.get('/', (req, res) => {
  res.json({ games: builtInGames });
});

// Get game details
router.get('/:gameId', (req, res) => {
  const game = builtInGames.find(g => g.id === req.params.gameId);
  
  if (!game) {
    return res.status(404).json({ error: 'Game not found' });
  }
  
  res.json({ game });
});

// Create private room (for online games)
router.post('/room/create', auth, async (req, res) => {
  try {
    const { gameId } = req.body;
    const roomId = `${gameId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // In a real implementation, this would be stored and managed by Socket.io
    res.json({ 
      roomId,
      message: 'Room created',
      shareLink: `nggames.com/play/${gameId}?room=${roomId}`
    });
  } catch (error) {
    console.error('Create room error:', error);
    res.status(500).json({ error: 'Failed to create room' });
  }
});

module.exports = router;
