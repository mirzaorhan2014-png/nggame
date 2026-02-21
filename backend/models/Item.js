const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['profileFrame', 'nameEffect', 'avatar', 'weaponSkin', 'bulletEffect'],
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  rarity: {
    type: String,
    enum: ['Common', 'Rare', 'Epic', 'Legendary'],
    default: 'Common'
  },
  description: {
    type: String
  },
  imageUrl: {
    type: String
  },
  effectData: {
    type: mongoose.Schema.Types.Mixed
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Item', itemSchema);
