const express = require('express');
const router = express.Router();
const paymentRouter = express.Router();

// 1. Controller සහ Middleware නිවැරදිව Import කිරීම
const { createOrder, getMyOrders } = require('../controllers/order.controller');
const paymentController = require('../controllers/payment.controller');
const { protect } = require('../middleware/auth.middleware');
const authorizeRoles = require('../middleware/role.middleware'); // මේක බොහෝ විට default export එකක් නම් මෙහෙමයි

// 2. Route එක නිර්මාණය කිරීම
// protect (login වෙලාද) -> authorizeRoles (customer කෙනෙක්ද) -> createOrder (වැඩේ කරනවා)
router.post('/', protect, authorizeRoles('customer'), createOrder);
router.get('/myorders', protect, authorizeRoles('customer'), getMyOrders);
router.post('/:orderId/pay', protect, authorizeRoles('customer'), paymentController.initiatePayment);

// Payment gateway callback (public webhook endpoint - secure with signature in prod)
paymentRouter.post('/callback', paymentController.handlePaymentCallback);

module.exports = { router, paymentRouter };