/**
 * TPO Connect — Coordinator Portal Controller
 * Full departmental oversight: Students, Drives, Applications, Attendance, Training, Interviews, Selections, Reports
 */
window.CoordinatorPortal = {
  async render(activeSection = 'dashboard', params = {}) {
    const app = document.getElementById('app');
    app.innerHTML = '<div class="spinner"></div>';

    try {
      const user = window.State.get('user') || {};

      const sidebarLinks = [
        { id: 'dashboard', label: 'Dashboard', icon: '📊', path: '/coordinator/dashboard' },
        { id: 'students', label: 'Students', icon: '🎓', path: '/coordinator/students' },
        { id: 'drives', label: 'Placement Drives', icon: '🎯', path: '/coordinator/drives' },
        { id: 'applications', label: 'Applications', icon: '📝', path: '/coordinator/applications' },
        { id: 'attendance', label: 'Attendance', icon: '📋', path: '/coordinator/attendance' },
        { id: 'training', label: 'Training', icon: '💡', path: '/coordinator/training' },
        { id: 'interviews', label: 'Interviews', icon: '🗓️', path: '/coordinator/interviews' },
        { id: 'selections', label: 'Selections', icon: '🎉', path: '/coordinator/selections' },
        { id: 'evidence', label: 'Accreditation Evidence', icon: '🏛️', path: '/admin/evidence' },
        { id: 'reports', label: 'Reports', icon: '📈', path: '/coordinator/reports' },
        { id: 'notifications', label: 'Notifications', icon: '🔔', path: '/coordinator/notifications' }
      ];

      app.innerHTML = `
        <div class="portal-wrapper">
          <aside class="portal-sidebar">
            <div class="portal-sidebar-header">
              <span class="portal-role-badge" style="background:#e0e7ff; color:#4338ca;">COORDINATOR PORTAL</span>
              <div class="portal-user-name">${window.UI.escapeHtml(user.name || 'Coordinator')}</div>
              <div class="portal-user-email">${window.UI.escapeHtml(user.email || 'coordinator@tpoconnect.edu')}</div>
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
      app.innerHTML = `<div class="container section"><h3>Error loading coordinator portal: ${err.message}</h3></div>`;
    }
  },

  async renderSectionContent(section, container, user, params) {
    switch (section) {
      case 'dashboard':
        await this.renderDashboard(container);
        break;
      case 'students':
        if (params.id) {
          await this.renderStudentDetail(container, params.id);
        } else {
          await this.renderStudentsList(container);
        }
        break;
      case 'drives':
        await this.renderDrives(container);
        break;
      case 'applications':
        await this.renderApplications(container);
        break;
      case 'attendance':
        await this.renderAttendance(container);
        break;
      case 'training':
        await this.renderTraining(container);
        break;
      case 'interviews':
        await this.renderInterviews(container);
        break;
      case 'selections':
        await this.renderSelections(container);
        break;
      case 'reports':
        await this.renderReports(container);
        break;
      case 'notifications':
        await this.renderNotifications(container);
        break;
      default:
        await this.renderDashboard(container);
        break;
    }
  },

  async renderDashboard(container) {
    const dash = await window.API.get('/dashboard/coordinator');
    const recentDrives = await window.API.get('/drives?limit=5');
    const recentApps = await window.API.get('/applications?limit=5');

    container.innerHTML = `
      <div class="portal-header">
        <div>
          <h1 class="portal-title">Department Coordinator Dashboard</h1>
          <div class="portal-breadcrumb">Coordinator Portal &rsaquo; Department Overview</div>
        </div>
        <div class="portal-header-actions">
          <a href="/coordinator/students" class="btn btn-primary btn-sm" data-link>🎓 Manage Students</a>
        </div>
      </div>

      <div class="portal-stats-grid">
        <div class="portal-stat-card stat-blue">
          <div class="stat-info">
            <span class="stat-info-label">Total Students</span>
            <span class="stat-info-value">${dash.totalStudents || 0}</span>
          </div>
          <div class="portal-stat-icon">🎓</div>
        </div>
        <div class="portal-stat-card stat-green">
          <div class="stat-info">
            <span class="stat-info-label">Students Placed</span>
            <span class="stat-info-value">${dash.placedStudents || 0}</span>
          </div>
          <div class="portal-stat-icon">🎉</div>
        </div>
        <div class="portal-stat-card stat-purple">
          <div class="stat-info">
            <span class="stat-info-label">Placement Rate</span>
            <span class="stat-info-value">${dash.placementPercentage || 0}%</span>
          </div>
          <div class="portal-stat-icon">📊</div>
        </div>
        <div class="portal-stat-card stat-amber">
          <div class="stat-info">
            <span class="stat-info-label">Active Drives</span>
            <span class="stat-info-value">${dash.totalDrives || 0}</span>
          </div>
          <div class="portal-stat-icon">🎯</div>
        </div>
      </div>

      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap:1.5rem; margin-top:2rem;">
        <div class="card">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
            <h3 style="font-size:1.15rem; font-weight:700;">Ongoing Placement Drives</h3>
            <a href="/coordinator/drives" class="btn btn-outline btn-sm" data-link>View All</a>
          </div>
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Drive</th>
                  <th>Company</th>
                  <th>Package</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${(recentDrives || []).map(d => `
                  <tr>
                    <td><strong>${window.UI.escapeHtml(d.title)}</strong></td>
                    <td>${window.UI.escapeHtml(d.companyName || '-')}</td>
                    <td style="color:var(--success); font-weight:700;">${d.packageLpa ? d.packageLpa + ' LPA' : 'TBD'}</td>
                    <td>${window.UI.renderBadge(d.status)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <div class="card">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
            <h3 style="font-size:1.15rem; font-weight:700;">Recent Applications</h3>
            <a href="/coordinator/applications" class="btn btn-outline btn-sm" data-link>View All</a>
          </div>
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Drive</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${(recentApps || []).map(a => `
                  <tr>
                    <td>
                      <div style="font-weight:700;">${window.UI.escapeHtml(a.studentName || 'Student')}</div>
                      <small style="color:var(--text-muted);">${a.studentRollNo || ''}</small>
                    </td>
                    <td>${window.UI.escapeHtml(a.driveTitle || '-')}</td>
                    <td>${window.UI.renderBadge(a.status)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  },

  async renderStudentsList(container) {
    const students = await window.API.get('/students');

    container.innerHTML = `
      <div class="portal-header">
        <div>
          <h1 class="portal-title">Department Students</h1>
          <div class="portal-breadcrumb">Coordinator Portal &rsaquo; Students</div>
        </div>
      </div>

      <div class="card" style="margin-bottom:1.5rem;">
        <div style="display:flex; gap:1rem; flex-wrap:wrap;">
          <input type="text" id="student-search-input" class="form-control" placeholder="Search by name, roll no, branch..." style="flex:1; min-width:250px;">
          <select id="student-branch-filter" class="form-control" style="width:180px;">
            <option value="">All Branches</option>
            <option value="Computer Science & Engineering">CSE</option>
            <option value="Information Technology">IT</option>
            <option value="Electronics & Communication">ECE</option>
            <option value="Electrical & Electronics">EEE</option>
            <option value="Mechanical Engineering">MECH</option>
          </select>
          <select id="student-status-filter" class="form-control" style="width:180px;">
            <option value="">All Status</option>
            <option value="PLACED">Placed</option>
            <option value="UNPLACED">Unplaced</option>
          </select>
        </div>
      </div>

      <div class="card">
        <div class="table-responsive">
          <table class="data-table" id="students-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Roll No</th>
                <th>Branch</th>
                <th>CGPA</th>
                <th>Backlogs</th>
                <th>Status</th>
                <th>Verification</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${(students || []).map(s => `
                <tr data-name="${s.fullName?.toLowerCase() || ''}" data-roll="${s.rollNo?.toLowerCase() || ''}" data-branch="${s.branch || ''}" data-status="${s.placementStatus || ''}">
                  <td>
                    <div style="font-weight:700;">${window.UI.escapeHtml(s.fullName)}</div>
                    <small style="color:var(--text-muted);">${window.UI.escapeHtml(s.email)}</small>
                  </td>
                  <td><code>${window.UI.escapeHtml(s.rollNo)}</code></td>
                  <td>${window.UI.escapeHtml(s.branch)}</td>
                  <td><strong>${s.cgpa || 0}</strong></td>
                  <td>${s.backlogs ?? 0}</td>
                  <td>${window.UI.renderBadge(s.placementStatus || 'UNPLACED')}</td>
                  <td>
                    ${s.isVerified
                      ? '<span class="badge badge-success">✓ Verified</span>'
                      : `<button class="btn btn-primary btn-sm" onclick="window.CoordinatorPortal.verifyStudent('${s._id}')">Verify</button>`}
                  </td>
                  <td>
                    <a href="/coordinator/students/${s._id}" class="btn btn-outline btn-sm" data-link>View</a>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    // Dynamic Client Filter
    const searchInput = document.getElementById('student-search-input');
    const branchFilter = document.getElementById('student-branch-filter');
    const statusFilter = document.getElementById('student-status-filter');

    const filterTable = () => {
      const q = searchInput.value.toLowerCase();
      const b = branchFilter.value;
      const st = statusFilter.value;

      document.querySelectorAll('#students-table tbody tr').forEach(tr => {
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

    searchInput.addEventListener('input', filterTable);
    branchFilter.addEventListener('change', filterTable);
    statusFilter.addEventListener('change', filterTable);
  },

  async verifyStudent(studentId) {
    try {
      await window.API.put(`/students/${studentId}`, { isVerified: true });
      window.UI.showToast('Student verified successfully!', 'success');
      this.render('students');
    } catch (err) {
      window.UI.showToast(err.message, 'error');
    }
  },

  async renderStudentDetail(container, studentId) {
    const student = await window.API.get(`/students/${studentId}`);
    container.innerHTML = `
      <div class="portal-header">
        <div>
          <h1 class="portal-title">${window.UI.escapeHtml(student.fullName)}</h1>
          <div class="portal-breadcrumb">
            <a href="/coordinator/students" data-link>Students</a> &rsaquo; ${window.UI.escapeHtml(student.rollNo)}
          </div>
        </div>
        <div class="portal-header-actions">
          <a href="/coordinator/students" class="btn btn-outline btn-sm" data-link>&larr; Back to List</a>
        </div>
      </div>

      <div style="display:grid; grid-template-columns: 1fr 2fr; gap:1.5rem;">
        <div class="card">
          <h3 style="font-size:1.15rem; font-weight:700; margin-bottom:1rem;">Profile Overview</h3>
          <p><strong>Roll Number:</strong> ${student.rollNo}</p>
          <p><strong>Branch:</strong> ${student.branch}</p>
          <p><strong>CGPA:</strong> ${student.cgpa}</p>
          <p><strong>Backlogs:</strong> ${student.backlogs}</p>
          <p><strong>Batch:</strong> ${student.batchYear || '-'}</p>
          <p><strong>Placement Status:</strong> ${window.UI.renderBadge(student.placementStatus || 'UNPLACED')}</p>
          ${student.placedCompany ? `<p><strong>Placed At:</strong> ${student.placedCompany} (${student.placedPackage} LPA)</p>` : ''}
          <p><strong>Verification:</strong> ${student.isVerified ? '<span class="badge badge-success">Verified</span>' : '<span class="badge badge-warning">Unverified</span>'}</p>
        </div>

        <div class="card">
          <h3 style="font-size:1.15rem; font-weight:700; margin-bottom:1rem;">Skills & Highlights</h3>
          <div style="display:flex; gap:0.5rem; flex-wrap:wrap; margin-bottom:1.5rem;">
            ${(student.skills || []).map(s => `<span class="badge badge-info">${window.UI.escapeHtml(s)}</span>`).join('') || '<span style="color:var(--text-muted);">No skills listed</span>'}
          </div>

          <h3 style="font-size:1.15rem; font-weight:700; margin-bottom:0.75rem;">Projects</h3>
          ${(student.projects || []).map(p => `
            <div style="border-left:3px solid var(--primary); padding-left:1rem; margin-bottom:1rem;">
              <strong>${window.UI.escapeHtml(p.title)}</strong>
              <p style="color:var(--text-muted); font-size:0.9rem;">${window.UI.escapeHtml(p.description || '')}</p>
            </div>
          `).join('') || '<p style="color:var(--text-muted);">No projects recorded</p>'}
        </div>
      </div>
    `;
  },

  async renderDrives(container) {
    const drives = await window.API.get('/drives');
    container.innerHTML = `
      <div class="portal-header">
        <div>
          <h1 class="portal-title">Placement Drives Directory</h1>
          <div class="portal-breadcrumb">Coordinator Portal &rsaquo; Placement Drives</div>
        </div>
      </div>

      <div class="card">
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Drive</th>
                <th>Company</th>
                <th>Date</th>
                <th>Min CGPA</th>
                <th>Eligible Branches</th>
                <th>Package</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${(drives || []).map(d => `
                <tr>
                  <td><strong>${window.UI.escapeHtml(d.title)}</strong></td>
                  <td>${window.UI.escapeHtml(d.companyName || '-')}</td>
                  <td>${window.UI.formatDate(d.driveDate)}</td>
                  <td>${d.eligibility?.minCgpa || '0'}</td>
                  <td>${(d.eligibility?.branches || ['All']).join(', ')}</td>
                  <td style="color:var(--success); font-weight:700;">${d.packageLpa ? d.packageLpa + ' LPA' : 'TBD'}</td>
                  <td>${window.UI.renderBadge(d.status)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  async renderApplications(container) {
    const apps = await window.API.get('/applications');
    container.innerHTML = `
      <div class="portal-header">
        <div>
          <h1 class="portal-title">Department Student Applications</h1>
          <div class="portal-breadcrumb">Coordinator Portal &rsaquo; Applications</div>
        </div>
      </div>

      <div class="card">
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Drive / Company</th>
                <th>Date Applied</th>
                <th>Round</th>
                <th>Status</th>
                <th>Update Status</th>
              </tr>
            </thead>
            <tbody>
              ${(apps || []).map(a => `
                <tr>
                  <td>
                    <div style="font-weight:700;">${window.UI.escapeHtml(a.studentName || 'Student')}</div>
                    <small style="color:var(--text-muted);">${a.studentRollNo || ''} (${a.studentBranch || ''})</small>
                  </td>
                  <td>
                    <div style="font-weight:600;">${window.UI.escapeHtml(a.driveTitle || '-')}</div>
                    <small style="color:var(--text-muted);">${window.UI.escapeHtml(a.companyName || '')}</small>
                  </td>
                  <td>${window.UI.formatDate(a.appliedAt)}</td>
                  <td><span class="badge badge-info">${window.UI.escapeHtml(a.currentRound || 'Aptitude')}</span></td>
                  <td>${window.UI.renderBadge(a.status)}</td>
                  <td>
                    <select class="form-control" style="font-size:0.85rem; padding:0.25rem 0.5rem;" onchange="window.CoordinatorPortal.updateAppStatus('${a._id}', this.value)">
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

  async updateAppStatus(appId, newStatus) {
    if (!newStatus) return;
    try {
      await window.API.patch(`/applications/${appId}/status`, { status: newStatus });
      window.UI.showToast(`Application updated to ${newStatus}`, 'success');
      this.render('applications');
    } catch (err) {
      window.UI.showToast(err.message, 'error');
    }
  },

  async renderAttendance(container) {
    const drives = await window.API.get('/drives');
    container.innerHTML = `
      <div class="portal-header">
        <div>
          <h1 class="portal-title">Attendance Tracking</h1>
          <div class="portal-breadcrumb">Coordinator Portal &rsaquo; Attendance</div>
        </div>
      </div>

      <div class="card" style="margin-bottom:1.5rem;">
        <h3 style="font-size:1.15rem; font-weight:700; margin-bottom:1rem;">Mark Drive Attendance</h3>
        <div style="display:flex; gap:1rem; flex-wrap:wrap;">
          <select id="attendance-drive-select" class="form-control" style="flex:1; min-width:250px;">
            <option value="">Select Placement Drive...</option>
            ${(drives || []).map(d => `<option value="${d._id}">${d.title} (${d.companyName})</option>`).join('')}
          </select>
          <button class="btn btn-primary" onclick="window.CoordinatorPortal.loadDriveAttendanceList()">Load Applicants</button>
        </div>
      </div>

      <div id="drive-attendance-container"></div>
    `;
  },

  async loadDriveAttendanceList() {
    const driveId = document.getElementById('attendance-drive-select').value;
    if (!driveId) {
      window.UI.showToast('Please select a drive first.', 'warning');
      return;
    }
    const cont = document.getElementById('drive-attendance-container');
    cont.innerHTML = '<div class="spinner"></div>';

    try {
      const apps = await window.API.get(`/applications?driveId=${driveId}`);
      if (apps.length === 0) {
        cont.innerHTML = '<div class="card"><p style="color:var(--text-muted);">No applicants found for this drive.</p></div>';
        return;
      }

      cont.innerHTML = `
        <div class="card">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
            <h3 style="font-size:1.15rem; font-weight:700;">Drive Applicants Attendance (${apps.length})</h3>
            <button class="btn btn-success btn-sm" onclick="window.CoordinatorPortal.submitBulkAttendance('${driveId}')">💾 Save Attendance</button>
          </div>
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Roll No</th>
                  <th>Branch</th>
                  <th>Mark Present</th>
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
                        <input type="checkbox" class="attendance-check" data-student-id="${a.studentId}" checked>
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
      cont.innerHTML = `<div class="card" style="color:var(--danger);">${err.message}</div>`;
    }
  },

  async submitBulkAttendance(driveId) {
    const checkboxes = document.querySelectorAll('.attendance-check');
    const records = Array.from(checkboxes).map(cb => ({
      studentId: cb.getAttribute('data-student-id'),
      isPresent: cb.checked
    }));

    try {
      await window.API.post('/attendance/bulk', { driveId, records });
      window.UI.showToast('Attendance recorded successfully!', 'success');
    } catch (err) {
      window.UI.showToast(err.message, 'error');
    }
  },

  async renderTraining(container) {
    const trainings = await window.API.get('/training');
    container.innerHTML = `
      <div class="portal-header">
        <div>
          <h1 class="portal-title">Department Training Programs</h1>
          <div class="portal-breadcrumb">Coordinator Portal &rsaquo; Training</div>
        </div>
      </div>

      <div class="card">
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Training Program</th>
                <th>Instructor</th>
                <th>Duration</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${(trainings || []).map(t => `
                <tr>
                  <td>
                    <strong>${window.UI.escapeHtml(t.title)}</strong>
                    <div style="font-size:0.85rem; color:var(--text-muted);">${window.UI.escapeHtml(t.description?.substring(0, 80) || '')}...</div>
                  </td>
                  <td>${window.UI.escapeHtml(t.instructor || 'T&P Faculty')}</td>
                  <td>${t.startDate ? window.UI.formatDate(t.startDate) : ''} - ${t.endDate ? window.UI.formatDate(t.endDate) : ''}</td>
                  <td>${window.UI.renderBadge(t.status || 'ACTIVE')}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  async renderInterviews(container) {
    const interviews = await window.API.get('/interviews');
    container.innerHTML = `
      <div class="portal-header">
        <div>
          <h1 class="portal-title">Interviews & Mock Sessions</h1>
          <div class="portal-breadcrumb">Coordinator Portal &rsaquo; Interviews</div>
        </div>
      </div>

      <div class="card">
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Student</th>
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
                  <td><span class="badge badge-info">${window.UI.escapeHtml(i.round || 'Technical')}</span></td>
                  <td>${window.UI.formatDate(i.scheduledDate)} ${i.timeSlot || ''}</td>
                  <td>${window.UI.escapeHtml(i.venue || i.meetingLink || 'T&P Block')}</td>
                  <td>${window.UI.renderBadge(i.status)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  async renderSelections(container) {
    const selections = await window.API.get('/selections');
    container.innerHTML = `
      <div class="portal-header">
        <div>
          <h1 class="portal-title">Placement Selections & Offers</h1>
          <div class="portal-breadcrumb">Coordinator Portal &rsaquo; Selections</div>
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
                  <td style="color:var(--success); font-weight:700;">${s.packageLpa ? s.packageLpa + ' LPA' : '-'}</td>
                  <td>${window.UI.escapeHtml(s.role || 'Software Engineer')}</td>
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

  async renderReports(container) {
    container.innerHTML = `
      <div class="portal-header">
        <div>
          <h1 class="portal-title">Department Reports & Analytics</h1>
          <div class="portal-breadcrumb">Coordinator Portal &rsaquo; Reports</div>
        </div>
      </div>

      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap:1.5rem;">
        <div class="card">
          <h3 style="font-weight:700; margin-bottom:0.75rem;">📥 Placed Students Report</h3>
          <p style="color:var(--text-muted); font-size:0.9rem; margin-bottom:1rem;">Download full list of placed students with packages and company details.</p>
          <a href="/api/reports/export/placed?format=csv" target="_blank" class="btn btn-primary btn-sm">Export CSV</a>
        </div>
        <div class="card">
          <h3 style="font-weight:700; margin-bottom:0.75rem;">📥 Drives Summary Report</h3>
          <p style="color:var(--text-muted); font-size:0.9rem; margin-bottom:1rem;">Complete history of placement drives, dates, packages, and participant counts.</p>
          <a href="/api/reports/export/drives?format=csv" target="_blank" class="btn btn-primary btn-sm">Export CSV</a>
        </div>
        <div class="card">
          <h3 style="font-weight:700; margin-bottom:0.75rem;">📥 Training Attendance Report</h3>
          <p style="color:var(--text-muted); font-size:0.9rem; margin-bottom:1rem;">Department student participation across all completed training programs.</p>
          <a href="/api/reports/export/attendance?format=csv" target="_blank" class="btn btn-primary btn-sm">Export CSV</a>
        </div>
      </div>
    `;
  },

  async renderNotifications(container) {
    const notifs = await window.API.get('/notifications');
    container.innerHTML = `
      <div class="portal-header">
        <div>
          <h1 class="portal-title">Broadcast Notifications</h1>
          <div class="portal-breadcrumb">Coordinator Portal &rsaquo; Notifications</div>
        </div>
        <div class="portal-header-actions">
          <button class="btn btn-primary btn-sm" onclick="window.CoordinatorPortal.showNewNotificationModal()">+ Send Notification</button>
        </div>
      </div>

      <div class="card">
        ${(notifs || []).length === 0 ? '<p style="color:var(--text-muted);">No notifications sent yet.</p>' : `
          <div style="display:flex; flex-direction:column; gap:1rem;">
            ${notifs.map(n => `
              <div style="border-left:4px solid var(--primary); padding:1rem; background:var(--bg-light); border-radius:0 8px 8px 0;">
                <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                  <strong style="font-size:1.05rem;">${window.UI.escapeHtml(n.title)}</strong>
                  <small style="color:var(--text-muted);">${window.UI.formatDate(n.createdAt)}</small>
                </div>
                <p style="color:var(--text-secondary); margin-top:0.5rem; font-size:0.95rem;">${window.UI.escapeHtml(n.message)}</p>
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

  showNewNotificationModal() {
    window.UI.openModal(`
      <h3 style="font-weight:800; margin-bottom:1rem;">Broadcast Department Notification</h3>
      <form id="coord-notif-form">
        <div class="form-group">
          <label>Notification Title</label>
          <input type="text" id="cn-title" class="form-control" required placeholder="e.g. Mandatory Aptitude Mock Tomorrow">
        </div>
        <div class="form-group">
          <label>Message Content</label>
          <textarea id="cn-message" class="form-control" rows="4" required placeholder="Details about venue, timing, instructions..."></textarea>
        </div>
        <div class="form-group">
          <label>Target Audience</label>
          <select id="cn-target" class="form-control">
            <option value="STUDENT">Department Students</option>
            <option value="ALL">All Users</option>
          </select>
        </div>
        <div style="display:flex; justify-content:flex-end; gap:0.5rem; margin-top:1.5rem;">
          <button type="button" class="btn btn-outline" onclick="window.UI.closeModal()">Cancel</button>
          <button type="submit" class="btn btn-primary">Send Broadcast</button>
        </div>
      </form>
    `);

    document.getElementById('coord-notif-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      try {
        await window.API.post('/notifications', {
          title: document.getElementById('cn-title').value,
          message: document.getElementById('cn-message').value,
          targetRole: document.getElementById('cn-target').value
        });
        window.UI.closeModal();
        window.UI.showToast('Notification sent successfully!', 'success');
        this.render('notifications');
      } catch (err) {
        window.UI.showToast(err.message, 'error');
      }
    });
  }
};
