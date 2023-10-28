const express = require("express");
const router = express.Router();
const {
  getTags,
  addTag,
  updateTag,
  deleteTag,
  updateTagStatus,
} = require("../controllers/tagsController");

router.get("/get-tags", getTags);
router.post("/add-tag", addTag);
router.put("/update-tag", updateTag);
router.delete("/delete-tag/:tagId", deleteTag);
router.patch("/update-tag-status", updateTagStatus);

module.exports = router;
