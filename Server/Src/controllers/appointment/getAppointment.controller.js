const mongoose = require("mongoose");
const appointmentModel=require("../../models/Appointement.model");
const getAppointmentController=async(req,res)=>{
    try {
        const appointmentId = req.params.appointmentId;
        if(!mongoose.isValidObjectId(appointmentId)){
            return res.status(400).json({
                status_code :400,
                message: "Invalid Appointment ID", 
                data: null
            });
        };

        const appointment = await appointmentModel
            .findById(appointmentId)
            .populate("patient", "name phone")
            .populate({
                path: "doctor",
                select: "specialization userId",
                populate: {
                    path: "userId",
                    select: "name"
                }
            }).lean();

        if (!appointment) {
            return res.status(404).json({
                status_code:404,
                message:"Appointment Is Not Found",
                data:null
            });
        };

        if (req.user.role === "doctor") {
            const currentUserId = req.user._id?.toString();
            const doctorUserId = appointment.doctor?.userId?._id?.toString();

        if (!doctorUserId || currentUserId !== doctorUserId) {
            return res.status(403).json({
                status_code: 403,
                message: "Access denied: You can only view your own appointments",
                data: null
                });
            }
        };

    return res.status(200).json({
                status_code :200,
                message: "The appointment was retrieved successfully", 
                data: appointment
            });
        
    } catch (error) {
        console.error(error)
        return res.status(500).json({
        status_code: 500,
        message: "Internal Server Error",
        data: null
        });
    };
};

module.exports=getAppointmentController;