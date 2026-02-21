const express = require('express');
const router = express.Router();
const GameScore = require('../models/GameScore');
const User = require('../models/User');
const { protect, optional } = require('../middleware/auth');

// @route   POST /api/games/score
// @desc    Submit game score
// @access  Private
router.post('/score', protect, async (req, res) => {
  try {
    const { gameId, gameName, score, kills, deaths, isWin, mode } = req.body;

    if (!gameId || !gameName || score === undefined) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Calculate RP change
    let rpChange = 0;
    if (isWin) {
      rpChange = 25 + Math.floor(score / 100);
    } else {
      rpChange = -15;
    }

    // Calculate coins earned
    let coinsEarned = Math.floor(score / 10);
    if (isWin) coinsEarned += 50;

    // Get current season
    const currentSeason = 1; // TODO: Implement season management

    // Create game score
    const gameScore = await GameScore.create({
      userId: req.user._id,
      gameId,
      gameName,
      score,
      kills: kills || 0,
      deaths: deaths || 0,
      isWin: isWin || false,
      rpChange,
      coinsEarned,
      mode: mode || 'solo',
      season: currentSeason
    });

    // Update user stats
    const user = await User.findById(req.user._id);
    user.stats.totalMatches += 1;
    if (isWin) {
      user.stats.wins += 1;
    } else {
      user.stats.losses += 1;
    }
    user.stats.kills += kills || 0;
    user.stats.deaths += deaths || 0;

    // Update rank points
    user.rank.points += rpChange;
    if (user.rank.points < 0) user.rank.points = 0;

    // Update rank tier
    if (user.rank.points >= 2000 && user.rank.tier !== 'Legend') {
      user.rank.tier = 'Legend';
      user.stats.highestRank = 'Legend';
    } else if (user.rank.points >= 1500 && user.rank.tier !== 'Diamond' && user.rank.tier !== 'Legend') {
      user.rank.tier = 'Diamond';
      if (user.stats.highestRank === 'Platinum' || user.stats.highestRank === 'Gold' || 
          user.stats.highestRank === 'Silver' || user.stats.highestRank === 'Bronze') {
        user.stats.highestRank = 'Diamond';
      }
    } else if (user.rank.points >= 1000 && !['Diamond', 'Legend'].includes(user.rank.tier)) {
      user.rank.tier = 'Platinum';
      if (['Gold', 'Silver', 'Bronze'].includes(user.stats.highestRank)) {
        user.stats.highestRank = 'Platinum';
      }
    } else if (user.rank.points >= 600 && !['Platinum', 'Diamond', 'Legend'].includes(user.rank.tier)) {
      user.rank.tier = 'Gold';
      if (['Silver', 'Bronze'].includes(user.stats.highestRank)) {
        user.stats.highestRank = 'Gold';
      }
    } else if (user.rank.points >= 300 && !['Gold', 'Platinum', 'Diamond', 'Legend'].includes(user.rank.tier)) {
      user.rank.tier = 'Silver';
      if (user.stats.highestRank === 'Bronze') {
        user.stats.highestRank = 'Silver';
      }
    }

    // Update coins
    user.coins += coinsEarned;

    await user.save();

    res.status(201).json({
      gameScore,
      updatedStats: user.stats,
      updatedRank: user.rank,
      coinsEarned,
      totalCoins: user.coins
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/games/leaderboard/:gameId
// @desc    Get leaderboard for a specific game
// @access  Public
router.get('/leaderboard/:gameId', optional, async (req, res) => {
  try {
    const { gameId } = req.params;
    const { country, limit = 100 } = req.query;

    let matchCondition = { gameId };

    // Get highest score per user for this game
    const leaderboard = await GameScore.aggregate([
      { $match: matchCondition },
      {
        $group: {
          _id: '$userId',
          highestScore: { $max: '$score' },
          totalKills: { $sum: '$kills' },
          totalDeaths: { $sum: '$deaths' }
        }
      },
      { $sort: { highestScore: -1 } },
      { $limit: parseInt(limit) },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' }
    ]);

    // Filter by country if specified
    let filteredLeaderboard = leaderboard;
    if (country) {
      filteredLeaderboard = leaderboard.filter(entry => entry.user.country === country);
    }

    const formattedLeaderboard = filteredLeaderboard.map((entry, index) => ({
      rank: index + 1,
      userId: entry._id,
      username: entry.user.username,
      country: entry.user.country,
      score: entry.highestScore,
      kills: entry.totalKills,
      deaths: entry.totalDeaths,
      rankTier: entry.user.rank.tier
    }));

    res.json(formattedLeaderboard);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/games/leaderboard/global
// @desc    Get global leaderboard (all games combined)
// @access  Public
router.get('/leaderboard-global', optional, async (req, res) => {
  try {
    const { limit = 100 } = req.query;

    const users = await User.find()
      .select('username country rank stats')
      .sort({ 'rank.points': -1 })
      .limit(parseInt(limit));

    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      userId: user._id,
      username: user.username,
      country: user.country,
      rankTier: user.rank.tier,
      rankPoints: user.rank.points,
      wins: user.stats.wins,
      winRate: user.stats.totalMatches > 0 
        ? ((user.stats.wins / user.stats.totalMatches) * 100).toFixed(1) 
        : 0
    }));

    res.json(leaderboard);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/games/list
// @desc    Get list of all available games
// @access  Public
router.get('/list', (req, res) => {
  const games = [
    { id: 'shooter', name: 'Battle Royale Shooter', category: 'action', players: '1-50' },
    { id: 'racing', name: 'Neon Racing', category: 'racing', players: '1-8' },
    { id: 'platformer', name: 'Sky Runner', category: 'platformer', players: '1' },
    { id: 'puzzle', name: 'Block Master', category: 'puzzle', players: '1' },
    { id: 'strategy', name: 'Tower Defense Pro', category: 'strategy', players: '1' },
    { id: 'fighter', name: 'Arena Fighter', category: 'fighting', players: '1-2' },
    { id: 'adventure', name: 'Space Explorer', category: 'adventure', players: '1' },
    { id: 'sports', name: 'Cyber Soccer', category: 'sports', players: '1-22' },
    { id: 'rpg', name: 'Heroes Quest', category: 'rpg', players: '1' },
    { id: 'survival', name: 'Last Stand', category: 'survival', players: '1-4' },
    { id: 'moba', name: 'Arena Legends', category: 'moba', players: '10' },
    { id: 'card', name: 'Deck Masters', category: 'card', players: '1-4' },
    { id: 'rhythm', name: 'Beat Rush', category: 'rhythm', players: '1' },
    { id: 'stealth', name: 'Shadow Agent', category: 'stealth', players: '1' },
    { id: 'zombie', name: 'Zombie Outbreak', category: 'action', players: '1-4' },
    { id: 'space', name: 'Galaxy Wars', category: 'shooter', players: '1-16' },
    { id: 'arcade', name: 'Retro Blaster', category: 'arcade', players: '1-2' },
    { id: 'trivia', name: 'Brain Challenge', category: 'trivia', players: '1-10' },
    { id: 'idle', name: 'Empire Builder', category: 'idle', players: '1' },
    { id: 'simulation', name: 'Flight Simulator', category: 'simulation', players: '1' }
  ];

  res.json(games);
});

module.exports = router;
