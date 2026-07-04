import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { fetchAdminOrders, updateOrderStatus } from '../services/api';

const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'cooking', label: 'Processing' },
    { value: 'out-for-delivery', label: 'Out for Delivery' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' }
];

const formatDate = (value) => new Date(value).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
});

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const loadOrders = async () => {
        setLoading(true);
        try {
            const res = await fetchAdminOrders();
            setOrders(res.data?.data || res.data || []);
            setError('');
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
            await loadOrders();
        } catch (err) {
            console.error('Update order status error:', err.response?.data || err.message);
            alert('Failed to update order status.');
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-6">
                    <h1 className="text-3xl font-black text-gray-900">Admin Orders Dashboard</h1>
                    <p className="text-gray-500 mt-2">Manage customer orders, update statuses, and review order details in one place.</p>
                </div>

                {loading ? (
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center text-gray-500">Loading orders...</div>
                ) : error ? (
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center text-red-500">{error}</div>
                ) : orders.length === 0 ? (
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center text-gray-500">No orders found yet.</div>
                ) : (
                    <div className="overflow-x-auto bg-white rounded-3xl border border-gray-100 shadow-sm">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Order ID</th>
                                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Address</th>
                                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Products</th>
                                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment</th>
                                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {orders.map(order => (
                                    <tr key={order._id} className="hover:bg-gray-50">
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{order._id.slice(-8).toUpperCase()}</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                                            <div className="font-semibold">{order.customer?.name || 'Unknown'}</div>
                                            <div className="text-gray-400">{order.customer?.email || 'No email'}</div>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{order.customer?.phone || 'N/A'}</td>
                                        <td className="px-4 py-4 text-sm text-gray-700 max-w-xs">
                                            <div className="wrap-break-word">{order.deliveryAddress || 'N/A'}</div>
                                        </td>
                                        <td className="px-4 py-4 text-sm text-gray-700">
                                            <div className="space-y-2">
                                                {order.items?.map(item => (
                                                    <div key={item.product?._id || item.product} className="flex justify-between gap-4">
                                                        <span>{item.product?.name || 'Product'}</span>
                                                        <span className="font-semibold">x{item.quantity}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 font-black">Rs. {order.totalPrice}.00</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{order.paymentMethod?.toUpperCase() || 'N/A'}</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                                            <select
                                                value={order.status}
                                                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                                className="border border-gray-200 rounded-2xl p-2 text-sm bg-white focus:outline-none focus:border-green-500"
                                            >
                                                {statusOptions.map(({ value, label }) => (
                                                    <option key={value} value={value}>{label}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(order.createdAt)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminOrders;
