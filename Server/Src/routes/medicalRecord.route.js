const express=require("express");
const router=express.Router();

const auth = require("../middleware/auth.middleware");
const checkRole = require("../middleware/checkRole.middleware");

const createMedicalRecordController=require("../controllers/medicalRecord/createMedicalRecord.controller");
const updateMedicalRecordController=require("../controllers/medicalRecord/updateMedicalRecord.controller");
const getPatientMedicalRecordController= require("../controllers/medicalRecord/getPatientMedicalRecord.controller");
const getAllMedicalRecordsController= require("../controllers/medicalRecord/getAllMedicalRecords.controller");


router.use(auth);

router.post("/",checkRole("admin","doctor"),createMedicalRecordController);
router.patch("/:patientId",checkRole("admin","doctor"),updateMedicalRecordController);
router.get("/:patientId",checkRole("admin","doctor","receptionist"),getPatientMedicalRecordController);
router.get("/",checkRole("admin","doctor"),getAllMedicalRecordsController)

module.exports=router;