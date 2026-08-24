const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.route');
const userRoutes = require('./user.route');
const patientRoutes = require('./patient.route');
const doctorRoutes = require('./doctor.route');

const appointmentRoutes=require("./appointment.routes")

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/patient', patientRoutes);
router.use('/doctor', doctorRoutes);

router.use("/appointment",appointmentRoutes);

module.exports = router;