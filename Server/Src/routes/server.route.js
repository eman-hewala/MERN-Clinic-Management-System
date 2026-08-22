const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.route');
const userRoutes = require('./user.route');
const patientRoutes = require('./patient.route');

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/patient', patientRoutes);

module.exports = router;