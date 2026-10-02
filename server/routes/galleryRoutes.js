const express = require('express');
const router = express.Router();
const { Gallery } = require('../models/modelRegistry');
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const { logAudit } = require('../middleware/audit');

// @route   GET /api/gallery
// @desc    Get all gallery photos
router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const { category } = req.query;
    const filter = {};
    if (category && category !== 'ALL') filter.category = category;

    const items = await Gallery.find(filter);
    items.sort((a, b) => new Date(b.eventDate || 0) - new Date(a.eventDate || 0));

    return res.status(200).json({
      success: true,
      message: 'Gallery retrieved',
      data: items
    });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/gallery/:id
// @desc    Get single gallery photo
router.get('/:id', optionalAuth, async (req, res, next) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found.',
        error: { code: 'NOT_FOUND' }
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Gallery item retrieved',
      data: item
    });
  } catch (err) {
    next(err);
  }
});

// @route   POST /api/gallery
// @desc    Add gallery photo (Admin)
router.post('/', protect, authorize('ADMIN'), async (req, res, next) => {
  try {
    const { title, category, imageUrl, caption, eventDate, isFeatured } = req.body;

    if (!title || !imageUrl) {
      return res.status(400).json({
        success: false,
        message: 'Title and image URL are required.',
        error: { code: 'VALIDATION_ERROR' }
      });
    }

    const item = await Gallery.create({
      title: title.trim(),
      category: category || 'PLACEMENT',
      imageUrl: imageUrl.trim(),
      caption: caption || '',
      eventDate: eventDate || new Date().toISOString().split('T')[0],
      isFeatured: !!isFeatured
    });

    await logAudit(req, 'CREATE_GALLERY', 'Gallery', item._id, { title: item.title });

    return res.status(201).json({
      success: true,
      message: 'Gallery photo added successfully',
      data: item
    });
  } catch (err) {
    next(err);
  }
});

// @route   PUT /api/gallery/:id
// @desc    Update gallery photo
router.put('/:id', protect, authorize('ADMIN'), async (req, res, next) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found.',
        error: { code: 'NOT_FOUND' }
      });
    }

    const updated = await Gallery.findByIdAndUpdate(item._id, req.body, { new: true });
    await logAudit(req, 'UPDATE_GALLERY', 'Gallery', item._id, { title: updated.title });

    return res.status(200).json({
      success: true,
      message: 'Gallery item updated',
      data: updated
    });
  } catch (err) {
    next(err);
  }
});

// @route   DELETE /api/gallery/:id
// @desc    Delete gallery photo
router.delete('/:id', protect, authorize('ADMIN'), async (req, res, next) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found.',
        error: { code: 'NOT_FOUND' }
      });
    }

    await Gallery.findByIdAndDelete(item._id);
    await logAudit(req, 'DELETE_GALLERY', 'Gallery', item._id);

    return res.status(200).json({
      success: true,
      message: 'Gallery item removed successfully.'
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
