const mongoose = require("mongoose");

const appointmentModel = require("../../models/Appointement.model");
const doctorModel = require("../../models/doctor.model");
const visitModel=require("../../models/visits.models");

const createVisitController= async(req,res)=>{
    const {
        appointment,
    }=req.body;
    try {
        if(!appointment){
            return res.status(400).json({
            status_code: 400,
            message: "Please Enter Appointment Id",
            data: null
        });
        }
        if(!mongoose.isValidObjectId(appointment)){
            return res.status(400).json({
            status_code: 400,
            message: "Invalid appointment ID",
            data: null
        })
        }
        const appointmentDoc= await appointmentModel.findById(appointment);
        if(!appointmentDoc){
            return res.status(404).json({
                status_code: 404,
                message: "Appointment not found",
                data: null
            });
        }

        const existingVisit= await visitModel.findOne({
            appointment:appointmentDoc._id
        })
        if(existingVisit){
            return res.status(409).json({
                status_code: 409,
                message: "Visit is Already Exists",
                data: null
            });
        }

        if(!["checked_in"].includes(appointmentDoc.status)){
            return res.status(400).json({
                status_code: 400,
                message: "Not Available To make Visit",
                data: null
            });      
        }
        const doctorId=appointmentDoc.doctor;
        const patientId=appointmentDoc.patient;

        if(!mongoose.isValidObjectId(doctorId) || !mongoose.isValidObjectId(patientId)){
            return res.status(400).json({
            status_code: 400,
            message: "Invalid ID",
            data: null
        })
        }
        const userId=req.user._id
        const doctor= await doctorModel.findById(doctorId);
        if(!doctor){
            return res.status(404).json({
                status_code: 404,
                message: "Doctor not found",
                data: null
            });
        }
        if(!doctor.userId.equals(userId)){
            return res.status(403).json({
            status_code: 403,
            message: "You are not authorized to create a visit for this doctor",
            data: null
        })
        }
        const visit = await visitModel.create({
            appointment : appointmentDoc._id,
            doctor: doctorId,
            patient : patientId
            
        });
        return res.status(201).json({
            status_code: 201,
            message: "The Visit Has Been Created Successfully",
            data: visit
        });
    } catch (error) {
        if (error.code === 11000) {
        return res.status(409).json({
        status_code: 409,
        message: "Visit is Already Exists",
        data: null
        });
        }
        return res.status(500).json({
            status_code: 500,
            message: "Internal Server Error",
            data: null
        });
    }
};
module.exports=createVisitController;
