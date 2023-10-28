const express = require("express");
const router = express.Router();
const {
  getPracticeDetail,
  updatePractice,
  addPracticeStaff,
  getPracticeStaff,
  updatePracticeStaff,
  deletePracticeStaff,
  verifyStaff,
  setPasswordStaff,
  updatePracticeStaffStatus,
  changePasswordUser,
  getPracticeStaffScheduler,
  getTimeout,
  updateTimeout,
  resendEmail,
  uploadUserImage,
  getUserImage,
  deleteImageUser,
} = require("../controllers/settingController");
const imageUplaod = require("../helpers/upload");

router.get("/detail/:userId", getPracticeDetail);
router.post("/update", updatePractice);
router.get("/get-practice-staff", getPracticeStaff);
router.get("/get-practice-staff-scheduler", getPracticeStaffScheduler);
router.post("/add-practice-staff", addPracticeStaff);
router.post("/update-practice-staff", updatePracticeStaff);
router.patch("/update-practice-status", updatePracticeStaffStatus);
router.delete("/delete-practice-staff/:staffId", deletePracticeStaff);
router.get("/verify-staff/:token/:id", verifyStaff);
router.post("/set-password-staff", setPasswordStaff);
router.put("/change-password-user", changePasswordUser);
router.get("/get-timeout", getTimeout);
router.post("/update-timeout", updateTimeout);
router.post("/resend-email/:staffId", resendEmail);
router.post("/resend-email/:staffId", resendEmail);
router.put("/upload-image-tenant", imageUplaod("tenants"), uploadUserImage);
router.put("/upload-image-staff", imageUplaod("staff"), uploadUserImage);
router.get("/get-image-user/:userType", getUserImage);
router.delete("/delete-image-user/:userType", deleteImageUser);

module.exports = router;
