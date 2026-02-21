# NGGames Platform - Quick Start Guide

## 🚀 5-Minute Setup

### Step 1: Prerequisites Check
```bash
node --version  # Should be 18+
mongod --version  # Should be installed
git --version
```

### Step 2: Clone & Install
```bash
# Clone repository
git clone https://github.com/mirzaorhan2014-png/nggame.git
cd nggame

# Install dependencies
npm install
cd client && npm install && cd ..
```

### Step 3: Configure Environment
```bash
# Copy environment template
cp .env.example .env

# Edit .env file (use nano, vim, or any editor)
nano .env
```

**Minimal .env configuration:**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/nggames
JWT_SECRET=my_super_secret_key_12345
CLIENT_URL=http://localhost:5173
```

### Step 4: Start MongoDB
```bash
# Linux/Mac
mongod

# Or if using MongoDB service
sudo systemctl start mongod

# For MongoDB Atlas (cloud), just use the connection string in .env
```

### Step 5: Run the Platform
```bash
# Start both frontend and backend (recommended)
npm run dev

# OR run separately:
# Terminal 1: Backend
npm run server

# Terminal 2: Frontend  
npm run client
```

### Step 6: Access the Platform
Open your browser and navigate to:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

## 🎮 First Time User Journey

### 1. Register an Account
- Click "Register Now"
- Fill in username, email, password
- Select your country
- Start with 100 coins!

### 2. Or Try as Guest
- Click "Continue as Guest"
- Play games immediately
- No coins, no score saving

### 3. Explore Dashboard
- View your stats (Rank, RP, Coins)
- Quick access to all features
- Navigate to Games

### 4. Play Cyber Shooter
- Go to Games → Cyber Shooter
- Choose mode:
  - **Bot Mode**: Play against AI
  - **Online Match**: Find real opponent
  - **Private Room**: Play with friends
- Controls:
  - Arrow Keys: Move
  - Space: Shoot

### 5. Earn Rewards
- Win matches: +10 coins, +15 RP
- Climb ranks: Bronze → Silver → Gold → Platinum → Diamond → Legend
- Track your progress on leaderboards

## 📁 Project Structure at a Glance

```
nggame/
│
├── 📄 package.json          # Root dependencies
├── 📘 README.md             # Full documentation
├── 📘 DEPLOYMENT.md         # Deployment guide
├── 📘 CONTRIBUTING.md       # Contribution guide
├── 📄 .env.example          # Environment template
│
├── 🖥️ server/               # Backend (Node.js + Express)
│   ├── index.js            # Server entry point
│   ├── models/             # Database schemas
│   │   ├── User.js         # User model
│   │   ├── Clan.js         # Clan model
│   │   └── ...
│   ├── routes/             # API endpoints
│   │   ├── auth.js         # Auth routes
│   │   ├── games.js        # Game routes
│   │   └── ...
│   ├── middleware/         # Auth, validation
│   └── socket/             # Real-time features
│
└── 💻 client/               # Frontend (React + Vite)
    ├── package.json        # Frontend dependencies
    ├── index.html          # HTML entry
    ├── src/
    │   ├── App.jsx         # Main app
    │   ├── main.jsx        # React entry
    │   ├── pages/          # Page components
    │   │   ├── LoginPage.jsx
    │   │   ├── Dashboard.jsx
    │   │   └── ...
    │   ├── games/          # Game implementations
    │   │   └── ShooterGame.jsx
    │   ├── store/          # State management
    │   ├── utils/          # API, socket clients
    │   └── styles/         # CSS files
    └── vite.config.js      # Vite configuration
```

## 🎯 What Works Right Now

### ✅ Fully Functional
1. **User Registration & Login** - Create account or use guest mode
2. **Dashboard** - View stats, navigate features
3. **Cyber Shooter Game** - Play bot mode, online, or private rooms
4. **Matchmaking** - Find opponents for online play
5. **Private Rooms** - Share link with friends
6. **Coin System** - Earn coins from wins
7. **Rank System** - Gain/lose RP, rank up/down
8. **Real-time Features** - Live updates, online status
9. **Score Tracking** - Submit scores to leaderboard

### 🔄 Backend Ready (Frontend UI Pending)
1. **Store** - 15 cosmetic items ready to purchase
2. **Leaderboards** - Global, country, game, clan rankings
3. **Social** - Friends, messaging, block/report
4. **Clans** - Create, join, manage clans
5. **Tournaments** - Register for competitions
6. **Achievements** - Track unlockable achievements

## 🐛 Troubleshooting

### MongoDB Connection Error
```bash
# Check if MongoDB is running
sudo systemctl status mongod

# Start MongoDB
sudo systemctl start mongod

# Or use MongoDB Atlas (cloud)
# Update MONGODB_URI in .env with Atlas connection string
```

### Port Already in Use
```bash
# Change port in .env
PORT=3000  # Instead of 5000

# Or kill process using port
sudo lsof -ti:5000 | xargs kill -9
```

### Dependencies Error
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install

# Same for client
cd client
rm -rf node_modules package-lock.json
npm install
```

### Frontend Not Loading
```bash
# Check if backend is running on port 5000
curl http://localhost:5000/api/health

# Should return: {"status":"ok","message":"NGGames API is running"}

# Restart frontend
cd client
npm run dev
```

## 🔑 API Testing

### Test Registration
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "country": "United States"
  }'
```

### Test Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }'
```

### Test Health Check
```bash
curl http://localhost:5000/api/health
```

## 📱 Features Checklist

- [x] User registration
- [x] User login
- [x] Guest mode
- [x] JWT authentication
- [x] Dashboard
- [x] 1 working game (Shooter)
- [x] Bot mode
- [x] Online matchmaking
- [x] Private rooms
- [x] Coin system
- [x] Rank system
- [x] Score tracking
- [ ] Store UI
- [ ] Leaderboard UI
- [ ] Profile page
- [ ] 19 more games
- [ ] Tournament UI
- [ ] Clan UI
- [ ] Social UI
- [ ] AI Game Engine

## 🎓 Next Steps

### For Developers
1. Review code in `server/` and `client/src/`
2. Check API documentation in README.md
3. Read CONTRIBUTING.md for guidelines
4. Implement remaining games (framework ready)
5. Build frontend UI for Store, Leaderboards, etc.

### For Deployment
1. Read DEPLOYMENT.md
2. Setup production MongoDB
3. Configure environment variables
4. Use PM2 for process management
5. Setup Nginx as reverse proxy
6. Configure SSL with Let's Encrypt

### For Testing
1. Create test account
2. Play Cyber Shooter in all modes
3. Test guest mode limitations
4. Check coin earning
5. Verify rank progression
6. Test API endpoints

## 💡 Tips

- **Development**: Use `npm run dev` for hot reload
- **Production**: Run `npm run build` then `npm start`
- **Debugging**: Check browser console and server terminal
- **Database**: Use MongoDB Compass to view data
- **Testing**: Use Postman or curl for API testing

## 📞 Getting Help

- **Documentation**: See README.md
- **Issues**: Open GitHub issue
- **Questions**: Check CONTRIBUTING.md
- **API Docs**: See README.md API section

## 🎉 Success!

If you see the glassmorphism login page at http://localhost:5173, you're all set!

**Happy Gaming!** 🎮

---

Made with ❤️ for the gaming community