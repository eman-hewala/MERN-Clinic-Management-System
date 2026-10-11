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

router.post("/",checkRole("admin","doctor"),createOrderController);
router.patch("/:orderId",checkRole("admin","doctor"),updateOrdersController);
router.get("/:orderId",checkRole("admin","receptionist","doctor"),getOrderController);
router.get("/",checkRole("admin","receptionist","doctor"),getAllOrdersController);
router.patch("/:orderId/cancell",checkRole("admin","doctor"),cancellOrderController);

module.exports=router;