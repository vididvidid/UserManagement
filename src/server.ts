import app from './app';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import updateMembershipStatus from './jobs/membershipJobs';
import Chat from './models/Chat';

dotenv.config();

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
  console.log('a user connected');
  
  socket.on('chat message', async (msg) => {
    const chat = new Chat(msg);
    await chat.save();
    
    io.emit('chat message', msg); // Broadcast to all connected clients
  });
  
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
  updateMembershipStatus();
});
