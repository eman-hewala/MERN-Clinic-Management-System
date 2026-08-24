const mongoose = require("mongoose");
const Patient = require('../../models/patient.model')

const getPatientById = async(req, res)=>{
    try{
        const {id} = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid patient id."
            });
        }

        const ptient = await Patient.findById(id)
            .select("name phone address gender dateOfBirth bloodType");

        if (!ptient) {
            return res.status(404).json({
                success: false,
                message: "Ptient not found."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Ptient retrieved successfully!",
            data: ptient
        });

    }catch(err){
        next(err);
    };
};

module.exports = getPatientById;