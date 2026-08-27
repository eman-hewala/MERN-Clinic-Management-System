const mongoose=require("mongoose");
const objectId=mongoose.Schema.Types.ObjectId;

const investigationOrdertModel=mongoose.Schema({
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
    orderedBy: {
        type: objectId,
        ref: "User",
        required:true
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
    status: {
        type: String,
        enum:["orderd","in_progress","completed","cancelled"],
        default: "orderd"
    },
    periority: {
        type :String,
        enum:["investigation","routin","urgent"],
        default: "investigation"
    },

    notes: {
        type: String,
        trim: true,
        maxlength: 500,
    },
},{timestamps: true});

// investigationOrdertModel.index({ patient: 1, status: 1 });
// investigationOrdertModel.index({ status: 1, category: 1 });
// investigationOrdertModel.index({visit: 1}); 

// department work queues

module.exports=mongoose.model("InvestigationOrder",investigationOrdertModel);
