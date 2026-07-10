const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

// 💡 ඔන්න මේක තමයි ඔයාගේ අනිවාර්යයෙන්ම තියෙන්න ඕන ලයින් එක:
require('./models/Order.model');

const authRoutes = require('./routes/auth.routes');
const { router: orderRoutes, paymentRouter } = require('./routes/order.routes');
const adminRoutes = require('./routes/admin.route');
const productRoutes = require('./routes/product.routes');
const categoryRoutes = require('./routes/category.routes');
const cartRoutes = require('./routes/cart.routes');
const { protect, isAdmin } = require('./middleware/auth.middleware');
const errorMiddleware = require('./middleware/error.middleware');

const app = express();

const allowedOrigins = [
    'http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176', 'http://localhost:5177', 'http://localhost:5178', 'http://localhost:5179',
    'http://127.0.0.1:5173', 'http://127.0.0.1:5174', 'http://127.0.0.1:5175', 'http://127.0.0.1:5176', 'http://127.0.0.1:5177', 'http://127.0.0.1:5178', 'http://127.0.0.1:5179'
];

app.use(helmet());
app.use(cors({ origin: function (origin, callback) { if (!origin || allowedOrigins.indexOf(origin) !== -1) { callback(null, true); } else { callback(new Error('Not allowed by CORS')); } }, credentials: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', protect, isAdmin, adminRoutes);
app.use('/api/payments', paymentRouter);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);

app.get('/', (req, res) => { res.send('GroceryDash API is running perfectly! 🚀'); }); 
app.use(errorMiddleware);

module.exports = app;