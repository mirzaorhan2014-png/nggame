const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['game', 'rank', 'social', 'secret'],
    required: true
  },
  requirement: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  rewards: {
    coins: { type: Number, default: 0 },
    xp: { type: Number, default: 0 },
    badge: { type: String }
  },
  icon: {
    type: String
  },
  isSecret: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Achievement', achievementSchema);
