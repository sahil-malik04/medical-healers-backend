const { failAction, successAction } = require("../utils/response");
const {
  getPatientUser,
  getPatientByIdUser,
  createPatientUser,
  updatePatientUser,
  deletePatientUser,
  updatePatientStatusUser,
  uploadPatientImageUser,
  getRecentPatientsUser,
  createMedicalHistoryUser,
  deleteMedicalHistoryUser,
  getGenderUser,
  getGenderIdentityUser,
  getInsuranceLevelUser,
  getInsuranceFundUser,
  getIndigenousStatusUser,
  getPersonalPronounsUser,
  updatePatientThresholdsUser,
  deletePatientImageUser,
} = require("../services/patientServices");
const { verifyAuthToken } = require("../services/commonService");

// Function to get patients
exports.getPatient = async function (req, res) {
  try {
    const authData = await verifyAuthToken(req.headers?.authorization);
    const data = await getPatientUser(authData.userId, authData.practiceLink);
    res.status(200).json(successAction(data, "Success!"));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};

// Function to get patient by Id
exports.getPatientById = async function (req, res) {
  const payload = req.params;
  try {
    const authData = await verifyAuthToken(req.headers?.authorization);
    const data = await getPatientByIdUser(
      authData.userId,
      authData.practiceLink,
      payload
    );
    res.status(200).json(successAction(data, "Success!"));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};

// Function to create patient
exports.createPatient = async function (req, res) {
  const payload = req.body;
  try {
    const authData = await verifyAuthToken(req.headers?.authorization);
    const data = await createPatientUser(
      authData.userId,
      authData.practiceLink,
      payload
    );
    res.status(200).json(successAction(data, "Success!"));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};

// Function to update patient
exports.updatePatient = async function (req, res) {
  const payload = req.body;
  try {
    const authData = await verifyAuthToken(req.headers?.authorization);
    const data = await updatePatientUser(
      authData.userId,
      authData.practiceLink,
      payload
    );
    res.status(200).json(successAction(data, "Success!"));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};

// Function to delete patient
exports.deletePatient = async function (req, res) {
  const payload = req.params;
  try {
    const authData = await verifyAuthToken(req.headers?.authorization);
    const data = await deletePatientUser(
      authData.userId,
      authData.practiceLink,
      payload
    );
    res.status(200).json(successAction(data, "Success!"));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};

// Function to update patient status
exports.updatePatientStatus = async function (req, res) {
  const payload = req.body;
  try {
    const authData = await verifyAuthToken(req.headers?.authorization);
    const data = await updatePatientStatusUser(
      authData.userId,
      authData.practiceLink,
      payload
    );
    res.status(200).json(successAction(data, "Success!"));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};

// Function to upload patient image
exports.uploadPatientImage = async function (req, res) {
  const patientId = req.params.patientId;
  const file = req.file;
  try {
    const authData = await verifyAuthToken(req.headers?.authorization);
    const data = await uploadPatientImageUser(
      authData.userId,
      authData.practiceLink,
      patientId,
      file
    );
    res.status(200).json(successAction(data, "Success!"));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};

// Function to get recent patients
exports.getRecentPatients = async function (req, res) {
  try {
    const authData = await verifyAuthToken(req.headers?.authorization);
    const data = await getRecentPatientsUser(
      authData.userId,
      authData.practiceLink
    );
    res.status(200).json(successAction(data, "Success!"));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};

// Function to update medical history
exports.createMedicalHistory = async function (req, res) {
  const payload = req.body;
  try {
    const authData = await verifyAuthToken(req.headers?.authorization);
    const data = await createMedicalHistoryUser(
      authData.userId,
      authData.practiceLink,
      payload
    );
    res.status(200).json(successAction(data, "Success!"));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};

// Function to delete medical history
exports.deleteMedicalHistory = async function (req, res) {
  const payload = req.body;
  try {
    const authData = await verifyAuthToken(req.headers?.authorization);
    const data = await deleteMedicalHistoryUser(
      authData.userId,
      authData.practiceLink,
      payload
    );
    res.status(200).json(successAction(data, "Success!"));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};

// Function to get gender
exports.getGender = async function (req, res) {
  try {
    const authData = await verifyAuthToken(req.headers?.authorization);
    const data = await getGenderUser(authData.userId);
    res.status(200).json(successAction(data, "Success!"));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};

// Function to get gender identity
exports.getGenderIdentity = async function (req, res) {
  try {
    const authData = await verifyAuthToken(req.headers?.authorization);
    const data = await getGenderIdentityUser(authData.userId);
    res.status(200).json(successAction(data, "Success!"));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};

// Function to get insurance level
exports.getInsuranceLevel = async function (req, res) {
  try {
    const authData = await verifyAuthToken(req.headers?.authorization);
    const data = await getInsuranceLevelUser(authData.userId);
    res.status(200).json(successAction(data, "Success!"));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};

// Function to get insurance fund
exports.getInsuranceFund = async function (req, res) {
  try {
    const authData = await verifyAuthToken(req.headers?.authorization);
    const data = await getInsuranceFundUser(authData.userId);
    res.status(200).json(successAction(data, "Success!"));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};

// Function to get indigenous status
exports.getIndigenousStatus = async function (req, res) {
  try {
    const authData = await verifyAuthToken(req.headers?.authorization);
    const data = await getIndigenousStatusUser(authData.userId);
    res.status(200).json(successAction(data, "Success!"));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};

// Function to get personal pronouns
exports.getPersonalPronouns = async function (req, res) {
  try {
    const authData = await verifyAuthToken(req.headers?.authorization);
    const data = await getPersonalPronounsUser(authData.userId);
    res.status(200).json(successAction(data, "Success!"));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};

// Function to update vital thresholds
exports.updatePatientThresholds = async function (req, res) {
  const payload = req.body;
  try {
    const authData = await verifyAuthToken(req.headers?.authorization);
    const data = await updatePatientThresholdsUser(
      authData.userId,
      authData.practiceLink,
      payload
    );
    res.status(200).json(successAction(data, "Success!"));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};

// Function to delete patient image
exports.deletePatientImage = async function (req, res) {
  const payload = req.params;
  try {
    const authData = await verifyAuthToken(req.headers?.authorization);
    const data = await deletePatientImageUser(
      authData.userId,
      authData.practiceLink,
      payload
    );
    res.status(200).json(successAction(data, "Success!"));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};
