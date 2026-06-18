import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' // 👈 මේක අලුතින් එකතු කරා
import App from './App.jsx'
import './index.css'
import { CartProvider } from './context/CartContext.jsx'; // 👈 CartContext එක import කරා

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 💡 මුළු ඇප් එකම BrowserRouter එක ඇතුලට දානවා */}
    <BrowserRouter>

      
      <CartProvider>
        <App />
      </CartProvider>
    </BrowserRouter>
  </React.StrictMode>,
)