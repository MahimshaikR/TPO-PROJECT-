const express = require('express');
const router = express.Router();
const { TeamMember } = require('../models/modelRegistry');
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const { logAudit } = require('../middleware/audit');

// @route   GET /api/team
// @desc    Get all active team members (Public)
router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const { role, department } = req.query;
    const filter = { isActive: true };
    if (role && role !== 'ALL') filter.role = role;
    if (department && department !== 'ALL') filter.department = department;

    const members = await TeamMember.find(filter);
    members.sort((a, b) => (a.order || 99) - (b.order || 99));

    return res.status(200).json({
      success: true,
      message: 'Team members retrieved',
      data: members
    });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/team/:id
// @desc    Get single team member
router.get('/:id', optionalAuth, async (req, res, next) => {
  try {
    const member = await TeamMember.findById(req.params.id);
    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found',
        error: { code: 'NOT_FOUND' }
      });
    }
    return res.status(200).json({
      success: true,
      data: member
    });
  } catch (err) {
    next(err);
  }
});

// @route   POST /api/team
// @desc    Create team member (Admin)
router.post('/', protect, authorize('ADMIN'), async (req, res, next) => {
  try {
    const member = await TeamMember.create(req.body);
    await logAudit(req, 'CREATE_TEAM_MEMBER', 'TeamMember', member._id, { name: member.name });
    return res.status(201).json({
      success: true,
      message: 'Team member added successfully',
      data: member
    });
  } catch (err) {
    next(err);
  }
});

// @route   PUT /api/team/:id
// @desc    Update team member (Admin)
router.put('/:id', protect, authorize('ADMIN'), async (req, res, next) => {
  try {
    const member = await TeamMember.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found',
        error: { code: 'NOT_FOUND' }
      });
    }
    await logAudit(req, 'UPDATE_TEAM_MEMBER', 'TeamMember', member._id, { name: member.name });
    return res.status(200).json({
      success: true,
      message: 'Team member updated successfully',
      data: member
    });
  } catch (err) {
    next(err);
  }
});

// @route   DELETE /api/team/:id
// @desc    Delete team member (Admin)
router.delete('/:id', protect, authorize('ADMIN'), async (req, res, next) => {
  try {
    const member = await TeamMember.findByIdAndDelete(req.params.id);
    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found',
        error: { code: 'NOT_FOUND' }
      });
    }
    await logAudit(req, 'DELETE_TEAM_MEMBER', 'TeamMember', member._id, { name: member.name });
    return res.status(200).json({
      success: true,
      message: 'Team member removed successfully'
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
