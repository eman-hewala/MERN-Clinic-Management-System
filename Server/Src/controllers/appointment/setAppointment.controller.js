const mongoose = require("mongoose");
const appointmentModel = require("../../models/Appointement.model");
const doctorModel = require("../../models/doctor.model");
const patientModel =require("../../models/patient.model");

const setAppointmentController=async(req,res)=>{
    const {
        patient,
        doctor,
        startAt,
        endAt,
        source,
        appointmentType,
        bookingNotes
    } = req.body;

    try {
        if(!patient || !doctor || !startAt || !endAt || !source || !appointmentType){
            return res.status(400).json({
                status_code :400,
                message: "all fields is required", 
                data: null
            });
        };
        if (!mongoose.isValidObjectId(doctor)) {
            return res.status(400).json({
                status_code: 400,
                message: "Invalid doctor ID",
                data: null
            });
        };
        if (!mongoose.isValidObjectId(patient)) {
            return res.status(400).json({
                status_code: 400,
                message: "Invalid patient ID",
                data: null
            });
        };
        
        const doctorId = doctor;
        const patientId = patient;
    
        const doctorData = await doctorModel.findById(doctorId);
        const patientData = await patientModel.findById(patientId);

        if(!doctorData){
            return res.status(404).json({
                status_code :404,
                message: "Doctor Is Not Found", 
                data: null
            });
        };
        if(!patientData){
            return res.status(404).json({
                status_code :404,
                message: "Patient Is Not Found", 
                data: null
            });
        };
        
        const startDate = new Date(startAt);
        const endDate = new Date(endAt);
        //transform string date to real date 
        if(isNaN(startDate.getTime()) || isNaN(endDate.getTime()) ){
            return res.status(400).json({
                status_code :400,
                message: "the date is wrong", 
                data: null
            });
        };
        if(isNaN(endDate.getTime())){
            return res.status(400).json({
                status_code :400,
                message: "the date is wrong", 
                data: null
            });
        };
        //I USED THIS VALIDATION TO INFORM THAT IF THERE ARE SOME THING IS WRONG THE PROCESS STOP BECAUSE THIS LINE(const startDate = new Date(startAt);) WILL GIVE INVALID AND THE CODE WILL COMPELETE

        if( startDate >= endDate){
            return res.status(400).json({
                status_code :400,
                message: "the date is wrong", 
                data: null
            });
        };

        const appointmentDay = startDate.getDate();
        const appointmentHour = startDate.getHours();
        const appointmentMinute = startDate.getMinutes();


const appointment= await appointmentModel.create({
        patient,
        doctor,
        startAt,
        endAt,
        source,
        appointmentType,
        bookingNotes
});
return res.status(200).json({
                status_code :200,
                message: "the appointment add successfully", 
                data: appointment
            });

    } catch (error) {
        console.error(error)
        return res.status(500).json({
        status_code: 500,
        message: "Internal Server Error",
        data: null
        });
    }
}

module.exports=setAppointmentController;