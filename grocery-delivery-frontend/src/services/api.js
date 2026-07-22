import axios from 'axios';

const API = axios.create({
    // 💡 Pointing this to your local backend so you test all the new code we wrote!
    baseURL: 'https://grocery-management-system-6ytn.onrender.com/api',
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
export const createProductAPI = (productData) => {
    const token = localStorage.getItem('token');
    return API.post('/products', productData, { headers: { Authorization: `Bearer ${token}` } });
};

export const updateProductAPI = (productId, productData) => {
    const token = localStorage.getItem('token');
    return API.put(`/products/${productId}`, productData, { headers: { Authorization: `Bearer ${token}` } });
};

export const deleteProductAPI = (productId) => {
    const token = localStorage.getItem('token');
    return API.delete(`/products/${productId}`, { headers: { Authorization: `Bearer ${token}` } });
};

export const fetchCategories = () => API.get('/categories');
export const createOrderAPI = (orderData) => {
    const token = localStorage.getItem('token');
    return API.post('/orders', orderData, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    });
};
export const fetchMyOrdersAPI = () => {
    const token = localStorage.getItem('token');
    return API.get('/orders/myorders', { headers: { Authorization: `Bearer ${token}` } });
};
export const initiatePaymentAPI = (orderId) => API.post(`/orders/${orderId}/pay`, { orderId });
export const fetchAdminOrders = () => {
    const token = localStorage.getItem('token');
    return API.get('/admin/orders', { headers: { Authorization: `Bearer ${token}` } });
};

export const updateOrderStatus = (orderId, status) => {
    const token = localStorage.getItem('token');
    return API.put(`/admin/orders/${orderId}/status`, { status }, { headers: { Authorization: `Bearer ${token}` } });
};

// 💡 මෙතන වෙනස් කළා මචං: LocalStorage එකේ තියෙන Token එක කෙලින්ම Header එකට Force කරලා යවනවා!
export const addToCartAPI = (productId, quantity) => {
    const token = localStorage.getItem('token');
    return API.post('/cart/add', 
        { productId, quantity },
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
};

export const getCartAPI = () => {
    const token = localStorage.getItem('token');
    return API.get('/cart', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};