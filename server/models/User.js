const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 20
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  country: {
    type: String,
    required: true
  },
  isGuest: {
    type: Boolean,
    default: false
  },
  
  // Profile
  avatar: {
    type: String,
    default: 'default-avatar.png'
  },
  profileFrame: {
    type: String,
    default: null
  },
  nameEffect: {
    type: String,
    default: null
  },
  bio: {
    type: String,
    maxlength: 200,
    default: ''
  },
  
  // Currency & Economy
  coins: {
    type: Number,
    default: 100
  },
  
  // Rank System
  rank: {
    type: String,
    enum: ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Legend'],
    default: 'Bronze'
  },
  rp: {
    type: Number,
    default: 0
  },
  
  // Season
  currentSeason: {
    type: Number,
    default: 1
  },
  seasonBadges: [{
    season: Number,
    rank: String,
    rp: Number
  }],
  
  // Statistics
  stats: {
    totalMatches: { type: Number, default: 0 },
    wins: { type: Number, default: 0 },
    losses: { type: Number, default: 0 },
    kills: { type: Number, default: 0 },
    deaths: { type: Number, default: 0 },
    highestRank: { type: String, default: 'Bronze' },
    totalCoinsEarned: { type: Number, default: 100 }
  },
  
  // Inventory
  inventory: {
    avatars: [String],
    profileFrames: [String],
    nameEffects: [String],
    weaponSkins: [String],
    bulletEffects: [String]
  },
  
  // Social
  friends: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  friendRequests: [{
    from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
    timestamp: { type: Date, default: Date.now }
  }],
  blockedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  
  // Clan
  clan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Clan',
    default: null
  },
  clanRole: {
    type: String,
    enum: ['Leader', 'Co-Leader', 'Moderator', 'Member'],
    default: null
  },
  
  // Achievements
  achievements: [{
    achievementId: String,
    unlockedAt: { type: Date, default: Date.now }
  }],
  
  // Status
  isOnline: {
    type: Boolean,
    default: false
  },
  lastSeen: {
    type: Date,
    default: Date.now
  },
  
  // Created games (for AI system)
  createdGames: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CustomGame'
  }]
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Calculate win rate
userSchema.virtual('winRate').get(function() {
  if (this.stats.totalMatches === 0) return 0;
  return ((this.stats.wins / this.stats.totalMatches) * 100).toFixed(2);
});

// Calculate K/D ratio
userSchema.virtual('kdRatio').get(function() {
  if (this.stats.deaths === 0) return this.stats.kills;
  return (this.stats.kills / this.stats.deaths).toFixed(2);
});

module.exports = mongoose.model('User', userSchema);
