const express = require('express');
const router = express.Router();
const addPatient = require('../controllers/patient/addPatient.controller');
const getPatients = require('../controllers/patient/getAllPatients.controller');
const getPatientById = require('../controllers/patient/getPatientById.controller')

router.post('/', addPatient);
router.get('/', getPatients);
router.get('/:id', getPatientById);

module.exports = router;