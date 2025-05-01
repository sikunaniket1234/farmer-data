'use strict';
const express = require('express');
const router = express.Router();
const { Membership, User, Farmer } = require('../models');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const ExcelJS = require('exceljs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// GET /api/membership - Fetch memberships based on user role
router.get('/', auth(['SuperAdmin', 'CEO']), async (req, res) => {
  try {
    const where = req.user.role === 'CEO' ? { ceoId: req.user.id } : {};
    const memberships = await Membership.findAll({
      where,
      include: [
        { model: User, as: 'ceo', attributes: ['name', 'fpoName'] },
        { model: Farmer, as: 'farmer', attributes: ['name', 'contact', 'location'] }, // Added 'contact'
      ],
    });
    console.log('Fetched memberships with associations:', JSON.stringify(memberships, null, 2)); // Detailed debug log

    if (memberships.length === 0) {
      return res.status(200).json([]);
    }

    // Customize response based on role
    const response = req.user.role === 'CEO'
      ? memberships.map(membership => ({
          id: membership.id,
          name: membership.farmer.name || 'Unknown',
          contact: membership.farmer.contact || 'N/A', // Ensure contact is included
          membershipType: 'Standard', // Hardcoded for now
          membershipFee: membership.membershipFee || 'N/A', // Include membershipFee
          receiptNo: membership.receiptNo || 'N/A', // Include receiptNo
          createdAt: membership.createdAt,
        }))
      : memberships.map(membership => ({
          id: membership.id,
          ceo: membership.ceo,
          farmer: membership.farmer,
          membershipFee: membership.membershipFee, // Include membershipFee
          receiptNo: membership.receiptNo, // Include receiptNo
          createdAt: membership.createdAt,
        }));

    res.json(response);
  } catch (error) {
    console.error('Fetch memberships error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/:id', auth(['SuperAdmin', 'CEO']), async (req, res) => {
  try {
    const membership = await Membership.findByPk(req.params.id, {
      include: [
        { model: User, as: 'ceo', attributes: ['name', 'fpoName'] },
        { model: Farmer, as: 'farmer', attributes: ['name', 'contact', 'location'] }, // Added 'contact'
      ],
    });
    if (!membership) {
      return res.status(404).json({ message: 'Membership not found' });
    }
    if (req.user.role === 'CEO' && membership.ceoId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    res.json(membership.toJSON());
  } catch (error) {
    console.error('Fetch membership error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/', auth(['CEO']), upload.single('receiptPicture'), async (req, res) => {
  try {
    const { farmerId, membershipFee, receiptNo } = req.body;
    const membershipData = {
      farmerId: parseInt(farmerId),
      membershipFee: parseInt(membershipFee),
      receiptNo,
      ceoId: req.user.id,
      receiptPicture: req.file ? `uploads/${req.file.filename}` : null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const membership = await Membership.create(membershipData);
    res.status(201).json(membership);
  } catch (error) {
    console.error('Create membership error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/:id', auth(['CEO']), upload.single('receiptPicture'), async (req, res) => {
  try {
    const membership = await Membership.findByPk(req.params.id);
    if (!membership) {
      return res.status(404).json({ message: 'Membership not found' });
    }
    if (membership.ceoId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    const createdAt = new Date(membership.createdAt);
    const now = new Date();
    const diffInSeconds = (now - createdAt) / 1000;
    if (diffInSeconds > 3600) {
      return res.status(403).json({ message: 'Edit window expired' });
    }
    const { farmerId, membershipFee, receiptNo } = req.body;
    const updateData = {
      farmerId: farmerId ? parseInt(farmerId) : membership.farmerId,
      membershipFee: membershipFee ? parseInt(membershipFee) : membership.membershipFee,
      receiptNo: receiptNo || membership.receiptNo,
      receiptPicture: req.file ? `uploads/${req.file.filename}` : membership.receiptPicture,
      updatedAt: new Date(),
    };
    await membership.update(updateData);
    res.json(membership);
  } catch (error) {
    console.error('Update membership error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/:id', auth(['SuperAdmin', 'CEO']), async (req, res) => {
  try {
    const membership = await Membership.findByPk(req.params.id);
    if (!membership) {
      return res.status(404).json({ message: 'Membership not found' });
    }
    if (req.user.role === 'CEO' && membership.ceoId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    await membership.destroy();
    res.json({ message: 'Membership deleted' });
  } catch (error) {
    console.error('Delete membership error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/membership/export - Export filtered memberships to Excel
router.post('/export', auth(['SuperAdmin']), async (req, res) => {
  try {
    console.log('Export request received for /export with memberships count:', req.body.memberships?.length);
    const memberships = req.body.memberships || [];

    if (!memberships || memberships.length === 0) {
      return res.status(404).json({ message: 'No memberships found to export' });
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Memberships');

    worksheet.columns = [
      { header: 'CEO Name', key: 'ceoName', width: 15 },
      { header: 'FPO Name', key: 'fpoName', width: 15 },
      { header: 'Farmer Name', key: 'farmerName', width: 15 },
      { header: 'Membership Fee', key: 'membershipFee', width: 15 },
      { header: 'Location', key: 'location', width: 30 },
      { header: 'Receipt No', key: 'receiptNo', width: 15 },
      { header: 'Created At', key: 'createdAt', width: 20 },
    ];

    memberships.forEach(membership => {
      worksheet.addRow({
        ceoName: membership.ceo?.name || 'N/A',
        fpoName: membership.ceo?.fpoName || 'N/A',
        farmerName: membership.farmer?.name || 'N/A',
        membershipFee: membership.membershipFee || 'N/A',
        location: membership.farmer?.location
          ? `${membership.farmer.location.state || 'N/A'} > ${membership.farmer.location.district || 'N/A'} > ${membership.farmer.location.block || 'N/A'} > ${membership.farmer.location.panchayat || 'N/A'} > ${membership.farmer.location.village || 'N/A'}`
          : 'N/A',
        receiptNo: membership.receiptNo || 'N/A',
        createdAt: new Date(membership.createdAt).toLocaleString(),
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=memberships.xlsx');
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ message: 'Error exporting memberships', error: error.message });
  }
});

module.exports = router;