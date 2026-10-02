/**
 * TPO Connect — Companies Directory Page
 */
window.CompaniesPage = {
  async render() {
    const app = document.getElementById('app');
    app.innerHTML = '<div class="spinner"></div>';

    try {
      const companies = await window.API.get('/companies');

      app.innerHTML = `
        <div class="container section">
          <div class="section-title-wrap" style="text-align: left; margin-bottom: 2rem;">
            <span class="section-badge">RECRUITING PARTNERS</span>
            <h1 class="section-title">Corporate Partners Directory</h1>
            <p class="section-subtitle">Explore visiting employers, recruitment history, and hiring criteria.</p>
          </div>

          <!-- Filter Controls -->
          <div class="filter-bar">
            <div class="filter-group" style="flex: 2 1 250px;">
              <span class="filter-label">Search:</span>
              <input type="text" id="company-search" class="form-input" placeholder="Search by name, industry, or headquarters..." oninput="window.CompaniesPage.applyFilter()">
            </div>
            <div class="filter-group">
              <span class="filter-label">Tier:</span>
              <select id="company-tier-filter" class="form-select" onchange="window.CompaniesPage.applyFilter()">
                <option value="ALL">All Tiers</option>
                <option value="TIER_1">Tier 1 (> 15 LPA)</option>
                <option value="TIER_2">Tier 2 (8-15 LPA)</option>
                <option value="TIER_3">Tier 3 (5-8 LPA)</option>
                <option value="MASS">Mass Recruiter</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-3" id="companies-grid">
            ${this.renderCompanyCards(companies)}
          </div>
        </div>
      `;
      this.allCompanies = companies;
    } catch (err) {
      console.error(err);
      app.innerHTML = `<div class="container section"><h3>Error loading companies: ${err.message}</h3></div>`;
    }
  },

  renderCompanyCards(companies) {
    if (!companies || companies.length === 0) {
      return '<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 3rem 0;">No companies match the selected search criteria.</p>';
    }

    return companies.map(comp => `
      <div class="card card-clickable" onclick="window.Router.navigate('/companies/${comp._id}')">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1rem;">
          <div style="height:50px; display:flex; align-items:center;">
            ${comp.logo ? `<img src="${comp.logo}" alt="${comp.name}" style="max-height:42px; max-width:100px; object-fit:contain;">` : `<div style="font-weight:800; font-size:1.35rem; color:var(--primary);">${comp.name.substring(0, 3)}</div>`}
          </div>
          <span class="badge badge-primary">${comp.tier}</span>
        </div>
        <h3 style="font-size:1.2rem; font-weight:800; color:var(--text-main); margin-bottom:0.25rem;">${window.UI.escapeHtml(comp.name)}</h3>
        <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:1rem;">${window.UI.escapeHtml(comp.industry || 'Technology')}</p>
        <p style="font-size:0.9rem; color:var(--text-muted); line-height:1.6; margin-bottom:1.25rem; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">
          ${window.UI.escapeHtml(comp.description || 'Global corporate recruitment partner.')}
        </p>
        <div style="background:var(--bg-subtle); padding:0.75rem; border-radius:var(--radius-md); font-size:0.85rem; display:flex; justify-content:space-between; margin-bottom:1rem;">
          <span>Offers: <strong>${comp.totalOffersCount || 0}</strong></span>
          <span>Max: <strong style="color:var(--success);">₹${comp.highestPackageOffered || 0} LPA</strong></span>
        </div>
        <a href="/companies/${comp._id}" class="btn btn-secondary btn-sm" style="width:100%;" data-link>View Company Profile</a>
      </div>
    `).join('');
  },

  applyFilter() {
    const q = (document.getElementById('company-search')?.value || '').toLowerCase().trim();
    const tier = document.getElementById('company-tier-filter')?.value || 'ALL';

    let filtered = this.allCompanies || [];

    if (q) {
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(q) ||
        (c.industry && c.industry.toLowerCase().includes(q)) ||
        (c.headOffice && c.headOffice.toLowerCase().includes(q))
      );
    }

    if (tier !== 'ALL') {
      filtered = filtered.filter(c => c.tier === tier);
    }

    const grid = document.getElementById('companies-grid');
    if (grid) {
      grid.innerHTML = this.renderCompanyCards(filtered);
    }
  }
};
