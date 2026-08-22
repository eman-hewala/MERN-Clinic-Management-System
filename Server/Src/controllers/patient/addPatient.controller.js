const Patient = require('../../models/patient.model');

const addPatient = async (req, res) => {
    try{
        const{
            name, 
            phone, 
            address, 
            gender, 
            dateOfBirth, 
            bloodType
        } = req.body;

        if(!name || !phone || !gender || !dateOfBirth){
            return res.status(400).json({
                STATUS_CODE: 400,
                message: "Missing required fields"
            });
        }

        const newPatient = await Patient.create({
            name, 
            phone, 
            address, 
            gender, 
            dateOfBirth, 
            bloodType
        });

        return res.status(201).json({
            success: true,
            data: newPatient
        });

    }catch(err){
        if (err.code === 11000) {
            return res.status(409).json({
                STATUS_CODE: 409,
                message: "Patient already exists"
            });
        }
        
        console.error('addPatient error:', err);
        return res.status(500).json({ 
            success: false, 
            message: 'Internal server error'
        });
    };
};

module.exports = addPatient;