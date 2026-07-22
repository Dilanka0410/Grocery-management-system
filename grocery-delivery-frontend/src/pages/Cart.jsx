import { useState } from 'react';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import ShippingForm from '../components/ShippingForm';
import { Trash2, Plus, Minus, CreditCard, ShoppingBag, MapPin, CheckCircle } from 'lucide-react';
import { createOrderAPI, initiatePaymentAPI } from '../services/api';

const Cart = () => {
    const { cart, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();
    const [orderStep, setOrderStep] = useState('cart'); // cart -> tracking
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [shippingAddress, setShippingAddress] = useState({
        fullName: '',
        phone: '',
        houseNo: '',
        street: '',
        city: '',
        district: '',
        province: '',
        landmark: '',
        addressLabel: 'Home'
    });

    const handlePlaceOrder = async () => {
        const token = localStorage.getItem('token');
        console.log("Token sent with order:", token);
        if (!token) {
            alert('Please log in to place an order.');
            window.location.href = '/login';
            return;
        }

        if (cart.length === 0) return alert("Your cart is empty!");

        if (!shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.houseNo || !shippingAddress.street || !shippingAddress.city || !shippingAddress.district || !shippingAddress.province) {
            return alert('Please complete your shipping address before placing the order.');
        }

        try {
            const itemsPayload = cart.map(item => ({ product: item._id, quantity: item.quantity, price: item.price }));
            const totalPrice = getCartTotal();
            const deliveryAddress = `${shippingAddress.houseNo}, ${shippingAddress.street}, ${shippingAddress.city}, ${shippingAddress.district}, ${shippingAddress.province}`;
            const orderPayload = { items: itemsPayload, totalPrice, shippingAddress, deliveryAddress, paymentMethod };

            console.log('[CART] placing order payload:', { orderPayload, shippingAddress, deliveryAddress });

            const res = await createOrderAPI(orderPayload);
            const order = res.data?.data || res.data;

            if (!order || !order._id) {
                throw new Error('Failed to create order');
            }

            if (paymentMethod === 'card') {
                const payRes = await initiatePaymentAPI(order._id);
                const paymentUrl = payRes.data?.data?.paymentUrl || payRes.data?.paymentUrl;
                if (paymentUrl) {
                    window.location.href = paymentUrl;
                    return;
                } else {
                    throw new Error('Failed to initiate payment');
                }
            }

            alert('Order created successfully!');
            clearCart();
            setOrderStep('tracking');

        } catch (err) {
            console.error('Place order error:', err.response?.data || err.message);
            const errMsg = err.response?.data?.message || err.message;
            if (errMsg.includes('not found') || errMsg.includes('discontinued') || errMsg.includes('updated')) {
                alert(`Failed to place order: ${errMsg}\n\nYour cart contains stale or discontinued items (perhaps due to a database re-seed). We will reset your cart to resolve this.`);
                clearCart();
            } else {
                alert('Failed to place order: ' + errMsg);
            }
        }
    };

    if (orderStep === 'tracking') {
        return (
            <div className="bg-gray-50 min-h-screen">
                <Navbar />
                <div className="max-w-3xl mx-auto px-4 mt-8 text-center">
                    <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600 animate-bounce">
                            <CheckCircle size={44} />
                        </div>
                        <h2 className="text-3xl font-black text-gray-800 mt-6">Order Placed Successfully!</h2>
                        <button onClick={() => { clearCart(); setOrderStep('cart'); }} className="mt-8 bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-3 rounded-full transition-all">
                            Back to Shopping
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pb-24">
                <h1 className="text-3xl font-black text-gray-800 flex items-center gap-2">
                    <ShoppingBag className="text-green-600" />
                    <span>Your Shopping Cart</span>
                </h1>

                {cart.length === 0 ? (
                    <div className="bg-white p-12 text-center rounded-3xl border border-gray-100 shadow-sm mt-8 max-w-md mx-auto">
                        <p className="text-gray-400 font-medium text-lg">Your cart feels so light. Let's add some healthy items!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                        {/* Cart Items List */}
                        <div className="lg:col-span-2 space-y-4">
                            {cart.map(item => (
                                <div key={item._id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between gap-4">
                                    <img src={item.image} alt={item.name} className="w-16 h-16 object-contain bg-gray-50 p-1 rounded-xl" />
                                    <div className="flex-1">
                                        <h3 className="font-bold text-gray-800 text-sm sm:text-base line-clamp-1">{item.name}</h3>
                                        <p className="text-xs text-gray-400">Rs. {item.price}.00</p>
                                    </div>
                                    <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-xl border border-gray-100">
                                        <button onClick={() => updateQuantity(item._id, -1)} className="p-1.5 bg-white text-gray-600 rounded-lg shadow-xs hover:bg-gray-100"><Minus size={14}/></button>
                                        <span className="font-bold text-sm px-2">{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item._id, 1)} className="p-1.5 bg-white text-gray-600 rounded-lg shadow-xs hover:bg-gray-100"><Plus size={14}/></button>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-black text-gray-800">Rs. {item.price * item.quantity}.00</p>
                                        <button onClick={() => removeFromCart(item._id)} className="text-red-500 hover:text-red-600 mt-1"><Trash2 size={16}/></button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Payment & Summary */}
                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm h-fit space-y-6">
                            <div>
                                <h3 className="font-black text-lg text-gray-800 border-b border-gray-100 pb-3">Order Summary</h3>
                                <div className="mt-4 space-y-2">
                                    <div className="flex justify-between text-gray-500 text-sm">
                                        <span>Subtotal</span>
                                        <span>Rs. {getCartTotal()}.00</span>
                                    </div>
                                    <div className="flex justify-between text-gray-500 text-sm">
                                        <span>Delivery Fee</span>
                                        <span className="text-green-600 font-medium">FREE</span>
                                    </div>
                                    <div className="flex justify-between text-gray-800 font-black text-lg pt-2 border-t border-dashed border-gray-100">
                                        <span>Total</span>
                                        <span>Rs. {getCartTotal()}.00</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h3 className="font-black text-sm text-gray-800 border-b border-gray-100 pb-2">Payment Method</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <button 
                                        type="button"
                                        onClick={() => setPaymentMethod('cod')} 
                                        className={`flex items-center justify-center gap-2 p-3 rounded-2xl border text-xs sm:text-sm font-bold transition-all cursor-pointer ${paymentMethod === 'cod' ? 'border-green-600 bg-green-50 text-green-700 shadow-xs' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                                    >
                                        Cash on Delivery
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => setPaymentMethod('card')} 
                                        className={`flex items-center justify-center gap-2 p-3 rounded-2xl border text-xs sm:text-sm font-bold transition-all cursor-pointer ${paymentMethod === 'card' ? 'border-green-600 bg-green-50 text-green-700 shadow-xs' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                                    >
                                        Pay with Card
                                    </button>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-black text-lg text-gray-800 border-b border-gray-100 pb-3">Shipping Information</h3>
                                <div className="mt-4">
                                    <ShippingForm shippingAddress={shippingAddress} setShippingAddress={setShippingAddress} />
                                </div>
                            </div>

                            <button onClick={handlePlaceOrder} className="w-full bg-green-600 text-white font-black py-4 rounded-xl hover:bg-green-700 transition-colors shadow-lg shadow-green-100 flex items-center justify-center gap-2 cursor-pointer transform active:scale-98">
                                <CreditCard size={18} />
                                <span>Place Grocery Order</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;