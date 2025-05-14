const { stack } = require("../app");
const ErrorHandler = require("../utils/errorHandler");

module.exports = (err,req,res,next) => {
          err.statusCode = err.statusCode || 500;


          if (process.env.NODE_ENV === 'development') {
                return res.status(err.statusCode || 500).json({
                success: false,
                message: err.message,
                stack: err.stack,
                error: err
          });   
}



    if (process.env.NODE_ENV === 'production') {
        let message = err.message;
        let error = new ErrorHandler(message);
        
    // Validation Error
        if (err.name === "ValidationError") {
        message = Object.values(err.errors).map(value => value.message).join(", ");
        error = new ErrorHandler(message, 400);
        }

    // Cast Error (e.g., invalid MongoDB ObjectId)
        else if (err.name === "CastError") {
        message = `Resource not found: Invalid ${err.path}`;
        error = new ErrorHandler(message, 404);
        }

        return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
        });
    }



                 

          
    }


