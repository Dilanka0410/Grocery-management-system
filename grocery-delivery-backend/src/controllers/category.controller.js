const Category = require('../models/Category.model');
const ApiResponse = require('../utils/apiResponse');

const getCategories = async (req, res, next) => {
    try {
        const categories = await Category.find().sort({ createdAt: -1 });
        return ApiResponse.success(res, categories, 'Categories fetched successfully');
    } catch (error) {
        next(error);
    }
};

const createCategory = async (req, res, next) => {
    try {
        const { name, slug, image } = req.body;

        if (!name || !slug) {
            return ApiResponse.error(res, 'Category name and slug are required', 400);
        }

        const category = await Category.create({ name, slug, image });
        return ApiResponse.success(res, category, 'Category created successfully', 201);
    } catch (error) {
        next(error);
    }
};

module.exports = { getCategories, createCategory };