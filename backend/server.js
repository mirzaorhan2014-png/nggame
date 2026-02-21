require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/db');
const { apiLimiter } = require('./middleware/rateLimiter');

// Initialize app
const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Apply rate limiting to all API routes
app.use('/api/', apiLimiter);

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/games', require('./routes/games'));
app.use('/api/store', require('./routes/store'));
app.use('/api/social', require('./routes/social'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'NGGames API is running' });
});

// Socket.io connection handling
const activeUsers = new Map();
const gameRooms = new Map();

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // User online
  socket.on('user:online', (userId) => {
    activeUsers.set(userId, socket.id);
    socket.userId = userId;
    io.emit('user:status', { userId, online: true });
  });

  // User offline
  socket.on('disconnect', () => {
    if (socket.userId) {
      activeUsers.delete(socket.userId);
      io.emit('user:status', { userId: socket.userId, online: false });
    }
    console.log('Client disconnected:', socket.id);
  });

  // Real-time messaging
  socket.on('message:send', (data) => {
    const { receiverId, message } = data;
    const receiverSocketId = activeUsers.get(receiverId);
    
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('message:receive', message);
    }
  });

  // Typing indicator
  socket.on('message:typing', (data) => {
    const { receiverId, isTyping } = data;
    const receiverSocketId = activeUsers.get(receiverId);
    
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('message:typing', {
        userId: socket.userId,
        isTyping
      });
    }
  });

  // Game matchmaking
  socket.on('game:findMatch', (data) => {
    const { gameId, mode } = data;
    const roomKey = `${gameId}_${mode}`;
    
    let room = gameRooms.get(roomKey);
    
    if (!room) {
      room = {
        players: [],
        maxPlayers: mode === 'solo' ? 1 : mode === 'duo' ? 2 : 4,
        gameId,
        mode
      };
      gameRooms.set(roomKey, room);
    }

    if (room.players.length < room.maxPlayers) {
      room.players.push({
        socketId: socket.id,
        userId: socket.userId
      });
      
      socket.join(roomKey);
      
      if (room.players.length === room.maxPlayers) {
        // Start game
        io.to(roomKey).emit('game:start', {
          roomId: roomKey,
          players: room.players
        });
      } else {
        socket.emit('game:waiting', {
          current: room.players.length,
          max: room.maxPlayers
        });
      }
    }
  });

  // Private room creation
  socket.on('game:createRoom', (data) => {
    const { gameId, roomId, maxPlayers } = data;
    
    const room = {
      id: roomId,
      host: socket.userId,
      players: [{
        socketId: socket.id,
        userId: socket.userId
      }],
      maxPlayers: maxPlayers || 4,
      gameId,
      isPrivate: true
    };
    
    gameRooms.set(roomId, room);
    socket.join(roomId);
    
    socket.emit('game:roomCreated', { roomId, room });
  });

  // Join private room
  socket.on('game:joinRoom', (data) => {
    const { roomId } = data;
    const room = gameRooms.get(roomId);
    
    if (!room) {
      socket.emit('game:error', { message: 'Room not found' });
      return;
    }
    
    if (room.players.length >= room.maxPlayers) {
      socket.emit('game:error', { message: 'Room is full' });
      return;
    }
    
    room.players.push({
      socketId: socket.id,
      userId: socket.userId
    });
    
    socket.join(roomId);
    io.to(roomId).emit('game:playerJoined', {
      userId: socket.userId,
      players: room.players
    });
  });

  // Game state updates
  socket.on('game:update', (data) => {
    const { roomId, gameState } = data;
    socket.to(roomId).emit('game:stateUpdate', gameState);
  });

  // Clan chat
  socket.on('clan:joinChat', (clanId) => {
    socket.join(`clan_${clanId}`);
  });

  socket.on('clan:message', (data) => {
    const { clanId, message } = data;
    io.to(`clan_${clanId}`).emit('clan:newMessage', message);
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app, server, io };
