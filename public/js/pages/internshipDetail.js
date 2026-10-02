/**
 * TPO Connect — Internship Detail View
 */
window.InternshipDetailPage = {
  async render(params) {
    const app = document.getElementById('app');
    app.innerHTML = '<div class="spinner"></div>';

    try {
      const internshipId = (typeof params === 'object' && params !== null) ? (params.id || params._id) : params;
      const internship = await window.API.get(`/internships/${internshipId}`);

      app.innerHTML = `
        <div class="container section">
          <div style="margin-bottom: 1.5rem;">
            <a href="/internships" class="btn btn-outline btn-sm" data-link>&larr; Back to Internships</a>
          </div>

          <div style="display:grid; grid-template-columns: 2fr 1fr; gap: 2rem;">
            <div class="card">
              <span class="badge badge-primary">${internship.type} INTERNSHIP</span>
              <h1 style="font-size:2rem; font-weight:800; margin-top:0.5rem; color:var(--text-main);">${window.UI.escapeHtml(internship.title)}</h1>
              <p style="font-size:1.15rem; color:var(--primary); font-weight:700; margin-bottom:1.5rem;">${window.UI.escapeHtml(internship.company)}</p>

              <div class="grid grid-cols-3" style="background:var(--bg-subtle); padding:1.25rem; border-radius:var(--radius-md); margin-bottom:1.5rem;">
                <div>
                  <span style="font-size:0.8rem; color:var(--text-muted); font-weight:600;">STIPEND</span>
                  <div style="font-weight:800; font-size:1.15rem; color:var(--success);">${window.UI.escapeHtml(internship.stipend || 'Competitive')}</div>
                </div>
                <div>
                  <span style="font-size:0.8rem; color:var(--text-muted); font-weight:600;">DURATION</span>
                  <div style="font-weight:700; font-size:1rem;">${window.UI.escapeHtml(internship.duration || '6 Months')}</div>
                </div>
                <div>
                  <span style="font-size:0.8rem; color:var(--text-muted); font-weight:600;">LOCATION</span>
                  <div style="font-weight:700; font-size:1rem;">${window.UI.escapeHtml(internship.location || 'Hybrid')}</div>
                </div>
              </div>

              <div style="margin-bottom:1.5rem;">
                <h3 style="font-size:1.15rem; font-weight:700; margin-bottom:0.5rem;">Role Description</h3>
                <p style="color:var(--text-muted); line-height:1.7;">${window.UI.escapeHtml(internship.description || 'Hands-on practical engineering internship.')}</p>
              </div>

              <div>
                <h3 style="font-size:1.15rem; font-weight:700; margin-bottom:0.5rem;">Candidate Prerequisites & Requirements</h3>
                <ul style="padding-left:1.25rem; line-height:1.7; color:var(--text-muted);">
                  ${(internship.requirements || []).map(r => `<li>${window.UI.escapeHtml(r)}</li>`).join('')}
                </ul>
              </div>
            </div>

            <div>
              <div class="card" style="position:sticky; top:5.5rem;">
                <h3 style="font-size:1.2rem; font-weight:700; margin-bottom:1rem; border-bottom:1px solid var(--border-color); padding-bottom:0.5rem;">Application Overview</h3>
                <div style="font-size:0.9rem; line-height:1.8; margin-bottom:1.5rem;">
                  <p>⏳ <strong>Application Deadline:</strong> ${window.UI.formatDate(internship.deadline)}</p>
                  <p>🎓 <strong>Eligible Branches:</strong> ${(internship.branches || []).join(', ') || 'All Branches'}</p>
                </div>
                ${internship.applyLink ? `
                  <a href="${internship.applyLink}" target="_blank" class="btn btn-primary" style="width:100%;">Apply on Official Portal &nearr;</a>
                ` : `
                  <button class="btn btn-primary" style="width:100%;" onclick="window.UI.toast('Application submitted to T&P internship desk!', 'success')">Apply via T&P Desk</button>
                `}
              </div>
            </div>
          </div>
        </div>
      `;
    } catch (err) {
      console.error(err);
      app.innerHTML = `<div class="container section"><h3>Error loading internship: ${err.message}</h3></div>`;
    }
  }
};
