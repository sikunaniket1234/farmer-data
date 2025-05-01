'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
const db = {};

// Check if config.url is valid
if (!config || !config.url) {
  throw new Error('Database URL is not configured. Check DATABASE_URL environment variable.');
}

// Initialize Sequelize using the url from config.js
const sequelize = new Sequelize(config.url, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  logging: console.log, // Optional: for debugging SQL queries
});

sequelize
  .authenticate()
  .then(() => {
    console.log('PostgreSQL connected');
  })
  .catch(err => {
    console.error('PostgreSQL connection error:', err);
  });

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// Define associations
db.Farmer.belongsTo(db.User, { foreignKey: 'ceoId', as: 'ceo' });
db.User.hasMany(db.Farmer, { foreignKey: 'ceoId', as: 'farmers' });

db.Membership.belongsTo(db.User, { foreignKey: 'ceoId', as: 'ceo' });
db.User.hasMany(db.Membership, { foreignKey: 'ceoId', as: 'memberships' });

db.Membership.belongsTo(db.Farmer, { foreignKey: 'farmerId', as: 'farmer' });
db.Farmer.hasOne(db.Membership, { foreignKey: 'farmerId', as: 'membership' });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;