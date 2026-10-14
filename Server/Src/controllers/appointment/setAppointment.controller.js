
const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const appointmentModel = require("../../models/Appointement.model");
const doctorModel = require("../../models/doctor.model");
const patientModel = require("../../models/patient.model");

const CLINIC_TIMEZONE = "Africa/Cairo";

const setAppointmentController = async (req, res) => {
    const {
        patient,
        doctor,
        startAt,
        endAt,
        source,
        appointmentType,
        bookingNotes
    } = req.body;

    try {
        if (
            !patient ||
            !doctor ||
            !startAt ||
            !endAt ||
            !source ||
            !appointmentType
        ) {
            return res.status(400).json({
                status_code: 400,
                message: "All required fields must be provided",
                data: null
            });
        }

        if (!mongoose.isValidObjectId(doctor)) {
            return res.status(400).json({
                status_code: 400,
                message: "Invalid doctor ID",
                data: null
            });
        }

        if (!mongoose.isValidObjectId(patient)) {
            return res.status(400).json({
                status_code: 400,
                message: "Invalid patient ID",
                data: null
            });
        }

        const allowedSources = [
            "phone",
            "walk_in",
            "admin",
            "online"
        ];

        if (!allowedSources.includes(source)) {
            return res.status(400).json({
                status_code: 400,
                message: "Invalid source",
                data: null
            });
        }

        const allowedAppointmentTypes = [
            "initial_consultation",
            "follow_up",
            "routine_checkup",
            "post_op_follow_up"
        ];

        if (!allowedAppointmentTypes.includes(appointmentType)) {
            return res.status(400).json({
                status_code: 400,
                message: "Invalid appointment type",
                data: null
            });
        }

        const [doctorData, patientData] = await Promise.all([
            doctorModel
                .findById(doctor)
                .select("schedules fees"),

            patientModel.findById(patient)
        ]);

        if (!doctorData) {
            return res.status(404).json({
                status_code: 404,
                message: "Doctor not found",
                data: null
            });
        }

        if (!patientData) {
            return res.status(404).json({
                status_code: 404,
                message: "Patient not found",
                data: null
            });
        }

        const parseAppointmentDate = (value) => {
            if (typeof value !== "string") {
                return null;
            }

            const hasTimezone =
                /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?(?:Z|[+-]\d{2}:\d{2})$/i.test(value);

            if (!hasTimezone) {
                return null;
            }

            const parsed = DateTime.fromISO(value, {
                setZone: true
            });

            if (!parsed.isValid) {
                return null;
            }

            const clinicTime = parsed.setZone(CLINIC_TIMEZONE);

            if (parsed.offset !== clinicTime.offset) {
                return null;
            }

            return parsed.toUTC().toJSDate();
        };

        const startDate = parseAppointmentDate(startAt);
        const endDate = parseAppointmentDate(endAt);

        if (!startDate || !endDate) {
            return res.status(400).json({
                status_code: 400,
                message: "Invalid date/time or timezone offset",
                data: null
            });
        }

        if (startDate >= endDate) {
            return res.status(400).json({
                status_code: 400,
                message: "End time must be after start time",
                data: null
            });
        }

        const clinicStart = DateTime
            .fromJSDate(startDate)
            .setZone(CLINIC_TIMEZONE);

        const clinicEnd = DateTime
            .fromJSDate(endDate)
            .setZone(CLINIC_TIMEZONE);

        const schedules = doctorData.schedules;

        if (!schedules || schedules.length === 0) {
            return res.status(400).json({
                status_code: 400,
                message: "Doctor has no available schedule",
                data: null
            });
        }

        if (!clinicStart.hasSame(clinicEnd, "day")) {
            return res.status(400).json({
                status_code: 400,
                message: "Appointment must start and end on the same clinic day",
                data: null
            });
        }

        const daysOfWeek = {
            1: "Monday",
            2: "Tuesday",
            3: "Wednesday",
            4: "Thursday",
            5: "Friday",
            6: "Saturday",
            7: "Sunday"
        };

        const appointmentDay = daysOfWeek[clinicStart.weekday];

        const appointmentStartTime = clinicStart.toFormat("HH:mm");
        const appointmentEndTime = clinicEnd.toFormat("HH:mm");

        const matchingSchedule = schedules.find((schedule) => {
            return schedule.day === appointmentDay;
        });

        if (!matchingSchedule) {
            return res.status(400).json({
                status_code: 400,
                message: "Doctor does not work on this day",
                data: null
            });
        }

        if (
            appointmentStartTime < matchingSchedule.startTime ||
            appointmentEndTime > matchingSchedule.endTime
        ) {
            return res.status(400).json({
                status_code: 400,
                message: "Appointment is outside doctor's working hours",
                data: null
            });
        }

        const overlapFilter = {
            startAt: { $lt: endDate },
            endAt: { $gt: startDate },
            status: {
                $nin: ["cancelled", "no_show"]
            }
        };

        const [doctorConflict, patientConflict] = await Promise.all([
            appointmentModel.exists({
                ...overlapFilter,
                doctor: doctor
            }),

            appointmentModel.exists({
                ...overlapFilter,
                patient: patient
            })
        ]);

        if (doctorConflict) {
            return res.status(409).json({
                status_code: 409,
                message: "Doctor already has an appointment during this time",
                data: null
            });
        }

        if (patientConflict) {
            return res.status(409).json({
                status_code: 409,
                message: "Patient already has an appointment during this time",
                data: null
            });
        }

        const appointment = await appointmentModel.create({
            patient: patientData._id,
            doctor: doctorData._id,
            startAt: startDate,
            endAt: endDate,
            feeSnapshot: doctorData.fees,
            source,
            appointmentType,
            bookingNotes,
            createdBy: req.user._id
        });

        return res.status(201).json({
            status_code: 201,
            message: "Appointment created successfully",
            data: appointment
        });

    } catch (error) {
        console.error("Create appointment error:", error);

        return res.status(500).json({
            status_code: 500,
            message: "Internal Server Error",
            data: null
        });
    }
};

module.exports = setAppointmentController;
