const express = require('express');
const router = express.Router();
const { Application, Drive, Student, Company, Notification } = require('../models/modelRegistry');
const { protect, authorize } = require('../middleware/auth');
const { logAudit } = require('../middleware/audit');

// @route   POST /api/applications
// @desc    Student applies for a placement drive
router.post('/', protect, authorize('STUDENT'), async (req, res, next) => {
  try {
    const { driveId } = req.body;
    if (!driveId) {
      return res.status(400).json({
        success: false,
        message: 'driveId is required to submit an application.',
        error: { code: 'DRIVE_ID_REQUIRED' }
      });
    }

    const student = await Student.findOne({ userId: req.user._id });
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found. Please complete your academic profile first.',
        error: { code: 'PROFILE_NOT_FOUND' }
      });
    }

    const drive = await Drive.findById(driveId);
    if (!drive) {
      return res.status(404).json({
        success: false,
        message: 'Placement drive not found.',
        error: { code: 'DRIVE_NOT_FOUND' }
      });
    }

    // Check status
    if (drive.status === 'COMPLETED' || drive.status === 'CANCELLED') {
      return res.status(400).json({
        success: false,
        message: `This drive is ${drive.status.toLowerCase()} and no longer accepting applications.`,
        error: { code: 'DRIVE_CLOSED' }
      });
    }

    // Check deadline
    const now = new Date().toISOString().split('T')[0];
    if (drive.deadline && drive.deadline < now) {
      return res.status(400).json({
        success: false,
        message: `Application deadline passed on ${drive.deadline}. Applications are closed.`,
        error: { code: 'DEADLINE_PASSED' }
      });
    }

    // Prevent duplicate application
    const existing = await Application.findOne({
      studentId: student._id,
      driveId: drive._id
    });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'You have already submitted an application for this recruitment drive.',
        error: { code: 'DUPLICATE_APPLICATION' }
      });
    }

    // Validate eligibility rules on backend
    const allowedBranches = drive.eligibility?.branches || [];
    if (allowedBranches.length > 0 && !allowedBranches.includes('All') && !allowedBranches.includes(student.branch)) {
      return res.status(422).json({
        success: false,
        message: `Your branch '${student.branch}' is not eligible for this drive.`,
        error: { code: 'BRANCH_INELIGIBLE' }
      });
    }

    const minCgpa = drive.eligibility?.minCgpa ?? 0;
    if ((student.cgpa || 0) < minCgpa) {
      return res.status(422).json({
        success: false,
        message: `CGPA requirement not satisfied. Minimum required: ${minCgpa}, your CGPA: ${student.cgpa || 0}.`,
        error: { code: 'CGPA_INSUFFICIENT' }
      });
    }

    const maxBacklogs = drive.eligibility?.maxBacklogs ?? 0;
    if ((student.backlogs || 0) > maxBacklogs) {
      return res.status(422).json({
        success: false,
        message: `Active backlogs exceed permissible limit. Maximum allowed: ${maxBacklogs}, active backlogs: ${student.backlogs || 0}.`,
        error: { code: 'BACKLOGS_EXCEEDED' }
      });
    }

    // Create application
    const application = await Application.create({
      studentId: student._id,
      driveId: drive._id,
      companyId: drive.companyId,
      status: 'REGISTERED',
      currentRound: 'Application Submitted / Screening',
      appliedDate: new Date()
    });

    // Notify student
    await Notification.create({
      recipientId: student._id,
      recipientRole: 'STUDENT',
      title: `Application Confirmed: ${drive.title}`,
      message: `Your application for ${drive.jobRole} at ${drive.companyName} has been successfully registered. Keep checking the portal for assessment round notifications.`,
      type: 'DRIVE',
      link: `/student/applications/${application._id}`
    });

    await logAudit(req, 'APPLY_DRIVE', 'Application', application._id, {
      student: student.fullName,
      drive: drive.title
    });

    return res.status(201).json({
      success: true,
      message: 'Application submitted successfully!',
      data: application
    });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/applications/my
// @desc    Get logged in student's applications
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

    const applications = await Application.find({ studentId: student._id });
    const allDrives = await Drive.find({});
    const allCompanies = await Company.find({});

    const enriched = applications.map(app => {
      const drive = allDrives.find(d => String(d._id) === String(app.driveId));
      const company = allCompanies.find(c => String(c._id) === String(app.companyId));
      return {
        ...app,
        drive,
        company
      };
    });

    // Sort by latest applied
    enriched.sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate));

    return res.status(200).json({
      success: true,
      message: 'Student applications retrieved',
      data: enriched
    });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/applications/drive/:driveId
// @desc    Get all applications for a drive (Admin/Coordinator/Recruiter)
router.get('/drive/:driveId', protect, authorize('ADMIN', 'COORDINATOR', 'RECRUITER'), async (req, res, next) => {
  try {
    const applications = await Application.find({ driveId: req.params.driveId });
    const allStudents = await Student.find({});

    const enriched = applications.map(app => {
      const student = allStudents.find(s => String(s._id) === String(app.studentId));
      return {
        ...app,
        student
      };
    });

    return res.status(200).json({
      success: true,
      message: 'Drive applicants retrieved',
      data: enriched
    });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/applications/recruiter
// @desc    Recruiter view applications across their company drives
router.get('/recruiter', protect, authorize('RECRUITER'), async (req, res, next) => {
  try {
    const recruiter = await require('../models/modelRegistry').Recruiter.findOne({ userId: req.user._id });
    let applications = [];

    if (recruiter && recruiter.companyId) {
      applications = await Application.find({ companyId: recruiter.companyId });
    } else {
      applications = await Application.find({});
    }

    const allStudents = await Student.find({});
    const allDrives = await Drive.find({});

    const enriched = applications.map(app => {
      const student = allStudents.find(s => String(s._id) === String(app.studentId));
      const drive = allDrives.find(d => String(d._id) === String(app.driveId));
      return {
        ...app,
        student,
        drive
      };
    });

    return res.status(200).json({
      success: true,
      message: 'Recruiter applicants retrieved',
      data: enriched
    });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/applications
// @desc    Admin & Coordinator view all applications
router.get('/', protect, authorize('ADMIN', 'COORDINATOR'), async (req, res, next) => {
  try {
    const { status, branch, driveId, companyId } = req.query;

    const filter = {};
    if (status && status !== 'ALL') filter.status = status;
    if (driveId && driveId !== 'ALL') filter.driveId = driveId;
    if (companyId && companyId !== 'ALL') filter.companyId = companyId;

    const applications = await Application.find(filter);
    const allStudents = await Student.find({});
    const allDrives = await Drive.find({});
    const allCompanies = await Company.find({});

    let enriched = applications.map(app => {
      const student = allStudents.find(s => String(s._id) === String(app.studentId));
      const drive = allDrives.find(d => String(d._id) === String(app.driveId));
      const company = allCompanies.find(c => String(c._id) === String(app.companyId));
      return {
        ...app,
        student,
        drive,
        company
      };
    });

    if (branch && branch !== 'ALL') {
      enriched = enriched.filter(item => item.student?.branch === branch);
    }

    enriched.sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate));

    return res.status(200).json({
      success: true,
      message: 'All applications retrieved',
      data: enriched
    });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/applications/:id
// @desc    Get single application details
router.get('/:id', protect, async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found.',
        error: { code: 'NOT_FOUND' }
      });
    }

    const student = await Student.findById(application.studentId);
    const drive = await Drive.findById(application.driveId);
    const company = await Company.findById(application.companyId);

    // Authorization: student can only view own application
    if (req.user.role === 'STUDENT' && String(student?.userId) !== String(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access to this application.',
        error: { code: 'FORBIDDEN' }
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Application details retrieved',
      data: {
        ...application,
        student,
        drive,
        company
      }
    });
  } catch (err) {
    next(err);
  }
});

// @route   PATCH /api/applications/:id/status
// @desc    Admin & Recruiter update application status
router.patch('/:id/status', protect, authorize('ADMIN', 'COORDINATOR', 'RECRUITER'), async (req, res, next) => {
  try {
    const { status, currentRound, notes, feedback } = req.body;

    const validStatuses = [
      'REGISTERED',
      'ATTENDED',
      'SHORTLISTED',
      'TEST_QUALIFIED',
      'INTERVIEW',
      'SELECTED',
      'REJECTED',
      'WAITLISTED',
      'OFFER_RECEIVED',
      'JOINED'
    ];

    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status value '${status}'. Allowed values: ${validStatuses.join(', ')}`,
        error: { code: 'INVALID_STATUS' }
      });
    }

    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found.',
        error: { code: 'NOT_FOUND' }
      });
    }

    if (status) application.status = status;
    if (currentRound) application.currentRound = currentRound;
    if (notes !== undefined) application.notes = notes;
    if (feedback !== undefined) application.feedback = feedback;
    await application.save();

    // Notify student about status change
    await Notification.create({
      recipientId: application.studentId,
      recipientRole: 'STUDENT',
      title: `Application Status Updated: ${status}`,
      message: `Your application status has been updated to '${status}'. ${currentRound ? `Current Round: ${currentRound}.` : ''}`,
      type: status === 'SELECTED' ? 'SELECTION' : status === 'INTERVIEW' ? 'INTERVIEW' : 'DRIVE',
      link: `/student/applications/${application._id}`
    });

    await logAudit(req, 'UPDATE_APPLICATION_STATUS', 'Application', application._id, { status, currentRound });

    return res.status(200).json({
      success: true,
      message: `Application status updated to ${status}`,
      data: application
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
