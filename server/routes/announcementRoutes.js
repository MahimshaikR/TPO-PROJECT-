const express = require('express');
const router = express.Router();
const { Announcement } = require('../models/modelRegistry');
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const { logAudit } = require('../middleware/audit');

// @route   GET /api/announcements
// @desc    Get announcements (public & filtered by audience)
router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const { category, priority, audience, search } = req.query;

    const filter = {};
    if (!req.user || req.user.role === 'STUDENT') {
      filter.isPublished = true;
    }

    if (category && category !== 'ALL') filter.category = category;
    if (priority && priority !== 'ALL') filter.priority = priority;

    let announcements = await Announcement.find(filter);

    // Audience filter
    if (req.user && req.user.role === 'STUDENT') {
      announcements = announcements.filter(a => a.targetAudience === 'ALL' || a.targetAudience === 'STUDENTS');
    } else if (req.user && req.user.role === 'RECRUITER') {
      announcements = announcements.filter(a => a.targetAudience === 'ALL' || a.targetAudience === 'RECRUITERS');
    }

    if (search) {
      const q = search.toLowerCase().trim();
      announcements = announcements.filter(a =>
        a.title.toLowerCase().includes(q) ||
        a.content.toLowerCase().includes(q)
      );
    }

    // Sort: Urgent first, then newest
    const priorityWeight = { URGENT: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
    announcements.sort((a, b) => {
      const weightDiff = (priorityWeight[b.priority] || 1) - (priorityWeight[a.priority] || 1);
      if (weightDiff !== 0) return weightDiff;
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });

    return res.status(200).json({
      success: true,
      message: 'Announcements retrieved',
      data: announcements
    });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/announcements/:id
// @desc    Get announcement details
router.get('/:id', optionalAuth, async (req, res, next) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found.',
        error: { code: 'NOT_FOUND' }
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Announcement details retrieved',
      data: announcement
    });
  } catch (err) {
    next(err);
  }
});

// @route   POST /api/announcements
// @desc    Create new announcement (Admin)
router.post('/', protect, authorize('ADMIN'), async (req, res, next) => {
  try {
    const { title, category, content, targetAudience, priority, expiresAt, attachments, isPublished } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title and content are required.',
        error: { code: 'VALIDATION_ERROR' }
      });
    }

    const announcement = await Announcement.create({
      title: title.trim(),
      category: category || 'GENERAL',
      content: content.trim(),
      targetAudience: targetAudience || 'ALL',
      priority: priority || 'MEDIUM',
      expiresAt: expiresAt || '',
      attachments: Array.isArray(attachments) ? attachments : [],
      isPublished: isPublished !== undefined ? isPublished : true,
      createdBy: req.user._id
    });

    await logAudit(req, 'CREATE_ANNOUNCEMENT', 'Announcement', announcement._id, { title: announcement.title });

    return res.status(201).json({
      success: true,
      message: 'Announcement published successfully',
      data: announcement
    });
  } catch (err) {
    next(err);
  }
});

// @route   PUT /api/announcements/:id
// @desc    Update announcement
router.put('/:id', protect, authorize('ADMIN'), async (req, res, next) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found.',
        error: { code: 'NOT_FOUND' }
      });
    }

    const updated = await Announcement.findByIdAndUpdate(announcement._id, req.body, { new: true });
    await logAudit(req, 'UPDATE_ANNOUNCEMENT', 'Announcement', announcement._id, { title: updated.title });

    return res.status(200).json({
      success: true,
      message: 'Announcement updated successfully',
      data: updated
    });
  } catch (err) {
    next(err);
  }
});

// @route   DELETE /api/announcements/:id
// @desc    Delete announcement
router.delete('/:id', protect, authorize('ADMIN'), async (req, res, next) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found.',
        error: { code: 'NOT_FOUND' }
      });
    }

    await Announcement.findByIdAndDelete(announcement._id);
    await logAudit(req, 'DELETE_ANNOUNCEMENT', 'Announcement', announcement._id);

    return res.status(200).json({
      success: true,
      message: 'Announcement deleted successfully.'
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
