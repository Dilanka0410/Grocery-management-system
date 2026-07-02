import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios'; // 💡 Axios import කරගන්න මචං

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        const localData = localStorage.getItem('grocery_cart');
        return localData ? JSON.parse(localData) : [];
    });

    useEffect(() => {
        localStorage.setItem('grocery_cart', JSON.stringify(cart));
    }, [cart]);

    // 💡 1. Cart එකට බඩු එකතු කිරීම (Local + Backend)
    const addToCart = async (product) => {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Please login to add items to your cart.');
        }

        // පළමුව ලෝකල් ස්ටේට් එක අප්ඩේට් කරනවා (UI එක ක්ෂණිකව අප්ඩේට් වෙන්න)
        setCart((prevCart) => {
            const existingItem = prevCart.find(item => item._id === product._id);
            if (existingItem) {
                return prevCart.map(item => 
                    item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prevCart, { ...product, quantity: 1 }];
        });

        // දෙවනුව බැක්එන්ඩ් ඩේටාබේස් එකට සේව් කරනවා
        try {
            await axios.post('http://127.0.0.1:5000/api/cart/add', 
                { productId: product._id, quantity: 1 },
                { headers: { Authorization: `Bearer ${token}` } }
            );
        } catch (error) {
            console.error("Backend cart sync failed:", error);
        }
    };

    // 💡 2. Qty අඩු කිරීම හෝ අයින් කිරීම (Local + Backend)
    const removeFromCart = async (productId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Please login to remove items from your cart.');
        }

        setCart(prevCart => prevCart.filter(item => item._id !== productId));

        try {
            await axios.post('http://127.0.0.1:5000/api/cart/remove', 
                { productId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
        } catch (error) {
            console.error("Backend remove failed:", error);
        }
    };

    // 💡 3. Quantity එක වෙනස් කිරීම (Local + Backend)
    const updateQuantity = async (productId, amount) => {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Please login to update cart quantities.');
        }

        setCart(prevCart => prevCart.map(item => {
            if (item._id === productId) {
                const newQty = item.quantity + amount;
                return newQty > 0 ? { ...item, quantity: newQty } : item;
            }
            return item;
        }));

        try {
            await axios.put('http://127.0.0.1:5000/api/cart/update', 
                { productId, amount },
                { headers: { Authorization: `Bearer ${token}` } }
            );
        } catch (error) {
            console.error("Backend update failed:", error);
        }
    };

    const clearCart = () => setCart([]);

    const getCartTotal = () => cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const getCartCount = () => cart.reduce((count, item) => count + item.quantity, 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, getCartTotal, getCartCount }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);