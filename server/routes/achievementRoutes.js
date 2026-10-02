const express = require('express');
const router = express.Router();
const { Achievement } = require('../models/modelRegistry');
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const { logAudit } = require('../middleware/audit');

// @route   GET /api/achievements
// @desc    Get all achievements
router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const { branch, year } = req.query;
    const filter = {};
    if (branch && branch !== 'ALL') filter.branch = branch;
    if (year && year !== 'ALL') filter.year = year;

    const items = await Achievement.find(filter);
    items.sort((a, b) => (b.packageLpa || 0) - (a.packageLpa || 0));

    return res.status(200).json({
      success: true,
      message: 'Achievements retrieved',
      data: items
    });
  } catch (err) {
    next(err);
  }
});

// @route   POST /api/achievements
// @desc    Add achievement (Admin)
router.post('/', protect, authorize('ADMIN'), async (req, res, next) => {
  try {
    const { studentName, rollNumber, branch, batch, companyName, companyLogo, packageLpa, role, photoUrl, badge, year, isFeatured } = req.body;

    if (!studentName || !companyName || !packageLpa) {
      return res.status(400).json({
        success: false,
        message: 'studentName, companyName, and packageLpa are required.',
        error: { code: 'VALIDATION_ERROR' }
      });
    }

    const item = await Achievement.create({
      studentName: studentName.trim(),
      rollNumber: rollNumber || '',
      branch: branch || 'CSE',
      batch: batch || '2027',
      companyName: companyName.trim(),
      companyLogo: companyLogo || '',
      packageLpa: Number(packageLpa),
      role: role || 'Software Engineer',
      photoUrl: photoUrl || '',
      badge: badge || 'Super Dream Offer',
      year: year || '2026-27',
      isFeatured: isFeatured !== undefined ? isFeatured : true
    });

    await logAudit(req, 'CREATE_ACHIEVEMENT', 'Achievement', item._id, { student: item.studentName });

    return res.status(201).json({
      success: true,
      message: 'Achievement added successfully',
      data: item
    });
  } catch (err) {
    next(err);
  }
});

// @route   PUT /api/achievements/:id
// @desc    Update achievement
router.put('/:id', protect, authorize('ADMIN'), async (req, res, next) => {
  try {
    const item = await Achievement.findById(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Achievement not found.',
        error: { code: 'NOT_FOUND' }
      });
    }

    const updated = await Achievement.findByIdAndUpdate(item._id, req.body, { new: true });
    await logAudit(req, 'UPDATE_ACHIEVEMENT', 'Achievement', item._id, { student: updated.studentName });

    return res.status(200).json({
      success: true,
      message: 'Achievement updated',
      data: updated
    });
  } catch (err) {
    next(err);
  }
});

// @route   DELETE /api/achievements/:id
// @desc    Delete achievement
router.delete('/:id', protect, authorize('ADMIN'), async (req, res, next) => {
  try {
    const item = await Achievement.findById(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Achievement not found.',
        error: { code: 'NOT_FOUND' }
      });
    }

    await Achievement.findByIdAndDelete(item._id);
    await logAudit(req, 'DELETE_ACHIEVEMENT', 'Achievement', item._id);

    return res.status(200).json({
      success: true,
      message: 'Achievement removed successfully.'
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
