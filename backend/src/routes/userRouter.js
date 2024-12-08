const express = require('express');
const { UserService } = require('../services');

const router = express.Router();
const userService = new UserService();

// user endpoints
router.post('/register', async (req, res) => {
  const {email, password, role} = req.body;
  if (!userService.validateEmail(email) && role === 'student') {
    return res.status(400).json({ message: 'Invalid email address for student!' });
  }
  const name = req.body.name || 'User';
  const lastname = req.body.last_name || 'User';
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
  res.status(200).json({ user: user });
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