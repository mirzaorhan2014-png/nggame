# NGGames - Professional Gaming Platform 🎮

A fully functional, professional, scalable gaming platform built with modern technologies. Completely FREE with no paid membership required.

## 🌟 Features

### 🔐 Authentication System
- Glassmorphism-styled fullscreen login/register page
- Secure password hashing with bcrypt
- JWT token-based authentication
- Country selection during registration
- Guest Mode:
  - Play built-in games and online matches
  - Cannot earn coins, save scores, create games, or use AI system
  - Prompted to register when attempting restricted features

### 🎮 Built-In Games (20 Games)
- **Battle Royale Shooter** - Main game with:
  - Bot Mode
  - Online Matchmaking (WebSockets)
  - Private Room system with generated Map IDs
  - Smooth 60 FPS vector graphics
  - Particle effects and animations
- 19+ Additional games across multiple genres:
  - Racing, Platformer, Puzzle, Strategy, Fighting
  - Adventure, Sports, RPG, Survival, MOBA
  - Card, Rhythm, Stealth, Zombie, Space, Arcade, Trivia, Idle, Simulation

### 💰 Coin System
- Users start with 100 coins
- Earn coins from:
  - Match wins
  - Leaderboard placement
  - Tournament victories
  - Achievements
- Coins used for cosmetic items only

### 🛒 Store System
- Grid layout UI
- Purchase items:
  - Profile frames
  - Neon name effects
  - Avatars
  - Weapon skins (cosmetic only)
  - Bullet visual effects
- All purchases saved in database

### 🏅 Rank/League System
- **Rank Tiers**: Bronze → Silver → Gold → Platinum → Diamond → Legend
- RP (Rank Points) system:
  - Win = +25 RP (+ bonus based on score)
  - Loss = -15 RP
- Animated rank badges with colored names
- Track highest rank achieved

### ⏳ Season System
- 2-month season cycles
- Soft rank reset between seasons
- End-of-season rewards based on final rank
- Season badges saved in profile history

### 🌍 Leaderboards
- Per-game leaderboards
- Global leaderboard (all games combined)
- Country-based filtering
- Clan leaderboard
- Stores only highest score per user per game

### 📊 Statistics Dashboard
- Total matches played
- Win rate percentage
- K/D ratio
- Average score
- Highest rank achieved
- Performance charts (animated)

### 🏆 Tournament System
- Daily, Weekly, and Seasonal tournaments
- Automatic bracket generation (8/16/32 players)
- Live bracket UI
- Free participation for all
- Coin rewards and exclusive badges

### 🛡️ Clan System
- Create clans with name, tag, logo, description
- Role hierarchy:
  - Leader
  - Co-Leader
  - Moderator
  - Member
- Clan statistics tracking
- Clan Wars (3v3 / 5v5 modes)
- Real-time clan chat
- Clan leaderboards (global & country-based)

### 🤝 Social System
- Friend request system
- Friend list with online status indicator
- Real-time Direct Messaging (DM)
- Typing indicators
- Block & report system
- Profanity filter
- Anti-spam protection

### 🏅 Achievement System
- Multiple categories:
  - Game achievements
  - Rank achievements
  - Social achievements
  - Secret achievements
- Rewards: coins, XP, badges
- Completion percentage tracking

### 🤖 AI Game Engine
- Multi-step AI game creation system:
  1. Analyze game idea
  2. Generate structured game plan
  3. Create separate HTML, CSS, JS files
  4. Live preview in iframe
  5. Allow incremental updates
- **Registered users only**

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library
- **Vite** - Fast build tool
- **React Router** - Client-side routing
- **Framer Motion** - Smooth animations
- **Socket.io Client** - Real-time communication
- **Axios** - HTTP client
- **Recharts** - Animated charts

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **Socket.io** - WebSocket server
- **MongoDB** - Database (via Mongoose)
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing

### Design
- Glassmorphism UI
- Neon effects and gradients
- Futuristic color scheme
- Smooth 60 FPS animations
- Responsive design

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/mirzaorhan2014-png/nggame.git
cd nggame
```

2. **Install backend dependencies**
```bash
cd backend
npm install
```

3. **Install frontend dependencies**
```bash
cd ../frontend
npm install
```

4. **Configure environment variables**

Create `backend/.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/nggames
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

5. **Start MongoDB**
```bash
# If using local MongoDB
mongod
```

### Running the Application

1. **Start the backend server**
```bash
cd backend
npm start
# or for development with auto-reload:
npm run dev
```

2. **Start the frontend development server**
```bash
cd frontend
npm run dev
```

3. **Access the application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 📁 Project Structure

```
nggame/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Clan.js
│   │   ├── Item.js
│   │   ├── Achievement.js
│   │   ├── GameScore.js
│   │   ├── Tournament.js
│   │   └── Message.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── games.js
│   │   ├── store.js
│   │   └── social.js
│   ├── middleware/
│   │   └── auth.js
│   ├── utils/
│   │   └── generateToken.js
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   │   ├── AuthContext.jsx
│   │   │   └── SocketContext.jsx
│   │   ├── pages/
│   │   │   ├── Auth.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── GamesList.jsx
│   │   ├── games/
│   │   │   └── ShooterGame.jsx
│   │   ├── styles/
│   │   │   └── global.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── .gitignore
└── README.md
```

## 🎮 Game Controls

### Shooter Game
- **WASD / Arrow Keys** - Move player
- **Mouse** - Aim
- **Click** - Shoot

## 🔒 Security Features
- Password hashing with bcrypt
- JWT token authentication
- Protected API routes
- Input validation
- XSS protection
- CORS configuration

## 🌐 Real-Time Features
- Online status indicators
- Live matchmaking
- Real-time messaging
- Typing indicators
- Game state synchronization
- Clan chat

## 📈 Scalability
- MongoDB indexing for fast queries
- Efficient leaderboard aggregations
- Socket.io room-based architecture
- Stateless JWT authentication
- Modular code structure

## 🎨 Design Philosophy
- **Professional**: Esports-level quality
- **Modern**: Futuristic glassmorphism design
- **Smooth**: 60 FPS animations and particle effects
- **Responsive**: Works on all screen sizes
- **Accessible**: Clear UI with good contrast

## 🤝 Contributing
This is a demonstration project showcasing a full-stack gaming platform.

## 📄 License
MIT

## 🎉 Acknowledgments
Built with modern web technologies to demonstrate professional gaming platform architecture.

---

**Note**: This platform is 100% FREE with no paid membership required. All features are accessible to registered users!
