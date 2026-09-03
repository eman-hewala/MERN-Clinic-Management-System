const mongoose=require("mongoose");
const objectId=mongoose.Schema.Types.ObjectId;

const investigationResultModel=mongoose.Schema({
    visit:{
        type: objectId,
        ref: "Visit",
        required :true
    },
    patient:{
        type: objectId,
        ref: "Patient",
        required:true
    },
    investigationOrder: {
        type: objectId,
        ref: "InvestigationOrder",
    },
    source: {
        type :String,
        enum: ["internal","external"]
    },
    category:{
        type: String,
        enum: ["lab","imaging","cardiology","eeg","other"],
        required: true
    },
    type:{
        type: String,
        trim: true,
        required: true
    },
    resultSummary: {
        type: String,
        trim: true
    },
    reportedAt: { 
        type: Date
    },
    reviewedBy: { 
        type: objectId,
        ref: "User" 
    },
    reviewedAt: { 
        type: Date 
    },
    // structuredValues: { type: Schema.Types.Mixed }, ==>for expantion
    attachments: [
    {
        fileUrl: {
            type: String,
            trim: true, 
            required: true
        },
        fileType: {
            type: String,
            trim: true
            },
        uploadedAt: { 
            type: Date,
            default: Date.now 
        },
    },
],

},{timestamps: true});

investigationResultModel.index({ patient: 1, type: 1, reportedAt: -1 }); 
investigationResultModel.index({ order: 1 });
investigationResultModel.index({ reviewedAt: 1 }); 

module.exports=mongoose.model("InvestigationResult",investigationResultModel);
