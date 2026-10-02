const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { Student, User, TrainingAttendance, TrainingSession, Training } = require('../models/modelRegistry');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { logAudit } = require('../middleware/audit');

// @route   GET /api/students/me
// @desc    Get logged in student profile
router.get('/me', protect, authorize('STUDENT'), async (req, res, next) => {
  try {
    let student = await Student.findOne({ userId: req.user._id });
    if (!student) {
      // Create minimal default profile if not exists
      student = await Student.create({
        userId: req.user._id,
        rollNumber: `STU${Date.now().toString().slice(-5)}`,
        fullName: req.user.name,
        email: req.user.email,
        branch: 'CSE',
        batch: '2027',
        cgpa: 0,
        backlogs: 0,
        placementStatus: 'REGISTERED'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Student profile retrieved',
      data: student
    });
  } catch (err) {
    next(err);
  }
});

// @route   PUT /api/students/me
// @desc    Update logged in student profile
router.put('/me', protect, authorize('STUDENT'), async (req, res, next) => {
  try {
    const student = await Student.findOne({ userId: req.user._id });
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student record not found.',
        error: { code: 'NOT_FOUND' }
      });
    }

    const {
      fullName,
      phone,
      gender,
      dob,
      address,
      tenthPercentage,
      twelfthPercentage,
      skills,
      certifications,
      projects,
      internships,
      preferences,
      linkedinUrl,
      githubUrl,
      portfolioUrl
    } = req.body;

    const allowedUpdates = {
      fullName: fullName || student.fullName,
      phone: phone !== undefined ? phone : student.phone,
      gender: gender || student.gender,
      dob: dob !== undefined ? dob : student.dob,
      address: address !== undefined ? address : student.address,
      tenthPercentage: tenthPercentage !== undefined ? Number(tenthPercentage) : student.tenthPercentage,
      twelfthPercentage: twelfthPercentage !== undefined ? Number(twelfthPercentage) : student.twelfthPercentage,
      skills: Array.isArray(skills) ? skills : student.skills,
      certifications: Array.isArray(certifications) ? certifications : student.certifications,
      projects: Array.isArray(projects) ? projects : student.projects,
      internships: Array.isArray(internships) ? internships : student.internships,
      preferences: preferences || student.preferences,
      linkedinUrl: linkedinUrl !== undefined ? linkedinUrl : student.linkedinUrl,
      githubUrl: githubUrl !== undefined ? githubUrl : student.githubUrl,
      portfolioUrl: portfolioUrl !== undefined ? portfolioUrl : student.portfolioUrl
    };

    const updated = await Student.findByIdAndUpdate(student._id, allowedUpdates, { new: true });

    // Also sync user name if updated
    if (fullName && fullName !== req.user.name) {
      await User.findByIdAndUpdate(req.user._id, { name: fullName });
    }

    await logAudit(req, 'STUDENT_UPDATE_PROFILE', 'Student', student._id, { rollNumber: student.rollNumber });

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updated
    });
  } catch (err) {
    next(err);
  }
});

// @route   POST /api/students/me/resume
// @desc    Upload student resume
router.post('/me/resume', protect, authorize('STUDENT'), upload.single('resume'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No resume file uploaded.',
        error: { code: 'FILE_REQUIRED' }
      });
    }

    const student = await Student.findOne({ userId: req.user._id });
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student record not found.',
        error: { code: 'NOT_FOUND' }
      });
    }

    // Clean up old file if exists and local
    if (student.resumeUrl && student.resumeUrl.startsWith('/uploads/resumes/')) {
      const oldPath = path.join(__dirname, '..', '..', student.resumeUrl);
      if (fs.existsSync(oldPath)) {
        try { fs.unlinkSync(oldPath); } catch (e) { /* ignore */ }
      }
    }

    const relativeUrl = `/uploads/resumes/${req.file.filename}`;
    student.resumeUrl = relativeUrl;
    student.resumeOriginalName = req.file.originalname;
    student.resumeUpdatedAt = new Date();
    await student.save();

    await logAudit(req, 'STUDENT_UPLOAD_RESUME', 'Student', student._id, { filename: req.file.originalname });

    return res.status(200).json({
      success: true,
      message: 'Resume uploaded successfully',
      data: {
        resumeUrl: relativeUrl,
        resumeOriginalName: req.file.originalname,
        resumeUpdatedAt: student.resumeUpdatedAt
      }
    });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/students/me/resume
// @desc    Get or download resume
router.get('/me/resume', protect, async (req, res, next) => {
  try {
    let studentId = req.query.studentId;
    let student;

    if (studentId && ['ADMIN', 'TP_OFFICER', 'COORDINATOR', 'RECRUITER'].includes(req.user.role)) {
      student = await Student.findById(studentId);
    } else {
      student = await Student.findOne({ userId: req.user._id });
    }

    if (!student || !student.resumeUrl) {
      return res.status(404).json({
        success: false,
        message: 'No resume on file for this student.',
        error: { code: 'RESUME_NOT_FOUND' }
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Resume metadata retrieved',
      data: {
        resumeUrl: student.resumeUrl,
        resumeOriginalName: student.resumeOriginalName || 'Resume.pdf',
        resumeUpdatedAt: student.resumeUpdatedAt
      }
    });
  } catch (err) {
    next(err);
  }
});

// @route   DELETE /api/students/me/resume
// @desc    Delete student resume
router.delete('/me/resume', protect, authorize('STUDENT'), async (req, res, next) => {
  try {
    const student = await Student.findOne({ userId: req.user._id });
    if (!student || !student.resumeUrl) {
      return res.status(400).json({
        success: false,
        message: 'No resume found to delete.',
        error: { code: 'RESUME_NOT_FOUND' }
      });
    }

    if (student.resumeUrl.startsWith('/uploads/resumes/')) {
      const filePath = path.join(__dirname, '..', '..', student.resumeUrl);
      if (fs.existsSync(filePath)) {
        try { fs.unlinkSync(filePath); } catch (e) { /* ignore */ }
      }
    }

    student.resumeUrl = '';
    student.resumeOriginalName = '';
    student.resumeUpdatedAt = null;
    await student.save();

    await logAudit(req, 'STUDENT_DELETE_RESUME', 'Student', student._id);

    return res.status(200).json({
      success: true,
      message: 'Resume removed successfully.'
    });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/students/me/training-attendance
// @desc    Calculate and return student's training attendance dynamically
router.get('/me/training-attendance', protect, authorize('STUDENT'), async (req, res, next) => {
  try {
    const student = await Student.findOne({ userId: req.user._id });
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student record not found.',
        error: { code: 'NOT_FOUND' }
      });
    }

    const allSessions = await TrainingSession.find({});
    const attendedRecords = await TrainingAttendance.find({
      studentId: student._id,
      isPresent: true
    });

    const totalSessions = allSessions.length;
    const attendedSessions = attendedRecords.length;
    const attendancePercentage = totalSessions > 0
      ? Number(((attendedSessions / totalSessions) * 100).toFixed(1))
      : 100;

    return res.status(200).json({
      success: true,
      message: 'Training attendance computed',
      data: {
        totalSessions,
        attendedSessions,
        attendancePercentage,
        isEligibleByAttendance: attendancePercentage >= 80,
        records: attendedRecords
      }
    });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/students
// @desc    List all students (Admin/Coordinator/Recruiter) with filters & search
router.get('/', protect, authorize('ADMIN', 'COORDINATOR', 'RECRUITER'), async (req, res, next) => {
  try {
    const { branch, batch, academicYear, placementStatus, minCgpa, maxBacklogs, search, page = 1, limit = 50 } = req.query;

    const filter = {};

    if (branch && branch !== 'ALL') filter.branch = branch;
    if (batch && batch !== 'ALL') filter.batch = batch;
    if (academicYear && academicYear !== 'ALL') filter.academicYear = academicYear;
    if (placementStatus && placementStatus !== 'ALL') filter.placementStatus = placementStatus;
    if (minCgpa) filter.cgpa = { $gte: Number(minCgpa) };
    if (maxBacklogs !== undefined && maxBacklogs !== '') filter.backlogs = { $lte: Number(maxBacklogs) };

    let students = await Student.find(filter);

    if (search) {
      const q = search.toLowerCase().trim();
      students = students.filter(s =>
        (s.fullName && s.fullName.toLowerCase().includes(q)) ||
        (s.rollNumber && s.rollNumber.toLowerCase().includes(q)) ||
        (s.email && s.email.toLowerCase().includes(q)) ||
        (s.skills && s.skills.some(skill => skill.toLowerCase().includes(q)))
      );
    }

    const total = students.length;
    const startIndex = (Number(page) - 1) * Number(limit);
    const paginated = students.slice(startIndex, startIndex + Number(limit));

    return res.status(200).json({
      success: true,
      message: 'Students list retrieved',
      data: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
        students: paginated
      }
    });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/students/:id
// @desc    Get single student profile
router.get('/:id', protect, async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found.',
        error: { code: 'NOT_FOUND' }
      });
    }

    // Authorization: student can only view own profile unless admin/coordinator/recruiter
    if (req.user.role === 'STUDENT' && String(student.userId) !== String(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You cannot view other students’ private profiles.',
        error: { code: 'FORBIDDEN' }
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Student retrieved',
      data: student
    });
  } catch (err) {
    next(err);
  }
});

// @route   PUT /api/students/:id
// @desc    Admin update student details (CGPA, backlogs, status, branch)
router.put('/:id', protect, authorize('ADMIN', 'COORDINATOR'), async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found.',
        error: { code: 'NOT_FOUND' }
      });
    }

    const updated = await Student.findByIdAndUpdate(student._id, req.body, { new: true });

    await logAudit(req, 'ADMIN_UPDATE_STUDENT', 'Student', student._id, {
      rollNumber: student.rollNumber,
      updatedFields: Object.keys(req.body)
    });

    return res.status(200).json({
      success: true,
      message: 'Student record successfully updated',
      data: updated
    });
  } catch (err) {
    next(err);
  }
});

// @route   DELETE /api/students/:id
// @desc    Admin delete student
router.delete('/:id', protect, authorize('ADMIN'), async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found.',
        error: { code: 'NOT_FOUND' }
      });
    }

    // Also delete linked user
    if (student.userId) {
      await User.findByIdAndDelete(student.userId);
    }
    await Student.findByIdAndDelete(student._id);

    await logAudit(req, 'ADMIN_DELETE_STUDENT', 'Student', student._id, { rollNumber: student.rollNumber });

    return res.status(200).json({
      success: true,
      message: 'Student and linked login account removed successfully.'
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
