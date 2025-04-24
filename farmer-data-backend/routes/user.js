const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { User } = require('../models');
const auth = require('../middleware/auth');
const restrictTo = require('../middleware/restrictTo');

router.post('/', auth(['SuperAdmin']), restrictTo(['SuperAdmin']), async (req, res) => {
  console.log('Create user request received:', req.body);
  try {
    const { name, email, password, role, fpoName } = req.body;
    console.log('Validating input...');
    if (!name || !email || !password || !role) {
      console.log('Missing required fields');
      return res.status(400).json({ message: 'All fields are required' });
    }

    console.log('Checking if email exists:', email);
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      console.log('Email already exists');
      return res.status(400).json({ message: 'User already exists' });
    }

    console.log('Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log('Creating user...');
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      fpoName,
    });

    console.log('User created:', user.id);
    res.status(201).json({ message: 'User created', user: { id: user.id, name, email, role, fpoName } });
  } catch (error) {
    console.error('Create user error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;