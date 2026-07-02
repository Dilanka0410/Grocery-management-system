const mongoose = require('mongoose');

const connectDB = async () => {
    const candidates = [
        process.env.MONGO_URI,
        'mongodb://127.0.0.1:27017/grocery-delivery',
        'mongodb://localhost:27017/grocery-delivery'
    ].filter(Boolean);

    let lastError = null;

    for (const uri of candidates) {
        try {
            const conn = await mongoose.connect(uri, {
                serverSelectionTimeoutMS: 5000,
                retryWrites: false
            });
            console.log(`[DATABASE] MongoDB Connected: ${conn.connection.host}`);
            return;
        } catch (error) {
            lastError = error;
            console.warn(`[DATABASE WARN] Failed to connect to ${uri}: ${error.message}`);
        }
    }

    throw new Error(`Unable to connect to MongoDB. Last error: ${lastError?.message || 'Unknown error'}`);
};

module.exports = connectDB;