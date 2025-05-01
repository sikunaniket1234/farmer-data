'use strict';

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

console.log('Starting server...');

// Load your front-end origin from env (fallback to localhost)
const FRONTEND_URL = process.env.CLIENT_URL || 'http://localhost:3000';
const allowedOrigins = [FRONTEND_URL, 'http://localhost:3000'];

const authRoutes = require('./routes/auth');
const formRoutes = require('./routes/form');
const userRoutes = require('./routes/user');
const membershipRoutes = require('./routes/membership');
const locationRoutes = require('./routes/location');
const usercredRouter = require('./routes/usercred');
const locationInsertRoutes = require('./routes/locationinsert');

console.log('Routes imported');

const app = express();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
console.log('Uploads directory setup');

// CORS middleware
app.use(cors({
  origin(origin, callback) {
    // allow REST tools (no origin) or our whitelisted origins
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS policy: Origin ${origin} not allowed`));
  },
  credentials: true,
}));

// For preflight requests
app.options('*', cors());

// Standard middleware
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(uploadsDir));

console.log('Middleware configured');

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/form', formRoutes);
app.use('/api/user', userRoutes);
app.use('/api/membership', membershipRoutes);
app.use('/api/location', locationRoutes);
app.use('/api/usercred', usercredRouter);
app.use('/api/locationinsert', locationInsertRoutes);

console.log('Routes mounted');

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
