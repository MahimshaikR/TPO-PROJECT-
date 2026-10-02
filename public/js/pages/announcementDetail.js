/**
 * TPO Connect — Announcement Detail View
 */
window.AnnouncementDetailPage = {
  async render(params) {
    const app = document.getElementById('app');
    app.innerHTML = '<div class="spinner"></div>';

    try {
      const announcementId = (typeof params === 'object' && params !== null) ? (params.id || params._id) : params;
      const announcement = await window.API.get(`/announcements/${announcementId}`);

      app.innerHTML = `
        <div class="container section">
          <div style="margin-bottom: 1.5rem;">
            <a href="/announcements" class="btn btn-outline btn-sm" data-link>&larr; Back to Announcements</a>
          </div>

          <div class="card" style="max-width: 800px; margin: 0 auto; padding: 2.5rem; border-top: 5px solid ${announcement.priority === 'URGENT' ? 'var(--danger)' : 'var(--primary)'};">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
              <div style="display:flex; gap:0.5rem;">
                <span class="badge ${announcement.priority === 'URGENT' ? 'badge-danger' : 'badge-primary'}">${announcement.priority}</span>
                <span class="badge badge-info">${announcement.category}</span>
              </div>
              <span style="font-size:0.85rem; color:var(--text-muted); font-weight:600;">Posted: ${window.UI.formatDate(announcement.createdAt)}</span>
            </div>

            <h1 style="font-size: 2.1rem; font-weight: 800; color: var(--text-main); margin-bottom: 1.5rem; line-height: 1.3;">
              ${window.UI.escapeHtml(announcement.title)}
            </h1>

            <div style="font-size: 1.05rem; line-height: 1.8; color: var(--text-main); margin-bottom: 2rem; white-space: pre-line;">
              ${window.UI.escapeHtml(announcement.content)}
            </div>

            ${(announcement.attachments || []).length > 0 ? `
              <div style="background:var(--bg-subtle); padding:1.25rem; border-radius:var(--radius-md); margin-bottom:1.5rem;">
                <h4 style="font-weight:700; margin-bottom:0.75rem;">Official Attachments</h4>
                <div style="display:flex; flex-direction:column; gap:0.5rem;">
                  ${announcement.attachments.map(att => `
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                      <span>📄 ${window.UI.escapeHtml(att.name)}</span>
                      <a href="${att.url}" target="_blank" class="btn btn-outline btn-sm">Download Attachment</a>
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : ''}

            <div style="border-top:1px solid var(--border-color); padding-top:1rem; font-size:0.85rem; color:var(--text-muted); display:flex; justify-content:space-between;">
              <span>Target Audience: <strong>${announcement.targetAudience}</strong></span>
              <span>Expires: <strong>${announcement.expiresAt || 'Indefinite'}</strong></span>
            </div>
          </div>
        </div>
      `;
    } catch (err) {
      console.error(err);
      app.innerHTML = `<div class="container section">Error: ${err.message}</div>`;
    }
  }
};
