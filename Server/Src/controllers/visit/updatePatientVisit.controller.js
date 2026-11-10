const mongoose = require("mongoose");
const visitModel = require("../../models/visits.models");
const doctorModel = require("../../models/doctor.model");

const updateVisitController = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({
                status_code: 401,
                message: "Unauthorized request",
                data: null
            });
        }

        if (
            !req.body ||
            typeof req.body !== "object" ||
            Array.isArray(req.body) ||
            Object.keys(req.body).length === 0
        ) {
            return res.status(400).json({
                status_code: 400,
                message: "You should provide at least one field to update",
                data: null
            });
        }

        const allowedFields = [
            "vitalSigns",
            "diagnosis",
            "doctorNotes"
        ];

        const receivedFields = Object.keys(req.body);

        const invalidFields = receivedFields.filter(
            field => !allowedFields.includes(field)
        );

        if (invalidFields.length > 0) {
            return res.status(400).json({
                status_code: 400,
                message: "You are not allowed to update these fields",
                data: null
            });
        }

        const visitId = req.params.visitId;

        if (!mongoose.isValidObjectId(visitId)) {
            return res.status(400).json({
                status_code: 400,
                message: "Invalid Visit ID",
                data: null
            });
        }

        const visitDoc = await visitModel.findById(visitId);

        if (!visitDoc) {
            return res.status(404).json({
                status_code: 404,
                message: "Visit Is Not Found",
                data: null
            });
        }

        const doctorDoc = await doctorModel
            .findOne({ userId: req.user._id })
            .select("_id")
            .lean();

        if (
            !doctorDoc ||
            !visitDoc.doctor ||
            !visitDoc.doctor.equals(doctorDoc._id)
        ) {
            return res.status(403).json({
                status_code: 403,
                message: "You are not authorized to update this visit",
                data: null
            });
        }

        if (visitDoc.status !== "in_progress") {
            return res.status(400).json({
                status_code: 400,
                message: "Only in-progress visits can be updated",
                data: null
            });
        }

        const updateData = {};

        const textFields = [
            "diagnosis",
            "doctorNotes"
        ];

        for (const field of textFields) {
            if (Object.hasOwn(req.body, field)) {
                const value = req.body[field];
                if (typeof value !== "string") {
                    return res.status(400).json({
                        status_code: 400,
                        message: `${field} must be a string`,
                        data: null
                    });
                }

                const trimmedValue = value.trim();

                if (field === "diagnosis" && !trimmedValue) {
                    return res.status(400).json({
                        status_code: 400,
                        message: "Diagnosis cannot be empty",
                        data: null
                    });
                }

                updateData[field] = trimmedValue;
            }
        }

        if (Object.hasOwn(req.body, "vitalSigns")) {
            const vitalSigns = req.body.vitalSigns;
            if (
                !vitalSigns ||
                typeof vitalSigns !== "object" ||
                Array.isArray(vitalSigns)
            ) {
                return res.status(400).json({
                    status_code: 400,
                    message: "Vital signs must be a valid object",
                    data: null
                });
            }

            const allowedVitalSigns = [
                "bloodPressure",
                "heartRate",
                "temperature",
                "respiratoryRate",
                "oxygenSaturation",
                "weight",
                "height"
            ];

            const receivedVitalSigns = Object.keys(vitalSigns);

            if (receivedVitalSigns.length === 0) {
                return res.status(400).json({
                    status_code: 400,
                    message: "Provide at least one vital sign",
                    data: null
                });
            }

            const invalidVitalSigns = receivedVitalSigns.filter(
                field => !allowedVitalSigns.includes(field)
            );

            if (invalidVitalSigns.length > 0) {
                return res.status(400).json({
                    status_code: 400,
                    message: "Invalid vital signs fields",
                    data: null
                });
            }

            const vitalSignsLimits = {
                heartRate: { min: 1, max: 300 },
                temperature: { min: 20, max: 50 },
                respiratoryRate: { min: 1, max: 100 },
                oxygenSaturation: { min: 0, max: 100 },
                weight: { min: 0.1, max: 500 },
                height: { min: 20, max: 300 }
            };

            const regularVitalSigns = receivedVitalSigns.filter(
                field => field !== "bloodPressure"
            );

            for (const field of regularVitalSigns) {
                const value = vitalSigns[field];
                const limits = vitalSignsLimits[field];

                if (
                    typeof value !== "number" ||
                    !Number.isFinite(value) ||
                    value < limits.min ||
                    value > limits.max
                ) {
                    return res.status(400).json({
                        status_code: 400,
                        message: `Invalid value for ${field}`,
                        data: null
                    });
                }

                updateData[`vitalSigns.${field}`] = value;
            }

            if (Object.hasOwn(vitalSigns, "bloodPressure")) {
                const bloodPressure = vitalSigns.bloodPressure;
                if (
                    !bloodPressure ||
                    typeof bloodPressure !== "object" ||
                    Array.isArray(bloodPressure)
                ) {
                    return res.status(400).json({
                        status_code: 400,
                        message: "Blood pressure must be an object",
                        data: null
                    });
                }

                const allowedBPFields = [
                    "systolic",
                    "diastolic"
                ];

                const receivedBPFields = Object.keys(bloodPressure);

                if (receivedBPFields.length === 0) {
                    return res.status(400).json({
                        status_code: 400,
                        message: "Provide systolic or diastolic pressure",
                        data: null
                    });
                }

                const invalidBPFields = receivedBPFields.filter(
                    field => !allowedBPFields.includes(field)
                );

                if (invalidBPFields.length > 0) {
                    return res.status(400).json({
                        status_code: 400,
                        message: "Invalid blood pressure fields",
                        data: null
                    });
                }

                const bpLimits = {
                    systolic: { min: 1, max: 300 },
                    diastolic: { min: 1, max: 200 }
                };

                for (const field of receivedBPFields) {

                    const value = bloodPressure[field];
                    const limits = bpLimits[field];

                    if (
                        typeof value !== "number" ||
                        !Number.isFinite(value) ||
                        value < limits.min ||
                        value > limits.max
                    ) {
                        return res.status(400).json({
                            status_code: 400,
                            message: `Invalid ${field} blood pressure value`,
                            data: null
                        });
                    }

                    updateData[`vitalSigns.bloodPressure.${field}`] = value;
                }

                const systolic =
                    Object.hasOwn(bloodPressure, "systolic")
                        ? bloodPressure.systolic
                        : visitDoc.vitalSigns?.bloodPressure?.systolic;

                const diastolic =
                    Object.hasOwn(bloodPressure, "diastolic")
                        ? bloodPressure.diastolic
                        : visitDoc.vitalSigns?.bloodPressure?.diastolic;

                if (
                    systolic !== undefined &&
                    diastolic !== undefined &&
                    systolic <= diastolic
                ) {
                    return res.status(400).json({
                        status_code: 400,
                        message: "Systolic pressure must be greater than diastolic pressure",
                        data: null
                    });
                }
            }
        }

        const updatedVisit = await visitModel.findOneAndUpdate(
            {
                _id: visitId,
                doctor: doctorDoc._id,
                status: "in_progress",
                __v: visitDoc.__v
            },
            {
                $set: updateData,
                $inc: { __v: 1 }
            },
            {
                new: true,
                runValidators: true
            }
        );        

        if (!updatedVisit) {
            return res.status(409).json({
                status_code: 409,
                message: "Visit status changed or visit is no longer editable",
                data: null
            });
        }

        return res.status(200).json({
            status_code: 200,
            message: "The visit updated successfully",
            data: updatedVisit
        });

    } catch (error) {

        console.error("Update Visit Error:", error);

        if (
            error?.name === "ValidationError" ||
            error?.name === "CastError"
        ) {
            return res.status(400).json({
                status_code: 400,
                message: "Invalid visit data",
                data: null
            });
        }

        return res.status(500).json({
            status_code: 500,
            message: "Internal Server Error",
            data: null
        });
    }
};

module.exports = updateVisitController;