const express = require('express');
const router = express.Router();
const { Interview, Application, Student, Drive, Company, Notification } = require('../models/modelRegistry');
const { protect, authorize } = require('../middleware/auth');
const { logAudit } = require('../middleware/audit');

// @route   POST /api/interviews
// @desc    Schedule interview round for an applicant
router.post('/', protect, authorize('ADMIN', 'COORDINATOR', 'RECRUITER'), async (req, res, next) => {
  try {
    const {
      driveId,
      applicationId,
      studentId,
      companyId,
      roundName,
      roundNumber,
      scheduledAt,
      mode,
      venueOrLink,
      interviewer
    } = req.body;

    if (!applicationId || !scheduledAt || !roundName) {
      return res.status(400).json({
        success: false,
        message: 'applicationId, roundName, and scheduledAt are required.',
        error: { code: 'VALIDATION_ERROR' }
      });
    }

    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found.',
        error: { code: 'NOT_FOUND' }
      });
    }

    const drive = await Drive.findById(driveId || application.driveId);
    const company = await Company.findById(companyId || application.companyId);
    const student = await Student.findById(studentId || application.studentId);

    const interview = await Interview.create({
      driveId: drive._id,
      applicationId: application._id,
      studentId: student._id,
      companyId: company._id,
      roundName: roundName.trim(),
      roundNumber: Number(roundNumber) || 1,
      scheduledAt,
      mode: mode || 'ONLINE',
      venueOrLink: venueOrLink || 'Google Meet / Campus Room 204',
      status: 'SCHEDULED',
      interviewer: interviewer || 'Technical Panel'
    });

    // Update application status to INTERVIEW
    application.status = 'INTERVIEW';
    application.currentRound = roundName;
    await application.save();

    // Send high-priority notification to student
    await Notification.create({
      recipientId: student._id,
      recipientRole: 'STUDENT',
      title: `Interview Scheduled: ${drive.companyName}`,
      message: `Your ${roundName} for ${drive.jobRole} is scheduled on ${scheduledAt}. Mode: ${mode || 'ONLINE'}. Join link/venue: ${venueOrLink}.`,
      type: 'INTERVIEW',
      link: '/student/interviews'
    });

    await logAudit(req, 'SCHEDULE_INTERVIEW', 'Interview', interview._id, {
      student: student.fullName,
      drive: drive.title,
      scheduledAt
    });

    return res.status(201).json({
      success: true,
      message: 'Interview successfully scheduled and notified to candidate.',
      data: interview
    });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/interviews/my
// @desc    Get logged in student's scheduled interviews
router.get('/my', protect, authorize('STUDENT'), async (req, res, next) => {
  try {
    const student = await Student.findOne({ userId: req.user._id });
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student record not found.',
        error: { code: 'NOT_FOUND' }
      });
    }

    const interviews = await Interview.find({ studentId: student._id });
    const allDrives = await Drive.find({});
    const allCompanies = await Company.find({});

    const enriched = interviews.map(int => {
      const drive = allDrives.find(d => String(d._id) === String(int.driveId));
      const company = allCompanies.find(c => String(c._id) === String(int.companyId));
      return {
        ...int,
        drive,
        company
      };
    });

    enriched.sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt));

    return res.status(200).json({
      success: true,
      message: 'Student interviews retrieved',
      data: enriched
    });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/interviews/recruiter
// @desc    Get interviews scheduled by recruiter's company
router.get('/recruiter', protect, authorize('RECRUITER'), async (req, res, next) => {
  try {
    const recruiter = await require('../models/modelRegistry').Recruiter.findOne({ userId: req.user._id });
    let interviews = [];

    if (recruiter && recruiter.companyId) {
      interviews = await Interview.find({ companyId: recruiter.companyId });
    } else {
      interviews = await Interview.find({});
    }

    const allStudents = await Student.find({});
    const allDrives = await Drive.find({});

    const enriched = interviews.map(int => {
      const student = allStudents.find(s => String(s._id) === String(int.studentId));
      const drive = allDrives.find(d => String(d._id) === String(int.driveId));
      return {
        ...int,
        student,
        drive
      };
    });

    return res.status(200).json({
      success: true,
      message: 'Recruiter interviews retrieved',
      data: enriched
    });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/interviews
// @desc    Admin & Coordinator list all scheduled interviews
router.get('/', protect, authorize('ADMIN', 'COORDINATOR'), async (req, res, next) => {
  try {
    const interviews = await Interview.find({});
    const allStudents = await Student.find({});
    const allDrives = await Drive.find({});
    const allCompanies = await Company.find({});

    const enriched = interviews.map(int => {
      const student = allStudents.find(s => String(s._id) === String(int.studentId));
      const drive = allDrives.find(d => String(d._id) === String(int.driveId));
      const company = allCompanies.find(c => String(c._id) === String(int.companyId));
      return {
        ...int,
        student,
        drive,
        company
      };
    });

    return res.status(200).json({
      success: true,
      message: 'All interviews retrieved',
      data: enriched
    });
  } catch (err) {
    next(err);
  }
});

// @route   PATCH /api/interviews/:id
// @desc    Update interview details, status, or feedback
router.patch('/:id', protect, authorize('ADMIN', 'COORDINATOR', 'RECRUITER'), async (req, res, next) => {
  try {
    const interview = await Interview.findById(req.params.id);
    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found.',
        error: { code: 'NOT_FOUND' }
      });
    }

    const updated = await Interview.findByIdAndUpdate(interview._id, req.body, { new: true });
    await logAudit(req, 'UPDATE_INTERVIEW', 'Interview', interview._id, { status: updated.status });

    return res.status(200).json({
      success: true,
      message: 'Interview updated successfully',
      data: updated
    });
  } catch (err) {
    next(err);
  }
});

// @route   DELETE /api/interviews/:id
// @desc    Cancel/delete interview
router.delete('/:id', protect, authorize('ADMIN', 'COORDINATOR', 'RECRUITER'), async (req, res, next) => {
  try {
    const interview = await Interview.findById(req.params.id);
    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found.',
        error: { code: 'NOT_FOUND' }
      });
    }

    await Interview.findByIdAndDelete(interview._id);
    await logAudit(req, 'CANCEL_INTERVIEW', 'Interview', interview._id);

    return res.status(200).json({
      success: true,
      message: 'Interview cancelled successfully.'
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
