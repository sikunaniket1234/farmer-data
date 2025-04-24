const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

console.log('Starting server...');

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
  fs.mkdirSync(UploadsDir);
}

console.log('Uploads directory setup');

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
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

app.listen(5000, () => {
  console.log('Server running on port 5000');
});