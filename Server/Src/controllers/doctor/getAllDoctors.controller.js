const Doctor = require('../../models/doctor.model');

const getAllDoctors = async (req, res) =>{
    try{
        const getDoctors = await Doctor.find({},
            "userId image specialization about fees schedules"
        ).populate("userId", "name phone isActive");

        return res.status(200).json({
            success: true,
            message: "Doctors retreived successfully",
            data: getDoctors
        });
    }catch(err){
        console.error('add doctor error:', err);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

module.exports = getAllDoctors;