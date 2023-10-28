const { failAction, successAction } = require("../utils/response");
const {
  getAppointmentPatients,
  updateAppointmentDetailsPatient,
} = require("../services/appointmentServices");
const { verifyAuthToken } = require("../services/commonService");

// Function to get appointments
exports.getAppointments = async function (req, res) {
  const payload = req.params;
  try {
    const authData = await verifyAuthToken(req.headers?.authorization);
    const data = await getAppointmentPatients(
      authData.userId,
      authData.practiceLink,
      payload
    );
    res.status(200).json(successAction(data, "Success!"));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};

// Function to update appointment
exports.updateAppointmentDetails = async function (req, res) {
  const payload = req.body;
  try {
    const authData = await verifyAuthToken(req.headers?.authorization);
    const data = await updateAppointmentDetailsPatient(
      authData.userId,
      authData.practiceLink,
      payload
    );
    res.status(200).json(successAction(data, "Success!"));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};
