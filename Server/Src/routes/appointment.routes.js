const express=require("express");
const router=express.Router();

const auth = require("../middleware/auth.middleware");
const checkRole = require("../middleware/checkRole.middleware");

const setAppointmentController = require("../controllers/appointment/setAppointment.controller");
const updateAppointmentController = require("../controllers/appointment/updateAppointment.controller");
const getAllAppointmentController = require("../controllers/appointment/getAllAppointment.controller");
const getAppointmentController = require("../controllers/appointment/getAppointment.controller");
const cancelAppointmentController = require("../controllers/appointment/cancelAppointment.controller");

router.use(auth);

router.post("/",checkRole("admin","receptionist"),setAppointmentController);
router.patch("/:appointmentId",checkRole("admin","receptionist"),updateAppointmentController);
router.get("/",checkRole("admin","receptionist"),getAllAppointmentController);
router.get("/:appointmentId",checkRole("admin","receptionist","doctor"),getAppointmentController);
router.patch("/:appointmentId/cancel",checkRole("admin","receptionist"),cancelAppointmentController);

module.exports=router;

