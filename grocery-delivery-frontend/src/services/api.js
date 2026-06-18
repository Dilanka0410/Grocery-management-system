import axios from 'axios';

const API = axios.create({
    // 💡 Localhost වෙනුවට 127.0.0.1 දැම්මා මචං Windows IP පටලැවිල්ල නැති වෙන්නම
    baseURL: 'http://127.0.0.1:5000/api',
    withCredentials: true, // 💡 Backend එකේ CORS credentials එක්ක මැච් වෙන්න මේක අනිවාර්යයි මචං
    headers: { 'Content-Type': 'application/json' },
});

// හැම request එකකටම user ගේ token එක auto ඇතුලත් කරන්න
API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

export const loginAPI = (formData) => API.post('/auth/login', formData);
export const registerAPI = (formData) => API.post('/auth/register', formData);
export const fetchProducts = () => API.get('/products');
export const fetchCategories = () => API.get('/categories');
export const addToCartAPI = (productId, quantity) => API.post('/cart/add', { productId, quantity });
export const getCartAPI = () => API.get('/cart');