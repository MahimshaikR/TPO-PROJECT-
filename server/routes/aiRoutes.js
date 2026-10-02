const express = require('express');
const router = express.Router();
const { Student, Drive } = require('../models/modelRegistry');
const { protect, optionalAuth } = require('../middleware/auth');
const { analyzeResumeSkills, calculateJobMatch, generateInterviewQuestions } = require('../utils/aiHelper');

// @route   POST /api/ai/resume-analyze
// @desc    Analyze student resume completeness and ATS score
router.post('/resume-analyze', protect, async (req, res, next) => {
  try {
    let student = null;
    if (req.user.role === 'STUDENT') {
      student = await Student.findOne({ userId: req.user._id });
    } else if (req.body.studentId) {
      student = await Student.findById(req.body.studentId);
    }

    const studentData = student || req.body;
    const analysis = analyzeResumeSkills(studentData);

    return res.status(200).json({
      success: true,
      message: 'AI Resume Analysis completed',
      data: analysis
    });
  } catch (err) {
    next(err);
  }
});

// @route   POST /api/ai/job-match
// @desc    Calculate AI match score between student and a drive
router.post('/job-match', protect, async (req, res, next) => {
  try {
    const { driveId, studentId } = req.body;
    let student = null;

    if (req.user.role === 'STUDENT') {
      student = await Student.findOne({ userId: req.user._id });
    } else if (studentId) {
      student = await Student.findById(studentId);
    }

    const drive = await Drive.findById(driveId);

    if (!student || !drive) {
      return res.status(400).json({
        success: false,
        message: 'Valid student and drive are required for matching calculation.',
        error: { code: 'INVALID_INPUT' }
      });
    }

    const match = calculateJobMatch(student, drive);

    return res.status(200).json({
      success: true,
      message: 'AI Job Match computed',
      data: {
        driveTitle: drive.title,
        companyName: drive.companyName,
        packageLpa: drive.packageLpa,
        ...match
      }
    });
  } catch (err) {
    next(err);
  }
});

// @route   POST /api/ai/interview-prep
// @desc    Generate AI interview questions based on job role
router.post('/interview-prep', optionalAuth, async (req, res, next) => {
  try {
    const { role = 'Software Engineer', company = 'Technology Partner' } = req.body;
    const questions = generateInterviewQuestions(role, company);

    return res.status(200).json({
      success: true,
      message: 'Interview preparation questions generated',
      data: questions
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
