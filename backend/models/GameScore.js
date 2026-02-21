const mongoose = require('mongoose');

const gameScoreSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  gameId: {
    type: String,
    required: true
  },
  gameName: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  kills: {
    type: Number,
    default: 0
  },
  deaths: {
    type: Number,
    default: 0
  },
  isWin: {
    type: Boolean,
    default: false
  },
  rpChange: {
    type: Number,
    default: 0
  },
  coinsEarned: {
    type: Number,
    default: 0
  },
  mode: {
    type: String,
    enum: ['solo', 'duo', 'squad', 'tournament'],
    default: 'solo'
  },
  season: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient leaderboard queries
gameScoreSchema.index({ gameId: 1, score: -1 });
gameScoreSchema.index({ userId: 1, gameId: 1 });
gameScoreSchema.index({ season: 1 });

module.exports = mongoose.model('GameScore', gameScoreSchema);
