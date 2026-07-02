const dotenv = require('dotenv');
dotenv.config();

const connectDB = require('../src/config/db');
const mongoose = require('mongoose');
const Product = require('../src/models/Product.model');

(async () => {
  try {
    await connectDB();
    console.log('[CHECK_DB] Mongoose readyState:', mongoose.connection.readyState);

    const count = await Product.countDocuments();
    console.log('[CHECK_DB] products count:', count);

    const sample = await Product.findOne().lean();
    console.log('[CHECK_DB] sample document:', sample);

    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('[CHECK_DB] error:', err.message || err);
    try { await mongoose.connection.close(); } catch (e) {}
    process.exit(1);
  }
})();
