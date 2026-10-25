const mongoose = require("mongoose");
const visitModel=require("../../models/visits.models");
const doctorModel= require("../../models/doctor.model");
const getVisitController= async(req,res)=>{
    try {
        const visitId= req.params.visitId;
        if(!mongoose.isValidObjectId(visitId)){
            return res.status(400).json({
                status_code :400,
                message: "Invalid Visit ID", 
                data: null
            });
        }

        let visitQuery;

        if (req.user.role === "doctor") {
            const doctorDoc = await doctorModel
                .findOne({ userId: req.user._id })
                .select("_id")
                .lean();

            if (!doctorDoc) {
                return res.status(403).json({
                    status_code: 403,
                    message: "Doctor profile not found",
                    data: null
                });
            }

            visitQuery = visitModel.findOne({
                _id: visitId,
                doctor: doctorDoc._id
            });
        } else {
            visitQuery = visitModel.findById(visitId);
        }

        const visitDoc= await visitQuery
        .populate("patient" ,
                "name.first name.middle name.last phone gender dateOfBirth bloodType")
        .populate({
                path: "doctor",
                select: "specialization userId",
                populate: {
                    path: "userId",
                    select: "name"
                }
                })
        .populate("finalizedBy", "name").lean();
        if(!visitDoc){
            return res.status(404).json({
                status_code:404,
                message:"Visit Is Not Found",
                data:null
            });
        }
        return res.status(200).json({
                status_code :200,
                message: "The visit was retrieved successfully", 
                data: visitDoc
            });
    } catch (error) {
        return res.status(500).json({
            status_code: 500,
            message: "Internal Server Error",
            data: null
        }); 
    }
};
module.exports=getVisitController;
