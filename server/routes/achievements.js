const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Achievement = require('../models/Achievement');

// Sample achievements
const achievements = [
  {
    id: 'first_win',
    name: 'First Victory',
    description: 'Win your first match',
    category: 'Game',
    icon: '🏆',
    rewards: { coins: 50, xp: 100 },
    requirement: 'Win 1 match'
  },
  {
    id: 'bronze_rank',
    name: 'Bronze Warrior',
    description: 'Reach Bronze rank',
    category: 'Rank',
    icon: '🥉',
    rewards: { coins: 100, xp: 200 },
    requirement: 'Reach Bronze rank'
  },
  {
    id: 'social_butterfly',
    name: 'Social Butterfly',
    description: 'Add 10 friends',
    category: 'Social',
    icon: '👥',
    rewards: { coins: 75, xp: 150 },
    requirement: 'Add 10 friends'
  }
];

// Get all achievements
router.get('/', async (req, res) => {
  try {
    res.json({ achievements });
  } catch (error) {
    console.error('Get achievements error:', error);
    res.status(500).json({ error: 'Failed to get achievements' });
  }
});

// Get user achievements
router.get('/user/:userId', async (req, res) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.params.userId).select('achievements username');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const userAchievements = user.achievements.map(ua => {
      const achievement = achievements.find(a => a.id === ua.achievementId);
      return {
        ...achievement,
        unlockedAt: ua.unlockedAt
      };
    });
    
    const completionPercentage = ((userAchievements.length / achievements.length) * 100).toFixed(1);
    
    res.json({ 
      achievements: userAchievements,
      total: achievements.length,
      unlocked: userAchievements.length,
      completionPercentage
    });
  } catch (error) {
    console.error('Get user achievements error:', error);
    res.status(500).json({ error: 'Failed to get achievements' });
  }
});

module.exports = router;
