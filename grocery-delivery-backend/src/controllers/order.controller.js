const Order = require('../models/Order.model');
const InventoryService = require('../services/inventory.service');
const ApiResponse = require('../utils/apiResponse');

const createOrder = async (req, res, next) => {
    let session = null;
    try {
        session = await Order.db.startSession();
    } catch (e) {
        console.warn('[ORDER] Database does not support transactions/sessions:', e.message);
    }

    try {
        const { items, totalPrice, shippingAddress, deliveryAddress: bodyDeliveryAddress, paymentMethod } = req.body;

        if (!items || items.length === 0) {
            return ApiResponse.error(res, "No order items provided", 400);
        }

        // Validate that all item product IDs are valid 24-character hexadecimal MongoDB ObjectIds
        const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);
        for (const item of items) {
            if (!item.product || !isValidObjectId(item.product)) {
                return ApiResponse.error(res, `Invalid product ID format: "${item.product}". Product ID must be a 24-character hexadecimal string.`, 400);
            }
        }

        const builtDeliveryAddress = `${shippingAddress.houseNo}, ${shippingAddress.street}, ${shippingAddress.city}, ${shippingAddress.district}, ${shippingAddress.province}`;
        const deliveryAddress = bodyDeliveryAddress || builtDeliveryAddress;

        let createdOrder = null;
        
        if (session) {
            try {
                await session.withTransaction(async () => {
                    await InventoryService.validateAndDeductStock(items, session); 

                    const orderPayload = {
                        customer: req.user._id,
                        items,
                        totalPrice,
                        shippingAddress,
                        deliveryAddress,
                        paymentMethod: paymentMethod || 'cod',
                        status: (paymentMethod && paymentMethod.toLowerCase() === 'cod') ? 'confirmed' : 'pending'
                    };

                    const orderDoc = new Order(orderPayload);
                    createdOrder = await orderDoc.save({ session });
                });
            } catch (txError) {
                // If the error is due to MongoDB transactions not being supported (standalone local DB)
                if (txError.message && (txError.message.includes('Transaction numbers are only allowed') || txError.message.includes('replica set'))) {
                    console.warn('[ORDER] Standalone MongoDB detected. Falling back to non-transactional order creation.');
                    
                    // Reset createdOrder
                    createdOrder = null;
                    
                    await InventoryService.validateAndDeductStock(items); 

                    const orderPayload = {
                        customer: req.user._id,
                        items,
                        totalPrice,
                        shippingAddress,
                        deliveryAddress,
                        paymentMethod: paymentMethod || 'cod',
                        status: (paymentMethod && paymentMethod.toLowerCase() === 'cod') ? 'confirmed' : 'pending'
                    };

                    const orderDoc = new Order(orderPayload);
                    createdOrder = await orderDoc.save();
                } else {
                    // Re-throw any other validation or database errors
                    throw txError;
                }
            }
        } else {
            await InventoryService.validateAndDeductStock(items); 

            const orderPayload = {
                customer: req.user._id,
                items,
                totalPrice,
                shippingAddress,
                deliveryAddress,
                paymentMethod: paymentMethod || 'cod',
                status: (paymentMethod && paymentMethod.toLowerCase() === 'cod') ? 'confirmed' : 'pending'
            };

            const orderDoc = new Order(orderPayload);
            createdOrder = await orderDoc.save();
        }

        return ApiResponse.success(res, createdOrder, "Order created", 201);
    } catch (error) {
        console.error('[ORDER] createOrder error:', error);
        return ApiResponse.error(res, error.message || 'Failed to create order', 400);
    } finally {
        if (session) {
            await session.endSession();
        }
    }
};
const getMyOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ customer: req.user._id })
            .populate('items.product', 'name price image')
            .sort({ createdAt: -1 });

        return ApiResponse.success(res, orders, "Orders fetched successfully");
    } catch (error) {
        console.error('[ORDER] getMyOrders error:', error);
        return ApiResponse.error(res, 'Failed to fetch orders', 500);
    }
};

module.exports = { createOrder, getMyOrders };