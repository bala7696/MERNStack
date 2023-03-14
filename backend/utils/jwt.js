const sendToken = (user, statuscode, res) => {

    // Creating JWT Token
    const token = user.getJwtToken();

    // Setting the coolies 

    const options = {
        expires: new Date(Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000
        ), // for 7 days
        httpOnly: true
    }

    res.status(statuscode)
        .cookie('token', token, options)
        .json({
            success: true,
            token,
            user
        })

}

module.exports = sendToken;