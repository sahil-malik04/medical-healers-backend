const express = require("express");
const {
  createDatabaseSchemaTables,
  updateDatabaseSchemaTables,
} = require("../controllers/databaseController");
const router = express.Router();
const auth = require("./authRoute");
const setting = require("./settingRoute");
const schedule = require("./scheduleRoutes");
const patient = require("./patientRoutes");
const appointement = require("./appointmentRoutes");
const tags = require("./tagsRoute");

// DATABASE SCHEMA ROUTES
router.get("/create-database-schema-tables", createDatabaseSchemaTables);
router.get("/update-database-schema-tables", updateDatabaseSchemaTables);

// API ROUTES
router.use("/auth", auth);
router.use("/setting", setting);
router.use("/schedule", schedule);
router.use("/patient", patient);
router.use("/appointment", appointement);
router.use("/tags", tags);

module.exports = router;
