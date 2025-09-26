/**
 * Basic Express server + Socket.IO skeleton.
 * - Auth routes mounted
 * - Static upload folder served
 * - Socket.IO created for future realtime chat
 */
require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/auth');
const prisma = require('./lib/prisma');

const PORT = process.env.PORT || 4000;
const UPLOAD_DIR = process.env.UPLOAD_DIR || './uploads';

const app = express();
app.use(cors());
app.use(express.json());

// serve uploaded files
app.use('/uploads', express.static(path.resolve(UPLOAD_DIR)));

// auth routes
app.use('/api/auth', authRoutes);

// simple health
app.get('/api/health', (req, res) => res.json({ ok: true }));

// minimal endpoints to list chats (used by front later)
app.get('/api/chats', async (req, res) => {
  const chats = await prisma.chat.findMany({ orderBy: { created_at: 'asc' }});
  res.json(chats);
});

const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, { cors: { origin: '*' } });

// basic socket events (to be extended)
io.on('connection', (socket) => {
  console.log('socket connected', socket.id);

  socket.on('join_chat', (chatId) => {
    socket.join(chatId);
    socket.to(chatId).emit('system_message', { content: `Um usuário entrou no chat`, chatId, ts: Date.now() });
  });

  socket.on('leave_chat', (chatId) => {
    socket.leave(chatId);
  });

  socket.on('send_message', async (data) => {
    // expected: { chatId, senderUserId, content, senderCharacterId? }
    // minimal persistence
    try {
      const created = await prisma.message.create({
        data: {
          chatId: data.chatId,
          senderUserId: data.senderUserId,
          senderCharacterId: data.senderCharacterId || null,
          content: data.content,
          type: data.type || 'text'
        }
      });
      io.to(data.chatId).emit('new_message', created);
    } catch (e) {
      console.error('send_message error', e);
    }
  });

  socket.on('disconnect', () => {
    console.log('socket disconnect', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  console.log(`Static uploads: ${path.resolve(UPLOAD_DIR)}`);
});
