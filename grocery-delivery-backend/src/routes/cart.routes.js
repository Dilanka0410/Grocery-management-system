const express = require('express');
const { getCart, addToCart } = require('../controllers/cart.controller');
const protect = require('../middleware/auth.middleware');
const router = express.Router();

router.get('/', protect, getCart);
router.post('/add', protect, addToCart);

module.exports = router;