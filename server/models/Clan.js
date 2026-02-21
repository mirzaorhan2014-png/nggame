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
    trim: true,
    minlength: 2,
    maxlength: 5,
    uppercase: true
  },
  logo: {
    type: String,
    default: 'default-clan-logo.png'
  },
  description: {
    type: String,
    maxlength: 500,
    default: ''
  },
  
  leader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  members: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: { type: String, enum: ['Leader', 'Co-Leader', 'Moderator', 'Member'], default: 'Member' },
    joinedAt: { type: Date, default: Date.now }
  }],
  
  stats: {
    totalWins: { type: Number, default: 0 },
    totalLosses: { type: Number, default: 0 },
    totalKills: { type: Number, default: 0 },
    totalDeaths: { type: Number, default: 0 },
    clanWarsWon: { type: Number, default: 0 },
    clanWarsLost: { type: Number, default: 0 }
  },
  
  level: {
    type: Number,
    default: 1
  },
  
  experience: {
    type: Number,
    default: 0
  },
  
  maxMembers: {
    type: Number,
    default: 50
  }
}, {
  timestamps: true
});

// Calculate win rate
clanSchema.virtual('winRate').get(function() {
  const totalGames = this.stats.totalWins + this.stats.totalLosses;
  if (totalGames === 0) return 0;
  return ((this.stats.totalWins / totalGames) * 100).toFixed(2);
});

module.exports = mongoose.model('Clan', clanSchema);
