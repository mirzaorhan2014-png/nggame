const mongoose = require('mongoose');

const leaderboardSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  gameId: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  season: {
    type: Number,
    default: 1
  }
}, {
  timestamps: true
});

// Compound index for efficient queries
leaderboardSchema.index({ gameId: 1, score: -1 });
leaderboardSchema.index({ gameId: 1, country: 1, score: -1 });
leaderboardSchema.index({ user: 1, gameId: 1 }, { unique: true });

module.exports = mongoose.model('Leaderboard', leaderboardSchema);
