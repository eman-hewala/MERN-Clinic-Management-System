const mongoose = require("mongoose");
const visitModel = require("../../models/visits.models");
const doctorModel = require("../../models/doctor.model");

const MAX_LIMIT = 100;
const MAX_SKIP = 100000;

const parseDateBound = (value, isEndOfDay) => {
    if(typeof value !== "string") {
        return null;
    }

    if(/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        const [year, month, day] = value.split("-").map(Number);

        const date = new Date(
            Date.UTC(year, month - 1, day)
        );

        if (
            date.getUTCFullYear() !== year ||
            date.getUTCMonth() !== month - 1 ||
            date.getUTCDate() !== day
        ) {
            return null;
        }

        if(isEndOfDay) {
            date.setUTCHours(23, 59, 59, 999);
        }

        return date;
    }

    const hasTimezone =
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?(?:Z|[+-]\d{2}:\d{2})$/.test(value);

    if (!hasTimezone) {
        return null;
    }

    const date = new Date(value);

    if(Number.isNaN(date.getTime())) {
        return null;
    }

    return date;
};

const getAllVisitsController = async (req, res) => {
    try {
        const pageValue = req.query.page;
        const limitValue = req.query.limit;

        if(
            (pageValue !== undefined &&
                (typeof pageValue !== "string" ||
                    !/^\d+$/.test(pageValue) ||
                    !Number.isSafeInteger(Number(pageValue)) ||
                    Number(pageValue) < 1)) ||

            (limitValue !== undefined &&
                (typeof limitValue !== "string" ||
                    !/^\d+$/.test(limitValue) ||
                    !Number.isSafeInteger(Number(limitValue)) ||
                    Number(limitValue) < 1 ||
                    Number(limitValue) > MAX_LIMIT))
        ) {
            return res.status(400).json({
                status_code: 400,
                message: "Invalid pagination parameters",
                data: null
            });
        }

        const page = pageValue === undefined
            ? 1
            : Number(pageValue);

        const limit = limitValue === undefined
            ? 10
            : Number(limitValue);

        const skip = (page - 1) * limit;

        if(!Number.isSafeInteger(skip) || skip > MAX_SKIP) {
            return res.status(400).json({
                status_code: 400,
                message: "Requested page is too deep",
                data: null
            });
        }

        const filter = {};

        if(req.user.role === "doctor") {
            const doctorDoc = await doctorModel
                .findOne({ userId: req.user._id })
                .select("_id")
                .lean();

            if(!doctorDoc) {
                return res.status(403).json({
                    status_code: 403,
                    message: "Doctor profile not found",
                    data: null
                });
            }

            filter.doctor = doctorDoc._id;

        } else if(req.user.role === "admin") {
            if (req.query.doctor !== undefined) {
                if(!mongoose.isValidObjectId(req.query.doctor)) {
                    return res.status(400).json({
                        status_code: 400,
                        message: "Invalid doctor ID",
                        data: null
                    });
                }

                filter.doctor = req.query.doctor;
            }

        } else {
            return res.status(403).json({
                status_code: 403,
                message: "You are not authorized to view visits",
                data: null
            });
        }

        if(req.query.status !== undefined) {
            const allowedStatuses = [
                "in_progress",
                "finalized",
                "amended",
                "cancelled"
            ];

            if(
                typeof req.query.status !== "string" ||
                !allowedStatuses.includes(req.query.status)
            ) {
                return res.status(400).json({
                    status_code: 400,
                    message: "Invalid Visit status",
                    data: null
                });
            }

            filter.status = req.query.status;
        }

        if(
            req.query.from !== undefined ||
            req.query.to !== undefined
        ) {
            filter.startedAt = {};

            if(req.query.from !== undefined) {
                const fromDate = parseDateBound(
                    req.query.from,
                    false
                );

                if(!fromDate) {
                    return res.status(400).json({
                        status_code: 400,
                        message: "Invalid from date",
                        data: null
                    });
                }

                filter.startedAt.$gte = fromDate;
            }

            if(req.query.to !== undefined) {
                const toDate = parseDateBound(
                    req.query.to,
                    true
                );

                if(!toDate) {
                    return res.status(400).json({
                        status_code: 400,
                        message: "Invalid to date",
                        data: null
                    });
                }

                filter.startedAt.$lte = toDate;
            }

            if(
                filter.startedAt.$gte &&
                filter.startedAt.$lte &&
                filter.startedAt.$gte > filter.startedAt.$lte
            ) {
                return res.status(400).json({
                    status_code: 400,
                    message:
                        "The from date must be before or equal to the to date",
                    data: null
                });
            }
        }
        const [visits, totalVisits] = await Promise.all([
            visitModel
                .find(filter)
                .select("patient doctor startedAt endedAt status")
                .populate("patient", "name phone")
                .populate({
                    path: "doctor",
                    select: "specialization userId",
                    populate: {
                        path: "userId",
                        select: "name"
                    }
                })
                .sort({ startedAt: 1, _id: 1 })
                .skip(skip)
                .limit(limit)
                .lean(),

            visitModel.countDocuments(filter)
        ]);

        const totalPages = Math.ceil(totalVisits / limit);

        return res.status(200).json({
            status_code: 200,
            message: "Visits retrieved successfully",
            data: visits,
            pagination: {
                currentPage: page,
                limit,
                totalVisits,
                totalPages,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        });

    } catch (error) {
        console.error("Get all visits error:", error);

        return res.status(500).json({
            status_code: 500,
            message: "Failed to retrieve visits",
            data: null
        });
    }
};

module.exports = getAllVisitsController;