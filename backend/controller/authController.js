const catchAsyncError = require("../middleware/catchAsyncError");

exports.registerUser = catchAsyncError(async (req, res, next)=>{
        const {name, email, password, avatar}  req.body
})