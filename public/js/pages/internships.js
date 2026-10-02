/**
 * TPO Connect — Internships Catalog Page
 */
window.InternshipsPage = {
  async render() {
    const app = document.getElementById('app');
    app.innerHTML = '<div class="spinner"></div>';

    try {
      const internships = await window.API.get('/internships');

      app.innerHTML = `
        <div class="container section">
          <div class="section-title-wrap" style="text-align:left; margin-bottom:2rem;">
            <span class="section-badge">INDUSTRY EXPOSURE</span>
            <h1 class="section-title">Internships & Research Fellowships</h1>
            <p class="section-subtitle">Summer, winter, and semester-long internship openings with industry stipends.</p>
          </div>

          <div class="grid grid-cols-3">
            ${internships.length === 0 ? '<p style="grid-column:1/-1; text-align:center;">No active internship opportunities currently listed.</p>' : ''}
            ${internships.map(i => `
              <div class="card card-clickable" onclick="window.Router.navigate('/internships/${i._id}')">
                <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.75rem;">
                  <span class="badge badge-success">${i.type}</span>
                  <span style="font-size:0.85rem; color:var(--text-muted); font-weight:600;">⌛ ${window.UI.formatDate(i.deadline)}</span>
                </div>
                <h3 style="font-size:1.15rem; font-weight:800; color:var(--text-main); margin-bottom:0.25rem;">${window.UI.escapeHtml(i.title)}</h3>
                <p style="font-size:0.9rem; color:var(--primary); font-weight:700; margin-bottom:0.85rem;">🏢 ${window.UI.escapeHtml(i.company)}</p>
                <div style="font-size:0.9rem; line-height:1.6; color:var(--text-muted); margin-bottom:1.25rem;">
                  <p>💵 <strong>Stipend:</strong> ${window.UI.escapeHtml(i.stipend || 'Competitive Stipend')}</p>
                  <p>📍 <strong>Location:</strong> ${window.UI.escapeHtml(i.location || 'Hybrid')}</p>
                  <p>⏳ <strong>Duration:</strong> ${window.UI.escapeHtml(i.duration || '6 Months')}</p>
                </div>
                <a href="/internships/${i._id}" class="btn btn-secondary btn-sm" style="width:100%;" data-link>View Details & Requirements</a>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    } catch (err) {
      console.error(err);
      app.innerHTML = `<div class="container section"><h3>Error loading internships: ${err.message}</h3></div>`;
    }
  }
};
