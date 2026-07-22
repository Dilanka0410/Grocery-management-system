import axios from 'axios';

const API = axios.create({
    // 💡 Localhost වෙනුවට 127.0.0.1 දැම්මා මචං Windows IP පටලැවිල්ල නැති වෙන්නම
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
export const createProductAPI = (productData) => API.post('/products', productData);
export const updateProductAPI = (productId, productData) => API.put(`/products/${productId}`, productData);
export const deleteProductAPI = (productId) => API.delete(`/products/${productId}`);

export const fetchCategories = () => API.get('/categories');
export const createOrderAPI = (orderData) => API.post('/orders', orderData);
export const initiatePaymentAPI = (orderId) => API.post(`/orders/${orderId}/pay`, { orderId });
export const fetchAdminOrders = () => API.get('/admin/orders');
export const updateOrderStatus = (orderId, status) => API.put(`/admin/orders/${orderId}/status`, { status });

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