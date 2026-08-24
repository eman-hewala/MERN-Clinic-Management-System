const express=require("express");
const router=express.Router();

const setAppointmentController = require("../controllers/appointment/setAppointment.controllert");
const updateAppointmentController = require("../controllers/appointment/updateAppointment.controller");
const getAllAppointmentController = require("../controllers/appointment/getAllAppointment.controller");
const getAppointmentController = require("../controllers/appointment/getAppointment.controller");
const cancelAppointmentController = require("../controllers/appointment/cancelAppointment.controller");

router.post("/set-appointment",setAppointmentController);
router.put("update-appointment",updateAppointmentController);
router.get("get-all-appointment",getAllAppointmentController);
router.get("get-appointment",getAppointmentController);
router.patch("cancel-appointment",cancelAppointmentController);

module.exports=router;

