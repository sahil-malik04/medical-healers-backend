const express = require("express");
const router = express.Router();
const imageUplaod = require("../helpers/upload");

const {
  getPatient,
  getPatientById,
  updatePatient,
  deletePatient,
  createPatient,
  updatePatientStatus,
  uploadPatientImage,
  getRecentPatients,
  createMedicalHistory,
  deleteMedicalHistory,
  getGender,
  getGenderIdentity,
  getInsuranceLevel,
  getInsuranceFund,
  getIndigenousStatus,
  getPersonalPronouns,
  updatePatientThresholds,
  deletePatientImage,
} = require("../controllers/patientController");

router.get("/get-patient", getPatient);
router.get("/get-patient-by-id/:patientId", getPatientById);
router.post("/create-patient", createPatient);
router.put("/update-patient", updatePatient);
router.delete("/delete-patient/:patientId", deletePatient);
router.patch("/update-patient-status", updatePatientStatus);

router.post(
  "/upload-patient-image/:patientId",
  imageUplaod("patients"),
  uploadPatientImage
);
router.get("/get-recent-patients", getRecentPatients);
router.patch("/update-medical-history", createMedicalHistory);
router.delete("/delete-medical-history", deleteMedicalHistory);
router.get("/get-gender", getGender);
router.get("/get-gender-identity", getGenderIdentity);
router.get("/get-indigenous-status", getIndigenousStatus);
router.get("/get-personal-pronouns", getPersonalPronouns);
router.get("/get-insurance-level", getInsuranceLevel);
router.get("/get-insurance-fund", getInsuranceFund);
router.patch("/update-patient-thresholds", updatePatientThresholds);
router.delete("/delete-patient-image/:patientId", deletePatientImage);

module.exports = router;
