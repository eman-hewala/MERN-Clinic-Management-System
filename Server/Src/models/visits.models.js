const mongoose = require("mongoose");
const objectId = mongoose.Schema.Types.ObjectId;

const visitModel = new mongoose.Schema({
    appointment: {
        type: objectId,
        ref: "Appointment",
        required: true
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
    status: {
        type: String,
        enum: [
            "in_progress",
            "finalized",
            "amended",
            "cancelled"
        ],
        default: "in_progress"
    },
    startedAt: {
        type: Date,
        default: Date.now
    },
    endedAt: {
        type: Date,
    },
    finalizedAt: {
        type: Date,
    },
    finalizedBy: {
        type: objectId,
        ref: "User",
    },
    vitalSigns: {
    bloodPressure: {
        systolic: {
            type: Number,
            min: 1,
            max: 300
        },
        diastolic: {
            type: Number,
            min: 1,
            max: 200
        }
    },

    heartRate: {
        type: Number,
        min: 1,
        max: 300
    },

    temperature: {
        type: Number,
        min: 20,
        max: 50
    },

    respiratoryRate: {
        type: Number,
        min: 1,
        max: 100
    },

    oxygenSaturation: {
        type: Number,
        min: 0,
        max: 100
    },

    weight: {
        type: Number,
        min: 0.1,
        max: 500
    },

    height: {
        type: Number,
        min: 20,
        max: 300
    }
    },
    diagnosis: {
        type: String,
        trim: true,
        maxlength: 500,
    },
    cancelledBy: {
        type: objectId,
        ref: "User",
    },
    cancelledAt: {
        type: Date,
    },
    cancellationReason: {
        type: String,
        trim: true,
        maxlength: 500,
    },
    doctorNotes: {
        type: String,
        trim: true,
        maxlength: 500,
    },
}, { timestamps: true });

visitModel.index({ patient: 1, startedAt: -1 });
visitModel.index({ doctor: 1, startedAt: -1 });
visitModel.index({ appointment: 1 }, { unique: true });

module.exports = mongoose.model("Visit", visitModel);