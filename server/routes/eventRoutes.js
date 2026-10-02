const express = require('express');
const router = express.Router();
const { Event } = require('../models/modelRegistry');
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const { logAudit } = require('../middleware/audit');

// @route   GET /api/events
// @desc    Get all public events
router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const { category, search } = req.query;
    const filter = {};
    if (category && category !== 'ALL') filter.category = category;

    let events = await Event.find(filter);
    events = events.filter(e => e.isPublic !== false);

    if (search) {
      const q = search.toLowerCase().trim();
      events = events.filter(e =>
        e.title.toLowerCase().includes(q) ||
        (e.speakerOrGuest && e.speakerOrGuest.toLowerCase().includes(q)) ||
        (e.organization && e.organization.toLowerCase().includes(q)) ||
        (e.description && e.description.toLowerCase().includes(q))
      );
    }

    events.sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));

    return res.status(200).json({
      success: true,
      message: 'Events retrieved',
      data: events
    });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/events/:id
// @desc    Get event detail
router.get('/:id', optionalAuth, async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found.',
        error: { code: 'NOT_FOUND' }
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Event details retrieved',
      data: event
    });
  } catch (err) {
    next(err);
  }
});

// @route   POST /api/events
// @desc    Create new event (Admin)
router.post('/', protect, authorize('ADMIN'), async (req, res, next) => {
  try {
    const { title, category, speakerOrGuest, organization, eventDate, time, venue, description, bannerImage, registrationLink } = req.body;

    if (!title || !eventDate) {
      return res.status(400).json({
        success: false,
        message: 'Event title and date are required.',
        error: { code: 'VALIDATION_ERROR' }
      });
    }

    const event = await Event.create({
      title: title.trim(),
      category: category || 'WORKSHOP',
      speakerOrGuest: speakerOrGuest || '',
      organization: organization || '',
      eventDate,
      time: time || '10:00 AM',
      venue: venue || 'Auditorium',
      description: description || '',
      bannerImage: bannerImage || '',
      registrationLink: registrationLink || '',
      isPublic: true
    });

    await logAudit(req, 'CREATE_EVENT', 'Event', event._id, { title: event.title });

    return res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: event
    });
  } catch (err) {
    next(err);
  }
});

// @route   PUT /api/events/:id
// @desc    Update event
router.put('/:id', protect, authorize('ADMIN'), async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found.',
        error: { code: 'NOT_FOUND' }
      });
    }

    const updated = await Event.findByIdAndUpdate(event._id, req.body, { new: true });
    await logAudit(req, 'UPDATE_EVENT', 'Event', event._id, { title: updated.title });

    return res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      data: updated
    });
  } catch (err) {
    next(err);
  }
});

// @route   DELETE /api/events/:id
// @desc    Delete event
router.delete('/:id', protect, authorize('ADMIN'), async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found.',
        error: { code: 'NOT_FOUND' }
      });
    }

    await Event.findByIdAndDelete(event._id);
    await logAudit(req, 'DELETE_EVENT', 'Event', event._id);

    return res.status(200).json({
      success: true,
      message: 'Event deleted successfully.'
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
