/**
 * TPO Connect — Placement Drives Catalog
 */
window.PlacementsPage = {
  async render() {
    const app = document.getElementById('app');
    app.innerHTML = '<div class="spinner"></div>';

    try {
      const drives = await window.API.get('/drives');
      const settings = window.State?.getSettings() || await window.API.get('/settings/public');
      const branches = settings.branches || ['CSE', 'IT', 'ECE', 'EEE', 'AIML', 'Mechanical', 'Civil'];

      app.innerHTML = `
        <div class="container section">
          <div class="section-title-wrap" style="text-align: left; margin-bottom: 2rem;">
            <span class="section-badge">CAMPUS OPPORTUNITIES</span>
            <h1 class="section-title">Campus Placement Drives</h1>
            <p class="section-subtitle">Browse all active and upcoming corporate recruitment drives.</p>
          </div>

          <!-- Dynamic Filter Bar -->
          <div class="filter-bar">
            <div class="filter-group" style="flex: 2 1 250px;">
              <span class="filter-label">Search:</span>
              <input type="text" id="drive-search" class="form-input" placeholder="Search company, job role, or skills..." oninput="window.PlacementsPage.applyFilter()">
            </div>
            <div class="filter-group">
              <span class="filter-label">Branch:</span>
              <select id="drive-branch-filter" class="form-select" onchange="window.PlacementsPage.applyFilter()">
                <option value="ALL">All Branches</option>
                ${branches.map(b => `<option value="${b}">${b}</option>`).join('')}
              </select>
            </div>
            <div class="filter-group">
              <span class="filter-label">Min Package:</span>
              <select id="drive-package-filter" class="form-select" onchange="window.PlacementsPage.applyFilter()">
                <option value="ALL">Any Package</option>
                <option value="6">6+ LPA</option>
                <option value="10">10+ LPA</option>
                <option value="15">15+ LPA (Dream)</option>
                <option value="25">25+ LPA (Super Dream)</option>
              </select>
            </div>
          </div>

          <!-- Drives List Container -->
          <div class="grid grid-cols-3" id="drives-grid">
            ${this.renderDriveCards(drives)}
          </div>
        </div>
      `;
      this.allDrives = drives;
    } catch (err) {
      console.error(err);
      app.innerHTML = `<div class="container section"><h3>Error loading drives: ${err.message}</h3></div>`;
    }
  },

  renderDriveCards(drives) {
    if (!drives || drives.length === 0) {
      return '<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 3rem 0;">No recruitment drives matching selected filter criteria.</p>';
    }

    return drives.map(drive => `
      <div class="card card-clickable" onclick="window.Router.navigate('/placements/drives/${drive._id}')">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1rem;">
          <div>
            ${window.UI.badge(drive.status)}
            <h3 style="font-size:1.15rem; font-weight:700; margin-top:0.4rem; color:var(--text-main);">${window.UI.escapeHtml(drive.title)}</h3>
            <p style="font-size:0.85rem; color:var(--primary); font-weight:600;">${window.UI.escapeHtml(drive.companyName)}</p>
          </div>
        </div>
        <div style="font-size:0.9rem; line-height:1.6; color:var(--text-muted); margin-bottom:1.25rem;">
          <p>💼 <strong>Role:</strong> ${window.UI.escapeHtml(drive.jobRole)}</p>
          <p>💰 <strong>Package:</strong> ₹${drive.packageLpa} LPA</p>
          <p>📍 <strong>Location:</strong> ${window.UI.escapeHtml(drive.location || 'Pan India')}</p>
          <p>🎓 <strong>Min CGPA:</strong> ${drive.eligibility?.minCgpa || 6.5}</p>
          <p>📅 <strong>Drive Date:</strong> ${window.UI.formatDate(drive.driveDate)}</p>
          <p>⏳ <strong>Deadline:</strong> ${window.UI.formatDate(drive.deadline)}</p>
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border-color); padding-top:0.85rem;">
          <span style="font-size:0.8rem; font-weight:600; color:var(--text-muted);">
            Branches: ${drive.eligibility?.branches?.slice(0, 3).join(', ') || 'All'}
          </span>
          <a href="/placements/drives/${drive._id}" class="btn btn-primary btn-sm" data-link>View & Apply</a>
        </div>
      </div>
    `).join('');
  },

  applyFilter() {
    const q = (document.getElementById('drive-search')?.value || '').toLowerCase().trim();
    const branch = document.getElementById('drive-branch-filter')?.value || 'ALL';
    const pkg = document.getElementById('drive-package-filter')?.value || 'ALL';

    let filtered = this.allDrives || [];

    if (q) {
      filtered = filtered.filter(d =>
        d.title.toLowerCase().includes(q) ||
        d.companyName.toLowerCase().includes(q) ||
        d.jobRole.toLowerCase().includes(q)
      );
    }

    if (branch !== 'ALL') {
      filtered = filtered.filter(d =>
        !d.eligibility?.branches?.length ||
        d.eligibility.branches.includes('All') ||
        d.eligibility.branches.includes(branch)
      );
    }

    if (pkg !== 'ALL') {
      filtered = filtered.filter(d => (d.packageLpa || 0) >= Number(pkg));
    }

    const grid = document.getElementById('drives-grid');
    if (grid) {
      grid.innerHTML = this.renderDriveCards(filtered);
    }
  }
};
