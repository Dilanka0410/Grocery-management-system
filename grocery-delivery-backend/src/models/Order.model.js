const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rider: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    items: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true }
        }
    ],
    totalPrice: { type: Number, required: true },
    status: { 
        type: String, 
        enum: ['pending', 'confirmed', 'cooking', 'out-for-delivery', 'delivered', 'cancelled'], 
        default: 'pending' 
    },
    shippingAddress: {
        fullName: { type: String, required: true },
        phone: { type: String, required: true },
        houseNo: { type: String, required: true },
        street: { type: String, required: true },
        city: { type: String, required: true },
        district: { type: String, required: true },
        province: { type: String, required: true },
        landmark: { type: String },
        addressLabel: { type: String, enum: ['Home', 'Office', 'Other'], default: 'Home' }
    },
    deliveryAddress: {
        type: String,
        required: true,
        default: function () {
            if (!this.shippingAddress) return undefined;
            const { houseNo, street, city, district, province } = this.shippingAddress;
            if (houseNo && street && city && district && province) {
                return `${houseNo}, ${street}, ${city}, ${district}, ${province}`;
            }
            return undefined;
        }
    }
}, { timestamps: true });

orderSchema.pre('validate', function (next) {
    if (!this.deliveryAddress && this.shippingAddress) {
        const { houseNo, street, city, district, province } = this.shippingAddress;
        if (houseNo && street && city && district && province) {
            this.deliveryAddress = `${houseNo}, ${street}, ${city}, ${district}, ${province}`;
        }
    }
    next();
});

module.exports = mongoose.model('Order', orderSchema);