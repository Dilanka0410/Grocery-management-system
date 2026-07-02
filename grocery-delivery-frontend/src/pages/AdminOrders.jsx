import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { fetchAdminOrders, updateOrderStatus } from '../services/api';

const statuses = ['pending', 'confirmed', 'cooking', 'out-for-delivery', 'delivered', 'cancelled'];

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const loadOrders = async () => {
        try {
            const res = await fetchAdminOrders();
            setOrders(res.data?.data || res.data);
        } catch (err) {
            console.error('Admin fetch orders failed:', err.response?.data || err.message);
            setError('Unable to load admin orders.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOrders();
    }, []);

    const handleStatusChange = async (orderId, status) => {
        try {
            await updateOrderStatus(orderId, status);
            setOrders((prevOrders) => prevOrders.map(order => order._id === orderId ? { ...order, status } : order));
        } catch (err) {
            console.error('Update order status error:', err.response?.data || err.message);
            alert('Failed to update order status.');
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex flex-col gap-4">
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                        <h1 className="text-3xl font-black text-gray-900">Admin Orders Dashboard</h1>
                        <p className="text-gray-500 mt-2">Review and manage all orders in the system.</p>
                    </div>

                    {loading ? (
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center text-gray-500">Loading orders...</div>
                    ) : error ? (
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center text-red-500">{error}</div>
                    ) : orders.length === 0 ? (
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center text-gray-500">No orders found yet.</div>
                    ) : (
                        <div className="grid gap-6">
                            {orders.map(order => (
                                <div key={order._id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                        <div>
                                            <h2 className="text-xl font-black text-gray-900">Order #{order._id.slice(-8)}</h2>
                                            <p className="text-sm text-gray-500 mt-1">Placed by {order.customer?.name || 'Unknown'} ({order.customer?.email || 'No email'})</p>
                                            <p className="text-sm text-gray-500">Phone: {order.customer?.phone || 'Not provided'}</p>
                                        </div>
                                        <div className="flex flex-wrap gap-2 items-center">
                                            <span className="text-sm uppercase tracking-[0.2em] font-black text-gray-500">Status</span>
                                            <select value={order.status} onChange={(e) => handleStatusChange(order._id, e.target.value)} className="border border-gray-200 rounded-2xl p-3 text-sm focus:outline-none focus:border-green-500">
                                                {statuses.map(status => (
                                                    <option key={status} value={status}>{status}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <div className="text-sm text-gray-500">Delivery address</div>
                                            <div className="text-gray-800 font-semibold bg-gray-50 p-4 rounded-3xl border border-gray-100">
                                                {order.deliveryAddress}
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="text-sm text-gray-500">Shipping details</div>
                                            <div className="text-gray-800 font-semibold bg-gray-50 p-4 rounded-3xl border border-gray-100">
                                                {order.shippingAddress?.fullName}<br />
                                                {order.shippingAddress?.phone}<br />
                                                {order.shippingAddress?.houseNo}, {order.shippingAddress?.street}<br />
                                                {order.shippingAddress?.city}, {order.shippingAddress?.district}<br />
                                                {order.shippingAddress?.province} <br />
                                                {order.shippingAddress?.landmark ? `Landmark: ${order.shippingAddress.landmark}` : null}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 bg-gray-50 rounded-3xl border border-gray-100 p-4">
                                        <h3 className="text-sm font-black text-gray-900">Order items</h3>
                                        <div className="mt-4 space-y-3">
                                            {order.items?.map(item => (
                                                <div key={item.product?._id || item.product} className="flex justify-between items-center gap-3 text-sm text-gray-700">
                                                    <div>
                                                        <div className="font-semibold">{item.product?.name || 'Product'}</div>
                                                        <div className="text-gray-400">Qty: {item.quantity}</div>
                                                    </div>
                                                    <div className="font-black">Rs. {item.price * item.quantity}.00</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminOrders;
