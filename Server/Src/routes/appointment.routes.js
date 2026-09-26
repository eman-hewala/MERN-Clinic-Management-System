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

router.post("/",checkRole("Admin","Receptionist"),setAppointmentController);
router.patch("/:appointmentId",checkRole("Admin","Receptionist"),updateAppointmentController);
router.get("/",checkRole("Admin","Receptionist"),getAllAppointmentController);
router.get("/:appointmentId",checkRole("Admin","Receptionist","Doctor"),getAppointmentController);
router.patch("/:appointmentId/cancel",checkRole("Admin","Receptionist"),cancelAppointmentController);

module.exports=router;

