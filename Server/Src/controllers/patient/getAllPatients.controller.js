const Patient = require('../../models/patient.model');

const getAllPatients = async(req, res)=>{
    try{
        const ptients = await Patient.find({},
            "name phone address gender dateOfBirth bloodType"
        );
        return res.status(200).json({
            success: true,
            message: "Ptients retrieved successfully!",
            data: ptients
        });
    }catch(err){
        console.error('get patients error:', err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    };
};

module.exports = getAllPatients;