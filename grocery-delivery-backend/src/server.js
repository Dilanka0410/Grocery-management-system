const dotenv = require('dotenv');
const { Server } = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/db');
const app = require('./app');

dotenv.config();

const PORT = process.env.PORT || 5000;

// 💡 මෙතනට 5175, 5176 එකතු කළා. තව ඕනෙනම් මෙතනට අලුතින් add කරන්න.
const allowedOrigins = [
    'http://localhost:5173', 
    'http://localhost:5174', 
    'http://localhost:5175', 
    'http://localhost:5176',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
    'http://127.0.0.1:5175',
    'http://127.0.0.1:5176'  
];

// 💡 CORS configuration එක පිරිසිදු කළා
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
};

app.use(cors(corsOptions));

connectDB()
    .then(() => {
        const server = app.listen(PORT, '0.0.0.0', () => {
            console.log(`[SERVER] Multi-functional Grocery Backend running on port ${PORT}`);
        });

        const mongoose = require('mongoose');
        
        // Socket.io Config
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
    })
    .catch(err => {
        console.error('Database connection failed:', err.message);
        
        const server = app.listen(PORT, '0.0.0.0', () => {
            console.log(`[SERVER] Multi-functional Grocery Backend running on port ${PORT} (Database Offline)`);
        });

        const io = new Server(server, {
            cors: {
                origin: allowedOrigins,
                methods: ['GET', 'POST'],
                credentials: true
            }
        });
    });