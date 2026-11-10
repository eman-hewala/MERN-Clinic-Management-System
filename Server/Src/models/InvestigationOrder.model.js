const mongoose = require("mongoose");
const objectId = mongoose.Schema.Types.ObjectId;

const investigationOrderModel = new mongoose.Schema({
    visit: {
        type: objectId,
        ref: "Visit",
        required: true
    },
    patient: {
        type: objectId,
        ref: "Patient",
        required: true
    },
    orderedBy: {
        type: objectId,
        ref: "User",
        required: true
    },
    category: {
        type: String,
        enum: [
            "lab",
            "imaging",
            "cardiology",
            "eeg",
            "other"
            ],
        required: true
    },
    type: {
        type: String,
        trim: true,
        required: true 
    },
    diagnosis: {
        type: String,
        trim: true,
        required: true,    
        maxlength: 500
    },
    status: {
        type: String,
        enum: [
            "ordered",
            "in_progress",
            "completed",
            "cancelled"
            ],
        default: "ordered"
    }, 
    priority: { 
        type: String,
        enum: [
            "routine",
            "urgent"
            ], 
        default: "routine"
    },
    notes: {
        type: String,
        trim: true,
        maxlength: 500,
    },
}, { timestamps: true });

investigationOrderModel.index({ status: 1, category: 1, createdAt: -1 });
investigationOrderModel.index({ patient: 1, createdAt: -1 });
investigationOrderModel.index({ visit: 1 });

module.exports = mongoose.model("InvestigationOrder", investigationOrderModel);