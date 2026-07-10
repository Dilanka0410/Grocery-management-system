const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const Product = require('../models/Product.model');
const connectDB = require('../config/db');

async function list() {
    try {
        await connectDB();
        const products = await Product.find();
        console.log("DB Products:", JSON.stringify(products, null, 2));
        mongoose.connection.close();
    } catch (e) {
        console.error(e);
    }
}
list();
