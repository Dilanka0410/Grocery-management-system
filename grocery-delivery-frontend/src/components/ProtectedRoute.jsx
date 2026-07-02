import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole }) => {
    const token = localStorage.getItem('token');
    const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;

    if (!token) {
        return <Navigate to="/login" />;
    }

    if (requiredRole && (!userInfo || userInfo.role !== requiredRole)) {
        return <Navigate to="/" />;
    }

    return children;
};

export default ProtectedRoute;