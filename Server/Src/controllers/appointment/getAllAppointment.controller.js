const mongoose = require("mongoose");
const appointmentModel = require("../../models/Appointement.model");

const getAllAppointmentController = async (req, res) => {
    try {
        // =========================
        // Pagination
        // =========================

        const page = Math.max(
            1,
            Number.parseInt(req.query.page, 10) || 1
        );

        const parsedLimit = Number.parseInt(req.query.limit, 10);

        const limit = Math.min(
            100,
            Math.max(1, parsedLimit || 10)
        );

        // Validate pagination parameters
        if (
            (req.query.page !== undefined &&
                (!/^\d+$/.test(req.query.page) ||
                    Number(req.query.page) < 1)) ||

            (req.query.limit !== undefined &&
                (!/^\d+$/.test(req.query.limit) ||
                    Number(req.query.limit) < 1 ||
                    Number(req.query.limit) > 100))
        ) {
            return res.status(400).json({
                status_code: 400,
                message: "Invalid pagination parameters",
                data: null
            });
        }

        const skip = (page - 1) * limit;


        // =========================
        // Filters
        // =========================

        const filter = {};


        // =========================
        // Filter by Doctor
        // =========================

        if (req.query.doctor !== undefined) {

            if (!mongoose.isValidObjectId(req.query.doctor)) {
                return res.status(400).json({
                    status_code: 400,
                    message: "Invalid doctor ID",
                    data: null
                });
            }

            filter.doctor = req.query.doctor;
        }


        // =========================
        // Filter by Status
        // =========================

        if (req.query.status !== undefined) {

            const allowedStatuses = [
                "pending",
                "confirmed",
                "checked_in",
                "cancelled",
                "no_show"
            ];

            if (!allowedStatuses.includes(req.query.status)) {
                return res.status(400).json({
                    status_code: 400,
                    message: "Invalid appointment status",
                    data: null
                });
            }

            filter.status = req.query.status;
        }


        // =========================
        // Filter by Date / Time Range
        // =========================

        if (
            req.query.from !== undefined ||
            req.query.to !== undefined
        ) {
            filter.startAt = {};

            // From
            if (req.query.from !== undefined) {

                const fromValue = req.query.from;

                // If only date is provided: YYYY-MM-DD
                const fromDateOnly =
                    /^\d{4}-\d{2}-\d{2}$/.test(fromValue);

                const fromDate = fromDateOnly
                    ? new Date(`${fromValue}T00:00:00.000`)
                    : new Date(fromValue);

                if (Number.isNaN(fromDate.getTime())) {
                    return res.status(400).json({
                        status_code: 400,
                        message: "Invalid from date",
                        data: null
                    });
                }

                filter.startAt.$gte = fromDate;
            }


            // To
            if (req.query.to !== undefined) {

                const toValue = req.query.to;

                // If only date is provided:
                // include the whole day
                const toDateOnly =
                    /^\d{4}-\d{2}-\d{2}$/.test(toValue);

                const toDate = toDateOnly
                    ? new Date(`${toValue}T23:59:59.999`)
                    : new Date(toValue);

                if (Number.isNaN(toDate.getTime())) {
                    return res.status(400).json({
                        status_code: 400,
                        message: "Invalid to date",
                        data: null
                    });
                }

                filter.startAt.$lte = toDate;
            }


            // Make sure from <= to
            if (
                filter.startAt.$gte &&
                filter.startAt.$lte &&
                filter.startAt.$gte > filter.startAt.$lte
            ) {
                return res.status(400).json({
                    status_code: 400,
                    message:
                        "The from date must be before or equal to the to date",
                    data: null
                });
            }
        }


        // =========================
        // Query
        // =========================

        const [appointments, totalAppointments] =
            await Promise.all([

                appointmentModel
                    .find(filter)
                    .select(
                        "patient doctor startAt endAt status"
                    )
                    .populate(
                        "patient",
                        "name phone"
                    )
                    .populate({
                        path: "doctor",
                        select: "specialization userId",
                        populate: {
                            path: "userId",
                            select: "name"
                        }
                    })
                    .sort({
                        startAt: 1,
                        _id: 1
                    })
                    .skip(skip)
                    .limit(limit)
                    .lean(),

                appointmentModel.countDocuments(filter)

            ]);


        // =========================
        // Pagination Metadata
        // =========================

        const totalPages = Math.ceil(
            totalAppointments / limit
        );


        return res.status(200).json({
            status_code: 200,
            message: "Appointments retrieved successfully",
            data: appointments,

            pagination: {
                currentPage: page,
                limit,
                totalAppointments,
                totalPages,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        });

    } catch (error) {

        console.error(
            "Get all appointments error:",
            error
        );

        return res.status(500).json({
            status_code: 500,
            message: "Failed to retrieve appointments",
            data: null
        });
    }
};

module.exports = getAllAppointmentController;