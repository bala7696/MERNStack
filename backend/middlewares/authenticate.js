const ErrorHandler = require('../utils/errorHandler');
const catchAsyncError = require('./catchAsyncError');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

exports.isAuthenticatedUser = catchAsyncError(async (req, res, next) => {
    const { token } = req.cookies; /* cookie will come automatically from the request from saved cookies in client side.
    to use that feature we used cookie parser middleware  */

    if (!token) {
        return next(new ErrorHandler('Login first to handle this resource', 401))
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decodedToken.id);
    next();

})

exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ErrorHandler(`Role ${req.user.role} is not allowed.`,401))
        }

        next();
    }

}