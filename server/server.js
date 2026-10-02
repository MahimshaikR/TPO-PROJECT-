require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const { connectDB, getStatus } = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Route Imports
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const studentRoutes = require('./routes/studentRoutes');
const recruiterRoutes = require('./routes/recruiterRoutes');
const companyRoutes = require('./routes/companyRoutes');
const driveRoutes = require('./routes/driveRoutes');
const eligibilityRoutes = require('./routes/eligibilityRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const interviewRoutes = require('./routes/interviewRoutes');
const selectionRoutes = require('./routes/selectionRoutes');
const trainingRoutes = require('./routes/trainingRoutes');
const internshipRoutes = require('./routes/internshipRoutes');
const eventRoutes = require('./routes/eventRoutes');
const announcementRoutes = require('./routes/announcementRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const resourceRoutes = require('./routes/resourceRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const achievementRoutes = require('./routes/achievementRoutes');
const successStoryRoutes = require('./routes/successStoryRoutes');
const reportRoutes = require('./routes/reportRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const faqRoutes = require('./routes/faqRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const grievanceRoutes = require('./routes/grievanceRoutes');
const auditRoutes = require('./routes/auditRoutes');
const searchRoutes = require('./routes/searchRoutes');
const aiRoutes = require('./routes/aiRoutes');
const teamRoutes = require('./routes/teamRoutes');
const testimonialRoutes = require('./routes/testimonialRoutes');
const alumniRoutes = require('./routes/alumniRoutes');
const hackathonRoutes = require('./routes/hackathonRoutes');
const evidenceRoutes = require('./routes/evidenceRoutes');

const app = express();

// Security & Utility Middlewares
app.use(helmet({
  contentSecurityPolicy: false, // Allows inline script & CDN fonts for SPA client
  crossOriginEmbedderPolicy: false
}));

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Serve Static Uploads & Public Files
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
app.use(express.static(path.join(__dirname, '..', 'public')));

// Health Check Endpoint (Render & Monitoring)
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'TPO Connect API is healthy and operational',
    data: {
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      database: getStatus(),
      environment: process.env.NODE_ENV || 'development'
    }
  });
});

// Mount All Backend API Groups
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/recruiters', recruiterRoutes);
app.use('/api/drives', driveRoutes);
app.use('/api/eligibility', eligibilityRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/selections', selectionRoutes);
app.use('/api/training', trainingRoutes);
app.use('/api/training-attendance', trainingRoutes);
app.use('/api/internships', internshipRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/success-stories', successStoryRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/faq', faqRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/grievance', grievanceRoutes);
app.use('/api/audit-logs', auditRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/alumni', alumniRoutes);
app.use('/api/hackathons', hackathonRoutes);
app.use('/api/evidence', evidenceRoutes);

// Catch unhandled API requests
app.use('/api', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint ${req.originalUrl} not found`,
    error: { code: 'ENDPOINT_NOT_FOUND' }
  });
});

// Single Page Application (SPA) Client Fallback Route
app.use((req, res, next) => {
  if (req.method !== 'GET') return next();
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    // Auto-seed if database is empty
    const { User } = require('./models/modelRegistry');
    const userCount = await User.countDocuments({});
    if (userCount === 0) {
      console.log('[Server] Database is unpopulated. Auto-running initial seeder...');
      const { seedData } = require('./seeder');
      await seedData(false);
    }

    const server = app.listen(PORT, () => {
      console.log(`=======================================================`);
      console.log(`   TPO CONNECT — Smart Placement & Training System    `);
      console.log(`   Server Port: http://localhost:${PORT}             `);
      console.log(`   Health Check: http://localhost:${PORT}/api/health `);
      console.log(`=======================================================`);
    });

    return server;
  } catch (err) {
    console.error('[Server] Critical startup error:', err);
    process.exit(1);
  }
};

if (require.main === module) {
  startServer();
}

module.exports = app;
