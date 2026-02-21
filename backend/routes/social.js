const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Message = require('../models/Message');
const { protect } = require('../middleware/auth');
const { socialLimiter } = require('../middleware/rateLimiter');

// @route   POST /api/social/friend-request
// @desc    Send friend request
// @access  Private
router.post('/friend-request', protect, socialLimiter, async (req, res) => {
  try {
    const { friendId } = req.body;

    if (!friendId) {
      return res.status(400).json({ message: 'Friend ID is required' });
    }

    if (friendId === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot add yourself as friend' });
    }

    const friend = await User.findById(friendId);
    if (!friend) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = await User.findById(req.user._id);

    // Check if already friends or request pending
    const existingFriend = user.friends.find(f => f.userId.toString() === friendId);
    if (existingFriend) {
      if (existingFriend.status === 'accepted') {
        return res.status(400).json({ message: 'Already friends' });
      }
      if (existingFriend.status === 'pending') {
        return res.status(400).json({ message: 'Friend request already sent' });
      }
    }

    // Add friend request
    user.friends.push({
      userId: friendId,
      status: 'pending',
      addedAt: Date.now()
    });

    // Add to friend's friend list
    friend.friends.push({
      userId: req.user._id,
      status: 'pending',
      addedAt: Date.now()
    });

    await user.save();
    await friend.save();

    res.json({ message: 'Friend request sent' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/social/friend-request/:friendId/accept
// @desc    Accept friend request
// @access  Private
router.put('/friend-request/:friendId/accept', protect, async (req, res) => {
  try {
    const { friendId } = req.params;

    const user = await User.findById(req.user._id);
    const friend = await User.findById(friendId);

    if (!friend) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update status to accepted for both users
    const userFriend = user.friends.find(f => f.userId.toString() === friendId);
    const friendUser = friend.friends.find(f => f.userId.toString() === req.user._id.toString());

    if (userFriend) userFriend.status = 'accepted';
    if (friendUser) friendUser.status = 'accepted';

    await user.save();
    await friend.save();

    res.json({ message: 'Friend request accepted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/social/friends
// @desc    Get friend list
// @access  Private
router.get('/friends', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('friends.userId', 'username online lastSeen rank');

    const friends = user.friends
      .filter(f => f.status === 'accepted')
      .map(f => ({
        userId: f.userId._id,
        username: f.userId.username,
        online: f.userId.online,
        lastSeen: f.userId.lastSeen,
        rank: f.userId.rank
      }));

    res.json(friends);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/social/messages
// @desc    Send a message
// @access  Private
router.post('/messages', protect, socialLimiter, async (req, res) => {
  try {
    const { receiverId, content } = req.body;

    if (!receiverId || !content) {
      return res.status(400).json({ message: 'Receiver and content are required' });
    }

    // Check if receiver exists
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: 'Receiver not found' });
    }

    // Check if blocked
    if (receiver.blockedUsers.includes(req.user._id)) {
      return res.status(403).json({ message: 'You are blocked by this user' });
    }

    const message = await Message.create({
      senderId: req.user._id,
      receiverId,
      content
    });

    res.status(201).json(message);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/social/messages/:userId
// @desc    Get messages with a specific user
// @access  Private
router.get('/messages/:userId', protect, async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 50 } = req.query;

    const messages = await Message.find({
      $or: [
        { senderId: req.user._id, receiverId: userId },
        { senderId: userId, receiverId: req.user._id }
      ]
    })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .populate('senderId', 'username')
      .populate('receiverId', 'username');

    res.json(messages.reverse());
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/social/block/:userId
// @desc    Block a user
// @access  Private
router.post('/block/:userId', protect, async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(req.user._id);

    if (user.blockedUsers.includes(userId)) {
      return res.status(400).json({ message: 'User already blocked' });
    }

    user.blockedUsers.push(userId);
    await user.save();

    res.json({ message: 'User blocked successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
