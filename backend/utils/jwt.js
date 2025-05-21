const sendToken = (user, statusCode, res) => {

    //Creating JWT Token
    const token = user.getJWTToken();


    //setting cookies

    const options = {
        expaires: new Date(Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000),
        httpOnly:true,
    }

    res.status(statusCode)
    .cookie('token',token, options )
    .json({
        success: true,
        token,
        user,
    })

}
module.exports = sendToken;

