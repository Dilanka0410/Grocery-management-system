const Product = require('../models/Product.model');

class InventoryService {
    async validateAndDeductStock(items) {
        // ඔක්කොම items වලට ඇති වෙන්න stock තියද බලනවා
        for (const item of items) {
            const product = await Product.findById(item.product);
            if (!product) throw new Error(`Product not found`);
            if (product.stock < item.quantity) {
                throw new Error(`Insufficient stock for product: ${product.name}`);
            }
        }

        // ප්‍රශ්නයක් නැත්නම් stock අඩු කරනවා
        for (const item of items) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { stock: -item.quantity }
            });
        }
    }
}

module.exports = new InventoryService();