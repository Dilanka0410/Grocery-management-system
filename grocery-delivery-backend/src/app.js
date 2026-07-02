const express = require('express');
const cors = require('cors');
const helmet = require('helmet');




const authRoutes = require('./routes/auth.routes');
const { router: orderRoutes, paymentRouter } = require('./routes/order.routes');
const adminRoutes = require('./routes/admin.route');
const productRoutes = require('./routes/product.routes');
const categoryRoutes = require('./routes/category.routes');
const cartRoutes = require('./routes/cart.routes');
const { protect, isAdmin } = require('./middleware/auth.middleware');
const errorMiddleware = require('./middleware/error.middleware');

const app = express();

// 💡 FIX: උඹේ ෆ්‍රන්ට්එන්ඩ් එක දුවන 5176 සහ 5177 පෝට්ස් ටිකත් මෙතනට ඇතුළත් කළා මචං!
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

app.use(helmet());

app.use(cors({
    origin: function (origin, callback) {
        // origin එකක් නැති වෙලාවටත් (උදා: Postman) අවසර දෙනවා
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            // ලෙඩේ හොයාගන්න ලේසි වෙන්න කන්සෝල් එකේ පෝට් එක ප්‍රින්ට් කරමු
            console.log(`[CORS REJECTED] Origin: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', protect, isAdmin, adminRoutes);
app.use('/api/payments', paymentRouter);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);


app.get('/', (req, res) => {
    res.send('GroceryDash API is running perfectly! 🚀');
}); 


// Global Error Handler
app.use(errorMiddleware);

module.exports = app;