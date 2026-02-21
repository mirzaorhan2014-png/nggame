const express = require('express');
const router = express.Router();
const { auth, requireRegistered } = require('../middleware/auth');
const Clan = require('../models/Clan');
const User = require('../models/User');

// Create clan
router.post('/', auth, requireRegistered, async (req, res) => {
  try {
    const { name, tag, logo, description } = req.body;
    
    // Check if user is already in a clan
    if (req.user.clan) {
      return res.status(400).json({ error: 'You are already in a clan' });
    }
    
    // Check if clan name or tag exists
    const existing = await Clan.findOne({ $or: [{ name }, { tag: tag.toUpperCase() }] });
    if (existing) {
      return res.status(400).json({ error: 'Clan name or tag already exists' });
    }
    
    const clan = new Clan({
      name,
      tag: tag.toUpperCase(),
      logo: logo || 'default-clan-logo.png',
      description,
      leader: req.userId,
      members: [{
        user: req.userId,
        role: 'Leader',
        joinedAt: new Date()
      }]
    });
    
    await clan.save();
    
    // Update user
    req.user.clan = clan._id;
    req.user.clanRole = 'Leader';
    await req.user.save();
    
    res.status(201).json({ message: 'Clan created', clan });
  } catch (error) {
    console.error('Create clan error:', error);
    res.status(500).json({ error: 'Failed to create clan' });
  }
});

// Get clan details
router.get('/:clanId', async (req, res) => {
  try {
    const clan = await Clan.findById(req.params.clanId)
      .populate('leader', 'username avatar rank')
      .populate('members.user', 'username avatar rank stats.wins stats.totalMatches');
    
    if (!clan) {
      return res.status(404).json({ error: 'Clan not found' });
    }
    
    res.json({ clan });
  } catch (error) {
    console.error('Get clan error:', error);
    res.status(500).json({ error: 'Failed to get clan' });
  }
});

// Join clan (requires invitation in real implementation)
router.post('/:clanId/join', auth, requireRegistered, async (req, res) => {
  try {
    if (req.user.clan) {
      return res.status(400).json({ error: 'You are already in a clan' });
    }
    
    const clan = await Clan.findById(req.params.clanId);
    if (!clan) {
      return res.status(404).json({ error: 'Clan not found' });
    }
    
    if (clan.members.length >= clan.maxMembers) {
      return res.status(400).json({ error: 'Clan is full' });
    }
    
    clan.members.push({
      user: req.userId,
      role: 'Member',
      joinedAt: new Date()
    });
    await clan.save();
    
    req.user.clan = clan._id;
    req.user.clanRole = 'Member';
    await req.user.save();
    
    res.json({ message: 'Joined clan', clan });
  } catch (error) {
    console.error('Join clan error:', error);
    res.status(500).json({ error: 'Failed to join clan' });
  }
});

// Leave clan
router.post('/leave', auth, requireRegistered, async (req, res) => {
  try {
    if (!req.user.clan) {
      return res.status(400).json({ error: 'You are not in a clan' });
    }
    
    const clan = await Clan.findById(req.user.clan);
    if (!clan) {
      return res.status(404).json({ error: 'Clan not found' });
    }
    
    // Can't leave if you're the leader and there are other members
    if (req.user.clanRole === 'Leader' && clan.members.length > 1) {
      return res.status(400).json({ error: 'Transfer leadership before leaving' });
    }
    
    // Remove member
    clan.members = clan.members.filter(m => !m.user.equals(req.userId));
    
    // Delete clan if no members left
    if (clan.members.length === 0) {
      await Clan.findByIdAndDelete(clan._id);
    } else {
      await clan.save();
    }
    
    req.user.clan = null;
    req.user.clanRole = null;
    await req.user.save();
    
    res.json({ message: 'Left clan' });
  } catch (error) {
    console.error('Leave clan error:', error);
    res.status(500).json({ error: 'Failed to leave clan' });
  }
});

module.exports = router;
