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


        //   if(process.env.NODE_ENV == 'production'){
        //             let message = err.message;
        //             let error = {...err};

        //             if(err.name == "ValidationError"){
        //                       message = Object.values(err.errors).map(value => value.message);
        //                       error = new ErrorHandler(message, 400);
        //             }
        //             return res.status(err.statusCode).json({
        //                       success: false,
        //                       message: error.message || "Internal Server Error",
        //             });  
        //   }

          if (process.env.NODE_ENV === 'production') {
                     let message = err.message;
                     let error = { ...err };

                     if (err.name === "ValidationError") {
                     message = Object.values(err.errors).map(value => value.message).join(", ");
                     error = new Error(message);
                     }         

                     return res.status(error.statusCode || 500).json({
                     success: false,
                     message: error.message || "Internal Server Error",
             });
}


                 

          
}


