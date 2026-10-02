const express = require('express');
const router = express.Router();
const { Drive, Company, Student, Application, Notification } = require('../models/modelRegistry');
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const { logAudit } = require('../middleware/audit');

// Helper to check student eligibility against drive criteria
const evaluateEligibility = (student, drive) => {
  const reasons = [];
  let isEligible = true;

  if (!student) {
    return {
      eligible: false,
      reasons: ['Student profile not registered.']
    };
  }

  // Branch check
  const allowedBranches = drive.eligibility?.branches || [];
  if (allowedBranches.length > 0 && !allowedBranches.includes('All') && !allowedBranches.includes(student.branch)) {
    isEligible = false;
    reasons.push(`Branch '${student.branch}' is not eligible. Allowed branches: ${allowedBranches.join(', ')}.`);
  }

  // Batch check
  const allowedBatches = drive.eligibility?.batch || [];
  if (allowedBatches.length > 0 && !allowedBatches.includes('All') && !allowedBatches.includes(student.batch)) {
    isEligible = false;
    reasons.push(`Graduating batch '${student.batch}' does not match drive batch requirement (${allowedBatches.join(', ')}).`);
  }

  // CGPA check
  const minCgpa = drive.eligibility?.minCgpa ?? 0;
  if ((student.cgpa || 0) < minCgpa) {
    isEligible = false;
    reasons.push(`CGPA requirement not satisfied. Minimum required: ${minCgpa}, your CGPA: ${student.cgpa || 0}.`);
  }

  // Backlogs check
  const maxBacklogs = drive.eligibility?.maxBacklogs ?? 0;
  if ((student.backlogs || 0) > maxBacklogs) {
    isEligible = false;
    reasons.push(`Active backlogs exceed permissible limit. Maximum allowed: ${maxBacklogs}, your active backlogs: ${student.backlogs || 0}.`);
  }

  return {
    eligible: isEligible,
    reasons: reasons.length > 0 ? reasons : ['All eligibility conditions fulfilled! You can apply.']
  };
};

// @route   GET /api/drives
// @desc    Get published placement drives with dynamic filters
router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const { branch, batch, minPackage, status, search, limit = 50 } = req.query;

    const filter = {};
    if (status && status !== 'ALL') {
      filter.status = status;
    } else {
      filter.status = { $in: ['UPCOMING', 'ONGOING', 'COMPLETED'] };
    }

    let drives = await Drive.find(filter);

    if (branch && branch !== 'ALL') {
      drives = drives.filter(d => !d.eligibility?.branches?.length || d.eligibility.branches.includes('All') || d.eligibility.branches.includes(branch));
    }

    if (batch && batch !== 'ALL') {
      drives = drives.filter(d => !d.eligibility?.batch?.length || d.eligibility.batch.includes('All') || d.eligibility.batch.includes(batch));
    }

    if (minPackage) {
      drives = drives.filter(d => (d.packageLpa || 0) >= Number(minPackage));
    }

    if (search) {
      const q = search.toLowerCase().trim();
      drives = drives.filter(d =>
        d.title.toLowerCase().includes(q) ||
        d.companyName.toLowerCase().includes(q) ||
        d.jobRole.toLowerCase().includes(q) ||
        (d.description && d.description.toLowerCase().includes(q))
      );
    }

    // Sort by upcoming date
    drives.sort((a, b) => new Date(a.driveDate) - new Date(b.driveDate));

    // If logged in as student, calculate student-specific eligibility flags
    let student = null;
    let appliedDriveIds = [];
    if (req.user && req.user.role === 'STUDENT') {
      student = await Student.findOne({ userId: req.user._id });
      if (student) {
        const apps = await Application.find({ studentId: student._id });
        appliedDriveIds = apps.map(a => String(a.driveId));
      }
    }

    const enhancedDrives = drives.map(drive => {
      const driveObj = drive.toObject ? drive.toObject() : { ...drive };
      if (student) {
        const evalResult = evaluateEligibility(student, drive);
        driveObj.isEligible = evalResult.eligible;
        driveObj.eligibilityReasons = evalResult.reasons;
        driveObj.hasApplied = appliedDriveIds.includes(String(drive._id));
      }
      return driveObj;
    });

    return res.status(200).json({
      success: true,
      message: 'Placement drives retrieved',
      data: enhancedDrives
    });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/drives/admin
// @desc    Admin & Coordinator list all drives including drafts
router.get('/admin', protect, authorize('ADMIN', 'COORDINATOR'), async (req, res, next) => {
  try {
    const drives = await Drive.find({});
    drives.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

    return res.status(200).json({
      success: true,
      message: 'All drives retrieved for administration',
      data: drives
    });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/drives/recruiter
// @desc    Recruiter list drives created for their company
router.get('/recruiter', protect, authorize('RECRUITER'), async (req, res, next) => {
  try {
    const recruiter = await req.user.role === 'RECRUITER' ? await require('../models/modelRegistry').Recruiter.findOne({ userId: req.user._id }) : null;
    let drives = [];
    if (recruiter && recruiter.companyId) {
      drives = await Drive.find({ companyId: recruiter.companyId });
    } else {
      drives = await Drive.find({ createdBy: req.user._id });
    }

    return res.status(200).json({
      success: true,
      message: 'Recruiter drives retrieved',
      data: drives
    });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/drives/:id
// @desc    Get drive details and dynamic eligibility
router.get('/:id', optionalAuth, async (req, res, next) => {
  try {
    const drive = await Drive.findById(req.params.id);
    if (!drive) {
      return res.status(404).json({
        success: false,
        message: 'Placement drive not found.',
        error: { code: 'NOT_FOUND' }
      });
    }

    const driveObj = drive.toObject ? drive.toObject() : { ...drive };

    // Fetch company info
    const company = await Company.findById(drive.companyId);
    if (company) {
      driveObj.company = company;
    }

    // Check student eligibility if student logged in
    if (req.user && req.user.role === 'STUDENT') {
      const student = await Student.findOne({ userId: req.user._id });
      if (student) {
        const evalResult = evaluateEligibility(student, drive);
        driveObj.eligibilityEvaluation = {
          eligible: evalResult.eligible,
          reasons: evalResult.reasons,
          studentData: {
            rollNumber: student.rollNumber,
            branch: student.branch,
            batch: student.batch,
            cgpa: student.cgpa,
            backlogs: student.backlogs
          }
        };

        const existingApp = await Application.findOne({
          studentId: student._id,
          driveId: drive._id
        });
        driveObj.application = existingApp;
        driveObj.hasApplied = !!existingApp;
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Drive details retrieved',
      data: driveObj
    });
  } catch (err) {
    next(err);
  }
});

// @route   POST /api/drives
// @desc    Create new placement drive (Admin/Recruiter)
router.post('/', protect, authorize('ADMIN', 'RECRUITER'), async (req, res, next) => {
  try {
    const {
      title,
      companyId,
      jobRole,
      jobType,
      description,
      packageLpa,
      stipendMonthly,
      location,
      venue,
      vacancies,
      eligibility,
      selectionProcess,
      requiredDocuments,
      driveDate,
      deadline,
      status
    } = req.body;

    if (!title || !companyId || !jobRole || !packageLpa || !driveDate || !deadline) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all mandatory drive attributes.',
        error: { code: 'VALIDATION_ERROR' }
      });
    }

    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Specified company does not exist in system.',
        error: { code: 'COMPANY_NOT_FOUND' }
      });
    }

    const drive = await Drive.create({
      title: title.trim(),
      companyId,
      companyName: company.name,
      companyLogo: company.logo,
      jobRole: jobRole.trim(),
      jobType: jobType || 'FULL_TIME',
      description: description || '',
      packageLpa: Number(packageLpa),
      stipendMonthly: Number(stipendMonthly) || 0,
      location: location || 'Campus / Hybrid',
      venue: venue || 'Main Auditorium',
      vacancies: Number(vacancies) || 10,
      eligibility: {
        branches: Array.isArray(eligibility?.branches) ? eligibility.branches : ['CSE', 'IT', 'ECE'],
        batch: Array.isArray(eligibility?.batch) ? eligibility.batch : ['2027'],
        minCgpa: Number(eligibility?.minCgpa) || 6.5,
        maxBacklogs: Number(eligibility?.maxBacklogs) || 0,
        genderPreference: eligibility?.genderPreference || 'All'
      },
      selectionProcess: Array.isArray(selectionProcess) ? selectionProcess : ['Online Assessment', 'Technical Interview', 'HR Interview'],
      requiredDocuments: Array.isArray(requiredDocuments) ? requiredDocuments : ['Resume', 'College ID'],
      driveDate,
      deadline,
      status: status || 'UPCOMING',
      createdBy: req.user._id
    });

    // Send broadcast notification for students
    await Notification.create({
      recipientId: 'ALL',
      recipientRole: 'STUDENT',
      title: `New Placement Drive: ${company.name}`,
      message: `${company.name} is hiring for ${jobRole} (${packageLpa} LPA). Check eligibility and apply before ${deadline}.`,
      type: 'DRIVE',
      link: `/placements/drives/${drive._id}`
    });

    await logAudit(req, 'CREATE_DRIVE', 'Drive', drive._id, { title: drive.title, company: company.name });

    return res.status(201).json({
      success: true,
      message: 'Placement drive successfully scheduled and published.',
      data: drive
    });
  } catch (err) {
    next(err);
  }
});

// @route   PUT /api/drives/:id
// @desc    Update drive details
router.put('/:id', protect, authorize('ADMIN', 'RECRUITER'), async (req, res, next) => {
  try {
    const drive = await Drive.findById(req.params.id);
    if (!drive) {
      return res.status(404).json({
        success: false,
        message: 'Drive not found.',
        error: { code: 'NOT_FOUND' }
      });
    }

    const updated = await Drive.findByIdAndUpdate(drive._id, req.body, { new: true });
    await logAudit(req, 'UPDATE_DRIVE', 'Drive', drive._id, { title: updated.title });

    return res.status(200).json({
      success: true,
      message: 'Drive updated successfully',
      data: updated
    });
  } catch (err) {
    next(err);
  }
});

// @route   PATCH /api/drives/:id/status
// @desc    Update drive status (e.g. UPCOMING, ONGOING, COMPLETED, CANCELLED)
router.patch('/:id/status', protect, authorize('ADMIN', 'RECRUITER'), async (req, res, next) => {
  try {
    const { status } = req.body;
    const drive = await Drive.findById(req.params.id);
    if (!drive) {
      return res.status(404).json({
        success: false,
        message: 'Drive not found.',
        error: { code: 'NOT_FOUND' }
      });
    }

    drive.status = status;
    await drive.save();

    await logAudit(req, 'UPDATE_DRIVE_STATUS', 'Drive', drive._id, { status });

    return res.status(200).json({
      success: true,
      message: `Drive status changed to ${status}`,
      data: drive
    });
  } catch (err) {
    next(err);
  }
});

// @route   DELETE /api/drives/:id
// @desc    Delete drive (Admin only)
router.delete('/:id', protect, authorize('ADMIN'), async (req, res, next) => {
  try {
    const drive = await Drive.findById(req.params.id);
    if (!drive) {
      return res.status(404).json({
        success: false,
        message: 'Drive not found.',
        error: { code: 'NOT_FOUND' }
      });
    }

    await Drive.findByIdAndDelete(drive._id);
    await logAudit(req, 'DELETE_DRIVE', 'Drive', drive._id, { title: drive.title });

    return res.status(200).json({
      success: true,
      message: 'Drive deleted successfully.'
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
