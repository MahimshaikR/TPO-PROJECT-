const express = require('express');
const router = express.Router();
const { Testimonial } = require('../models/modelRegistry');
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const { logAudit } = require('../middleware/audit');

// @route   GET /api/testimonials
// @desc    Get all published testimonials (Public)
router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const { type } = req.query;
    const filter = { isPublished: true };
    if (type && type !== 'ALL') filter.type = type.toUpperCase();

    const items = await Testimonial.find(filter);

    return res.status(200).json({
      success: true,
      message: 'Testimonials retrieved',
      data: items
    });
  } catch (err) {
    next(err);
  }
});

// @route   POST /api/testimonials
// @desc    Create testimonial (Admin or authenticated user submission)
router.post('/', protect, async (req, res, next) => {
  try {
    const isAdmin = ['ADMIN', 'TP_OFFICER', 'SUPER_ADMIN'].includes(req.user.role);
    const item = await Testimonial.create({
      ...req.body,
      isPublished: isAdmin ? (req.body.isPublished ?? true) : false
    });
    await logAudit(req, 'CREATE_TESTIMONIAL', 'Testimonial', item._id, { name: item.name });
    return res.status(201).json({
      success: true,
      message: isAdmin ? 'Testimonial published successfully' : 'Testimonial submitted for administrative approval',
      data: item
    });
  } catch (err) {
    next(err);
  }
});

// @route   PUT /api/testimonials/:id
// @desc    Update/approve testimonial (Admin)
router.put('/:id', protect, authorize('ADMIN'), async (req, res, next) => {
  try {
    const item = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found',
        error: { code: 'NOT_FOUND' }
      });
    }
    await logAudit(req, 'UPDATE_TESTIMONIAL', 'Testimonial', item._id, { name: item.name });
    return res.status(200).json({
      success: true,
      message: 'Testimonial updated successfully',
      data: item
    });
  } catch (err) {
    next(err);
  }
});

// @route   DELETE /api/testimonials/:id
// @desc    Delete testimonial (Admin)
router.delete('/:id', protect, authorize('ADMIN'), async (req, res, next) => {
  try {
    const item = await Testimonial.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found',
        error: { code: 'NOT_FOUND' }
      });
    }
    await logAudit(req, 'DELETE_TESTIMONIAL', 'Testimonial', item._id, { name: item.name });
    return res.status(200).json({
      success: true,
      message: 'Testimonial deleted successfully'
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
