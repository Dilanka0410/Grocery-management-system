const Category = require('../models/Category.model');
const ApiResponse = require('../utils/apiResponse');

// හැම Category එකක්ම ගන්න
const getCategories = async (req, res, next) => {
    try {
        const categories = await Category.find();
        return ApiResponse.success(res, categories, "Categories fetched successfully");
    } catch (error) { next(error); }
};

// අලුත් Category එකක් දාන්න (Admin ට විතරයි)
const createCategory = async (req, res, next) => {
    try {
        const { name, image } = req.body;
        const slug = name.split(' ').join('-').toLowerCase();

        const categoryExists = await Category.findOne({ slug });
        if (categoryExists) return ApiResponse.error(res, "Category already exists", 400);

        const category = await Category.create({ name, slug, image });
        return ApiResponse.success(res, category, "Category created successfully", 201);
    } catch (error) { next(error); }
};

module.exports = { getCategories, createCategory };