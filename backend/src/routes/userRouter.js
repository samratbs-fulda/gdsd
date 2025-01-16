require("dotenv-flow").config();
const jwt = require("jsonwebtoken");
const { UserService } = require("../services");

const express = require("express");
const { parse } = require("dotenv-flow");
const router = express.Router();
const userService = new UserService();

// user endpoints
router.post("/register", async (req, res) => {
  try {
    const newUser = await userService.registerUser(req.body);
    res.status(201).json({
      status: "success",
      message: "User registered successfully",
      data: newUser,
    });
  } catch (error) {
    const message = `Fail to register new user: ${error.message}`;
    res.status(500).json({
      status: "error",
      message: message,
    });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try{
    const user = await userService.logUserIn(email, password);
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
  
    res.status(200).json({ token });
  }catch(error){
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

// admin endpoints
router.get("/", async (req, res) => {
  const users = await userService.getAllUsers();
  res.json({ users });
});

router.get("/review", async (req, res) => {
  try {
    const { status } = req.query;

    const users = await userService.getUsersByStatus(status);
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

router.patch("/status", async (req, res) => {
  try {
    const { userId } = req.body;
    const { status } = req.body;

    const updatedUser = await userService.updateUserStatus(userId, status);
    res.status(200).json({ updatedUser });
  } catch (error) {
    res.status(500).json({status: "error", message: error.message});
  }
});

router.get("/profile/:id", async (req, res) => {
  try {
    const user = await userService.getUserProfile(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch("/profile/:id", async (req, res) => {
  try {
    const updatedUser = await userService.updateUserProfile(req.params.id, req.body);
    res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
  
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const user = await userService.getUserById(id);
  res.json({ user });
});

module.exports = router;
