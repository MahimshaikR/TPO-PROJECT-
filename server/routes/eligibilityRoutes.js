const express = require('express');
const router = express.Router();
const { Drive, Student } = require('../models/modelRegistry');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/eligibility/:driveId
// @desc    Evaluate logged-in student's eligibility for a specific drive
router.get('/:driveId', protect, authorize('STUDENT'), async (req, res, next) => {
  try {
    const drive = await Drive.findById(req.params.driveId);
    if (!drive) {
      return res.status(404).json({
        success: false,
        message: 'Placement drive not found.',
        error: { code: 'NOT_FOUND' }
      });
    }

    const student = await Student.findOne({ userId: req.user._id });
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found. Please complete profile registration first.',
        error: { code: 'STUDENT_NOT_FOUND' }
      });
    }

    const reasons = [];
    let isEligible = true;

    // 1. Branch check
    const allowedBranches = drive.eligibility?.branches || [];
    if (allowedBranches.length > 0 && !allowedBranches.includes('All') && !allowedBranches.includes(student.branch)) {
      isEligible = false;
      reasons.push(`Branch '${student.branch}' is not eligible for this drive. Permitted branches: ${allowedBranches.join(', ')}.`);
    }

    // 2. Batch check
    const allowedBatches = drive.eligibility?.batch || [];
    if (allowedBatches.length > 0 && !allowedBatches.includes('All') && !allowedBatches.includes(student.batch)) {
      isEligible = false;
      reasons.push(`Graduation batch '${student.batch}' does not match drive requirement (${allowedBatches.join(', ')}).`);
    }

    // 3. CGPA check
    const minCgpa = drive.eligibility?.minCgpa ?? 0;
    if ((student.cgpa || 0) < minCgpa) {
      isEligible = false;
      reasons.push(`CGPA requirement not satisfied. Minimum required: ${minCgpa}, your current CGPA: ${student.cgpa || 0}.`);
    }

    // 4. Backlog check
    const maxBacklogs = drive.eligibility?.maxBacklogs ?? 0;
    if ((student.backlogs || 0) > maxBacklogs) {
      isEligible = false;
      reasons.push(`Active backlogs exceed permissible limit. Maximum allowed: ${maxBacklogs}, your active backlogs: ${student.backlogs || 0}.`);
    }

    // 5. Gender preference
    const genderPref = drive.eligibility?.genderPreference;
    if (genderPref && genderPref !== 'All' && student.gender && student.gender !== genderPref) {
      isEligible = false;
      reasons.push(`Gender preference criteria not matched for this drive (${genderPref}).`);
    }

    return res.status(200).json({
      success: true,
      message: isEligible ? 'You are eligible for this recruitment drive!' : 'Not eligible for this drive.',
      data: {
        isEligible,
        reasons: reasons.length > 0 ? reasons : ['All academic and eligibility prerequisites are satisfied.'],
        criteria: drive.eligibility,
        studentData: {
          rollNumber: student.rollNumber,
          branch: student.branch,
          batch: student.batch,
          cgpa: student.cgpa,
          backlogs: student.backlogs,
          placementStatus: student.placementStatus
        }
      }
    });
  } catch (err) {
    next(err);
  }
});

// @route   POST /api/eligibility/check
// @desc    Generic eligibility calculator test for administration
router.post('/check', protect, authorize('ADMIN', 'COORDINATOR'), async (req, res, next) => {
  try {
    const { studentId, driveId } = req.body;
    const student = await Student.findById(studentId);
    const drive = await Drive.findById(driveId);

    if (!student || !drive) {
      return res.status(400).json({
        success: false,
        message: 'Both studentId and driveId must be valid identifiers.',
        error: { code: 'INVALID_INPUT' }
      });
    }

    const reasons = [];
    let isEligible = true;

    const allowedBranches = drive.eligibility?.branches || [];
    if (allowedBranches.length > 0 && !allowedBranches.includes('All') && !allowedBranches.includes(student.branch)) {
      isEligible = false;
      reasons.push(`Branch mismatch: ${student.branch} not in [${allowedBranches.join(', ')}]`);
    }

    const minCgpa = drive.eligibility?.minCgpa ?? 0;
    if ((student.cgpa || 0) < minCgpa) {
      isEligible = false;
      reasons.push(`CGPA: ${student.cgpa} < min required ${minCgpa}`);
    }

    const maxBacklogs = drive.eligibility?.maxBacklogs ?? 0;
    if ((student.backlogs || 0) > maxBacklogs) {
      isEligible = false;
      reasons.push(`Backlogs: ${student.backlogs} > max allowed ${maxBacklogs}`);
    }

    return res.status(200).json({
      success: true,
      message: 'Eligibility evaluation calculated',
      data: {
        isEligible,
        reasons: reasons.length > 0 ? reasons : ['Eligible'],
        student: { rollNumber: student.rollNumber, name: student.fullName },
        drive: { title: drive.title, company: drive.companyName }
      }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
