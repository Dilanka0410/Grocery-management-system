import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Lock, Mail, ArrowRight } from 'lucide-react';
import { loginAPI } from '../services/api'; // 👈 උඹේ loginAPI එක import කරා

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // 🚀 උඹේ API Function එක රන් කිරීම
            const res = await loginAPI({ email, password });
            
            console.log("Login Full Response Data:", res.data); // 💡 ඩිබග් කරලා බලන්න දාපු එකක් මචං

            // 💡 බැක්එන්ඩ් එකෙන් ටෝකන් එක කොහොම ආවත් (data.token හෝ data.data.token) අහුවෙන්න ලියාගත්තා මචං
            const token = res.data?.token || res.data?.data?.token;
            const userName = res.data?.user?.name || res.data?.data?.user?.name || 'User';

            if (token) {
                // උඹේ Interceptor එක බලන්නේ 'token' කියලා නිසා ඒ නමින්ම save කරමු
                localStorage.setItem('token', token); 
                localStorage.setItem('user_name', userName);
                
                alert("Successfully Logged In!");
                
                // 💡 මාරු කලා මචං! navigate('/') වෙනුවට මේක දැම්මාම Axios එකට අලුත්ම Token එක ක්ෂණිකව අහුවෙනවා!
                window.location.href = '/'; 
            } else {
                setError('Login succeeded, but token was not returned from server.');
            }
            
        } catch (err) {
            console.error("Login Fail Details:", err.response?.data || err.message);
            setError(err.response?.data?.message || 'Login failed. Try again!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full border border-gray-100">
                <div className="text-center mb-8">
                    <span className="text-3xl font-black text-green-600">💡 GROCERY<span className="text-orange-500">DASH</span></span>
                    <h2 className="text-2xl font-black text-gray-800 mt-4">Welcome Back</h2>
                    <p className="text-gray-400 text-sm mt-1">Log in to manage your grocery delivery</p>
                </div>

                {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-bold mb-4 text-center border border-red-100">{error}</div>}

                <form onSubmit={handleLogin} className="space-y-5">
                    <div className="relative">
                        <Mail className="absolute left-4 top-3.5 text-gray-400" size={18} />
                        <input type="email" placeholder="Email Address" required value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-green-500" />
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-4 top-3.5 text-gray-400" size={18} />
                        <input type="password" placeholder="Password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-green-500" />
                    </div>

                    <button type="submit" disabled={loading} className="w-full bg-green-600 text-white font-bold py-3.5 rounded-xl hover:bg-green-700 transition-colors shadow-lg shadow-green-100 flex items-center justify-center gap-2 disabled:bg-gray-400">
                        <span>{loading ? 'Signing In...' : 'Sign In'}</span>
                        {!loading && <ArrowRight size={18} />}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-400 mt-6">Don't have an account? <Link to="/register" className="text-green-600 font-bold hover:underline">Register here</Link></p>
            </div>
        </div>
    );
};

export default Login;