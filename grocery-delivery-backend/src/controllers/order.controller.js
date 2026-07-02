const Order = require('../models/Order.model');
const InventoryService = require('../services/inventory.service');
const ApiResponse = require('../utils/apiResponse');

const createOrder = async (req, res, next) => {
    // This controller now creates an order with status 'pending'
    // and attempts to deduct stock in a (best-effort) transactional manner.
    const session = await Order.db.startSession();
    try {
        const { items, totalPrice, shippingAddress, deliveryAddress: bodyDeliveryAddress, paymentMethod } = req.body;

        console.log('[ORDER] createOrder req.body:', JSON.stringify(req.body));

        if (!items || items.length === 0) {
            return ApiResponse.error(res, "No order items provided", 400);
        }

        if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.houseNo || !shippingAddress.street || !shippingAddress.city || !shippingAddress.district || !shippingAddress.province) {
            return ApiResponse.error(res, "Incomplete shipping address information", 400);
        }

        const builtDeliveryAddress = `${shippingAddress.houseNo}, ${shippingAddress.street}, ${shippingAddress.city}, ${shippingAddress.district}, ${shippingAddress.province}`;
        const deliveryAddress = bodyDeliveryAddress || builtDeliveryAddress;
        console.log('[ORDER] computed deliveryAddress:', deliveryAddress);

        // Start transaction if supported
        let createdOrder = null;
        await session.withTransaction(async () => {
            // Validate and deduct stock (InventoryService should throw if insufficient)
            await InventoryService.validateAndDeductStock(items, { session });

            // Create order with pending or confirmed status
            const orderPayload = {
                customer: req.user._id,
                items,
                totalPrice,
                shippingAddress,
                deliveryAddress,
                paymentMethod: paymentMethod || 'cod',
                status: (paymentMethod && paymentMethod.toLowerCase() === 'cod') ? 'confirmed' : 'pending'
            };

            console.log('[ORDER] orderPayload before save:', JSON.stringify(orderPayload));
            const orderDoc = new Order(orderPayload);
            createdOrder = await orderDoc.save({ session });
        });

        return ApiResponse.success(res, createdOrder, "Order created", 201);
    } catch (error) {
        console.error('[ORDER] createOrder error:', error);
        // If InventoryService failed, it should surface a clear message
        return ApiResponse.error(res, error.message || 'Failed to create order', 400);
    } finally {
        session.endSession();
    }
};

module.exports = { createOrder };