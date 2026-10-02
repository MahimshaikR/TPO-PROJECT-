const express = require('express');
const router = express.Router();
const { Settings } = require('../models/modelRegistry');
const { protect, authorize } = require('../middleware/auth');
const { logAudit } = require('../middleware/audit');

// Default initial settings fallback
const defaultSettings = {
  collegeName: 'NRIIT ENGINEERING COLLEGE',
  collegeLogo: '/assets/images/nriit-logo.png',
  favicon: '/assets/images/nriit-logo.png',
  departmentName: 'Training & Placement Cell',
  tagline: 'A POWERHOUSE OF TECHNOLOGY',
  heroTitle: 'Your Future\nOur Commitment',
  heroSubtitle: 'Empowering Students. Enabling Opportunities. Building Successful Careers at NRIIT.',
  officerName: 'Dr. Rajesh Kumar',
  officerDesignation: 'Training & Placement Officer',
  officerPhoto: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=500&q=80',
  officerMessage: 'At NRIIT Engineering College, our mission is to ensure every student is prepared not just for their first job, but for an enduring, impactful technology career. Our holistic training architecture, strong industry partnerships, and dedicated faculty mentors work tirelessly to deliver transformative career outcomes.',
  primaryContact: '+91 98765 43210',
  email: 'placements@nriit.edu.in',
  phone: '+91 866 2469666',
  officeAddress: 'NRI Institute of Technology, Pothavarappadu (V), Agiripalli (M), Vijayawada Rural, Eluru District, Andhra Pradesh - 521212',
  workingHours: 'Monday - Friday: 8:30 AM - 5:30 PM, Saturday: 9:00 AM - 1:30 PM',
  googleMapsUrl: 'https://maps.google.com/?q=Vijayawada',
  socialLinks: {
    facebook: 'https://facebook.com/nriit',
    instagram: 'https://instagram.com/nriit',
    linkedin: 'https://linkedin.com/school/nriit',
    youtube: 'https://youtube.com/nriit',
    twitter: 'https://twitter.com/nriit',
    collegeWebsite: 'https://nriit.edu.in'
  },
  footerText: '© 2026 NRIIT ENGINEERING COLLEGE. Autonomous | NAAC A+ | NBA Accredited. All Rights Reserved.',
  maintenanceMode: false,
  academicYears: ['2023-24', '2024-25', '2025-26', '2026-27', '2027-28'],
  branches: [
    'CSE',
    'ECE',
    'EEE',
    'IT',
    'AIML',
    'Data Science',
    'Mechanical',
    'Civil',
    'Biotechnology'
  ],
  placementStatuses: [
    'UNPLACED',
    'REGISTERED',
    'PLACED',
    'OPTED_OUT',
    'HIGHER_STUDIES'
  ],
  applicationStatuses: [
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
  ],
  trainingCategories: [
    'APTITUDE',
    'TECHNICAL',
    'SOFT_SKILLS',
    'INTERVIEW_PREP',
    'WORKSHOP',
    'BOOTCAMP'
  ]
};

// Helper to get or create settings
const getOrInitSettings = async () => {
  let doc = await Settings.findOne({});
  if (!doc) {
    doc = await Settings.create(defaultSettings);
  }
  return doc;
};

// @route   GET /api/settings/public
// @desc    Get safe public website configuration
router.get('/public', async (req, res, next) => {
  try {
    const settings = await getOrInitSettings();
    return res.status(200).json({
      success: true,
      message: 'Public settings retrieved',
      data: settings
    });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/settings/admin
// @desc    Get full configuration for Admin settings dashboard
router.get('/admin', protect, authorize('ADMIN'), async (req, res, next) => {
  try {
    const settings = await getOrInitSettings();
    return res.status(200).json({
      success: true,
      message: 'Admin settings retrieved',
      data: settings
    });
  } catch (err) {
    next(err);
  }
});

// @route   PUT /api/settings
// @desc    Update system settings (Admin only)
router.put('/', protect, authorize('ADMIN'), async (req, res, next) => {
  try {
    let settings = await Settings.findOne({});
    if (!settings) {
      settings = await Settings.create({ ...defaultSettings, ...req.body });
    } else {
      settings = await Settings.findByIdAndUpdate(settings._id, req.body, { new: true });
    }

    await logAudit(req, 'UPDATE_SETTINGS', 'Settings', settings._id);

    return res.status(200).json({
      success: true,
      message: 'System settings successfully updated',
      data: settings
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
