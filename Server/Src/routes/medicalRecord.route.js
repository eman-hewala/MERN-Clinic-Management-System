const express=require("express");
const router=express.Router();

const auth = require("../middleware/auth.middleware");
const checkRole = require("../middleware/checkRole.middleware");

const createMedicalRecordController=require("../controllers/medicalRecord/createMedicalRecord.controller");
const updateMedicalRecordController=require("../controllers/medicalRecord/updateMedicalRecord.controller");
const getPatientMedicalRecordController= require("../controllers/medicalRecord/getPatientMedicalRecord.controller");
const getAllMedicalRecordsController= require("../controllers/medicalRecord/getAllMedicalRecords.controller");


router.use(auth);

router.post("/",checkRole("Admin","Doctor"),createMedicalRecordController);
router.patch("/:patientId",checkRole("Admin","Doctor"),updateMedicalRecordController);
router.get("/:patientId",checkRole("Admin","Doctor","Receptionist"),getPatientMedicalRecordController);
router.get("/",checkRole("Admin","Doctor"),getAllMedicalRecordsController)

module.exports=router;