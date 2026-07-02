import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminOrders from './pages/AdminOrders';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <div className="App">
      {/* 💡 පිටු අතර මාරු වෙන්න Routes ටික මෙතන ලස්සනට හදනවා */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminOrders /></ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
}

export default App;