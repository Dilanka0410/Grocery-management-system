import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { fetchMyOrdersAPI } from '../services/api';
import { Package, Clock, CheckCircle, Truck, Bike } from 'lucide-react';

const getStatusBadge = (status) => {
    switch(status) {
        case 'pending': return 'bg-yellow-100 text-yellow-800';
        case 'confirmed': return 'bg-orange-100 text-orange-800';
        case 'cooking': return 'bg-blue-100 text-blue-800';
        case 'out-for-delivery': return 'bg-orange-100 text-orange-800';
        case 'delivered': return 'bg-green-100 text-green-800';
        case 'cancelled': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

const getStatusIcon = (status) => {
    switch(status) {
        case 'pending': return <Clock size={16} />;
        case 'confirmed': return <Package size={16} />;
        case 'cooking': return <Package size={16} />;
        case 'out-for-delivery': return <Bike size={16} />;
        case 'delivered': return <CheckCircle size={16} />;
        default: return <Clock size={16} />;
    }
};

const formatDate = (value) => new Date(value).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
});

// Progress Bar Logic
const statuses = ['pending', 'confirmed', 'cooking', 'out-for-delivery', 'delivered'];
const getProgressIndex = (status) => {
    if (status === 'cancelled') return -1;
    // Map backend status to visual stages: Placed -> Processing -> Out for Delivery -> Delivered
    // pending -> 0
    // confirmed, cooking -> 1
    // out-for-delivery -> 2
    // delivered -> 3
    if (status === 'pending') return 0;
    if (status === 'confirmed' || status === 'cooking') return 1;
    if (status === 'out-for-delivery') return 2;
    if (status === 'delivered') return 3;
    return 0;
};

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadOrders = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                window.location.href = '/login';
                return;
            }

            try {
                const res = await fetchMyOrdersAPI();
                setOrders(res.data?.data || res.data || []);
            } catch (err) {
                console.error('Fetch my orders failed:', err.response?.data || err.message);
                setError('Unable to load your orders. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        loadOrders();
    }, []);

    return (
        <div className="bg-gray-50 min-h-screen">
            <Navbar />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24">
                <div className="mb-8 text-center sm:text-left">
                    <h1 className="text-3xl font-black text-gray-900 flex items-center justify-center sm:justify-start gap-3">
                        <Package className="text-green-600" size={32} />
                        My Orders & Tracking
                    </h1>
                    <p className="text-gray-500 mt-2">Track the status of your recent grocery orders</p>
                </div>

                {loading ? (
                    <div className="text-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                        <p className="text-gray-500 font-medium">Fetching your orders...</p>
                    </div>
                ) : error ? (
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-red-100 text-center text-red-500 font-medium">
                        {error}
                    </div>
                ) : orders.length === 0 ? (
                    <div className="bg-white p-12 text-center rounded-3xl border border-gray-100 shadow-sm mt-8">
                        <Package size={48} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="text-xl font-bold text-gray-700 mb-2">No orders yet</h3>
                        <p className="text-gray-500 mb-6">You haven't placed any orders yet. Let's fix that!</p>
                        <a href="/" className="inline-block bg-green-600 text-white font-bold px-8 py-3 rounded-full hover:bg-green-700 transition">
                            Start Shopping
                        </a>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => {
                            const progressIndex = getProgressIndex(order.status);
                            
                            return (
                                <div key={order._id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                                    {/* Order Header */}
                                    <div className="bg-gray-50 p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                        <div>
                                            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Order ID</p>
                                            <p className="font-mono font-black text-gray-800">#{order._id.slice(-8).toUpperCase()}</p>
                                            <p className="text-sm text-gray-500 mt-1">{formatDate(order.createdAt)}</p>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <div className={`px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2 ${getStatusBadge(order.status)}`}>
                                                {getStatusIcon(order.status)}
                                                {order.status.replace('-', ' ').toUpperCase()}
                                            </div>
                                            <p className="font-black text-lg text-green-600">Rs. {order.totalPrice}.00</p>
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        {/* Order Tracking Progress Bar */}
                                        {order.status !== 'cancelled' && (
                                            <div className="mb-8 pt-4 pb-2 px-2 sm:px-8">
                                                <div className="relative">
                                                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-gray-200">
                                                        <div 
                                                            style={{ width: `${(progressIndex / 3) * 100}%` }} 
                                                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500 transition-all duration-500"
                                                        ></div>
                                                    </div>
                                                    <div className="flex justify-between text-xs font-bold text-gray-400 mt-2 px-1">
                                                        <div className={`text-center w-1/4 ${progressIndex >= 0 ? 'text-green-600' : ''}`}>Placed</div>
                                                        <div className={`text-center w-1/4 ${progressIndex >= 1 ? 'text-green-600' : ''}`}>Processing</div>
                                                        <div className={`text-center w-1/4 ${progressIndex >= 2 ? 'text-green-600' : ''}`}>Out for Delivery</div>
                                                        <div className={`text-center w-1/4 ${progressIndex >= 3 ? 'text-green-600' : ''}`}>Delivered</div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Order Items */}
                                        <div className="space-y-4 border-t border-gray-100 pt-6">
                                            <h3 className="font-bold text-gray-800 text-sm">Items Purchased</h3>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {order.items?.map((item, idx) => (
                                                    <div key={idx} className="flex items-center gap-4 bg-gray-50 p-3 rounded-2xl border border-gray-100">
                                                        {item.product?.image ? (
                                                            <img src={item.product.image} alt={item.product.name} className="w-16 h-16 object-contain bg-white p-1 rounded-xl shadow-xs" />
                                                        ) : (
                                                            <div className="w-16 h-16 bg-gray-200 rounded-xl flex items-center justify-center text-gray-400">
                                                                <Package size={24} />
                                                            </div>
                                                        )}
                                                        <div className="flex-1">
                                                            <p className="font-bold text-gray-800 text-sm line-clamp-1">{item.product?.name || 'Unknown Product'}</p>
                                                            <div className="flex justify-between items-center mt-1">
                                                                <p className="text-gray-500 text-xs font-medium">Qty: <span className="font-bold text-gray-700">{item.quantity}</span></p>
                                                                <p className="font-black text-gray-800 text-sm">Rs. {(item.price || (item.product?.price)) * item.quantity}.00</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOrders;
