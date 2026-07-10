const dotenv = require('dotenv');
const { Server } = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/db');
const app = require('./app');
const mongoose = require('mongoose');

dotenv.config();

// Allowed Origins එක Define කිරීම
const allowedOrigins = [
  'http://localhost:5173', 
  'http://localhost:5174',
  'http://localhost:5000'
];

const PORT = process.env.PORT || 5000;

// Socket.io වින්‍යාසය සඳහා පොදු ශ්‍රිතයක් (Reuse කර ගැනීමට)
const setupSocketIO = (server) => {
    const io = new Server(server, {
        cors: {
            origin: allowedOrigins,
            methods: ['GET', 'POST'],
            credentials: true
        }
    });

    io.on('connection', (socket) => {
        console.log('A user connected via socket:', socket.id);
    });
};

connectDB()
    .then(() => {
        const server = app.listen(PORT, '0.0.0.0', () => {
            console.log(`[SERVER] Multi-functional Grocery Backend running on port ${PORT}`);
        });

        setupSocketIO(server);
    })
    .catch(err => {
        console.error('Database connection failed:', err.message);
        
        const server = app.listen(PORT, '0.0.0.0', () => {
            console.log(`[SERVER] Multi-functional Grocery Backend running on port ${PORT} (Database Offline)`);
        });

        setupSocketIO(server);
    });