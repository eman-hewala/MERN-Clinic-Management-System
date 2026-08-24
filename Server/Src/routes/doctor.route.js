const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth.middleware');
const checkRole = require('../middleware/checkRole.middleware');

const addDoctor = require('../controllers/doctor/addDoctor.controller');
const updateDoctor = require('../controllers/doctor/updateDoctor.controller');
const getAllDoctors = require('../controllers/doctor/getAllDoctors.controller');
const getDoctorById = require('../controllers/doctor/getDoctorById.controller');

router.use(auth, checkRole('Admin'));

router.post('/', addDoctor);
router.patch('/:id', updateDoctor);
router.get('/', getAllDoctors);
router.get('/:id', getDoctorById);

module.exports = router;