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

router.post("/",checkRole("admin","doctor"),createVisitController);
router.patch("/:visitId",checkRole("admin","doctor"),updateVisitController);
router.get("/:visitId",checkRole("admin","receptionist","doctor"),getVisitController);
router.get("/",checkRole("admin","doctor"),getAllVisitsController);
router.patch("/:visitId/cancel",checkRole("admin","doctor"),cancellVisitController);


module.exports=router;