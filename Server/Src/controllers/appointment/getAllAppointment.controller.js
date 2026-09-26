const appointmentModel=require("../../models/Appointement.model");

const getAllAppointmentController=async(req,res)=>{
    try {
        const appointments = await appointmentModel
        .find({})
        .select("patient doctor startAt endAt status")
        // .sort({ startAt: 1 })           
        // .skip(...)
        // .limit(...);
        
        return res.status(200).json({
            status_code :200,
            message: "the process is done successfully", 
            data: appointments
        });
    } catch (error) {
        return res.status(500).json({
            status_code :500,
            message: "Failed to retrieve appointments", 
            data: null
        });
    }
};

module.exports=getAllAppointmentController;
