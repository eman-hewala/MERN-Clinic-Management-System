const mongoose = require("mongoose");

const doctorModel = require("../../models/doctor.model");
const visitModel=require("../../models/visits.models");

const finalizedController = async(req,res)=>{
    try {
        if(!req.user || !req.user._id){
            return res.status(401).json({
                status_code: 401,
                message: "Unauthorized request",
                data: null
            });
        }

        const visitId = req.params.visitId;
        if(!mongoose.isValidObjectId(visitId)){
            return res.status(400).json({
                status_code: 400,
                message: "Invalid Visit ID",
                data: null
            });
        }

        const visitDoc= await visitModel.findById(visitId);
        if(!visitDoc){
            return res.status(404).json({
                status_code: 404,
                message: "Visit Is Not Found",
                data: null
            });
        }

        const doctorDoc= await doctorModel
        .findOne({userId : req.user._id})
        .select("_id")       
        .lean()
        if(
            !doctorDoc ||
            !visitDoc.doctor ||
            !visitDoc.doctor.equals(doctorDoc._id)
        ){
            return res.status(403).json({
                status_code: 403,
                message: "You are not authorized to finalize this visit",
                data: null
            });
        }

        if(visitDoc.status !=="in_progress"){
            return res.status(409).json({
                status_code: 409,
                message: "Only in-progress visits can be finalized",
                data: null
            });
        }

        if (
            typeof visitDoc.diagnosis !== "string" ||
            !visitDoc.diagnosis.trim()
        ) {
            return res.status(400).json({
                status_code: 400,
                message: "Diagnosis is required before finalizing the visit",
                data: null
            });
        }

        const now = new Date();
        const updatedVisit = await visitModel.findOneAndUpdate(
                    {
                        _id: visitId,
                        doctor: doctorDoc._id,
                        status: "in_progress",
                        __v: visitDoc.__v
                    },
                    {
                        $set: {
                            status: "finalized",
                            finalizedBy: req.user._id,
                            finalizedAt: now,
                            endedAt: now
                        },
                        $inc: { __v: 1 }
                    },
                    {
                        new: true,
                        runValidators: true
                    }
                );        
        
                if (!updatedVisit) {
                    return res.status(409).json({
                        status_code: 409,
                        message: "Visit status changed or visit is no longer editable",
                        data: null
                    });
                }
        
                return res.status(200).json({
                    status_code: 200,
                    message: "The visit has been finalized successfully",
                    data: updatedVisit
                });
    } catch (error) {
    console.error(error);

    if (
        error.name === "ValidationError" ||
        error.name === "CastError"
    ) {
        return res.status(400).json({
            status_code: 400,
            message: error.message,
            data: null
        });
    }

    return res.status(500).json({
        status_code: 500,
        message: "Internal server error",
        data: null
    });
}
}

module.exports=finalizedController;