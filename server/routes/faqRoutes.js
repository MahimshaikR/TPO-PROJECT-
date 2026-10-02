const express = require('express');
const router = express.Router();
const { FAQ } = require('../models/modelRegistry');
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const { logAudit } = require('../middleware/audit');

// @route   GET /api/faq
// @desc    Get all published FAQs
router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const { category } = req.query;
    const filter = { isPublished: true };
    if (category && category !== 'ALL') filter.category = category;

    const faqs = await FAQ.find(filter);
    faqs.sort((a, b) => (a.order || 0) - (b.order || 0));

    return res.status(200).json({
      success: true,
      message: 'FAQs retrieved',
      data: faqs
    });
  } catch (err) {
    next(err);
  }
});

// @route   POST /api/faq
// @desc    Create new FAQ (Admin)
router.post('/', protect, authorize('ADMIN'), async (req, res, next) => {
  try {
    const { question, answer, category, order, isPublished } = req.body;

    if (!question || !answer) {
      return res.status(400).json({
        success: false,
        message: 'Question and answer are required.',
        error: { code: 'VALIDATION_ERROR' }
      });
    }

    const faq = await FAQ.create({
      question: question.trim(),
      answer: answer.trim(),
      category: category || 'GENERAL',
      order: Number(order) || 0,
      isPublished: isPublished !== undefined ? isPublished : true
    });

    await logAudit(req, 'CREATE_FAQ', 'FAQ', faq._id);

    return res.status(201).json({
      success: true,
      message: 'FAQ created successfully',
      data: faq
    });
  } catch (err) {
    next(err);
  }
});

// @route   PUT /api/faq/:id
// @desc    Update FAQ
router.put('/:id', protect, authorize('ADMIN'), async (req, res, next) => {
  try {
    const faq = await FAQ.findById(req.params.id);
    if (!faq) {
      return res.status(404).json({
        success: false,
        message: 'FAQ not found.',
        error: { code: 'NOT_FOUND' }
      });
    }

    const updated = await FAQ.findByIdAndUpdate(faq._id, req.body, { new: true });
    await logAudit(req, 'UPDATE_FAQ', 'FAQ', faq._id);

    return res.status(200).json({
      success: true,
      message: 'FAQ updated successfully',
      data: updated
    });
  } catch (err) {
    next(err);
  }
});

// @route   DELETE /api/faq/:id
// @desc    Delete FAQ
router.delete('/:id', protect, authorize('ADMIN'), async (req, res, next) => {
  try {
    const faq = await FAQ.findById(req.params.id);
    if (!faq) {
      return res.status(404).json({
        success: false,
        message: 'FAQ not found.',
        error: { code: 'NOT_FOUND' }
      });
    }

    await FAQ.findByIdAndDelete(faq._id);
    await logAudit(req, 'DELETE_FAQ', 'FAQ', faq._id);

    return res.status(200).json({
      success: true,
      message: 'FAQ deleted successfully.'
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
