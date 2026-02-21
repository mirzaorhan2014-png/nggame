# NGGames Platform - Setup Guide

## Quick Start

### Prerequisites
- Node.js v16 or higher
- MongoDB (local or cloud)
- Git

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/mirzaorhan2014-png/nggame.git
cd nggame

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment

Create `backend/.env` file:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/nggames
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### 3. Start MongoDB

**Option A: Local MongoDB**
```bash
mongod
```

**Option B: MongoDB Atlas (Cloud)**
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env`

### 4. Seed Database

```bash
cd backend
npm run seed
```

This will populate the database with:
- 15 store items (profile frames, name effects, avatars, weapon skins, bullet effects)
- 11 achievements

### 5. Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 6. Access the Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## First Time Setup

1. Open http://localhost:5173
2. Click "Register" to create an account
3. Fill in username, email, password, and select your country
4. You'll start with 100 coins!

## Testing Guest Mode

1. Click "Continue as Guest" on the login page
2. Guest users can:
   - Play all built-in games
   - Join online matches
3. Guests cannot:
   - Earn coins or save scores
   - Purchase items from store
   - Create games with AI Creator
   - Join clans or use social features

## Available Features

### 🎮 Games
- Navigate to "Games" from dashboard
- Play the Shooter Game with:
  - Bot Mode (fight AI enemies)
  - Online Matchmaking
  - Private Rooms (share room ID with friends)

### 🛒 Store
- Browse items by category
- Purchase with coins
- Equip purchased items

### 🏆 Leaderboards
- View global rankings
- Filter by game
- Filter by country

### 🤖 AI Creator (Registered Users Only)
- Enter game idea
- AI analyzes and creates game plan
- Generates HTML/CSS/JS code
- Preview live in browser

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/guest` - Create guest session
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/logout` - Logout user

### Games
- `GET /api/games/list` - Get all games
- `POST /api/games/score` - Submit game score
- `GET /api/games/leaderboard/:gameId` - Game leaderboard
- `GET /api/games/leaderboard-global` - Global leaderboard

### Store
- `GET /api/store/items` - Get store items
- `POST /api/store/purchase/:itemId` - Purchase item
- `PUT /api/store/equip/:itemId` - Equip item
- `GET /api/store/inventory` - Get user inventory

### Social
- `POST /api/social/friend-request` - Send friend request
- `PUT /api/social/friend-request/:friendId/accept` - Accept friend request
- `GET /api/social/friends` - Get friend list
- `POST /api/social/messages` - Send message
- `GET /api/social/messages/:userId` - Get messages
- `POST /api/social/block/:userId` - Block user

## WebSocket Events

### Connection
- `user:online` - User comes online
- `user:status` - Online status update

### Messaging
- `message:send` - Send message
- `message:receive` - Receive message
- `message:typing` - Typing indicator

### Gaming
- `game:findMatch` - Find online match
- `game:createRoom` - Create private room
- `game:joinRoom` - Join private room
- `game:start` - Game starts
- `game:update` - Game state update

### Clans
- `clan:joinChat` - Join clan chat
- `clan:message` - Send clan message

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env`
- For Atlas, whitelist your IP address

### Port Already in Use
```bash
# Change ports in configuration files
# Backend: backend/.env (PORT=5000)
# Frontend: frontend/vite.config.js (port: 5173)
```

### Dependencies Not Installing
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Development Tips

### Hot Reload
Both frontend and backend support hot reload:
- Frontend: Vite automatically reloads
- Backend: Nodemon watches for changes

### Database Reset
```bash
# Drop database and reseed
mongo nggames --eval "db.dropDatabase()"
cd backend
npm run seed
```

### Adding New Items
Edit `backend/seed.js` and run:
```bash
npm run seed
```

## Production Deployment

### Environment Variables
Update these for production:
- `JWT_SECRET` - Use strong random string
- `MONGODB_URI` - Production database URL
- `CLIENT_URL` - Production frontend URL
- `NODE_ENV=production`

### Build Frontend
```bash
cd frontend
npm run build
```

### Start Backend
```bash
cd backend
npm start
```

## Support

For issues or questions:
- Check existing GitHub issues
- Create new issue with details
- Include error messages and logs

## Next Steps

1. ✅ Register an account
2. ✅ Play the Shooter game
3. ✅ Earn coins from wins
4. ✅ Buy items from store
5. ✅ Check leaderboards
6. ✅ Try AI Creator
7. ⏳ Invite friends
8. ⏳ Join/create a clan
9. ⏳ Participate in tournaments

Enjoy NGGames! 🎮🚀
