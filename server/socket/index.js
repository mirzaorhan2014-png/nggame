const User = require('./models/User');
const Filter = require('bad-words');
const filter = new Filter();

const onlineUsers = new Map(); // userId -> socketId
const gameRooms = new Map(); // roomId -> { players: [], gameData: {} }

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    
    // User authentication and online status
    socket.on('user-online', async (userId) => {
      try {
        onlineUsers.set(userId, socket.id);
        socket.userId = userId;
        socket.join(`user-${userId}`);
        
        // Update user online status
        await User.findByIdAndUpdate(userId, { isOnline: true });
        
        // Notify friends
        const user = await User.findById(userId).populate('friends');
        user.friends.forEach(friend => {
          const friendSocketId = onlineUsers.get(friend._id.toString());
          if (friendSocketId) {
            io.to(friendSocketId).emit('friend-online', { userId, username: user.username });
          }
        });
      } catch (error) {
        console.error('User online error:', error);
      }
    });
    
    // Matchmaking
    socket.on('find-match', async ({ gameId, userId }) => {
      socket.join(`matchmaking-${gameId}`);
      
      const room = `matchmaking-${gameId}`;
      const sockets = await io.in(room).fetchSockets();
      
      // If 2+ players waiting, create match
      if (sockets.length >= 2) {
        const player1 = sockets[0];
        const player2 = sockets[1];
        
        const roomId = `match_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        player1.leave(`matchmaking-${gameId}`);
        player2.leave(`matchmaking-${gameId}`);
        
        player1.join(roomId);
        player2.join(roomId);
        
        io.to(player1.id).emit('match-found', { roomId, opponentId: player2.userId });
        io.to(player2.id).emit('match-found', { roomId, opponentId: player1.userId });
        
        gameRooms.set(roomId, {
          gameId,
          players: [player1.userId, player2.userId],
          startTime: Date.now()
        });
      }
    });
    
    // Cancel matchmaking
    socket.on('cancel-match', ({ gameId }) => {
      socket.leave(`matchmaking-${gameId}`);
    });
    
    // Join private room
    socket.on('join-room', ({ roomId, userId }) => {
      socket.join(roomId);
      
      const room = gameRooms.get(roomId) || { players: [] };
      if (!room.players.includes(userId)) {
        room.players.push(userId);
        gameRooms.set(roomId, room);
      }
      
      // Notify others in room
      socket.to(roomId).emit('player-joined', { userId });
      
      // Send current room state
      io.to(socket.id).emit('room-state', gameRooms.get(roomId));
    });
    
    // Game events (position, actions, etc.)
    socket.on('game-action', ({ roomId, action, data }) => {
      socket.to(roomId).emit('game-action', { userId: socket.userId, action, data });
    });
    
    // Game position update
    socket.on('player-move', ({ roomId, position }) => {
      socket.to(roomId).emit('opponent-move', { userId: socket.userId, position });
    });
    
    // Game shoot event (for shooter)
    socket.on('player-shoot', ({ roomId, bullet }) => {
      socket.to(roomId).emit('opponent-shoot', { userId: socket.userId, bullet });
    });
    
    // Match result
    socket.on('match-end', async ({ roomId, winnerId, loserId, stats }) => {
      try {
        // Update winner stats
        const winner = await User.findById(winnerId);
        if (winner && !winner.isGuest) {
          winner.stats.wins += 1;
          winner.stats.totalMatches += 1;
          winner.stats.kills += stats.winnerKills || 0;
          winner.stats.deaths += stats.winnerDeaths || 0;
          winner.coins += 10; // Win bonus
          winner.rp += 15; // RP gain
          
          // Check for rank up
          updateRank(winner);
          
          await winner.save();
        }
        
        // Update loser stats
        const loser = await User.findById(loserId);
        if (loser && !loser.isGuest) {
          loser.stats.losses += 1;
          loser.stats.totalMatches += 1;
          loser.stats.kills += stats.loserKills || 0;
          loser.stats.deaths += stats.loserDeaths || 0;
          loser.rp -= 10; // RP loss
          if (loser.rp < 0) loser.rp = 0;
          
          updateRank(loser);
          
          await loser.save();
        }
        
        // Notify both players
        io.to(roomId).emit('match-result', {
          winnerId,
          loserId,
          stats
        });
        
        // Clean up room
        gameRooms.delete(roomId);
      } catch (error) {
        console.error('Match end error:', error);
      }
    });
    
    // Real-time messaging
    socket.on('send-message', async ({ receiverId, content }) => {
      try {
        // Filter profanity
        const cleanContent = filter.clean(content);
        
        const receiverSocketId = onlineUsers.get(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('receive-message', {
            senderId: socket.userId,
            content: cleanContent,
            timestamp: new Date()
          });
        }
      } catch (error) {
        console.error('Send message error:', error);
      }
    });
    
    // Typing indicator
    socket.on('typing-start', ({ receiverId }) => {
      const receiverSocketId = onlineUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('user-typing', { userId: socket.userId });
      }
    });
    
    socket.on('typing-stop', ({ receiverId }) => {
      const receiverSocketId = onlineUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('user-stopped-typing', { userId: socket.userId });
      }
    });
    
    // Clan chat
    socket.on('join-clan-chat', ({ clanId }) => {
      socket.join(`clan-${clanId}`);
    });
    
    socket.on('clan-message', ({ clanId, content }) => {
      const cleanContent = filter.clean(content);
      io.to(`clan-${clanId}`).emit('clan-message', {
        userId: socket.userId,
        content: cleanContent,
        timestamp: new Date()
      });
    });
    
    // Disconnect
    socket.on('disconnect', async () => {
      console.log('User disconnected:', socket.id);
      
      if (socket.userId) {
        onlineUsers.delete(socket.userId);
        
        try {
          // Update user offline status
          await User.findByIdAndUpdate(socket.userId, {
            isOnline: false,
            lastSeen: new Date()
          });
          
          // Notify friends
          const user = await User.findById(socket.userId).populate('friends');
          if (user) {
            user.friends.forEach(friend => {
              const friendSocketId = onlineUsers.get(friend._id.toString());
              if (friendSocketId) {
                io.to(friendSocketId).emit('friend-offline', { userId: socket.userId });
              }
            });
          }
        } catch (error) {
          console.error('Disconnect error:', error);
        }
      }
    });
  });
};

// Helper function to update rank based on RP
function updateRank(user) {
  if (user.rp >= 2000) user.rank = 'Legend';
  else if (user.rp >= 1500) user.rank = 'Diamond';
  else if (user.rp >= 1000) user.rank = 'Platinum';
  else if (user.rp >= 600) user.rank = 'Gold';
  else if (user.rp >= 300) user.rank = 'Silver';
  else user.rank = 'Bronze';
  
  if (user.rank !== user.stats.highestRank) {
    // Update highest rank if needed
    const ranks = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Legend'];
    if (ranks.indexOf(user.rank) > ranks.indexOf(user.stats.highestRank)) {
      user.stats.highestRank = user.rank;
    }
  }
}
