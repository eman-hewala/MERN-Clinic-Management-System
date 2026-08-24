const mongoose = require("mongoose");
const User = require('../../models/user.model.js');

const getUserById = async (req, res) => {
    try{

        const {id} = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user id."
            });
        }
        
        const user = await User.findById(id)
            .select("name phone address role isActive");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        return res.status(200).json({
            success: true,
            message: "User retrieved successfully!",
            data: user
        });

    }catch(err){
        next(err);
    };
};
module.exports = getUserById;