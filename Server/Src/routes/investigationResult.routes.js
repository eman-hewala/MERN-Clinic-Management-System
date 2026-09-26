const express= require("express");
const router= express.Router();

const auth = require("../middleware/auth.middleware");
const checkRole = require("../middleware/checkRole.middleware");

const createResultsController= require("../controllers/investigationResults/createInvestigationResult.controller");
const updateResultsController= require("../controllers/investigationResults/updateInvestigationResult.controller");
const getResultController= require("../controllers/investigationResults/getInvestigationResult.controller");
const getAllResultsController= require("../controllers/investigationResults/getAllInvestigationResults.controller");

router.use(auth);

router.post("/",checkRole("Admin","Doctor"),createResultsController);
router.patch("/:resultId",checkRole("Admin","Doctor"),updateResultsController);
router.get("/:resultId",checkRole("Admin","Receptionist","Doctor"),getResultController);
router.get("/",checkRole("Admin","Receptionist","Doctor"),getAllResultsController);

module.exports=router;