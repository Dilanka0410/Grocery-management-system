const Cart = require('../models/Cart.model');
const ApiResponse = require('../utils/apiResponse');

// 1. User ගේ Cart එක ගන්න
const getCart = async (req, res, next) => {
    try {
        let cart = await Cart.findOne({ customer: req.user._id }).populate('items.product');
        if (!cart) {
            cart = await Cart.create({ customer: req.user._id, items: [] });
        }
        return ApiResponse.success(res, cart, "Cart fetched successfully");
    } catch (error) { next(error); }
};

// 2. Cart එකට බඩු දාන්න හෝ ප්‍රමාණය වෙනස් කරන්න
const addToCart = async (req, res, next) => {
    try {
        const { productId, quantity } = req.body;
        let cart = await Cart.findOne({ customer: req.user._id });

        if (!cart) {
            cart = await Cart.create({ customer: req.user._id, items: [] });
        }

        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

        if (itemIndex > -1) {
            // බඩුව තියෙනවා නම් ප්‍රමාණය වෙනස් කරනවා
            cart.items[itemIndex].quantity += quantity;
            if (cart.items[itemIndex].quantity <= 0) {
                cart.items.splice(itemIndex, 1);
            }
        } else {
            // අලුත් බඩුවක් නම් push කරනවා
            cart.items.push({ product: productId, quantity });
        }

        await cart.save();
        return ApiResponse.success(res, cart, "Cart updated successfully");
    } catch (error) { next(error); }
};

// 3. Cart එකෙන් අයිටම් එකක් සම්පූර්ණයෙන් අයින් කිරීම
const removeFromCart = async (req, res, next) => {
    try {
        const { productId } = req.body;
        let cart = await Cart.findOne({ customer: req.user._id });

        if (!cart) {
            return ApiResponse.error(res, "Cart not found", 404);
        }

        // ෆිල්ටර් කරලා අයින් කරනවා
        cart.items = cart.items.filter(item => item.product.toString() !== productId);
        
        await cart.save();
        return ApiResponse.success(res, cart, "Item removed from cart");
    } catch (error) { next(error); }
};

const updateQuantity = async (req, res, next) => {
    try {
        const { productId, amount } = req.body;
        let cart = await Cart.findOne({ customer: req.user._id });

        if (!cart) return ApiResponse.error(res, "Cart not found", 404);

        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += amount;
            if (cart.items[itemIndex].quantity <= 0) {
                cart.items.splice(itemIndex, 1);
            }
        }

        await cart.save();
        return ApiResponse.success(res, cart, "Quantity updated successfully");
    } catch (error) { next(error); }
};



module.exports = { 
    getCart, 
    addToCart, 
    removeFromCart,
    updateQuantity
};