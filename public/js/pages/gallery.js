/**
 * TPO Connect — Campus Life & Recruitment Gallery View
 */
window.GalleryPage = {
  async render() {
    const app = document.getElementById('app');
    app.innerHTML = '<div class="spinner"></div>';

    try {
      const items = await window.API.get('/gallery');

      app.innerHTML = `
        <div class="container section">
          <div class="section-title-wrap">
            <span class="section-badge">CAMPUS GLIMPSES</span>
            <h1 class="section-title">Photo Gallery & Placement Moments</h1>
            <p class="section-subtitle">Memorable milestones from corporate drives, felicitations, and technical hackathons.</p>
          </div>

          <div class="filter-bar">
            <div class="filter-group">
              <span class="filter-label">Category:</span>
              <select id="gallery-cat-filter" class="form-select" onchange="window.GalleryPage.applyFilter()">
                <option value="ALL">All Categories</option>
                <option value="PLACEMENT">Placements</option>
                <option value="COMPANY_VISIT">Company Visits</option>
                <option value="AWARDS">Award Ceremonies</option>
                <option value="HACKATHON">Hackathons</option>
                <option value="TRAINING">Training</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-3" id="gallery-grid">
            ${this.renderGalleryCards(items)}
          </div>
        </div>
      `;
      this.allItems = items;
    } catch (err) {
      console.error(err);
      app.innerHTML = `<div class="container section">Error: ${err.message}</div>`;
    }
  },

  renderGalleryCards(items) {
    if (!items || items.length === 0) {
      return '<p style="grid-column:1/-1; text-align:center; color:var(--text-muted); padding:3rem 0;">No photographs found.</p>';
    }

    return items.map(item => `
      <div class="card" style="padding:0; overflow:hidden;">
        <div style="height:220px; overflow:hidden;">
          <img src="${item.imageUrl}" alt="${item.title}" style="width:100%; height:100%; object-fit:cover; transition:var(--transition);" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
        </div>
        <div style="padding:1.25rem;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
            <span class="badge badge-primary">${item.category}</span>
            <span style="font-size:0.8rem; color:var(--text-muted); font-weight:600;">${window.UI.formatDate(item.eventDate)}</span>
          </div>
          <h3 style="font-size:1.1rem; font-weight:800; color:var(--text-main); margin-bottom:0.4rem;">${window.UI.escapeHtml(item.title)}</h3>
          <p style="font-size:0.85rem; color:var(--text-muted); line-height:1.5;">${window.UI.escapeHtml(item.caption || '')}</p>
        </div>
      </div>
    `).join('');
  },

  applyFilter() {
    const cat = document.getElementById('gallery-cat-filter')?.value || 'ALL';
    let filtered = this.allItems || [];

    if (cat !== 'ALL') {
      filtered = filtered.filter(i => i.category === cat);
    }

    const grid = document.getElementById('gallery-grid');
    if (grid) {
      grid.innerHTML = this.renderGalleryCards(filtered);
    }
  }
};
