// 💡 මෙතන next පරාමිතිය එක් කළා (Express middleware signature එකට ගැලපෙන්න)
const createOrder = async (req, res, next) => { 
    const session = await Order.db.startSession();
    try {
        const { items, totalPrice, shippingAddress, deliveryAddress: bodyDeliveryAddress, paymentMethod } = req.body;

        if (!items || items.length === 0) {
            return ApiResponse.error(res, "No order items provided", 400);
        }

        // ... (අනිත් validation ටික එහෙමමයි) ...

        const builtDeliveryAddress = `${shippingAddress.houseNo}, ${shippingAddress.street}, ${shippingAddress.city}, ${shippingAddress.district}, ${shippingAddress.province}`;
        const deliveryAddress = bodyDeliveryAddress || builtDeliveryAddress;

        let createdOrder = null;
        
        // 💡 Transaction එක ඇතුලේ error එකක් ආවොත් කෙලින්ම throw කරන්න
        await session.withTransaction(async () => {
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
            createdOrder = await orderDoc.save({ session });
        });

        return ApiResponse.success(res, createdOrder, "Order created", 201);
    } catch (error) {
        console.error('[ORDER] createOrder error:', error);
        
        // 💡 මෙතන ApiResponse එකෙන් පස්සේ next() call කරන්නේ නැහැ.
        // එරර් එකක් ආවොත් අපි ApiResponse එකෙන් respond කරලා ඉවරයි.
        return ApiResponse.error(res, error.message || 'Failed to create order', 400);
    } finally {
        await session.endSession();
    }
};

module.exports = { createOrder }; 