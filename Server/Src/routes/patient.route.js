const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth.middleware');
const checkRole = require('../middleware/checkRole.middleware');

const addPatient = require('../controllers/patient/addPatient.controller');
const getPatients = require('../controllers/patient/getAllPatients.controller');
const getPatientById = require('../controllers/patient/getPatientById.controller')

router.use(auth);

router.post('/', checkRole('receptionist'), addPatient);
router.get('/', checkRole('admin','receptionist'), getPatients);
router.get('/:id', checkRole('receptionist', 'doctor'), getPatientById);

module.exports = router;