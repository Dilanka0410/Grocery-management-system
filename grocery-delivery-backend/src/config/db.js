const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`[DATABASE] MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`[DATABASE ERROR] ${error.message}`);
        process.exit(1); // Connect වුනේ නැත්නම් server එක stop කරනවා
    }
};

module.exports = connectDB;