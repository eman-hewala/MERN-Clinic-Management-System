const mongoose = require("mongoose");
const Schedule = require('../schema/schedule.schema');

const doctorSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    image:{
        type: String,
        required: false
    },
    specialization:{
        type: String,
        required: true
    },
    about:{
        type: String,
        required: false
    },
    fees:{
        type: Number,
        required: true,
        min: 0
    },
    schedules:{
        type: [Schedule],
        required: true
    }
},{
    timestamps: true
});
module.exports = mongoose.model("Doctor", doctorSchema);