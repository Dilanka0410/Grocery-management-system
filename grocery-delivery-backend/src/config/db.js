const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Render එකේ ඉන්නකොට තියෙන MONGO_URI එක ගන්නවා. නැත්නම් localhost එකට යනවා.
        const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/grocery-delivery';

        const conn = await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 10000, // ටිකක් වෙලා බලන් ඉන්න වෙලාව වැඩි කළා
            socketTimeoutMS: 45000,
        });

        console.log(`[DATABASE] MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`[DATABASE ERROR] Connection failed: ${error.message}`);
        // Render එකේදී උඩ Error එක දැක්කම ඇයි connect වුනේ නැත්තේ කියලා හොයාගන්න පුළුවන්
        process.exit(1); 
    }
};

module.exports = connectDB;