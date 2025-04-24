'use strict';
const express = require('express');
const router = express.Router();
const { Farmer, User, Membership } = require('../models');
const auth = require('../middleware/auth');
const Sequelize = require('sequelize');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const ExcelJS = require('exceljs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'Uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// GET /api/form - Fetch farmers (filtered by CEO if applicable)
router.get('/', auth(['SuperAdmin', 'CEO']), async (req, res) => {
  try {
    const where = req.user.role === 'CEO' ? { ceoId: req.user.id } : {};
    const farmers = await Farmer.findAll({
      where: {
        [Sequelize.Op.and]: [
          where,
          { '$membership.id$': null }, // Exclude farmers with a membership
        ],
      },
      include: [
        { model: User, as: 'ceo', attributes: ['name', 'fpoName'] },
        {
          model: Membership,
          as: 'membership',
          required: false, // Left join
        },
      ],
    });
    if (farmers.length === 0) {
      return res.status(200).json([]);
    }
    res.json(farmers.map(farmer => ({
      ...farmer.toJSON(),
      location: farmer.location || { state: '', district: '', block: '', panchayat: '', village: '' },
    })));
  } catch (error) {
    console.error('Fetch farmers error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/form/export - Export filtered farmers to Excel
router.post('/export', auth(['SuperAdmin']), async (req, res) => {
  try {
    console.log('Export request received for /export with filtered farmers count:', req.body.farmers?.length); // Debug log
    const farmers = req.body.farmers || [];

    if (!farmers || farmers.length === 0) {
      return res.status(404).json({ message: 'No farmers found to export' });
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Farmers');

    worksheet.columns = [
      { header: 'CEO Name', key: 'ceoName', width: 15 },
      { header: 'FPO Name', key: 'fpoName', width: 15 },
      { header: 'Farmer Name', key: 'name', width: 15 },
      { header: 'Age', key: 'age', width: 10 },
      { header: 'Sex', key: 'sex', width: 10 },
      { header: 'Father Name', key: 'fatherName', width: 15 },
      { header: 'Contact', key: 'contact', width: 15 },
      { header: 'Aadhar', key: 'aadhar', width: 15 },
      { header: 'Income', key: 'income', width: 15 },
      { header: 'Land Type', key: 'landType', width: 15 },
      { header: 'Crops', key: 'crops', width: 20 },
      { header: 'Location', key: 'location', width: 30 },
      { header: 'Created At', key: 'createdAt', width: 20 },
      { header: 'Last Edited At', key: 'updatedAt', width: 20 },
    ];

    farmers.forEach(farmer => {
      worksheet.addRow({
        ceoName: farmer.ceo?.name || 'N/A',
        fpoName: farmer.ceo?.fpoName || 'N/A',
        name: farmer.name,
        age: farmer.age,
        sex: farmer.sex,
        fatherName: farmer.fatherName,
        contact: farmer.contact,
        aadhar: farmer.aadhar,
        income: farmer.income,
        landType: farmer.landType,
        crops: farmer.crops.join(', '),
        location: `${farmer.location?.state || 'N/A'} > ${farmer.location?.district || 'N/A'} > ${farmer.location?.block || 'N/A'} > ${farmer.location?.panchayat || 'N/A'} > ${farmer.location?.village || 'N/A'}`,
        createdAt: new Date(farmer.createdAt).toLocaleString(),
        updatedAt: new Date(farmer.updatedAt).toLocaleString(),
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=farmers.xlsx');
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Export error:', error); // Debug log
    res.status(500).json({ message: 'Error exporting farmers', error: error.message });
  }
});

// GET /api/form/:id - Fetch a single farmer
router.get('/:id', auth(['SuperAdmin', 'CEO']), async (req, res) => {
  try {
    const farmer = await Farmer.findByPk(req.params.id, {
      include: [{ model: User, as: 'ceo', attributes: ['name', 'fpoName'] }],
    });
    if (!farmer) {
      return res.status(404).json({ message: 'Farmer not found' });
    }
    if (req.user.role === 'CEO' && farmer.ceoId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    res.json({
      ...farmer.toJSON(),
      location: farmer.location || { state: '', district: '', block: '', panchayat: '', village: '' },
    });
  } catch (error) {
    console.error('Fetch farmer error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/form - Create a new farmer
router.post('/', auth(['CEO']), upload.single('farmerPicture'), async (req, res) => {
  try {
    const { crops, state, district, block, panchayat, village, ...otherData } = req.body;
    const farmerPicture = req.file ? `Uploads/${req.file.filename}` : 'Uploads/default.jpg';

    const location = {
      state: state || '',
      district: district || '',
      block: block || '',
      panchayat: panchayat || '',
      village: village || '',
    };

    const farmerData = {
      ...otherData,
      crops: JSON.parse(crops || '[]'),
      ceoId: req.user.id,
      farmerPicture,
      location: Object.keys(location).some(key => location[key]) ? location : { state: '', district: '', block: '', panchayat: '', village: '' },
    };

    const farmer = await Farmer.create(farmerData);
    res.status(201).json(farmer);
  } catch (error) {
    if (req.file) {
      fs.unlinkSync(path.join(__dirname, '..', 'Uploads', req.file.filename));
    }
    console.error('Create farmer error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PATCH /api/form/:id - Update a farmer
router.patch('/:id', auth(['CEO']), upload.single('farmerPicture'), async (req, res) => {
  try {
    const farmer = await Farmer.findByPk(req.params.id);
    if (!farmer) {
      return res.status(404).json({ message: 'Farmer not found' });
    }
    if (farmer.ceoId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    const createdAt = new Date(farmer.createdAt);
    const now = new Date();
    const diffInSeconds = (now - createdAt) / 1000;
    if (diffInSeconds > 3600) {
      return res.status(403).json({ message: 'Edit window expired' });
    }
    const { crops, state, district, block, panchayat, village, ...otherData } = req.body;
    const updateData = {
      ...otherData,
      crops: crops ? JSON.parse(crops) : farmer.crops,
      farmerPicture: req.file ? `Uploads/${req.file.filename}` : farmer.farmerPicture,
      location: {
        state: state || farmer.location?.state || '',
        district: district || farmer.location?.district || '',
        block: block || farmer.location?.block || '',
        panchayat: panchayat || farmer.location?.panchayat || '',
        village: village || farmer.location?.village || '',
      },
    };
    await farmer.update(updateData);
    res.json(farmer);
  } catch (error) {
    if (req.file) {
      fs.unlinkSync(path.join(__dirname, '..', 'Uploads', req.file.filename));
    }
    console.error('Update farmer error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE /api/form/:id - Delete a farmer
router.delete('/:id', auth(['SuperAdmin', 'CEO']), async (req, res) => {
  try {
    const farmer = await Farmer.findByPk(req.params.id);
    if (!farmer) {
      return res.status(404).json({ message: 'Farmer not found' });
    }
    if (req.user.role === 'CEO' && farmer.ceoId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    await farmer.destroy();
    res.json({ message: 'Farmer deleted' });
  } catch (error) {
    console.error('Delete farmer error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;