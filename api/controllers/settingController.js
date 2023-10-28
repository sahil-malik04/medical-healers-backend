const { failAction, successAction } = require("../utils/response");
const {
  getPracticeUserDetail,
  updatePracticeUser,
  addPracticeStaffUser,
  getPracticeStaffUser,
  updatePracticeStaffUser,
  deletePracticeStaffUser,
  verifyStaffUser,
  setPasswordStaffUser,
  updatePracticeStaffStatusUser,
  changePasswordLoginUser,
  getPracticeStaffSchedulerUser,
  getTimeoutUser,
  updateTimeoutUser,
  resendEmailUser,
  uploadImageLoginUser,
  getImageLoginUser,
  deleteImageLoginUser,
} = require("../services/settingService");
const { verifyAuthToken } = require("../services/commonService");

// Function to get Practice Details
exports.getPracticeDetail = async function (req, res) {
  const payload = req.params;
  try {
    await verifyAuthToken(req.headers?.authorization);
    const data = await getPracticeUserDetail(payload.userId);
    res.status(200).json(successAction(data, "Success!"));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};

// Function to update Practice Details
exports.updatePractice = async function (req, res) {
  const payload = req.body;
  try {
    const authData = await verifyAuthToken(req.headers?.authorization);
    const data = await updatePracticeUser(authData.userId, payload);
    res.status(200).json(successAction(data, "Success!"));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};

// Function to get Practice Staff
exports.getPracticeStaff = async function (req, res) {
  try {
    const authData = await verifyAuthToken(req.headers?.authorization);
    const data = await getPracticeStaffUser(
      authData.userId,
      authData.practiceLink
    );
    res.status(200).json(successAction(data, "Success!"));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};

// Function to get Practice Staff Scheduler
exports.getPracticeStaffScheduler = async function (req, res) {
  try {
    const authData = await verifyAuthToken(req.headers?.authorization);
    const data = await getPracticeStaffSchedulerUser(
      authData.userId,
      authData.practiceLink
    );
    res.status(200).json(successAction(data, "Success!"));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};

// Function to Add Practice Staff
exports.addPracticeStaff = async function (req, res) {
  const payload = req.body;
  try {
    const authData = await verifyAuthToken(req.headers?.authorization);
    const data = await addPracticeStaffUser(
      authData.userId,
      authData.practiceLink,
      payload
    );
    res.status(200).json(successAction(data, "Success!"));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};

// Function to Update Practice Staff
exports.updatePracticeStaff = async function (req, res) {
  const payload = req.body;
  try {
    const authData = await verifyAuthToken(req.headers?.authorization);
    const data = await updatePracticeStaffUser(
      authData.userId,
      authData.practiceLink,
      payload
    );
    res.status(200).json(successAction(data, "Success!"));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};

// Function to Delete Practice Staff
exports.deletePracticeStaff = async function (req, res) {
  const payload = req.params;
  try {
    const authData = await verifyAuthToken(req.headers?.authorization);
    const data = await deletePracticeStaffUser(
      authData.userId,
      authData.practiceLink,
      payload
    );
    res.status(200).json(successAction(data, "Success!"));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};

// Function to Verify Staff
exports.verifyStaff = async function (req, res) {
  const payload = req.params;
  const origin = req.headers.origin;
  try {
    const result = await verifyStaffUser(payload, origin);
    res.status(200).json(successAction(result, "Success!"));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};

// Function to set Password Staff
exports.setPasswordStaff = async function (req, res) {
  const payload = req.body;
  const origin = req.headers.origin;
  try {
    const result = await setPasswordStaffUser(payload, origin);
    res.status(200).json(successAction(result, "Success!"));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};

// Function to update practitioner status
exports.updatePracticeStaffStatus = async function (req, res) {
  const payload = req.body;
  try {
    const authData = await verifyAuthToken(req.headers?.authorization);
    const data = await updatePracticeStaffStatusUser(
      authData.userId,
      authData.practiceLink,
      payload
    );
    res.status(200).json(successAction(data, "Success!"));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};

// Function to change tenant password
exports.changePasswordUser = async function (req, res) {
  const payload = req.body;
  try {
    const authData = await verifyAuthToken(req.headers?.authorization);
    const data = await changePasswordLoginUser(
      authData.userId,
      authData.practiceLink,
      payload
    );
    res.status(200).json(successAction(data, "Success!"));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};

// Function to get tenant timeout
exports.getTimeout = async function (req, res) {
  const type = req.query.type;
  const access = req.query.access;
  try {
    const authData = await verifyAuthToken(req.headers?.authorization);
    const data = await getTimeoutUser(authData, type, access);
    res.status(200).json(successAction(data, "Success!"));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};

// Function to update staff timeout
exports.updateTimeout = async function (req, res) {
  const payload = req.body;
  try {
    const authData = await verifyAuthToken(req.headers?.authorization);
    const data = await updateTimeoutUser(authData, payload);
    res.status(200).json(successAction(data, "Success!"));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};

// Function to resend email
exports.resendEmail = async function (req, res) {
  const payload = req.params;
  try {
    const authData = await verifyAuthToken(req.headers?.authorization);
    const data = await resendEmailUser(
      authData.userId,
      authData.practiceLink,
      payload
    );
    res.status(200).json(successAction(data, "Success!"));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};

// Function to upload login user image
exports.uploadUserImage = async function (req, res) {
  const file = req.file;
  const userType = req.body.userType;

  try {
    const authData = await verifyAuthToken(req.headers?.authorization);
    const data = await uploadImageLoginUser(
      authData.userId,
      authData.practiceLink,
      authData.loginUserId,
      file,
      userType
    );
    res.status(200).json(successAction(data, "Success!"));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};

// Function to get user image
exports.getUserImage = async function (req, res) {
  const payload = req.params;

  try {
    const authData = await verifyAuthToken(req.headers?.authorization);
    const data = await getImageLoginUser(
      authData.practiceLink,
      authData.loginUserId,
      payload.userType
    );
    res.status(200).json(successAction(data, "Success!"));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};

// Function to delete user image
exports.deleteImageUser = async function (req, res) {
  const payload = req.params;

  try {
    const authData = await verifyAuthToken(req.headers?.authorization);
    const data = await deleteImageLoginUser(
      authData.practiceLink,
      authData.loginUserId,
      payload.userType
    );
    res.status(200).json(successAction(data, "Success!"));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};
