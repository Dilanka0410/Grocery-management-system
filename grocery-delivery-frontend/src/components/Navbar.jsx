import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, MapPin, Search } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Navbar = () => {
    const { getCartCount } = useCart(); // 👈 Live Cart count එක ගන්නවා

    return (
        <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-xs">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <span className="text-2xl font-black text-green-600 tracking-tight">💡 GROCERY<span className="text-orange-500">DASH</span></span>
                    </Link>

                    {/* Delivery Location */}
                    <div className="hidden md:flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
                        <MapPin size={18} className="text-orange-500" />
                        <span className="text-sm font-bold text-gray-600">Trincomalee Campus, EU</span>
                    </div>

                    {/* Search Bar */}
                    <div className="flex-1 max-w-md mx-8 relative hidden sm:block">
                        <input type="text" placeholder="Search fresh vegetables, fruits, dairy..." className="w-full bg-gray-50 border border-gray-200 rounded-full py-2.5 pl-12 pr-4 text-sm focus:outline-none focus:border-green-500 transition-colors" />
                        <Search className="absolute left-4 top-3 text-gray-400" size={18} />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-4">
                        <Link to="/cart" className="p-2.5 bg-gray-50 hover:bg-gray-100 rounded-full relative text-gray-700 transition-colors">
                            <ShoppingCart size={22} />
                            {/* Live Badge */}
                            <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-black w-5 h-5 rounded-full flex items-center justify-center scale-95">
                                {getCartCount()}
                            </span>
                        </Link>
                        
                        <Link to="/login" className="flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-full hover:bg-green-700 font-bold text-xs uppercase tracking-wider transition-colors shadow-sm">
                            <User size={16} />
                            <span>Login</span>
                        </Link>
                    </div>

                </div>
            </div>
        </nav>
    );
};

export default Navbar;