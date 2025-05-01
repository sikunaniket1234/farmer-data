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

// CORS setup: Allow both localhost and deployed frontend
const allowedOrigins = [
  'http://localhost:3000',
  process.env.CLIENT_URL || 'https://farmer-data-frontend.onrender.com',
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS policy: origin ${origin} not allowed`));
    }
  },
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
}));
// Preflight
app.options('*', cors());
