/**
 * TPO Connect — Resource Detail & Download Page
 */
window.ResourceDetailPage = {
  async render(params) {
    const app = document.getElementById('app');
    app.innerHTML = '<div class="spinner"></div>';

    try {
      const resourceId = (typeof params === 'object' && params !== null) ? (params.id || params._id) : params;
      const resource = await window.API.get(`/resources/${resourceId}`);

      app.innerHTML = `
        <div class="container section">
          <div style="margin-bottom: 1.5rem;">
            <a href="/resources" class="btn btn-outline btn-sm" data-link>&larr; Back to Resources</a>
          </div>

          <div class="card" style="max-width: 800px; margin: 0 auto; padding: 2.5rem;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
              <span class="badge badge-primary">${resource.category}</span>
              <span style="font-size:0.85rem; color:var(--text-muted); font-weight:600;">📥 ${resource.downloadsCount || 0} downloads</span>
            </div>

            <h1 style="font-size: 2rem; font-weight: 800; color: var(--text-main); margin-bottom: 1rem; line-height: 1.25;">
              ${window.UI.escapeHtml(resource.title)}
            </h1>

            <div style="display:flex; flex-wrap:wrap; gap:0.5rem; margin-bottom: 1.5rem;">
              ${(resource.tags || []).map(t => `<span class="badge badge-info">#${window.UI.escapeHtml(t)}</span>`).join('')}
            </div>

            <div style="margin-bottom: 2rem;">
              <h3 style="font-size: 1.15rem; font-weight: 700; margin-bottom: 0.5rem;">Overview & Content Summary</h3>
              <p style="color: var(--text-muted); line-height: 1.75; font-size: 1rem;">
                ${window.UI.escapeHtml(resource.description || 'Comprehensive placement guide and reference materials.')}
              </p>
            </div>

            <div style="background: var(--bg-subtle); padding: 1.5rem; border-radius: var(--radius-md); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
              <div>
                <div style="font-weight: 700; font-size: 1.05rem; margin-bottom: 0.25rem;">Download Learning Material</div>
                <div style="font-size: 0.85rem; color: var(--text-muted);">Verified official syllabus guide provided by T&P cell.</div>
              </div>
              <div style="display:flex; gap:0.75rem;">
                ${resource.externalLink ? `
                  <a href="${resource.externalLink}" target="_blank" class="btn btn-outline btn-sm">External Reference &nearr;</a>
                ` : ''}
                <button class="btn btn-primary" onclick="window.ResourceDetailPage.downloadFile('${resource._id}', '${resource.fileUrl || '#'}')">
                  Download Guide (PDF)
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    } catch (err) {
      console.error(err);
      app.innerHTML = `<div class="container section">Error: ${err.message}</div>`;
    }
  },

  async downloadFile(id, fileUrl) {
    try {
      await window.API.post(`/resources/${id}/download`);
      window.UI.toast('Downloading resource guide...', 'success');
      if (fileUrl && fileUrl !== '#') {
        window.open(fileUrl, '_blank');
      }
    } catch (e) {
      window.UI.toast('Resource download initialized', 'info');
    }
  }
};
