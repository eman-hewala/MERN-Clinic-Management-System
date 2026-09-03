const express= require("express");
const router= express.Router();

const auth = require("../middleware/auth.middleware");
const checkRole = require("../middleware/checkRole.middleware");

const addInvoiceController=require("../controllers/invoice/creatInvoice.controller");
const addPaymentController=require("../controllers/invoice/addPayment.controller");
const updateInvoicesController=require("../controllers/invoice/updateInvoice.controller");
const getInvoiceController=require("../controllers/invoice/getInvoice.controller");
const getAllInvoicesController=require("../controllers/invoice/getAllInvoices.controller");
const cancellInvoicesController=require("../controllers/invoice/cancellInvoice.controller");

router.use(auth);

router.post("/",checkRole("admin","receptionist"),addInvoiceController);
router.post("/:invoiceId/payments",checkRole("admin","receptionist"),addPaymentController);
router.patch("/:invoiceId",checkRole("admin","receptionist"),updateInvoicesController);
router.get("/:invoiceId",checkRole("admin","receptionist","doctor"),getInvoiceController);
router.get("/",checkRole("admin","receptionist","doctor"),getAllInvoicesController);
router.patch("/:invoiceId/cancell",checkRole("admin","receptionist"),cancellInvoicesController);

module.exports=router;