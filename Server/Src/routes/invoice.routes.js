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

router.post("/",checkRole("Admin","Receptionist"),addInvoiceController);
router.post("/:invoiceId/payments",checkRole("Admin","Receptionist"),addPaymentController);
router.patch("/:invoiceId",checkRole("Admin","Receptionist"),updateInvoicesController);
router.get("/:invoiceId",checkRole("Admin","Receptionist","Doctor"),getInvoiceController);
router.get("/",checkRole("Admin","Receptionist","Doctor"),getAllInvoicesController);
router.patch("/:invoiceId/cancell",checkRole("Admin","Receptionist"),cancellInvoicesController);

module.exports=router;