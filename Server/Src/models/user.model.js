const mongoose = require("mongoose");
const personSchema = require("../schema/person.schema");

const userSchema = new mongoose.Schema({
    ...personSchema.obj,

    staffCode:{
        type: String,
        required: true,
        unique: true,
        trim: true,
        match: /^[0-9]{6}$/,
    },
    password:{
        type: String,
        required: true,
        minlength: 8,
        select: false
    },
    role:{
        type: String,
        enum: ['Admin', 'Doctor', 'Receptionist'],
        default: 'Receptionist'
    },
    isActive:{
        type: Boolean,
        default: true
    }
},{
    timestamps: true,
});

module.exports = mongoose.model("User", userSchema);