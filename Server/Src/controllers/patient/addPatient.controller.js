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
        next(err);
    };
};

module.exports = addPatient;