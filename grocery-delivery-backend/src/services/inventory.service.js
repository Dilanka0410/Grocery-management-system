const Product = require('../models/Product.model');

class InventoryService {
    async validateAndDeductStock(items, session = null) {
        const sessionOption = session ? { session } : {};
        // ඔක්කොම items වලට ඇති වෙන්න stock තියද බලනවා
        for (const item of items) {
            const product = session 
                ? await Product.findById(item.product).session(session)
                : await Product.findById(item.product);
            if (!product) throw new Error(`Product with ID ${item.product} not found. It may have been discontinued or updated. Please clear your cart.`);
            if (product.stock < item.quantity) {
                throw new Error(`Insufficient stock for product: ${product.name}`);
            }
        }

        // ප්‍රශ්නයක් නැත්නම් stock අඩු කරනවා
        for (const item of items) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { stock: -item.quantity }
            }, sessionOption);
        }
    }
}

module.exports = new InventoryService();