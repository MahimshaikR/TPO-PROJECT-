const express = require('express');
const router = express.Router();
const { Student, Selection, Company, Application, Training, TrainingAttendance } = require('../models/modelRegistry');
const { optionalAuth } = require('../middleware/auth');

// @route   GET /api/analytics/placement
// @desc    Overall placement percentage and targets
router.get('/placement', optionalAuth, async (req, res, next) => {
  try {
    const students = await Student.find({});
    const total = students.length || 1;
    const placed = students.filter(s => s.placementStatus === 'PLACED').length;
    const unplaced = students.filter(s => s.placementStatus === 'UNPLACED').length;
    const registered = students.filter(s => s.placementStatus === 'REGISTERED').length;
    const higherStudies = students.filter(s => s.placementStatus === 'HIGHER_STUDIES').length;

    return res.status(200).json({
      success: true,
      message: 'Placement analytics computed',
      data: {
        totalStudents: total,
        placedCount: placed,
        placementPercentage: Number(((placed / total) * 100).toFixed(1)),
        breakdown: [
          { label: 'Placed', count: placed, color: '#10b981' },
          { label: 'Registered / Active', count: registered, color: '#3b82f6' },
          { label: 'Unplaced', count: unplaced, color: '#f59e0b' },
          { label: 'Higher Studies / Opted Out', count: higherStudies, color: '#6b7280' }
        ]
      }
    });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/analytics/branch
// @desc    Branch-wise placement comparison chart data
router.get('/branch', optionalAuth, async (req, res, next) => {
  try {
    const students = await Student.find({});
    const branchMap = {};

    students.forEach(s => {
      const b = s.branch || 'Other';
      if (!branchMap[b]) {
        branchMap[b] = { branch: b, total: 0, placed: 0 };
      }
      branchMap[b].total += 1;
      if (s.placementStatus === 'PLACED') {
        branchMap[b].placed += 1;
      }
    });

    const data = Object.values(branchMap).map(b => ({
      branch: b.branch,
      total: b.total,
      placed: b.placed,
      percentage: b.total > 0 ? Number(((b.placed / b.total) * 100).toFixed(1)) : 0
    }));

    data.sort((a, b) => b.percentage - a.percentage);

    return res.status(200).json({
      success: true,
      message: 'Branch analytics computed',
      data
    });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/analytics/company
// @desc    Top recruiting companies chart data
router.get('/company', optionalAuth, async (req, res, next) => {
  try {
    const companies = await Company.find({});
    const selections = await Selection.find({});

    const data = companies.map(c => {
      const count = selections.filter(s => String(s.companyId) === String(c._id)).length || c.totalOffersCount || 0;
      return {
        company: c.name,
        offers: count,
        highestPackage: c.highestPackageOffered || 0,
        averagePackage: c.averagePackageOffered || 0
      };
    });

    data.sort((a, b) => b.offers - a.offers);

    return res.status(200).json({
      success: true,
      message: 'Company analytics computed',
      data: data.slice(0, 8)
    });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/analytics/package
// @desc    Salary package bracket distribution histogram
router.get('/package', optionalAuth, async (req, res, next) => {
  try {
    const selections = await Selection.find({});
    const students = await Student.find({});

    const allPackages = selections
      .map(s => Number(s.packageLpa) || 0)
      .filter(p => p > 0);

    students.forEach(s => {
      if (s.placedPackage && s.placedPackage > 0) {
        allPackages.push(s.placedPackage);
      }
    });

    const brackets = {
      'Below 6 LPA': 0,
      '6 - 10 LPA': 0,
      '10 - 15 LPA': 0,
      '15 - 25 LPA': 0,
      '25+ LPA (Super Dream)': 0
    };

    allPackages.forEach(p => {
      if (p < 6) brackets['Below 6 LPA'] += 1;
      else if (p <= 10) brackets['6 - 10 LPA'] += 1;
      else if (p <= 15) brackets['10 - 15 LPA'] += 1;
      else if (p <= 25) brackets['15 - 25 LPA'] += 1;
      else brackets['25+ LPA (Super Dream)'] += 1;
    });

    const data = Object.entries(brackets).map(([bracket, count]) => ({
      bracket,
      count
    }));

    return res.status(200).json({
      success: true,
      message: 'Package distribution analytics computed',
      data
    });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/analytics/funnel
// @desc    Recruitment conversion funnel
router.get('/funnel', optionalAuth, async (req, res, next) => {
  try {
    const applications = await Application.find({});

    const funnel = [
      {
        stage: 'Registered',
        count: applications.length,
        percentage: 100
      },
      {
        stage: 'Attended Test',
        count: applications.filter(a => ['ATTENDED', 'SHORTLISTED', 'TEST_QUALIFIED', 'INTERVIEW', 'SELECTED'].includes(a.status)).length,
        percentage: applications.length > 0 ? Number(((applications.filter(a => ['ATTENDED', 'SHORTLISTED', 'TEST_QUALIFIED', 'INTERVIEW', 'SELECTED'].includes(a.status)).length / applications.length) * 100).toFixed(1)) : 0
      },
      {
        stage: 'Shortlisted',
        count: applications.filter(a => ['SHORTLISTED', 'TEST_QUALIFIED', 'INTERVIEW', 'SELECTED'].includes(a.status)).length,
        percentage: applications.length > 0 ? Number(((applications.filter(a => ['SHORTLISTED', 'TEST_QUALIFIED', 'INTERVIEW', 'SELECTED'].includes(a.status)).length / applications.length) * 100).toFixed(1)) : 0
      },
      {
        stage: 'Interview Scheduled',
        count: applications.filter(a => ['INTERVIEW', 'SELECTED'].includes(a.status)).length,
        percentage: applications.length > 0 ? Number(((applications.filter(a => ['INTERVIEW', 'SELECTED'].includes(a.status)).length / applications.length) * 100).toFixed(1)) : 0
      },
      {
        stage: 'Final Offer / Selected',
        count: applications.filter(a => a.status === 'SELECTED').length,
        percentage: applications.length > 0 ? Number(((applications.filter(a => a.status === 'SELECTED').length / applications.length) * 100).toFixed(1)) : 0
      }
    ];

    return res.status(200).json({
      success: true,
      message: 'Recruitment funnel computed',
      data: funnel
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
