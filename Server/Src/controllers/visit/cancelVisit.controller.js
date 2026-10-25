const mongoose= require("mongoose");
const visitModel=require("../../models/visits.models");
const doctorModel= require("../../models/doctor.model")

const cancellVisitController= async(req,res)=>{
    try {
        const {cancellationReason}=req.body;
        if(
        typeof cancellationReason !== "string" ||
        !cancellationReason.trim() ||
        cancellationReason.trim().length > 500
        ){
            return res.status(400).json({
                status_code :400,
                message: "Cancellation reason must be between 1 and 500 characters", 
                data: null
            });
        }
        const visitId=req.params.visitId;
        if(!mongoose.isValidObjectId(visitId)){
            return res.status(400).json({
                status_code: 400,
                message: "Invalid Visit ID",
                data: null
            }); 
        };

        const visitDoc= await visitModel.findById(visitId);
        if(!visitDoc){
            return res.status(404).json({
                status_code :404,
                message: "Visit Is Not Found", 
                data: null
            });
        }
        if(visitDoc.status !=="in_progress"){
            return res.status(400).json({
                status_code: 400,
                message: "Only in-progress visits can be cancelled",
                data: null
            });
        }
        let doctorDoc = null;
        if(req.user.role==="doctor"){
            doctorDoc= await doctorModel
            .findOne({userId :req.user._id})
            .select("_id")
            .lean()
            if(!doctorDoc || !visitDoc.doctor.equals(doctorDoc._id)) {
            return res.status(403).json({
                status_code: 403,
                message: "You are not authorized to cancel this visit",
                data: null
            });
            }
        }

        const updateFilter = {
            _id: visitId,
            status: "in_progress"
            };

            if(req.user.role === "doctor") {
                updateFilter.doctor = doctorDoc._id;
            }
        const updatedVisit= await visitModel.findOneAndUpdate(
            updateFilter,
            {
                status:"cancelled",
                cancelledBy:req.user._id,
                cancellationReason: cancellationReason.trim(),
                cancelledAt:new Date(),
            },{ new: true, runValidators: true }
        );
        if(!updatedVisit){
            return res.status(409).json({
            status_code: 409,
            message: "Visit status changed or visit is no longer cancellable",
            data: null
        });
        }
        return res.status(200).json({
                status_code :200,
                message: "the visit cancelled successfully", 
                data: updatedVisit
            });
    } catch (error) {
        console.error(error)
        return res.status(500).json({
        status_code: 500,
        message: "Internal Server Error",
        data: null
        });  
    }
};
module.exports=cancellVisitController;
