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

// CORS setup: Allow both localhost and the Render frontend
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g., mobile apps or curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
// Handle preflight (OPTIONS) requests
app.options('*', cors(corsOptions));

app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

console.log('Middleware configured');

app.use('/api/auth', authRoutes);
app.use('/api/form', formRoutes);
app.use('/api/user', userRoutes);
app.use('/api/membership', membershipRoutes);
app.use('/api/location', locationRoutes);
app.use('/api/usercred', usercredRouter);
app.use('/api/locationinsert', locationInsertRoutes);

console.log('Routes mounted');

// Use the port provided by Render or fallback to 5000 for local development
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
