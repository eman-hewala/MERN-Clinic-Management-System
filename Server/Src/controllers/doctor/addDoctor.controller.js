const Doctor = require('../../models/doctor.model');

const addDoctor = async (req, res) =>{
    try {
        const {
            userId,
            image,
            specialization,
            about,
            fees,
            schedules
        } = req.body;

        if(!userId || !specialization || !fees || !schedules){
            return res.status(400).json({
                STATUS_CODE: 400,
                message: "Missing required fields"
            });
        }
        const existingDoctor = await Doctor.findOne({userId}).lean();
        
        if(existingDoctor){
            return res.status(409).json({
                STATUS_CODE: 409,
                message: "Doctor already exists"
            });
        };
        
        const newDoctor = await Doctor.create({
            userId,
            image,
            specialization,
            about,
            fees,
            schedules
        });

        return res.status(201).json({
            success: true,
            data: newDoctor,
        });

    }catch(err){
        console.error('add doctor error:', err);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

module.exports = addDoctor;