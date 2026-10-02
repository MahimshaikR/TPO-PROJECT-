/**
 * TPO Connect — Application Bootstrapper & Master Router Registration
 * Registers all 70+ routes across Public, Auth, Student, Recruiter, Coordinator, and Admin Portals
 */
(function () {
  'use strict';

  async function initApp() {
    console.log('[TPO Connect] Bootstrapping client application...');

    // Initialize State & Storage
    window.State.init();

    // Fetch dynamic public website settings
    try {
      const publicSettings = await window.API.get('/settings/public');
      if (publicSettings) {
        window.State.set('settings', publicSettings);
      }
    } catch (err) {
      console.warn('[TPO Connect] Using default settings, error loading from API:', err);
    }

    const router = window.Router;

    // ==========================================
    // 1. PUBLIC WEBSITE ROUTES
    // ==========================================
    router.addRoute('/', () => window.HomePage.render(), { title: 'Home — Smart Training & Placement' });
    router.addRoute('/about', () => window.AboutPage.render(), { title: 'About T&P Cell' });
    router.addRoute('/placements', () => window.PlacementsPage.render(), { title: 'Placement Drives' });
    router.addRoute('/placements/drives', () => window.PlacementsPage.render(), { title: 'Placement Drives' });
    router.addRoute('/placements/drives/:id', (p) => window.DriveDetailPage.render(p), { title: 'Placement Drive Details' });
    router.addRoute('/drives/:id', (p) => window.DriveDetailPage.render(p), { title: 'Placement Drive Details' });
    router.addRoute('/companies', () => window.CompaniesPage.render(), { title: 'Recruiting Companies' });
    router.addRoute('/companies/:id', (p) => window.CompanyDetailPage.render(p), { title: 'Company Details' });
    router.addRoute('/training', () => window.TrainingPage.render(), { title: 'Skill Training Programs' });
    router.addRoute('/training/:id', (p) => window.TrainingDetailPage.render(p), { title: 'Training Program Details' });
    router.addRoute('/internships', () => window.InternshipsPage.render(), { title: 'Internship Opportunities' });
    router.addRoute('/internships/:id', (p) => window.InternshipDetailPage.render(p), { title: 'Internship Details' });
    router.addRoute('/students', () => window.StudentsPage.render(), { title: 'Student Directory' });
    router.addRoute('/recruiters', () => window.RecruitersPage.render(), { title: 'Recruiter Partnerships' });
    router.addRoute('/achievements', () => window.AchievementsPage.render(), { title: 'Achievements & Milestones' });
    router.addRoute('/success-stories', () => window.SuccessStoriesPage.render(), { title: 'Student Success Stories' });
    router.addRoute('/events', () => window.EventsPage.render(), { title: 'Placement Events & Calendar' });
    router.addRoute('/events/:id', (p) => window.EventDetailPage.render(p), { title: 'Event Details' });
    router.addRoute('/resources', () => window.ResourcesPage.render(), { title: 'Preparation Resources' });
    router.addRoute('/resources/:id', (p) => window.ResourceDetailPage.render(p), { title: 'Resource Details' });
    router.addRoute('/reports', () => window.ReportsPage.render(), { title: 'Placement Statistics & Reports' });
    router.addRoute('/gallery', () => window.GalleryPage.render(), { title: 'Campus Placement Gallery' });
    router.addRoute('/gallery/:id', (p) => window.GalleryPage.render(p), { title: 'Campus Placement Gallery' });
    router.addRoute('/announcements', () => window.AnnouncementsPage.render(), { title: 'Official Announcements' });
    router.addRoute('/announcements/:id', (p) => window.AnnouncementDetailPage.render(p), { title: 'Announcement Details' });
    router.addRoute('/career-guidance', () => window.CareerGuidancePage.render(), { title: 'Career Guidance & Counseling' });
    router.addRoute('/contact', () => window.ContactPage.render(), { title: 'Contact T&P Office' });
    router.addRoute('/faq', () => window.FAQPage.render(), { title: 'Frequently Asked Questions' });
    router.addRoute('/feedback', () => window.FeedbackPage.render(), { title: 'Student & Recruiter Feedback' });
    router.addRoute('/grievance', () => window.GrievancePage.render(), { title: 'Placement Grievance Redressal' });
    router.addRoute('/recruit-with-us', () => window.RecruitWithUsPage.render(), { title: 'Corporate Invitation — Recruit With Us' });
    router.addRoute('/team', () => window.TeamPage.render(), { title: 'T&P Team & Department Coordinators' });
    router.addRoute('/testimonials', () => window.TestimonialsPage.render(), { title: 'Student, Recruiter & Alumni Testimonials' });
    router.addRoute('/downloads', () => window.DownloadsPage.render(), { title: 'Downloads & Official Documents' });
    router.addRoute('/alumni', () => window.AlumniPage.render(), { title: 'Alumni Network & Mentorship' });
    router.addRoute('/hackathons', () => window.HackathonsPage.render(), { title: 'Hackathons & Collegiate Challenges' });

    // ==========================================
    // 2. AUTHENTICATION ROUTES
    // ==========================================
    router.addRoute('/login', () => window.AuthPage.renderLogin('ALL'), { title: 'Portal Login' });
    router.addRoute('/student/login', () => window.AuthPage.renderLogin('STUDENT'), { title: 'Student Login' });
    router.addRoute('/recruiter/login', () => window.AuthPage.renderLogin('RECRUITER'), { title: 'Recruiter Login' });
    router.addRoute('/coordinator/login', () => window.AuthPage.renderLogin('COORDINATOR'), { title: 'Coordinator Login' });
    router.addRoute('/admin/login', () => window.AuthPage.renderLogin('ADMIN'), { title: 'T&P Officer Login' });
    router.addRoute('/register/student', () => window.AuthPage.renderRegister('STUDENT'), { title: 'Student Registration' });
    router.addRoute('/register/recruiter', () => window.AuthPage.renderRegister('RECRUITER'), { title: 'Recruiter Company Registration' });
    router.addRoute('/forgot-password', () => window.AuthPage.renderForgotPassword(), { title: 'Reset Account Password' });
    router.addRoute('/reset-password/:token', (p) => window.AuthPage.renderResetPassword(p.token), { title: 'Choose New Password' });

    // ==========================================
    // 3. STUDENT PORTAL (Role: STUDENT)
    // ==========================================
    const studentOpts = { authRequired: true, roles: ['STUDENT'], title: 'Student Portal' };
    router.addRoute('/student/dashboard', () => window.StudentPortal.render('dashboard'), studentOpts);
    router.addRoute('/student/profile', () => window.StudentPortal.render('profile'), studentOpts);
    router.addRoute('/student/academic', () => window.StudentPortal.render('academic'), studentOpts);
    router.addRoute('/student/skills', () => window.StudentPortal.render('skills'), studentOpts);
    router.addRoute('/student/certifications', () => window.StudentPortal.render('certifications'), studentOpts);
    router.addRoute('/student/projects', () => window.StudentPortal.render('projects'), studentOpts);
    router.addRoute('/student/internships', () => window.StudentPortal.render('internships'), studentOpts);
    router.addRoute('/student/resume', () => window.StudentPortal.render('resume'), studentOpts);
    router.addRoute('/student/drives', () => window.StudentPortal.render('drives'), studentOpts);
    router.addRoute('/student/drives/:id', (p) => window.StudentPortal.render('drive-detail', p), studentOpts);
    router.addRoute('/student/applications', () => window.StudentPortal.render('applications'), studentOpts);
    router.addRoute('/student/applications/:id', (p) => window.StudentPortal.render('application-detail', p), studentOpts);
    router.addRoute('/student/interviews', () => window.StudentPortal.render('interviews'), studentOpts);
    router.addRoute('/student/selection', () => window.StudentPortal.render('selection'), studentOpts);
    router.addRoute('/student/training', () => window.StudentPortal.render('training'), studentOpts);
    router.addRoute('/student/training/:id', (p) => window.StudentPortal.render('training-detail', p), studentOpts);
    router.addRoute('/student/attendance', () => window.StudentPortal.render('attendance'), studentOpts);
    router.addRoute('/student/resources', () => window.StudentPortal.render('resources'), studentOpts);
    router.addRoute('/student/notifications', () => window.StudentPortal.render('notifications'), studentOpts);
    router.addRoute('/student/settings', () => window.StudentPortal.render('settings'), studentOpts);

    // ==========================================
    // 4. RECRUITER PORTAL (Role: RECRUITER)
    // ==========================================
    const recruiterOpts = { authRequired: true, roles: ['RECRUITER'], title: 'Recruiter Portal' };
    router.addRoute('/recruiter/dashboard', () => window.RecruiterPortal.render('dashboard'), recruiterOpts);
    router.addRoute('/recruiter/profile', () => window.RecruiterPortal.render('profile'), recruiterOpts);
    router.addRoute('/recruiter/company', () => window.RecruiterPortal.render('company'), recruiterOpts);
    router.addRoute('/recruiter/drives', () => window.RecruiterPortal.render('drives'), recruiterOpts);
    router.addRoute('/recruiter/drives/create', () => window.RecruiterPortal.render('create-drive'), recruiterOpts);
    router.addRoute('/recruiter/drives/:id', (p) => window.RecruiterPortal.render('drive-detail', p), recruiterOpts);
    router.addRoute('/recruiter/drives/:id/edit', (p) => window.RecruiterPortal.render('edit-drive', p), recruiterOpts);
    router.addRoute('/recruiter/applications', () => window.RecruiterPortal.render('applications'), recruiterOpts);
    router.addRoute('/recruiter/applications/:id', (p) => window.RecruiterPortal.render('application-detail', p), recruiterOpts);
    router.addRoute('/recruiter/shortlisted', () => window.RecruiterPortal.render('shortlisted'), recruiterOpts);
    router.addRoute('/recruiter/interviews', () => window.RecruiterPortal.render('interviews'), recruiterOpts);
    router.addRoute('/recruiter/selected', () => window.RecruiterPortal.render('selected'), recruiterOpts);
    router.addRoute('/recruiter/notifications', () => window.RecruiterPortal.render('notifications'), recruiterOpts);
    router.addRoute('/recruiter/settings', () => window.RecruiterPortal.render('settings'), recruiterOpts);

    // ==========================================
    // 5. COORDINATOR PORTAL (Roles: COORDINATOR, TP_COORDINATOR, DEPARTMENT_COORDINATOR)
    // ==========================================
    const coordOpts = { 
      authRequired: true, 
      roles: ['COORDINATOR', 'TP_COORDINATOR', 'DEPARTMENT_COORDINATOR', 'ADMIN', 'TP_OFFICER', 'SUPER_ADMIN', 'MANAGEMENT_PRINCIPAL'], 
      title: 'Coordinator Portal' 
    };
    router.addRoute('/coordinator/dashboard', () => window.CoordinatorPortal.render('dashboard'), coordOpts);
    router.addRoute('/coordinator/students', () => window.CoordinatorPortal.render('students'), coordOpts);
    router.addRoute('/coordinator/students/:id', (p) => window.CoordinatorPortal.render('students', p), coordOpts);
    router.addRoute('/coordinator/drives', () => window.CoordinatorPortal.render('drives'), coordOpts);
    router.addRoute('/coordinator/applications', () => window.CoordinatorPortal.render('applications'), coordOpts);
    router.addRoute('/coordinator/attendance', () => window.CoordinatorPortal.render('attendance'), coordOpts);
    router.addRoute('/coordinator/training', () => window.CoordinatorPortal.render('training'), coordOpts);
    router.addRoute('/coordinator/interviews', () => window.CoordinatorPortal.render('interviews'), coordOpts);
    router.addRoute('/coordinator/selections', () => window.CoordinatorPortal.render('selections'), coordOpts);
    router.addRoute('/coordinator/reports', () => window.CoordinatorPortal.render('reports'), coordOpts);
    router.addRoute('/coordinator/notifications', () => window.CoordinatorPortal.render('notifications'), coordOpts);

    // ==========================================
    // 6. ADMIN PORTAL (Roles: ADMIN, TP_OFFICER, SUPER_ADMIN, MANAGEMENT_PRINCIPAL)
    // ==========================================
    const adminOpts = { 
      authRequired: true, 
      roles: ['ADMIN', 'TP_OFFICER', 'SUPER_ADMIN', 'MANAGEMENT_PRINCIPAL'], 
      title: 'Admin Portal' 
    };
    router.addRoute('/admin/dashboard', () => window.AdminPortal.render('dashboard'), adminOpts);
    router.addRoute('/admin/students', () => window.AdminPortal.render('students'), adminOpts);
    router.addRoute('/admin/students/:id', (p) => window.AdminPortal.render('students', p), adminOpts);
    router.addRoute('/admin/companies', () => window.AdminPortal.render('companies'), adminOpts);
    router.addRoute('/admin/companies/:id', (p) => window.AdminPortal.render('companies', p), adminOpts);
    router.addRoute('/admin/recruiters', () => window.AdminPortal.render('recruiters'), adminOpts);
    router.addRoute('/admin/recruiters/:id', (p) => window.AdminPortal.render('recruiters', p), adminOpts);
    router.addRoute('/admin/drives', () => window.AdminPortal.render('drives'), adminOpts);
    router.addRoute('/admin/drives/create', () => window.AdminPortal.render('drives', { action: 'create' }), adminOpts);
    router.addRoute('/admin/drives/:id', (p) => window.AdminPortal.render('drives', p), adminOpts);
    router.addRoute('/admin/drives/:id/edit', (p) => window.AdminPortal.render('drives', { ...p, action: 'edit' }), adminOpts);
    router.addRoute('/admin/eligibility', () => window.AdminPortal.render('eligibility'), adminOpts);
    router.addRoute('/admin/applications', () => window.AdminPortal.render('applications'), adminOpts);
    router.addRoute('/admin/applications/:id', (p) => window.AdminPortal.render('applications', p), adminOpts);
    router.addRoute('/admin/attendance', () => window.AdminPortal.render('attendance'), adminOpts);
    router.addRoute('/admin/interviews', () => window.AdminPortal.render('interviews'), adminOpts);
    router.addRoute('/admin/selections', () => window.AdminPortal.render('selections'), adminOpts);
    router.addRoute('/admin/training', () => window.AdminPortal.render('training'), adminOpts);
    router.addRoute('/admin/training/create', () => window.AdminPortal.render('training', { action: 'create' }), adminOpts);
    router.addRoute('/admin/training/:id', (p) => window.AdminPortal.render('training', p), adminOpts);
    router.addRoute('/admin/internships', () => window.AdminPortal.render('internships'), adminOpts);
    router.addRoute('/admin/industry-events', () => window.AdminPortal.render('events'), adminOpts);
    router.addRoute('/admin/announcements', () => window.AdminPortal.render('announcements'), adminOpts);
    router.addRoute('/admin/notifications', () => window.AdminPortal.render('notifications'), adminOpts);
    router.addRoute('/admin/resources', () => window.AdminPortal.render('resources'), adminOpts);
    router.addRoute('/admin/evidence', () => window.EvidencePage.render(), adminOpts);
    router.addRoute('/admin/gallery', () => window.AdminPortal.render('gallery'), adminOpts);
    router.addRoute('/admin/achievements', () => window.AdminPortal.render('achievements'), adminOpts);
    router.addRoute('/admin/success-stories', () => window.AdminPortal.render('success-stories'), adminOpts);
    router.addRoute('/admin/reports', () => window.AdminPortal.render('reports'), adminOpts);
    router.addRoute('/admin/analytics', () => window.AdminPortal.render('analytics'), adminOpts);
    router.addRoute('/admin/users', () => window.AdminPortal.render('users'), adminOpts);
    router.addRoute('/admin/roles', () => window.AdminPortal.render('users'), adminOpts);
    router.addRoute('/admin/audit-logs', () => window.AdminPortal.render('audit-logs'), adminOpts);
    router.addRoute('/admin/content', () => window.AdminPortal.render('content'), adminOpts);
    router.addRoute('/admin/faq', () => window.AdminPortal.render('faq'), adminOpts);
    router.addRoute('/admin/feedback', () => window.AdminPortal.render('feedback'), adminOpts);
    router.addRoute('/admin/grievances', () => window.AdminPortal.render('grievances'), adminOpts);
    router.addRoute('/admin/settings', () => window.AdminPortal.render('settings'), adminOpts);

    // ==========================================
    // 7. NOT FOUND FALLBACK
    // ==========================================
    router.addRoute('/404', () => window.NotFoundPage.render(), { title: 'Page Not Found' });

    // Re-render navbar whenever auth state changes
    window.State.on('auth:change', () => {
      window.UI?.renderNavbar(window.location.pathname);
    });

    // Handle initial route
    const initialPath = window.location.pathname || '/';
    console.log('[TPO Connect] Navigating to initial route:', initialPath);
    await router.handleRoute(initialPath);
  }

  // Launch when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
})();
