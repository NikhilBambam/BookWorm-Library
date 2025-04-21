// export const sendToken = (user, statusCode, message, res) =>
// {
//     const token = user.generateToken();
//     res
//     .status(statusCode)
//     .cookie("token",token,{
//         expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 *60 * 60 * 1000),
//         httpOnly:true,
//     })

//     .json({
//         success: true,
//         user,
//         message,
//         token,
//     });
// };

export const sendToken = (user, statusCode, message, res) => {
    const token = user.generateToken();
    
    res
    .status(statusCode)
    .cookie("token", token, {
        expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: true,        // Required for HTTPS (Render uses it)
        sameSite: "None",    // Required for cross-origin cookies
    })
    .json({
        success: true,
        user,
        message,
        token,
    });
};

  