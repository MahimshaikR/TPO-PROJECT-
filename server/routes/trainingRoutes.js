const express = require('express');
const router = express.Router();
const { Training, TrainingSession, TrainingAttendance, Student } = require('../models/modelRegistry');
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const { logAudit } = require('../middleware/audit');

// @route   GET /api/training
// @desc    Public & student list of training programs
router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const { category, status, search } = req.query;

    const filter = {};
    if (category && category !== 'ALL') filter.category = category;
    if (status && status !== 'ALL') filter.status = status;

    let trainings = await Training.find(filter);

    if (search) {
      const q = search.toLowerCase().trim();
      trainings = trainings.filter(t =>
        t.title.toLowerCase().includes(q) ||
        t.code.toLowerCase().includes(q) ||
        t.instructor.toLowerCase().includes(q) ||
        (t.description && t.description.toLowerCase().includes(q))
      );
    }

    return res.status(200).json({
      success: true,
      message: 'Training programs retrieved',
      data: trainings
    });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/training/:id
// @desc    Get training program details with sessions
router.get('/:id', optionalAuth, async (req, res, next) => {
  try {
    const training = await Training.findById(req.params.id);
    if (!training) {
      return res.status(404).json({
        success: false,
        message: 'Training program not found.',
        error: { code: 'NOT_FOUND' }
      });
    }

    const sessions = await TrainingSession.find({ trainingId: training._id });
    sessions.sort((a, b) => new Date(a.sessionDate) - new Date(b.sessionDate));

    return res.status(200).json({
      success: true,
      message: 'Training program details retrieved',
      data: {
        ...training,
        sessions
      }
    });
  } catch (err) {
    next(err);
  }
});

// @route   POST /api/training
// @desc    Create new training program (Admin)
router.post('/', protect, authorize('ADMIN'), async (req, res, next) => {
  try {
    const {
      title,
      code,
      category,
      description,
      instructor,
      startDate,
      endDate,
      targetBranches,
      targetBatches,
      venue,
      syllabus,
      totalHours
    } = req.body;

    if (!title || !code || !instructor || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Title, unique code, instructor, and start/end dates are required.',
        error: { code: 'VALIDATION_ERROR' }
      });
    }

    const existing = await Training.findOne({ code: code.trim().toUpperCase() });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'Training code already registered.',
        error: { code: 'DUPLICATE_CODE' }
      });
    }

    const training = await Training.create({
      title: title.trim(),
      code: code.trim().toUpperCase(),
      category: category || 'TECHNICAL',
      description: description || '',
      instructor: instructor.trim(),
      startDate,
      endDate,
      targetBranches: Array.isArray(targetBranches) ? targetBranches : ['All'],
      targetBatches: Array.isArray(targetBatches) ? targetBatches : ['2027'],
      venue: venue || 'Auditorium / Lab',
      status: 'ACTIVE',
      syllabus: Array.isArray(syllabus) ? syllabus : [],
      totalHours: Number(totalHours) || 30
    });

    await logAudit(req, 'CREATE_TRAINING', 'Training', training._id, { title: training.title });

    return res.status(201).json({
      success: true,
      message: 'Training program created successfully',
      data: training
    });
  } catch (err) {
    next(err);
  }
});

// @route   PUT /api/training/:id
// @desc    Update training program
router.put('/:id', protect, authorize('ADMIN'), async (req, res, next) => {
  try {
    const training = await Training.findById(req.params.id);
    if (!training) {
      return res.status(404).json({
        success: false,
        message: 'Training not found.',
        error: { code: 'NOT_FOUND' }
      });
    }

    const updated = await Training.findByIdAndUpdate(training._id, req.body, { new: true });
    await logAudit(req, 'UPDATE_TRAINING', 'Training', training._id, { title: updated.title });

    return res.status(200).json({
      success: true,
      message: 'Training program updated',
      data: updated
    });
  } catch (err) {
    next(err);
  }
});

// @route   DELETE /api/training/:id
// @desc    Delete training program
router.delete('/:id', protect, authorize('ADMIN'), async (req, res, next) => {
  try {
    const training = await Training.findById(req.params.id);
    if (!training) {
      return res.status(404).json({
        success: false,
        message: 'Training not found.',
        error: { code: 'NOT_FOUND' }
      });
    }

    await Training.findByIdAndDelete(training._id);
    await TrainingSession.deleteMany({ trainingId: training._id });
    await TrainingAttendance.deleteMany({ trainingId: training._id });

    await logAudit(req, 'DELETE_TRAINING', 'Training', training._id);

    return res.status(200).json({
      success: true,
      message: 'Training program and associated sessions removed.'
    });
  } catch (err) {
    next(err);
  }
});

// @route   POST /api/training/:id/sessions
// @desc    Create a training session
router.post('/:id/sessions', protect, authorize('ADMIN', 'COORDINATOR'), async (req, res, next) => {
  try {
    const training = await Training.findById(req.params.id);
    if (!training) {
      return res.status(404).json({
        success: false,
        message: 'Training not found.',
        error: { code: 'NOT_FOUND' }
      });
    }

    const { title, sessionDate, startTime, endTime, topic, venue } = req.body;
    const session = await TrainingSession.create({
      trainingId: training._id,
      title: title || `Session on ${sessionDate}`,
      sessionDate,
      startTime: startTime || '10:00 AM',
      endTime: endTime || '12:00 PM',
      topic: topic || '',
      venue: venue || training.venue
    });

    return res.status(201).json({
      success: true,
      message: 'Training session created',
      data: session
    });
  } catch (err) {
    next(err);
  }
});

// @route   POST /api/training/sessions/:sessionId/attendance
// @desc    Mark attendance for a training session
router.post('/sessions/:sessionId/attendance', protect, authorize('ADMIN', 'COORDINATOR'), async (req, res, next) => {
  try {
    const { studentId, isPresent } = req.body;
    const session = await TrainingSession.findById(req.params.sessionId);
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found.',
        error: { code: 'NOT_FOUND' }
      });
    }

    let record = await TrainingAttendance.findOne({
      sessionId: session._id,
      studentId
    });

    if (record) {
      record.isPresent = isPresent !== undefined ? isPresent : true;
      record.markedAt = new Date();
      await record.save();
    } else {
      record = await TrainingAttendance.create({
        trainingId: session.trainingId,
        sessionId: session._id,
        studentId,
        isPresent: isPresent !== undefined ? isPresent : true,
        markedAt: new Date()
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Session attendance marked successfully',
      data: record
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
