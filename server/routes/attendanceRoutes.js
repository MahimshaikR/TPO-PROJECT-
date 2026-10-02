const express = require('express');
const router = express.Router();
const { Attendance, Student, Drive } = require('../models/modelRegistry');
const { protect, authorize } = require('../middleware/auth');
const { logAudit } = require('../middleware/audit');

// @route   POST /api/attendance
// @desc    Mark attendance for a recruitment drive round
router.post('/', protect, authorize('ADMIN', 'COORDINATOR'), async (req, res, next) => {
  try {
    const { driveId, roundName, studentId, isPresent } = req.body;

    if (!driveId || !roundName || !studentId) {
      return res.status(400).json({
        success: false,
        message: 'driveId, roundName, and studentId are required.',
        error: { code: 'VALIDATION_ERROR' }
      });
    }

    let record = await Attendance.findOne({ driveId, roundName, studentId });
    if (record) {
      record.isPresent = isPresent !== undefined ? isPresent : true;
      record.markedAt = new Date();
      record.markedBy = req.user._id;
      await record.save();
    } else {
      record = await Attendance.create({
        driveId,
        roundName,
        studentId,
        isPresent: isPresent !== undefined ? isPresent : true,
        markedAt: new Date(),
        markedBy: req.user._id
      });
    }

    await logAudit(req, 'MARK_ATTENDANCE', 'Attendance', record._id, { driveId, roundName, isPresent });

    return res.status(200).json({
      success: true,
      message: 'Attendance marked successfully',
      data: record
    });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/attendance/drive/:driveId
// @desc    Get all attendance records for a drive
router.get('/drive/:driveId', protect, authorize('ADMIN', 'COORDINATOR', 'RECRUITER'), async (req, res, next) => {
  try {
    const records = await Attendance.find({ driveId: req.params.driveId });
    const allStudents = await Student.find({});

    const enriched = records.map(rec => {
      const student = allStudents.find(s => String(s._id) === String(rec.studentId));
      return {
        ...rec,
        student
      };
    });

    return res.status(200).json({
      success: true,
      message: 'Drive attendance records retrieved',
      data: enriched
    });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/attendance/student/:studentId
// @desc    Get attendance history for a student
router.get('/student/:studentId', protect, async (req, res, next) => {
  try {
    const records = await Attendance.find({ studentId: req.params.studentId });
    const allDrives = await Drive.find({});

    const enriched = records.map(rec => {
      const drive = allDrives.find(d => String(d._id) === String(rec.driveId));
      return {
        ...rec,
        drive
      };
    });

    return res.status(200).json({
      success: true,
      message: 'Student attendance records retrieved',
      data: enriched
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
