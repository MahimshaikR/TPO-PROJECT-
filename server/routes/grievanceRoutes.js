const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { Grievance, Student } = require('../models/modelRegistry');
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const { logAudit } = require('../middleware/audit');

// @route   POST /api/grievance
// @desc    Submit student grievance
router.post('/', optionalAuth, async (req, res, next) => {
  try {
    const { studentName, rollNumber, email, category, description } = req.body;

    if (!studentName || !rollNumber || !description) {
      return res.status(400).json({
        success: false,
        message: 'Name, roll number, and description are required.',
        error: { code: 'VALIDATION_ERROR' }
      });
    }

    const randomSuffix = crypto.randomInt(1000, 9999);
    const ticketNumber = `GRV-2026-${randomSuffix}`;

    const grievance = await Grievance.create({
      ticketNumber,
      studentName: studentName.trim(),
      rollNumber: rollNumber.trim().toUpperCase(),
      email: email ? email.trim() : (req.user ? req.user.email : ''),
      category: category || 'GENERAL',
      description: description.trim(),
      status: 'OPEN'
    });

    await logAudit(req, 'SUBMIT_GRIEVANCE', 'Grievance', grievance._id, { ticketNumber });

    return res.status(201).json({
      success: true,
      message: 'Grievance submitted successfully. Please save your tracking ticket number.',
      data: {
        ticketNumber: grievance.ticketNumber,
        grievance
      }
    });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/grievance/track/:ticketNumber
// @desc    Public grievance status tracking
router.get('/track/:ticketNumber', async (req, res, next) => {
  try {
    const grievance = await Grievance.findOne({
      ticketNumber: req.params.ticketNumber.trim().toUpperCase()
    });

    if (!grievance) {
      return res.status(404).json({
        success: false,
        message: 'No grievance ticket found with specified tracking ID.',
        error: { code: 'TICKET_NOT_FOUND' }
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Grievance status retrieved',
      data: grievance
    });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/grievance/my
// @desc    Get logged in student's grievances
router.get('/my', protect, authorize('STUDENT'), async (req, res, next) => {
  try {
    const student = await Student.findOne({ userId: req.user._id });
    const filter = {};
    if (student) {
      filter.$or = [{ rollNumber: student.rollNumber }, { email: req.user.email }];
    } else {
      filter.email = req.user.email;
    }

    const grievances = await Grievance.find(filter);
    return res.status(200).json({
      success: true,
      message: 'Student grievances retrieved',
      data: grievances
    });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/grievance
// @desc    Admin list all grievances
router.get('/', protect, authorize('ADMIN'), async (req, res, next) => {
  try {
    const { status, category } = req.query;
    const filter = {};
    if (status && status !== 'ALL') filter.status = status;
    if (category && category !== 'ALL') filter.category = category;

    const grievances = await Grievance.find(filter);
    grievances.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

    return res.status(200).json({
      success: true,
      message: 'All grievances retrieved',
      data: grievances
    });
  } catch (err) {
    next(err);
  }
});

// @route   PATCH /api/grievance/:id
// @desc    Admin update grievance status and add remarks
router.patch('/:id', protect, authorize('ADMIN'), async (req, res, next) => {
  try {
    const { status, adminRemarks } = req.body;
    const grievance = await Grievance.findById(req.params.id);
    if (!grievance) {
      return res.status(404).json({
        success: false,
        message: 'Grievance not found.',
        error: { code: 'NOT_FOUND' }
      });
    }

    if (status) grievance.status = status;
    if (adminRemarks !== undefined) grievance.adminRemarks = adminRemarks;
    if (status === 'RESOLVED' || status === 'CLOSED') {
      grievance.resolvedAt = new Date();
    }
    await grievance.save();

    await logAudit(req, 'RESOLVE_GRIEVANCE', 'Grievance', grievance._id, { ticketNumber: grievance.ticketNumber, status });

    return res.status(200).json({
      success: true,
      message: 'Grievance ticket updated',
      data: grievance
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
