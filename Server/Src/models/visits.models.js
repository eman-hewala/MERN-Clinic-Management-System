const mongoose=require("mongoose");
const objectId=mongoose.Schema.Types.ObjectId;

const visitModel= mongoose.Schema({
    appointment:{
        type: objectId,
        ref:"Appointment",
        required:true
    },
    doctor: {
        type: objectId,
        ref: "Doctor",
        required:true
    },
    patient:{
        type: objectId,
        ref: "Patient",
        required:true
    },
    status:{
        type: String,
        enum: [
            "in_progress",
            "finalized",
            "amended"
            ],
        default: "in_progress"
    },
    startedAt:{
        type: Date,
        default : Date.now
    },
    endedAt: {
        type: Date,
    },
    finalizedAt:{
        type: Date,
    },
    finalizedBy:{
        type: objectId,
        ref:"User",
    },
    vitalSigns: {
        bloodPressure: {
        systolic: {
            type: Number,
            min :0
        },
        diastolic: {
            type: Number,
            min: 0
        }
    },
    heartRate: {
        type: Number,
        min: 0
    },
    temperature: {
        type: Number,
        min: 0
    },
    respiratoryRate: {
        type: Number,
        min :0
    },
    oxygenSaturation: {
        type: Number,
        min : 0
    },
    weight: {
        type: Number,
        min :0
    },
    height: {
        type: Number,
        min: 0
    }
    },
    diagnosis: {
        type: String,
        trim:true,
        maxlength: 500,
    },
    prescriptions: [
        {
            medication:{
                type: String,
                trim: true,
                required : true,
            },
            dosage: {
                type: String,
                trim: true,
                required: true,
            },
            frequency: {
                type: String,
                trim: true,
                required: true,
            },
            duration: {
                type: String,
                trim: true,
                required: true,
            },
            instructions: {
                type: String,
                trim: true,
            }
        }
    ],
    doctorNotes:{
        type: String,
        trim: true,
        maxlength: 500,
    },

},{timestamps: true},);

// visitModel.index({ patient: 1, startedAt: -1 });
// visitModel.index({ doctor: 1, startedAt: -1 });
// visitModel.index({ appointment: 1 });


module.exports=mongoose.model("Visit",visitModel);
