const express = require('express');
const router = express.Router();
const { Company, Drive, Announcement, Training, Resource, Event, Student } = require('../models/modelRegistry');
const { optionalAuth } = require('../middleware/auth');

// @route   GET /api/search
// @desc    Universal search across system entities
router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const q = (req.query.q || '').toLowerCase().trim();
    if (!q) {
      return res.status(200).json({
        success: true,
        message: 'Empty query',
        data: { companies: [], drives: [], announcements: [], training: [], resources: [], events: [], students: [] }
      });
    }

    const [companies, drives, announcements, training, resources, events] = await Promise.all([
      Company.find({ status: 'ACTIVE' }),
      Drive.find({ status: { $in: ['UPCOMING', 'ONGOING', 'COMPLETED'] } }),
      Announcement.find({ isPublished: true }),
      Training.find({ status: 'ACTIVE' }),
      Resource.find({ isPublished: true }),
      Event.find({ isPublic: true })
    ]);

    const matchedCompanies = companies.filter(c =>
      c.name.toLowerCase().includes(q) ||
      (c.industry && c.industry.toLowerCase().includes(q))
    ).slice(0, 5);

    const matchedDrives = drives.filter(d =>
      d.title.toLowerCase().includes(q) ||
      d.companyName.toLowerCase().includes(q) ||
      d.jobRole.toLowerCase().includes(q)
    ).slice(0, 5);

    const matchedAnnouncements = announcements.filter(a =>
      a.title.toLowerCase().includes(q) ||
      a.content.toLowerCase().includes(q)
    ).slice(0, 5);

    const matchedTraining = training.filter(t =>
      t.title.toLowerCase().includes(q) ||
      t.instructor.toLowerCase().includes(q) ||
      (t.syllabus && t.syllabus.some(s => s.toLowerCase().includes(q)))
    ).slice(0, 5);

    const matchedResources = resources.filter(r =>
      r.title.toLowerCase().includes(q) ||
      (r.tags && r.tags.some(t => t.toLowerCase().includes(q)))
    ).slice(0, 5);

    const matchedEvents = events.filter(e =>
      e.title.toLowerCase().includes(q) ||
      (e.speakerOrGuest && e.speakerOrGuest.toLowerCase().includes(q))
    ).slice(0, 5);

    // If authorized admin/coordinator, include students in search
    let matchedStudents = [];
    if (req.user && ['ADMIN', 'COORDINATOR', 'TP_OFFICER', 'SUPER_ADMIN'].includes(req.user.role)) {
      const allStudents = await Student.find({});
      matchedStudents = allStudents.filter(s =>
        s.fullName.toLowerCase().includes(q) ||
        s.rollNumber.toLowerCase().includes(q) ||
        s.branch.toLowerCase().includes(q)
      ).slice(0, 5);
    }

    const totalResults =
      matchedCompanies.length +
      matchedDrives.length +
      matchedAnnouncements.length +
      matchedTraining.length +
      matchedResources.length +
      matchedEvents.length +
      matchedStudents.length;

    return res.status(200).json({
      success: true,
      message: `Found ${totalResults} matching results`,
      data: {
        totalResults,
        companies: matchedCompanies,
        drives: matchedDrives,
        announcements: matchedAnnouncements,
        training: matchedTraining,
        resources: matchedResources,
        events: matchedEvents,
        students: matchedStudents
      }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
