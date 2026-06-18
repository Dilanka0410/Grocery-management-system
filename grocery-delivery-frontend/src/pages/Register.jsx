import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Phone, ArrowRight } from 'lucide-react';
import { registerAPI } from '../services/api'; // 👈 උඹේ registerAPI එක import කරා

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // 🚀 උඹේ API Function එක හරහා Backend එකට ඩේටා යැවීම
            await registerAPI(formData);
            alert("Account Created Successfully! Please Login.");
            navigate('/login'); 
        } catch (err) {
            setError(err.response?.data?.message || 'Register failed. Try again!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full border border-gray-100">
                <div className="text-center mb-6">
                    <span className="text-3xl font-black text-green-600">💡 GROCERY<span className="text-orange-500">DASH</span></span>
                    <h2 className="text-2xl font-black text-gray-800 mt-4">Create Account</h2>
                    <p className="text-gray-400 text-sm mt-1">Join us to order fresh groceries today</p>
                </div>

                {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-bold mb-4 text-center border border-red-100">{error}</div>}

                <form onSubmit={handleRegister} className="space-y-4">
                    <div className="relative">
                        <User className="absolute left-4 top-3.5 text-gray-400" size={18} />
                        <input type="text" name="name" placeholder="Full Name" required value={formData.name} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-green-500" />
                    </div>
                    <div className="relative">
                        <Mail className="absolute left-4 top-3.5 text-gray-400" size={18} />
                        <input type="email" name="email" placeholder="Email Address" required value={formData.email} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-green-500" />
                    </div>
                    <div className="relative">
                        <Phone className="absolute left-4 top-3.5 text-gray-400" size={18} />
                        <input type="text" name="phone" placeholder="Phone Number" required value={formData.phone} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-green-500" />
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-4 top-3.5 text-gray-400" size={18} />
                        <input type="password" name="password" placeholder="Password" required value={formData.password} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-green-500" />
                    </div>

                    <button type="submit" disabled={loading} className="w-full bg-green-600 text-white font-bold py-3.5 rounded-xl hover:bg-green-700 transition-colors shadow-lg shadow-green-100 flex items-center justify-center gap-2 disabled:bg-gray-400">
                        <span>{loading ? 'Creating Account...' : 'Sign Up'}</span>
                        {!loading && <ArrowRight size={18} />}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-400 mt-6">Already have an account? <Link to="/login" className="text-green-600 font-bold hover:underline">Login here</Link></p>
            </div>
        </div>
    );
};

export default Register;