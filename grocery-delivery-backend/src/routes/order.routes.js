const express = require('express');
const { createOrder } = require('../controllers/order.controller');
const protect = require('../middleware/auth.middleware');
const authorizeRoles = require('../middleware/role.middleware');
const router = express.Router();

// Order එකක් දාන්න නම් අනිවාර්යයෙන් customer කෙනෙක් වෙලා ලොග් වෙලා ඉන්න ඕනේ
router.post('/', protect, authorizeRoles('customer'), createOrder);

module.exports = router;