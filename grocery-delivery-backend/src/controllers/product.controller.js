const Product = require('../models/Product.model');
const ApiResponse = require('../utils/apiResponse');

// බඩු ඔක්කොම ගන්න (Category එකත් එක්කම populate කරලා)
const getProducts = async (req, res, next) => {
    try {
        const products = await Product.find({ isActive: true }).populate('category', 'name');
        return ApiResponse.success(res, products, "Products fetched successfully");
    } catch (error) { next(error); }
};

// අලුත් Product එකක් ඇතුලත් කරන්න (Admin ට විතරයි)
const createProduct = async (req, res, next) => {
    try {
        const { name, price, description, stock, image, category } = req.body;

        const product = await Product.create({ name, price, description, stock, image, category });
        return ApiResponse.success(res, product, "Product created successfully", 201);
    } catch (error) { next(error); }
};
module.exports = { getProducts, createProduct };
