const mongoose=require("mongoose");
const objectId=mongoose.Schema.Types.ObjectId;

const appointmentModel= mongoose.Schema({
    patient:{
        type:objectId,
        ref:"Patient",
        required:true,
    },
    doctor:{
        type:objectId,
        ref:"Doctor",
        required:true,
    },
    feeSnapshot:{
            type: Number,
            min: 0,
    },

    startAt:{
        type: Date,
        required: true,  
    },
    endAt:{
        type: Date,
        required: true,
        validate: {
        validator: function (v) {
            return v > this.startAt;
        },
        message: "endAt must be after startAt"
    }
    },
    slotStart: {
        type: Date
    },
    // for duplication avoidance
    status:{
        type:String,
        enum:[  
            "pending",
            "confirmed",
            "checked_in",
            "cancelled",
            "no_show"
            ],
            
        default:"pending"
    },
    source:{
        type:String,
        enum:[
            "phone",
            "walk_in",
            "admin",
            "online"
            ],
        required:true,
        default:"admin"
    },
    bookingNotes:{
        type:String,
        trim:true,
        maxlength: 500,
    },
    appointmentType:{
        type:String,
        enum :
        [
            "initial_consultation",
            "follow_up",
            "routine_checkup",
            "post_op_follow_up"
        ]
    },
    createdBy:{type:objectId,
        ref:"User",
        required:true,
    },
    confirmedBy:{ 
        type: ObjectId, ref: "User"
    },
    confirmedAt:{
        type:Date,
    },
    checkedInAt:{
        type:Date,
    },
    checkedInBy:{ 
        type:ObjectId, 
        ref:"User" 
    },
    noShowAt:{
        type:Date,
    },
    noShowBy: {
            type:objectId,
            ref:"User"
    },
    cancelledAt:{
        type: Date,
    },
    cancelledBy:{
        type:objectId,
        ref:"User",
    },
    cancellationReason:{
        type: String,
        trim:true
    },
    cancellationInitiatedBy:{
        type:String,
        enum:["patient", "clinic"],
    },
    visit: {
        type:objectId,
        ref: "Visit",
        default: null,
    },

},{timestamps:true});

// appointmentSchema.index({ doctor: 1, startAt: 1 });

// // Patient appointment history, most recent first
// appointmentSchema.index({ patient: 1, startAt: -1 });

// // Status-filtered dashboards within a date window
// appointmentSchema.index({ status: 1, startAt: 1 });

// // Branch-scoped scheduling and reporting
// appointmentSchema.index({ clinic: 1, startAt: 1 });

// // Recent-bookings feed
// appointmentSchema.index({ createdAt: -1 });


module.exports= mongoose.model("Appointment",appointmentModel);