const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.route');
const userRoutes = require('./user.route');
const patientRoutes = require('./patient.route');
const doctorRoutes = require('./doctor.route');

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/patient', patientRoutes);
router.use('/doctor', doctorRoutes);

module.exports = router;