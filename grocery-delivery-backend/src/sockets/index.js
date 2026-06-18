const DeliveryTracking = require('../models/DeliveryTracking.model');

const socketHandler = (io) => {
    io.on('connection', (socket) => {
        console.log(`[SOCKET] User connected: ${socket.id}`);

        // Customer හෝ Rider ඔන්න Order Room එකකට සෙට් වෙනවා
        socket.on('join-order-room', (orderId) => {
            socket.join(orderId);
            console.log(`[SOCKET] Joined Room: ${orderId}`);
        });

        // Rider ගෙන් එන Live Location එක අල්ලගන්නවා
        socket.on('update-rider-location', async (data) => {
            const { orderId, riderId, latitude, longitude } = data;

            try {
                // 1. Database එකේ location එක update කරනවා (ඕනෙ නම් විතරක්)
                await DeliveryTracking.findOneAndUpdate(
                    { order: orderId },
                    { 
                        rider: riderId,
                        location: { type: 'Point', coordinates: [longitude, latitude] }
                    },
                    { upsert: true, new: true }
                );

                // 2. ඒ කාමරේ (Room) ඉන්න හැමෝටම (Customer ට) සජීවීව location එක යවනවා
                io.to(orderId).emit('rider-location-changed', { latitude, longitude });
                
            } catch (err) {
                console.error(`[SOCKET ERROR] ${err.message}`);
            }
        });

        socket.on('disconnect', () => {
            console.log(`[SOCKET] User disconnected: ${socket.id}`);
        });
    });
};

module.exports = socketHandler;