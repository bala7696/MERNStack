const catchAsyncError = require('../middlewares/catchAsyncError');
const User = require('../models/userModel');
const OTP = require('../models/otpModel');
const { sendEmail, sendEmailRegistration } = require('../utils/email');
const ErrorHandler = require('../utils/errorHandler');
const sendToken = require('../utils/jwt');
const crypto = require('crypto');


// Register User - /api/v1/register
exports.registerUser = catchAsyncError(async (req, res, next) => {
    const { name, email, password, mobile } = req.body;

    let BASE_URL = process.env.BACKEND_URL
    if (process.env.NODE_ENV === "production") {
        BASE_URL = `${req.protocol}://${req.get('host')}`
    }

    let avatar;
    if (req.file) {   // to understand this avatar concept, see 7th video of MERN stack folder in JVL code YT.
        avatar = `${BASE_URL}/uploads/user/${req.file.originalname}`
    }
    const user = await User.create({
        name,
        email,
        password,
        mobile,
        avatar
    });
    const message = `Hello ${user.name}`
    sendEmailRegistration({
        email: user.email,
        subject: "Bala Ekart Ecommerce",
        message
    })

    sendToken(user, 201, res);

})

// Login User - /api/v1/login

exports.loginuser = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorHandler('Please enter email and password', 400))
    }

    // finding the user from databse

    const user = await User.findOne({ email }).select('+password'); //database will return the password parameter only if we pass select(+password)

    if (!user) {
        return next(new ErrorHandler('Invalid email or password', 401))
    }

    // checking thee enterd password with  encrypted password in database 
    // if (await !user.isValidPassword(password)) {
    //     return next(new ErrorHandler('Invalid email or password', 400))
    // }

    if (await password != user.password) {
        return next(new ErrorHandler('Invalid email or password', 401))
    }

    sendToken(user, 201, res);


})


// Logout User - /api/v1/logout


exports.logoutUser = (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    }).status(200).json({
        success: true,
        message: "Logged Out!"
    })
}

// Forgot password - /api/v1/password/forgot


exports.forgotPassword = catchAsyncError(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new ErrorHandler('User not found with this email', 404))
    }

    const resetToken = user.getResetToken();
    await user.save({ validateBeforeSave: false }) // user validation will not work if we set false
    // const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`

    let BASE_URL = process.env.FRONTEND_URL
    if (process.env.NODE_ENV === "production") {
        BASE_URL = `${req.protocol}://${req.get('host')}`
    }

    const resetUrl = `${BASE_URL}/password/reset/${resetToken}`
    const message = `Your password reset url is as follow \n\n 
    ${resetUrl}\n\n if you have not requested this email, then ignore it.`

    try {
        sendEmail({
            email: user.email,
            subject: "Bala Ekart Password Recovery",
            message
        })

        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email}`
        })

    } catch (err) {
        user.resetPasswordToken = undefined; // we are just setting the value as undefined in database if email is not sent
        user.resetPasswordTokenExpire = undefined;
        await user.save({ validateBeforeSave: flase });
        return next(new ErrorHandler(err.message, 500));
    }

})

// Reset password - /api/v1/password/reset/:token


exports.resetPassword = catchAsyncError(async (req, res, next) => {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordTokenExpire: {
            $gt: Date.now()
        }
    })

    if (!user) {
        return next(new ErrorHandler('Password reset token is invalid or expired.', 401))
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler('Password does not match', 401))
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpire = undefined;
    await user.save({ validateBeforeSave: false });
    sendToken(user, 201, res);

});

// Otp Verification -- /api/v1/otpverify

exports.otpVerification = catchAsyncError(async (req, res, next) => {


    const mobileNo = req.body.mobile;


    const mobile = await OTP.findOne({ mobile: req.body.mobile });
    const user = await OTP.create({
        mobile,
        code
    })

    const resetUrl = `${BASE_URL}/password/reset/${resetToken}`
    const message = `Your password reset url is as follow \n\n 
    ${resetUrl}\n\n if you have not requested this email, then ignore it.`

    try {
        sendEmail({
            email: user.email,
            subject: "Bala Ekart Password Recovery",
            message
        })

        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email}`
        })

    } catch (err) {
        user.resetPasswordToken = undefined; // we are just setting the value as undefined in database if email is not sent
        user.resetPasswordTokenExpire = undefined;
        await user.save({ validateBeforeSave: flase });
        return next(new ErrorHandler(err.message, 500));
    }

})


// Get User profile - /api/v1/myprofile

exports.getUserProfile = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        user
    })
})

//Change Password -- /api/v1/password/change

exports.changePassword = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');

    // check old password

    // checking thee enterd password with  encrypted password in database 
    // if (!await user.isValidPassword(req.body.oldPassword)) {
    //     return next(new ErrorHandler(`Old Password is incorrect`, 401));
    // }

    if (await req.body.oldPassword != user.password) {
        return next(new ErrorHandler(`Old Password is incorrect`, 401));
    }

    //assigning new password

    user.password = req.body.password;
    await user.save();

    res.status(200).json({
        success: true,
    })

})

// Update Profile - /api/v1/update

exports.updateProfile = catchAsyncError(async (req, res, next) => {

    let newUserData = {
        name: req.body.name,
        email: req.body.email
    }

    let avatar;

    let BASE_URL = process.env.BACKEND_URL
    if (process.env.NODE_ENV === "production") {
        BASE_URL = `${req.protocol}://${req.get('host')}`
    }


    if (req.file) {   // to understand this avatar concept, see 7th video of MERN stack folder in JVL code YT.
        avatar = `${BASE_URL}/uploads/user/${req.file.originalname}`
        newUserData = { ...newUserData, avatar }
    }

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,  // if it is true then it will return new updated data otherwise it will return old data 
        runValidators: true
    });

    res.status(200).json({
        success: true,
        user
    })
})


// Admin :   Get All User -- /api/v1/admin/users

exports.getAllUser = catchAsyncError(async (req, res, next) => {
    const users = await User.find();
    res.status(200).json({
        success: true,
        users
    })
})

// Admin :   Get Specific User -- /api/v1/admin/user/:id

exports.getUser = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new ErrorHandler(`User not found with this id ${req.params.id}`))
    }
    res.status(200).json({
        success: true,
        user
    })
})


// Admin : Update User -- /api/v1/admin/user/:id

exports.updateUser = catchAsyncError(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,  // if it is true then it will return new updated data otherwise it will return old data 
        runValidators: true
    });

    res.status(200).json({
        success: true,
        user
    })
});


// Admin : Delete User

exports.deleteUser = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new ErrorHandler(`User not found with this id ${req.params.id}`))
    }

    await user.remove();
    res.status(200).json({
        success: true,
    })

})
