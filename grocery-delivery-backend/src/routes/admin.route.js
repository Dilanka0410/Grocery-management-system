const express = require('express');
const router = express.Router();
const Order = require('../models/Order.model'); // 💡 උඹේ Order Model එකේ පාත් එක බලලා දාපන් මචං
// const { protect, admin } = require('../middleware/auth.middleware'); 
// 👆 උඩ ලයින් එක දැනට Comment කරලා තියපන්, පස්සේ ඇඩ්මින්ට විතරක් බ්ලොක් කරන්න මේක දාමු.

// 1️⃣ ඔක්කොම ඕඩර්ස් ටික ඇඩ්මින්ට පෙන්වන්න ගන්න API එක
router.get('/orders', async (req, res) => {
    try {
        // .populate() එකෙන් කරන්නේ User ගේ නම/ඊමේල් සහ Product එකේ විස්තර ඔටෝමැටිකලි ඇදලා ගන්න එක
        const orders = await Order.find()
            .populate('user', 'name email phone') 
            .populate('items.product', 'name price')
            .sort({ createdAt: -1 }); // අලුත්ම ඕඩර්ස් උඩටම එනවා

        return res.status(200).json(orders);
    } catch (error) {
        console.error('Fetch Admin Orders Error:', error);
        return res.status(500).json({ message: 'Server Error' });
    }
});

// 2️⃣ ඕඩර් එකේ Tracking Status එක (Pending, Shipped, Delivered) අප්ඩේට් කරන API එක
router.put('/orders/:id/status', async (req, res) => {
    try {
        const { status } = req.body; // Front-end එකෙන් එවන අලුත් status එක (e.g., 'Shipped')

        const allowedStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
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