'use strict';
const express = require('express');
const router = express.Router();
const { Location } = require('../models');
const auth = require('../middleware/auth');

router.post('/add', auth(['SuperAdmin']), async (req, res) => {
  try {
    const { state, district, block, panchayat, village } = req.body;

    // Log the incoming request data for debugging
    console.log('Received payload:', { state, district, block, panchayat, village });

    // Validate input
    if (!state || !district || !block || !panchayat || !village) {
      console.log('Validation failed: Missing required fields');
      return res.status(400).json({ message: 'All fields (state, district, block, panchayat, village) are required' });
    }

    // Check if state already exists
    let location = await Location.findOne({ where: { state } });
    console.log('Found location:', location ? location.id : 'Not found');

    if (location) {
      // State exists, append new district, block, panchayat, and village to locationData
      let locationData = location.locationData || { districts: [] };
      let districtObj = locationData.districts.find(d => d.name === district);

      if (!districtObj) {
        districtObj = { name: district, blocks: [] };
        locationData.districts.push(districtObj);
        console.log('Added new district:', district);
      }

      let blockObj = districtObj.blocks.find(b => b.name === block);
      if (!blockObj) {
        blockObj = { name: block, panchayats: [] };
        districtObj.blocks.push(blockObj);
        console.log('Added new block:', block);
      }

      let panchayatObj = blockObj.panchayats.find(p => p.name === panchayat);
      if (!panchayatObj) {
        panchayatObj = { name: panchayat, villages: [] };
        blockObj.panchayats.push(panchayatObj);
        console.log('Added new panchayat:', panchayat);
      }

      if (!panchayatObj.villages.find(v => v.name === village)) {
        panchayatObj.villages.push({ name: village });
        console.log('Added new village:', village);
      }

      // Explicitly mark locationData as changed and reassign
      location.locationData = { ...locationData }; // Create a new object to ensure Sequelize detects the change
      location.changed('locationData', true); // Explicitly mark as changed
      await location.save();
      console.log('Updated location:', location.id);
    } else {
      // State doesn't exist, create new record with full hierarchy
      location = await Location.create({
        state,
        locationData: {
          districts: [{
            name: district,
            blocks: [{
              name: block,
              panchayats: [{
                name: panchayat,
                villages: [{ name: village }]
              }]
            }]
          }]
        },
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log('Created new location:', location.id);
    }

    res.json({ message: 'Location added successfully' });
  } catch (error) {
    console.error('Error adding location:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/import', auth(['SuperAdmin']), async (req, res) => {
  try {
    if (!req.files || !req.files.file) {
      console.log('Validation failed: No file uploaded');
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const excel = require('exceljs');
    const workbook = new excel.Workbook();
    await workbook.xlsx.load(req.files.file.data);
    const worksheet = workbook.getWorksheet(1);
    const errors = [];
    const locationsToUpdate = new Map();

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // Skip header row
      const [state, district, block, panchayat, village] = row.values.slice(1); // Skip row number
      if (!state || !district || !block || !panchayat || !village) {
        errors.push({ row: rowNumber, error: 'Missing required fields' });
        return;
      }

      if (!locationsToUpdate.has(state)) {
        locationsToUpdate.set(state, { state, locationData: { districts: [] } });
      }

      let locationData = locationsToUpdate.get(state).locationData;
      let districtObj = locationData.districts.find(d => d.name === district);
      if (!districtObj) {
        districtObj = { name: district, blocks: [] };
        locationData.districts.push(districtObj);
      }

      let blockObj = districtObj.blocks.find(b => b.name === block);
      if (!blockObj) {
        blockObj = { name: block, panchayats: [] };
        districtObj.blocks.push(blockObj);
      }

      let panchayatObj = blockObj.panchayats.find(p => p.name === panchayat);
      if (!panchayatObj) {
        panchayatObj = { name: panchayat, villages: [] };
        blockObj.panchayats.push(panchayatObj);
      }

      if (!panchayatObj.villages.find(v => v.name === village)) {
        panchayatObj.villages.push({ name: village });
      }
    });

    for (let [state, data] of locationsToUpdate) {
      let location = await Location.findOne({ where: { state } });
      if (location) {
        location.locationData = { ...data.locationData }; // Create a new object
        location.changed('locationData', true); // Explicitly mark as changed
        await location.save();
        console.log('Updated location during import:', location.id);
      } else {
        await Location.create({
          state,
          locationData: data.locationData,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        console.log('Created new location during import:', state);
      }
    }

    res.json({ message: 'Locations imported successfully', errors });
  } catch (error) {
    console.error('Error importing locations:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;