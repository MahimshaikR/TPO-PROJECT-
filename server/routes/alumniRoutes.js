const express = require('express');
const router = express.Router();
const { Alumni } = require('../models/modelRegistry');
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const { logAudit } = require('../middleware/audit');

// @route   GET /api/alumni
// @desc    Get all alumni (Public directory)
router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const { department, graduationYear, company, isMentor } = req.query;
    const filter = {};
    if (department && department !== 'ALL') filter.department = department;
    if (graduationYear && graduationYear !== 'ALL') filter.graduationYear = graduationYear;
    if (company && company !== 'ALL') filter.company = company;
    if (isMentor !== undefined && isMentor !== '') filter.isMentor = isMentor === 'true';

    const items = await Alumni.find(filter);

    return res.status(200).json({
      success: true,
      message: 'Alumni retrieved',
      data: items
    });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/alumni/:id
// @desc    Get single alumnus profile
router.get('/:id', optionalAuth, async (req, res, next) => {
  try {
    const item = await Alumni.findById(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Alumnus not found',
        error: { code: 'NOT_FOUND' }
      });
    }
    return res.status(200).json({
      success: true,
      data: item
    });
  } catch (err) {
    next(err);
  }
});

// @route   POST /api/alumni
// @desc    Register or add alumnus (Admin or authenticated user)
router.post('/', protect, async (req, res, next) => {
  try {
    const item = await Alumni.create(req.body);
    await logAudit(req, 'CREATE_ALUMNI', 'Alumni', item._id, { name: item.fullName });
    return res.status(201).json({
      success: true,
      message: 'Alumnus registered successfully',
      data: item
    });
  } catch (err) {
    next(err);
  }
});

// @route   PUT /api/alumni/:id
// @desc    Update alumnus profile
router.put('/:id', protect, authorize('ADMIN'), async (req, res, next) => {
  try {
    const item = await Alumni.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Alumnus not found',
        error: { code: 'NOT_FOUND' }
      });
    }
    await logAudit(req, 'UPDATE_ALUMNI', 'Alumni', item._id, { name: item.fullName });
    return res.status(200).json({
      success: true,
      message: 'Alumnus updated successfully',
      data: item
    });
  } catch (err) {
    next(err);
  }
});

// @route   DELETE /api/alumni/:id
// @desc    Delete alumnus (Admin)
router.delete('/:id', protect, authorize('ADMIN'), async (req, res, next) => {
  try {
    const item = await Alumni.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Alumnus not found',
        error: { code: 'NOT_FOUND' }
      });
    }
    await logAudit(req, 'DELETE_ALUMNI', 'Alumni', item._id, { name: item.fullName });
    return res.status(200).json({
      success: true,
      message: 'Alumnus profile removed successfully'
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
