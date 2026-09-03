const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.route');
const userRoutes = require('./user.route');
const patientRoutes = require('./patient.route');
const doctorRoutes = require('./doctor.route');

const appointmentRoutes=require("./appointment.routes");
const visitsRouts=require("./visit.routes");
const invoiceRoutes=require("./invoice.routes");
const medicalRecordRoutes=require("./medicalRecord.route");
const investigationOrdersRoutes=require("./InvestigationOrder.routes");
const investigationResultsRoutes=require("./investigationResult.routes");

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/patient', patientRoutes);
router.use('/doctor', doctorRoutes);

router.use("/appointment",appointmentRoutes);
router.use("/visits",visitsRouts);
router.use("/invoice",invoiceRoutes);
router.use("/medicalRecord",medicalRecordRoutes);
router.use("/investigationOrders",investigationOrdersRoutes);
router.use("/investigationResults",investigationResultsRoutes);

module.exports = router;
