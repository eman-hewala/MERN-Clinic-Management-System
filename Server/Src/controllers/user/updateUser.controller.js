const User = require('../../models/user.model');

const updateUser = async(req, res)=>{
    try{
        const {id} = req.params;

        const {phone, address, isActive} = req.body;


        const updates = {};
        if (phone !== undefined) updates.phone = phone;
        if (address !== undefined) updates.address = address;
        if (isActive !== undefined) updates.isActive = isActive;


        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ 
                message: 'No valid fields provided to update' 
            });
        };

        const updatedUser = await User.findByIdAndUpdate(
            id, 
            {$set: updates}, 
            {
                new: true,
                runValidators: true
            }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ 
                message: 'User not found' 
            });
        };


        return res.status(200).json({
            message: 'User updated successfully',
            data: updatedUser,
        });


    }catch(err){
        next(err);
    }
};
module.exports = updateUser;