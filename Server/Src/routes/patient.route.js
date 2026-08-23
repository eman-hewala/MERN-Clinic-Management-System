const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth.middleware');
const checkRole = require('../middleware/checkRole.middleware');

const addPatient = require('../controllers/patient/addPatient.controller');
const getPatients = require('../controllers/patient/getAllPatients.controller');
const getPatientById = require('../controllers/patient/getPatientById.controller')

router.use(auth);

router.post('/', checkRole('Receptionist'), addPatient);
router.get('/', checkRole('Admin','Receptionist'), getPatients);
router.get('/:id', checkRole('Receptionist', 'Doctor'), getPatientById);

module.exports = router;