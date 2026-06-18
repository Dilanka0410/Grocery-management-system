const Order = require('../models/Order.model');
const InventoryService = require('../services/inventory.service');
const ApiResponse = require('../utils/apiResponse');

const createOrder = async (req, res, next) => {
    try {
        const { items, totalPrice, deliveryAddress } = req.body;

        if (!items || items.length === 0) {
            return ApiResponse.error(res, "No order items provided", 400);
        }

        // 1. Stock check කරලා අඩු කරනවා (Inventory Service එකෙන්)
        await InventoryService.validateAndDeductStock(items);

        // 2. Order එක Database එකේ create කරනවා
        const order = await Order.create({
            customer: req.user._id, // Auth middleware එකෙන් එන user id එක
            items,
            totalPrice,
            deliveryAddress
        });

        return ApiResponse.success(res, order, "Order placed successfully", 201);
    } catch (error) {
        // Stock මදි වුනොත් එන Error එක ලස්සනට frontend එකට පාස් කරනවා
        return ApiResponse.error(res, error.message, 400);
    }
};

module.exports = { createOrder };