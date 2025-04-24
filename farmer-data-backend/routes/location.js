'use strict';
const express = require('express');
const router = express.Router();
const { Location } = require('../models');
const auth = require('../middleware/auth'); // Assuming you have authentication middleware

// Fetch all states
router.get('/states', auth(['SuperAdmin']), async (req, res) => {
  try {
    const locations = await Location.findAll({ attributes: ['id', 'state'] });
    console.log('Fetched states:', locations); // Debug
    res.json(locations);
  } catch (error) {
    console.error('Fetch states error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Fetch districts by state
router.get('/districts/:stateId', auth(['SuperAdmin']), async (req, res) => {
  try {
    const location = await Location.findByPk(req.params.stateId);
    if (!location) {
      return res.status(404).json({ message: 'State not found' });
    }
    const districts = location.locationData.districts || [];
    console.log('Fetched districts for stateId', req.params.stateId, ':', districts); // Debug
    res.json(districts.map((district, index) => ({ id: index, name: district.name })));
  } catch (error) {
    console.error('Fetch districts error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Fetch blocks by district
router.get('/blocks/:stateId/:districtIndex', auth(['SuperAdmin']), async (req, res) => {
  try {
    const { stateId, districtIndex } = req.params;
    const location = await Location.findByPk(stateId);
    if (!location || !location.locationData.districts[districtIndex]) {
      return res.status(404).json({ message: 'District not found' });
    }
    const blocks = location.locationData.districts[districtIndex].blocks || [];
    console.log('Fetched blocks for districtIndex', districtIndex, ':', blocks); // Debug
    res.json(blocks.map((block, index) => ({ id: index, name: block.name })));
  } catch (error) {
    console.error('Fetch blocks error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Fetch panchayats by block
router.get('/panchayats/:stateId/:districtIndex/:blockIndex', auth(['SuperAdmin']), async (req, res) => {
  try {
    const { stateId, districtIndex, blockIndex } = req.params;
    const location = await Location.findByPk(stateId);
    if (
      !location ||
      !location.locationData.districts[districtIndex] ||
      !location.locationData.districts[districtIndex].blocks[blockIndex]
    ) {
      return res.status(404).json({ message: 'Block not found' });
    }
    const panchayats = location.locationData.districts[districtIndex].blocks[blockIndex].panchayats || [];
    console.log('Fetched panchayats for blockIndex', blockIndex, ':', panchayats); // Debug
    res.json(panchayats.map((panchayat, index) => ({ id: index, name: panchayat.name })));
  } catch (error) {
    console.error('Fetch panchayats error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Fetch villages by panchayat
router.get('/villages/:stateId/:districtIndex/:blockIndex/:panchayatIndex', auth(['SuperAdmin']), async (req, res) => {
  try {
    const { stateId, districtIndex, blockIndex, panchayatIndex } = req.params;
    const location = await Location.findByPk(stateId);
    if (
      !location ||
      !location.locationData.districts[districtIndex] ||
      !location.locationData.districts[districtIndex].blocks[blockIndex] ||
      !location.locationData.districts[districtIndex].blocks[blockIndex].panchayats[panchayatIndex]
    ) {
      return res.status(404).json({ message: 'Panchayat not found' });
    }
    const villages =
      location.locationData.districts[districtIndex].blocks[blockIndex].panchayats[panchayatIndex].villages || [];
    console.log('Fetched villages for panchayatIndex', panchayatIndex, ':', villages); // Debug
    // Ensure villages are returned as objects with id and name, ignoring coords if present
    const formattedVillages = villages.map((village, index) => ({
      id: index,
      name: typeof village === 'object' ? village.name : village,
    }));
    res.json(formattedVillages);
  } catch (error) {
    console.error('Fetch villages error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Keep the existing root endpoint for fetching all locations
router.get('/', async (req, res) => {
  try {
    const locations = await Location.findAll();
    console.log('Raw locations:', locations); // Debug
    const formattedLocations = locations.map(loc => ({
      state: loc.state,
      districts: loc.locationData.districts ? loc.locationData.districts.map(d => ({
        name: d.name,
        blocks: d.blocks ? d.blocks.map(b => ({
          name: b.name,
          panchayats: b.panchayats ? b.panchayats.map(p => ({
            name: p.name,
            villages: p.villages ? p.villages.map(v => ({
              name: v.name,
              coords: v.coords,
            })) : [],
          })) : [],
        })) : [],
      })) : [],
    }));
    console.log('Formatted locations:', formattedLocations); // Debug
    res.json(formattedLocations);
  } catch (error) {
    console.error('Fetch locations error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;