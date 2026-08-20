const doctorModel=require("../models/doctor.model");
const personSchema=require("../schema/person.schema");
const scheduleSchema=require("../schema/schedule.schema");
const objectId=mongoose.Schema.Types.ObjectId,
const mongoose=require("mongoose");

const appointmentModel= mongoose.Schema({
    ...personSchema.obj,
    ...scheduleSchema.obj,
    userId:{
        type:ObjectId,
        ref:"User",
        require:true,
    },

});


module.exports= mongoose.model("appointment",doctorModel);