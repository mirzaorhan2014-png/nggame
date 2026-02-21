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
  coins: {
    type: Number,
    default: 100
  },
  rank: {
    tier: {
      type: String,
      enum: ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Legend'],
      default: 'Bronze'
    },
    points: {
      type: Number,
      default: 0
    }
  },
  season: {
    current: {
      type: Number,
      default: 1
    },
    badges: [{
      season: Number,
      rank: String,
      achievedAt: Date
    }]
  },
  stats: {
    totalMatches: { type: Number, default: 0 },
    wins: { type: Number, default: 0 },
    losses: { type: Number, default: 0 },
    kills: { type: Number, default: 0 },
    deaths: { type: Number, default: 0 },
    highestRank: { type: String, default: 'Bronze' }
  },
  inventory: {
    profileFrames: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }],
    nameEffects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }],
    avatars: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }],
    weaponSkins: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }],
    bulletEffects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }]
  },
  equipped: {
    profileFrame: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
    nameEffect: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
    avatar: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
    weaponSkin: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
    bulletEffect: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' }
  },
  achievements: [{
    achievementId: { type: mongoose.Schema.Types.ObjectId, ref: 'Achievement' },
    unlockedAt: Date,
    progress: Number
  }],
  friends: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['pending', 'accepted', 'blocked'], default: 'pending' },
    addedAt: Date
  }],
  clan: {
    clanId: { type: mongoose.Schema.Types.ObjectId, ref: 'Clan' },
    role: { type: String, enum: ['Leader', 'Co-Leader', 'Moderator', 'Member'] }
  },
  blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  online: {
    type: Boolean,
    default: false
  },
  lastSeen: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
