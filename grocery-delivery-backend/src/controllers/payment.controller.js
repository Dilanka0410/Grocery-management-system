const Order = require('../models/Order.model');
const ApiResponse = require('../utils/apiResponse');

// webhook / callback endpoint from payment gateway
exports.handlePaymentCallback = async (req, res) => {
    try {
        // Expecting { orderId, status, transactionId } from gateway
        const { orderId, status, transactionId } = req.body;

        if (!orderId || !status) {
            return ApiResponse.error(res, 'Missing payment callback data', 400);
        }

        // Map gateway status -> internal status
        let newStatus = 'failed';
        if (['success', 'paid', 'completed'].includes(status.toLowerCase())) newStatus = 'confirmed';
        if (['pending'].includes(status.toLowerCase())) newStatus = 'pending';

        const order = await Order.findByIdAndUpdate(orderId, { status: newStatus, paymentInfo: { status, transactionId } }, { new: true });

        if (!order) return ApiResponse.error(res, 'Order not found', 404);

        return ApiResponse.success(res, order, 'Order status updated from payment callback');
    } catch (err) {
        console.error('[PAYMENT CALLBACK] error', err);
        return ApiResponse.error(res, err.message || 'Failed to process payment callback', 500);
    }
};

// Endpoint to initiate payment (returns payment URL or token)
exports.initiatePayment = async (req, res) => {
    try {
        const { orderId } = req.body;
        if (!orderId) return ApiResponse.error(res, 'Missing orderId', 400);

        // Load order and verify status
        const order = await Order.findById(orderId);
        if (!order) return ApiResponse.error(res, 'Order not found', 404);
        if (order.status !== 'pending') return ApiResponse.error(res, 'Order not in pending state', 400);

        // TODO: Call payment gateway SDK to create a payment session/URL
        // For now we simulate by returning a fake URL that would redirect to payment
        const paymentUrl = `https://payments.example.com/pay?order=${orderId}`;
        return ApiResponse.success(res, { paymentUrl }, 'Payment initiated');
    } catch (err) {
        console.error('[PAYMENT] initiatePayment error', err);
        return ApiResponse.error(res, err.message || 'Failed to initiate payment', 500);
    }
};
