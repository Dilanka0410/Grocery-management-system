const express = require('express');
const { 
    getCart, 
    addToCart, 
    removeFromCart, 
    updateQuantity 
} = require('../controllers/cart.controller');
const { protect } = require('../middleware/auth.middleware');
const router = express.Router();

// Cart එක ලබාගැනීම
router.get('/', protect, getCart);

// Cart එකට අලුතින් බඩු දැමීම
router.post('/add', protect, addToCart);

// Cart එකෙන් බඩුවක් සම්පූර්ණයෙන් අයින් කිරීම
router.post('/remove', protect, removeFromCart);

// Cart එකේ තියෙන බඩුවක ප්‍රමාණය (Quantity) වැඩි/අඩු කිරීම
router.put('/update', protect, updateQuantity);

module.exports = router;