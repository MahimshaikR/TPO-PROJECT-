/**
 * TPO Connect — Announcements & Circulars View
 */
window.AnnouncementsPage = {
  async render() {
    const app = document.getElementById('app');
    app.innerHTML = '<div class="spinner"></div>';

    try {
      const announcements = await window.API.get('/announcements');

      app.innerHTML = `
        <div class="container section">
          <div class="section-title-wrap" style="text-align:left; margin-bottom:2rem;">
            <span class="section-badge">OFFICIAL CIRCULARS</span>
            <h1 class="section-title">Announcements & Notifications</h1>
            <p class="section-subtitle">Important placement notices, deadline updates, and screening exam guidelines.</p>
          </div>

          <div style="display:flex; flex-direction:column; gap:1.25rem;">
            ${announcements.length === 0 ? '<p style="text-align:center; color:var(--text-muted); padding:3rem 0;">No active circulars at this moment.</p>' : ''}
            ${announcements.map(a => `
              <div class="card card-clickable" onclick="window.Router.navigate('/announcements/${a._id}')" style="border-left: 5px solid ${a.priority === 'URGENT' ? 'var(--danger)' : a.priority === 'HIGH' ? 'var(--warning)' : 'var(--primary)'};">
                <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.75rem; flex-wrap:wrap; gap:0.5rem;">
                  <div style="display:flex; gap:0.5rem; align-items:center;">
                    <span class="badge ${a.priority === 'URGENT' ? 'badge-danger' : a.priority === 'HIGH' ? 'badge-warning' : 'badge-primary'}">${a.priority}</span>
                    <span class="badge badge-info">${a.category}</span>
                  </div>
                  <span style="font-size:0.85rem; color:var(--text-muted); font-weight:600;">📅 ${window.UI.formatDate(a.createdAt)}</span>
                </div>
                <h3 style="font-size:1.25rem; font-weight:800; color:var(--text-main); margin-bottom:0.5rem;">
                  ${a.priority === 'URGENT' ? '🚨 ' : ''}${window.UI.escapeHtml(a.title)}
                </h3>
                <p style="font-size:0.95rem; color:var(--text-muted); line-height:1.6; margin-bottom:1rem; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">
                  ${window.UI.escapeHtml(a.content)}
                </p>
                <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border-color); padding-top:0.75rem;">
                  <span style="font-size:0.8rem; color:var(--text-muted); font-weight:600;">Audience: ${a.targetAudience}</span>
                  <a href="/announcements/${a._id}" class="btn btn-secondary btn-sm" data-link>Read Full Circular &rarr;</a>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    } catch (err) {
      console.error(err);
      app.innerHTML = `<div class="container section">Error: ${err.message}</div>`;
    }
  }
};
