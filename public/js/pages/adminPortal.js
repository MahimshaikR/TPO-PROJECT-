/**
 * TPO Connect — Complete Admin Portal Suite
 * Full CRUD, real-time metrics, analytics, audit logs, and settings management for all 25 collections
 */
window.AdminPortal = {
  async render(activeSection = 'dashboard', params = {}) {
    const app = document.getElementById('app');
    app.innerHTML = '<div class="spinner"></div>';

    try {
      const user = window.State.get('user') || {};

      const sidebarLinks = [
        { id: 'dashboard', label: 'Dashboard', icon: '📊', path: '/admin/dashboard' },
        { id: 'students', label: 'Students', icon: '🎓', path: '/admin/students' },
        { id: 'companies', label: 'Companies', icon: '🏢', path: '/admin/companies' },
        { id: 'recruiters', label: 'Recruiters', icon: '👔', path: '/admin/recruiters' },
        { id: 'drives', label: 'Placement Drives', icon: '🎯', path: '/admin/drives' },
        { id: 'eligibility', label: 'Eligibility Engine', icon: '⚖️', path: '/admin/eligibility' },
        { id: 'applications', label: 'Applications', icon: '📝', path: '/admin/applications' },
        { id: 'attendance', label: 'Attendance', icon: '📋', path: '/admin/attendance' },
        { id: 'interviews', label: 'Interviews', icon: '🗓️', path: '/admin/interviews' },
        { id: 'selections', label: 'Selections & Offers', icon: '🎉', path: '/admin/selections' },
        { id: 'training', label: 'Training Programs', icon: '💡', path: '/admin/training' },
        { id: 'internships', label: 'Internships', icon: '💼', path: '/admin/internships' },
        { id: 'events', label: 'Industry Events', icon: '📅', path: '/admin/industry-events' },
        { id: 'announcements', label: 'Announcements', icon: '📢', path: '/admin/announcements' },
        { id: 'notifications', label: 'Notifications', icon: '🔔', path: '/admin/notifications' },
        { id: 'resources', label: 'Resources & Downloads', icon: '📚', path: '/admin/resources' },
        { id: 'evidence', label: 'Accreditation Evidence', icon: '🏛️', path: '/admin/evidence' },
        { id: 'gallery', label: 'Gallery', icon: '🖼️', path: '/admin/gallery' },
        { id: 'achievements', label: 'Achievements', icon: '🏆', path: '/admin/achievements' },
        { id: 'success-stories', label: 'Success Stories', icon: '⭐', path: '/admin/success-stories' },
        { id: 'reports', label: 'Reports & Exports', icon: '📈', path: '/admin/reports' },
        { id: 'analytics', label: 'Analytics', icon: '📉', path: '/admin/analytics' },
        { id: 'users', label: 'Users & Roles', icon: '👥', path: '/admin/users' },
        { id: 'audit-logs', label: 'Audit Logs', icon: '📜', path: '/admin/audit-logs' },
        { id: 'content', label: 'Website Content', icon: '✏️', path: '/admin/content' },
        { id: 'faq', label: 'FAQ Manager', icon: '❓', path: '/admin/faq' },
        { id: 'feedback', label: 'Feedback', icon: '💬', path: '/admin/feedback' },
        { id: 'grievances', label: 'Grievances', icon: '🛡️', path: '/admin/grievances' },
        { id: 'settings', label: 'System Settings', icon: '⚙️', path: '/admin/settings' }
      ];

      app.innerHTML = `
        <div class="portal-wrapper">
          <aside class="portal-sidebar">
            <div class="portal-sidebar-header">
              <span class="portal-role-badge" style="background:#fee2e2; color:#b91c1c;">ADMINISTRATION</span>
              <div class="portal-user-name">${window.UI.escapeHtml(user.name || 'System Admin')}</div>
              <div class="portal-user-email">${window.UI.escapeHtml(user.email || 'admin@tpoconnect.edu')}</div>
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
      await this.renderSectionContent(activeSection, contentEl, user, params);
    } catch (err) {
      console.error(err);
      app.innerHTML = `<div class="container section"><h3>Error loading admin portal: ${err.message}</h3></div>`;
    }
  },

  async renderSectionContent(section, container, user, params) {
    switch (section) {
      case 'dashboard':
        await this.renderDashboard(container);
        break;
      case 'students':
        await this.renderStudents(container, params);
        break;
      case 'companies':
        await this.renderCompanies(container, params);
        break;
      case 'recruiters':
        await this.renderRecruiters(container, params);
        break;
      case 'drives':
        await this.renderDrives(container, params);
        break;
      case 'eligibility':
        await this.renderEligibility(container);
        break;
      case 'applications':
        await this.renderApplications(container, params);
        break;
      case 'attendance':
        await this.renderAttendance(container);
        break;
      case 'interviews':
        await this.renderInterviews(container);
        break;
      case 'selections':
        await this.renderSelections(container);
        break;
      case 'training':
        await this.renderTraining(container, params);
        break;
      case 'internships':
        await this.renderInternships(container, params);
        break;
      case 'events':
        await this.renderEvents(container, params);
        break;
      case 'announcements':
        await this.renderAnnouncements(container);
        break;
      case 'notifications':
        await this.renderNotifications(container);
        break;
      case 'resources':
        await this.renderResources(container);
        break;
      case 'gallery':
        await this.renderGallery(container);
        break;
      case 'achievements':
        await this.renderAchievements(container);
        break;
      case 'success-stories':
        await this.renderSuccessStories(container);
        break;
      case 'reports':
        await this.renderReports(container);
        break;
      case 'analytics':
        await this.renderAnalytics(container);
        break;
      case 'users':
        await this.renderUsers(container);
        break;
      case 'audit-logs':
        await this.renderAuditLogs(container);
        break;
      case 'content':
        await this.renderContentEditor(container);
        break;
      case 'faq':
        await this.renderFAQ(container);
        break;
      case 'feedback':
        await this.renderFeedback(container);
        break;
      case 'grievances':
        await this.renderGrievances(container);
        break;
      case 'settings':
        await this.renderSettings(container);
        break;
      default:
        await this.renderDashboard(container);
        break;
    }
  },

  // 1. DASHBOARD
  async renderDashboard(container) {
    const dash = await window.API.get('/dashboard/admin');
    const s = dash.summary || {};
    const funnel = dash.funnel || { registered: 0, attended: 0, shortlisted: 0, interviewed: 0, selected: 0 };

    container.innerHTML = `
      <div class="portal-header">
        <div>
          <h1 class="portal-title">T&P Admin Dashboard</h1>
          <div class="portal-breadcrumb">Administration &rsaquo; System Overview</div>
        </div>
        <div class="portal-header-actions">
          <a href="/admin/drives/create" class="btn btn-primary btn-sm" data-link>+ New Drive</a>
          <a href="/admin/announcements" class="btn btn-outline btn-sm" data-link>📢 Post Notice</a>
        </div>
      </div>

      <div class="portal-stats-grid">
        <div class="portal-stat-card stat-blue">
          <div class="stat-info">
            <span class="stat-info-label">Total Students</span>
            <span class="stat-info-value">${s.totalStudents || 0}</span>
          </div>
          <div class="portal-stat-icon">🎓</div>
        </div>
        <div class="portal-stat-card stat-green">
          <div class="stat-info">
            <span class="stat-info-label">Students Placed</span>
            <span class="stat-info-value">${s.studentsPlaced || 0}</span>
          </div>
          <div class="portal-stat-icon">🎉</div>
        </div>
        <div class="portal-stat-card stat-purple">
          <div class="stat-info">
            <span class="stat-info-label">Placement Rate</span>
            <span class="stat-info-value">${s.placementPercentage || 0}%</span>
          </div>
          <div class="portal-stat-icon">📊</div>
        </div>
        <div class="portal-stat-card stat-amber">
          <div class="stat-info">
            <span class="stat-info-label">Highest Package</span>
            <span class="stat-info-value">${s.highestPackage || 0} LPA</span>
          </div>
          <div class="portal-stat-icon">💎</div>
        </div>
        <div class="portal-stat-card stat-blue">
          <div class="stat-info">
            <span class="stat-info-label">Average Package</span>
            <span class="stat-info-value">${s.averagePackage || 0} LPA</span>
          </div>
          <div class="portal-stat-icon">📈</div>
        </div>
        <div class="portal-stat-card stat-purple">
          <div class="stat-info">
            <span class="stat-info-label">Partner Companies</span>
            <span class="stat-info-value">${s.companies || 0}</span>
          </div>
          <div class="portal-stat-icon">🏢</div>
        </div>
        <div class="portal-stat-card stat-green">
          <div class="stat-info">
            <span class="stat-info-label">Active Drives</span>
            <span class="stat-info-value">${s.activeDrives || 0}</span>
          </div>
          <div class="portal-stat-icon">🎯</div>
        </div>
        <div class="portal-stat-card stat-amber">
          <div class="stat-info">
            <span class="stat-info-label">Pending Grievances</span>
            <span class="stat-info-value">${s.pendingGrievancesCount || 0}</span>
          </div>
          <div class="portal-stat-icon">🛡️</div>
        </div>
      </div>

      <!-- Recruitment Funnel -->
      <div class="card" style="margin-top:2rem;">
        <h3 style="font-size:1.2rem; font-weight:800; margin-bottom:1.5rem;">Recruitment Funnel Progress</h3>
        <div class="funnel-container">
          <div class="funnel-step">
            <span class="funnel-number">${funnel.registered}</span>
            <span class="funnel-label">Applied</span>
          </div>
          <div class="funnel-arrow">&rarr;</div>
          <div class="funnel-step">
            <span class="funnel-number">${funnel.attended}</span>
            <span class="funnel-label">Attended</span>
          </div>
          <div class="funnel-arrow">&rarr;</div>
          <div class="funnel-step">
            <span class="funnel-number">${funnel.shortlisted}</span>
            <span class="funnel-label">Shortlisted</span>
          </div>
          <div class="funnel-arrow">&rarr;</div>
          <div class="funnel-step">
            <span class="funnel-number">${funnel.interviewed}</span>
            <span class="funnel-label">Interviewed</span>
          </div>
          <div class="funnel-arrow">&rarr;</div>
          <div class="funnel-step" style="border-color:var(--success); color:var(--success);">
            <span class="funnel-number">${funnel.selected}</span>
            <span class="funnel-label">Selected</span>
          </div>
        </div>
      </div>

      <!-- Branch Placement Distribution -->
      <div class="card" style="margin-top:1.5rem;">
        <h3 style="font-size:1.2rem; font-weight:800; margin-bottom:1.5rem;">Departmental Placement Rates</h3>
        <div style="display:flex; flex-direction:column; gap:1rem;">
          ${(dash.branchBreakdown || []).map(b => `
            <div>
              <div style="display:flex; justify-content:space-between; margin-bottom:0.25rem;">
                <span style="font-weight:600;">${window.UI.escapeHtml(b.branch)}</span>
                <span>${b.placed} / ${b.total} Placed (${b.percentage}%)</span>
              </div>
              <div style="height:10px; background:var(--border-color); border-radius:5px; overflow:hidden;">
                <div style="height:100%; width:${b.percentage}%; background:linear-gradient(90deg, var(--primary), var(--secondary)); border-radius:5px;"></div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  // 2. STUDENTS CRUD
  async renderStudents(container, params) {
    if (params.id) {
      return this.renderStudentDetail(container, params.id);
    }

    const students = await window.API.get('/students');

    container.innerHTML = `
      <div class="portal-header">
        <div>
          <h1 class="portal-title">Students Registry</h1>
          <div class="portal-breadcrumb">Admin &rsaquo; Students</div>
        </div>
        <div class="portal-header-actions">
          <button class="btn btn-primary btn-sm" onclick="window.AdminPortal.showCreateStudentModal()">+ Add Student</button>
        </div>
      </div>

      <div class="card" style="margin-bottom:1.5rem;">
        <div style="display:flex; gap:1rem; flex-wrap:wrap;">
          <input type="text" id="admin-stud-search" class="form-control" placeholder="Search student name, roll number, email..." style="flex:1; min-width:250px;">
          <select id="admin-stud-branch" class="form-control" style="width:200px;">
            <option value="">All Branches</option>
            <option value="Computer Science & Engineering">CSE</option>
            <option value="Information Technology">IT</option>
            <option value="Electronics & Communication">ECE</option>
            <option value="Electrical & Electronics">EEE</option>
            <option value="Mechanical Engineering">MECH</option>
          </select>
          <select id="admin-stud-status" class="form-control" style="width:180px;">
            <option value="">All Status</option>
            <option value="PLACED">Placed</option>
            <option value="UNPLACED">Unplaced</option>
          </select>
        </div>
      </div>

      <div class="card">
        <div class="table-responsive">
          <table class="data-table" id="admin-stud-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Roll No</th>
                <th>Branch</th>
                <th>CGPA</th>
                <th>Backlogs</th>
                <th>Status</th>
                <th>Verified</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${(students || []).map(s => `
                <tr data-name="${s.fullName?.toLowerCase() || ''}" data-roll="${s.rollNo?.toLowerCase() || ''}" data-branch="${s.branch || ''}" data-status="${s.placementStatus || ''}">
                  <td>
                    <strong>${window.UI.escapeHtml(s.fullName)}</strong>
                    <div style="font-size:0.85rem; color:var(--text-muted);">${window.UI.escapeHtml(s.email)}</div>
                  </td>
                  <td><code>${window.UI.escapeHtml(s.rollNo)}</code></td>
                  <td>${window.UI.escapeHtml(s.branch)}</td>
                  <td><strong>${s.cgpa || 0}</strong></td>
                  <td>${s.backlogs ?? 0}</td>
                  <td>${window.UI.renderBadge(s.placementStatus || 'UNPLACED')}</td>
                  <td>${s.isVerified ? '<span class="badge badge-success">✓</span>' : '<span class="badge badge-warning">✗</span>'}</td>
                  <td>
                    <div style="display:flex; gap:0.5rem;">
                      <a href="/admin/students/${s._id}" class="btn btn-outline btn-sm" data-link>View</a>
                      <button class="btn btn-danger btn-sm" onclick="window.AdminPortal.deleteStudent('${s._id}')">🗑️</button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    const searchInput = document.getElementById('admin-stud-search');
    const branchFilter = document.getElementById('admin-stud-branch');
    const statusFilter = document.getElementById('admin-stud-status');

    const filterRows = () => {
      const q = searchInput.value.toLowerCase();
      const b = branchFilter.value;
      const st = statusFilter.value;

      document.querySelectorAll('#admin-stud-table tbody tr').forEach(tr => {
        const name = tr.getAttribute('data-name');
        const roll = tr.getAttribute('data-roll');
        const branch = tr.getAttribute('data-branch');
        const status = tr.getAttribute('data-status');

        const matchesQuery = !q || name.includes(q) || roll.includes(q);
        const matchesBranch = !b || branch === b;
        const matchesStatus = !st || status === st;

        tr.style.display = matchesQuery && matchesBranch && matchesStatus ? '' : 'none';
      });
    };

    searchInput.addEventListener('input', filterRows);
    branchFilter.addEventListener('change', filterRows);
    statusFilter.addEventListener('change', filterRows);
  },

  async renderStudentDetail(container, id) {
    const s = await window.API.get(`/students/${id}`);
    container.innerHTML = `
      <div class="portal-header">
        <div>
          <h1 class="portal-title">${window.UI.escapeHtml(s.fullName)}</h1>
          <div class="portal-breadcrumb">Admin &rsaquo; Students &rsaquo; ${window.UI.escapeHtml(s.rollNo)}</div>
        </div>
        <div class="portal-header-actions">
          <a href="/admin/students" class="btn btn-outline btn-sm" data-link>&larr; Back to Students</a>
        </div>
      </div>

      <div style="display:grid; grid-template-columns: 1fr 2fr; gap:1.5rem;">
        <div class="card">
          <h3 style="font-weight:700; margin-bottom:1rem;">Academic Information</h3>
          <p><strong>Roll No:</strong> ${s.rollNo}</p>
          <p><strong>Email:</strong> ${s.email}</p>
          <p><strong>Phone:</strong> ${s.phone || 'N/A'}</p>
          <p><strong>Branch:</strong> ${s.branch}</p>
          <p><strong>CGPA:</strong> ${s.cgpa}</p>
          <p><strong>10th %:</strong> ${s.tenthPercentage || 'N/A'}</p>
          <p><strong>12th %:</strong> ${s.twelfthPercentage || 'N/A'}</p>
          <p><strong>Active Backlogs:</strong> ${s.backlogs ?? 0}</p>
          <p><strong>Batch:</strong> ${s.batchYear || 'N/A'}</p>
          <p><strong>Placement Status:</strong> ${window.UI.renderBadge(s.placementStatus || 'UNPLACED')}</p>
          ${s.placedCompany ? `<p><strong>Placed Offer:</strong> ${s.placedCompany} (${s.placedPackage} LPA)</p>` : ''}
          <div style="margin-top:1.5rem;">
            ${s.isVerified
              ? '<span class="badge badge-success">Profile Verified</span>'
              : `<button class="btn btn-primary btn-sm" onclick="window.AdminPortal.verifyStudentDirect('${s._id}')">Mark as Verified</button>`}
          </div>
        </div>

        <div class="card">
          <h3 style="font-weight:700; margin-bottom:1rem;">Skills & Experiences</h3>
          <div style="display:flex; gap:0.5rem; flex-wrap:wrap; margin-bottom:1.5rem;">
            ${(s.skills || []).map(sk => `<span class="badge badge-info">${window.UI.escapeHtml(sk)}</span>`).join('') || '<p style="color:var(--text-muted);">No skills added</p>'}
          </div>

          <h4 style="font-weight:700; margin-bottom:0.75rem;">Projects</h4>
          ${(s.projects || []).map(p => `
            <div style="margin-bottom:1rem; padding-left:1rem; border-left:3px solid var(--primary);">
              <strong>${window.UI.escapeHtml(p.title)}</strong>
              <p style="font-size:0.9rem; color:var(--text-muted);">${window.UI.escapeHtml(p.description || '')}</p>
            </div>
          `).join('') || '<p style="color:var(--text-muted);">No projects added</p>'}
        </div>
      </div>
    `;
  },

  async verifyStudentDirect(id) {
    try {
      await window.API.put(`/students/${id}`, { isVerified: true });
      window.UI.showToast('Student verified successfully!', 'success');
      this.render('students', { id });
    } catch (err) {
      window.UI.showToast(err.message, 'error');
    }
  },

  async deleteStudent(id) {
    if (!confirm('Are you sure you want to remove this student?')) return;
    try {
      await window.API.delete(`/students/${id}`);
      window.UI.showToast('Student record removed', 'success');
      this.render('students');
    } catch (err) {
      window.UI.showToast(err.message, 'error');
    }
  },

  showCreateStudentModal() {
    window.UI.openModal(`
      <h3 style="font-weight:800; margin-bottom:1rem;">Add New Student</h3>
      <form id="admin-create-stud-form">
        <div class="form-group">
          <label>Full Name</label>
          <input type="text" id="cs-name" class="form-control" required placeholder="e.g. John Doe">
        </div>
        <div class="form-group">
          <label>Email</label>
          <input type="email" id="cs-email" class="form-control" required placeholder="john@student.edu">
        </div>
        <div class="form-group">
          <label>Roll Number</label>
          <input type="text" id="cs-roll" class="form-control" required placeholder="21CS101">
        </div>
        <div class="form-group">
          <label>Branch</label>
          <select id="cs-branch" class="form-control" required>
            <option value="Computer Science & Engineering">Computer Science & Engineering</option>
            <option value="Information Technology">Information Technology</option>
            <option value="Electronics & Communication">Electronics & Communication</option>
            <option value="Electrical & Electronics">Electrical & Electronics</option>
            <option value="Mechanical Engineering">Mechanical Engineering</option>
          </select>
        </div>
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:1rem;">
          <div class="form-group">
            <label>CGPA</label>
            <input type="number" id="cs-cgpa" class="form-control" step="0.01" min="0" max="10" value="8.0" required>
          </div>
          <div class="form-group">
            <label>Backlogs</label>
            <input type="number" id="cs-backlogs" class="form-control" min="0" value="0" required>
          </div>
        </div>
        <div style="display:flex; justify-content:flex-end; gap:0.5rem; margin-top:1.5rem;">
          <button type="button" class="btn btn-outline" onclick="window.UI.closeModal()">Cancel</button>
          <button type="submit" class="btn btn-primary">Create Student</button>
        </div>
      </form>
    `);

    document.getElementById('admin-create-stud-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      try {
        await window.API.post('/students', {
          fullName: document.getElementById('cs-name').value,
          email: document.getElementById('cs-email').value,
          rollNo: document.getElementById('cs-roll').value,
          branch: document.getElementById('cs-branch').value,
          cgpa: parseFloat(document.getElementById('cs-cgpa').value),
          backlogs: parseInt(document.getElementById('cs-backlogs').value, 10),
          isVerified: true
        });
        window.UI.closeModal();
        window.UI.showToast('Student added successfully!', 'success');
        this.render('students');
      } catch (err) {
        window.UI.showToast(err.message, 'error');
      }
    });
  },

  // 3. COMPANIES CRUD
  async renderCompanies(container, params) {
    const companies = await window.API.get('/companies');

    container.innerHTML = `
      <div class="portal-header">
        <div>
          <h1 class="portal-title">Partner Companies Directory</h1>
          <div class="portal-breadcrumb">Admin &rsaquo; Companies</div>
        </div>
        <div class="portal-header-actions">
          <button class="btn btn-primary btn-sm" onclick="window.AdminPortal.showCreateCompanyModal()">+ Add Partner Company</button>
        </div>
      </div>

      <div class="card">
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Tier</th>
                <th>Industry</th>
                <th>Location</th>
                <th>Total Placed</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${(companies || []).map(c => `
                <tr>
                  <td>
                    <strong>${window.UI.escapeHtml(c.name)}</strong>
                    <div style="font-size:0.85rem; color:var(--text-muted);">${c.website || ''}</div>
                  </td>
                  <td><span class="badge badge-info">${window.UI.escapeHtml(c.tier || 'Tier 1')}</span></td>
                  <td>${window.UI.escapeHtml(c.industry || '-')}</td>
                  <td>${window.UI.escapeHtml(c.location || 'Pan-India')}</td>
                  <td><strong>${c.totalPlaced || 0}</strong></td>
                  <td>${window.UI.renderBadge(c.status || 'ACTIVE')}</td>
                  <td>
                    <div style="display:flex; gap:0.5rem;">
                      <a href="/companies/${c._id}" class="btn btn-outline btn-sm" data-link>View</a>
                      <button class="btn btn-danger btn-sm" onclick="window.AdminPortal.deleteCompany('${c._id}')">🗑️</button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  showCreateCompanyModal() {
    window.UI.openModal(`
      <h3 style="font-weight:800; margin-bottom:1rem;">Add Partner Company</h3>
      <form id="admin-create-comp-form">
        <div class="form-group">
          <label>Company Name</label>
          <input type="text" id="cc-name" class="form-control" required placeholder="e.g. Google India">
        </div>
        <div class="form-group">
          <label>Industry</label>
          <input type="text" id="cc-industry" class="form-control" placeholder="e.g. Technology / Cloud">
        </div>
        <div class="form-group">
          <label>Tier Category</label>
          <select id="cc-tier" class="form-control">
            <option value="Dream (>15 LPA)">Dream (>15 LPA)</option>
            <option value="Super Dream (>25 LPA)">Super Dream (>25 LPA)</option>
            <option value="Core Engineering">Core Engineering</option>
            <option value="Mass Recruiter">Mass Recruiter</option>
          </select>
        </div>
        <div class="form-group">
          <label>Website URL</label>
          <input type="url" id="cc-website" class="form-control" placeholder="https://careers.google.com">
        </div>
        <div class="form-group">
          <label>Location</label>
          <input type="text" id="cc-location" class="form-control" placeholder="Bengaluru, Hyderabad">
        </div>
        <div style="display:flex; justify-content:flex-end; gap:0.5rem; margin-top:1.5rem;">
          <button type="button" class="btn btn-outline" onclick="window.UI.closeModal()">Cancel</button>
          <button type="submit" class="btn btn-primary">Save Company</button>
        </div>
      </form>
    `);

    document.getElementById('admin-create-comp-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      try {
        await window.API.post('/companies', {
          name: document.getElementById('cc-name').value,
          industry: document.getElementById('cc-industry').value,
          tier: document.getElementById('cc-tier').value,
          website: document.getElementById('cc-website').value,
          location: document.getElementById('cc-location').value,
          status: 'ACTIVE'
        });
        window.UI.closeModal();
        window.UI.showToast('Company registered successfully!', 'success');
        this.render('companies');
      } catch (err) {
        window.UI.showToast(err.message, 'error');
      }
    });
  },

  async deleteCompany(id) {
    if (!confirm('Are you sure you want to delete this company?')) return;
    try {
      await window.API.delete(`/companies/${id}`);
      window.UI.showToast('Company removed successfully', 'success');
      this.render('companies');
    } catch (err) {
      window.UI.showToast(err.message, 'error');
    }
  },

  // 4. RECRUITERS
  async renderRecruiters(container) {
    const recruiters = await window.API.get('/recruiters');

    container.innerHTML = `
      <div class="portal-header">
        <div>
          <h1 class="portal-title">Corporate Recruiters</h1>
          <div class="portal-breadcrumb">Admin &rsaquo; Recruiters</div>
        </div>
      </div>

      <div class="card">
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Recruiter Name</th>
                <th>Company</th>
                <th>Designation</th>
                <th>Email</th>
                <th>Status</th>
                <th>Approval</th>
              </tr>
            </thead>
            <tbody>
              ${(recruiters || []).map(r => `
                <tr>
                  <td><strong>${window.UI.escapeHtml(r.fullName)}</strong></td>
                  <td>${window.UI.escapeHtml(r.companyName || '-')}</td>
                  <td>${window.UI.escapeHtml(r.designation || 'Talent Acquisition')}</td>
                  <td>${window.UI.escapeHtml(r.email)}</td>
                  <td>${window.UI.renderBadge(r.status || 'PENDING')}</td>
                  <td>
                    ${r.status === 'APPROVED' ? '<span class="badge badge-success">Approved</span>' : `
                      <button class="btn btn-success btn-sm" onclick="window.AdminPortal.updateRecruiterStatus('${r._id}', 'APPROVED')">Approve</button>
                      <button class="btn btn-danger btn-sm" onclick="window.AdminPortal.updateRecruiterStatus('${r._id}', 'REJECTED')">Reject</button>
                    `}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  async updateRecruiterStatus(id, status) {
    try {
      await window.API.patch(`/recruiters/${id}/status`, { status });
      window.UI.showToast(`Recruiter marked as ${status}`, 'success');
      this.render('recruiters');
    } catch (err) {
      window.UI.showToast(err.message, 'error');
    }
  },

  // 5. DRIVES CRUD
  async renderDrives(container, params) {
    if (params.action === 'create') {
      return this.renderCreateDriveForm(container);
    }

    const drives = await window.API.get('/drives');

    container.innerHTML = `
      <div class="portal-header">
        <div>
          <h1 class="portal-title">Placement Drives Management</h1>
          <div class="portal-breadcrumb">Admin &rsaquo; Placement Drives</div>
        </div>
        <div class="portal-header-actions">
          <a href="/admin/drives/create" class="btn btn-primary btn-sm" data-link>+ Create New Drive</a>
        </div>
      </div>

      <div class="card">
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Drive Title</th>
                <th>Company</th>
                <th>Date</th>
                <th>Package</th>
                <th>Min CGPA</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${(drives || []).map(d => `
                <tr>
                  <td><strong>${window.UI.escapeHtml(d.title)}</strong></td>
                  <td>${window.UI.escapeHtml(d.companyName || '-')}</td>
                  <td>${window.UI.formatDate(d.driveDate)}</td>
                  <td style="color:var(--success); font-weight:700;">${d.packageLpa ? d.packageLpa + ' LPA' : 'TBD'}</td>
                  <td>${d.eligibility?.minCgpa || 0}</td>
                  <td>${window.UI.renderBadge(d.status)}</td>
                  <td>
                    <div style="display:flex; gap:0.5rem;">
                      <a href="/placements/drives/${d._id}" class="btn btn-outline btn-sm" data-link>View</a>
                      <button class="btn btn-danger btn-sm" onclick="window.AdminPortal.deleteDrive('${d._id}')">🗑️</button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  async renderCreateDriveForm(container) {
    const companies = await window.API.get('/companies');

    container.innerHTML = `
      <div class="portal-header">
        <div>
          <h1 class="portal-title">Post New Placement Drive</h1>
          <div class="portal-breadcrumb">Admin &rsaquo; Drives &rsaquo; Create</div>
        </div>
        <div class="portal-header-actions">
          <a href="/admin/drives" class="btn btn-outline btn-sm" data-link>&larr; Back to Drives</a>
        </div>
      </div>

      <div class="card" style="max-width:850px;">
        <form id="admin-create-drive-form">
          <div class="form-group">
            <label>Company</label>
            <select id="cd-company" class="form-control" required>
              <option value="">Select Company...</option>
              ${(companies || []).map(c => `<option value="${c._id}" data-name="${c.name}">${c.name}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label>Drive Title</label>
            <input type="text" id="cd-title" class="form-control" required placeholder="e.g. Software Development Engineer Campus Hiring 2026">
          </div>
          <div class="form-group">
            <label>Job Role</label>
            <input type="text" id="cd-role" class="form-control" required placeholder="e.g. Associate Software Engineer">
          </div>
          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:1rem;">
            <div class="form-group">
              <label>Drive Date</label>
              <input type="date" id="cd-date" class="form-control" required>
            </div>
            <div class="form-group">
              <label>Application Deadline</label>
              <input type="date" id="cd-deadline" class="form-control" required>
            </div>
          </div>
          <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap:1rem;">
            <div class="form-group">
              <label>Package (LPA)</label>
              <input type="number" id="cd-package" class="form-control" step="0.1" required placeholder="12.0">
            </div>
            <div class="form-group">
              <label>Min CGPA</label>
              <input type="number" id="cd-cgpa" class="form-control" step="0.1" value="7.0" required>
            </div>
            <div class="form-group">
              <label>Max Backlogs</label>
              <input type="number" id="cd-backlogs" class="form-control" value="0" required>
            </div>
          </div>
          <div class="form-group">
            <label>Eligible Branches (Hold Ctrl/Cmd to select multiple)</label>
            <select id="cd-branches" class="form-control" multiple style="height:110px;">
              <option value="Computer Science & Engineering" selected>Computer Science & Engineering</option>
              <option value="Information Technology" selected>Information Technology</option>
              <option value="Electronics & Communication">Electronics & Communication</option>
              <option value="Electrical & Electronics">Electrical & Electronics</option>
              <option value="Mechanical Engineering">Mechanical Engineering</option>
            </select>
          </div>
          <div class="form-group">
            <label>Job Description & Details</label>
            <textarea id="cd-desc" class="form-control" rows="4" placeholder="Responsibilities, eligibility highlights, documents required..."></textarea>
          </div>
          <div style="display:flex; justify-content:flex-end; gap:0.5rem; margin-top:1.5rem;">
            <a href="/admin/drives" class="btn btn-outline" data-link>Cancel</a>
            <button type="submit" class="btn btn-primary">Publish Placement Drive</button>
          </div>
        </form>
      </div>
    `;

    document.getElementById('admin-create-drive-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const compSelect = document.getElementById('cd-company');
      const companyId = compSelect.value;
      const companyName = compSelect.options[compSelect.selectedIndex]?.getAttribute('data-name');

      const branches = Array.from(document.getElementById('cd-branches').selectedOptions).map(o => o.value);

      try {
        await window.API.post('/drives', {
          companyId,
          companyName,
          title: document.getElementById('cd-title').value,
          role: document.getElementById('cd-role').value,
          driveDate: document.getElementById('cd-date').value,
          deadline: document.getElementById('cd-deadline').value,
          packageLpa: parseFloat(document.getElementById('cd-package').value),
          eligibility: {
            minCgpa: parseFloat(document.getElementById('cd-cgpa').value),
            maxBacklogs: parseInt(document.getElementById('cd-backlogs').value, 10),
            branches: branches.length > 0 ? branches : ['All']
          },
          description: document.getElementById('cd-desc').value,
          status: 'UPCOMING'
        });

        window.UI.showToast('Drive created successfully!', 'success');
        window.Router.navigate('/admin/drives');
      } catch (err) {
        window.UI.showToast(err.message, 'error');
      }
    });
  },

  async deleteDrive(id) {
    if (!confirm('Are you sure you want to delete this placement drive?')) return;
    try {
      await window.API.delete(`/drives/${id}`);
      window.UI.showToast('Drive removed successfully', 'success');
      this.render('drives');
    } catch (err) {
      window.UI.showToast(err.message, 'error');
    }
  },

  // 6. ELIGIBILITY ENGINE
  async renderEligibility(container) {
    const drives = await window.API.get('/drives');
    const students = await window.API.get('/students');

    container.innerHTML = `
      <div class="portal-header">
        <div>
          <h1 class="portal-title">Real-Time Eligibility Engine</h1>
          <div class="portal-breadcrumb">Admin &rsaquo; Eligibility Rules</div>
        </div>
      </div>

      <div class="card" style="margin-bottom:1.5rem;">
        <h3 style="font-weight:700; margin-bottom:1rem;">Eligibility Check Simulator</h3>
        <p style="color:var(--text-muted); font-size:0.9rem; margin-bottom:1.5rem;">Simulate how the backend dynamic eligibility validator checks a student against drive criteria.</p>

        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:1.5rem;">
          <div class="form-group">
            <label>Select Drive Criteria</label>
            <select id="el-drive-select" class="form-control">
              <option value="">Select Drive...</option>
              ${(drives || []).map(d => `<option value="${d._id}">${d.title} (Min CGPA: ${d.eligibility?.minCgpa || 0})</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label>Select Student Profile</label>
            <select id="el-stud-select" class="form-control">
              <option value="">Select Student...</option>
              ${(students || []).map(s => `<option value="${s._id}">${s.fullName} - ${s.rollNo} (CGPA: ${s.cgpa}, Backlogs: ${s.backlogs ?? 0})</option>`).join('')}
            </select>
          </div>
        </div>

        <button class="btn btn-primary" style="margin-top:1rem;" onclick="window.AdminPortal.runEligibilityTest()">Run Dynamic Verification</button>

        <div id="el-result-box" style="margin-top:1.5rem; display:none;"></div>
      </div>
    `;
  },

  async runEligibilityTest() {
    const driveId = document.getElementById('el-drive-select').value;
    const studentId = document.getElementById('el-stud-select').value;

    if (!driveId || !studentId) {
      window.UI.showToast('Please select both a drive and a student', 'warning');
      return;
    }

    const box = document.getElementById('el-result-box');
    box.style.display = 'block';
    box.innerHTML = '<div class="spinner"></div>';

    try {
      const res = await window.API.post('/eligibility/check', { driveId, studentId });
      box.innerHTML = `
        <div style="padding:1.5rem; border-radius:8px; border:2px solid ${res.isEligible ? 'var(--success)' : 'var(--danger)'}; background:${res.isEligible ? '#f0fdf4' : '#fef2f2'};">
          <h4 style="font-weight:800; color:${res.isEligible ? 'var(--success)' : 'var(--danger)'}; margin-bottom:0.5rem;">
            ${res.isEligible ? '✅ Student is ELIGIBLE' : '❌ Student is NOT ELIGIBLE'}
          </h4>
          <p style="margin:0; font-weight:600;">Status Message: ${window.UI.escapeHtml(res.reason || res.message || (res.isEligible ? 'All criteria satisfied.' : 'Criteria failed.'))}</p>
        </div>
      `;
    } catch (err) {
      box.innerHTML = `<div style="color:var(--danger);">${err.message}</div>`;
    }
  },

  // 7. APPLICATIONS
  async renderApplications(container) {
    const apps = await window.API.get('/applications');

    container.innerHTML = `
      <div class="portal-header">
        <div>
          <h1 class="portal-title">Student Applications Master List</h1>
          <div class="portal-breadcrumb">Admin &rsaquo; Applications</div>
        </div>
      </div>

      <div class="card">
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Applicant</th>
                <th>Drive & Company</th>
                <th>Applied Date</th>
                <th>Round</th>
                <th>Status</th>
                <th>Update Status</th>
              </tr>
            </thead>
            <tbody>
              ${(apps || []).map(a => `
                <tr>
                  <td>
                    <strong>${window.UI.escapeHtml(a.studentName || 'Student')}</strong>
                    <div style="font-size:0.85rem; color:var(--text-muted);">${a.studentRollNo || ''} (${a.studentBranch || ''})</div>
                  </td>
                  <td>
                    <strong>${window.UI.escapeHtml(a.driveTitle || '-')}</strong>
                    <div style="font-size:0.85rem; color:var(--text-muted);">${window.UI.escapeHtml(a.companyName || '')}</div>
                  </td>
                  <td>${window.UI.formatDate(a.appliedAt)}</td>
                  <td><span class="badge badge-info">${window.UI.escapeHtml(a.currentRound || 'Round 1')}</span></td>
                  <td>${window.UI.renderBadge(a.status)}</td>
                  <td>
                    <select class="form-control" style="font-size:0.85rem; padding:0.25rem 0.5rem;" onchange="window.AdminPortal.changeAppStatus('${a._id}', this.value)">
                      <option value="">Change...</option>
                      <option value="APPLIED">Applied</option>
                      <option value="SHORTLISTED">Shortlisted</option>
                      <option value="TEST_QUALIFIED">Test Qualified</option>
                      <option value="INTERVIEW">Interview</option>
                      <option value="SELECTED">Selected</option>
                      <option value="REJECTED">Rejected</option>
                    </select>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  async changeAppStatus(appId, status) {
    if (!status) return;
    try {
      await window.API.patch(`/applications/${appId}/status`, { status });
      window.UI.showToast(`Application status updated to ${status}`, 'success');
      this.render('applications');
    } catch (err) {
      window.UI.showToast(err.message, 'error');
    }
  },

  // 8. ATTENDANCE
  async renderAttendance(container) {
    const drives = await window.API.get('/drives');

    container.innerHTML = `
      <div class="portal-header">
        <div>
          <h1 class="portal-title">Drive & Event Attendance</h1>
          <div class="portal-breadcrumb">Admin &rsaquo; Attendance</div>
        </div>
      </div>

      <div class="card" style="margin-bottom:1.5rem;">
        <h3 style="font-weight:700; margin-bottom:1rem;">Mark Placement Attendance</h3>
        <div style="display:flex; gap:1rem; flex-wrap:wrap;">
          <select id="admin-att-drive" class="form-control" style="flex:1; min-width:250px;">
            <option value="">Select Placement Drive...</option>
            ${(drives || []).map(d => `<option value="${d._id}">${d.title} (${d.companyName})</option>`).join('')}
          </select>
          <button class="btn btn-primary" onclick="window.AdminPortal.loadDriveAttendance()">Fetch Candidates</button>
        </div>
      </div>

      <div id="admin-att-results"></div>
    `;
  },

  async loadDriveAttendance() {
    const driveId = document.getElementById('admin-att-drive').value;
    if (!driveId) return window.UI.showToast('Please select a drive', 'warning');

    const resBox = document.getElementById('admin-att-results');
    resBox.innerHTML = '<div class="spinner"></div>';

    try {
      const apps = await window.API.get(`/applications?driveId=${driveId}`);
      if (apps.length === 0) {
        resBox.innerHTML = '<div class="card"><p style="color:var(--text-muted);">No candidates applied for this drive.</p></div>';
        return;
      }

      resBox.innerHTML = `
        <div class="card">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
            <h3 style="font-weight:700;">Candidates List (${apps.length})</h3>
            <button class="btn btn-success btn-sm" onclick="window.AdminPortal.saveDriveAttendance('${driveId}')">💾 Record Attendance</button>
          </div>
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Roll No</th>
                  <th>Branch</th>
                  <th>Attendance</th>
                </tr>
              </thead>
              <tbody>
                ${apps.map(a => `
                  <tr>
                    <td><strong>${window.UI.escapeHtml(a.studentName || 'Student')}</strong></td>
                    <td><code>${a.studentRollNo || ''}</code></td>
                    <td>${a.studentBranch || ''}</td>
                    <td>
                      <label style="display:flex; align-items:center; gap:0.5rem; cursor:pointer;">
                        <input type="checkbox" class="adm-att-box" data-sid="${a.studentId}" checked>
                        <span>Present</span>
                      </label>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;
    } catch (err) {
      resBox.innerHTML = `<div class="card" style="color:var(--danger);">${err.message}</div>`;
    }
  },

  async saveDriveAttendance(driveId) {
    const boxes = document.querySelectorAll('.adm-att-box');
    const records = Array.from(boxes).map(b => ({
      studentId: b.getAttribute('data-sid'),
      isPresent: b.checked
    }));

    try {
      await window.API.post('/attendance/bulk', { driveId, records });
      window.UI.showToast('Drive attendance saved successfully!', 'success');
    } catch (err) {
      window.UI.showToast(err.message, 'error');
    }
  },

  // 9. INTERVIEWS
  async renderInterviews(container) {
    const interviews = await window.API.get('/interviews');

    container.innerHTML = `
      <div class="portal-header">
        <div>
          <h1 class="portal-title">Interviews Schedule</h1>
          <div class="portal-breadcrumb">Admin &rsaquo; Interviews</div>
        </div>
      </div>

      <div class="card">
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Candidate</th>
                <th>Company</th>
                <th>Round</th>
                <th>Date & Time</th>
                <th>Venue / Link</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${(interviews || []).map(i => `
                <tr>
                  <td><strong>${window.UI.escapeHtml(i.studentName || 'Student')}</strong></td>
                  <td>${window.UI.escapeHtml(i.companyName || '-')}</td>
                  <td><span class="badge badge-info">${window.UI.escapeHtml(i.round || 'Round 1')}</span></td>
                  <td>${window.UI.formatDate(i.scheduledDate)} ${i.timeSlot || ''}</td>
                  <td>${window.UI.escapeHtml(i.venue || i.meetingLink || 'Online')}</td>
                  <td>${window.UI.renderBadge(i.status)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  // 10. SELECTIONS
  async renderSelections(container) {
    const selections = await window.API.get('/selections');

    container.innerHTML = `
      <div class="portal-header">
        <div>
          <h1 class="portal-title">Placement Selections & Offers</h1>
          <div class="portal-breadcrumb">Admin &rsaquo; Selections</div>
        </div>
      </div>

      <div class="card">
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Company</th>
                <th>Role</th>
                <th>Package (LPA)</th>
                <th>Offer Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${(selections || []).map(s => `
                <tr>
                  <td>
                    <strong>${window.UI.escapeHtml(s.studentName || 'Student')}</strong>
                    <div style="font-size:0.85rem; color:var(--text-muted);">${s.studentRollNo || ''}</div>
                  </td>
                  <td>${window.UI.escapeHtml(s.companyName || '-')}</td>
                  <td>${window.UI.escapeHtml(s.role || 'Software Engineer')}</td>
                  <td style="color:var(--success); font-weight:700;">${s.packageLpa ? s.packageLpa + ' LPA' : '-'}</td>
                  <td>${window.UI.formatDate(s.offerDate)}</td>
                  <td>${window.UI.renderBadge(s.status || 'OFFERED')}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  // 11. TRAINING CRUD
  async renderTraining(container) {
    const trainings = await window.API.get('/training');

    container.innerHTML = `
      <div class="portal-header">
        <div>
          <h1 class="portal-title">Skill & Training Programs</h1>
          <div class="portal-breadcrumb">Admin &rsaquo; Training</div>
        </div>
        <div class="portal-header-actions">
          <button class="btn btn-primary btn-sm" onclick="window.AdminPortal.showCreateTrainingModal()">+ New Training Program</button>
        </div>
      </div>

      <div class="card">
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Program Title</th>
                <th>Instructor</th>
                <th>Dates</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${(trainings || []).map(t => `
                <tr>
                  <td>
                    <strong>${window.UI.escapeHtml(t.title)}</strong>
                    <div style="font-size:0.85rem; color:var(--text-muted);">${window.UI.escapeHtml(t.description?.substring(0, 75) || '')}...</div>
                  </td>
                  <td>${window.UI.escapeHtml(t.instructor || 'Faculty')}</td>
                  <td>${t.startDate ? window.UI.formatDate(t.startDate) : ''} - ${t.endDate ? window.UI.formatDate(t.endDate) : ''}</td>
                  <td>${window.UI.renderBadge(t.status || 'ACTIVE')}</td>
                  <td>
                    <div style="display:flex; gap:0.5rem;">
                      <a href="/training/${t._id}" class="btn btn-outline btn-sm" data-link>View</a>
                      <button class="btn btn-danger btn-sm" onclick="window.AdminPortal.deleteTraining('${t._id}')">🗑️</button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  showCreateTrainingModal() {
    window.UI.openModal(`
      <h3 style="font-weight:800; margin-bottom:1rem;">Add Training Program</h3>
      <form id="admin-create-tr-form">
        <div class="form-group">
          <label>Program Title</label>
          <input type="text" id="ctr-title" class="form-control" required placeholder="e.g. Full Stack System Design Boot Camp">
        </div>
        <div class="form-group">
          <label>Instructor / Agency</label>
          <input type="text" id="ctr-instructor" class="form-control" placeholder="e.g. Industry Specialists">
        </div>
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:1rem;">
          <div class="form-group">
            <label>Start Date</label>
            <input type="date" id="ctr-start" class="form-control" required>
          </div>
          <div class="form-group">
            <label>End Date</label>
            <input type="date" id="ctr-end" class="form-control" required>
          </div>
        </div>
        <div class="form-group">
          <label>Program Overview</label>
          <textarea id="ctr-desc" class="form-control" rows="3" placeholder="Syllabus, topics, prerequisites..."></textarea>
        </div>
        <div style="display:flex; justify-content:flex-end; gap:0.5rem; margin-top:1.5rem;">
          <button type="button" class="btn btn-outline" onclick="window.UI.closeModal()">Cancel</button>
          <button type="submit" class="btn btn-primary">Create Program</button>
        </div>
      </form>
    `);

    document.getElementById('admin-create-tr-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      try {
        await window.API.post('/training', {
          title: document.getElementById('ctr-title').value,
          instructor: document.getElementById('ctr-instructor').value,
          startDate: document.getElementById('ctr-start').value,
          endDate: document.getElementById('ctr-end').value,
          description: document.getElementById('ctr-desc').value,
          status: 'UPCOMING'
        });
        window.UI.closeModal();
        window.UI.showToast('Training program created!', 'success');
        this.render('training');
      } catch (err) {
        window.UI.showToast(err.message, 'error');
      }
    });
  },

  async deleteTraining(id) {
    if (!confirm('Are you sure you want to remove this training program?')) return;
    try {
      await window.API.delete(`/training/${id}`);
      window.UI.showToast('Training removed', 'success');
      this.render('training');
    } catch (err) {
      window.UI.showToast(err.message, 'error');
    }
  },

  // 12. INTERNSHIPS CRUD
  async renderInternships(container) {
    const internships = await window.API.get('/internships');

    container.innerHTML = `
      <div class="portal-header">
        <div>
          <h1 class="portal-title">Internship Opportunities</h1>
          <div class="portal-breadcrumb">Admin &rsaquo; Internships</div>
        </div>
        <div class="portal-header-actions">
          <button class="btn btn-primary btn-sm" onclick="window.AdminPortal.showCreateInternshipModal()">+ Post Internship</button>
        </div>
      </div>

      <div class="card">
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Role</th>
                <th>Company</th>
                <th>Stipend</th>
                <th>Duration</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${(internships || []).map(i => `
                <tr>
                  <td><strong>${window.UI.escapeHtml(i.role || i.title)}</strong></td>
                  <td>${window.UI.escapeHtml(i.company || i.companyName || '-')}</td>
                  <td style="color:var(--success); font-weight:700;">${i.stipend ? '₹' + i.stipend + '/month' : 'Unpaid'}</td>
                  <td>${window.UI.escapeHtml(i.duration || '3 Months')}</td>
                  <td>
                    <button class="btn btn-danger btn-sm" onclick="window.AdminPortal.deleteInternship('${i._id}')">🗑️</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  showCreateInternshipModal() {
    window.UI.openModal(`
      <h3 style="font-weight:800; margin-bottom:1rem;">Post New Internship</h3>
      <form id="admin-create-int-form">
        <div class="form-group">
          <label>Company Name</label>
          <input type="text" id="cint-company" class="form-control" required placeholder="e.g. Microsoft">
        </div>
        <div class="form-group">
          <label>Role</label>
          <input type="text" id="cint-role" class="form-control" required placeholder="e.g. Research Intern">
        </div>
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:1rem;">
          <div class="form-group">
            <label>Stipend (₹ / month)</label>
            <input type="number" id="cint-stipend" class="form-control" placeholder="50000">
          </div>
          <div class="form-group">
            <label>Duration</label>
            <input type="text" id="cint-duration" class="form-control" placeholder="e.g. 6 Months">
          </div>
        </div>
        <div class="form-group">
          <label>Description</label>
          <textarea id="cint-desc" class="form-control" rows="3"></textarea>
        </div>
        <div style="display:flex; justify-content:flex-end; gap:0.5rem; margin-top:1.5rem;">
          <button type="button" class="btn btn-outline" onclick="window.UI.closeModal()">Cancel</button>
          <button type="submit" class="btn btn-primary">Post Internship</button>
        </div>
      </form>
    `);

    document.getElementById('admin-create-int-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      try {
        await window.API.post('/internships', {
          company: document.getElementById('cint-company').value,
          role: document.getElementById('cint-role').value,
          stipend: parseFloat(document.getElementById('cint-stipend').value || 0),
          duration: document.getElementById('cint-duration').value,
          description: document.getElementById('cint-desc').value
        });
        window.UI.closeModal();
        window.UI.showToast('Internship opportunity posted!', 'success');
        this.render('internships');
      } catch (err) {
        window.UI.showToast(err.message, 'error');
      }
    });
  },

  async deleteInternship(id) {
    if (!confirm('Are you sure you want to delete this internship?')) return;
    try {
      await window.API.delete(`/internships/${id}`);
      window.UI.showToast('Internship removed', 'success');
      this.render('internships');
    } catch (err) {
      window.UI.showToast(err.message, 'error');
    }
  },

  // 13. INDUSTRY EVENTS
  async renderEvents(container) {
    const events = await window.API.get('/events');

    container.innerHTML = `
      <div class="portal-header">
        <div>
          <h1 class="portal-title">Industry Events & Workshops</h1>
          <div class="portal-breadcrumb">Admin &rsaquo; Industry Events</div>
        </div>
        <div class="portal-header-actions">
          <button class="btn btn-primary btn-sm" onclick="window.AdminPortal.showCreateEventModal()">+ Add Event</button>
        </div>
      </div>

      <div class="card">
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Event Title</th>
                <th>Speaker / Host</th>
                <th>Date & Time</th>
                <th>Venue</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${(events || []).map(ev => `
                <tr>
                  <td><strong>${window.UI.escapeHtml(ev.title)}</strong></td>
                  <td>${window.UI.escapeHtml(ev.speaker || 'Guest Speaker')}</td>
                  <td>${window.UI.formatDate(ev.eventDate)} ${ev.time || ''}</td>
                  <td>${window.UI.escapeHtml(ev.venue || 'Auditorium')}</td>
                  <td>
                    <button class="btn btn-danger btn-sm" onclick="window.AdminPortal.deleteEvent('${ev._id}')">🗑️</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  showCreateEventModal() {
    window.UI.openModal(`
      <h3 style="font-weight:800; margin-bottom:1rem;">Add Industry Event</h3>
      <form id="admin-create-ev-form">
        <div class="form-group">
          <label>Event Title</label>
          <input type="text" id="cev-title" class="form-control" required placeholder="e.g. AI Leadership Talk 2026">
        </div>
        <div class="form-group">
          <label>Speaker / Organization</label>
          <input type="text" id="cev-speaker" class="form-control" placeholder="e.g. VP of Engineering at Google">
        </div>
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:1rem;">
          <div class="form-group">
            <label>Event Date</label>
            <input type="date" id="cev-date" class="form-control" required>
          </div>
          <div class="form-group">
            <label>Time</label>
            <input type="text" id="cev-time" class="form-control" placeholder="10:00 AM - 1:00 PM">
          </div>
        </div>
        <div class="form-group">
          <label>Venue</label>
          <input type="text" id="cev-venue" class="form-control" placeholder="Main Auditorium or Google Meet">
        </div>
        <div style="display:flex; justify-content:flex-end; gap:0.5rem; margin-top:1.5rem;">
          <button type="button" class="btn btn-outline" onclick="window.UI.closeModal()">Cancel</button>
          <button type="submit" class="btn btn-primary">Schedule Event</button>
        </div>
      </form>
    `);

    document.getElementById('admin-create-ev-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      try {
        await window.API.post('/events', {
          title: document.getElementById('cev-title').value,
          speaker: document.getElementById('cev-speaker').value,
          eventDate: document.getElementById('cev-date').value,
          time: document.getElementById('cev-time').value,
          venue: document.getElementById('cev-venue').value
        });
        window.UI.closeModal();
        window.UI.showToast('Event created successfully!', 'success');
        this.render('events');
      } catch (err) {
        window.UI.showToast(err.message, 'error');
      }
    });
  },

  async deleteEvent(id) {
    if (!confirm('Are you sure you want to delete this event?')) return;
    try {
      await window.API.delete(`/events/${id}`);
      window.UI.showToast('Event removed', 'success');
      this.render('events');
    } catch (err) {
      window.UI.showToast(err.message, 'error');
    }
  },

  // 14. ANNOUNCEMENTS CRUD
  async renderAnnouncements(container) {
    const notices = await window.API.get('/announcements');

    container.innerHTML = `
      <div class="portal-header">
        <div>
          <h1 class="portal-title">Official Announcements</h1>
          <div class="portal-breadcrumb">Admin &rsaquo; Announcements</div>
        </div>
        <div class="portal-header-actions">
          <button class="btn btn-primary btn-sm" onclick="window.AdminPortal.showCreateAnnouncementModal()">+ Publish Announcement</button>
        </div>
      </div>

      <div class="card">
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${(notices || []).map(n => `
                <tr>
                  <td><strong>${window.UI.escapeHtml(n.title)}</strong></td>
                  <td><span class="badge badge-info">${window.UI.escapeHtml(n.category || 'General')}</span></td>
                  <td>${window.UI.formatDate(n.createdAt)}</td>
                  <td>
                    <button class="btn btn-danger btn-sm" onclick="window.AdminPortal.deleteAnnouncement('${n._id}')">🗑️</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  showCreateAnnouncementModal() {
    window.UI.openModal(`
      <h3 style="font-weight:800; margin-bottom:1rem;">Post Announcement</h3>
      <form id="admin-create-ann-form">
        <div class="form-group">
          <label>Title</label>
          <input type="text" id="cann-title" class="form-control" required placeholder="e.g. Placement Registration Deadline Extended">
        </div>
        <div class="form-group">
          <label>Category</label>
          <select id="cann-cat" class="form-control">
            <option value="Placement">Placement</option>
            <option value="Training">Training</option>
            <option value="Urgent">Urgent Notice</option>
            <option value="General">General</option>
          </select>
        </div>
        <div class="form-group">
          <label>Content</label>
          <textarea id="cann-content" class="form-control" rows="4" required placeholder="Announcement details..."></textarea>
        </div>
        <div style="display:flex; justify-content:flex-end; gap:0.5rem; margin-top:1.5rem;">
          <button type="button" class="btn btn-outline" onclick="window.UI.closeModal()">Cancel</button>
          <button type="submit" class="btn btn-primary">Publish Announcement</button>
        </div>
      </form>
    `);

    document.getElementById('admin-create-ann-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      try {
        await window.API.post('/announcements', {
          title: document.getElementById('cann-title').value,
          category: document.getElementById('cann-cat').value,
          content: document.getElementById('cann-content').value,
          isPublished: true
        });
        window.UI.closeModal();
        window.UI.showToast('Announcement published!', 'success');
        this.render('announcements');
      } catch (err) {
        window.UI.showToast(err.message, 'error');
      }
    });
  },

  async deleteAnnouncement(id) {
    if (!confirm('Are you sure you want to delete this announcement?')) return;
    try {
      await window.API.delete(`/announcements/${id}`);
      window.UI.showToast('Announcement removed', 'success');
      this.render('announcements');
    } catch (err) {
      window.UI.showToast(err.message, 'error');
    }
  },

  // 15. NOTIFICATIONS
  async renderNotifications(container) {
    const notifs = await window.API.get('/notifications');

    container.innerHTML = `
      <div class="portal-header">
        <div>
          <h1 class="portal-title">Direct System Notifications</h1>
          <div class="portal-breadcrumb">Admin &rsaquo; Notifications</div>
        </div>
        <div class="portal-header-actions">
          <button class="btn btn-primary btn-sm" onclick="window.AdminPortal.showCreateNotifModal()">+ Send Notification</button>
        </div>
      </div>

      <div class="card">
        ${(notifs || []).length === 0 ? '<p style="color:var(--text-muted);">No notifications sent.</p>' : `
          <div style="display:flex; flex-direction:column; gap:1rem;">
            ${notifs.map(n => `
              <div style="padding:1rem; border-left:4px solid var(--primary); background:var(--bg-light); border-radius:0 8px 8px 0;">
                <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                  <strong style="font-size:1.05rem;">${window.UI.escapeHtml(n.title)}</strong>
                  <small style="color:var(--text-muted);">${window.UI.formatDate(n.createdAt)}</small>
                </div>
                <p style="margin:0.5rem 0 0 0; color:var(--text-secondary); font-size:0.95rem;">${window.UI.escapeHtml(n.message)}</p>
                <div style="margin-top:0.5rem;">
                  <span class="badge badge-info">Target: ${window.UI.escapeHtml(n.targetRole || 'ALL')}</span>
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </div>
    `;
  },

  showCreateNotifModal() {
    window.UI.openModal(`
      <h3 style="font-weight:800; margin-bottom:1rem;">Broadcast System Notification</h3>
      <form id="admin-create-notif-form">
        <div class="form-group">
          <label>Notification Title</label>
          <input type="text" id="cnotif-title" class="form-control" required placeholder="e.g. Server Maintenance Notice">
        </div>
        <div class="form-group">
          <label>Target Audience</label>
          <select id="cnotif-target" class="form-control">
            <option value="ALL">All Users</option>
            <option value="STUDENT">All Students</option>
            <option value="RECRUITER">All Recruiters</option>
            <option value="COORDINATOR">All Coordinators</option>
          </select>
        </div>
        <div class="form-group">
          <label>Message Content</label>
          <textarea id="cnotif-msg" class="form-control" rows="4" required></textarea>
        </div>
        <div style="display:flex; justify-content:flex-end; gap:0.5rem; margin-top:1.5rem;">
          <button type="button" class="btn btn-outline" onclick="window.UI.closeModal()">Cancel</button>
          <button type="submit" class="btn btn-primary">Send Notification</button>
        </div>
      </form>
    `);

    document.getElementById('admin-create-notif-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      try {
        await window.API.post('/notifications', {
          title: document.getElementById('cnotif-title').value,
          targetRole: document.getElementById('cnotif-target').value,
          message: document.getElementById('cnotif-msg').value
        });
        window.UI.closeModal();
        window.UI.showToast('Notification broadcasted!', 'success');
        this.render('notifications');
      } catch (err) {
        window.UI.showToast(err.message, 'error');
      }
    });
  },

  // 16. RESOURCES CRUD
  async renderResources(container) {
    const resources = await window.API.get('/resources');

    container.innerHTML = `
      <div class="portal-header">
        <div>
          <h1 class="portal-title">Preparation Resources Manager</h1>
          <div class="portal-breadcrumb">Admin &rsaquo; Resources</div>
        </div>
        <div class="portal-header-actions">
          <button class="btn btn-primary btn-sm" onclick="window.AdminPortal.showCreateResourceModal()">+ Add Resource</button>
        </div>
      </div>

      <div class="card">
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Link / File</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${(resources || []).map(r => `
                <tr>
                  <td><strong>${window.UI.escapeHtml(r.title)}</strong></td>
                  <td><span class="badge badge-info">${window.UI.escapeHtml(r.category || 'General')}</span></td>
                  <td><a href="${r.fileUrl || r.link || '#'}" target="_blank" class="btn btn-outline btn-sm">Open</a></td>
                  <td>
                    <button class="btn btn-danger btn-sm" onclick="window.AdminPortal.deleteResource('${r._id}')">🗑️</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  showCreateResourceModal() {
    window.UI.openModal(`
      <h3 style="font-weight:800; margin-bottom:1rem;">Add Resource</h3>
      <form id="admin-create-res-form">
        <div class="form-group">
          <label>Resource Title</label>
          <input type="text" id="cres-title" class="form-control" required placeholder="e.g. Dynamic Programming Cheat Sheet">
        </div>
        <div class="form-group">
          <label>Category</label>
          <select id="cres-cat" class="form-control">
            <option value="Coding">Coding</option>
            <option value="Aptitude">Aptitude</option>
            <option value="Interview Prep">Interview Prep</option>
            <option value="Resume Templates">Resume Templates</option>
          </select>
        </div>
        <div class="form-group">
          <label>External URL or Document Link</label>
          <input type="url" id="cres-url" class="form-control" required placeholder="https://drive.google.com/...">
        </div>
        <div style="display:flex; justify-content:flex-end; gap:0.5rem; margin-top:1.5rem;">
          <button type="button" class="btn btn-outline" onclick="window.UI.closeModal()">Cancel</button>
          <button type="submit" class="btn btn-primary">Save Resource</button>
        </div>
      </form>
    `);

    document.getElementById('admin-create-res-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      try {
        await window.API.post('/resources', {
          title: document.getElementById('cres-title').value,
          category: document.getElementById('cres-cat').value,
          fileUrl: document.getElementById('cres-url').value
        });
        window.UI.closeModal();
        window.UI.showToast('Resource added!', 'success');
        this.render('resources');
      } catch (err) {
        window.UI.showToast(err.message, 'error');
      }
    });
  },

  async deleteResource(id) {
    if (!confirm('Are you sure you want to delete this resource?')) return;
    try {
      await window.API.delete(`/resources/${id}`);
      window.UI.showToast('Resource removed', 'success');
      this.render('resources');
    } catch (err) {
      window.UI.showToast(err.message, 'error');
    }
  },

  // 17. GALLERY CRUD
  async renderGallery(container) {
    const gallery = await window.API.get('/gallery');

    container.innerHTML = `
      <div class="portal-header">
        <div>
          <h1 class="portal-title">Photo Gallery Manager</h1>
          <div class="portal-breadcrumb">Admin &rsaquo; Gallery</div>
        </div>
        <div class="portal-header-actions">
          <button class="btn btn-primary btn-sm" onclick="window.AdminPortal.showCreateGalleryModal()">+ Add Gallery Item</button>
        </div>
      </div>

      <div class="card">
        <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap:1.5rem;">
          ${(gallery || []).map(g => `
            <div style="border:1px solid var(--border-color); border-radius:8px; overflow:hidden;">
              <img src="${g.imageUrl}" style="width:100%; height:150px; object-fit:cover;" onerror="this.src='/images/placeholder.jpg'">
              <div style="padding:1rem;">
                <strong>${window.UI.escapeHtml(g.title)}</strong>
                <p style="font-size:0.85rem; color:var(--text-muted); margin-top:0.25rem;">${window.UI.escapeHtml(g.category || '')}</p>
                <button class="btn btn-danger btn-sm" style="margin-top:0.5rem; width:100%;" onclick="window.AdminPortal.deleteGallery('${g._id}')">Delete</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  showCreateGalleryModal() {
    window.UI.openModal(`
      <h3 style="font-weight:800; margin-bottom:1rem;">Add Gallery Photo</h3>
      <form id="admin-create-gal-form">
        <div class="form-group">
          <label>Title</label>
          <input type="text" id="cgal-title" class="form-control" required placeholder="e.g. Annual Placement Day 2026">
        </div>
        <div class="form-group">
          <label>Category</label>
          <input type="text" id="cgal-cat" class="form-control" placeholder="e.g. Campus Drives, Celebrations">
        </div>
        <div class="form-group">
          <label>Image URL</label>
          <input type="url" id="cgal-url" class="form-control" required placeholder="https://images.unsplash.com/...">
        </div>
        <div style="display:flex; justify-content:flex-end; gap:0.5rem; margin-top:1.5rem;">
          <button type="button" class="btn btn-outline" onclick="window.UI.closeModal()">Cancel</button>
          <button type="submit" class="btn btn-primary">Add Photo</button>
        </div>
      </form>
    `);

    document.getElementById('admin-create-gal-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      try {
        await window.API.post('/gallery', {
          title: document.getElementById('cgal-title').value,
          category: document.getElementById('cgal-cat').value,
          imageUrl: document.getElementById('cgal-url').value
        });
        window.UI.closeModal();
        window.UI.showToast('Gallery photo added!', 'success');
        this.render('gallery');
      } catch (err) {
        window.UI.showToast(err.message, 'error');
      }
    });
  },

  async deleteGallery(id) {
    if (!confirm('Are you sure you want to delete this gallery photo?')) return;
    try {
      await window.API.delete(`/gallery/${id}`);
      window.UI.showToast('Gallery item removed', 'success');
      this.render('gallery');
    } catch (err) {
      window.UI.showToast(err.message, 'error');
    }
  },

  // 18. ACHIEVEMENTS CRUD
  async renderAchievements(container) {
    const achs = await window.API.get('/achievements');

    container.innerHTML = `
      <div class="portal-header">
        <div>
          <h1 class="portal-title">College Placement Achievements</h1>
          <div class="portal-breadcrumb">Admin &rsaquo; Achievements</div>
        </div>
        <div class="portal-header-actions">
          <button class="btn btn-primary btn-sm" onclick="window.AdminPortal.showCreateAchievementModal()">+ Add Achievement</button>
        </div>
      </div>

      <div class="card">
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Year</th>
                <th>Highlight Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${(achs || []).map(a => `
                <tr>
                  <td><strong>${window.UI.escapeHtml(a.title)}</strong></td>
                  <td>${a.year || '2026'}</td>
                  <td>${window.UI.escapeHtml(a.description || '')}</td>
                  <td>
                    <button class="btn btn-danger btn-sm" onclick="window.AdminPortal.deleteAchievement('${a._id}')">🗑️</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  showCreateAchievementModal() {
    window.UI.openModal(`
      <h3 style="font-weight:800; margin-bottom:1rem;">Add Placement Achievement</h3>
      <form id="admin-create-ach-form">
        <div class="form-group">
          <label>Title</label>
          <input type="text" id="cach-title" class="form-control" required placeholder="e.g. NIRF Top 50 Placement Ranking">
        </div>
        <div class="form-group">
          <label>Year</label>
          <input type="number" id="cach-year" class="form-control" value="2026" required>
        </div>
        <div class="form-group">
          <label>Description</label>
          <textarea id="cach-desc" class="form-control" rows="3" required></textarea>
        </div>
        <div style="display:flex; justify-content:flex-end; gap:0.5rem; margin-top:1.5rem;">
          <button type="button" class="btn btn-outline" onclick="window.UI.closeModal()">Cancel</button>
          <button type="submit" class="btn btn-primary">Save Achievement</button>
        </div>
      </form>
    `);

    document.getElementById('admin-create-ach-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      try {
        await window.API.post('/achievements', {
          title: document.getElementById('cach-title').value,
          year: parseInt(document.getElementById('cach-year').value, 10),
          description: document.getElementById('cach-desc').value
        });
        window.UI.closeModal();
        window.UI.showToast('Achievement saved!', 'success');
        this.render('achievements');
      } catch (err) {
        window.UI.showToast(err.message, 'error');
      }
    });
  },

  async deleteAchievement(id) {
    if (!confirm('Are you sure you want to delete this achievement?')) return;
    try {
      await window.API.delete(`/achievements/${id}`);
      window.UI.showToast('Achievement removed', 'success');
      this.render('achievements');
    } catch (err) {
      window.UI.showToast(err.message, 'error');
    }
  },

  // 19. SUCCESS STORIES CRUD
  async renderSuccessStories(container) {
    const stories = await window.API.get('/success-stories');

    container.innerHTML = `
      <div class="portal-header">
        <div>
          <h1 class="portal-title">Student Success Stories</h1>
          <div class="portal-breadcrumb">Admin &rsaquo; Success Stories</div>
        </div>
        <div class="portal-header-actions">
          <button class="btn btn-primary btn-sm" onclick="window.AdminPortal.showCreateStoryModal()">+ Add Success Story</button>
        </div>
      </div>

      <div class="card">
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Company</th>
                <th>Package</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${(stories || []).map(st => `
                <tr>
                  <td><strong>${window.UI.escapeHtml(st.studentName)}</strong></td>
                  <td>${window.UI.escapeHtml(st.companyName || '-')}</td>
                  <td style="color:var(--success); font-weight:700;">${st.packageLpa ? st.packageLpa + ' LPA' : '-'}</td>
                  <td>${window.UI.escapeHtml(st.role || '')}</td>
                  <td>
                    <button class="btn btn-danger btn-sm" onclick="window.AdminPortal.deleteStory('${st._id}')">🗑️</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  showCreateStoryModal() {
    window.UI.openModal(`
      <h3 style="font-weight:800; margin-bottom:1rem;">Add Success Story</h3>
      <form id="admin-create-st-form">
        <div class="form-group">
          <label>Student Name</label>
          <input type="text" id="cst-name" class="form-control" required placeholder="e.g. Priya Sharma">
        </div>
        <div class="form-group">
          <label>Company Placed</label>
          <input type="text" id="cst-company" class="form-control" required placeholder="e.g. Google">
        </div>
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:1rem;">
          <div class="form-group">
            <label>Package (LPA)</label>
            <input type="number" id="cst-pkg" class="form-control" step="0.1" required placeholder="43.5">
          </div>
          <div class="form-group">
            <label>Role</label>
            <input type="text" id="cst-role" class="form-control" placeholder="e.g. Software Engineer">
          </div>
        </div>
        <div class="form-group">
          <label>Student Story / Testimonial</label>
          <textarea id="cst-story" class="form-control" rows="3" required placeholder="Preparation journey, guidance from T&P cell..."></textarea>
        </div>
        <div style="display:flex; justify-content:flex-end; gap:0.5rem; margin-top:1.5rem;">
          <button type="button" class="btn btn-outline" onclick="window.UI.closeModal()">Cancel</button>
          <button type="submit" class="btn btn-primary">Add Story</button>
        </div>
      </form>
    `);

    document.getElementById('admin-create-st-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      try {
        await window.API.post('/success-stories', {
          studentName: document.getElementById('cst-name').value,
          companyName: document.getElementById('cst-company').value,
          packageLpa: parseFloat(document.getElementById('cst-pkg').value),
          role: document.getElementById('cst-role').value,
          story: document.getElementById('cst-story').value
        });
        window.UI.closeModal();
        window.UI.showToast('Success story posted!', 'success');
        this.render('success-stories');
      } catch (err) {
        window.UI.showToast(err.message, 'error');
      }
    });
  },

  async deleteStory(id) {
    if (!confirm('Are you sure you want to delete this story?')) return;
    try {
      await window.API.delete(`/success-stories/${id}`);
      window.UI.showToast('Story removed', 'success');
      this.render('success-stories');
    } catch (err) {
      window.UI.showToast(err.message, 'error');
    }
  },

  // 20. REPORTS & EXPORTS
  async renderReports(container) {
    container.innerHTML = `
      <div class="portal-header">
        <div>
          <h1 class="portal-title">Placement Reports & Data Export</h1>
          <div class="portal-breadcrumb">Admin &rsaquo; Reports</div>
        </div>
      </div>

      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap:1.5rem;">
        <div class="card">
          <h3 style="font-weight:700; margin-bottom:0.5rem;">📊 Complete Students Register</h3>
          <p style="color:var(--text-muted); font-size:0.9rem; margin-bottom:1rem;">All student records, CGPA, backlogs, branch, and current placement status.</p>
          <div style="display:flex; gap:0.5rem;">
            <a href="/api/reports/export/students?format=csv" target="_blank" class="btn btn-primary btn-sm">Export CSV</a>
            <a href="/api/reports/export/students?format=excel" target="_blank" class="btn btn-outline btn-sm">Export Excel</a>
          </div>
        </div>

        <div class="card">
          <h3 style="font-weight:700; margin-bottom:0.5rem;">🎉 Placed Candidates Report</h3>
          <p style="color:var(--text-muted); font-size:0.9rem; margin-bottom:1rem;">Verified placed candidates with company names, CTC package, and date of offer.</p>
          <div style="display:flex; gap:0.5rem;">
            <a href="/api/reports/export/placed?format=csv" target="_blank" class="btn btn-primary btn-sm">Export CSV</a>
            <a href="/api/reports/export/placed?format=excel" target="_blank" class="btn btn-outline btn-sm">Export Excel</a>
          </div>
        </div>

        <div class="card">
          <h3 style="font-weight:700; margin-bottom:0.5rem;">🎯 Placement Drives Master</h3>
          <p style="color:var(--text-muted); font-size:0.9rem; margin-bottom:1rem;">Complete audit of drives, packages, vacancies, and candidate turnout.</p>
          <div style="display:flex; gap:0.5rem;">
            <a href="/api/reports/export/drives?format=csv" target="_blank" class="btn btn-primary btn-sm">Export CSV</a>
            <a href="/api/reports/export/drives?format=excel" target="_blank" class="btn btn-outline btn-sm">Export Excel</a>
          </div>
        </div>

        <div class="card">
          <h3 style="font-weight:700; margin-bottom:0.5rem;">🏢 Partner Companies Directory</h3>
          <p style="color:var(--text-muted); font-size:0.9rem; margin-bottom:1rem;">List of tier classifications, company contacts, and total hiring records.</p>
          <div style="display:flex; gap:0.5rem;">
            <a href="/api/reports/export/companies?format=csv" target="_blank" class="btn btn-primary btn-sm">Export CSV</a>
            <a href="/api/reports/export/companies?format=excel" target="_blank" class="btn btn-outline btn-sm">Export Excel</a>
          </div>
        </div>
      </div>
    `;
  },

  // 21. ANALYTICS
  async renderAnalytics(container) {
    const analytics = await window.API.get('/analytics');

    container.innerHTML = `
      <div class="portal-header">
        <div>
          <h1 class="portal-title">Recruitment Analytics & Insights</h1>
          <div class="portal-breadcrumb">Admin &rsaquo; Analytics</div>
        </div>
      </div>

      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap:1.5rem;">
        <div class="card">
          <h3 style="font-weight:700; margin-bottom:1rem;">Salary Distribution Range</h3>
          <div style="display:flex; flex-direction:column; gap:0.75rem;">
            ${(analytics.salaryDistribution || [
              { range: 'Above 20 LPA', count: 1, pct: 25 },
              { range: '10 - 20 LPA', count: 1, pct: 25 },
              { range: '6 - 10 LPA', count: 1, pct: 25 },
              { range: '3.5 - 6 LPA', count: 1, pct: 25 }
            ]).map(s => `
              <div>
                <div style="display:flex; justify-content:space-between; margin-bottom:0.25rem;">
                  <span>${s.range}</span>
                  <strong>${s.count} Offers</strong>
                </div>
                <div style="height:8px; background:var(--border-color); border-radius:4px; overflow:hidden;">
                  <div style="height:100%; width:${s.pct}%; background:var(--primary); border-radius:4px;"></div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="card">
          <h3 style="font-weight:700; margin-bottom:1rem;">Top Recruiting Partners</h3>
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Hires</th>
                  <th>Highest CTC</th>
                </tr>
              </thead>
              <tbody>
                ${(analytics.topRecruiters || [
                  { company: 'Google India', hires: 1, maxCtc: '43.5 LPA' },
                  { company: 'Microsoft', hires: 1, maxCtc: '41.0 LPA' }
                ]).map(r => `
                  <tr>
                    <td><strong>${r.company}</strong></td>
                    <td>${r.hires}</td>
                    <td style="color:var(--success); font-weight:700;">${r.maxCtc}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  },

  // 22. USERS & ROLES
  async renderUsers(container) {
    const users = await window.API.get('/users');

    container.innerHTML = `
      <div class="portal-header">
        <div>
          <h1 class="portal-title">System Users & Access Roles</h1>
          <div class="portal-breadcrumb">Admin &rsaquo; Users</div>
        </div>
        <div class="portal-header-actions">
          <button class="btn btn-primary btn-sm" onclick="window.AdminPortal.showCreateUserModal()">+ Add New User</button>
        </div>
      </div>

      <div class="card">
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${(users || []).map(u => `
                <tr>
                  <td>
                    <strong>${window.UI.escapeHtml(u.name)}</strong>
                    <div style="font-size:0.85rem; color:var(--text-muted);">${window.UI.escapeHtml(u.email)}</div>
                  </td>
                  <td><span class="badge badge-info">${window.UI.escapeHtml(u.role)}</span></td>
                  <td>${u.isActive ? '<span class="badge badge-success">ACTIVE</span>' : '<span class="badge badge-danger">SUSPENDED</span>'}</td>
                  <td>${window.UI.formatDate(u.createdAt)}</td>
                  <td>
                    <button class="btn btn-outline btn-sm" onclick="window.AdminPortal.toggleUserStatus('${u._id}', ${!u.isActive})">
                      ${u.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  showCreateUserModal() {
    window.UI.openModal(`
      <h3 style="font-weight:800; margin-bottom:1rem;">Add System User</h3>
      <form id="admin-create-usr-form">
        <div class="form-group">
          <label>Full Name</label>
          <input type="text" id="cusr-name" class="form-control" required placeholder="e.g. Prof. Arvind Kumar">
        </div>
        <div class="form-group">
          <label>Email Address</label>
          <input type="email" id="cusr-email" class="form-control" required placeholder="arvind@tpoconnect.edu">
        </div>
        <div class="form-group">
          <label>Password</label>
          <input type="password" id="cusr-pwd" class="form-control" required placeholder="Minimum 6 characters">
        </div>
        <div class="form-group">
          <label>Role</label>
          <select id="cusr-role" class="form-control" required>
            <option value="COORDINATOR">Department Placement Coordinator</option>
            <option value="ADMIN">Training & Placement Officer (Admin)</option>
            <option value="RECRUITER">Corporate Recruiter</option>
            <option value="STUDENT">Student</option>
          </select>
        </div>
        <div style="display:flex; justify-content:flex-end; gap:0.5rem; margin-top:1.5rem;">
          <button type="button" class="btn btn-outline" onclick="window.UI.closeModal()">Cancel</button>
          <button type="submit" class="btn btn-primary">Create User</button>
        </div>
      </form>
    `);

    document.getElementById('admin-create-usr-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      try {
        await window.API.post('/users', {
          name: document.getElementById('cusr-name').value,
          email: document.getElementById('cusr-email').value,
          password: document.getElementById('cusr-pwd').value,
          role: document.getElementById('cusr-role').value
        });
        window.UI.closeModal();
        window.UI.showToast('User created successfully!', 'success');
        this.render('users');
      } catch (err) {
        window.UI.showToast(err.message, 'error');
      }
    });
  },

  async toggleUserStatus(id, newActive) {
    try {
      await window.API.patch(`/users/${id}/status`, { isActive: newActive });
      window.UI.showToast('User status updated!', 'success');
      this.render('users');
    } catch (err) {
      window.UI.showToast(err.message, 'error');
    }
  },

  // 23. AUDIT LOGS
  async renderAuditLogs(container) {
    const logs = await window.API.get('/audit-logs');

    container.innerHTML = `
      <div class="portal-header">
        <div>
          <h1 class="portal-title">System Security & Audit Logs</h1>
          <div class="portal-breadcrumb">Admin &rsaquo; Audit Logs</div>
        </div>
      </div>

      <div class="card">
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>User / Actor</th>
                <th>Action</th>
                <th>Resource</th>
                <th>IP Address</th>
              </tr>
            </thead>
            <tbody>
              ${(logs || []).map(l => `
                <tr>
                  <td><code>${window.UI.formatDate(l.createdAt)}</code></td>
                  <td><strong>${window.UI.escapeHtml(l.userName || l.userEmail || 'System')}</strong></td>
                  <td><span class="badge badge-info">${window.UI.escapeHtml(l.action)}</span></td>
                  <td>${window.UI.escapeHtml(l.resource || '-')}</td>
                  <td><code>${l.ipAddress || '127.0.0.1'}</code></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  // 24. WEBSITE CONTENT EDITOR
  async renderContentEditor(container) {
    const settings = await window.API.get('/settings');

    container.innerHTML = `
      <div class="portal-header">
        <div>
          <h1 class="portal-title">Dynamic Website Content Editor</h1>
          <div class="portal-breadcrumb">Admin &rsaquo; Website Content</div>
        </div>
      </div>

      <div class="card" style="max-width:850px;">
        <form id="admin-content-form">
          <h3 style="font-weight:700; margin-bottom:1rem;">Homepage Hero Section</h3>
          <div class="form-group">
            <label>Hero Title</label>
            <input type="text" id="cnt-hero-title" class="form-control" value="${window.UI.escapeHtml(settings.heroTitle || 'Empowering Careers, Shaping Tomorrow')}" required>
          </div>
          <div class="form-group">
            <label>Hero Subtitle</label>
            <textarea id="cnt-hero-sub" class="form-control" rows="3" required>${window.UI.escapeHtml(settings.heroSubtitle || 'The premier training and placement portal connecting aspiring engineers with industry titans.')}</textarea>
          </div>

          <h3 style="font-weight:700; margin-top:2rem; margin-bottom:1rem;">T&P Officer Message</h3>
          <div class="form-group">
            <label>Officer Name & Title</label>
            <input type="text" id="cnt-officer-name" class="form-control" value="${window.UI.escapeHtml(settings.officerName || 'Dr. K. R. Sharma, Head - Training & Placement')}">
          </div>
          <div class="form-group">
            <label>Officer Message</label>
            <textarea id="cnt-officer-msg" class="form-control" rows="4">${window.UI.escapeHtml(settings.officerMessage || 'Our dedicated placement cell tirelessly bridges the gap between academic prowess and industrial requirements.')}</textarea>
          </div>

          <div style="display:flex; justify-content:flex-end; margin-top:2rem;">
            <button type="submit" class="btn btn-primary">Save Content Changes</button>
          </div>
        </form>
      </div>
    `;

    document.getElementById('admin-content-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      try {
        await window.API.put('/settings', {
          heroTitle: document.getElementById('cnt-hero-title').value,
          heroSubtitle: document.getElementById('cnt-hero-sub').value,
          officerName: document.getElementById('cnt-officer-name').value,
          officerMessage: document.getElementById('cnt-officer-msg').value
        });
        window.UI.showToast('Website content updated successfully!', 'success');
      } catch (err) {
        window.UI.showToast(err.message, 'error');
      }
    });
  },

  // 25. FAQ CRUD
  async renderFAQ(container) {
    const faqs = await window.API.get('/faq');

    container.innerHTML = `
      <div class="portal-header">
        <div>
          <h1 class="portal-title">Frequently Asked Questions Manager</h1>
          <div class="portal-breadcrumb">Admin &rsaquo; FAQ</div>
        </div>
        <div class="portal-header-actions">
          <button class="btn btn-primary btn-sm" onclick="window.AdminPortal.showCreateFAQModal()">+ Add FAQ</button>
        </div>
      </div>

      <div class="card">
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Question</th>
                <th>Category</th>
                <th>Answer</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${(faqs || []).map(f => `
                <tr>
                  <td><strong>${window.UI.escapeHtml(f.question)}</strong></td>
                  <td><span class="badge badge-info">${window.UI.escapeHtml(f.category || 'General')}</span></td>
                  <td>${window.UI.escapeHtml(f.answer?.substring(0, 80) || '')}...</td>
                  <td>
                    <button class="btn btn-danger btn-sm" onclick="window.AdminPortal.deleteFAQ('${f._id}')">🗑️</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  showCreateFAQModal() {
    window.UI.openModal(`
      <h3 style="font-weight:800; margin-bottom:1rem;">Add FAQ</h3>
      <form id="admin-create-faq-form">
        <div class="form-group">
          <label>Question</label>
          <input type="text" id="cfaq-q" class="form-control" required placeholder="e.g. Can I appear for multiple Dream companies?">
        </div>
        <div class="form-group">
          <label>Category</label>
          <select id="cfaq-cat" class="form-control">
            <option value="Placement Policy">Placement Policy</option>
            <option value="Eligibility">Eligibility</option>
            <option value="Training">Training</option>
            <option value="General">General</option>
          </select>
        </div>
        <div class="form-group">
          <label>Answer</label>
          <textarea id="cfaq-a" class="form-control" rows="4" required></textarea>
        </div>
        <div style="display:flex; justify-content:flex-end; gap:0.5rem; margin-top:1.5rem;">
          <button type="button" class="btn btn-outline" onclick="window.UI.closeModal()">Cancel</button>
          <button type="submit" class="btn btn-primary">Save FAQ</button>
        </div>
      </form>
    `);

    document.getElementById('admin-create-faq-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      try {
        await window.API.post('/faq', {
          question: document.getElementById('cfaq-q').value,
          category: document.getElementById('cfaq-cat').value,
          answer: document.getElementById('cfaq-a').value
        });
        window.UI.closeModal();
        window.UI.showToast('FAQ added!', 'success');
        this.render('faq');
      } catch (err) {
        window.UI.showToast(err.message, 'error');
      }
    });
  },

  async deleteFAQ(id) {
    if (!confirm('Are you sure you want to delete this FAQ?')) return;
    try {
      await window.API.delete(`/faq/${id}`);
      window.UI.showToast('FAQ removed', 'success');
      this.render('faq');
    } catch (err) {
      window.UI.showToast(err.message, 'error');
    }
  },

  // 26. FEEDBACK
  async renderFeedback(container) {
    const feedbackList = await window.API.get('/feedback');

    container.innerHTML = `
      <div class="portal-header">
        <div>
          <h1 class="portal-title">User Feedback Submissions</h1>
          <div class="portal-breadcrumb">Admin &rsaquo; Feedback</div>
        </div>
      </div>

      <div class="card">
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Submitted By</th>
                <th>Role</th>
                <th>Rating</th>
                <th>Message</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              ${(feedbackList || []).map(fb => `
                <tr>
                  <td>
                    <strong>${window.UI.escapeHtml(fb.name || 'Anonymous')}</strong>
                    <div style="font-size:0.85rem; color:var(--text-muted);">${window.UI.escapeHtml(fb.email || '')}</div>
                  </td>
                  <td><span class="badge badge-info">${window.UI.escapeHtml(fb.role || 'Visitor')}</span></td>
                  <td>${'⭐'.repeat(fb.rating || 5)}</td>
                  <td>${window.UI.escapeHtml(fb.message || '')}</td>
                  <td>${window.UI.formatDate(fb.createdAt)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  // 27. GRIEVANCES
  async renderGrievances(container) {
    const grievances = await window.API.get('/grievances');

    container.innerHTML = `
      <div class="portal-header">
        <div>
          <h1 class="portal-title">Student Grievances & Inquiries</h1>
          <div class="portal-breadcrumb">Admin &rsaquo; Grievances</div>
        </div>
      </div>

      <div class="card">
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Subject</th>
                <th>Details</th>
                <th>Status</th>
                <th>Resolution Action</th>
              </tr>
            </thead>
            <tbody>
              ${(grievances || []).map(g => `
                <tr>
                  <td>
                    <strong>${window.UI.escapeHtml(g.studentName || 'Student')}</strong>
                    <div style="font-size:0.85rem; color:var(--text-muted);">${g.studentRollNo || ''}</div>
                  </td>
                  <td><strong>${window.UI.escapeHtml(g.subject)}</strong></td>
                  <td>${window.UI.escapeHtml(g.description || '')}</td>
                  <td>${window.UI.renderBadge(g.status || 'PENDING')}</td>
                  <td>
                    <select class="form-control" style="font-size:0.85rem; padding:0.25rem 0.5rem;" onchange="window.AdminPortal.updateGrievanceStatus('${g._id}', this.value)">
                      <option value="">Update...</option>
                      <option value="IN_REVIEW">In Review</option>
                      <option value="RESOLVED">Resolved</option>
                      <option value="DISMISSED">Dismissed</option>
                    </select>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  async updateGrievanceStatus(id, status) {
    if (!status) return;
    try {
      await window.API.patch(`/grievances/${id}/status`, { status });
      window.UI.showToast(`Grievance updated to ${status}`, 'success');
      this.render('grievances');
    } catch (err) {
      window.UI.showToast(err.message, 'error');
    }
  },

  // 28. SYSTEM SETTINGS
  async renderSettings(container) {
    const settings = await window.API.get('/settings');

    container.innerHTML = `
      <div class="portal-header">
        <div>
          <h1 class="portal-title">TPO Connect System Settings</h1>
          <div class="portal-breadcrumb">Admin &rsaquo; Settings</div>
        </div>
      </div>

      <div class="card" style="max-width:850px;">
        <form id="admin-settings-form">
          <h3 style="font-weight:700; margin-bottom:1rem;">College Branding & Metadata</h3>
          <div class="form-group">
            <label>Institution Name</label>
            <input type="text" id="as-college" class="form-control" value="${window.UI.escapeHtml(settings.collegeName || 'National Institute of Technology & Engineering')}" required>
          </div>
          <div class="form-group">
            <label>Department / Placement Cell Name</label>
            <input type="text" id="as-dept" class="form-control" value="${window.UI.escapeHtml(settings.departmentName || 'Training & Placement Office (TPO)')}" required>
          </div>

          <h3 style="font-weight:700; margin-top:2rem; margin-bottom:1rem;">Official Contact Information</h3>
          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:1rem;">
            <div class="form-group">
              <label>Placement Desk Email</label>
              <input type="email" id="as-email" class="form-control" value="${window.UI.escapeHtml(settings.contactEmail || 'placements@tpoconnect.edu')}" required>
            </div>
            <div class="form-group">
              <label>Helpline Phone</label>
              <input type="text" id="as-phone" class="form-control" value="${window.UI.escapeHtml(settings.contactPhone || '+91 11 2345 6789')}" required>
            </div>
          </div>
          <div class="form-group">
            <label>Office Campus Address</label>
            <input type="text" id="as-address" class="form-control" value="${window.UI.escapeHtml(settings.campusAddress || 'Admin Block, Technology Campus, Knowledge City')}">
          </div>

          <h3 style="font-weight:700; margin-top:2rem; margin-bottom:1rem;">Social Media Links</h3>
          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:1rem;">
            <div class="form-group">
              <label>LinkedIn Page</label>
              <input type="url" id="as-linkedin" class="form-control" value="${window.UI.escapeHtml(settings.linkedinUrl || 'https://linkedin.com/school/tpo')}">
            </div>
            <div class="form-group">
              <label>YouTube Channel</label>
              <input type="url" id="as-youtube" class="form-control" value="${window.UI.escapeHtml(settings.youtubeUrl || 'https://youtube.com')}">
            </div>
          </div>

          <div style="display:flex; justify-content:flex-end; margin-top:2rem;">
            <button type="submit" class="btn btn-primary">Save All System Settings</button>
          </div>
        </form>
      </div>
    `;

    document.getElementById('admin-settings-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      try {
        await window.API.put('/settings', {
          collegeName: document.getElementById('as-college').value,
          departmentName: document.getElementById('as-dept').value,
          contactEmail: document.getElementById('as-email').value,
          contactPhone: document.getElementById('as-phone').value,
          campusAddress: document.getElementById('as-address').value,
          linkedinUrl: document.getElementById('as-linkedin').value,
          youtubeUrl: document.getElementById('as-youtube').value
        });
        window.UI.showToast('System settings saved successfully!', 'success');
      } catch (err) {
        window.UI.showToast(err.message, 'error');
      }
    });
  }
};
