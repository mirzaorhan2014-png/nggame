const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// @route   GET /api/store/items
// @desc    Get all store items
// @access  Public
router.get('/items', async (req, res) => {
  try {
    const { type, rarity } = req.query;
    
    let query = { isAvailable: true };
    if (type) query.type = type;
    if (rarity) query.rarity = rarity;

    const items = await Item.find(query).sort({ rarity: 1, price: 1 });
    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/store/purchase/:itemId
// @desc    Purchase an item
// @access  Private
router.post('/purchase/:itemId', protect, async (req, res) => {
  try {
    const item = await Item.findById(req.params.itemId);
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (!item.isAvailable) {
      return res.status(400).json({ message: 'Item is not available' });
    }

    const user = await User.findById(req.user._id);

    // Check if user already owns the item
    const inventoryKey = `${item.type}s`;
    if (user.inventory[inventoryKey] && user.inventory[inventoryKey].includes(item._id)) {
      return res.status(400).json({ message: 'You already own this item' });
    }

    // Check if user has enough coins
    if (user.coins < item.price) {
      return res.status(400).json({ message: 'Insufficient coins' });
    }

    // Deduct coins and add item to inventory
    user.coins -= item.price;
    
    if (!user.inventory[inventoryKey]) {
      user.inventory[inventoryKey] = [];
    }
    user.inventory[inventoryKey].push(item._id);

    await user.save();

    res.json({
      message: 'Item purchased successfully',
      item,
      remainingCoins: user.coins
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/store/equip/:itemId
// @desc    Equip an item
// @access  Private
router.put('/equip/:itemId', protect, async (req, res) => {
  try {
    const item = await Item.findById(req.params.itemId);
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    const user = await User.findById(req.user._id);

    // Check if user owns the item
    const inventoryKey = `${item.type}s`;
    if (!user.inventory[inventoryKey] || !user.inventory[inventoryKey].includes(item._id)) {
      return res.status(400).json({ message: 'You do not own this item' });
    }

    // Equip the item
    user.equipped[item.type] = item._id;
    await user.save();

    res.json({
      message: 'Item equipped successfully',
      equipped: user.equipped
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/store/inventory
// @desc    Get user's inventory
// @access  Private
router.get('/inventory', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('inventory.profileFrames')
      .populate('inventory.nameEffects')
      .populate('inventory.avatars')
      .populate('inventory.weaponSkins')
      .populate('inventory.bulletEffects')
      .populate('equipped.profileFrame')
      .populate('equipped.nameEffect')
      .populate('equipped.avatar')
      .populate('equipped.weaponSkin')
      .populate('equipped.bulletEffect');

    res.json({
      inventory: user.inventory,
      equipped: user.equipped,
      coins: user.coins
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
