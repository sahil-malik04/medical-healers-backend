const express = require("express");
const router = express.Router();

const {
  getAppointments,
  updateAppointmentDetails,
} = require("../controllers/appointmentController");

router.get("/get-appointments/:patientId", getAppointments);
router.put("/update-appointment-details", updateAppointmentDetails);

module.exports = router;
