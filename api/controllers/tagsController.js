const { failAction, successAction } = require("../utils/response");
const { verifyAuthToken } = require("../services/commonService");
const {
  getTagsUser,
  addTagUser,
  updateTagUser,
  deleteTagUser,
  updateTagStatusUser,
} = require("../services/tagService.js");
const { updateTagsUser } = require("../services/tagService.js");
const { deleteTagsUser } = require("../services/tagService.js");

// Function to get tags
exports.getTags = async function (req, res) {
  try {
    const authData = await verifyAuthToken(req.headers?.authorization);
    const data = await getTagsUser(authData.practiceLink, authData.userId);
    res.status(200).json(successAction(data, "Success!"));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};

// Function to add tag
exports.addTag = async function (req, res) {
  const payload = req.body;
  try {
    const authData = await verifyAuthToken(req.headers?.authorization);
    const data = await addTagUser(
      authData.practiceLink,
      authData.userId,
      payload
    );
    res.status(200).json(successAction(data, "Success!"));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};

// Function to update tag
exports.updateTag = async function (req, res) {
  const payload = req.body;
  try {
    const authData = await verifyAuthToken(req.headers?.authorization);
    const data = await updateTagUser(
      authData.practiceLink,
      authData.userId,
      payload
    );
    res.status(200).json(successAction(data, "Success!"));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};

// Function to delete tag
exports.deleteTag = async function (req, res) {
  const payload = req.params;
  try {
    const authData = await verifyAuthToken(req.headers?.authorization);
    const data = await deleteTagUser(
      authData.userId,
      authData.practiceLink,
      payload
    );
    res.status(200).json(successAction(data, "Success!"));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};

// Function to update tag status
exports.updateTagStatus = async function (req, res) {
  const payload = req.body;
  try {
    const authData = await verifyAuthToken(req.headers?.authorization);
    const data = await updateTagStatusUser(
      authData.userId,
      authData.practiceLink,
      payload
    );
    res.status(200).json(successAction(data, "Success!"));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};
