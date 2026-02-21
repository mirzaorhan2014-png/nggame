const mongoose = require('mongoose');
const Item = require('./models/Item');
const Achievement = require('./models/Achievement');
require('dotenv').config();

const connectDB = require('./config/db');

const seedItems = [
  // Profile Frames
  {
    name: 'Neon Frame',
    type: 'profileFrame',
    price: 100,
    rarity: 'Common',
    description: 'A glowing neon profile frame'
  },
  {
    name: 'Diamond Frame',
    type: 'profileFrame',
    price: 500,
    rarity: 'Epic',
    description: 'Sparkling diamond-studded frame'
  },
  {
    name: 'Legendary Dragon Frame',
    type: 'profileFrame',
    price: 2000,
    rarity: 'Legendary',
    description: 'Ancient dragon powers surround your profile'
  },
  // Name Effects
  {
    name: 'Rainbow Glow',
    type: 'nameEffect',
    price: 150,
    rarity: 'Rare',
    description: 'Your name glows with rainbow colors'
  },
  {
    name: 'Lightning Strike',
    type: 'nameEffect',
    price: 800,
    rarity: 'Epic',
    description: 'Crackling lightning surrounds your name'
  },
  {
    name: 'Cosmic Aura',
    type: 'nameEffect',
    price: 2500,
    rarity: 'Legendary',
    description: 'Stars and galaxies orbit your name'
  },
  // Avatars
  {
    name: 'Cyber Warrior',
    type: 'avatar',
    price: 200,
    rarity: 'Common',
    description: 'Futuristic warrior avatar'
  },
  {
    name: 'Neon Assassin',
    type: 'avatar',
    price: 600,
    rarity: 'Rare',
    description: 'Stealthy neon-lit assassin'
  },
  {
    name: 'Elite Commander',
    type: 'avatar',
    price: 1500,
    rarity: 'Epic',
    description: 'Elite military commander avatar'
  },
  // Weapon Skins
  {
    name: 'Chrome Finish',
    type: 'weaponSkin',
    price: 250,
    rarity: 'Common',
    description: 'Shiny chrome weapon skin'
  },
  {
    name: 'Plasma Coating',
    type: 'weaponSkin',
    price: 700,
    rarity: 'Rare',
    description: 'Glowing plasma weapon coating'
  },
  {
    name: 'Dragon Slayer',
    type: 'weaponSkin',
    price: 1800,
    rarity: 'Epic',
    description: 'Legendary dragon-themed weapon'
  },
  // Bullet Effects
  {
    name: 'Tracer Rounds',
    type: 'bulletEffect',
    price: 100,
    rarity: 'Common',
    description: 'Colored tracer bullet trails'
  },
  {
    name: 'Plasma Bolts',
    type: 'bulletEffect',
    price: 400,
    rarity: 'Rare',
    description: 'Energy plasma projectiles'
  },
  {
    name: 'Meteor Strike',
    type: 'bulletEffect',
    price: 1200,
    rarity: 'Epic',
    description: 'Bullets look like flaming meteors'
  }
];

const seedAchievements = [
  {
    name: 'First Blood',
    description: 'Get your first kill',
    category: 'game',
    requirement: { kills: 1 },
    rewards: { coins: 50, xp: 100, badge: 'first_blood' }
  },
  {
    name: 'Killing Spree',
    description: 'Get 100 kills',
    category: 'game',
    requirement: { kills: 100 },
    rewards: { coins: 500, xp: 1000, badge: 'killing_spree' }
  },
  {
    name: 'Victory!',
    description: 'Win your first match',
    category: 'game',
    requirement: { wins: 1 },
    rewards: { coins: 100, xp: 200, badge: 'first_win' }
  },
  {
    name: 'Champion',
    description: 'Win 50 matches',
    category: 'game',
    requirement: { wins: 50 },
    rewards: { coins: 1000, xp: 2000, badge: 'champion' }
  },
  {
    name: 'Silver Rank',
    description: 'Reach Silver rank',
    category: 'rank',
    requirement: { rank: 'Silver' },
    rewards: { coins: 200, xp: 500, badge: 'silver_rank' }
  },
  {
    name: 'Gold Rank',
    description: 'Reach Gold rank',
    category: 'rank',
    requirement: { rank: 'Gold' },
    rewards: { coins: 500, xp: 1000, badge: 'gold_rank' }
  },
  {
    name: 'Diamond Rank',
    description: 'Reach Diamond rank',
    category: 'rank',
    requirement: { rank: 'Diamond' },
    rewards: { coins: 1000, xp: 2000, badge: 'diamond_rank' }
  },
  {
    name: 'Legend Rank',
    description: 'Reach Legend rank',
    category: 'rank',
    requirement: { rank: 'Legend' },
    rewards: { coins: 2500, xp: 5000, badge: 'legend_rank' }
  },
  {
    name: 'Social Butterfly',
    description: 'Add 10 friends',
    category: 'social',
    requirement: { friends: 10 },
    rewards: { coins: 300, xp: 500, badge: 'social_butterfly' }
  },
  {
    name: 'Clan Master',
    description: 'Create or join a clan',
    category: 'social',
    requirement: { clan: true },
    rewards: { coins: 200, xp: 300, badge: 'clan_master' }
  },
  {
    name: 'Secret Achievement',
    description: '???',
    category: 'secret',
    requirement: { special: 'easter_egg' },
    rewards: { coins: 5000, xp: 10000, badge: 'secret_master' },
    isSecret: true
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();

    console.log('Clearing existing data...');
    await Item.deleteMany({});
    await Achievement.deleteMany({});

    console.log('Seeding items...');
    await Item.insertMany(seedItems);
    console.log(`✓ ${seedItems.length} items created`);

    console.log('Seeding achievements...');
    await Achievement.insertMany(seedAchievements);
    console.log(`✓ ${seedAchievements.length} achievements created`);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
