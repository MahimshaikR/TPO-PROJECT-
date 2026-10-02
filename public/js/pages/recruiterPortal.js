/**
 * TPO Connect — Recruiter Portal Controller
 */
window.RecruiterPortal = {
  async render(activeSection = 'dashboard', params = {}) {
    const app = document.getElementById('app');
    app.innerHTML = '<div class="spinner"></div>';

    try {
      const recruiterData = await window.API.get('/recruiters/me');

      const sidebarLinks = [
        { id: 'dashboard', label: 'Dashboard', icon: '📊', path: '/recruiter/dashboard' },
        { id: 'company', label: 'Company Profile', icon: '🏢', path: '/recruiter/company' },
        { id: 'drives', label: 'Recruitment Drives', icon: '🎯', path: '/recruiter/drives' },
        { id: 'create-drive', label: 'Post New Drive', icon: '➕', path: '/recruiter/drives/create' },
        { id: 'applications', label: 'Applications', icon: '📝', path: '/recruiter/applications' },
        { id: 'shortlisted', label: 'Shortlisted', icon: '⭐', path: '/recruiter/shortlisted' },
        { id: 'interviews', label: 'Interviews', icon: '🗓️', path: '/recruiter/interviews' },
        { id: 'selected', label: 'Selected Candidates', icon: '🎉', path: '/recruiter/selected' },
        { id: 'notifications', label: 'Notifications', icon: '🔔', path: '/recruiter/notifications' },
        { id: 'settings', label: 'Settings', icon: '⚙️', path: '/recruiter/settings' }
      ];

      app.innerHTML = `
        <div class="portal-wrapper">
          <aside class="portal-sidebar">
            <div class="portal-sidebar-header">
              <span class="portal-role-badge">RECRUITER PORTAL</span>
              <div class="portal-user-name">${window.UI.escapeHtml(recruiterData.fullName)}</div>
              <div class="portal-user-email">${window.UI.escapeHtml(recruiterData.companyName || 'Corporate Partner')}</div>
            </div>

            <ul class="sidebar-menu">
              ${sidebarLinks.map(link => `
                <li>
                  <a href="${link.path}" class="sidebar-link ${activeSection === link.id ? 'active' : ''}" data-link>
                    <i>${link.icon}</i>
                    <span>${link.label}</span>
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

          <main class="portal-main" id="portal-content">
            <div class="spinner"></div>
          </main>
        </div>
      `;

      const contentEl = document.getElementById('portal-content');
      await this.renderSectionContent(activeSection, contentEl, recruiterData, params);
    } catch (err) {
      console.error(err);
      app.innerHTML = `<div class="container section"><h3>Error loading recruiter portal: ${err.message}</h3></div>`;
    }
  },

  async renderSectionContent(section, container, recruiter, params) {
    if (section === 'dashboard') {
      const dash = await window.API.get('/dashboard/recruiter');
      container.innerHTML = `
        <div class="portal-header">
          <div>
            <h1 class="portal-title">Recruiter Dashboard — ${window.UI.escapeHtml(recruiter.companyName)}</h1>
            <div class="portal-breadcrumb">Recruiter Portal &rsaquo; Recruitment Overview</div>
          </div>
          <div class="portal-header-actions">
            <a href="/recruiter/drives/create" class="btn btn-primary btn-sm" data-link>+ Post Recruitment Drive</a>
          </div>
        </div>

        <div class="portal-stats-grid">
          <div class="portal-stat-card stat-blue">
            <div class="stat-info">
              <span class="stat-info-label">Active Drives</span>
              <span class="stat-info-value">${dash.drivesCount || 0}</span>
            </div>
            <div class="portal-stat-icon">🏢</div>
          </div>
          <div class="portal-stat-card stat-amber">
            <div class="stat-info">
              <span class="stat-info-label">Total Applicants</span>
              <span class="stat-info-value">${dash.applicantsCount || 0}</span>
            </div>
            <div class="portal-stat-icon">👥</div>
          </div>
          <div class="portal-stat-card stat-purple">
            <div class="stat-info">
              <span class="stat-info-label">Interviews Scheduled</span>
              <span class="stat-info-value">${dash.interviewsCount || 0}</span>
            </div>
            <div class="portal-stat-icon">🗓️</div>
          </div>
          <div class="portal-stat-card stat-green">
            <div class="stat-info">
              <span class="stat-info-label">Offers Extended</span>
              <span class="stat-info-value">${dash.selectedCount || 0}</span>
            </div>
            <div class="portal-stat-icon">🎉</div>
          </div>
        </div>

        <div class="card">
          <h3 style="font-size:1.2rem; font-weight:800; margin-bottom:1rem;">Your Recruitment Drives</h3>
          ${(dash.drives || []).length === 0 ? '<p style="color:var(--text-muted);">No drives posted yet.</p>' : `
            <div class="table-responsive">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Drive Title</th>
                    <th>Role</th>
                    <th>Package</th>
                    <th>Drive Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  ${dash.drives.map(d => `
                    <tr>
                      <td><strong>${window.UI.escapeHtml(d.title)}</strong></td>
                      <td>${window.UI.escapeHtml(d.jobRole)}</td>
                      <td style="font-weight:700; color:var(--success);">₹${d.packageLpa} LPA</td>
                      <td>${window.UI.formatDate(d.driveDate)}</td>
                      <td>${window.UI.badge(d.status)}</td>
                      <td>
                        <a href="/recruiter/applications" class="btn btn-outline btn-sm" data-link>Review Applicants</a>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          `}
        </div>
      `;
    } else if (section === 'create-drive') {
      const companies = await window.API.get('/companies');
      container.innerHTML = `
        <div class="portal-header">
          <div>
            <h1 class="portal-title">Post New Placement Drive</h1>
            <div class="portal-breadcrumb">Recruiter Portal &rsaquo; Schedule Drive</div>
          </div>
        </div>

        <div class="card" style="max-width:800px; padding:2rem;">
          <form onsubmit="window.RecruiterPortal.handleCreateDrive(event)">
            <div style="margin-bottom:1rem;">
              <label class="filter-label">Drive Title:</label>
              <input type="text" id="dr-title" class="form-input" required placeholder="e.g. Campus Recruitment 2026 for SDE">
            </div>

            <div class="grid grid-cols-2" style="gap:1rem; margin-bottom:1rem;">
              <div>
                <label class="filter-label">Company:</label>
                <select id="dr-company" class="form-select">
                  ${companies.map(c => `<option value="${c._id}">${c.name}</option>`).join('')}
                </select>
              </div>
              <div>
                <label class="filter-label">Job Role / Designation:</label>
                <input type="text" id="dr-role" class="form-input" required placeholder="e.g. Associate Software Engineer">
              </div>
            </div>

            <div class="grid grid-cols-3" style="gap:1rem; margin-bottom:1rem;">
              <div>
                <label class="filter-label">CTC Package (LPA):</label>
                <input type="number" id="dr-package" class="form-input" step="0.1" required placeholder="12.0">
              </div>
              <div>
                <label class="filter-label">Min CGPA:</label>
                <input type="number" id="dr-cgpa" class="form-input" step="0.1" value="7.0">
              </div>
              <div>
                <label class="filter-label">Max Backlogs:</label>
                <input type="number" id="dr-backlogs" class="form-input" value="0">
              </div>
            </div>

            <div class="grid grid-cols-2" style="gap:1rem; margin-bottom:1rem;">
              <div>
                <label class="filter-label">Drive Date:</label>
                <input type="date" id="dr-date" class="form-input" required>
              </div>
              <div>
                <label class="filter-label">Application Deadline:</label>
                <input type="date" id="dr-deadline" class="form-input" required>
              </div>
            </div>

            <div style="margin-bottom:1.5rem;">
              <label class="filter-label">Job Description & Qualifications:</label>
              <textarea id="dr-desc" class="form-textarea" rows="4" required placeholder="Responsibilities, required skills, and job perks..."></textarea>
            </div>

            <button type="submit" class="btn btn-primary btn-lg">Publish Recruitment Drive</button>
          </form>
        </div>
      `;
    } else if (section === 'applications' || section === 'shortlisted') {
      const applicants = await window.API.get('/applications/recruiter');
      const filtered = section === 'shortlisted'
        ? applicants.filter(a => ['SHORTLISTED', 'TEST_QUALIFIED', 'INTERVIEW', 'SELECTED'].includes(a.status))
        : applicants;

      container.innerHTML = `
        <div class="portal-header">
          <div>
            <h1 class="portal-title">${section === 'shortlisted' ? 'Shortlisted Candidates' : 'Candidate Applications'}</h1>
            <div class="portal-breadcrumb">Recruiter Portal &rsaquo; Review Applicants</div>
          </div>
        </div>

        <div class="card">
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Roll No</th>
                  <th>Student Name</th>
                  <th>Branch</th>
                  <th>CGPA</th>
                  <th>Applied Drive</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${filtered.length === 0 ? '<tr><td colspan="7" style="text-align:center;">No candidates found.</td></tr>' : ''}
                ${filtered.map(app => `
                  <tr>
                    <td><strong>${app.student?.rollNumber || 'N/A'}</strong></td>
                    <td>${window.UI.escapeHtml(app.student?.fullName || 'Student')}</td>
                    <td>${app.student?.branch || 'N/A'}</td>
                    <td><strong>${app.student?.cgpa || 0}</strong></td>
                    <td>${window.UI.escapeHtml(app.drive?.title || 'Drive')}</td>
                    <td>${window.UI.badge(app.status)}</td>
                    <td>
                      <div style="display:flex; gap:0.35rem;">
                        <button class="btn btn-outline btn-sm" onclick="window.RecruiterPortal.viewStudentResume('${app.student?._id}')">Resume</button>
                        <button class="btn btn-primary btn-sm" onclick="window.RecruiterPortal.updateCandidateStatus('${app._id}', 'SHORTLISTED')">Shortlist</button>
                        <button class="btn btn-success btn-sm" onclick="window.RecruiterPortal.scheduleInterviewModal('${app._id}', '${app.student?._id}', '${app.driveId}', '${app.companyId}')">Interview</button>
                      </div>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;
    } else if (section === 'interviews') {
      const interviews = await window.API.get('/interviews/recruiter');
      container.innerHTML = `
        <div class="portal-header">
          <div>
            <h1 class="portal-title">Scheduled Technical & HR Interviews</h1>
            <div class="portal-breadcrumb">Recruiter Portal &rsaquo; Interview Rounds</div>
          </div>
        </div>

        <div class="card">
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Candidate</th>
                  <th>Drive</th>
                  <th>Round</th>
                  <th>Scheduled Time</th>
                  <th>Meeting Link</th>
                  <th>Status</th>
                  <th>Record Selection</th>
                </tr>
              </thead>
              <tbody>
                ${interviews.length === 0 ? '<tr><td colspan="7" style="text-align:center;">No interviews scheduled.</td></tr>' : ''}
                ${interviews.map(i => `
                  <tr>
                    <td><strong>${window.UI.escapeHtml(i.student?.fullName || 'Candidate')}</strong> (${i.student?.rollNumber})</td>
                    <td>${window.UI.escapeHtml(i.drive?.title || 'Drive')}</td>
                    <td>${window.UI.escapeHtml(i.roundName)}</td>
                    <td><strong>${i.scheduledAt}</strong></td>
                    <td><a href="${i.venueOrLink}" target="_blank" class="btn btn-outline btn-sm">Join</a></td>
                    <td>${window.UI.badge(i.status)}</td>
                    <td>
                      <button class="btn btn-success btn-sm" onclick="window.RecruiterPortal.offerCandidateModal('${i.studentId}', '${i.driveId}', '${i.companyId}', '${i.applicationId}')">
                        🎉 Offer Job
                      </button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;
    } else if (section === 'selected') {
      const selections = await window.API.get('/selections/recruiter');
      container.innerHTML = `
        <div class="portal-header">
          <div>
            <h1 class="portal-title">Selected Candidates & Offer Issuances</h1>
            <div class="portal-breadcrumb">Recruiter Portal &rsaquo; Selected List</div>
          </div>
        </div>

        <div class="card">
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Roll Number</th>
                  <th>Candidate Name</th>
                  <th>Branch</th>
                  <th>Designation</th>
                  <th>Package Offered</th>
                  <th>Status</th>
                  <th>Selection Date</th>
                </tr>
              </thead>
              <tbody>
                ${selections.length === 0 ? '<tr><td colspan="7" style="text-align:center;">No offers recorded yet.</td></tr>' : ''}
                ${selections.map(s => `
                  <tr>
                    <td><strong>${s.student?.rollNumber || 'N/A'}</strong></td>
                    <td>${window.UI.escapeHtml(s.student?.fullName || 'Student')}</td>
                    <td>${s.student?.branch || 'N/A'}</td>
                    <td><strong>${window.UI.escapeHtml(s.designation)}</strong></td>
                    <td style="color:var(--success); font-weight:800;">₹${s.packageLpa} LPA</td>
                    <td>${window.UI.badge(s.status)}</td>
                    <td>${window.UI.formatDate(s.selectionDate)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;
    } else {
      container.innerHTML = `
        <div class="portal-header"><h1 class="portal-title" style="text-transform:capitalize;">${section}</h1></div>
        <div class="card"><p style="color:var(--text-muted);">Recruiter portal section ${section}.</p></div>
      `;
    }
  },

  async handleCreateDrive(e) {
    e.preventDefault();
    const title = document.getElementById('dr-title').value;
    const companyId = document.getElementById('dr-company').value;
    const jobRole = document.getElementById('dr-role').value;
    const packageLpa = document.getElementById('dr-package').value;
    const minCgpa = document.getElementById('dr-cgpa').value;
    const maxBacklogs = document.getElementById('dr-backlogs').value;
    const driveDate = document.getElementById('dr-date').value;
    const deadline = document.getElementById('dr-deadline').value;
    const description = document.getElementById('dr-desc').value;

    try {
      await window.API.post('/drives', {
        title,
        companyId,
        jobRole,
        packageLpa,
        eligibility: { minCgpa, maxBacklogs },
        driveDate,
        deadline,
        description
      });
      window.UI.toast('Placement drive successfully posted and published!', 'success');
      window.Router.navigate('/recruiter/drives');
    } catch (err) {
      window.UI.toast(err.message, 'error');
    }
  },

  async updateCandidateStatus(appId, status) {
    try {
      await window.API.patch(`/applications/${appId}/status`, { status, currentRound: 'Shortlisted for Interviews' });
      window.UI.toast(`Candidate status updated to ${status}!`, 'success');
      this.render('applications');
    } catch (err) {
      window.UI.toast(err.message, 'error');
    }
  },

  scheduleInterviewModal(appId, studentId, driveId, companyId) {
    window.UI.modal({
      title: 'Schedule Interview Round',
      content: `
        <div>
          <div style="margin-bottom:1rem;">
            <label class="filter-label">Round Name:</label>
            <input type="text" id="sched-round" class="form-input" value="Technical Discussion I">
          </div>
          <div style="margin-bottom:1rem;">
            <label class="filter-label">Date & Time:</label>
            <input type="text" id="sched-time" class="form-input" placeholder="e.g. 2026-10-15 02:00 PM">
          </div>
          <div style="margin-bottom:1rem;">
            <label class="filter-label">Google Meet / Teams Link:</label>
            <input type="text" id="sched-link" class="form-input" value="https://meet.google.com/xyz-recruiter-call">
          </div>
        </div>
      `,
      onConfirm: async () => {
        const roundName = document.getElementById('sched-round').value;
        const scheduledAt = document.getElementById('sched-time').value;
        const venueOrLink = document.getElementById('sched-link').value;

        await window.API.post('/interviews', {
          applicationId: appId,
          studentId,
          driveId,
          companyId,
          roundName,
          scheduledAt,
          venueOrLink
        });
        window.UI.toast('Interview scheduled and candidate notified!', 'success');
        this.render('interviews');
      }
    });
  },

  offerCandidateModal(studentId, driveId, companyId, applicationId) {
    window.UI.modal({
      title: 'Extend Official Job Offer',
      content: `
        <div>
          <div style="margin-bottom:1rem;">
            <label class="filter-label">Designation / Role Offered:</label>
            <input type="text" id="off-role" class="form-input" value="Associate Software Engineer">
          </div>
          <div style="margin-bottom:1rem;">
            <label class="filter-label">Annual Package (LPA):</label>
            <input type="number" id="off-pkg" class="form-input" step="0.1" value="18.0">
          </div>
        </div>
      `,
      onConfirm: async () => {
        const designation = document.getElementById('off-role').value;
        const packageLpa = document.getElementById('off-pkg').value;

        await window.API.post('/selections', {
          studentId,
          driveId,
          companyId,
          applicationId,
          designation,
          packageLpa
        });
        window.UI.toast('Candidate offer extended and placement statistics updated!', 'success');
        this.render('selected');
      }
    });
  },

  async viewStudentResume(studentId) {
    try {
      const student = await window.API.get(`/students/${studentId}`);
      if (student.resumeUrl) {
        window.open(student.resumeUrl, '_blank');
      } else {
        window.UI.toast('This student has not yet uploaded a resume file.', 'warning');
      }
    } catch (e) {
      window.UI.toast(e.message, 'error');
    }
  }
};
