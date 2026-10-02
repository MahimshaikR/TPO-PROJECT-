require('dotenv').config();
const { connectDB } = require('./config/db');
const {
  User,
  Student,
  Recruiter,
  Company,
  Drive,
  Application,
  Attendance,
  Interview,
  Selection,
  Training,
  TrainingSession,
  TrainingAttendance,
  Internship,
  Event,
  Announcement,
  Notification,
  Resource,
  Gallery,
  Achievement,
  SuccessStory,
  FAQ,
  Feedback,
  Grievance,
  Settings,
  AuditLog
} = require('./models/modelRegistry');
const { getSeedData } = require('./utils/seedData');

const seedData = async (isDestroy = false) => {
  await connectDB();
  console.log('[Seeder] Starting data sync...');

  try {
    // Clear all
    await User.deleteMany({});
    await Student.deleteMany({});
    await Recruiter.deleteMany({});
    await Company.deleteMany({});
    await Drive.deleteMany({});
    await Application.deleteMany({});
    await Attendance.deleteMany({});
    await Interview.deleteMany({});
    await Selection.deleteMany({});
    await Training.deleteMany({});
    await TrainingSession.deleteMany({});
    await TrainingAttendance.deleteMany({});
    await Internship.deleteMany({});
    await Event.deleteMany({});
    await Announcement.deleteMany({});
    await Notification.deleteMany({});
    await Resource.deleteMany({});
    await Gallery.deleteMany({});
    await Achievement.deleteMany({});
    await SuccessStory.deleteMany({});
    await FAQ.deleteMany({});
    await Feedback.deleteMany({});
    await Grievance.deleteMany({});
    await Settings.deleteMany({});
    await AuditLog.deleteMany({});

    if (isDestroy) {
      console.log('[Seeder] All database records successfully wiped.');
      return;
    }

    const data = await getSeedData();

    await User.create(data.users);
    await Company.create(data.companies);
    await Recruiter.create(data.recruiters);
    await Student.create(data.students);
    await Drive.create(data.drives);
    await Application.create(data.applications);
    await Attendance.create(data.attendances);
    await Interview.create(data.interviews);
    await Selection.create(data.selections);
    await Training.create(data.trainings);
    await TrainingSession.create(data.trainingSessions);
    await TrainingAttendance.create(data.trainingAttendances);
    await Internship.create(data.internships);
    await Event.create(data.events);
    await Announcement.create(data.announcements);
    await Notification.create(data.notifications);
    await Resource.create(data.resources);
    await Gallery.create(data.gallery);
    await Achievement.create(data.achievements);
    await SuccessStory.create(data.successStories);
    await FAQ.create(data.faqs);
    await Feedback.create(data.feedbacks);
    await Grievance.create(data.grievances);
    await Settings.create(data.settings);
    await AuditLog.create(data.auditLogs);

    console.log('[Seeder] Database successfully populated with comprehensive dynamic records!');
  } catch (err) {
    console.error('[Seeder] Seeding error:', err);
    throw err;
  }
};

if (require.main === module) {
  const isDestroy = process.argv.includes('-d');
  seedData(isDestroy).then(() => {
    console.log('[Seeder] Finished successfully.');
    process.exit(0);
  }).catch(() => {
    process.exit(1);
  });
}

module.exports = {
  seedData
};
