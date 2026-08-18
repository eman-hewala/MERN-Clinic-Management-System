const mongoose = require("mongoose");

const personSchema = new mongoose.Schema({
    name: {
        first:{
            type: String,
            required: true,
            trim: true
        },
        middle:{
            type: String,
            required: false,
            trim: true,
        },
        last:{
            type: String,
            required: true,
            trim: true,
        }
    },
    phone:{
        type: String,
        required: true,
        trim: true,
        unique: true,
        match: [/^01[0125][0-9]{8}$/, "Invalid phone number"]
    },
    address: {
        type: String,
        required: false,
        trim: true
    },
},{
    _id: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

const fullName = personSchema.virtual('fullName');

fullName.get(function() {
    return [this.name.first, this.name.middle, this.name.last]
    .filter(Boolean)
    .join(' ');
});

module.exports = personSchema;