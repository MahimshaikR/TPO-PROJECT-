/**
 * TPO Connect — Placement Statistics & Reports View
 */
window.ReportsPage = {
  activeTab: 'branch',

  async render() {
    const app = document.getElementById('app');
    app.innerHTML = '<div class="spinner"></div>';

    try {
      const [branchReport, companyReport, placements, settings] = await Promise.all([
        window.API.get('/reports/branch'),
        window.API.get('/reports/company'),
        window.API.get('/reports/placements'),
        window.API.get('/settings/public')
      ]);

      this.branchReport = branchReport;
      this.companyReport = companyReport;
      this.placements = placements;
      this.settings = settings;

      app.innerHTML = `
        <div class="container section">
          <div class="section-title-wrap" style="text-align:left; margin-bottom:1.5rem;">
            <span class="section-badge">VERIFIED METRICS</span>
            <h1 class="section-title">Campus Placement Reports & Analytics</h1>
            <p class="section-subtitle">Real-time placement records, company recruitment numbers, and branch-wise breakdown.</p>
          </div>

          <!-- Report Tabs & Export Actions Bar -->
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem; flex-wrap:wrap; gap:1rem;">
            <div style="display:flex; gap:0.5rem; background:var(--bg-surface); padding:0.35rem; border-radius:var(--radius-md); border:1px solid var(--border-color);">
              <button class="btn btn-sm ${this.activeTab === 'branch' ? 'btn-primary' : 'btn-outline'}" onclick="window.ReportsPage.switchTab('branch')">Branch-Wise</button>
              <button class="btn btn-sm ${this.activeTab === 'company' ? 'btn-primary' : 'btn-outline'}" onclick="window.ReportsPage.switchTab('company')">Company-Wise</button>
              <button class="btn btn-sm ${this.activeTab === 'records' ? 'btn-primary' : 'btn-outline'}" onclick="window.ReportsPage.switchTab('records')">Placement Records</button>
            </div>

            <div style="display:flex; gap:0.5rem;">
              <a href="/api/reports/export/csv" class="btn btn-outline btn-sm" target="_blank">📥 Export CSV</a>
              <a href="/api/reports/export/excel" class="btn btn-outline btn-sm" target="_blank">📊 Export Excel</a>
              <button class="btn btn-secondary btn-sm" onclick="window.print()">🖨️ Print Report</button>
            </div>
          </div>

          <!-- Tab Content Container -->
          <div id="report-tab-content">
            ${this.renderActiveTab()}
          </div>
        </div>
      `;
    } catch (err) {
      console.error(err);
      app.innerHTML = `<div class="container section">Error: ${err.message}</div>`;
    }
  },

  switchTab(tab) {
    this.activeTab = tab;
    this.render();
  },

  renderActiveTab() {
    if (this.activeTab === 'branch') {
      return `
        <div class="card">
          <h3 style="font-size:1.25rem; font-weight:800; margin-bottom:1rem;">Branch-Wise Placement Performance (2026-27)</h3>
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Branch</th>
                  <th>Registered Students</th>
                  <th>Placed Students</th>
                  <th>Total Offers</th>
                  <th>Placement Rate</th>
                  <th>Highest Package</th>
                  <th>Average Package</th>
                </tr>
              </thead>
              <tbody>
                ${(this.branchReport || []).map(b => `
                  <tr>
                    <td><strong>${b.branch}</strong></td>
                    <td>${b.totalStudents}</td>
                    <td><strong style="color:var(--success);">${b.placedStudents}</strong></td>
                    <td>${b.totalOffers}</td>
                    <td>
                      <div style="display:flex; align-items:center; gap:0.5rem;">
                        <div style="flex:1; height:6px; background:var(--bg-subtle); border-radius:3px; overflow:hidden;">
                          <div style="width:${b.placementPercentage}%; height:100%; background:var(--accent);"></div>
                        </div>
                        <span style="font-weight:700; font-size:0.85rem;">${b.placementPercentage}%</span>
                      </div>
                    </td>
                    <td style="font-weight:700; color:var(--success);">₹${b.highestPackage} LPA</td>
                    <td style="font-weight:700;">₹${b.averagePackage} LPA</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;
    }

    if (this.activeTab === 'company') {
      return `
        <div class="card">
          <h3 style="font-size:1.25rem; font-weight:800; margin-bottom:1rem;">Company-Wise Recruitment Summary</h3>
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Company Name</th>
                  <th>Industry Sector</th>
                  <th>Recruitment Tier</th>
                  <th>Total Hires</th>
                  <th>Highest Package</th>
                  <th>Average Package</th>
                </tr>
              </thead>
              <tbody>
                ${(this.companyReport || []).map(c => `
                  <tr>
                    <td><strong><a href="/companies/${c.companyId}" data-link>${window.UI.escapeHtml(c.companyName)}</a></strong></td>
                    <td>${window.UI.escapeHtml(c.industry || 'Technology')}</td>
                    <td>${window.UI.badge(c.tier)}</td>
                    <td><strong style="color:var(--primary); font-size:1rem;">${c.offersCount}</strong></td>
                    <td style="font-weight:700; color:var(--success);">₹${c.highestPackage} LPA</td>
                    <td style="font-weight:700;">₹${c.averagePackage} LPA</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;
    }

    // Placement Records Table
    return `
      <div class="card">
        <h3 style="font-size:1.25rem; font-weight:800; margin-bottom:1rem;">Individual Placement Records (Official Register)</h3>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Roll Number</th>
                <th>Student Name</th>
                <th>Branch</th>
                <th>Company</th>
                <th>Role</th>
                <th>Package</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              ${(this.placements || []).map(p => `
                <tr>
                  <td><strong>${p.rollNumber}</strong></td>
                  <td>${window.UI.escapeHtml(p.studentName)}</td>
                  <td>${p.branch}</td>
                  <td><strong style="color:var(--primary);">${window.UI.escapeHtml(p.company)}</strong></td>
                  <td>${window.UI.escapeHtml(p.designation)}</td>
                  <td style="font-weight:800; color:var(--success);">₹${p.packageLpa} LPA</td>
                  <td>${window.UI.badge(p.status)}</td>
                  <td>${window.UI.formatDate(p.selectionDate)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }
};
