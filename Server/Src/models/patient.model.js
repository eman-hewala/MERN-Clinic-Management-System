const mongoose = require("mongoose");
const personSchema = require("../schema/person.schema");

const patientSchema = new mongoose.Schema({
    ...personSchema.obj,
    gender:{
        type: String,
        enum: ['Male', 'Female'],
        trim: true,
        required: true
    },
    dateOfBirth:{
        // YY-MM-DD 
        type: Date,
        required: true,
    },
    bloodType:{
        type: String,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
        required: false,
    },
},{
    timestamps: true,
});

module.exports = mongoose.model("Patient", patientSchema);