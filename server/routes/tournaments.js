const express = require('express');
const router = express.Router();
const { auth, requireRegistered } = require('../middleware/auth');
const Tournament = require('../models/Tournament');

// Get active tournaments
router.get('/', async (req, res) => {
  try {
    const tournaments = await Tournament.find({ 
      status: { $in: ['registration', 'in-progress'] } 
    })
    .populate('participants.user', 'username avatar rank')
    .sort({ startDate: 1 });
    
    res.json({ tournaments });
  } catch (error) {
    console.error('Get tournaments error:', error);
    res.status(500).json({ error: 'Failed to get tournaments' });
  }
});

// Register for tournament
router.post('/:tournamentId/register', auth, requireRegistered, async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.tournamentId);
    
    if (!tournament) {
      return res.status(404).json({ error: 'Tournament not found' });
    }
    
    if (tournament.status !== 'registration') {
      return res.status(400).json({ error: 'Registration is closed' });
    }
    
    if (tournament.participants.length >= tournament.maxPlayers) {
      return res.status(400).json({ error: 'Tournament is full' });
    }
    
    // Check if already registered
    const alreadyRegistered = tournament.participants.some(p => p.user.equals(req.userId));
    if (alreadyRegistered) {
      return res.status(400).json({ error: 'Already registered' });
    }
    
    tournament.participants.push({
      user: req.userId,
      seed: tournament.participants.length + 1
    });
    
    await tournament.save();
    
    res.json({ message: 'Registered for tournament', tournament });
  } catch (error) {
    console.error('Register tournament error:', error);
    res.status(500).json({ error: 'Failed to register' });
  }
});

// Get tournament details
router.get('/:tournamentId', async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.tournamentId)
      .populate('participants.user', 'username avatar rank')
      .populate('winner', 'username avatar rank')
      .populate('bracket.matches.player1', 'username avatar')
      .populate('bracket.matches.player2', 'username avatar')
      .populate('bracket.matches.winner', 'username avatar');
    
    if (!tournament) {
      return res.status(404).json({ error: 'Tournament not found' });
    }
    
    res.json({ tournament });
  } catch (error) {
    console.error('Get tournament error:', error);
    res.status(500).json({ error: 'Failed to get tournament' });
  }
});

module.exports = router;
