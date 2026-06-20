const dotenv = require('dotenv');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const app = require('./app');

dotenv.config();

const PORT = process.env.PORT || 5000;

// 💡 5173, 5174, 5176 වගේම උඹේ අලුත්ම පෝට් එක වෙන 5177 ත් Socket.io එකටත් එකතු කළා මචං!
const allowedOrigins = [
    'http://localhost:5173', 
    'http://localhost:5174', 
    'http://localhost:5176',
    'http://localhost:5177', 
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
    'http://127.0.0.1:5176',
    'http://127.0.0.1:5177'  
];

connectDB().then(() => {
    const server = app.listen(PORT, () => {
        console.log(`[SERVER] Multi-functional Grocery Backend running on port ${PORT}`);
    });

    const io = new Server(server, {
        cors: {
            // 💡 දැන් සේරම පෝට්ස් ටික Socket.io එකටත් ඇලවුඩ් මචං!
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