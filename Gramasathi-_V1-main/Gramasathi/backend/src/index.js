import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { createServer } from 'http';
import { Server } from 'socket.io';



// Route imports
import authRoutes from './routes/auth.js';
import charityRoutes from './routes/charity.js';
import profileRoutes from './routes/profile.js';
import externalRoutes from './routes/external.js';
import campsRoutes from './routes/camps.js';


// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const PORT = 5002; // Changed from 5001 to avoid port conflict

// Create HTTP server
const httpServer = createServer(app);

// Create Socket.IO server
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/charity', charityRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/external', externalRoutes);
app.use('/api/camps', campsRoutes);


// Root route
app.get('/', (req, res) => {
  res.send('GramaSathi API is running');
});

// Socket.IO connection handler
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
  
  // Handle chat messages
  socket.on('send_message', (data) => {
    socket.to(data.room).emit('receive_message', data);
  });
  
  // Join a room (for charity campaigns)
  socket.on('join_campaign', (campaignId) => {
    socket.join(campaignId);
    console.log(`User ${socket.id} joined campaign ${campaignId}`);
  });
});

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gramasathi')
  .then(() => {
    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  }); 