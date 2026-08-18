const User = require('../../models/user.model');
const bcrypt = require('bcrypt');

const addUser = async (req, res) => {
    try{
        const {
            name, 
            phone, 
            address, 
            staffCode, 
            password, 
            role
        } = req.body;

        if(!name || !phone || !staffCode || !password){
            return res.status(400).json({
                STATUS_CODE: 400,
                message: "Missing required fields"
            });
        }
        const normalizedPhone = phone.tirm();
        
        const existingUser = await User.findOne({phone: normalizedPhone});

        if(existingUser){
            return res.status(409).json({
                STATUS_CODE: 409,
                message: "User already exists"
            });
        };

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name, 
            phone: normalizedPhone, 
            address, 
            staffCode, 
            password: hashedPassword, 
            role
        });

        const userResponse = newUser.toObject();
        delete userResponse.password;

        return res.status(201).json({
            success: true,
            data: userResponse,
        });

    }catch(err){

        console.error('addUser error:', err);
        return res.status(500).json({ 
            success: false, 
            message: 'Internal server error'
        });
    }
};
module.exports = addUser;