const mongoose = require("mongoose");
const objectId = mongoose.Schema.Types.ObjectId;

const prescriptionModel = new mongoose.Schema({
    visit: {
        type: objectId,
        ref: "Visit",
        required: true,
        unique: true 
    },
    doctor: {
        type: objectId,
        ref: "Doctor",
        required: true
    },
    patient: {
        type: objectId,
        ref: "Patient",
        required: true
    },
    diagnosis: {
        type: String,
        trim: true,
        required: true, 
        maxlength: 500
    },
    medications: [
        {
            medication: {
                type: String,
                trim: true,
                required: true
            },
            dosage: {
                type: String,
                trim: true,
                required: true
            },
            frequency: {
                type: String,
                trim: true,
                required: true
            },
            duration: {
                type: String,
                trim: true,
                required: true
            },
            instructions: {
                type: String,
                trim: true
            }
        }
    ],
    status: {
        type: String,
        enum: ["draft", "issued", "cancelled"],
        default: "draft"
    },
    createdBy: {
        type: objectId,
        ref: "User",
        required: true
    },
    updatedBy: {
        type: objectId,
        ref: "User"
    },
    issuedAt: {
        type: Date
    },
    issuedBy: {
        type: objectId,
        ref: "User"
    },
    cancelledAt: {
        type: Date
    },
    cancelledBy: {
        type: objectId,
        ref: "User"
    },
    cancellationReason: {
        type: String,
        trim: true,
        maxlength: 500
    },
    notes: {
        type: String,
        trim: true,
        maxlength: 1000
    },
}, { timestamps: true });

prescriptionModel.index({ doctor: 1, createdAt: -1 });
prescriptionModel.index({ patient: 1, createdAt: -1 });

module.exports = mongoose.model("Prescription", prescriptionModel);