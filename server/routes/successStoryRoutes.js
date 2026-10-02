const express = require('express');
const router = express.Router();
const { SuccessStory } = require('../models/modelRegistry');
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const { logAudit } = require('../middleware/audit');

// @route   GET /api/success-stories
// @desc    Get all alumni success stories
router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const stories = await SuccessStory.find({});
    return res.status(200).json({
      success: true,
      message: 'Success stories retrieved',
      data: stories
    });
  } catch (err) {
    next(err);
  }
});

// @route   POST /api/success-stories
// @desc    Create new success story (Admin)
router.post('/', protect, authorize('ADMIN'), async (req, res, next) => {
  try {
    const { studentName, batch, branch, currentCompany, designation, packageLpa, testimonial, photoUrl, videoUrl, linkedinUrl, isFeatured } = req.body;

    if (!studentName || !currentCompany || !testimonial) {
      return res.status(400).json({
        success: false,
        message: 'studentName, currentCompany, and testimonial are required.',
        error: { code: 'VALIDATION_ERROR' }
      });
    }

    const story = await SuccessStory.create({
      studentName: studentName.trim(),
      batch: batch || '2026',
      branch: branch || 'Computer Science & Engineering',
      currentCompany: currentCompany.trim(),
      designation: designation || 'Software Engineer',
      packageLpa: Number(packageLpa) || 20,
      testimonial: testimonial.trim(),
      photoUrl: photoUrl || '',
      videoUrl: videoUrl || '',
      linkedinUrl: linkedinUrl || '',
      isFeatured: isFeatured !== undefined ? isFeatured : true
    });

    await logAudit(req, 'CREATE_SUCCESS_STORY', 'SuccessStory', story._id, { student: story.studentName });

    return res.status(201).json({
      success: true,
      message: 'Success story created',
      data: story
    });
  } catch (err) {
    next(err);
  }
});

// @route   PUT /api/success-stories/:id
// @desc    Update success story
router.put('/:id', protect, authorize('ADMIN'), async (req, res, next) => {
  try {
    const story = await SuccessStory.findById(req.params.id);
    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Success story not found.',
        error: { code: 'NOT_FOUND' }
      });
    }

    const updated = await SuccessStory.findByIdAndUpdate(story._id, req.body, { new: true });
    await logAudit(req, 'UPDATE_SUCCESS_STORY', 'SuccessStory', story._id, { student: updated.studentName });

    return res.status(200).json({
      success: true,
      message: 'Success story updated',
      data: updated
    });
  } catch (err) {
    next(err);
  }
});

// @route   DELETE /api/success-stories/:id
// @desc    Delete success story
router.delete('/:id', protect, authorize('ADMIN'), async (req, res, next) => {
  try {
    const story = await SuccessStory.findById(req.params.id);
    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Success story not found.',
        error: { code: 'NOT_FOUND' }
      });
    }

    await SuccessStory.findByIdAndDelete(story._id);
    await logAudit(req, 'DELETE_SUCCESS_STORY', 'SuccessStory', story._id);

    return res.status(200).json({
      success: true,
      message: 'Success story deleted.'
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
