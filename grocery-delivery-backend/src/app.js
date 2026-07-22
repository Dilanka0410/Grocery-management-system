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

app.use(helmet());
app.use(cors({
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.options('*', cors());

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