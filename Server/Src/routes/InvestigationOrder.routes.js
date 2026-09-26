const investigatioOrderModel= require("../models/InvestigationOrder.model");

const express= require("express");
const router= express.Router();

const auth = require("../middleware/auth.middleware");
const checkRole = require("../middleware/checkRole.middleware");

const createOrderController= require("../controllers/investigationOrder/createInvestigationOrder.controller");
const updateOrdersController= require("../controllers/investigationOrder/updateInvestigationOrder.controller");
const getOrderController= require("../controllers/investigationOrder/getInvestigationOrder.controller");
const getAllOrdersController= require("../controllers/investigationOrder/getAllInvestigationOrders.controller");
const cancellOrderController= require("../controllers/investigationOrder/cancelInvestigationOrder.controller");

router.use(auth);

router.post("/",checkRole("Admin","Doctor"),createOrderController);
router.patch("/:orderId",checkRole("Admin","Doctor"),updateOrdersController);
router.get("/:orderId",checkRole("Admin","Receptionist","Doctor"),getOrderController);
router.get("/",checkRole("Admin","Receptionist","Doctor"),getAllOrdersController);
router.patch("/:orderId/cancell",checkRole("Admin","Doctor"),cancellOrderController);

module.exports=router;