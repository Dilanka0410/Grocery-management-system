const Product = require('../models/Product.model');
const ApiResponse = require('../utils/apiResponse');

// බඩු ඔක්කොම ගන්න (Category එකත් එක්කම populate කරලා)
const getProducts = async (req, res, next) => {
    try {
        const products = await Product.find({ isActive: true }).populate('category', 'name');
        console.log(`[PRODUCTS] fetched ${products.length} items from DB`);
        return ApiResponse.success(res, products, "Products fetched successfully");
    } catch (error) { next(error); }
};

// අලුත් Product එකක් ඇතුලත් කරන්න (Admin ට විතරයි)
const createProduct = async (req, res, next) => {
    try {
        const { name, price, description, stock, image, category } = req.body;
        
        if (!name || !price || !category) {
            return res.status(400).json({ message: "Name, price, and category are required fields." });
        }

        const product = await Product.create({ name, price, description, stock, image, category });
        return ApiResponse.success(res, product, "Product created successfully", 201);
    } catch (error) {
        return res.status(400).json({ message: error.message || "Failed to save product" });
    }
};

// Product එකක් අයින් කිරීම (Admin ට විතරයි)
const deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return ApiResponse.error(res, "Product not found", 404);
        return ApiResponse.success(res, null, "Product deleted successfully");
    } catch (error) {
        return res.status(400).json({ message: error.message || "Failed to delete product" });
    }
};

// Product එකක් යාවත්කාලීන කිරීම (Admin ට විතරයි)
const updateProduct = async (req, res, next) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!product) return ApiResponse.error(res, "Product not found", 404);
        return ApiResponse.success(res, product, "Product updated successfully");
    } catch (error) {
        return res.status(400).json({ message: error.message || "Failed to update product" });
    }
};

module.exports = { getProducts, createProduct, deleteProduct, updateProduct };
