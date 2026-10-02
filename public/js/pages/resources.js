/**
 * TPO Connect — Learning Resources & Question Bank Catalog
 */
window.ResourcesPage = {
  async render() {
    const app = document.getElementById('app');
    app.innerHTML = '<div class="spinner"></div>';

    try {
      const resources = await window.API.get('/resources');

      app.innerHTML = `
        <div class="container section">
          <div class="section-title-wrap" style="text-align:left; margin-bottom:2rem;">
            <span class="section-badge">PLACEMENT REPOSITORY</span>
            <h1 class="section-title">Interview Prep, Coding & Aptitude Resources</h1>
            <p class="section-subtitle">Curated question banks, previous company test papers, ATS resume templates, and formula sheets.</p>
          </div>

          <div class="filter-bar">
            <div class="filter-group">
              <span class="filter-label">Category:</span>
              <select id="resource-cat-filter" class="form-select" onchange="window.ResourcesPage.applyFilter()">
                <option value="ALL">All Categories</option>
                <option value="APTITUDE">Aptitude & Speed Math</option>
                <option value="CODING">Coding & Algorithms</option>
                <option value="TECHNICAL">Technical Core</option>
                <option value="HR">HR & Behavioral</option>
                <option value="RESUME">Resume Templates</option>
                <option value="COMPANY_PREPARATION">Company-Specific Prep</option>
                <option value="PREVIOUS_PAPERS">Previous Papers</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2" id="resources-grid">
            ${this.renderResourceCards(resources)}
          </div>
        </div>
      `;
      this.allResources = resources;
    } catch (err) {
      console.error(err);
      app.innerHTML = `<div class="container section">Error: ${err.message}</div>`;
    }
  },

  renderResourceCards(resources) {
    if (!resources || resources.length === 0) {
      return '<p style="grid-column:1/-1; text-align:center; color:var(--text-muted); padding:3rem 0;">No learning materials matching this filter.</p>';
    }

    return resources.map(r => `
      <div class="card card-clickable" onclick="window.Router.navigate('/resources/${r._id}')">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.75rem;">
          <span class="badge badge-primary">${r.category}</span>
          <span style="font-size:0.8rem; color:var(--text-muted); font-weight:600;">📥 ${r.downloadsCount || 0} downloads</span>
        </div>
        <h3 style="font-size:1.2rem; font-weight:800; color:var(--text-main); margin-bottom:0.5rem; line-height:1.3;">
          ${window.UI.escapeHtml(r.title)}
        </h3>
        <p style="font-size:0.9rem; color:var(--text-muted); line-height:1.6; margin-bottom:1rem; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">
          ${window.UI.escapeHtml(r.description || 'Downloadable preparatory guide.')}
        </p>
        <div style="display:flex; flex-wrap:wrap; gap:0.35rem; margin-bottom:1rem;">
          ${(r.tags || []).map(t => `<span style="font-size:0.75rem; background:var(--bg-subtle); padding:0.2rem 0.5rem; border-radius:var(--radius-sm); color:var(--text-muted);">#${window.UI.escapeHtml(t)}</span>`).join('')}
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border-color); padding-top:0.75rem;">
          <span style="font-size:0.85rem; color:var(--primary); font-weight:600;">View Resource Details</span>
          <a href="/resources/${r._id}" class="btn btn-secondary btn-sm" data-link>Access Resource &rarr;</a>
        </div>
      </div>
    `).join('');
  },

  applyFilter() {
    const cat = document.getElementById('resource-cat-filter')?.value || 'ALL';
    let filtered = this.allResources || [];

    if (cat !== 'ALL') {
      filtered = filtered.filter(r => r.category === cat);
    }

    const grid = document.getElementById('resources-grid');
    if (grid) {
      grid.innerHTML = this.renderResourceCards(filtered);
    }
  }
};
