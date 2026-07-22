import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem('token');
  
  // userInfo හරි user හරි key දෙකෙන්ම ගන්න බලනවා
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem('user') || localStorage.getItem('userInfo') || '{}');
  } catch (e) {
    console.error("Failed to parse user data from localStorage", e);
  }

  console.log("Logged user role:", user?.role);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // user නැත්නම් හෝ role එක සමාන නැත්නම් Home page එකට යවනවා
  if (requiredRole && (!user || user.role !== requiredRole)) {
    return <Navigate to="/" replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;