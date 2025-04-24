'use strict';
const express = require('express');
const router = express.Router();
const { User } = require('../models');
const auth = require('../middleware/auth');

router.get('/all', auth(['SuperAdmin']), async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name', 'fpoName', 'password', 'role'], // Using existing password field
      where: {
        role: 'CEO',
      },
    });
    if (users.length === 0) {
      return res.status(200).json([]);
    }
    // For demo: Assume password is plaintext or unhash it (replace with actual plaintext logic)
    const usersWithPlaintext = users.map(user => ({
      ...user.toJSON(),
      password: 'demo123', // Replace with actual plaintext retrieval logic
    }));
    res.json(usersWithPlaintext);
  } catch (error) {
    console.error('Fetch users error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;