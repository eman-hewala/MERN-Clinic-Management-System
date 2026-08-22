const mongoose = require("mongoose");

const Doctor = require('../../models/doctor.model');

const getDoctor = async (req, res) =>{
    try{
        const {id} = req.params;
        
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                success: false,
                message:"Invalid Doctor Id!"
            });
        };
        const doctor = await Doctor.findById(id)
            .select("userId image specialization about fees schedules")
            .populate("userId", "name phone isActive");

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor not found."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Doctor retrieved successfully!",
            data: doctor
        });

    }catch(err){
        console.error('add doctor error:', err);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

module.exports = getDoctor;