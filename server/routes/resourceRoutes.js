const express = require('express');
const router = express.Router();
const { Resource } = require('../models/modelRegistry');
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const { logAudit } = require('../middleware/audit');

// @route   GET /api/resources
// @desc    Get resources by category
router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const { category, search } = req.query;
    const filter = { isPublished: true };
    if (category && category !== 'ALL') filter.category = category;

    let resources = await Resource.find(filter);

    if (search) {
      const q = search.toLowerCase().trim();
      resources = resources.filter(r =>
        r.title.toLowerCase().includes(q) ||
        (r.description && r.description.toLowerCase().includes(q)) ||
        (r.tags && r.tags.some(t => t.toLowerCase().includes(q)))
      );
    }

    return res.status(200).json({
      success: true,
      message: 'Resources retrieved',
      data: resources
    });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/resources/:id
// @desc    Get resource details
router.get('/:id', optionalAuth, async (req, res, next) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found.',
        error: { code: 'NOT_FOUND' }
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Resource retrieved',
      data: resource
    });
  } catch (err) {
    next(err);
  }
});

// @route   POST /api/resources/:id/download
// @desc    Track resource download count
router.post('/:id/download', optionalAuth, async (req, res, next) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (resource) {
      resource.downloadsCount = (resource.downloadsCount || 0) + 1;
      await resource.save();
    }
    return res.status(200).json({ success: true });
  } catch (err) {
    next(err);
  }
});

// @route   POST /api/resources
// @desc    Create new learning resource (Admin)
router.post('/', protect, authorize('ADMIN'), async (req, res, next) => {
  try {
    const { title, category, description, fileUrl, externalLink, tags } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Title is required.',
        error: { code: 'VALIDATION_ERROR' }
      });
    }

    const resource = await Resource.create({
      title: title.trim(),
      category: category || 'TECHNICAL',
      description: description || '',
      fileUrl: fileUrl || '',
      externalLink: externalLink || '',
      tags: Array.isArray(tags) ? tags : [],
      isPublished: true,
      downloadsCount: 0
    });

    await logAudit(req, 'CREATE_RESOURCE', 'Resource', resource._id, { title: resource.title });

    return res.status(201).json({
      success: true,
      message: 'Resource created successfully',
      data: resource
    });
  } catch (err) {
    next(err);
  }
});

// @route   PUT /api/resources/:id
// @desc    Update resource
router.put('/:id', protect, authorize('ADMIN'), async (req, res, next) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found.',
        error: { code: 'NOT_FOUND' }
      });
    }

    const updated = await Resource.findByIdAndUpdate(resource._id, req.body, { new: true });
    await logAudit(req, 'UPDATE_RESOURCE', 'Resource', resource._id, { title: updated.title });

    return res.status(200).json({
      success: true,
      message: 'Resource updated successfully',
      data: updated
    });
  } catch (err) {
    next(err);
  }
});

// @route   DELETE /api/resources/:id
// @desc    Delete resource
router.delete('/:id', protect, authorize('ADMIN'), async (req, res, next) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found.',
        error: { code: 'NOT_FOUND' }
      });
    }

    await Resource.findByIdAndDelete(resource._id);
    await logAudit(req, 'DELETE_RESOURCE', 'Resource', resource._id);

    return res.status(200).json({
      success: true,
      message: 'Resource deleted successfully.'
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
