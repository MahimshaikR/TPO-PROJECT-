const express = require('express');
const router = express.Router();
const { Recruiter, User, Company } = require('../models/modelRegistry');
const { protect, authorize } = require('../middleware/auth');
const { logAudit } = require('../middleware/audit');

// @route   GET /api/recruiters/me
// @desc    Get current recruiter profile
router.get('/me', protect, authorize('RECRUITER'), async (req, res, next) => {
  try {
    let recruiter = await Recruiter.findOne({ userId: req.user._id });
    if (!recruiter) {
      recruiter = await Recruiter.create({
        userId: req.user._id,
        fullName: req.user.name,
        email: req.user.email,
        companyName: 'Partner Enterprise',
        isVerified: true,
        status: 'APPROVED'
      });
    }

    let company = null;
    if (recruiter.companyId) {
      company = await Company.findById(recruiter.companyId);
    }

    return res.status(200).json({
      success: true,
      message: 'Recruiter profile retrieved',
      data: {
        ...recruiter,
        company
      }
    });
  } catch (err) {
    next(err);
  }
});

// @route   PUT /api/recruiters/me
// @desc    Update current recruiter details
router.put('/me', protect, authorize('RECRUITER'), async (req, res, next) => {
  try {
    const recruiter = await Recruiter.findOne({ userId: req.user._id });
    if (!recruiter) {
      return res.status(404).json({
        success: false,
        message: 'Recruiter profile not found.',
        error: { code: 'NOT_FOUND' }
      });
    }

    const { fullName, phone, companyName, officialEmail, designation, companyId } = req.body;
    const updated = await Recruiter.findByIdAndUpdate(recruiter._id, {
      fullName: fullName || recruiter.fullName,
      phone: phone !== undefined ? phone : recruiter.phone,
      companyName: companyName || recruiter.companyName,
      officialEmail: officialEmail || recruiter.officialEmail,
      designation: designation || recruiter.designation,
      companyId: companyId || recruiter.companyId
    }, { new: true });

    return res.status(200).json({
      success: true,
      message: 'Recruiter profile updated successfully',
      data: updated
    });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/recruiters
// @desc    Admin list all recruiters
router.get('/', protect, authorize('ADMIN'), async (req, res, next) => {
  try {
    const { status, search } = req.query;
    const filter = {};
    if (status && status !== 'ALL') filter.status = status;

    let recruiters = await Recruiter.find(filter);

    if (search) {
      const q = search.toLowerCase().trim();
      recruiters = recruiters.filter(r =>
        r.fullName.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.companyName.toLowerCase().includes(q)
      );
    }

    return res.status(200).json({
      success: true,
      message: 'Recruiters retrieved',
      data: recruiters
    });
  } catch (err) {
    next(err);
  }
});

// @route   PATCH /api/recruiters/:id/status
// @desc    Admin approve or reject recruiter
router.patch('/:id/status', protect, authorize('ADMIN'), async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['APPROVED', 'REJECTED', 'PENDING'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value.',
        error: { code: 'INVALID_STATUS' }
      });
    }

    const recruiter = await Recruiter.findById(req.params.id);
    if (!recruiter) {
      return res.status(404).json({
        success: false,
        message: 'Recruiter not found.',
        error: { code: 'NOT_FOUND' }
      });
    }

    recruiter.status = status;
    recruiter.isVerified = status === 'APPROVED';
    await recruiter.save();

    // Also update User account approval
    if (recruiter.userId) {
      await User.findByIdAndUpdate(recruiter.userId, { isApproved: status === 'APPROVED' });
    }

    await logAudit(req, 'UPDATE_RECRUITER_STATUS', 'Recruiter', recruiter._id, { status });

    return res.status(200).json({
      success: true,
      message: `Recruiter status updated to ${status}`,
      data: recruiter
    });
  } catch (err) {
    next(err);
  }
});

// @route   DELETE /api/recruiters/:id
// @desc    Admin delete recruiter
router.delete('/:id', protect, authorize('ADMIN'), async (req, res, next) => {
  try {
    const recruiter = await Recruiter.findById(req.params.id);
    if (!recruiter) {
      return res.status(404).json({
        success: false,
        message: 'Recruiter not found.',
        error: { code: 'NOT_FOUND' }
      });
    }

    if (recruiter.userId) {
      await User.findByIdAndDelete(recruiter.userId);
    }
    await Recruiter.findByIdAndDelete(recruiter._id);

    await logAudit(req, 'DELETE_RECRUITER', 'Recruiter', recruiter._id);

    return res.status(200).json({
      success: true,
      message: 'Recruiter removed successfully.'
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
