const express = require('express');
const router = express.Router();
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { protect } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public
router.post('/register', authLimiter, async (req, res) => {
  try {
    const { username, email, password, country } = req.body;

    // Validation
    if (!username || !email || !password || !country) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Check if user exists
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password,
      country,
      coins: 100
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        country: user.country,
        coins: user.coins,
        rank: user.rank,
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', authLimiter, async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Please provide username and password' });
    }

    // Check for user
    const user = await User.findOne({ username });

    if (user && (await user.matchPassword(password))) {
      // Update online status
      user.online = true;
      user.lastSeen = Date.now();
      await user.save();

      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        country: user.country,
        coins: user.coins,
        rank: user.rank,
        stats: user.stats,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/auth/guest
// @desc    Create guest session
// @access  Public
router.post('/guest', async (req, res) => {
  try {
    const { v4: uuidv4 } = require('uuid');
    const guestId = `guest_${Date.now()}_${uuidv4().substring(0, 8)}`;
    
    res.json({
      _id: guestId,
      username: `Guest_${Math.random().toString(36).substr(2, 6)}`,
      isGuest: true,
      coins: 0,
      message: 'Guest session created. Register to save progress and unlock all features.'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/auth/logout
// @desc    Logout user
// @access  Private
router.put('/logout', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.online = false;
    user.lastSeen = Date.now();
    await user.save();

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
