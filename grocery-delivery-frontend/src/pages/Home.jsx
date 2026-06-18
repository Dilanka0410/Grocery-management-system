import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { fetchProducts, addToCartAPI } from '../services/api';
import { Clock, ShieldCheck, Truck, Plus, Minus, X, ShoppingCart } from 'lucide-react';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [loading, setLoading] = useState(true);

    // Modals and Popups State
    const [selectedProduct, setSelectedProduct] = useState(null); 
    const [showConfirmPopup, setShowConfirmPopup] = useState(false); 
    const [productToCart, setProductToCart] = useState(null); 
    
    // Quantity / Weight State
    const [quantity, setQuantity] = useState(1);
    const [selectedWeight, setSelectedWeight] = useState("1kg");

    // 💡 ඩේටාබේස් එකේ තියෙන ඇත්තම කැටගරි නමින් Display එක ලස්සනට පෙන්වන්න Map එකක් මචං
    const categoryDisplayNames = {
        "All": "All Items",
        "Staples": "Staples (Sugar/Rice)",
        "Snacks & Confectionery": "Snacks & Biscuits",
        "Dairy & Beverages": "Dairy & Milk",
        "Fresh Produce (Fruits)": "Fresh Fruits",
        "Fresh Produce (Vegetables)": "Fresh Vegetables"
    };

    // Database එකේ තියෙන සිරාවටම මැච් වෙන කැටගරි ලිස්ට් එක මචං මේක
    const categories = ["All", "Staples", "Snacks & Confectionery", "Dairy & Beverages", "Fresh Produce (Fruits)", "Fresh Produce (Vegetables)"];

    // Backend API එකෙන් ඩේටා Fetch කිරීම
    useEffect(() => {
        const getProductsData = async () => {
            try {
                const response = await fetchProducts();
                console.log("Full Axios Response:", response); 

                // 💡 apiResponse helper එකේ හැටියට .data.data එක ඇතුලට එන array එක නූලටම ගන්නවා
                const fetchedData = response.data?.data || response.data;
                console.log("Fetched Products Data Array:", fetchedData); 

                setProducts(Array.isArray(fetchedData) ? fetchedData : []);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching products:", error);
                setLoading(false);
            }
        };
        getProductsData();
    }, []);

    // Add to Cart Click Handler
    const handleAddToCartClick = (product, e) => {
        if (e) e.stopPropagation(); 
        setProductToCart(product);
        setQuantity(1); 
        setSelectedWeight("1kg"); 
        setShowConfirmPopup(true);
    };

    // Confirm Popup එකේ Yes එබුවම ක්‍රියාත්මක වන function එක
    const confirmAddToCart = async () => {
        if (!productToCart) return; // 💡 ආරක්ෂාවට: productToCart එක හිස්නම් මෙතනින්ම නවත්තනවා මචං
        
        try {
            let finalQuantity = quantity;
            // 💡 ලෙඩේ හැදුවා: Optional chaining (?.) දැම්මා Crash නොවෙන්නම
            const productCat = productToCart.category?.name || productToCart.category;
            
            if (productCat === "Staples") {
                finalQuantity = selectedWeight === "500g" ? 0.5 : selectedWeight === "2kg" ? 2 : 1;
            }

            await addToCartAPI(productToCart._id, finalQuantity);
            alert(`${productToCart.name} added to cart successfully!`);
            setShowConfirmPopup(false);
            setSelectedProduct(null); 
        } catch (error) {
            alert("Failed to add item to cart. Please login first!");
            setShowConfirmPopup(false);
        }
    };

    // 💡 100% ක්ම ශුවර් වෙන්න මෙතන කැටගරි ෆිල්ටර් එක ඩේටාබේස් නමටයි ඩිස්ප්ලේ නමටයි දෙකටම මැච් කලා මචං
    const filteredProducts = selectedCategory === "All" 
        ? products 
        : products.filter(p => {
            const productCategoryName = p.category && typeof p.category === 'object' ? p.category.name : p.category;
            
            if (!productCategoryName) return false;

            const currentDisplayName = categoryDisplayNames[selectedCategory] || selectedCategory;

            return (
                productCategoryName.toLowerCase() === selectedCategory.toLowerCase() ||
                productCategoryName.toLowerCase() === currentDisplayName.toLowerCase() ||
                (selectedCategory === "Fresh Produce (Vegetables)" && productCategoryName.toLowerCase().includes("vegetable")) ||
                (selectedCategory === "Fresh Produce (Fruits)" && productCategoryName.toLowerCase().includes("fruit")) ||
                (selectedCategory === "Dairy & Beverages" && productCategoryName.toLowerCase().includes("dairy")) ||
                (selectedCategory === "Snacks & Confectionery" && productCategoryName.toLowerCase().includes("snack"))
            );
        });

    return (
        <div className="bg-gray-50 min-h-screen font-sans antialiased">
            <Navbar />

            {/* Hero Banner */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
                <div className="bg-gradient-to-r from-green-600 to-emerald-700 rounded-3xl p-8 md:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between relative overflow-hidden">
                    <div className="z-10 max-w-xl text-center md:text-left">
                        <span className="bg-green-500/30 text-white text-xs uppercase font-extrabold tracking-widest px-3 py-1 rounded-full">🚀 Rapid 30-Min Delivery</span>
                        <h1 className="text-4xl md:text-5xl font-black text-white mt-4 leading-tight">Fresh Groceries <br />At Your Doorstep.</h1>
                        <p className="text-green-100 mt-4 text-lg">Order fresh vegetables, snacks, and everyday staples at unbeatable prices.</p>
                    </div>
                </div>
            </div>

            {/* Features Info Bar */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-green-50 rounded-full text-green-600"><Clock size={24}/></div>
                    <div><h4 className="font-bold text-gray-800">30 Mins Delivery</h4><p className="text-xs text-gray-400">Super fast delivery network</p></div>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-orange-50 rounded-full text-orange-500"><ShieldCheck size={24}/></div>
                    <div><h4 className="font-bold text-gray-800">100% Fresh Guarantee</h4><p className="text-xs text-gray-400">Organic and handpicked items</p></div>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-blue-50 rounded-full text-blue-500"><Truck size={24}/></div>
                    <div><h4 className="font-bold text-gray-800">Free Shipping</h4><p className="text-xs text-gray-400">On all orders above Rs. 2,500</p></div>
                </div>
            </div>

            {/* Categories Slider */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
                <h2 className="text-2xl font-black text-gray-800 tracking-tight">Explore Categories</h2>
                <div className="flex gap-3 overflow-x-auto pb-4 mt-6 scrollbar-hide">
                    {categories.map(cat => (
                        <button 
                            key={cat} 
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-5 py-3 rounded-full font-bold text-sm whitespace-nowrap transition-all duration-200 ${selectedCategory === cat ? 'bg-green-600 text-white shadow-md shadow-green-200' : 'bg-white border border-gray-200 text-gray-600 hover:border-green-400'}`}
                        >
                            {categoryDisplayNames[cat] || cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Products Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pb-24">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-black text-gray-800">{categoryDisplayNames[selectedCategory] || selectedCategory} Products</h2>
                    <span className="text-sm font-semibold text-gray-400">{filteredProducts.length} Items Available</span>
                </div>
                
                {loading ? (
                    <p className="text-center text-gray-500 mt-10 font-medium">Loading fresh products...</p>
                ) : filteredProducts.length === 0 ? (
                    <p className="text-center text-gray-500 mt-10 font-medium">No products found in this category.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-6">
                        {filteredProducts.map(prod => {
                            const catName = prod.category && typeof prod.category === 'object' ? prod.category.name : prod.category;
                            return (
                                <div 
                                    key={prod._id} 
                                    onClick={() => { setSelectedProduct(prod); setProductToCart(prod); }}
                                    className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group flex flex-col justify-between"
                                >
                                    <div className="overflow-hidden rounded-xl bg-gray-50 h-48 flex items-center justify-center">
                                        {/* 💡 ලෙඩේ හැදුවා: currentTarget සහ self-closing tag එක දැම්මා */}
                                        <img 
                                            src={prod.image} 
                                            alt={prod.name} 
                                            className="object-cover h-full w-full group-hover:scale-105 transition-transform duration-300" 
                                            onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=300"; }}
                                        />
                                    </div>
                                    <div className="mt-4 flex-grow">
                                        <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md">{categoryDisplayNames[catName] || catName}</span>
                                        <h3 className="font-bold text-gray-800 text-base mt-2 line-clamp-1">{prod.name}</h3>
                                        <p className="text-xs text-gray-400 mt-1 line-clamp-2">{prod.description}</p>
                                    </div>
                                    <div className="mt-4 flex items-center justify-between pt-3 border-t border-gray-50">
                                        <span className="text-lg font-black text-gray-900">Rs. {prod.price}.00</span>
                                        <button 
                                            onClick={(e) => handleAddToCartClick(prod, e)}
                                            className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-xl transition-colors shadow-md shadow-green-100"
                                        >
                                            <Plus size={20}/>
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* 1. PRODUCT DETAIL MODAL */}
            {selectedProduct && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-2xl w-full p-6 relative shadow-2xl flex flex-col md:flex-row gap-6">
                        <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-gray-100 p-2 rounded-full"><X size={20}/></button>
                        
                        <div className="w-full md:w-1/2 bg-gray-50 rounded-2xl overflow-hidden h-64 flex items-center justify-center">
                            {/* 💡 ලෙඩේ හැදුවා: currentTarget දැම්මා */}
                            <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=300"; }} />
                        </div>

                        <div className="w-full md:w-1/2 flex flex-col justify-between">
                            <div>
                                <span className="text-xs font-extrabold text-green-600 uppercase tracking-wider">
                                    {selectedProduct.category && typeof selectedProduct.category === 'object' ? selectedProduct.category.name : selectedProduct.category}
                                </span>
                                <h2 className="text-2xl font-black text-gray-800 mt-1">{selectedProduct.name}</h2>
                                <p className="text-gray-500 text-sm mt-3 leading-relaxed">{selectedProduct.description}</p>
                                <div className="text-2xl font-black text-green-600 mt-4">Rs. {selectedProduct.price}.00</div>
                                
                                {/* DYNAMIC VARIANT SELECTOR */}
                                <div className="mt-6 pt-4 border-t border-gray-100">
                                    { ((selectedProduct.category?.name || selectedProduct.category) === "Staples") ? (
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">Select Weight:</label>
                                            <div className="flex gap-2 mt-2">
                                                {["500g", "1kg", "2kg"].map(w => (
                                                    <button 
                                                        key={w} 
                                                        onClick={() => setSelectedWeight(w)}
                                                        className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all ${selectedWeight === w ? 'border-green-600 bg-green-50 text-green-700 ring-2 ring-green-100' : 'border-gray-200 text-gray-600'}`}
                                                    >
                                                        {w} - Rs. {w === "500g" ? selectedProduct.price / 2 : w === "2kg" ? selectedProduct.price * 2 : selectedProduct.price}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">Select Quantity:</label>
                                            <div className="flex items-center gap-3 mt-2">
                                                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50"><Minus size={16}/></button>
                                                <span className="font-black text-gray-800 text-lg w-8 text-center">{quantity}</span>
                                                <button onClick={() => setQuantity(q => q + 1)} className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50"><Plus size={16}/></button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button 
                                onClick={() => setShowConfirmPopup(true)}
                                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-2xl transition-colors flex items-center justify-center gap-2 mt-6 shadow-lg"
                            >
                                <ShoppingCart size={20}/> Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 2. YES/NO CONFIRMATION POPUP */}
            {showConfirmPopup && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl border border-gray-50">
                        <div className="mx-auto w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-4">
                            <ShoppingCart size={30} />
                        </div>
                        <h3 className="text-xl font-black text-gray-800">Add to Cart?</h3>
                        <p className="text-sm text-gray-400 mt-2">Do you want to add <span className="font-bold text-gray-700">"{productToCart?.name}"</span> to your shopping cart?</p>
                        
                        <div className="flex gap-3 mt-6">
                            <button 
                                onClick={() => setShowConfirmPopup(false)}
                                className="w-1/2 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold py-3 px-4 rounded-xl transition-colors"
                            >
                                No, Cancel
                            </button>
                            <button 
                                onClick={confirmAddToCart}
                                className="w-1/2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-colors"
                            >
                                Yes, Add
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;