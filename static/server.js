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

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);

    if (!rooms[roomId]) {
      rooms[roomId] = [];
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

  socket.on('gameMove', ({ move, roomId }) => {
    console.log(`Move received from ${socket.id} in room ${roomId}:`, move);

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

  socket.on('disconnect', () => {
    console.log('A user disconnected');
    Object.keys(rooms).forEach(roomId => {
      rooms[roomId] = rooms[roomId].filter(id => id !== socket.id);
      if (rooms[roomId].length === 0) {
        delete rooms[roomId];
      } else {
        // Emit an event with updated player list when a player disconnects
        io.to(roomId).emit('updatePlayerList', rooms[roomId].map(id => io.sockets.sockets.get(id).handshake.query.username || id));
      }
    });
  });
});

server.listen(3000, () => {
  console.log('Server is listening on port 3000');
});