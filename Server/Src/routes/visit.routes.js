const express=require("express");
const router= express.Router();


const createVisitController=require("../controllers/visit/createPatientVisit.controller");
const updateVisitController=require("../controllers/visit/getPatientVisit.controller");
const cancellVisitController=require("../controllers/visit/cancelIVisit.controller");
const getVisitController=require("../controllers/visit/getPatientVisit.controller");
const getAllVisitsController=require("../controllers/visit/getAllPatientVisits.controller");

router.post("create-visit",createVisitController);
router.put("update-visit",updateVisitController);
router.patch("cancel-visit",cancellVisitController);
router.get("get-visit",getVisitController);
router.get("get-all-visits",getAllVisitsController);


module.exports=router;