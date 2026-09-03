const mongoose=require("mongoose");
const objectId=mongoose.Schema.Types.ObjectId;
const medicalRecordModel= mongoose.Schema({
    patient: {
        type: objectId,
        ref: "Patient",
        required: true,
        unique: true
    },
    updatedBy: {
        type: objectId,
        ref: "User"
    },
    chronicDiseases:[
        {
            name: {
                type: String,
                trim: true,
                required: true
            },
            diagnosedAt: {
                type: Date
            },
            notes: {
                type: String,
                trim: true
            }

        }
    ],
    currentMedications: [
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
            },
            notes: {
                type: String,
            }
        }
    ],
    familyHistory: {
        type :String,
        trim :true
    },
    surgeries: [
        {
            name: {
                type: String,
                required: true,
                trim: true
            },
            date: {
                type: Date,
            },
            notes: {
                type: String,
                trim: true
            }
        }
    ],
    allergies: [
        {
            name: {
            type: String,
            trim: true,
            required: true
        },
        type: {
            type: String,
            enum: ["medication","food","environmental","other"]
        },
        reaction: {
            type: String,
            trim: true
        }
        } 
    ]

},{timestamps: true},);

medicalRecordModel.index({ updatedBy: 1 });
medicalRecordModel.index({ updatedAt: -1 });

module.exports= mongoose.model("Medical_record",medicalRecordModel);
