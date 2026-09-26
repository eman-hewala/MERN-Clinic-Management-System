const express=require("express");
const router= express.Router();

const auth = require("../middleware/auth.middleware");
const checkRole = require("../middleware/checkRole.middleware");

const createVisitController=require("../controllers/visit/createPatientVisit.controller");
const updateVisitController=require("../controllers/visit/updatePatientVisit.controller");
const cancellVisitController=require("../controllers/visit/cancelVisit.controller");
const getVisitController=require("../controllers/visit/getPatientVisit.controller");
const getAllVisitsController=require("../controllers/visit/getAllPatientVisits.controller");

router.use(auth);

router.post("/",checkRole("Admin","Doctor"),createVisitController);
router.patch("/:visitId",checkRole("Admin","Doctor"),updateVisitController);
router.get("/:visitId",checkRole("Admin","Receptionist","Doctor"),getVisitController);
router.get("/",checkRole("Admin","Doctor"),getAllVisitsController);
router.patch("/:visitId/cancel",checkRole("Admin","Doctor"),cancellVisitController);


module.exports=router;