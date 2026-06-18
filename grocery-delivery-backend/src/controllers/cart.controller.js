const Cart = require('../models/Cart.model');
const ApiResponse = require('../utils/apiResponse');

// User ගේ Cart එක ගන්න
const getCart = async (req, res, next) => {
    try {
        let cart = await Cart.findOne({ customer: req.user._id }).populate('items.product');
        if (!cart) {
            cart = await Cart.create({ customer: req.user._id, items: [] });
        }
        return ApiResponse.success(res, cart, "Cart fetched successfully");
    } catch (error) { next(error); }
};

// Cart එකට බඩු දාන්න හෝ තියෙන ප්‍රමාණය වෙනස් කරන්න
const addToCart = async (req, res, next) => {
    try {
        const { productId, quantity } = req.body;
        let cart = await Cart.findOne({ customer: req.user._id });

        if (!cart) {
            cart = await Cart.create({ customer: req.user._id, items: [] });
        }

        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

        if (itemIndex > -1) {
            // බඩුව දැනටමත් cart එකේ තියනවා නම් ප්‍රමාණය වැඩි කරනවා
            cart.items[itemIndex].quantity += quantity;
            if (cart.items[itemIndex].quantity <= 0) {
                cart.items.splice(itemIndex, 1); // 0 ට වඩා අඩු වුනොත් අයින් කරනවා
            }
        } else {
            // අලුත් බඩුවක් නම් ඇතුලත් කරනවා
            cart.items.push({ product: productId, quantity });
        }

        await cart.save();
        return ApiResponse.success(res, cart, "Cart updated successfully");
    } catch (error) { next(error); }
};

module.exports = { getCart, addToCart };