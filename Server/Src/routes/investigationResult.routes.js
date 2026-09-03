const express= require("express");
const router= express.Router();

const auth = require("../middleware/auth.middleware");
const checkRole = require("../middleware/checkRole.middleware");

const createResultsController= require("../controllers/investigationResults/createInvestigationResult.controller");
const updateResultsController= require("../controllers/investigationResults/updateInvestigationResult.controller");
const getResultController= require("../controllers/investigationResults/getInvestigationResult.controller");
const getAllResultsController= require("../controllers/investigationResults/getAllInvestigationResults.controller");

router.use(auth);

router.post("/",checkRole("admin","doctor"),createResultsController);
router.patch("/:resultId",checkRole("admin","doctor"),updateResultsController);
router.get("/:resultId",checkRole("admin","receptionist","doctor"),getResultController);
router.get("/",checkRole("admin","receptionist","doctor"),getAllResultsController);

module.exports=router;