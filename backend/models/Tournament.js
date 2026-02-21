const mongoose = require('mongoose');

const tournamentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['Daily', 'Weekly', 'Seasonal'],
    required: true
  },
  gameId: {
    type: String,
    required: true
  },
  maxPlayers: {
    type: Number,
    enum: [8, 16, 32],
    default: 16
  },
  participants: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    seed: Number,
    currentRound: Number,
    isEliminated: { type: Boolean, default: false }
  }],
  bracket: [{
    round: Number,
    matches: [{
      player1: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      player2: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      winner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      score1: Number,
      score2: Number,
      completed: { type: Boolean, default: false }
    }]
  }],
  status: {
    type: String,
    enum: ['open', 'in-progress', 'completed'],
    default: 'open'
  },
  rewards: {
    first: { coins: Number, badge: String },
    second: { coins: Number, badge: String },
    third: { coins: Number, badge: String }
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Tournament', tournamentSchema);
