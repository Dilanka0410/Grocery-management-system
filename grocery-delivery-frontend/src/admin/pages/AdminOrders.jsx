import React, { useEffect, useState } from 'react';
import { fetchAdminOrders, updateOrderStatus } from '../../services/api';
import { Package, Clock, CheckCircle, Truck, Filter } from 'lucide-react';

const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'cooking', label: 'Processing' },
    { value: 'out-for-delivery', label: 'Out for Delivery' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' }
];

const getStatusBadge = (status) => {
    switch(status) {
        case 'pending': return 'bg-yellow-100 text-yellow-800';
        case 'confirmed': return 'bg-orange-100 text-orange-800';
        case 'cooking': return 'bg-blue-100 text-blue-800';
        case 'out-for-delivery': return 'bg-purple-100 text-purple-800';
        case 'delivered': return 'bg-green-100 text-green-800';
        case 'cancelled': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

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
    const [filterStatus, setFilterStatus] = useState('all');

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
            // Re-fetch to guarantee sync with backend, but we could also update state optimistically
            await loadOrders();
        } catch (err) {
            console.error('Update order status error:', err.response?.data || err.message);
            alert('Failed to update order status.');
        }
    };

    // Calculate Summary Stats
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const processingOrders = orders.filter(o => o.status === 'cooking' || o.status === 'confirmed').length;
    const completedOrders = orders.filter(o => o.status === 'delivered').length;

    // Filter Logic
    const filteredOrders = filterStatus === 'all' 
        ? orders 
        : orders.filter(o => o.status === filterStatus);

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 min-h-[500px]">
            <div className="mb-8">
                <h2 className="text-2xl font-black text-gray-800">Manage Customer Orders</h2>
                <p className="text-gray-500 mt-1 text-sm">Monitor, filter, and update customer order statuses</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 flex items-center gap-4">
                    <div className="bg-gray-200 p-3 rounded-xl text-gray-700">
                        <Package size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-500">Total Orders</p>
                        <h3 className="text-2xl font-black text-gray-800">{totalOrders}</h3>
                    </div>
                </div>
                <div className="bg-yellow-50 border border-yellow-100 rounded-2xl p-5 flex items-center gap-4">
                    <div className="bg-yellow-200 p-3 rounded-xl text-yellow-700">
                        <Clock size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-yellow-700">Pending</p>
                        <h3 className="text-2xl font-black text-yellow-900">{pendingOrders}</h3>
                    </div>
                </div>
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 flex items-center gap-4">
                    <div className="bg-blue-200 p-3 rounded-xl text-blue-700">
                        <Truck size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-blue-700">Processing</p>
                        <h3 className="text-2xl font-black text-blue-900">{processingOrders}</h3>
                    </div>
                </div>
                <div className="bg-green-50 border border-green-100 rounded-2xl p-5 flex items-center gap-4">
                    <div className="bg-green-200 p-3 rounded-xl text-green-700">
                        <CheckCircle size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-green-700">Completed</p>
                        <h3 className="text-2xl font-black text-green-900">{completedOrders}</h3>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex justify-between items-center mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div className="flex items-center gap-2 text-gray-700 font-semibold">
                    <Filter size={18} />
                    <span>Filter by Status:</span>
                </div>
                <select 
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="border border-gray-200 bg-white rounded-lg px-4 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                    <option value="all">All Orders</option>
                    {statusOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
            </div>

            {/* Loading & Error States */}
            {loading ? (
                <div className="text-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-gray-500 font-medium">Fetching orders...</p>
                </div>
            ) : error ? (
                <div className="text-center py-10 text-red-500 font-medium bg-red-50 rounded-xl border border-red-100">{error}</div>
            ) : filteredOrders.length === 0 ? (
                <div className="text-center py-20 text-gray-500 font-medium bg-gray-50 rounded-xl border border-gray-100">
                    No orders found matching the criteria.
                </div>
            ) : (
                <div className="overflow-x-auto rounded-xl border border-gray-200">
                    <table className="min-w-full text-left border-collapse">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-4 font-bold text-sm text-gray-600 border-b border-gray-200">Order ID</th>
                                <th className="p-4 font-bold text-sm text-gray-600 border-b border-gray-200">Customer Details</th>
                                <th className="p-4 font-bold text-sm text-gray-600 border-b border-gray-200">Items Purchased</th>
                                <th className="p-4 font-bold text-sm text-gray-600 border-b border-gray-200">Total Amount</th>
                                <th className="p-4 font-bold text-sm text-gray-600 border-b border-gray-200">Order Date</th>
                                <th className="p-4 font-bold text-sm text-gray-600 border-b border-gray-200">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.map(order => (
                                <tr key={order._id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                                    <td className="p-4 align-top">
                                        <span className="font-mono text-xs font-bold text-gray-700 bg-gray-200 px-2 py-1 rounded">
                                            #{order._id.slice(-8).toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="p-4 align-top">
                                        <div className="font-bold text-gray-800">{order.customer?.name || 'Unknown'}</div>
                                        <div className="text-sm text-gray-500 mb-1">{order.customer?.phone || 'No Phone'}</div>
                                        <div className="text-xs text-gray-600 bg-white p-2 rounded border border-gray-200 max-w-[200px]">
                                            {order.deliveryAddress || 'No Address Provided'}
                                        </div>
                                    </td>
                                    <td className="p-4 align-top">
                                        <div className="space-y-1 max-h-32 overflow-y-auto pr-2">
                                            {order.items?.map((item, idx) => (
                                                <div key={idx} className="flex justify-between items-center text-sm border-b border-gray-100 pb-1 last:border-0">
                                                    <span className="text-gray-700 line-clamp-1 mr-2">{item.product?.name || 'Product'}</span>
                                                    <span className="font-bold text-gray-900 bg-gray-100 px-2 rounded">x{item.quantity}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="p-4 align-top">
                                        <div className="font-black text-green-600">Rs. {order.totalPrice}.00</div>
                                        <div className="text-xs text-gray-500 font-semibold mt-1">
                                            {order.paymentMethod?.toUpperCase()}
                                        </div>
                                    </td>
                                    <td className="p-4 align-top">
                                        <div className="text-sm font-medium text-gray-700">
                                            {formatDate(order.createdAt)}
                                        </div>
                                    </td>
                                    <td className="p-4 align-top">
                                        <div className="flex flex-col gap-2">
                                            <span className={`px-3 py-1 text-xs font-bold rounded-full text-center inline-block ${getStatusBadge(order.status)}`}>
                                                {order.status.replace('-', ' ').toUpperCase()}
                                            </span>
                                            
                                            <select
                                                value={order.status}
                                                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                                className="border border-gray-200 rounded-lg p-1.5 text-xs font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                                            >
                                                {statusOptions.map(({ value, label }) => (
                                                    <option key={value} value={value}>{label}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminOrders;
