const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User.model.js');

dotenv.config();

const updateAdminRole = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || process.env.MONGODB_URI;
    if (!mongoURI) {
      console.error('No MongoDB URI found in .env');
      process.exit(1);
    }
    
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected.');

    const email = 'admin@gmail.com';
    const user = await User.findOne({ email });

    if (!user) {
      console.log('User with email admin@gmail.com not found.');
      process.exit(0);
    }

    user.role = 'admin';
    user.isAdmin = true; // just to be safe based on their previous schema
    await user.save();
    
    console.log('User updated successfully to admin role!');
    process.exit(0);
  } catch (error) {
    console.error('Error updating admin role:', error);
    process.exit(1);
  }
};

updateAdminRole();
