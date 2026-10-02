const express = require('express');
const router = express.Router();
const { Student, Selection, Company, Drive, Training, TrainingAttendance, Internship, Attendance } = require('../models/modelRegistry');
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const { generateCSV, generateExcelHTML } = require('../utils/exportHelper');

// Helper to filter placement records
const getFilteredPlacements = async (query = {}) => {
  const { year, branch, company, status } = query;

  const allSelections = await Selection.find({});
  const allStudents = await Student.find({});
  const allCompanies = await Company.find({});
  const allDrives = await Drive.find({});

  let rows = allSelections.map(sel => {
    const student = allStudents.find(s => String(s._id) === String(sel.studentId));
    const comp = allCompanies.find(c => String(c._id) === String(sel.companyId));
    const drive = allDrives.find(d => String(d._id) === String(sel.driveId));

    return {
      id: sel._id,
      rollNumber: student?.rollNumber || 'N/A',
      studentName: student?.fullName || 'N/A',
      branch: student?.branch || 'N/A',
      batch: student?.batch || '2027',
      cgpa: student?.cgpa || 0,
      company: comp?.name || drive?.companyName || 'Corporate Partner',
      designation: sel.designation || 'Software Engineer',
      packageLpa: sel.packageLpa || 0,
      academicYear: sel.academicYear || student?.academicYear || '2026-27',
      status: sel.status || 'OFFERED',
      selectionDate: sel.selectionDate || '2026-09-20'
    };
  });

  // Filter
  if (year && year !== 'ALL') rows = rows.filter(r => r.academicYear === year);
  if (branch && branch !== 'ALL') rows = rows.filter(r => r.branch === branch);
  if (company && company !== 'ALL') rows = rows.filter(r => r.company.toLowerCase().includes(company.toLowerCase()));
  if (status && status !== 'ALL') rows = rows.filter(r => r.status === status);

  return rows;
};

// @route   GET /api/reports/placements
// @desc    Placements report with dynamic filters
router.get('/placements', optionalAuth, async (req, res, next) => {
  try {
    const rows = await getFilteredPlacements(req.query);
    return res.status(200).json({
      success: true,
      message: 'Placement report generated',
      data: rows
    });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/reports/branch
// @desc    Branch-wise placement statistics report
router.get('/branch', optionalAuth, async (req, res, next) => {
  try {
    const allStudents = await Student.find({});
    const allSelections = await Selection.find({});

    const branches = {};
    allStudents.forEach(s => {
      const b = s.branch || 'Unknown';
      if (!branches[b]) {
        branches[b] = {
          branch: b,
          totalStudents: 0,
          placedStudents: 0,
          totalOffers: 0,
          highestPackage: 0,
          packageSum: 0,
          packages: []
        };
      }
      branches[b].totalStudents += 1;
      if (s.placementStatus === 'PLACED') {
        branches[b].placedStudents += 1;
      }
    });

    allSelections.forEach(sel => {
      const student = allStudents.find(s => String(s._id) === String(sel.studentId));
      const b = student?.branch || 'Unknown';
      if (branches[b]) {
        branches[b].totalOffers += 1;
        const p = Number(sel.packageLpa) || 0;
        if (p > 0) {
          branches[b].packages.push(p);
          branches[b].packageSum += p;
          if (p > branches[b].highestPackage) branches[b].highestPackage = p;
        }
      }
    });

    const report = Object.values(branches).map(b => {
      const avg = b.packages.length > 0 ? Number((b.packageSum / b.packages.length).toFixed(1)) : 0;
      const pct = b.totalStudents > 0 ? Number(((b.placedStudents / b.totalStudents) * 100).toFixed(1)) : 0;
      return {
        branch: b.branch,
        totalStudents: b.totalStudents,
        placedStudents: b.placedStudents,
        totalOffers: b.totalOffers,
        placementPercentage: pct,
        highestPackage: b.highestPackage,
        averagePackage: avg
      };
    });

    return res.status(200).json({
      success: true,
      message: 'Branch placement report generated',
      data: report
    });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/reports/company
// @desc    Company recruitment breakdown report
router.get('/company', optionalAuth, async (req, res, next) => {
  try {
    const companies = await Company.find({});
    const selections = await Selection.find({});

    const report = companies.map(c => {
      const compSelections = selections.filter(s => String(s.companyId) === String(c._id));
      const packages = compSelections.map(s => Number(s.packageLpa) || 0).filter(p => p > 0);
      const high = packages.length > 0 ? Math.max(...packages) : c.highestPackageOffered || 0;
      const avg = packages.length > 0
        ? Number((packages.reduce((a, b) => a + b, 0) / packages.length).toFixed(1))
        : c.averagePackageOffered || 0;

      return {
        companyId: c._id,
        companyName: c.name,
        industry: c.industry,
        tier: c.tier,
        offersCount: compSelections.length || c.totalOffersCount || 0,
        highestPackage: high,
        averagePackage: avg
      };
    });

    report.sort((a, b) => b.offersCount - a.offersCount);

    return res.status(200).json({
      success: true,
      message: 'Company recruitment report generated',
      data: report
    });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/reports/internships
// @desc    Internship engagement report
router.get('/internships', optionalAuth, async (req, res, next) => {
  try {
    const internships = await Internship.find({});
    return res.status(200).json({
      success: true,
      message: 'Internships report generated',
      data: internships
    });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/reports/training
// @desc    Training programs completion and hours report
router.get('/training', optionalAuth, async (req, res, next) => {
  try {
    const trainings = await Training.find({});
    return res.status(200).json({
      success: true,
      message: 'Training programs report generated',
      data: trainings
    });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/reports/yearly
// @desc    Yearly recruitment trend report
router.get('/yearly', optionalAuth, async (req, res, next) => {
  try {
    const selections = await Selection.find({});
    const yearly = {};

    selections.forEach(s => {
      const yr = s.academicYear || '2026-27';
      if (!yearly[yr]) {
        yearly[yr] = { academicYear: yr, offers: 0, highestPackage: 0, packages: [] };
      }
      yearly[yr].offers += 1;
      const p = Number(s.packageLpa) || 0;
      if (p > 0) {
        yearly[yr].packages.push(p);
        if (p > yearly[yr].highestPackage) yearly[yr].highestPackage = p;
      }
    });

    const report = Object.values(yearly).map(y => ({
      academicYear: y.academicYear,
      totalOffers: y.offers,
      highestPackage: y.highestPackage,
      averagePackage: y.packages.length > 0
        ? Number((y.packages.reduce((a, b) => a + b, 0) / y.packages.length).toFixed(1))
        : 0
    }));

    return res.status(200).json({
      success: true,
      message: 'Yearly comparison report generated',
      data: report
    });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/reports/export/csv
// @desc    Export placement report as CSV file download
router.get('/export/csv', async (req, res, next) => {
  try {
    const rows = await getFilteredPlacements(req.query);
    const headers = [
      { key: 'rollNumber', label: 'Roll Number' },
      { key: 'studentName', label: 'Student Name' },
      { key: 'branch', label: 'Branch' },
      { key: 'batch', label: 'Batch' },
      { key: 'cgpa', label: 'CGPA' },
      { key: 'company', label: 'Company' },
      { key: 'designation', label: 'Job Role' },
      { key: 'packageLpa', label: 'Package (LPA)' },
      { key: 'academicYear', label: 'Academic Year' },
      { key: 'status', label: 'Status' },
      { key: 'selectionDate', label: 'Date' }
    ];

    const csvData = generateCSV(headers, rows);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="Placement_Report_2026.csv"');
    return res.send(csvData);
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/reports/export/excel
// @desc    Export placement report as Excel-compatible file download
router.get('/export/excel', async (req, res, next) => {
  try {
    const rows = await getFilteredPlacements(req.query);
    const headers = [
      { key: 'rollNumber', label: 'Roll Number' },
      { key: 'studentName', label: 'Student Name' },
      { key: 'branch', label: 'Branch' },
      { key: 'batch', label: 'Batch' },
      { key: 'cgpa', label: 'CGPA' },
      { key: 'company', label: 'Company' },
      { key: 'designation', label: 'Job Role' },
      { key: 'packageLpa', label: 'Package (LPA)' },
      { key: 'academicYear', label: 'Academic Year' },
      { key: 'status', label: 'Status' }
    ];

    const excelData = generateExcelHTML('Placements 2026', headers, rows);

    res.setHeader('Content-Type', 'application/vnd.ms-excel');
    res.setHeader('Content-Disposition', 'attachment; filename="Placement_Report_2026.xls"');
    return res.send(excelData);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
