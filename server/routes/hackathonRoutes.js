const express = require('express');
const router = express.Router();
const { Hackathon } = require('../models/modelRegistry');
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const { logAudit } = require('../middleware/audit');

// @route   GET /api/hackathons
// @desc    Get all hackathons & competitions
router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const { status, category } = req.query;
    const filter = {};
    if (status && status !== 'ALL') filter.status = status.toUpperCase();
    if (category && category !== 'ALL') filter.category = category;

    const items = await Hackathon.find(filter);
    items.sort((a, b) => new Date(b.startDate || 0) - new Date(a.startDate || 0));

    return res.status(200).json({
      success: true,
      message: 'Hackathons retrieved',
      data: items
    });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/hackathons/:id
// @desc    Get hackathon details
router.get('/:id', optionalAuth, async (req, res, next) => {
  try {
    const item = await Hackathon.findById(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Hackathon not found',
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

// @route   POST /api/hackathons/:id/register
// @desc    Register a team for hackathon
router.post('/:id/register', protect, async (req, res, next) => {
  try {
    const item = await Hackathon.findById(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Hackathon not found',
        error: { code: 'NOT_FOUND' }
      });
    }

    item.registeredTeamsCount = (item.registeredTeamsCount || 0) + 1;
    await Hackathon.findByIdAndUpdate(req.params.id, { registeredTeamsCount: item.registeredTeamsCount });

    await logAudit(req, 'REGISTER_HACKATHON', 'Hackathon', item._id, {
      teamName: req.body.teamName || 'New Team',
      user: req.user.email
    });

    return res.status(200).json({
      success: true,
      message: `Team successfully registered for ${item.title}!`,
      data: { registeredTeamsCount: item.registeredTeamsCount }
    });
  } catch (err) {
    next(err);
  }
});

// @route   POST /api/hackathons
// @desc    Create hackathon (Admin)
router.post('/', protect, authorize('ADMIN'), async (req, res, next) => {
  try {
    const item = await Hackathon.create(req.body);
    await logAudit(req, 'CREATE_HACKATHON', 'Hackathon', item._id, { title: item.title });
    return res.status(201).json({
      success: true,
      message: 'Hackathon published successfully',
      data: item
    });
  } catch (err) {
    next(err);
  }
});

// @route   PUT /api/hackathons/:id
// @desc    Update hackathon (Admin)
router.put('/:id', protect, authorize('ADMIN'), async (req, res, next) => {
  try {
    const item = await Hackathon.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Hackathon not found',
        error: { code: 'NOT_FOUND' }
      });
    }
    await logAudit(req, 'UPDATE_HACKATHON', 'Hackathon', item._id, { title: item.title });
    return res.status(200).json({
      success: true,
      message: 'Hackathon updated successfully',
      data: item
    });
  } catch (err) {
    next(err);
  }
});

// @route   DELETE /api/hackathons/:id
// @desc    Delete hackathon (Admin)
router.delete('/:id', protect, authorize('ADMIN'), async (req, res, next) => {
  try {
    const item = await Hackathon.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Hackathon not found',
        error: { code: 'NOT_FOUND' }
      });
    }
    await logAudit(req, 'DELETE_HACKATHON', 'Hackathon', item._id, { title: item.title });
    return res.status(200).json({
      success: true,
      message: 'Hackathon deleted successfully'
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
