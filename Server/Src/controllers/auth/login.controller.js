const User = require('../../models/user.model');
const JWT = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const login = async (req, res) => {
    try{
        const {staffCode, password} = req.body;

        if(!staffCode || !password){
            return res.status(400).json({
                STATUS_CODE : 400,
                message: "All fields required!"
            });
        }

        const user = await User.findOne({staffCode}).select('+password');

        if(!user){
            return res.status(401).json({
                STATUS_CODE : 401,
                message: "Invalid credentials!"
            });
        }

        if (!user.isActive) {
            return res.status(403).json({
                STATUS_CODE: 403,
                message: "This account has been deactivated."
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.status(401).json({
                STATUS_CODE : 401,
                message: "Invalid credentials!"
            });
        }

        const secret = process.env.JWT_SECRET;

        const token = JWT.sign({
            id: user._id,
            role: user.role,
            }, 
            secret, 
            {expiresIn: '1h'}
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 1000,
            path: "/",
        });

        return res.status(200).json({
        message: "Login successful!",
        data: {
                id: user._id,
                name: user.name,
                role: user.role,
            }
        });
    }
    catch(err){
        console.error("Login error:", err);

        return res.status(500).json({
            STATUS_CODE: 500,
            message: "Something went wrong. Please try again later.",
        });
    }
};

module.exports = login;