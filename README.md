# NGGames - Professional Esports Gaming Platform 🎮

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)

A fully-featured, professional esports gaming platform with **20 built-in games**, AI game creation, tournaments, clans, and real-time multiplayer features.

## ✨ Features

### 🔐 Authentication System
- **Glassmorphism login page** with stunning animations
- User registration with country selection
- **Guest mode** for quick access (limited features)
- Secure JWT authentication with bcrypt password hashing
- Session management

### 🎮 Gaming Platform
- **20 built-in games** including:
  - Cyber Shooter (with bot mode & online PvP)
  - Neon Snake, Space Tetris, Cyber Pong
  - Galaxy Invaders, Racing, Fighting, Battle Royale
  - MOBA, Card Games, Chess, Trivia, and more!
- **WebSocket matchmaking** for instant online matches
- **Private rooms** with shareable Map IDs
- Real-time game synchronization
- Score tracking and leaderboards

### 🤖 AI Game Engine
- Multi-step AI-powered game creation
- Generate HTML, CSS, and JavaScript files
- Live preview iframe
- Incremental updates
- **Registered users only** feature

### 💰 Economy & Progression
- **Coin system** - Start with 100 coins
- Earn coins from:
  - Match wins (+10 coins)
  - Tournament victories (+100 coins)
  - Achievement unlocks
  - Leaderboard placements
- Cosmetic-only purchases (no pay-to-win)

### 🛒 Store System
- Profile avatars and frames
- Neon name effects
- Weapon skins (cosmetic)
- Bullet visual effects
- All items purchasable with earned coins

### 🏅 Rank System
- **6 Ranks**: Bronze → Silver → Gold → Platinum → Diamond → Legend
- **RP (Rank Points)** system
  - Win: +15 RP
  - Loss: -10 RP
- Animated rank badges
- Colored usernames based on rank
- Rank-based rewards

### ⏳ Season System
- **2-month seasons**
- Soft rank reset at season end
- End-of-season rewards
- Season badges saved in profile
- Historical season tracking

### 🌍 Leaderboards
- **Global leaderboard** (top 100 players)
- **Country-based leaderboards**
- **Per-game leaderboards** (20 games)
- **Clan leaderboards**
- Real-time updates
- Only highest score per game saved

### 📊 Statistics Dashboard
- Total matches played
- Win rate percentage
- K/D ratio tracking
- Average score
- Highest rank achieved
- Performance charts (coming soon)

### 🏆 Tournament System
- **Daily, Weekly, Seasonal** tournaments
- Automatic **8/16/32 player brackets**
- Live bracket visualization
- **Free participation** for all
- Coin rewards + exclusive badges
- Automated matchmaking

### 🛡️ Clan System
- Clan creation (name, tag, logo, description)
- **Role system**: Leader, Co-Leader, Moderator, Member
- Clan statistics tracking
- **Clan Wars** (3v3 / 5v5)
- Real-time clan chat
- Clan leaderboards (global & country)

### 🤝 Social Features
- Friend request system
- Friend list with **online status**
- **Real-time DM system**
- Typing indicators
- Block & report users
- **Profanity filter** using bad-words library
- Anti-spam protection

### 🏅 Achievement System
- **4 Categories**: Game, Rank, Social, Secret
- Achievement rewards:
  - Coins
  - XP
  - Exclusive badges
- Completion percentage tracking
- Progress visualization

## 🚀 Tech Stack

### Backend
- **Node.js** with Express.js
- **Socket.io** for real-time features
- **MongoDB** with Mongoose ODM
- **JWT** authentication
- **bcryptjs** for password hashing
- **Helmet** for security
- **Express Rate Limit** for API protection

### Frontend
- **React 18** with hooks
- **Vite** for fast development
- **React Router** for navigation
- **Zustand** for state management
- **Axios** for API calls
- **Framer Motion** for animations
- **Socket.io Client** for real-time
- **Recharts** for data visualization (coming soon)
- **Lucide React** for icons

### Design
- **Glassmorphism** UI style
- **Neon effects** and futuristic theme
- **Smooth animations** (60 FPS target)
- **Vector-based visuals**
- Fully responsive design

## 📦 Installation

### Prerequisites
- Node.js 18+ installed
- MongoDB installed and running (or MongoDB Atlas URI)
- Git

### Setup Instructions

1. **Clone the repository**
```bash
git clone https://github.com/mirzaorhan2014-png/nggame.git
cd nggame
```

2. **Install root dependencies**
```bash
npm install
```

3. **Install client dependencies**
```bash
cd client
npm install
cd ..
```

4. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/nggames
JWT_SECRET=your_super_secret_jwt_key_change_in_production
SESSION_SECRET=your_session_secret_change_in_production
CLIENT_URL=http://localhost:5173
INITIAL_COINS=100
WIN_COINS=10
TOURNAMENT_WIN_COINS=100
```

5. **Start MongoDB**
```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas cloud database
```

6. **Run the application**

**Development mode (recommended):**
```bash
npm run dev
```

This starts both the backend (port 5000) and frontend (port 5173) concurrently.

**Or run separately:**

Backend:
```bash
npm run server
```

Frontend:
```bash
npm run client
```

**Production mode:**
```bash
npm run build
npm start
```

7. **Access the platform**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- API Health: http://localhost:5000/api/health

## 🎯 Usage

### Creating an Account
1. Visit http://localhost:5173
2. Click "Register Now"
3. Fill in username, email, password, and select your country
4. Start with 100 coins!

### Guest Mode
1. Click "Continue as Guest"
2. Play built-in games
3. Join online matches
4. **Limitations**: Cannot earn coins, save scores, create games, or use AI system

### Playing Games
1. Navigate to "Games" from dashboard
2. Choose from 20 built-in games
3. Play solo or find online match
4. Create private rooms to play with friends

### Earning Coins
- Win matches: +10 coins
- Win tournaments: +100 coins
- Unlock achievements: Variable rewards
- Climb leaderboards: Bonus rewards

### Ranking Up
- Earn RP by winning matches
- Bronze (0-299 RP) → Silver (300-599 RP) → Gold (600-999 RP)
- Platinum (1000-1499 RP) → Diamond (1500-1999 RP) → Legend (2000+ RP)

### Using AI Game Engine (Registered Users Only)
1. Navigate to "AI Engine"
2. Describe your game idea
3. AI generates structured game plan
4. Creates HTML, CSS, JS files
5. Live preview in iframe
6. Make incremental updates

## 📁 Project Structure

```
nggame/
├── client/                 # React frontend
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── games/         # Game implementations
│   │   ├── store/         # State management (Zustand)
│   │   ├── utils/         # Utilities (API, socket)
│   │   ├── styles/        # Global styles
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/                # Node.js backend
│   ├── config/           # Configuration files
│   ├── models/           # Database models
│   │   ├── User.js
│   │   ├── Clan.js
│   │   ├── Tournament.js
│   │   ├── Leaderboard.js
│   │   ├── Achievement.js
│   │   └── Message.js
│   ├── routes/           # API routes
│   │   ├── auth.js
│   │   ├── games.js
│   │   ├── users.js
│   │   ├── store.js
│   │   ├── leaderboard.js
│   │   ├── clans.js
│   │   ├── tournaments.js
│   │   ├── social.js
│   │   └── achievements.js
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   │   └── auth.js
│   ├── socket/           # Socket.io handlers
│   │   └── index.js
│   ├── utils/            # Utility functions
│   └── index.js          # Server entry point
├── .env.example          # Environment template
├── .gitignore
├── package.json
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/guest` - Guest login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Games
- `GET /api/games` - List all games
- `GET /api/games/:gameId` - Get game details
- `POST /api/games/room/create` - Create private room

### Store
- `GET /api/store` - Get all store items
- `POST /api/store/purchase` - Purchase item
- `GET /api/store/inventory` - Get user inventory

### Leaderboard
- `GET /api/leaderboard/global` - Global leaderboard
- `GET /api/leaderboard/country/:country` - Country leaderboard
- `GET /api/leaderboard/game/:gameId` - Game leaderboard
- `GET /api/leaderboard/clans` - Clan leaderboard
- `POST /api/leaderboard/submit` - Submit score

### Social
- `POST /api/social/friends/request` - Send friend request
- `POST /api/social/friends/accept` - Accept request
- `GET /api/social/friends` - Get friends list
- `POST /api/social/messages` - Send message
- `GET /api/social/messages/:userId` - Get messages

(See full API documentation in `/docs/API.md` - coming soon)

## 🎨 Design Philosophy

- **Futuristic Esports Aesthetic**: Neon colors, glassmorphism, smooth animations
- **Professional Quality**: Not a hobby project - enterprise-grade architecture
- **Scalable**: Built to handle thousands of concurrent users
- **Accessible**: Guest mode for instant access, no barriers to entry
- **Fair**: Free-to-play, cosmetic-only purchases, no pay-to-win
- **Engaging**: Multiple progression systems, social features, tournaments

## 🛡️ Security Features

- Secure password hashing with bcrypt (10 salt rounds)
- JWT tokens with 7-day expiry (24h for guests)
- HTTP-only session management
- Helmet.js for HTTP security headers
- Express Rate Limiting
- Input validation with express-validator
- Profanity filtering (bad-words library)
- CORS configuration
- XSS protection
- MongoDB injection prevention

## 🔄 Real-time Features

All real-time features powered by Socket.io:

- Online/offline status
- Instant matchmaking
- Live game synchronization
- Real-time messaging
- Typing indicators
- Clan chat
- Tournament updates
- Leaderboard changes

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Inspired by professional esports platforms
- Built with modern web technologies
- Designed for the gaming community

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

**NGGames** - Play. Compete. Dominate. 🎮🏆
