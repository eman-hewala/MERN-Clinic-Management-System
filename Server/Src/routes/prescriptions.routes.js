const prescriptionModel= require("../models/prescriptions.model");

const express=require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");
const checkRole = require("../middleware/checkRole.middleware");

const createPrescriptionController = require("../controllers/prescription/createPrescription.controller");
const updatePrescriptionController = require("../controllers/prescription/updatePrescreption.controller");
const  issuePrescriptionController = require("../controllers/prescription/issuePrescription.controller");
const getAllPrescriptionsController = require("../controllers/prescription/getAllPrescriptions.controller");
const getPrescriptionController =require("../controllers/prescription/getPrescription.controller");
const cancelPrescriptionController = require("../controllers/prescription/cancelPrescription.controller");

router.use(auth);

router.post("/",checkRole("doctor"),createPrescriptionController);
router.patch("/:prescriptionId",checkRole("doctor"),updatePrescriptionController);
router.patch("/:prescriptionId/issue",checkRole("doctor"),issuePrescriptionController);
router.get("/",checkRole("admin","receptionist","doctor"),getAllPrescriptionsController);
router.get("/:prescriptionId",checkRole("admin","doctor"),getPrescriptionController);
router.patch("/:prescriptionId/cancel",checkRole("doctor"),cancelPrescriptionController);

module.exports=router;

