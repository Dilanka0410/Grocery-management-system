import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';

// Admin imports
import AdminLayout from './admin/layouts/AdminLayout';
import DashboardHome from './admin/pages/DashboardHome';
import ManageProducts from './admin/pages/ManageProducts';
import AdminOrders from './admin/pages/AdminOrders';
import MyOrders from './pages/MyOrders';

function App() {
  return (
    <div className="App">
      {/* 💡 පිටු අතර මාරු වෙන්න Routes ටික මෙතන ලස්සනට හදනවා */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path="/myorders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminLayout /></ProtectedRoute>}>
          <Route index element={<DashboardHome />} />
          <Route path="products" element={<ManageProducts />} />
          <Route path="orders" element={<AdminOrders />} />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
}

export default App;