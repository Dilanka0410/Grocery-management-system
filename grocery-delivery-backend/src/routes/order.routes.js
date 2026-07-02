const express = require('express');
const router = express.Router();

// 1. Controller සහ Middleware නිවැරදිව Import කිරීම
const { createOrder } = require('../controllers/order.controller');
const { protect } = require('../middleware/auth.middleware');
const authorizeRoles = require('../middleware/role.middleware'); // මේක බොහෝ විට default export එකක් නම් මෙහෙමයි

// 2. Route එක නිර්මාණය කිරීම
// protect (login වෙලාද) -> authorizeRoles (customer කෙනෙක්ද) -> createOrder (වැඩේ කරනවා)
router.post('/', protect, authorizeRoles('customer'), createOrder);

module.exports = router;