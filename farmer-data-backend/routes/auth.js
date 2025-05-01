const express = require('express');
const router = express.Router();
const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1h' }
    );
    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'none', // Allow cross-origin requests
      secure: true,     // Requires HTTPS (Render uses HTTPS)
    });
    console.log('Cookie set:', token);
    res.json({
      user: { id: user.id, email: user.email, role: user.role, name: user.name, fpoName: user.fpoName },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Logout
router.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
  });
  res.json({ message: 'Logged out successfully' });
});
// Validate Session
router.get('/validate', async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    const user = await User.findByPk(decoded.id, {
      attributes: ['id', 'email', 'role', 'name', 'fpoName'],
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Validate error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
});

module.exports = router;