/**
 * TPO Connect — Student Portal Controller & Sub-views
 */
window.StudentPortal = {
  async render(activeSection = 'dashboard', params = {}) {
    const app = document.getElementById('app');
    app.innerHTML = '<div class="spinner"></div>';

    try {
      const student = await window.API.get('/students/me');
      const notifications = await window.API.get('/notifications/my');
      const unreadCount = notifications.unreadCount || 0;

      const sidebarLinks = [
        { id: 'dashboard', label: 'Dashboard', icon: '📊', path: '/student/dashboard' },
        { id: 'profile', label: 'My Profile', icon: '👤', path: '/student/profile' },
        { id: 'academic', label: 'Academic Details', icon: '🎓', path: '/student/academic' },
        { id: 'skills', label: 'Skills', icon: '⚡', path: '/student/skills' },
        { id: 'certifications', label: 'Certifications', icon: '📜', path: '/student/certifications' },
        { id: 'projects', label: 'Projects', icon: '💻', path: '/student/projects' },
        { id: 'internships', label: 'Internships', icon: '💼', path: '/student/internships' },
        { id: 'resume', label: 'My Resume & ATS', icon: '📄', path: '/student/resume' },
        { id: 'drives', label: 'Eligible Drives', icon: '🏢', path: '/student/drives' },
        { id: 'applications', label: 'Applications', icon: '📝', path: '/student/applications' },
        { id: 'interviews', label: 'Interviews', icon: '🗓️', path: '/student/interviews' },
        { id: 'selection', label: 'Selection Status', icon: '🎉', path: '/student/selection' },
        { id: 'training', label: 'Training', icon: '🎯', path: '/student/training' },
        { id: 'attendance', label: 'Attendance', icon: '📋', path: '/student/attendance' },
        { id: 'resources', label: 'Resources', icon: '📚', path: '/student/resources' },
        { id: 'notifications', label: 'Notifications', icon: '🔔', path: '/student/notifications', badge: unreadCount },
        { id: 'settings', label: 'Settings', icon: '⚙️', path: '/student/settings' }
      ];

      app.innerHTML = `
        <div class="portal-wrapper">
          <!-- Student Sidebar -->
          <aside class="portal-sidebar">
            <div class="portal-sidebar-header">
              <span class="portal-role-badge">STUDENT PORTAL</span>
              <div class="portal-user-name">${window.UI.escapeHtml(student.fullName)}</div>
              <div class="portal-user-email">${student.rollNumber} • ${student.branch}</div>
            </div>

            <ul class="sidebar-menu">
              ${sidebarLinks.map(link => `
                <li>
                  <a href="${link.path}" class="sidebar-link ${activeSection === link.id ? 'active' : ''}" data-link>
                    <i>${link.icon}</i>
                    <span>${link.label}</span>
                    ${link.badge ? `<span class="sidebar-badge">${link.badge}</span>` : ''}
                  </a>
                </li>
              `).join('')}
            </ul>

            <div class="sidebar-footer">
              <button class="btn btn-outline btn-sm" style="width:100%; color:#cbd5e1; border-color:#334155;" onclick="window.AuthPage.handleLogout()">
                🚪 Sign Out
              </button>
            </div>
          </aside>

          <!-- Main Content Area -->
          <main class="portal-main" id="portal-content">
            <div class="spinner"></div>
          </main>
        </div>
      `;

      // Render the active sub-section view
      const contentEl = document.getElementById('portal-content');
      await this.renderSectionContent(activeSection, contentEl, student, params);
    } catch (err) {
      console.error(err);
      app.innerHTML = `<div class="container section"><h3>Failed to load student portal: ${err.message}</h3></div>`;
    }
  },

  async renderSectionContent(section, container, student, params) {
    if (section === 'dashboard') {
      const dash = await window.API.get('/dashboard/student');
      container.innerHTML = `
        <div class="portal-header">
          <div>
            <h1 class="portal-title">Welcome back, ${window.UI.escapeHtml(student.fullName)}!</h1>
            <div class="portal-breadcrumb">Student Portal &rsaquo; Dashboard Overview</div>
          </div>
          <div class="portal-header-actions">
            <a href="/student/drives" class="btn btn-primary btn-sm" data-link>Browse Eligible Drives</a>
          </div>
        </div>

        <div class="portal-stats-grid">
          <div class="portal-stat-card stat-blue">
            <div class="stat-info">
              <span class="stat-info-label">Eligible Drives</span>
              <span class="stat-info-value">${dash.eligibleDrivesCount || 0}</span>
            </div>
            <div class="portal-stat-icon">🏢</div>
          </div>
          <div class="portal-stat-card stat-amber">
            <div class="stat-info">
              <span class="stat-info-label">Applications</span>
              <span class="stat-info-value">${dash.appliedCount || 0}</span>
            </div>
            <div class="portal-stat-icon">📝</div>
          </div>
          <div class="portal-stat-card stat-purple">
            <div class="stat-info">
              <span class="stat-info-label">Interviews</span>
              <span class="stat-info-value">${dash.interviewsCount || 0}</span>
            </div>
            <div class="portal-stat-icon">🗓️</div>
          </div>
          <div class="portal-stat-card stat-green">
            <div class="stat-info">
              <span class="stat-info-label">Training Attendance</span>
              <span class="stat-info-value">${dash.trainingAttendancePercentage || 100}%</span>
            </div>
            <div class="portal-stat-icon">🎯</div>
          </div>
        </div>

        ${student.placementStatus === 'PLACED' ? `
          <div class="card" style="background:linear-gradient(135deg, #065f46 0%, #047857 100%); color:#ffffff; margin-bottom:2rem; padding:1.5rem; display:flex; justify-content:space-between; align-items:center;">
            <div>
              <span class="badge badge-warning" style="margin-bottom:0.4rem;">OFFICIAL PLACEMENT CONFIRMED</span>
              <h3 style="font-size:1.4rem; font-weight:800; color:#fff;">Congratulations! Placed at ${window.UI.escapeHtml(student.placedCompany)}</h3>
              <p style="opacity:0.9; font-size:0.95rem;">Annual CTC Package: <strong>₹${student.placedPackage} LPA</strong></p>
            </div>
            <a href="/student/selection" class="btn btn-secondary btn-sm" data-link>View Offer Details</a>
          </div>
        ` : ''}

        <div class="portal-grid-2">
          <div class="portal-card">
            <div class="portal-card-header">
              <h3 class="portal-card-title">🏢 Upcoming Eligible Drives</h3>
              <a href="/student/drives" style="font-size:0.85rem;" data-link>View All</a>
            </div>
            ${(dash.upcomingDrives || []).length === 0 ? '<p style="color:var(--text-muted);">No upcoming drives matching your profile currently.</p>' : `
              <div style="display:flex; flex-direction:column; gap:0.75rem;">
                ${dash.upcomingDrives.map(d => `
                  <div style="display:flex; justify-content:space-between; align-items:center; background:var(--bg-subtle); padding:0.85rem; border-radius:var(--radius-md);">
                    <div>
                      <div style="font-weight:700; color:var(--text-main); font-size:0.95rem;">${window.UI.escapeHtml(d.title)}</div>
                      <div style="font-size:0.8rem; color:var(--text-muted);">${window.UI.escapeHtml(d.jobRole)} • ₹${d.packageLpa} LPA</div>
                    </div>
                    <a href="/placements/drives/${d._id}" class="btn btn-primary btn-sm" data-link>Apply</a>
                  </div>
                `).join('')}
              </div>
            `}
          </div>

          <div class="portal-card">
            <div class="portal-card-header">
              <h3 class="portal-card-title">📢 Urgent Circulars</h3>
            </div>
            <div style="display:flex; flex-direction:column; gap:0.75rem;">
              ${(dash.latestAnnouncements || []).map(a => `
                <div style="border-left:3px solid var(--accent); padding-left:0.75rem;">
                  <div style="font-weight:700; font-size:0.88rem; color:var(--text-main);">
                    <a href="/announcements/${a._id}" data-link>${window.UI.escapeHtml(a.title)}</a>
                  </div>
                  <div style="font-size:0.75rem; color:var(--text-muted);">${window.UI.formatDate(a.createdAt)}</div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `;
    } else if (section === 'profile' || section === 'academic') {
      container.innerHTML = `
        <div class="portal-header">
          <div>
            <h1 class="portal-title">My Academic Profile</h1>
            <div class="portal-breadcrumb">Student Portal &rsaquo; Personal & Academic Information</div>
          </div>
        </div>

        <div class="card" style="max-width:800px; padding:2rem;">
          <form id="student-profile-form" onsubmit="window.StudentPortal.saveProfile(event)">
            <div class="grid grid-cols-2" style="gap:1.25rem; margin-bottom:1.25rem;">
              <div>
                <label class="filter-label">Full Name:</label>
                <input type="text" id="stu-name" class="form-input" value="${window.UI.escapeHtml(student.fullName)}" required>
              </div>
              <div>
                <label class="filter-label">Roll Number (Read-only):</label>
                <input type="text" class="form-input" value="${student.rollNumber}" disabled style="background:var(--bg-subtle);">
              </div>
            </div>

            <div class="grid grid-cols-2" style="gap:1.25rem; margin-bottom:1.25rem;">
              <div>
                <label class="filter-label">Branch:</label>
                <input type="text" class="form-input" value="${student.branch}" disabled style="background:var(--bg-subtle);">
              </div>
              <div>
                <label class="filter-label">Batch:</label>
                <input type="text" class="form-input" value="${student.batch}" disabled style="background:var(--bg-subtle);">
              </div>
            </div>

            <div class="grid grid-cols-2" style="gap:1.25rem; margin-bottom:1.25rem;">
              <div>
                <label class="filter-label">CGPA:</label>
                <input type="text" class="form-input" value="${student.cgpa}" disabled style="background:var(--bg-subtle); font-weight:700; color:var(--primary);">
              </div>
              <div>
                <label class="filter-label">Active Backlogs:</label>
                <input type="text" class="form-input" value="${student.backlogs}" disabled style="background:var(--bg-subtle); font-weight:700; color:${student.backlogs > 0 ? 'var(--danger)' : 'var(--success)'};">
              </div>
            </div>

            <div class="grid grid-cols-2" style="gap:1.25rem; margin-bottom:1.25rem;">
              <div>
                <label class="filter-label">Contact Phone:</label>
                <input type="tel" id="stu-phone" class="form-input" value="${window.UI.escapeHtml(student.phone || '')}">
              </div>
              <div>
                <label class="filter-label">Gender:</label>
                <select id="stu-gender" class="form-select">
                  <option value="Male" ${student.gender === 'Male' ? 'selected' : ''}>Male</option>
                  <option value="Female" ${student.gender === 'Female' ? 'selected' : ''}>Female</option>
                  <option value="Other" ${student.gender === 'Other' ? 'selected' : ''}>Other</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-2" style="gap:1.25rem; margin-bottom:1.25rem;">
              <div>
                <label class="filter-label">10th Grade Percentage:</label>
                <input type="number" id="stu-10th" class="form-input" step="0.1" value="${student.tenthPercentage || ''}">
              </div>
              <div>
                <label class="filter-label">12th Grade Percentage:</label>
                <input type="number" id="stu-12th" class="form-input" step="0.1" value="${student.twelfthPercentage || ''}">
              </div>
            </div>

            <div style="margin-bottom:1.5rem;">
              <label class="filter-label">Residential Address:</label>
              <textarea id="stu-address" class="form-textarea" rows="2">${window.UI.escapeHtml(student.address || '')}</textarea>
            </div>

            <button type="submit" class="btn btn-primary" id="btn-save-profile">Save Profile Changes</button>
          </form>
        </div>
      `;
    } else if (section === 'skills') {
      const currentSkills = student.skills || [];
      container.innerHTML = `
        <div class="portal-header">
          <div>
            <h1 class="portal-title">Technical Skills & Competencies</h1>
            <div class="portal-breadcrumb">Student Portal &rsaquo; Skills Portfolio</div>
          </div>
        </div>

        <div class="card" style="max-width:800px; padding:2rem;">
          <p style="font-size:0.9rem; color:var(--text-muted); margin-bottom:1.5rem;">
            List your core programming languages, frameworks, databases, and developer tools.
          </p>

          <div style="display:flex; flex-wrap:wrap; gap:0.5rem; margin-bottom:2rem;" id="skills-badge-list">
            ${currentSkills.map(s => `
              <span class="badge badge-primary" style="font-size:0.9rem; padding:0.4rem 0.8rem;">
                ${window.UI.escapeHtml(s)}
                <button type="button" style="margin-left:6px; cursor:pointer;" onclick="window.StudentPortal.removeSkill('${s}')">&times;</button>
              </span>
            `).join('')}
          </div>

          <div style="display:flex; gap:0.75rem; max-width:500px;">
            <input type="text" id="new-skill-input" class="form-input" placeholder="e.g. Docker, TypeScript, React">
            <button class="btn btn-primary" onclick="window.StudentPortal.addSkill()">Add Skill</button>
          </div>
        </div>
      `;
    } else if (section === 'resume') {
      container.innerHTML = `
        <div class="portal-header">
          <div>
            <h1 class="portal-title">My Resume & AI ATS Score</h1>
            <div class="portal-breadcrumb">Student Portal &rsaquo; Resume Management</div>
          </div>
        </div>

        <div class="grid grid-cols-2" style="gap:2rem;">
          <!-- Upload Resume Card -->
          <div class="card" style="padding:2rem;">
            <h3 style="font-size:1.25rem; font-weight:800; margin-bottom:1rem;">Official Resume File</h3>
            ${student.resumeUrl ? `
              <div style="background:var(--success-bg); border:1px solid var(--success-border); padding:1.25rem; border-radius:var(--radius-md); margin-bottom:1.5rem;">
                <div style="font-weight:700; color:#065f46; margin-bottom:0.25rem;">📄 ${window.UI.escapeHtml(student.resumeOriginalName || 'Resume.pdf')}</div>
                <div style="font-size:0.8rem; color:#047857; margin-bottom:1rem;">Last Updated: ${window.UI.formatDate(student.resumeUpdatedAt)}</div>
                <div style="display:flex; gap:0.5rem;">
                  <a href="${student.resumeUrl}" target="_blank" class="btn btn-success btn-sm">Preview Resume</a>
                  <button class="btn btn-danger btn-sm" onclick="window.StudentPortal.deleteResume()">Remove File</button>
                </div>
              </div>
            ` : `
              <div style="background:var(--warning-bg); border:1px solid var(--warning-border); padding:1rem; border-radius:var(--radius-md); margin-bottom:1.5rem; color:#b45309; font-size:0.9rem;">
                ⚠️ No resume currently uploaded. Recruiters cannot review your candidacy without an official resume.
              </div>
            `}

            <form id="resume-upload-form" onsubmit="window.StudentPortal.uploadResume(event)">
              <div style="margin-bottom:1rem;">
                <label class="filter-label">Upload New Resume (PDF / DOCX):</label>
                <input type="file" id="resume-file-input" class="form-input" accept=".pdf,.doc,.docx" required>
              </div>
              <button type="submit" class="btn btn-primary" id="btn-upload-resume">Upload & Replace Resume</button>
            </form>
          </div>

          <!-- AI ATS Scanner Card -->
          <div class="ai-score-card">
            <div class="ai-score-header">
              <span class="ai-badge">AI RESUME READINESS</span>
              <button class="btn btn-outline btn-sm" style="color:#fff; border-color:rgba(255,255,255,0.4);" onclick="window.StudentPortal.scanResume()">Re-scan</button>
            </div>
            <div id="ai-scan-content">
              <div class="ai-score-number" id="ai-score-val">88/100</div>
              <h4 style="font-size:1.1rem; font-weight:700; margin-bottom:0.5rem;">ATS Readiness: Strong</h4>
              <p style="font-size:0.85rem; color:#cbd5e1; line-height:1.6; margin-bottom:1rem;">
                Your resume satisfies high keyword relevance across Full-Stack, DSA, and Data Engineering roles.
              </p>
              <div style="font-size:0.82rem; background:rgba(255,255,255,0.1); padding:0.85rem; border-radius:var(--radius-md);">
                💡 <strong>Tip:</strong> Add metrics to your project bullet points (e.g. "Reduced API latency by 35%") to improve recruiter engagement.
              </div>
            </div>
          </div>
        </div>
      `;
    } else if (section === 'drives') {
      const drives = await window.API.get('/drives');
      container.innerHTML = `
        <div class="portal-header">
          <div>
            <h1 class="portal-title">Eligible Placement Drives</h1>
            <div class="portal-breadcrumb">Student Portal &rsaquo; Campus Recruitment Drives</div>
          </div>
        </div>

        <div class="grid grid-cols-3">
          ${drives.length === 0 ? '<p>No placement drives scheduled.</p>' : ''}
          ${drives.map(d => `
            <div class="card">
              <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.75rem;">
                <span class="badge ${d.isEligible ? 'badge-success' : 'badge-warning'}">${d.isEligible ? 'ELIGIBLE' : 'REVIEW'}</span>
                <span style="font-weight:800; color:var(--success); font-size:1.1rem;">₹${d.packageLpa} LPA</span>
              </div>
              <h3 style="font-size:1.15rem; font-weight:800; margin-bottom:0.25rem;">${window.UI.escapeHtml(d.title)}</h3>
              <p style="font-size:0.85rem; color:var(--primary); font-weight:700; margin-bottom:0.75rem;">${window.UI.escapeHtml(d.companyName)}</p>
              <div style="font-size:0.85rem; line-height:1.6; color:var(--text-muted); margin-bottom:1rem;">
                <p>💼 ${window.UI.escapeHtml(d.jobRole)}</p>
                <p>📅 Date: ${window.UI.formatDate(d.driveDate)}</p>
                <p>⏳ Deadline: ${window.UI.formatDate(d.deadline)}</p>
              </div>
              ${d.hasApplied ? `
                <button class="btn btn-secondary btn-sm" style="width:100%;" disabled>Already Applied</button>
              ` : `
                <a href="/placements/drives/${d._id}" class="btn btn-primary btn-sm" style="width:100%;" data-link>Check Criteria & Apply</a>
              `}
            </div>
          `).join('')}
        </div>
      `;
    } else if (section === 'applications') {
      const applications = await window.API.get('/applications/my');
      container.innerHTML = `
        <div class="portal-header">
          <div>
            <h1 class="portal-title">My Placement Applications</h1>
            <div class="portal-breadcrumb">Student Portal &rsaquo; Application Status History</div>
          </div>
        </div>

        <div class="card">
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Recruitment Drive</th>
                  <th>Company</th>
                  <th>Applied On</th>
                  <th>Current Round</th>
                  <th>Status</th>
                  <th>Feedback</th>
                </tr>
              </thead>
              <tbody>
                ${applications.length === 0 ? '<tr><td colspan="6" style="text-align:center;">You have not applied for any placement drives yet.</td></tr>' : ''}
                ${applications.map(app => `
                  <tr>
                    <td><strong>${window.UI.escapeHtml(app.drive?.title || 'Drive')}</strong></td>
                    <td>${window.UI.escapeHtml(app.company?.name || 'Company')}</td>
                    <td>${window.UI.formatDate(app.appliedDate)}</td>
                    <td><strong>${window.UI.escapeHtml(app.currentRound || 'Screening')}</strong></td>
                    <td>${window.UI.badge(app.status)}</td>
                    <td style="font-size:0.85rem; color:var(--text-muted);">${window.UI.escapeHtml(app.feedback || 'In process')}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;
    } else if (section === 'interviews') {
      const interviews = await window.API.get('/interviews/my');
      container.innerHTML = `
        <div class="portal-header">
          <div>
            <h1 class="portal-title">Interview Schedules</h1>
            <div class="portal-breadcrumb">Student Portal &rsaquo; Scheduled Rounds</div>
          </div>
        </div>

        <div class="card">
          ${interviews.length === 0 ? '<p style="color:var(--text-muted); padding:1rem;">No interview rounds currently scheduled.</p>' : `
            <div class="table-responsive">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Company</th>
                    <th>Round Name</th>
                    <th>Scheduled Date & Time</th>
                    <th>Mode</th>
                    <th>Venue / Meeting Link</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${interviews.map(i => `
                    <tr>
                      <td><strong>${window.UI.escapeHtml(i.company?.name || 'Company')}</strong></td>
                      <td>${window.UI.escapeHtml(i.roundName)}</td>
                      <td><strong>${i.scheduledAt}</strong></td>
                      <td>${i.mode}</td>
                      <td>
                        ${i.venueOrLink.startsWith('http') ? `
                          <a href="${i.venueOrLink}" target="_blank" class="btn btn-outline btn-sm">Join Meeting &nearr;</a>
                        ` : window.UI.escapeHtml(i.venueOrLink)}
                      </td>
                      <td>${window.UI.badge(i.status)}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          `}
        </div>
      `;
    } else if (section === 'selection') {
      const data = await window.API.get('/selections/my');
      const selections = data.selections || [];

      container.innerHTML = `
        <div class="portal-header">
          <div>
            <h1 class="portal-title">Selection Status & Job Offers</h1>
            <div class="portal-breadcrumb">Student Portal &rsaquo; Offer Letters & Formal Confirmations</div>
          </div>
        </div>

        ${selections.length === 0 ? `
          <div class="card" style="text-align:center; padding:3rem;">
            <div style="font-size:3rem; margin-bottom:1rem;">⏳</div>
            <h3 style="font-size:1.25rem; font-weight:800;">No Official Offers Recorded Yet</h3>
            <p style="color:var(--text-muted); max-width:500px; margin:0 auto 1.5rem auto;">
              Participate in upcoming campus drives and technical interviews. Your confirmed offers will appear here.
            </p>
            <a href="/student/drives" class="btn btn-primary" data-link>Browse Active Drives</a>
          </div>
        ` : `
          <div style="display:flex; flex-direction:column; gap:1.5rem;">
            ${selections.map(sel => `
              <div class="card" style="border-left:5px solid var(--success); padding:2rem;">
                <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1rem; flex-wrap:wrap; gap:1rem;">
                  <div>
                    <span class="badge badge-success" style="margin-bottom:0.5rem;">OFFER CONFIRMED</span>
                    <h2 style="font-size:1.6rem; font-weight:800; color:var(--text-main);">${window.UI.escapeHtml(sel.company?.name || 'Corporate Partner')}</h2>
                    <p style="font-size:1.05rem; color:var(--primary); font-weight:700;">${window.UI.escapeHtml(sel.designation)}</p>
                  </div>
                  <div style="text-align:right;">
                    <div style="font-size:0.85rem; color:var(--text-muted); font-weight:600;">ANNUAL CTC</div>
                    <div style="font-size:2rem; font-weight:900; color:var(--success);">₹${sel.packageLpa} LPA</div>
                  </div>
                </div>

                <div style="background:var(--bg-subtle); padding:1rem; border-radius:var(--radius-md); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem;">
                  <div>
                    <span>Status: <strong>${sel.status}</strong> | Date of Offer: <strong>${window.UI.formatDate(sel.selectionDate)}</strong></span>
                  </div>
                  <div style="display:flex; gap:0.5rem;">
                    ${sel.offerLetterUrl ? `
                      <a href="${sel.offerLetterUrl}" target="_blank" class="btn btn-outline btn-sm">Download Offer Letter (PDF)</a>
                    ` : ''}
                    ${sel.status === 'OFFERED' ? `
                      <button class="btn btn-success btn-sm" onclick="window.StudentPortal.respondOffer('${sel._id}', 'ACCEPTED')">Accept Offer</button>
                      <button class="btn btn-danger btn-sm" onclick="window.StudentPortal.respondOffer('${sel._id}', 'DECLINED')">Decline</button>
                    ` : `
                      <span class="badge badge-success">${sel.status}</span>
                    `}
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        `}
      `;
    } else if (section === 'attendance') {
      const att = await window.API.get('/students/me/training-attendance');
      container.innerHTML = `
        <div class="portal-header">
          <div>
            <h1 class="portal-title">Training Attendance Record</h1>
            <div class="portal-breadcrumb">Student Portal &rsaquo; Attendance Verification</div>
          </div>
        </div>

        <div class="card" style="max-width:700px; padding:2rem;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem;">
            <div>
              <div style="font-size:2.5rem; font-weight:900; color:${att.isEligibleByAttendance ? 'var(--success)' : 'var(--danger)'};">
                ${att.attendancePercentage}%
              </div>
              <div style="font-weight:700; color:var(--text-main);">Verified Training Attendance</div>
            </div>
            <span class="badge ${att.isEligibleByAttendance ? 'badge-success' : 'badge-danger'}">
              ${att.isEligibleByAttendance ? 'Eligible (>= 80%)' : 'Attendance Shortage (< 80%)'}
            </span>
          </div>

          <div style="font-size:0.9rem; line-height:1.7; color:var(--text-muted);">
            <p>• <strong>Attended Sessions:</strong> ${att.attendedSessions} out of ${att.totalSessions} sessions</p>
            <p>• <strong>Policy Threshold:</strong> Minimum 80% attendance in accredited T&P training bootcamps is compulsory to appear in Tier 1 recruitment drives.</p>
          </div>
        </div>
      `;
    } else if (section === 'notifications') {
      const data = await window.API.get('/notifications/my');
      container.innerHTML = `
        <div class="portal-header">
          <div>
            <h1 class="portal-title">My Notifications</h1>
            <div class="portal-breadcrumb">Student Portal &rsaquo; Alerts & Dispatches</div>
          </div>
          <button class="btn btn-outline btn-sm" onclick="window.StudentPortal.markAllRead()">Mark All as Read</button>
        </div>

        <div style="display:flex; flex-direction:column; gap:0.85rem;">
          ${(data.notifications || []).length === 0 ? '<p style="color:var(--text-muted);">No notifications.</p>' : ''}
          ${(data.notifications || []).map(n => `
            <div class="card" style="padding:1.25rem; border-left:4px solid ${n.isRead ? 'var(--border-color)' : 'var(--primary)'};">
              <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.35rem;">
                <h4 style="font-size:1.05rem; font-weight:800; color:var(--text-main);">${window.UI.escapeHtml(n.title)}</h4>
                <span style="font-size:0.75rem; color:var(--text-muted);">${window.UI.formatDate(n.createdAt)}</span>
              </div>
              <p style="font-size:0.9rem; color:var(--text-muted); line-height:1.5; margin-bottom:0.75rem;">${window.UI.escapeHtml(n.message)}</p>
              ${n.link ? `<a href="${n.link}" class="btn btn-secondary btn-sm" data-link>View &rarr;</a>` : ''}
            </div>
          `).join('')}
        </div>
      `;
    } else {
      // Generic fallback view for projects, certs, internships, resources, settings
      container.innerHTML = `
        <div class="portal-header">
          <div>
            <h1 class="portal-title" style="text-transform:capitalize;">${section}</h1>
            <div class="portal-breadcrumb">Student Portal &rsaquo; ${section}</div>
          </div>
        </div>
        <div class="card" style="padding:2rem;">
          <p style="color:var(--text-muted);">Manage your ${section} records dynamically.</p>
        </div>
      `;
    }
  },

  async saveProfile(e) {
    e.preventDefault();
    const fullName = document.getElementById('stu-name').value;
    const phone = document.getElementById('stu-phone').value;
    const gender = document.getElementById('stu-gender').value;
    const tenthPercentage = document.getElementById('stu-10th').value;
    const twelfthPercentage = document.getElementById('stu-12th').value;
    const address = document.getElementById('stu-address').value;

    try {
      await window.API.put('/students/me', {
        fullName,
        phone,
        gender,
        tenthPercentage,
        twelfthPercentage,
        address
      });
      window.UI.toast('Academic profile successfully updated!', 'success');
    } catch (err) {
      window.UI.toast(err.message, 'error');
    }
  },

  async addSkill() {
    const input = document.getElementById('new-skill-input');
    const skill = input?.value.trim();
    if (!skill) return;

    try {
      const student = await window.API.get('/students/me');
      const skills = student.skills || [];
      if (!skills.includes(skill)) {
        skills.push(skill);
        await window.API.put('/students/me', { skills });
        window.UI.toast(`Added ${skill}`, 'success');
        this.render('skills');
      }
    } catch (err) {
      window.UI.toast(err.message, 'error');
    }
  },

  async removeSkill(skill) {
    try {
      const student = await window.API.get('/students/me');
      let skills = student.skills || [];
      skills = skills.filter(s => s !== skill);
      await window.API.put('/students/me', { skills });
      window.UI.toast(`Removed ${skill}`, 'info');
      this.render('skills');
    } catch (err) {
      window.UI.toast(err.message, 'error');
    }
  },

  async uploadResume(e) {
    e.preventDefault();
    const fileInput = document.getElementById('resume-file-input');
    if (!fileInput?.files[0]) {
      window.UI.toast('Please select a file to upload.', 'warning');
      return;
    }

    const formData = new FormData();
    formData.append('resume', fileInput.files[0]);

    const btn = document.getElementById('btn-upload-resume');
    btn.disabled = true;
    btn.innerText = 'Uploading...';

    try {
      await window.API.post('/students/me/resume', formData);
      window.UI.toast('Resume uploaded successfully!', 'success');
      this.render('resume');
    } catch (err) {
      window.UI.toast(err.message, 'error');
      btn.disabled = false;
      btn.innerText = 'Upload & Replace Resume';
    }
  },

  async deleteResume() {
    window.UI.confirm('Delete Resume', 'Are you sure you want to remove your resume file?', async () => {
      try {
        await window.API.delete('/students/me/resume');
        window.UI.toast('Resume removed', 'info');
        this.render('resume');
      } catch (err) {
        window.UI.toast(err.message, 'error');
      }
    });
  },

  async scanResume() {
    try {
      const res = await window.API.post('/ai/resume-analyze');
      document.getElementById('ai-score-val').innerText = `${res.score}/100`;
      window.UI.toast('AI Resume Scan updated!', 'success');
    } catch (err) {
      window.UI.toast(err.message, 'error');
    }
  },

  async respondOffer(selectionId, status) {
    try {
      await window.API.patch(`/selections/${selectionId}/status`, { status });
      window.UI.toast(`Offer ${status.toLowerCase()}!`, 'success');
      this.render('selection');
    } catch (err) {
      window.UI.toast(err.message, 'error');
    }
  },

  async markAllRead() {
    try {
      await window.API.patch('/notifications/read-all');
      window.UI.toast('All marked as read', 'info');
      this.render('notifications');
    } catch (err) {
      window.UI.toast(err.message, 'error');
    }
  }
};
