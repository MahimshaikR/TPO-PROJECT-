const express = require('express');
const router = express.Router();
const { Internship } = require('../models/modelRegistry');
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const { logAudit } = require('../middleware/audit');

// @route   GET /api/internships
// @desc    Get all internships (public/student)
router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const { branch, type, search } = req.query;
    const filter = { status: 'ACTIVE' };
    if (type && type !== 'ALL') filter.type = type;

    let internships = await Internship.find(filter);

    if (branch && branch !== 'ALL') {
      internships = internships.filter(i => !i.branches?.length || i.branches.includes('All') || i.branches.includes(branch));
    }

    if (search) {
      const q = search.toLowerCase().trim();
      internships = internships.filter(i =>
        i.title.toLowerCase().includes(q) ||
        i.company.toLowerCase().includes(q) ||
        (i.description && i.description.toLowerCase().includes(q))
      );
    }

    return res.status(200).json({
      success: true,
      message: 'Internships retrieved',
      data: internships
    });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/internships/:id
// @desc    Get internship details
router.get('/:id', optionalAuth, async (req, res, next) => {
  try {
    const internship = await Internship.findById(req.params.id);
    if (!internship) {
      return res.status(404).json({
        success: false,
        message: 'Internship not found.',
        error: { code: 'NOT_FOUND' }
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Internship details retrieved',
      data: internship
    });
  } catch (err) {
    next(err);
  }
});

// @route   POST /api/internships
// @desc    Create new internship (Admin)
router.post('/', protect, authorize('ADMIN'), async (req, res, next) => {
  try {
    const { title, company, stipend, duration, location, type, applyLink, deadline, branches, description, requirements } = req.body;

    if (!title || !company || !deadline) {
      return res.status(400).json({
        success: false,
        message: 'Title, company, and deadline are required.',
        error: { code: 'VALIDATION_ERROR' }
      });
    }

    const internship = await Internship.create({
      title: title.trim(),
      company: company.trim(),
      stipend: stipend || 'Stipend as per company norms',
      duration: duration || '3-6 Months',
      location: location || 'Hybrid',
      type: type || 'SUMMER',
      applyLink: applyLink || '',
      deadline,
      branches: Array.isArray(branches) ? branches : ['All'],
      description: description || '',
      requirements: Array.isArray(requirements) ? requirements : [],
      status: 'ACTIVE'
    });

    await logAudit(req, 'CREATE_INTERNSHIP', 'Internship', internship._id, { title: internship.title });

    return res.status(201).json({
      success: true,
      message: 'Internship created successfully',
      data: internship
    });
  } catch (err) {
    next(err);
  }
});

// @route   PUT /api/internships/:id
// @desc    Update internship
router.put('/:id', protect, authorize('ADMIN'), async (req, res, next) => {
  try {
    const internship = await Internship.findById(req.params.id);
    if (!internship) {
      return res.status(404).json({
        success: false,
        message: 'Internship not found.',
        error: { code: 'NOT_FOUND' }
      });
    }

    const updated = await Internship.findByIdAndUpdate(internship._id, req.body, { new: true });
    await logAudit(req, 'UPDATE_INTERNSHIP', 'Internship', internship._id, { title: updated.title });

    return res.status(200).json({
      success: true,
      message: 'Internship updated successfully',
      data: updated
    });
  } catch (err) {
    next(err);
  }
});

// @route   DELETE /api/internships/:id
// @desc    Delete internship
router.delete('/:id', protect, authorize('ADMIN'), async (req, res, next) => {
  try {
    const internship = await Internship.findById(req.params.id);
    if (!internship) {
      return res.status(404).json({
        success: false,
        message: 'Internship not found.',
        error: { code: 'NOT_FOUND' }
      });
    }

    await Internship.findByIdAndDelete(internship._id);
    await logAudit(req, 'DELETE_INTERNSHIP', 'Internship', internship._id);

    return res.status(200).json({
      success: true,
      message: 'Internship removed successfully.'
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
