const mongoose = require('mongoose');

const deliveryTrackingSchema = new mongoose.Schema({
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    rider: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    location: {
        type: { type: String, default: 'Point' },
        coordinates: { type: [Number], required: true } // [Longitude, Latitude]
    }
}, { timestamps: true });

deliveryTrackingSchema.index({ location: '2dsphere' }); // Map එකේ රවුම් ගහන්න ලේසි වෙන්න

module.exports = mongoose.model('DeliveryTracking', deliveryTrackingSchema);