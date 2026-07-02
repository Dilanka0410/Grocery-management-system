const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const ApiResponse = require('../utils/apiResponse');

// 💡 Secret එකට Fallback එකක් දෙනවා ලොගින් එකේ හැදුවා වගේම
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_fallback_key_for_development_123';

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            
            // 💡 process.env.JWT_SECRET වෙනුවට අපි උඩින් සෙට් කරපු සේෆ් වැරියබල් එක දානවා
            const decoded = jwt.verify(token, JWT_SECRET);

            // User ගේ විස්තර request එකට දානවා (password එක නැතුව)
            req.user = await User.findById(decoded.id).select('-password');
            
            // 💡 SECURITY CHECK: ටෝකන් එක වැලිඩ් වුණත් යූසර් කෙනෙක් ඩේටාබේස් එකේ ඇත්තටම ඉන්නවාද බලනවා
            if (!req.user) {
                return ApiResponse.error(res, "User associated with this token no longer exists", 401);
            }

            return next(); // 🚀 ඔක්කොම සිරාවටම හරි නම් ඊළඟ ෆන්ක්ෂන් එකට යන්න දෙනවා
            
        } catch (error) {
            console.error('JWT Verification Middleware Error:', error.message); // 💡 සර්වර් කන්සෝල් එකේ ලෙඩේ බලාගන්න ලොග් එකක් දැම්මා
            return ApiResponse.error(res, "Not authorized, token failed", 401);
        }
    }

    if (!token) {
        return ApiResponse.error(res, "Not authorized, no token", 401);
    }
};


const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return ApiResponse.error(res, "Access denied. Admins only!", 403);
    }
};

module.exports = { protect, isAdmin };

