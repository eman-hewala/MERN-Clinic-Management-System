const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({
        day:{
            type: String,
            enum: [
                'Saturday', 
                'Sunday',
                'Monday', 
                'Tuesday', 
                'Wednesday', 
                'Thursday', 
                'Friday',    
            ],
            required: true
        },
        startTime:{
            type: String,
            required: true,
            match: [/^([01]\d|2[0-3]):([0-5]\d)$/]
        },
        endTime:{
            type: String,
            required: true,
            match: [/^([01]\d|2[0-3]):([0-5]\d)$/],
            validate: {
                validator: function (value) {
                    return value > this.startTime;
                }
            }
        }
}, { _id: false });

module.exports = scheduleSchema;