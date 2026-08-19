const User = require('../../models/user.model.js');

const getAllUsers = async (req, res) => {
    try{

        const users = await User.find({}, 
            "name phone address role isActive"
        );

        return res.status(200).json({
            success: true,
            message: "Users retrieved successfully!",
            data: users
        });



    }catch(err){
        console.error('get users error:', err);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    };
};
module.exports = getAllUsers;