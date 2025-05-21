const catchAsyncError = require("../middleware/catchAsyncError");
const User = require("../models/userModel")
const ErrorHandler = require("../utils/errorHandler")
const sendToken = require("../utils/jwt")

exports.registerUser = catchAsyncError(async (req, res, next)=>{
        const {name, email, password, avatar} = req.body
       const user = await User.create({
                name,
                email,
                password,
                avatar
        });

        // const token = user.getJWTToken();

        // res.status(201).json({
        //         success: true,
        //         user,
        //         token
        // })

        //replace the code 
        
        sendToken(user, 201, res);

})

exports.loginUser = catchAsyncError(async(req, res, next)=> {
        const [email, password] = req.body 

        if(!email || !password){
                return next(new ErrorHandler("Please enter email and password", 400))
        }

        // finding the user in the database

        const user = await User.findOne({email}).select("+passowrd");

        if(!user){
                return next(new ErrorHandler("Invalid email or password", 400))
        }
        
        if(!user.$isValidPassword(password)){
                return next(new ErrorHandler("Invalid email or password", 400))

        }

        sendToken(user, 201, res);

})