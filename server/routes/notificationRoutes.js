const express = require('express');
const router = express.Router();
const { Notification, Student } = require('../models/modelRegistry');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/notifications/my
// @desc    Get current user notifications
router.get('/my', protect, async (req, res, next) => {
  try {
    let studentId = null;
    if (req.user.role === 'STUDENT') {
      const student = await Student.findOne({ userId: req.user._id });
      if (student) studentId = String(student._id);
    }

    const allNotifications = await Notification.find({});

    const myNotifications = allNotifications.filter(n => {
      // Direct recipient by user ID or student ID
      if (String(n.recipientId) === String(req.user._id) || (studentId && String(n.recipientId) === studentId)) {
        return true;
      }
      // Broadcast to role
      if (n.recipientRole === req.user.role || n.recipientRole === 'ALL') {
        return true;
      }
      return false;
    });

    // Sort by latest first
    myNotifications.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

    const unreadCount = myNotifications.filter(n => !n.isRead).length;

    return res.status(200).json({
      success: true,
      message: 'Notifications retrieved',
      data: {
        notifications: myNotifications,
        unreadCount
      }
    });
  } catch (err) {
    next(err);
  }
});

// @route   PATCH /api/notifications/:id/read
// @desc    Mark a notification as read
router.patch('/:id/read', protect, async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found.',
        error: { code: 'NOT_FOUND' }
      });
    }

    notification.isRead = true;
    await notification.save();

    return res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      data: notification
    });
  } catch (err) {
    next(err);
  }
});

// @route   PATCH /api/notifications/read-all
// @desc    Mark all user notifications as read
router.patch('/read-all', protect, async (req, res, next) => {
  try {
    let studentId = null;
    if (req.user.role === 'STUDENT') {
      const student = await Student.findOne({ userId: req.user._id });
      if (student) studentId = String(student._id);
    }

    const allNotifications = await Notification.find({});

    for (const n of allNotifications) {
      if (
        String(n.recipientId) === String(req.user._id) ||
        (studentId && String(n.recipientId) === studentId) ||
        n.recipientRole === req.user.role ||
        n.recipientRole === 'ALL'
      ) {
        if (!n.isRead) {
          n.isRead = true;
          await n.save();
        }
      }
    }

    return res.status(200).json({
      success: true,
      message: 'All notifications marked as read.'
    });
  } catch (err) {
    next(err);
  }
});

// @route   POST /api/notifications
// @desc    Admin send custom notification
router.post('/', protect, authorize('ADMIN'), async (req, res, next) => {
  try {
    const { recipientId, recipientRole, title, message, type, link } = req.body;

    if (!title || !message) {
      return res.status(400).json({
        success: false,
        message: 'Title and message are required.',
        error: { code: 'VALIDATION_ERROR' }
      });
    }

    const notification = await Notification.create({
      recipientId: recipientId || 'ALL',
      recipientRole: recipientRole || 'ALL',
      title: title.trim(),
      message: message.trim(),
      type: type || 'SYSTEM',
      link: link || '',
      isRead: false
    });

    return res.status(201).json({
      success: true,
      message: 'Notification dispatched successfully',
      data: notification
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
