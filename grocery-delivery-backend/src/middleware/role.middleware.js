const ApiResponse = require('../utils/apiResponse');

const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return ApiResponse.error(res, `Role (${req.user?.role}) is not allowed to access this resource`, 403);
        }
        next();
    };
};

module.exports = authorizeRoles;