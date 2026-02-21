const express = require('express');
const router = express.Router();
const { auth, requireRegistered } = require('../middleware/auth');

// Store items data
const storeItems = {
  avatars: [
    { id: 'avatar_1', name: 'Cyber Warrior', price: 500, image: 'avatar1.png' },
    { id: 'avatar_2', name: 'Neon Knight', price: 750, image: 'avatar2.png' },
    { id: 'avatar_3', name: 'Galaxy Hunter', price: 1000, image: 'avatar3.png' }
  ],
  profileFrames: [
    { id: 'frame_1', name: 'Gold Frame', price: 300, image: 'frame1.png' },
    { id: 'frame_2', name: 'Diamond Frame', price: 800, image: 'frame2.png' },
    { id: 'frame_3', name: 'Legend Frame', price: 1500, image: 'frame3.png' }
  ],
  nameEffects: [
    { id: 'effect_1', name: 'Neon Glow', price: 400, color: '#00ff00' },
    { id: 'effect_2', name: 'Fire Blaze', price: 600, color: '#ff4400' },
    { id: 'effect_3', name: 'Ice Frost', price: 600, color: '#00ddff' }
  ],
  weaponSkins: [
    { id: 'skin_1', name: 'Chrome Finish', price: 500, image: 'skin1.png' },
    { id: 'skin_2', name: 'Dragon Scale', price: 1000, image: 'skin2.png' },
    { id: 'skin_3', name: 'Plasma Core', price: 1500, image: 'skin3.png' }
  ],
  bulletEffects: [
    { id: 'bullet_1', name: 'Tracer Rounds', price: 250, color: '#ff0000' },
    { id: 'bullet_2', name: 'Lightning Bolt', price: 500, color: '#ffff00' },
    { id: 'bullet_3', name: 'Cosmic Trail', price: 750, color: '#ff00ff' }
  ]
};

// Get all store items
router.get('/', auth, (req, res) => {
  res.json({ items: storeItems });
});

// Purchase item
router.post('/purchase', auth, requireRegistered, async (req, res) => {
  try {
    const { itemId, itemType } = req.body;
    
    // Find item
    const items = storeItems[itemType];
    if (!items) {
      return res.status(400).json({ error: 'Invalid item type' });
    }
    
    const item = items.find(i => i.id === itemId);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    // Check if user has enough coins
    if (req.user.coins < item.price) {
      return res.status(400).json({ error: 'Insufficient coins' });
    }
    
    // Check if user already owns the item
    const inventoryKey = itemType;
    if (req.user.inventory[inventoryKey]?.includes(itemId)) {
      return res.status(400).json({ error: 'You already own this item' });
    }
    
    // Deduct coins and add item to inventory
    req.user.coins -= item.price;
    if (!req.user.inventory[inventoryKey]) {
      req.user.inventory[inventoryKey] = [];
    }
    req.user.inventory[inventoryKey].push(itemId);
    
    await req.user.save();
    
    res.json({
      message: 'Purchase successful',
      item,
      remainingCoins: req.user.coins,
      inventory: req.user.inventory
    });
  } catch (error) {
    console.error('Purchase error:', error);
    res.status(500).json({ error: 'Purchase failed' });
  }
});

// Get user inventory
router.get('/inventory', auth, (req, res) => {
  res.json({ 
    inventory: req.user.inventory,
    coins: req.user.coins 
  });
});

module.exports = router;
