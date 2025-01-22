require("dotenv-flow").config();
const GroupService = require("../services/groupService");

const express = require("express");
const { parse } = require("dotenv-flow");
const router = express.Router();
const groupService = new GroupService();

// Group endpoints
// Get all groups of a user
router.get("/", async (req, res) => {
  const { userId } = req.body;
  const groups = await groupService.getGroupsByUserId(userId);
  res.json({ groups });
});

// Get all groups members
router.get("/members", async (req, res) => {
  const { groupId } = req.body;
  const groupMembers = await groupService.getMembersByGroupId(groupId);
  res.json({ groupMembers });
});

// Create a new group
router.post("/create", async (req, res) => {
  const { userId } = req.body;
  try {
    const newGroup = await groupService.createGroup(userId);
    res.status(200).json({ newGroup });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

// Invite student to a group
router.post("/sendInvitation", async (req, res) => {
  const { groupId, userId } = req.body;
  try {
    const groupMember = await groupService.addStudentToGroup(groupId, userId);
    res.status(200).json({ groupMember });
  } catch (error) {
    res.status(500).json({status: "error", message: error.message});
  }
});

// Accept a student's invitation to a group
router.patch("/acceptInvitation", async (req, res) => {
  const { groupId, userId } = req.body;
  try {
    const groupMember = await groupService.acceptGroupInvitation(groupId, userId);
    res.status(200).json({ groupMember });
  } catch (error) {
    res.status(500).json({status: "error", message: error.message});
  }
});

// Deny a student's invitation to a group
router.post("/denyInvitation", async (req, res) => {
  const { groupId, userId } = req.body;
  try {
    const groupMember = await groupService.removeStudentFromGroup(groupId, userId);
    res.status(200).json({ groupMember });
  } catch (error) {
    res.status(500).json({status: "error", message: error.message});
  }
});

// Remove a student from a group
router.delete("/removeStudent", async (req, res) => {
  const { groupId, userId } = req.body;
  try {
    const groupMember = await groupService.removeStudentFromGroup(groupId, userId);
    res.status(200).json({ groupMember });
  } catch (error) {
    res.status(500).json({status: "error", message: error.message});
  }
});


module.exports = router;
