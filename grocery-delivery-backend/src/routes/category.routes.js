const express = require('express');
const { getCategories, createCategory } = require('../controllers/category.controller');
const protect = require('../middleware/auth.middleware');
const authorizeRoles = require('../middleware/role.middleware');
const router = express.Router();

router.get('/', getCategories);
router.post('/', protect, authorizeRoles('admin'), createCategory); // Admin ට විතරයි පුළුවන්

module.exports = router;