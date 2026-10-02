const { createModel } = require('./dbAdapter');

const User = createModel('User', {
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['STUDENT', 'RECRUITER', 'COORDINATOR', 'ADMIN', 'TP_OFFICER', 'SUPER_ADMIN', 'TP_COORDINATOR', 'DEPARTMENT_COORDINATOR', 'MANAGEMENT_PRINCIPAL'],
    default: 'STUDENT'
  },
  avatar: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  isApproved: { type: Boolean, default: true },
  lastLogin: { type: Date },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date }
});

const Student = createModel('Student', {
  userId: { type: String, required: true, unique: true },
  rollNumber: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, default: '' },
  branch: { type: String, required: true },
  batch: { type: String, required: true },
  academicYear: { type: String, default: '2026-27' },
  cgpa: { type: Number, required: true, default: 0 },
  backlogs: { type: Number, default: 0 },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], default: 'Male' },
  dob: { type: String, default: '' },
  address: { type: String, default: '' },
  tenthPercentage: { type: Number, default: 0 },
  twelfthPercentage: { type: Number, default: 0 },
  skills: [{ type: String }],
  certifications: [{
    name: String,
    issuer: String,
    issueDate: String,
    credentialUrl: String
  }],
  projects: [{
    title: String,
    techStack: String,
    description: String,
    githubUrl: String,
    liveUrl: String
  }],
  internships: [{
    company: String,
    role: String,
    duration: String,
    stipend: String,
    description: String,
    certificateUrl: String
  }],
  resumeUrl: { type: String, default: '' },
  resumeOriginalName: { type: String, default: '' },
  resumeUpdatedAt: { type: Date },
  linkedinUrl: { type: String, default: '' },
  githubUrl: { type: String, default: '' },
  portfolioUrl: { type: String, default: '' },
  placementStatus: {
    type: String,
    enum: ['UNPLACED', 'REGISTERED', 'PLACED', 'OPTED_OUT', 'HIGHER_STUDIES'],
    default: 'UNPLACED'
  },
  placedCompany: { type: String, default: '' },
  placedPackage: { type: Number, default: 0 },
  offerLetters: [{
    company: String,
    packageLpa: Number,
    designation: String,
    issueDate: String,
    fileUrl: String
  }],
  preferences: {
    preferredRoles: [String],
    preferredLocations: [String],
    willingToRelocate: { type: Boolean, default: true }
  }
});

const Recruiter = createModel('Recruiter', {
  userId: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, default: '' },
  companyId: { type: String, default: '' },
  companyName: { type: String, default: '' },
  designation: { type: String, default: 'HR Manager' },
  officialEmail: { type: String, default: '' },
  isVerified: { type: Boolean, default: false },
  status: {
    type: String,
    enum: ['PENDING', 'APPROVED', 'REJECTED'],
    default: 'PENDING'
  }
});

const Company = createModel('Company', {
  name: { type: String, required: true, unique: true },
  logo: { type: String, default: '' },
  website: { type: String, default: '' },
  industry: { type: String, default: 'Information Technology' },
  description: { type: String, default: '' },
  headOffice: { type: String, default: 'Bengaluru, India' },
  contactEmail: { type: String, default: '' },
  contactPhone: { type: String, default: '' },
  tier: {
    type: String,
    enum: ['TIER_1', 'TIER_2', 'TIER_3', 'MASS'],
    default: 'TIER_1'
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'INACTIVE'],
    default: 'ACTIVE'
  },
  totalOffersCount: { type: Number, default: 0 },
  highestPackageOffered: { type: Number, default: 0 },
  averagePackageOffered: { type: Number, default: 0 }
});

const Drive = createModel('Drive', {
  title: { type: String, required: true },
  companyId: { type: String, required: true },
  companyName: { type: String, default: '' },
  companyLogo: { type: String, default: '' },
  jobRole: { type: String, required: true },
  jobType: {
    type: String,
    enum: ['FULL_TIME', 'INTERNSHIP', 'INTERN_FULL_TIME'],
    default: 'FULL_TIME'
  },
  description: { type: String, default: '' },
  packageLpa: { type: Number, required: true },
  stipendMonthly: { type: Number, default: 0 },
  location: { type: String, default: 'Pan India / Hybrid' },
  venue: { type: String, default: 'Campus Auditorium & Online Test Labs' },
  vacancies: { type: Number, default: 10 },
  eligibility: {
    branches: [{ type: String }],
    batch: [{ type: String }],
    minCgpa: { type: Number, default: 6.5 },
    maxBacklogs: { type: Number, default: 0 },
    genderPreference: { type: String, default: 'All' }
  },
  selectionProcess: [{ type: String }],
  requiredDocuments: [{ type: String }],
  driveDate: { type: String, required: true },
  deadline: { type: String, required: true },
  status: {
    type: String,
    enum: ['DRAFT', 'UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED'],
    default: 'UPCOMING'
  },
  createdBy: { type: String }
});

const Application = createModel('Application', {
  studentId: { type: String, required: true },
  driveId: { type: String, required: true },
  companyId: { type: String, required: true },
  appliedDate: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: [
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
    default: 'REGISTERED'
  },
  currentRound: { type: String, default: 'Online Assessment' },
  notes: { type: String, default: '' },
  feedback: { type: String, default: '' }
});

const Attendance = createModel('Attendance', {
  driveId: { type: String, required: true },
  roundName: { type: String, required: true },
  studentId: { type: String, required: true },
  isPresent: { type: Boolean, default: true },
  markedAt: { type: Date, default: Date.now },
  markedBy: { type: String }
});

const Interview = createModel('Interview', {
  driveId: { type: String, required: true },
  applicationId: { type: String, required: true },
  studentId: { type: String, required: true },
  companyId: { type: String, required: true },
  roundName: { type: String, required: true },
  roundNumber: { type: Number, default: 1 },
  scheduledAt: { type: String, required: true },
  mode: {
    type: String,
    enum: ['ONLINE', 'OFFLINE'],
    default: 'ONLINE'
  },
  venueOrLink: { type: String, default: 'Google Meet' },
  status: {
    type: String,
    enum: ['SCHEDULED', 'COMPLETED', 'CANCELLED', 'RESCHEDULED'],
    default: 'SCHEDULED'
  },
  feedback: { type: String, default: '' },
  interviewer: { type: String, default: 'Technical Panel' }
});

const Selection = createModel('Selection', {
  driveId: { type: String, required: true },
  applicationId: { type: String, required: true },
  studentId: { type: String, required: true },
  companyId: { type: String, required: true },
  packageLpa: { type: Number, required: true },
  designation: { type: String, required: true },
  offerLetterUrl: { type: String, default: '' },
  selectionDate: { type: String, required: true },
  status: {
    type: String,
    enum: ['OFFERED', 'ACCEPTED', 'DECLINED', 'JOINED'],
    default: 'OFFERED'
  },
  academicYear: { type: String, default: '2026-27' }
});

const Training = createModel('Training', {
  title: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  category: {
    type: String,
    enum: ['APTITUDE', 'TECHNICAL', 'SOFT_SKILLS', 'INTERVIEW_PREP', 'WORKSHOP', 'BOOTCAMP'],
    default: 'TECHNICAL'
  },
  description: { type: String, default: '' },
  instructor: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  targetBranches: [{ type: String }],
  targetBatches: [{ type: String }],
  venue: { type: String, default: 'Seminar Hall 1 / Virtual Classroom' },
  status: {
    type: String,
    enum: ['UPCOMING', 'ACTIVE', 'COMPLETED', 'CANCELLED'],
    default: 'ACTIVE'
  },
  syllabus: [{ type: String }],
  totalHours: { type: Number, default: 40 }
});

const TrainingSession = createModel('TrainingSession', {
  trainingId: { type: String, required: true },
  title: { type: String, required: true },
  sessionDate: { type: String, required: true },
  startTime: { type: String, default: '10:00 AM' },
  endTime: { type: String, default: '12:00 PM' },
  topic: { type: String, default: '' },
  venue: { type: String, default: 'Lab 4' }
});

const TrainingAttendance = createModel('TrainingAttendance', {
  trainingId: { type: String, required: true },
  sessionId: { type: String, required: true },
  studentId: { type: String, required: true },
  isPresent: { type: Boolean, default: true },
  markedAt: { type: Date, default: Date.now }
});

const Internship = createModel('Internship', {
  title: { type: String, required: true },
  company: { type: String, required: true },
  stipend: { type: String, default: '₹25,000 / month' },
  duration: { type: String, default: '6 Months' },
  location: { type: String, default: 'Bangalore / Remote' },
  type: {
    type: String,
    enum: ['SUMMER', 'WINTER', 'SEMESTER_LONG', 'REMOTE'],
    default: 'SEMESTER_LONG'
  },
  applyLink: { type: String, default: '' },
  deadline: { type: String, required: true },
  branches: [{ type: String }],
  description: { type: String, default: '' },
  requirements: [{ type: String }],
  status: {
    type: String,
    enum: ['ACTIVE', 'CLOSED'],
    default: 'ACTIVE'
  }
});

const Event = createModel('Event', {
  title: { type: String, required: true },
  category: {
    type: String,
    enum: ['INDUSTRY_VISIT', 'GUEST_LECTURE', 'WORKSHOP', 'CORPORATE_TRAINING', 'MOU_SIGNING', 'EXPERT_SESSION', 'JOB_FAIR', 'HACKATHON'],
    default: 'WORKSHOP'
  },
  speakerOrGuest: { type: String, default: '' },
  organization: { type: String, default: '' },
  eventDate: { type: String, required: true },
  time: { type: String, default: '10:00 AM' },
  venue: { type: String, default: 'Auditorium' },
  description: { type: String, default: '' },
  bannerImage: { type: String, default: '' },
  registrationLink: { type: String, default: '' },
  isPublic: { type: Boolean, default: true }
});

const Announcement = createModel('Announcement', {
  title: { type: String, required: true },
  category: {
    type: String,
    enum: ['GENERAL', 'DRIVE', 'TRAINING', 'EXAM', 'POLICY', 'IMPORTANT'],
    default: 'GENERAL'
  },
  content: { type: String, required: true },
  targetAudience: {
    type: String,
    enum: ['ALL', 'STUDENTS', 'RECRUITERS', 'COORDINATORS'],
    default: 'ALL'
  },
  priority: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
    default: 'MEDIUM'
  },
  isPublished: { type: Boolean, default: true },
  expiresAt: { type: String },
  attachments: [{
    name: String,
    url: String
  }],
  createdBy: { type: String }
});

const Notification = createModel('Notification', {
  recipientId: { type: String, default: 'ALL' },
  recipientRole: { type: String, default: 'ALL' },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: {
    type: String,
    enum: ['DRIVE', 'INTERVIEW', 'SELECTION', 'TRAINING', 'ANNOUNCEMENT', 'DEADLINE', 'SYSTEM'],
    default: 'SYSTEM'
  },
  link: { type: String, default: '' },
  isRead: { type: Boolean, default: false }
});

const Resource = createModel('Resource', {
  title: { type: String, required: true },
  category: {
    type: String,
    enum: ['APTITUDE', 'CODING', 'TECHNICAL', 'HR', 'RESUME', 'COMPANY_PREPARATION', 'PREVIOUS_PAPERS', 'COMMUNICATION'],
    default: 'TECHNICAL'
  },
  description: { type: String, default: '' },
  fileUrl: { type: String, default: '' },
  externalLink: { type: String, default: '' },
  tags: [{ type: String }],
  isPublished: { type: Boolean, default: true },
  downloadsCount: { type: Number, default: 0 }
});

const Gallery = createModel('Gallery', {
  title: { type: String, required: true },
  category: {
    type: String,
    enum: ['PLACEMENT', 'TRAINING', 'COMPANY_VISIT', 'GUEST_LECTURE', 'JOB_FAIR', 'HACKATHON', 'AWARDS'],
    default: 'PLACEMENT'
  },
  imageUrl: { type: String, required: true },
  caption: { type: String, default: '' },
  eventDate: { type: String, default: '2026-09-15' },
  isFeatured: { type: Boolean, default: false }
});

const Achievement = createModel('Achievement', {
  studentName: { type: String, required: true },
  rollNumber: { type: String, required: true },
  branch: { type: String, required: true },
  batch: { type: String, required: true },
  companyName: { type: String, required: true },
  companyLogo: { type: String, default: '' },
  packageLpa: { type: Number, required: true },
  role: { type: String, default: 'Software Engineer' },
  photoUrl: { type: String, default: '' },
  badge: { type: String, default: 'Super Dream Offer' },
  year: { type: String, default: '2026-27' },
  isFeatured: { type: Boolean, default: true }
});

const SuccessStory = createModel('SuccessStory', {
  studentName: { type: String, required: true },
  batch: { type: String, required: true },
  branch: { type: String, required: true },
  currentCompany: { type: String, required: true },
  designation: { type: String, default: 'Senior Software Engineer' },
  packageLpa: { type: Number, default: 24 },
  testimonial: { type: String, required: true },
  photoUrl: { type: String, default: '' },
  videoUrl: { type: String, default: '' },
  linkedinUrl: { type: String, default: '' },
  isFeatured: { type: Boolean, default: true }
});

const FAQ = createModel('FAQ', {
  question: { type: String, required: true },
  answer: { type: String, required: true },
  category: {
    type: String,
    enum: ['STUDENTS', 'RECRUITERS', 'POLICY', 'TRAINING', 'GENERAL'],
    default: 'GENERAL'
  },
  order: { type: Number, default: 0 },
  isPublished: { type: Boolean, default: true }
});

const Feedback = createModel('Feedback', {
  name: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, default: 'Student' },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  rating: { type: Number, default: 5 },
  status: {
    type: String,
    enum: ['NEW', 'REVIEWED', 'ARCHIVED'],
    default: 'NEW'
  },
  response: { type: String, default: '' }
});

const Grievance = createModel('Grievance', {
  ticketNumber: { type: String, required: true, unique: true },
  studentName: { type: String, required: true },
  rollNumber: { type: String, required: true },
  email: { type: String, required: true },
  category: {
    type: String,
    enum: ['DRIVE', 'ELIGIBILITY', 'ATTENDANCE', 'TRAINING', 'GENERAL'],
    default: 'GENERAL'
  },
  description: { type: String, required: true },
  status: {
    type: String,
    enum: ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'],
    default: 'OPEN'
  },
  adminRemarks: { type: String, default: '' },
  resolvedAt: { type: Date }
});

const Settings = createModel('Settings', {
  collegeName: { type: String, default: 'NRIIT ENGINEERING COLLEGE' },
  collegeLogo: { type: String, default: '/assets/images/nriit-logo.png' },
  favicon: { type: String, default: '/assets/images/nriit-logo.png' },
  departmentName: { type: String, default: 'Training and Placement Cell' },
  tagline: { type: String, default: 'A POWERHOUSE OF TECHNOLOGY' },
  heroTitle: { type: String, default: 'Your Future\nOur Commitment' },
  heroSubtitle: { type: String, default: 'Empowering Students. Enabling Opportunities. Building Successful Careers at NRIIT.' },
  officerName: { type: String, default: 'Dr. Rajesh Kumar' },
  officerDesignation: { type: String, default: 'Head - Training & Placement' },
  officerPhoto: { type: String, default: '/assets/images/officer.jpg' },
  officerMessage: { type: String, default: 'Welcome to TPO Connect at NRIIT Engineering College. Our dedicated cell works relentlessly round the year to provide world-class career opportunities for our students and seamless recruitment drives for corporate partners.' },
  primaryContact: { type: String, default: '+91 98765 43210' },
  email: { type: String, default: 'placements@nriit.edu.in' },
  phone: { type: String, default: '+91 866 2469666' },
  officeAddress: { type: String, default: 'NRI Institute of Technology, Pothavarappadu (V), Agiripalli (M), Vijayawada Rural, Eluru District, Andhra Pradesh - 521212' },
  workingHours: { type: String, default: 'Monday - Friday: 9:00 AM - 5:30 PM, Saturday: 9:00 AM - 1:00 PM' },
  googleMapsUrl: { type: String, default: 'https://maps.google.com/?q=Vijayawada' },
  socialLinks: {
    facebook: { type: String, default: 'https://facebook.com/nriit' },
    instagram: { type: String, default: 'https://instagram.com/nriit' },
    linkedin: { type: String, default: 'https://linkedin.com/school/nriit' },
    youtube: { type: String, default: 'https://youtube.com/nriit' },
    twitter: { type: String, default: 'https://twitter.com/nriit' },
    collegeWebsite: { type: String, default: 'https://nriit.edu.in' }
  },
  footerText: { type: String, default: '© 2026 NRIIT ENGINEERING COLLEGE. Autonomous | NAAC A+ | NBA Accredited. All rights reserved.' },
  maintenanceMode: { type: Boolean, default: false },
  academicYears: [{ type: String }],
  branches: [{ type: String }],
  placementStatuses: [{ type: String }],
  applicationStatuses: [{ type: String }],
  trainingCategories: [{ type: String }]
});

const AuditLog = createModel('AuditLog', {
  action: { type: String, required: true },
  performedBy: {
    userId: String,
    name: String,
    email: String,
    role: String
  },
  targetModel: { type: String, default: '' },
  targetId: { type: String, default: '' },
  ipAddress: { type: String, default: '127.0.0.1' },
  details: { type: Object, default: {} },
  timestamp: { type: Date, default: Date.now }
});

const TeamMember = createModel('TeamMember', {
  name: { type: String, required: true },
  position: { type: String, required: true },
  role: { type: String, default: 'COORDINATOR' },
  department: { type: String, default: 'Training & Placement' },
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
  linkedin: { type: String, default: '' },
  photoUrl: { type: String, default: '' },
  bio: { type: String, default: '' },
  officeHours: { type: String, default: '' },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
});

const Testimonial = createModel('Testimonial', {
  name: { type: String, required: true },
  type: { type: String, enum: ['STUDENT', 'ALUMNI', 'RECRUITER'], default: 'STUDENT' },
  role: { type: String, default: '' },
  company: { type: String, default: '' },
  department: { type: String, default: '' },
  batch: { type: String, default: '' },
  packageLpa: { type: Number, default: 0 },
  quote: { type: String, required: true },
  rating: { type: Number, default: 5 },
  photoUrl: { type: String, default: '' },
  isPublished: { type: Boolean, default: true }
});

const Alumni = createModel('Alumni', {
  fullName: { type: String, required: true },
  email: { type: String, default: '' },
  graduationYear: { type: String, required: true },
  department: { type: String, required: true },
  company: { type: String, required: true },
  designation: { type: String, required: true },
  location: { type: String, default: '' },
  photoUrl: { type: String, default: '' },
  linkedinUrl: { type: String, default: '' },
  skills: [{ type: String }],
  bio: { type: String, default: '' },
  isMentor: { type: Boolean, default: true },
  mentorshipTopics: [{ type: String }],
  sessionsCount: { type: Number, default: 0 }
});

const Hackathon = createModel('Hackathon', {
  title: { type: String, required: true },
  organizer: { type: String, default: 'T&P Innovation Hub' },
  category: { type: String, default: 'Coding' },
  mode: { type: String, default: 'Online' },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  registrationDeadline: { type: String, required: true },
  teamSizeMin: { type: Number, default: 1 },
  teamSizeMax: { type: Number, default: 4 },
  prizePool: { type: String, default: '' },
  description: { type: String, default: '' },
  problemStatements: [{ type: String }],
  rules: [{ type: String }],
  eligibility: { type: String, default: 'Open to all engineering students' },
  bannerUrl: { type: String, default: '' },
  status: { type: String, default: 'ACTIVE' },
  registeredTeamsCount: { type: Number, default: 0 },
  winners: [{ rank: Number, teamName: String, members: String, projectTitle: String }]
});

const Evidence = createModel('Evidence', {
  academicYear: { type: String, required: true },
  department: { type: String, required: true },
  activityType: { type: String, required: true },
  title: { type: String, required: true },
  activityDate: { type: String, required: true },
  responsiblePerson: { type: String, required: true },
  responsibleRole: { type: String, default: 'Coordinator' },
  documentUrl: { type: String, default: '' },
  documentName: { type: String, default: '' },
  criteriaTag: { type: String, default: 'NAAC / NBA Criteria 5' },
  status: { type: String, enum: ['DRAFT', 'SUBMITTED', 'VERIFIED', 'AUDITED'], default: 'VERIFIED' },
  verifiedBy: { type: String, default: '' },
  remarks: { type: String, default: '' }
});

module.exports = {
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
  AuditLog,
  TeamMember,
  Testimonial,
  Alumni,
  Hackathon,
  Evidence
};
