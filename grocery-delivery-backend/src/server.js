const dotenv = require('dotenv');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const app = require('./app');

dotenv.config();

const PORT = process.env.PORT || 5000;

// 💡 ෆ්‍රන්ට්එන්ඩ් පෝට් දෙකටම වැඩ කරන්න ඇරේ එකක් හැදුවා මචං
const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174'];

connectDB().then(() => {
    const server = app.listen(PORT, () => {
        console.log(`[SERVER] Multi-functional Grocery Backend running on port ${PORT}`);
    });

    const io = new Server(server, {
        cors: {
            // 💡 මෙතනට allowedOrigins ඇරේ එක දුන්නාම 5173, 5174 දෙකටම සුපිරියට වැඩ!
            origin: allowedOrigins, 
            methods: ['GET', 'POST'],
            credentials: true
        }
    });

    io.on('connection', (socket) => {
        console.log('A user connected via socket:', socket.id);
    });
}).catch(err => {
    console.error('Database connection failed:', err);
});