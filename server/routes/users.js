const express = require('express');
const router = express.Router();
const { auth, requireRegistered } = require('../middleware/auth');
const User = require('../models/User');

// Get user profile
router.get('/:userId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select('-password -email')
      .populate('clan', 'name tag logo');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

// Update profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { avatar, profileFrame, nameEffect, bio } = req.body;
    
    if (avatar) req.user.avatar = avatar;
    if (profileFrame) req.user.profileFrame = profileFrame;
    if (nameEffect) req.user.nameEffect = nameEffect;
    if (bio !== undefined) req.user.bio = bio;
    
    await req.user.save();
    
    res.json({ message: 'Profile updated', user: req.user });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Get user statistics
router.get('/:userId/stats', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('stats username');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ 
      username: user.username,
      stats: user.stats 
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to get statistics' });
  }
});

module.exports = router;
