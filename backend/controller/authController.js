// const catchAsyncError = require("../middleware/catchAsyncError");
// const User = require("../models/userModel")
// const ErrorHandler = require("../utils/errorHandler")
// const sendToken = require("../utils/jwt")

// exports.registerUser = catchAsyncError(async (req, res, next)=>{
//         const {name, email, password, avatar} = req.body
//        const user = await User.create({
//                 name,
//                 email,
//                 password,
//                 avatar
//         });


//         sendToken(user, 201, res);

// })

// exports.loginUser = catchAsyncError(async(req, res, next)=> {
//         const { email, password } = req.body 

//         if(!email || !password){
//                 return next(new ErrorHandler("Please enter email and password", 400))
//         }

//         // finding the user in the database

//         const user = await User.findOne({email}).select("+passowrd");

//         if(!user){
//                 return next(new ErrorHandler("Invalid email or password", 400))
//         }
        
//         if(!user.$isValidPassword(password)){
//                 return next(new ErrorHandler("Invalid email or password", 400))

//         }

//         sendToken(user, 201, res);

// })

const catchAsyncError = require("../middleware/catchAsyncError");
const User = require("../models/userModel");
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

    // Check if email and password is entered by user
    if (!email || !password) {
        return next(new ErrorHandler("Please enter email and password", 400));
    }

    // Finding user in database
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        return next(new ErrorHandler("Invalid email or password", 401));
    }

    // Check if password is correct
    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid email or password", 401));
    }

    // Send token
    sendToken(user, 200, res);
});

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
