const express = require('express');
const router = express.Router();

// 1. Controller එකේ දේවල් curly braces වලින් ගන්න
const { getProducts, createProduct, updateProduct, deleteProduct } = require('../controllers/product.controller');

// 2. Auth middleware එකේ { protect } අනිවාර්යයි (ඔයාගේ export එක object එකක් නිසා)
const { protect } = require('../middleware/auth.middleware');

// 3. Role middleware එක (මේක default export එකක් නම් {} නැතුව)
const authorizeRoles = require('../middleware/role.middleware');

// රූට් එක නිර්මාණය කිරීම
router.get('/', getProducts);

// පරීක්ෂා කරලා බලන්න මේ තුනම function ද කියලා
router.post('/', protect, authorizeRoles('admin'), createProduct);
router.put('/:id', protect, authorizeRoles('admin'), updateProduct);
router.delete('/:id', protect, authorizeRoles('admin'), deleteProduct);

module.exports = router;