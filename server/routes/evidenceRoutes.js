const express = require('express');
const router = express.Router();
const { Evidence } = require('../models/modelRegistry');
const { protect, authorize } = require('../middleware/auth');
const { logAudit } = require('../middleware/audit');

// @route   GET /api/evidence
// @desc    Get all evidence records (Admin / Coordinator / Principal)
router.get('/', protect, authorize('ADMIN', 'COORDINATOR', 'MANAGEMENT_PRINCIPAL'), async (req, res, next) => {
  try {
    const { academicYear, department, activityType, status } = req.query;
    const filter = {};
    if (academicYear && academicYear !== 'ALL') filter.academicYear = academicYear;
    if (department && department !== 'ALL') filter.department = department;
    if (activityType && activityType !== 'ALL') filter.activityType = activityType;
    if (status && status !== 'ALL') filter.status = status.toUpperCase();

    const items = await Evidence.find(filter);
    items.sort((a, b) => new Date(b.activityDate || 0) - new Date(a.activityDate || 0));

    return res.status(200).json({
      success: true,
      message: 'Evidence documents retrieved',
      data: items
    });
  } catch (err) {
    next(err);
  }
});

// @route   POST /api/evidence
// @desc    Add new accreditation evidence document
router.post('/', protect, authorize('ADMIN', 'COORDINATOR'), async (req, res, next) => {
  try {
    const item = await Evidence.create({
      ...req.body,
      responsiblePerson: req.body.responsiblePerson || req.user.name || 'Coordinator'
    });
    await logAudit(req, 'CREATE_EVIDENCE', 'Evidence', item._id, { title: item.title, year: item.academicYear });
    return res.status(201).json({
      success: true,
      message: 'Accreditation evidence documented successfully',
      data: item
    });
  } catch (err) {
    next(err);
  }
});

// @route   PUT /api/evidence/:id
// @desc    Update / verify evidence document
router.put('/:id', protect, authorize('ADMIN', 'COORDINATOR'), async (req, res, next) => {
  try {
    const item = await Evidence.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Evidence document not found',
        error: { code: 'NOT_FOUND' }
      });
    }
    await logAudit(req, 'UPDATE_EVIDENCE', 'Evidence', item._id, { title: item.title });
    return res.status(200).json({
      success: true,
      message: 'Evidence record updated successfully',
      data: item
    });
  } catch (err) {
    next(err);
  }
});

// @route   DELETE /api/evidence/:id
// @desc    Delete evidence record (Admin)
router.delete('/:id', protect, authorize('ADMIN'), async (req, res, next) => {
  try {
    const item = await Evidence.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Evidence document not found',
        error: { code: 'NOT_FOUND' }
      });
    }
    await logAudit(req, 'DELETE_EVIDENCE', 'Evidence', item._id, { title: item.title });
    return res.status(200).json({
      success: true,
      message: 'Evidence document deleted successfully'
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
