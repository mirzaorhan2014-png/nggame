const mongoose = require('mongoose');

const clanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  tag: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    minlength: 2,
    maxlength: 5
  },
  logo: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    maxlength: 500
  },
  leader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: { type: String, enum: ['Leader', 'Co-Leader', 'Moderator', 'Member'], default: 'Member' },
    joinedAt: { type: Date, default: Date.now }
  }],
  stats: {
    totalWins: { type: Number, default: 0 },
    totalLosses: { type: Number, default: 0 },
    totalPoints: { type: Number, default: 0 }
  },
  level: {
    type: Number,
    default: 1
  },
  country: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Clan', clanSchema);
