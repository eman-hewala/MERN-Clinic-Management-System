const Doctor = require('../../models/doctor.model');

const updateDoctor = async (req, res) =>{
    try{
        const {id} = req.params;
        const {image, about, fees, schedules} = req.body;

        // const updates={};
        // if(image !== undefined) updates.image = image;
        // if(specialization !== undefined) updates.specialization = specialization;
        // if(about !== undefined) updates.about = about;
        // if(fees !== undefined) updates.fees = fees;
        // if(schedules !== undefined) updates.schedules = schedules;

        const updates = {
            image,
            about,
            fees,
            schedules
        };

        Object.keys(updates).forEach((key) => {
            if (updates[key] === undefined) {
                delete updates[key];
            }
        });

        if(Object.keys(updates).length===0){
            return res.status(400).json({ 
                message: 'No valid fields provided to update' 
            });
        };

        const updatedDoctor = await Doctor.findByIdAndUpdate(
            id,
            {$set: updates},
            {
                new: true,
                runValidators: true
            }
        );

        if(!updatedDoctor){
            return res.status(404).json({
                message: "Doctor not found"
            });
        }

        return res.status(200).json({
            message: "Doctor updated successfully",
            data: updatedDoctor
        });

    }catch(err){
        next(err);
    }
};

module.exports = updateDoctor;