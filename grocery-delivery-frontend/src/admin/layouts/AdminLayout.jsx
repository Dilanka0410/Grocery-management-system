import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';

const AdminLayout = () => {
  const navigate = useNavigate();

  // Logout වෙන Function එක
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      {/* 1. વම් පැත්තේ Sidebar එක */}
      <aside style={styles.sidebar}>
        <h2 style={styles.logo}>Grocery Admin</h2>
        <nav style={styles.nav}>
          <Link to="/admin" style={styles.link}>📊 Dashboard</Link>
          <Link to="/admin/products" style={styles.link}>🍎 Products Manage</Link>
          <Link to="/admin/orders" style={styles.link}>📦 Orders</Link>
        </nav>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          🚪 Logout
        </button>
      </aside>

      {/* 2. දකුණු පැත්තේ Main Content එක */}
      <div style={styles.mainContent}>
        {/* Top Header */}
        <header style={styles.header}>
          <h3>Welcome to Admin Panel</h3>
        </header>

        {/* මැද වෙනස් වෙන පිටු (Dashboard, Products, Orders) මෙතනට තමා වැටෙන්නේ */}
        <main style={styles.body}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

// 🎨 Basic Styles (Tailwind/Bootstrap දානකම් ලස්සනට පේන්න)
const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    fontFamily: 'sans-serif',
  },
  sidebar: {
    width: '240px',
    backgroundColor: '#1e293b',
    color: '#fff',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
  },
  logo: {
    fontSize: '20px',
    marginBottom: '30px',
    color: '#38bdf8',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    flex: 1,
  },
  link: {
    color: '#cbd5e1',
    textDecoration: 'none',
    fontSize: '16px',
    padding: '8px 12px',
    borderRadius: '6px',
  },
  logoutBtn: {
    backgroundColor: '#ef4444',
    color: '#fff',
    border: 'none',
    padding: '10px',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  mainContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#fff',
    padding: '15px 30px',
    borderBottom: '1px solid #e2e8f0',
  },
  body: {
    padding: '30px',
    flex: 1,
  }
};

export default AdminLayout;