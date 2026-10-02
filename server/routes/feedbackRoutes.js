const express = require('express');
const router = express.Router();
const { Feedback } = require('../models/modelRegistry');
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const { logAudit } = require('../middleware/audit');

// @route   POST /api/feedback
// @desc    Submit public/student feedback
router.post('/', optionalAuth, async (req, res, next) => {
  try {
    const { name, email, role, subject, message, rating } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and message are required.',
        error: { code: 'VALIDATION_ERROR' }
      });
    }

    const feedback = await Feedback.create({
      name: name.trim(),
      email: email.trim(),
      role: role || (req.user ? req.user.role : 'Student'),
      subject: subject || 'General Placement Feedback',
      message: message.trim(),
      rating: Number(rating) || 5,
      status: 'NEW'
    });

    return res.status(201).json({
      success: true,
      message: 'Thank you for your valuable feedback!',
      data: feedback
    });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/feedback
// @desc    Admin view all feedback
router.get('/', protect, authorize('ADMIN'), async (req, res, next) => {
  try {
    const feedbacks = await Feedback.find({});
    feedbacks.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

    return res.status(200).json({
      success: true,
      message: 'Feedback submissions retrieved',
      data: feedbacks
    });
  } catch (err) {
    next(err);
  }
});

// @route   PATCH /api/feedback/:id
// @desc    Admin review or respond to feedback
router.patch('/:id', protect, authorize('ADMIN'), async (req, res, next) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found.',
        error: { code: 'NOT_FOUND' }
      });
    }

    const updated = await Feedback.findByIdAndUpdate(feedback._id, req.body, { new: true });
    return res.status(200).json({
      success: true,
      message: 'Feedback updated',
      data: updated
    });
  } catch (err) {
    next(err);
  }
});

// @route   DELETE /api/feedback/:id
// @desc    Admin delete feedback
router.delete('/:id', protect, authorize('ADMIN'), async (req, res, next) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found.',
        error: { code: 'NOT_FOUND' }
      });
    }

    await Feedback.findByIdAndDelete(feedback._id);
    return res.status(200).json({
      success: true,
      message: 'Feedback deleted successfully.'
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
