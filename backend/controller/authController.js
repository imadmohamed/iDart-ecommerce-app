const catchAsyncError = require("../middleware/catchAsyncError");
const User = require("../models/userModel");
const { sendEmail } = require("../utils/email");
const ErrorHandler = require("../utils/errorHandler");
const sendToken = require("../utils/jwt");

// Register a new user
exports.registerUser = catchAsyncError(async (req, res, next) => {
    const { name, email, password, avatar } = req.body;

    const user = await User.create({
        name,
        email,
        password,
        avatar
    });

    // Send JWT token
    sendToken(user, 201, res);
});

// Login user
exports.loginUser = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
        return next(new ErrorHandler("Please enter email and password", 400));
    }

    // Find user and select password field explicitly
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        return next(new ErrorHandler("Invalid email or password", 401));
    }

    // Compare passwords
    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid email or password", 401));
    }

    // Send token
    sendToken(user, 200, res);
});

// Logout user
exports.logoutUser = (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        message: "Logged out"
    });
};

// Forgot password
exports.forgotPassword = catchAsyncError(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new ErrorHandler("User not found with this email", 404));
    }

    const resetToken = user.getResetToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`;

    const message = `Your password reset token is as follows:\n\n${resetUrl}\n\nIf you have not requested this email, please ignore it.`;

    try {
        await sendEmail({
            email: user.email,
            subject: "iDart Password Recovery",
            message
        });

        res.status(200).json({
            success: true,
            message: `Email sent to: ${user.email}`
        });
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        return next(new ErrorHandler(error.message, 500));
    }
});


// const catchAsyncError = require("../middleware/catchAsyncError");
// const User = require("../models/userModel");
// const { sendEmail } = require("../utils/email");
// const ErrorHandler = require("../utils/errorHandler");
// const sendToken = require("../utils/jwt");

// // Register a new user
// exports.registerUser = catchAsyncError(async (req, res, next) => {
//     const { name, email, password, avatar } = req.body;

//     const user = await User.create({
//         name,
//         email,
//         password,
//         avatar
//     });

//     // Send JWT token
//     sendToken(user, 201, res);
// });

// // Login user
// exports.loginUser = catchAsyncError(async (req, res, next) => {
//     const { email, password } = req.body;

//     // Check if email and password is entered by user
//     if (!email || !password) {
//         return next(new ErrorHandler("Please enter email and password", 400));
//     }

//     // Finding user in database
//     const user = await User.findOne({ email }).select("+password");

//     if (!user) {
//         return next(new ErrorHandler("Invalid email or password", 401));
//     }

//     // Check if password is correct
//     const isPasswordMatched = await user.comparePassword(password);

//     if (!isPasswordMatched) {
//         return next(new ErrorHandler("Invalid email or password", 401));
//     }

//     // Send token
//     sendToken(user, 200, res);
// });

// exports.logoutUser = (req, res, next) => {
//     res.cookie('token', null, {
//         expires: new Date(Date.now()),
//         httpOnly: true
//     });

//     res.status(200).json({
//         success: true,
//         message: "Logged out"
//     });
// };

// exports.forgotPassword = catchAsyncError( async (req, res, next) => {
//    const user = await User.findOne({email: req.body.email})

//    if(!user){
//         return next( new ErrorHandler("User not found with this email", 404))
//    }

//     const resetToken = user.getResetToken();
//     await user.save({ validateBeforeSave: false });

// // Now you can send `resetToken` via email


//    //create reset url
//    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`

//    const message = `Your password reset token is as follows \n\n ${resetUrl} \n\n If you have not requested this email, then please ignore it.`;

//    try{

//     sendEmail({
//         email: user.email,
//         subject: "iDart Password Recovery",
//         message
//     })

//     res.status(200).json({
//         success:true,
//         message: `Email sent to: ${user.email}`
//     })

//    }catch(error){
//     user.resetPasswordToken = undefined;
//     user.resetPasswordTokenExpairy = undefined;
//     await user.save({validateBeforeSave: false});
//     return next(new ErrorHandler(error.message, 500))
//    }

// })

