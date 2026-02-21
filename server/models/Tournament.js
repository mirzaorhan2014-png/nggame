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
    required: true
  },
  participants: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    seed: Number,
    currentRound: { type: Number, default: 0 },
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
      status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' }
    }]
  }],
  status: {
    type: String,
    enum: ['registration', 'in-progress', 'completed'],
    default: 'registration'
  },
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  rewards: {
    coins: Number,
    badge: String
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Tournament', tournamentSchema);
