const mongoose=require("mongoose");
const appointmentModel=require("../../models/Appointement.model");

const cancelAppointmentController=async(req,res)=>{
    const {cancellationInitiatedBy,cancellationReason} = req.body;
    try {

        if(!cancellationInitiatedBy || !cancellationReason){
            return res.status(400).json({
                status_code :400,
                message: "all fields is required", 
                data: null
            });
        };
        if (!["patient", "clinic"].includes(cancellationInitiatedBy)) {
            return res.status(400).json({
                status_code: 400,
                message: "Invalid cancellation initiator",
                data: null
            });
        };
        const appointmentId=req.params.appointmentId;
        if(!mongoose.isValidObjectId(appointmentId)){
            return res.status(400).json({
                status_code: 400,
                message: "Invalid Appointment ID",
                data: null
            });        
        };
        const appointment= await appointmentModel.findById(appointmentId);
        if(!appointment){
            return res.status(404).json({
                status_code :404,
                message: "Appointment Is Not Found", 
                data: null
            });
        };
        
        const updatedAppointment = await appointmentModel.findOneAndUpdate({_id:appointmentId,status: {
                $in: ["pending", "confirmed"]},},
            {
                status:"cancelled",
                cancellationInitiatedBy,
                cancellationReason,
                cancelledAt:new Date(),
                cancelledBy : req.user._id
            },{ new: true, runValidators: true });

            if(updatedAppointment===null){
                return res.status(409).json({
                    status_code :409,
                    message: "This Appointment Cannot Be Cancelled", 
                    data: null
            });
            }

        return res.status(200).json({
                status_code :200,
                message: "the appointment cancelled successfully", 
                data: updatedAppointment
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

module.exports=cancelAppointmentController;