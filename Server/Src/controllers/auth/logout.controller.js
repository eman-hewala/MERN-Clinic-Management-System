const logout = async(req,res)=>{
    try{
        res.clearCookie('token',{
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 1000,
            path: "/",
        });

        return res.status(200).json({
            STATUS_CODE: 200,
            message: "Logout successful!"
        });
    }
    catch(err){
        next(err);
    }
};
module.exports = logout;