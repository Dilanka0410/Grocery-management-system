const express = require('express');
const { getProducts, createProduct } = require('../controllers/product.controller');
const protect = require('../middleware/auth.middleware');
const authorizeRoles = require('../middleware/role.middleware');
const router = express.Router();

router.get('/', getProducts);
router.post('/', protect, authorizeRoles('admin'), createProduct);

module.exports = router;