import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import { Trash2, Plus, Minus, CreditCard, ShoppingBag, MapPin, CheckCircle } from 'lucide-react';

const Cart = () => {
    const { cart, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();
    const [orderStep, setOrderStep] = useState('cart'); // cart -> tracking
    const [paymentMethod, setPaymentMethod] = useState('cod');

    const handlePlaceOrder = () => {
        if(cart.length === 0) return alert("Your cart is empty!");
        setOrderStep('tracking'); // කෙලින්ම Tracking Screen එකට මාරු කිරීම
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
                        <p className="text-gray-400 mt-2">Your fresh groceries are being packed by the merchant.</p>

                        {/* Simulated Live Map Tracking Box */}
                        <div className="mt-8 bg-slate-900 text-white p-6 rounded-2xl text-left relative overflow-hidden h-64 flex flex-col justify-between shadow-inner">
                            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
                            
                            <div className="z-10 flex justify-between items-center">
                                <div>
                                    <span className="bg-green-500 text-xs px-2 py-1 rounded-full font-bold">LIVE TRACKING</span>
                                    <h4 className="font-bold text-lg mt-2">Rider: Amal Perera</h4>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-400">Estimated Delivery</p>
                                    <p className="text-xl font-black text-orange-400">18 Mins</p>
                                </div>
                            </div>

                            {/* Simulated Tracking Progress Bar */}
                            <div className="z-10 mt-4">
                                <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
                                    <div className="bg-green-500 h-full w-2/3 animate-pulse rounded-full"></div>
                                </div>
                                <div className="flex justify-between text-xs text-gray-400 mt-2 font-medium">
                                    <span>Order Confirmed</span>
                                    <span className="text-green-400 font-bold">Out for Delivery</span>
                                    <span>Arrived</span>
                                </div>
                            </div>

                            <div className="z-10 border-t border-gray-800 pt-4 flex items-center gap-3 text-sm">
                                <MapPin size={18} className="text-orange-400" />
                                <p className="text-gray-300">Delivering to: <span className="font-bold text-white">Faculty of Applied Science, Trincomalee Campus</span></p>
                            </div>
                        </div>

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
                                    {/* Qty Changer */}
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
                            <h3 className="font-black text-lg text-gray-800 border-b border-gray-100 pb-3">Order Summary</h3>
                            
                            {/* Payment Options */}
                            <div>
                                <label className="text-xs font-bold text-gray-400 block uppercase mb-3">Choose Payment Method</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <div onClick={() => setPaymentMethod('cod')} className={`p-4 border rounded-xl text-center cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-green-600 bg-green-50/20 font-bold text-green-700' : 'border-gray-100 text-gray-600'}`}>
                                        💵 Cash on Delivery
                                    </div>
                                    <div onClick={() => setPaymentMethod('card')} className={`p-4 border rounded-xl text-center cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-green-600 bg-green-50/20 font-bold text-green-700' : 'border-gray-100 text-gray-600'}`}>
                                        💳 Card Payment
                                    </div>
                                </div>
                            </div>

                            {/* Cost Breakdown */}
                            <div className="space-y-2 text-sm border-t border-gray-100 pt-4">
                                <div className="flex justify-between text-gray-500"><span>Subtotal</span><span className="font-bold">Rs. {getCartTotal()}.00</span></div>
                                <div className="flex justify-between text-gray-500"><span>Delivery Fee</span><span className="font-bold text-green-600">{getCartTotal() > 2500 ? "FREE" : "Rs. 250.00"}</span></div>
                                <div className="flex justify-between text-base font-black text-gray-800 pt-2 border-t border-dashed border-gray-200">
                                    <span>Total Bill</span>
                                    <span className="text-xl text-green-600">Rs. {getCartTotal() + (getCartTotal() > 2500 ? 0 : 250)}.00</span>
                                </div>
                            </div>

                            <button onClick={handlePlaceOrder} className="w-full bg-green-600 text-white font-black py-4 rounded-xl hover:bg-green-700 transition-colors shadow-lg shadow-green-100 flex items-center justify-center gap-2">
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