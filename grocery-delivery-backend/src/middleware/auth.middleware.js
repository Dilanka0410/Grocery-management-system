const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const ApiResponse = require('../utils/apiResponse');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_fallback_key_for_development_123';

const protect = async (req, res, next) => {
    // 💡 next එකක් නැත්නම් ප්‍රශ්නයක් තියෙනවා, ඒත් අපි ඒක check කරමු
    if (typeof next !== 'function') {
        console.error("Critical Error: 'next' is not a function in protect middleware");
        return ApiResponse.error(res, "Internal Server Error: Middleware configuration issue", 500);
    }

    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, JWT_SECRET);

            req.user = await User.findById(decoded.id).select('-password');
            
            if (!req.user) {
                return ApiResponse.error(res, "User no longer exists", 401);
            }

            // 🚀 return එක අයින් කළා, next() විතරක් call කරන්න
            next(); 
            return; // 💡 මෙතනින් function එක නතර කරන්න, තවදුරටත් රන් වෙන්න දෙන්න එපා
            
        } catch (error) {
            console.error('JWT Verification Error:', error.message);
            return ApiResponse.error(res, "Not authorized, token failed", 401);
        }
    }

    if (!token) {
        return ApiResponse.error(res, "Not authorized, no token", 401);
    }
};

const isAdmin = (req, res, next) => {
    // 💡 මෙතනත් next එකේ type එක චෙක් කරමු
    if (typeof next !== 'function') return ApiResponse.error(res, "Internal Server Error", 500);

    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return ApiResponse.error(res, "Access denied. Admins only!", 403);
    }
};

module.exports = { protect, isAdmin };