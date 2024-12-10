require('dotenv-flow').config();
const jwt = require('jsonwebtoken');
const { UserService } = require('../services');

const express = require('express');
const router = express.Router();
const userService = new UserService();

// user endpoints
router.post('/register', async (req, res) => {
  const {email, password, firstname, lastname, username} = req.body;
  const role = req.body.role.toUpperCase(); // STUDENT, ADMIN, or -MODERATOR-
  if (!userService.validateEmail(email) && role === 'STUDENT') {
    return res.status(400).json({ message: 'Invalid email address for student!' });
  }
  const user = { email, password, role, firstname, lastname, username };
  const existingUser = await userService.getUserByEmail(user.email);
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists!' });
  }
  const newUser = await userService.createUser(user);
  res.status(201).json({ user: newUser });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await userService.logUserIn(email, password);
  if (!user) {
    return res.status(404).json({ message: 'User not found!' });
  }
  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  res.status(200).json({ message: "Login successful", token: token });
});

// admin endpoints 
router.get('/', async (req, res) => {
  const users = await userService.getAllUsers();
  res.json({ users });
});

router.get('/review', async (req, res) => {
  const { status } = req.query;

  const users = await userService.getUsersByStatus(status);
  res.json({ users });
});

module.exports = router;