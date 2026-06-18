const ApiResponse = require('../utils/apiResponse');
const logger = require('../utils/logger'); // උඹේ logger එකක් තියෙනවා නම්

const errorMiddleware = (err, req, res, next) => {
    // මොකක් හරි නොදන්නා error එකක් ආවොත් standard status code එක 500 දානවා
    const statusCode = err.statusCode || 500;
    const message = err.message || "Something went wrong on the server";

    // Error එක Server Console එකේ Print කරනවා (For Debugging)
    console.error(`[ERROR] ${req.method} ${req.url} - ${message}`);

    return ApiResponse.error(res, message, statusCode);
};

module.exports = errorMiddleware;