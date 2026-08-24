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
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
patientSchema.virtual("age").get(function () {
    const today = new Date();

    let age = today.getFullYear() - this.dateOfBirth.getFullYear();

    const monthDiff = today.getMonth() - this.dateOfBirth.getMonth();

    if (
        monthDiff < 0 ||
        (monthDiff === 0 &&
            today.getDate() < this.dateOfBirth.getDate())
    ) {
        age--;
    }

    return age;
});

module.exports = mongoose.model("Patient", patientSchema);