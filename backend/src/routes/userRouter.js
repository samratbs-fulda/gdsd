require('dotenv-flow').config();
const jwt = require('jsonwebtoken');
const { UserService } = require('../services');
const { authenticateJWT } = require('../middlewares/jwtAuth');

const express = require('express');
const router = express.Router();
const userService = new UserService();

// auth endpoints
router.get('/auth', authenticateJWT, async (req, res) => {
  res.status(200).json({ message: 'Authenticated', user: req.user });
});

// user endpoints
router.post('/register', async (req, res) => {
  const {email, password, name, lastname, role} = req.body;
  if (!userService.validateEmail(email) && role === 'student') {
    return res.status(400).json({ message: 'Invalid email address for student!' });
  }
  const user = { email, password, role, name, lastname };
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

  res.cookie("token", token, {
    httpOnly: true, 
    sameSite: "none",
    secure: false,
    maxAge: 3600000, 
  });

  res.status(200).json({ message: "Login successful" });
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