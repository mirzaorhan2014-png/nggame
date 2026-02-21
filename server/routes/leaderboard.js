const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Leaderboard = require('../models/Leaderboard');
const User = require('../models/User');
const Clan = require('../models/Clan');

// Get global leaderboard
router.get('/global', async (req, res) => {
  try {
    const { limit = 100 } = req.query;
    
    const leaders = await User.find({ isGuest: false })
      .sort({ rp: -1, 'stats.wins': -1 })
      .limit(parseInt(limit))
      .select('username country rank rp stats.wins stats.totalMatches avatar');
    
    res.json({ leaderboard: leaders });
  } catch (error) {
    console.error('Global leaderboard error:', error);
    res.status(500).json({ error: 'Failed to get leaderboard' });
  }
});

// Get country leaderboard
router.get('/country/:country', async (req, res) => {
  try {
    const { country } = req.params;
    const { limit = 100 } = req.query;
    
    const leaders = await User.find({ country, isGuest: false })
      .sort({ rp: -1, 'stats.wins': -1 })
      .limit(parseInt(limit))
      .select('username country rank rp stats.wins stats.totalMatches avatar');
    
    res.json({ leaderboard: leaders });
  } catch (error) {
    console.error('Country leaderboard error:', error);
    res.status(500).json({ error: 'Failed to get leaderboard' });
  }
});

// Get game leaderboard
router.get('/game/:gameId', async (req, res) => {
  try {
    const { gameId } = req.params;
    const { limit = 100 } = req.query;
    
    const leaders = await Leaderboard.find({ gameId })
      .sort({ score: -1 })
      .limit(parseInt(limit))
      .populate('user', 'username country avatar rank');
    
    res.json({ leaderboard: leaders });
  } catch (error) {
    console.error('Game leaderboard error:', error);
    res.status(500).json({ error: 'Failed to get leaderboard' });
  }
});

// Get clan leaderboard
router.get('/clans', async (req, res) => {
  try {
    const { country, limit = 100 } = req.query;
    
    let query = {};
    if (country) {
      // Get clans with members from specific country
      const users = await User.find({ country }).select('clan');
      const clanIds = [...new Set(users.map(u => u.clan).filter(Boolean))];
      query._id = { $in: clanIds };
    }
    
    const clans = await Clan.find(query)
      .sort({ 'stats.totalWins': -1, level: -1 })
      .limit(parseInt(limit))
      .populate('leader', 'username')
      .select('name tag logo stats level members');
    
    res.json({ leaderboard: clans });
  } catch (error) {
    console.error('Clan leaderboard error:', error);
    res.status(500).json({ error: 'Failed to get clan leaderboard' });
  }
});

// Submit score (for built-in games)
router.post('/submit', auth, async (req, res) => {
  try {
    if (req.user.isGuest) {
      return res.status(403).json({ error: 'Guests cannot save scores' });
    }
    
    const { gameId, score } = req.body;
    
    // Update or create leaderboard entry
    const existing = await Leaderboard.findOne({ user: req.userId, gameId });
    
    if (existing) {
      if (score > existing.score) {
        existing.score = score;
        await existing.save();
        res.json({ message: 'New high score!', score: existing.score });
      } else {
        res.json({ message: 'Score submitted', score: existing.score });
      }
    } else {
      const entry = new Leaderboard({
        user: req.userId,
        gameId,
        score,
        country: req.user.country
      });
      await entry.save();
      res.json({ message: 'Score submitted', score: entry.score });
    }
  } catch (error) {
    console.error('Submit score error:', error);
    res.status(500).json({ error: 'Failed to submit score' });
  }
});

module.exports = router;
