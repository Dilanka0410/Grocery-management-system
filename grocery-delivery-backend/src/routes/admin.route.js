const express = require('express');
const router = express.Router();
const Order = require('../models/Order.model');
const { protect, isAdmin } = require('../middleware/auth.middleware');

// 1️⃣ ඔක්කොම ඕඩර්ස් ටික ගන්න API එක
router.get('/orders', protect, isAdmin, async (req, res) => {
    try {
        // Model එකේ 'customer' කියලා තියෙන නිසා 'user' වෙනුවට 'customer' දාන්න ඕනේ
        const orders = await Order.find()
            .populate('customer', 'name email phone') 
            .populate('items.product', 'name price')
            .sort({ createdAt: -1 });

        return res.status(200).json(orders);
    } catch (error) {
        console.error('Fetch Admin Orders Error:', error);
        return res.status(500).json({ message: 'Server Error' });
    }
});

// 2️⃣ ඕඩර් එකේ Status එක අප්ඩේට් කරන API එක
router.put('/orders/:id/status', protect, isAdmin, async (req, res) => {
    try {
        const { status } = req.body; 

        // Model එකේ enum එකේ තියෙන අකුරු වලටම සමාන වෙන්න ඕනේ (Lowercase)
        const allowedStatuses = ['pending', 'confirmed', 'cooking', 'out-for-delivery', 'delivered', 'cancelled'];
        
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status value!' });
        }

        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found!' });
        }

        order.status = status;
        await order.save();

        return res.status(200).json({ message: 'Order status updated successfully!', order });
    } catch (error) {
        console.error('Update Order Status Error:', error);
        return res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;