const express = require('express');
const router = express.Router();
const { Selection, Application, Student, Drive, Company, Notification } = require('../models/modelRegistry');
const { protect, authorize } = require('../middleware/auth');
const { logAudit } = require('../middleware/audit');

// @route   POST /api/selections
// @desc    Record student job offer/selection (Admin/Recruiter)
router.post('/', protect, authorize('ADMIN', 'COORDINATOR', 'RECRUITER'), async (req, res, next) => {
  try {
    const {
      driveId,
      applicationId,
      studentId,
      companyId,
      packageLpa,
      designation,
      offerLetterUrl,
      selectionDate,
      academicYear
    } = req.body;

    if (!studentId || !packageLpa || !designation) {
      return res.status(400).json({
        success: false,
        message: 'studentId, packageLpa, and designation are mandatory.',
        error: { code: 'VALIDATION_ERROR' }
      });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student record not found.',
        error: { code: 'STUDENT_NOT_FOUND' }
      });
    }

    let drive = null;
    if (driveId) drive = await Drive.findById(driveId);

    let company = null;
    const resolvedCompanyId = companyId || drive?.companyId;
    if (resolvedCompanyId) {
      company = await Company.findById(resolvedCompanyId);
    }

    const finalDriveId = drive?._id || 'direct_placement';
    const finalCompanyId = company?._id || 'partner_enterprise';
    const finalCompanyName = company?.name || drive?.companyName || 'Corporate Partner';

    const selection = await Selection.create({
      driveId: finalDriveId,
      applicationId: applicationId || 'direct',
      studentId: student._id,
      companyId: finalCompanyId,
      packageLpa: Number(packageLpa),
      designation: designation.trim(),
      offerLetterUrl: offerLetterUrl || '',
      selectionDate: selectionDate || new Date().toISOString().split('T')[0],
      status: 'OFFERED',
      academicYear: academicYear || student.academicYear || '2026-27'
    });

    // Automatically update student's placement status and highest offer
    student.placementStatus = 'PLACED';
    student.placedCompany = finalCompanyName;
    student.placedPackage = Math.max(student.placedPackage || 0, Number(packageLpa));
    student.offerLetters = student.offerLetters || [];
    student.offerLetters.push({
      company: finalCompanyName,
      packageLpa: Number(packageLpa),
      designation: designation.trim(),
      issueDate: selectionDate || new Date().toISOString().split('T')[0],
      fileUrl: offerLetterUrl || ''
    });
    await student.save();

    // If linked to an application, update application status
    if (applicationId && applicationId !== 'direct') {
      const application = await Application.findById(applicationId);
      if (application) {
        application.status = 'SELECTED';
        application.currentRound = 'Offered / Selected';
        await application.save();
      }
    }

    // Automatically recalculate Company statistics
    if (company) {
      const companySelections = await Selection.find({ companyId: company._id });
      const packages = companySelections.map(s => Number(s.packageLpa) || 0).filter(p => p > 0);
      company.totalOffersCount = companySelections.length;
      if (packages.length > 0) {
        company.highestPackageOffered = Math.max(...packages);
        company.averagePackageOffered = Number((packages.reduce((a, b) => a + b, 0) / packages.length).toFixed(1));
      }
      await company.save();
    }

    // Send congratulatory notification to student
    await Notification.create({
      recipientId: student._id,
      recipientRole: 'STUDENT',
      title: `Congratulations! Job Offer from ${finalCompanyName}`,
      message: `You have been officially selected for ${designation} at ${finalCompanyName} with an annual package of ${packageLpa} LPA!`,
      type: 'SELECTION',
      link: '/student/selection'
    });

    await logAudit(req, 'RECORD_SELECTION', 'Selection', selection._id, {
      student: student.fullName,
      company: finalCompanyName,
      packageLpa
    });

    return res.status(201).json({
      success: true,
      message: 'Student selection and offer successfully registered!',
      data: selection
    });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/selections/my
// @desc    Get logged in student's selections and offer letters
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

    const selections = await Selection.find({ studentId: student._id });
    const allCompanies = await Company.find({});
    const allDrives = await Drive.find({});

    const enriched = selections.map(sel => {
      const company = allCompanies.find(c => String(c._id) === String(sel.companyId));
      const drive = allDrives.find(d => String(d._id) === String(sel.driveId));
      return {
        ...sel,
        company,
        drive
      };
    });

    return res.status(200).json({
      success: true,
      message: 'Student selections retrieved',
      data: {
        selections: enriched,
        placementSummary: {
          placementStatus: student.placementStatus,
          placedCompany: student.placedCompany,
          placedPackage: student.placedPackage,
          totalOffers: enriched.length
        }
      }
    });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/selections/recruiter
// @desc    Get selections by recruiter's company
router.get('/recruiter', protect, authorize('RECRUITER'), async (req, res, next) => {
  try {
    const recruiter = await require('../models/modelRegistry').Recruiter.findOne({ userId: req.user._id });
    let selections = [];

    if (recruiter && recruiter.companyId) {
      selections = await Selection.find({ companyId: recruiter.companyId });
    } else {
      selections = await Selection.find({});
    }

    const allStudents = await Student.find({});
    const allDrives = await Drive.find({});

    const enriched = selections.map(sel => {
      const student = allStudents.find(s => String(s._id) === String(sel.studentId));
      const drive = allDrives.find(d => String(d._id) === String(sel.driveId));
      return {
        ...sel,
        student,
        drive
      };
    });

    return res.status(200).json({
      success: true,
      message: 'Recruiter selections retrieved',
      data: enriched
    });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/selections
// @desc    Admin & Coordinator list all placement offers
router.get('/', protect, authorize('ADMIN', 'COORDINATOR'), async (req, res, next) => {
  try {
    const { branch, companyId, academicYear } = req.query;

    const filter = {};
    if (companyId && companyId !== 'ALL') filter.companyId = companyId;
    if (academicYear && academicYear !== 'ALL') filter.academicYear = academicYear;

    const selections = await Selection.find(filter);
    const allStudents = await Student.find({});
    const allCompanies = await Company.find({});
    const allDrives = await Drive.find({});

    let enriched = selections.map(sel => {
      const student = allStudents.find(s => String(s._id) === String(sel.studentId));
      const company = allCompanies.find(c => String(c._id) === String(sel.companyId));
      const drive = allDrives.find(d => String(d._id) === String(sel.driveId));
      return {
        ...sel,
        student,
        company,
        drive
      };
    });

    if (branch && branch !== 'ALL') {
      enriched = enriched.filter(sel => sel.student?.branch === branch);
    }

    enriched.sort((a, b) => (b.packageLpa || 0) - (a.packageLpa || 0));

    return res.status(200).json({
      success: true,
      message: 'Selections retrieved',
      data: enriched
    });
  } catch (err) {
    next(err);
  }
});

// @route   PATCH /api/selections/:id/status
// @desc    Student accepts or declines offer, or Admin updates status
router.patch('/:id/status', protect, async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['OFFERED', 'ACCEPTED', 'DECLINED', 'JOINED'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid selection status value.',
        error: { code: 'INVALID_STATUS' }
      });
    }

    const selection = await Selection.findById(req.params.id);
    if (!selection) {
      return res.status(404).json({
        success: false,
        message: 'Selection record not found.',
        error: { code: 'NOT_FOUND' }
      });
    }

    selection.status = status;
    await selection.save();

    await logAudit(req, 'UPDATE_SELECTION_STATUS', 'Selection', selection._id, { status });

    return res.status(200).json({
      success: true,
      message: `Offer status marked as ${status}`,
      data: selection
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
