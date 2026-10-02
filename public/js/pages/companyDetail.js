/**
 * TPO Connect — Company Details & Recruitment History View
 */
window.CompanyDetailPage = {
  async render(params) {
    const app = document.getElementById('app');
    app.innerHTML = '<div class="spinner"></div>';

    try {
      const companyId = (typeof params === 'object' && params !== null) ? (params.id || params._id) : params;
      const company = await window.API.get(`/companies/${companyId}`);
      const drives = company.drives || [];

      app.innerHTML = `
        <div class="container section">
          <div style="margin-bottom: 1.5rem;">
            <a href="/companies" class="btn btn-outline btn-sm" data-link>&larr; Back to Companies</a>
          </div>

          <div class="card" style="margin-bottom: 2rem;">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1.5rem; flex-wrap:wrap; gap:1rem;">
              <div style="display:flex; gap:1.5rem; align-items:center;">
                <div style="width:72px; height:72px; background:var(--bg-subtle); border-radius:var(--radius-md); display:flex; align-items:center; justify-content:center; border:1px solid var(--border-color);">
                  ${company.logo ? `<img src="${company.logo}" style="max-height:50px; max-width:60px; object-fit:contain;">` : `<span style="font-weight:800; font-size:1.75rem; color:var(--primary);">${company.name.substring(0, 3)}</span>`}
                </div>
                <div>
                  <h1 style="font-size:2.2rem; font-weight:800; color:var(--text-main); line-height:1.2;">${window.UI.escapeHtml(company.name)}</h1>
                  <p style="font-size:1rem; color:var(--text-muted);">${window.UI.escapeHtml(company.industry || 'Technology & Services')} • ${window.UI.escapeHtml(company.headOffice || 'India')}</p>
                </div>
              </div>
              <span class="badge badge-primary" style="font-size:0.9rem; padding:0.4rem 1rem;">${company.tier}</span>
            </div>

            <div class="grid grid-cols-4" style="background:var(--bg-subtle); padding:1.25rem; border-radius:var(--radius-md); margin-bottom:1.5rem;">
              <div>
                <span style="font-size:0.8rem; color:var(--text-muted); font-weight:600;">TOTAL OFFERS</span>
                <div style="font-weight:800; font-size:1.35rem; color:var(--text-main);">${company.totalOffersCount || 0}</div>
              </div>
              <div>
                <span style="font-size:0.8rem; color:var(--text-muted); font-weight:600;">HIGHEST PACKAGE</span>
                <div style="font-weight:800; font-size:1.35rem; color:var(--success);">₹${company.highestPackageOffered || 0} LPA</div>
              </div>
              <div>
                <span style="font-size:0.8rem; color:var(--text-muted); font-weight:600;">AVERAGE PACKAGE</span>
                <div style="font-weight:800; font-size:1.35rem; color:var(--accent);">₹${company.averagePackageOffered || 0} LPA</div>
              </div>
              <div>
                <span style="font-size:0.8rem; color:var(--text-muted); font-weight:600;">STATUS</span>
                <div style="font-weight:700; font-size:1.1rem;">${window.UI.badge(company.status)}</div>
              </div>
            </div>

            <div style="margin-bottom:1.5rem;">
              <h3 style="font-size:1.15rem; font-weight:700; margin-bottom:0.5rem;">About the Organization</h3>
              <p style="color:var(--text-muted); line-height:1.7; font-size:0.95rem;">${window.UI.escapeHtml(company.description || 'Global corporate recruitment partner.')}</p>
            </div>

            <div style="display:flex; gap:1.5rem; font-size:0.9rem; color:var(--text-muted); flex-wrap:wrap;">
              ${company.website ? `<div>🌐 <a href="${company.website}" target="_blank" rel="noopener">Official Website</a></div>` : ''}
              ${company.contactEmail ? `<div>✉️ <strong>HR Contact:</strong> ${window.UI.escapeHtml(company.contactEmail)}</div>` : ''}
            </div>
          </div>

          <!-- Placement Drives from this Company -->
          <div class="card">
            <h2 style="font-size:1.35rem; font-weight:800; margin-bottom:1.25rem;">Scheduled Recruitment Drives</h2>
            ${drives.length === 0 ? '<p style="color:var(--text-muted);">No drives currently scheduled for this company.</p>' : `
              <div class="table-responsive">
                <table class="data-table">
                  <thead>
                    <tr>
                      <th>Drive Title</th>
                      <th>Job Role</th>
                      <th>Package</th>
                      <th>Target Branches</th>
                      <th>Drive Date</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${drives.map(d => `
                      <tr>
                        <td><strong>${window.UI.escapeHtml(d.title)}</strong></td>
                        <td>${window.UI.escapeHtml(d.jobRole)}</td>
                        <td style="color:var(--success); font-weight:700;">₹${d.packageLpa} LPA</td>
                        <td>${(d.eligibility?.branches || []).join(', ') || 'All'}</td>
                        <td>${window.UI.formatDate(d.driveDate)}</td>
                        <td>${window.UI.badge(d.status)}</td>
                        <td>
                          <a href="/placements/drives/${d._id}" class="btn btn-primary btn-sm" data-link>View & Apply</a>
                        </td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            `}
          </div>
        </div>
      `;
    } catch (err) {
      console.error(err);
      app.innerHTML = `<div class="container section"><h3>Error loading company: ${err.message}</h3></div>`;
    }
  }
};
