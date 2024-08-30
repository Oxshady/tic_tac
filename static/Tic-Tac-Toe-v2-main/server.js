import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors());

let rooms = {};
let randomRooms = {};

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('joinRoom', (roomId, isRandom = false) => {
    socket.join(roomId);

    if (!rooms[roomId]) {
      rooms[roomId] = [];
    }

    // Mark room as random if it was randomly generated
    if (isRandom) {
      randomRooms[roomId] = true;
    }

    if (rooms[roomId].length > 3) {
      socket.emit('roomFull'); // Notify the client that the room is full
      socket.leave(roomId); // Remove the socket from the room
      return;
    }

    rooms[roomId].push(socket.id);

    // Log when a user joins a room
    console.log(`User ${socket.id} joined room ${roomId}`);
    io.to(roomId).emit('updatePlayerList', rooms[roomId].map(id => io.sockets.sockets.get(id).handshake.query.username || id));
    io.to(roomId).emit('roomJoined', rooms[roomId].map(id => io.sockets.sockets.get(id).handshake.query.username || id));
});


  socket.on('leaveRoom', ({ roomId }) => {
    if (rooms[roomId]) {
      rooms[roomId] = rooms[roomId].filter((id) => id !== socket.id);
      console.log(`User ${socket.id} left room ${roomId}`);
      if (rooms[roomId].length === 0) {
        delete rooms[roomId];
      } else {
        io.to(roomId).emit('updatePlayerList', rooms[roomId]);
      }

      socket.leave(roomId);
    }
  });

  socket.on('joinRandomRoom', () => {
    let roomId = null;
    for (const [id, players] of Object.entries(rooms)) {
        if (players.length <= 2 && randomRooms[id]) { // Check if the room is random
            roomId = id;
            break;
        }
    }

    if (!roomId) {
        roomId = Math.random().toString(36).substring(2, 9);
        randomRooms[roomId] = true; // Mark this new room as random
    }

    socket.emit('assignRoomId', roomId);
    socket.join(roomId);
    rooms[roomId] = rooms[roomId] || [];
    rooms[roomId].push(socket.id);

    io.to(roomId).emit('updatePlayerList', rooms[roomId]);

    if (rooms[roomId].length > 2) {
        io.to(roomId).emit('startGame');
    }
});


  socket.on('gameMove', ({ move, roomId }) => {
    console.log(`Move received from ${socket.id} in room ${roomId}: ${move}`);

    // Emit the move to the other players in the same room
    socket.to(roomId).emit('gameMove', move);
});

  

  socket.on('game-update', (gameTurns) => {
    const roomId = Object.keys(socket.rooms).find(r => r !== socket.id);
    socket.to(roomId).emit('game-update', gameTurns);
  });

  socket.on('restartGame', () => {
    const roomId = Object.keys(socket.rooms).find(r => r !== socket.id);
    if (roomId) {
      io.to(roomId).emit('game-update', []); // Reset game state
    }
  });

  socket.on('requestRematch', ({ roomId }) => {
    console.log(`Player ${socket.id} requested a rematch in room ${roomId}`);
    socket.to(roomId).emit('rematchRequested');
  });

  socket.on('acceptRematch', ({ roomId }) => {
    console.log(`Player ${socket.id} accepted the rematch in room ${roomId}`);
    io.to(roomId).emit('rematchAccepted');
  });

  socket.on('updatePlayerName', ({ roomId, symbol, newName }) => {
    // Find the index of the player in the room
    const playerIndex = rooms[roomId].findIndex(id => io.sockets.sockets.get(id).handshake.query.username === symbol);
  
    if (playerIndex !== -1) {
      // Update the player name for the room
      io.to(roomId).emit('playerNameUpdated', { symbol, newName });
    }
  });

  // Handle player name changes
  socket.on('changePlayerName', ({ symbol, newName, roomId }) => {
    console.log(`Player ${socket.id} changed their name to ${newName} in room ${roomId}`);
    io.to(roomId).emit('playerNameUpdated', { symbol, newName });
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
    Object.keys(rooms).forEach(roomId => {
        rooms[roomId] = rooms[roomId].filter(id => id !== socket.id);
        if (rooms[roomId].length === 0) {
            delete rooms[roomId];
            delete randomRooms[roomId]; // Clean up the randomRooms object
        } else {
            // Emit an event with updated player list when a player disconnects
            io.to(roomId).emit('resetGameBoard');
            io.to(roomId).emit('updatePlayerList', rooms[roomId].map(id => io.sockets.sockets.get(id).handshake.query.username || id));
          }
      });
  });

});

server.listen(3000, () => {
  console.log('Server is listening on port 3000');
}); 