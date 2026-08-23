const JWT = require('jsonwebtoken');
const User = require('../models/user.model');

const auth = async (req, res, next) =>{
    try{
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: "Not authorized, no token" });
        }

        const token = authHeader?.split(" ")[1];
        const decoded = JWT.verify(token, process.env.JWT_SECRET);
    
        const user = await User.findById(decoded.id).select('-password');
        if(!user){
            return res.status(401).json({message:"user not found"});
        }
        
        req.user = user;
        next();

    }catch(err){ 
        console.error(err);
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Token expired" });
        }
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: "Invalid token" });
        }
        return res.status(500).json({ message: "Something went wrong" });
    }
};
module.exports = auth;