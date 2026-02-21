const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['Game', 'Rank', 'Social', 'Secret'],
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  rewards: {
    coins: { type: Number, default: 0 },
    xp: { type: Number, default: 0 },
    badge: String
  },
  requirement: {
    type: String,
    required: true
  },
  isSecret: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Achievement', achievementSchema);
