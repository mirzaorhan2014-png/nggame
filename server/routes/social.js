const express = require('express');
const router = express.Router();
const { auth, requireRegistered } = require('../middleware/auth');
const User = require('../models/User');
const Message = require('../models/Message');

// Send friend request
router.post('/friends/request', auth, requireRegistered, async (req, res) => {
  try {
    const { userId } = req.body;
    
    if (userId === req.userId.toString()) {
      return res.status(400).json({ error: 'Cannot add yourself' });
    }
    
    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Check if already friends
    if (req.user.friends.includes(userId)) {
      return res.status(400).json({ error: 'Already friends' });
    }
    
    // Check if request already sent
    const existingRequest = targetUser.friendRequests.find(
      r => r.from.equals(req.userId) && r.status === 'pending'
    );
    
    if (existingRequest) {
      return res.status(400).json({ error: 'Request already sent' });
    }
    
    targetUser.friendRequests.push({
      from: req.userId,
      status: 'pending'
    });
    
    await targetUser.save();
    
    res.json({ message: 'Friend request sent' });
  } catch (error) {
    console.error('Friend request error:', error);
    res.status(500).json({ error: 'Failed to send request' });
  }
});

// Accept friend request
router.post('/friends/accept', auth, requireRegistered, async (req, res) => {
  try {
    const { requestId } = req.body;
    
    const request = req.user.friendRequests.id(requestId);
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }
    
    request.status = 'accepted';
    req.user.friends.push(request.from);
    await req.user.save();
    
    // Add to sender's friends too
    const sender = await User.findById(request.from);
    sender.friends.push(req.userId);
    await sender.save();
    
    res.json({ message: 'Friend request accepted' });
  } catch (error) {
    console.error('Accept friend error:', error);
    res.status(500).json({ error: 'Failed to accept request' });
  }
});

// Get friends list
router.get('/friends', auth, requireRegistered, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .populate('friends', 'username avatar rank isOnline lastSeen');
    
    res.json({ friends: user.friends });
  } catch (error) {
    console.error('Get friends error:', error);
    res.status(500).json({ error: 'Failed to get friends' });
  }
});

// Send message
router.post('/messages', auth, requireRegistered, async (req, res) => {
  try {
    const { receiverId, content } = req.body;
    
    const message = new Message({
      sender: req.userId,
      receiver: receiverId,
      content: content.trim()
    });
    
    await message.save();
    
    // Emit socket event for real-time delivery
    const io = req.app.get('io');
    io.to(receiverId).emit('new-message', {
      message: await message.populate('sender', 'username avatar')
    });
    
    res.json({ message: 'Message sent', data: message });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Get messages with a user
router.get('/messages/:userId', auth, requireRegistered, async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 50 } = req.query;
    
    const messages = await Message.find({
      $or: [
        { sender: req.userId, receiver: userId },
        { sender: userId, receiver: req.userId }
      ]
    })
    .sort({ createdAt: -1 })
    .limit(parseInt(limit))
    .populate('sender', 'username avatar')
    .populate('receiver', 'username avatar');
    
    res.json({ messages: messages.reverse() });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Failed to get messages' });
  }
});

// Block user
router.post('/block', auth, requireRegistered, async (req, res) => {
  try {
    const { userId } = req.body;
    
    if (!req.user.blockedUsers.includes(userId)) {
      req.user.blockedUsers.push(userId);
      await req.user.save();
    }
    
    res.json({ message: 'User blocked' });
  } catch (error) {
    console.error('Block user error:', error);
    res.status(500).json({ error: 'Failed to block user' });
  }
});

module.exports = router;
