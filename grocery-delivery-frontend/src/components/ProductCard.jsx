import React from 'react';
import { Plus, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 hover:shadow-xl transition-all duration-300 group flex flex-col justify-between">
            <div>
                {/* Image Holder */}
                <div className="h-40 w-full bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center relative">
                    <img 
                        src={product.image} 
                        alt={product.name}
                        className="h-32 object-contain group-hover:scale-110 transition-transform duration-300"
                    />
                    <span className="absolute top-2 left-2 bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">
                        {product.category}
                    </span>
                </div>

                {/* Info */}
                <div className="mt-4">
                    <h3 className="font-bold text-gray-800 text-base line-clamp-1 group-hover:text-green-600 transition-colors">{product.name}</h3>
                    <p className="text-gray-400 text-xs mt-1 line-clamp-2">{product.description}</p>
                </div>
            </div>

            {/* Price & Action */}
            <div className="flex items-center justify-between mt-4 pt-2 border-t border-gray-50">
                <div>
                    <span className="text-[10px] text-gray-400 block uppercase font-bold tracking-wider">Price</span>
                    <span className="text-lg font-black text-gray-900">Rs. {product.price}.00</span>
                </div>
                <button 
                    onClick={() => addToCart(product)}
                    className="bg-green-600 text-white p-2.5 rounded-xl hover:bg-green-700 transition-all shadow-md shadow-green-100 active:scale-95 flex items-center gap-1 font-semibold text-xs"
                >
                    <Plus size={16} />
                    <span>Add</span>
                </button>
            </div>
        </div>
    );
};

export default ProductCard;