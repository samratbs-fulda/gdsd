const express = require('express');
const { UserService } = require('../services');

const router = express.Router();
const userService = new UserService();

// endpoints
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