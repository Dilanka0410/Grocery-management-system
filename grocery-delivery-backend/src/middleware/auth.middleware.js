const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const ApiResponse = require('../utils/apiResponse');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // User ගේ විස්තර request එකට දානවා (password එක නැතුව)
            req.user = await User.findById(decoded.id).select('-password');
            return next();
        } catch (error) {
            return ApiResponse.error(res, "Not authorized, token failed", 401);
        }
    }

    if (!token) {
        return ApiResponse.error(res, "Not authorized, no token", 401);
    }
};

module.exports = protect;