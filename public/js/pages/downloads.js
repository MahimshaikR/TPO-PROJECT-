/**
 * TPO Connect — Official Downloads & Document Center
 */
window.DownloadsPage = {
  activeCategory: 'ALL',
  searchQuery: '',
  resources: [],

  async render() {
    const app = document.getElementById('app');
    app.innerHTML = '<div class="spinner"></div>';

    try {
      const res = await window.API.get('/resources');
      this.resources = res.data || [];
      this.renderView();
    } catch (err) {
      app.innerHTML = `
        <div class="container section">
          <div class="empty-state">
            <div class="empty-state-icon">⚠️</div>
            <div class="empty-state-title">Unable to Load Downloads</div>
            <p>${window.UI.escapeHtml(err.message)}</p>
            <button class="btn btn-primary" onclick="window.DownloadsPage.render()">Try Again</button>
          </div>
        </div>
      `;
    }
  },

  renderView() {
    const app = document.getElementById('app');
    const userRole = window.State?.getRole();
    const isAdmin = ['ADMIN', 'TP_OFFICER', 'SUPER_ADMIN'].includes(userRole);

    let filtered = this.resources;
    if (this.activeCategory !== 'ALL') {
      filtered = filtered.filter(r => r.category === this.activeCategory);
    }
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      filtered = filtered.filter(r => 
        (r.title && r.title.toLowerCase().includes(q)) ||
        (r.description && r.description.toLowerCase().includes(q)) ||
        (r.tags && r.tags.some(t => t.toLowerCase().includes(q)))
      );
    }

    const categories = [
      { id: 'ALL', label: 'All Documents' },
      { id: 'RESUME', label: 'Resume Templates' },
      { id: 'APTITUDE', label: 'Aptitude & Math' },
      { id: 'CODING', label: 'DSA & Coding' },
      { id: 'HR_PREP', label: 'HR & Behavioral' },
      { id: 'SYSTEM_DESIGN', label: 'System Design' },
      { id: 'PREVIOUS_PAPERS', label: 'Previous Papers' }
    ];

    app.innerHTML = `
      <div class="container section">
        <!-- Breadcrumb & Header -->
        <div style="font-size:0.85rem; color:#64748b; margin-bottom:1rem; display:flex; align-items:center; gap:0.5rem;">
          <a href="/" data-link style="color:#64748b; text-decoration:none;">Home</a>
          <span>/</span>
          <span style="color:#0f172a; font-weight:600;">Downloads Center</span>
        </div>

        <div class="section-title-wrap" style="text-align:center; max-width:850px; margin:0 auto 2.5rem auto;">
          <span class="section-badge" style="background:#e0e7ff; color:#3730a3; padding:0.25rem 0.85rem; border-radius:999px; font-size:0.8rem; font-weight:700; letter-spacing:0.05em; text-transform:uppercase; display:inline-block; margin-bottom:0.75rem;">OFFICIAL REPOSITORY</span>
          <h1 class="section-title" style="font-size:2.2rem; font-weight:800; color:#0f172a; letter-spacing:-0.02em; margin-bottom:0.75rem;">Downloads & Document Center</h1>
          <p class="section-subtitle" style="font-size:1.05rem; color:#475569; line-height:1.6;">
            Access verified placement handbooks, ATS resume templates, company-specific preparation guides, internship NOC forms, and recruitment question papers.
          </p>
        </div>

        <!-- Search & Filter Controls -->
        <div class="card" style="padding:1.5rem; margin-bottom:2rem; background:#ffffff; border:1px solid #e2e8f0; border-radius:10px;">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem; margin-bottom:1.25rem;">
            <div style="position:relative; flex:1; min-width:280px;">
              <input type="text" 
                     id="download-search-input" 
                     class="form-control" 
                     placeholder="Search documents by title, keyword, or topic (e.g., LeetCode, Resume, TCS)..." 
                     value="${window.UI.escapeHtml(this.searchQuery)}"
                     oninput="window.DownloadsPage.onSearch(this.value)" />
            </div>
            ${isAdmin ? `
              <button class="btn btn-primary" onclick="window.DownloadsPage.openUploadModal()" style="font-weight:600;">
                ➕ Upload New Document
              </button>
            ` : ''}
          </div>

          <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
            ${categories.map(c => `
              <button class="btn btn-sm ${this.activeCategory === c.id ? 'btn-primary' : 'btn-outline'}" 
                      onclick="window.DownloadsPage.filterCategory('${c.id}')">
                ${c.label}
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Downloads Grid / Table -->
        <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(360px, 1fr)); gap:1.5rem;">
          ${filtered.length ? filtered.map(r => this.renderDocumentCard(r)).join('') : `
            <div style="grid-column:1/-1; text-align:center; padding:3rem; background:#f8fafc; border-radius:12px; color:#64748b;">
              <div style="font-size:2.5rem; margin-bottom:0.5rem;">📂</div>
              <h3>No documents match your query</h3>
              <p>Try searching for a different keyword or resetting filters.</p>
              <button class="btn btn-sm btn-outline" onclick="window.DownloadsPage.resetFilters()">Clear Filters</button>
            </div>
          `}
        </div>

        <!-- Institutional Compliance Banner -->
        <div style="margin-top:3.5rem; background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:1.5rem; display:flex; align-items:center; gap:1.25rem;">
          <div style="font-size:2rem; flex-shrink:0;">🔒</div>
          <div style="font-size:0.88rem; color:#475569; line-height:1.6;">
            <strong>Document Integrity Notice:</strong> All templates and question banks published here are authorized by the Training & Placement Cell. Resumes submitted for on-campus drives must strictly adhere to the approved ATS format.
          </div>
        </div>
      </div>
    `;
  },

  onSearch(query) {
    this.searchQuery = query;
    this.renderView();
    // Keep focus
    const input = document.getElementById('download-search-input');
    if (input) {
      input.focus();
      input.selectionStart = input.selectionEnd = input.value.length;
    }
  },

  filterCategory(cat) {
    this.activeCategory = cat;
    this.renderView();
  },

  resetFilters() {
    this.activeCategory = 'ALL';
    this.searchQuery = '';
    this.renderView();
  },

  renderDocumentCard(doc) {
    const icon = doc.category === 'RESUME' ? '📄'
      : doc.category === 'CODING' ? '💻'
      : doc.category === 'APTITUDE' ? '📐'
      : doc.category === 'SYSTEM_DESIGN' ? '🏗️'
      : doc.category === 'HR_PREP' ? '🗣️'
      : '📚';

    const tags = Array.isArray(doc.tags) ? doc.tags : [];

    return `
      <div class="card" style="display:flex; flex-direction:column; justify-content:space-between; padding:1.5rem; border:1px solid #e2e8f0; border-radius:10px; background:#ffffff; box-shadow:0 1px 3px rgba(0,0,0,0.04); transition:transform 0.2s, box-shadow 0.2s;">
        <div>
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.85rem;">
            <div style="display:flex; align-items:center; gap:0.5rem;">
              <span style="font-size:1.4rem;">${icon}</span>
              <span class="badge" style="background:#f1f5f9; color:#334155; font-size:0.75rem; font-weight:700;">
                ${window.UI.escapeHtml(doc.category || 'GENERAL')}
              </span>
            </div>
            <span style="font-size:0.78rem; color:#64748b; font-weight:600;">
              ⬇️ ${(doc.downloadsCount || 0).toLocaleString()} downloads
            </span>
          </div>

          <h3 style="font-size:1.1rem; font-weight:800; color:#0f172a; margin:0 0 0.5rem 0; line-height:1.4;">
            ${window.UI.escapeHtml(doc.title)}
          </h3>

          <p style="font-size:0.88rem; color:#475569; line-height:1.6; margin-bottom:1rem;">
            ${window.UI.escapeHtml(doc.description || '')}
          </p>

          ${tags.length ? `
            <div style="display:flex; gap:0.35rem; flex-wrap:wrap; margin-bottom:1rem;">
              ${tags.map(t => `<span style="font-size:0.72rem; background:#f8fafc; border:1px solid #e2e8f0; padding:0.15rem 0.5rem; border-radius:4px; color:#64748b;">${window.UI.escapeHtml(t)}</span>`).join('')}
            </div>
          ` : ''}
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid #f1f5f9; padding-top:1rem; margin-top:0.5rem;">
          <span style="font-size:0.78rem; color:#94a3b8; font-weight:500;">Format: PDF / Docs</span>
          <a href="${doc.fileUrl || doc.externalLink || '#'}" 
             target="_blank" 
             rel="noopener noreferrer" 
             class="btn btn-primary btn-sm" 
             onclick="window.DownloadsPage.incrementCount('${doc._id}')"
             style="display:inline-flex; align-items:center; gap:0.35rem; font-weight:600; text-decoration:none;">
            <span>⬇️ Download File</span>
          </a>
        </div>
      </div>
    `;
  },

  async incrementCount(id) {
    try {
      const doc = this.resources.find(r => r._id === id);
      if (doc) {
        doc.downloadsCount = (doc.downloadsCount || 0) + 1;
        // background update
        window.API.put(`/resources/${id}`, { downloadsCount: doc.downloadsCount }).catch(() => {});
      }
    } catch (e) {}
  },

  openUploadModal() {
    window.UI.modal({
      title: 'Upload Official Resource / Download',
      content: `
        <form id="upload-doc-form" style="display:flex; flex-direction:column; gap:1rem;">
          <div>
            <label style="display:block; font-size:0.85rem; font-weight:600; margin-bottom:0.35rem;">Document Title *</label>
            <input type="text" id="doc-title" class="form-control" required placeholder="e.g. Placement Policy Handbook 2026-27" />
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
            <div>
              <label style="display:block; font-size:0.85rem; font-weight:600; margin-bottom:0.35rem;">Category *</label>
              <select id="doc-category" class="form-control">
                <option value="RESUME">Resume Templates</option>
                <option value="APTITUDE">Aptitude & Math</option>
                <option value="CODING">DSA & Coding</option>
                <option value="HR_PREP">HR & Behavioral</option>
                <option value="SYSTEM_DESIGN">System Design</option>
                <option value="PREVIOUS_PAPERS">Previous Papers</option>
              </select>
            </div>
            <div>
              <label style="display:block; font-size:0.85rem; font-weight:600; margin-bottom:0.35rem;">Tags (comma-separated)</label>
              <input type="text" id="doc-tags" class="form-control" placeholder="e.g. ATS, Handbook, TCS" />
            </div>
          </div>
          <div>
            <label style="display:block; font-size:0.85rem; font-weight:600; margin-bottom:0.35rem;">File URL or External Link *</label>
            <input type="url" id="doc-file-url" class="form-control" required placeholder="https://..." />
          </div>
          <div>
            <label style="display:block; font-size:0.85rem; font-weight:600; margin-bottom:0.35rem;">Description *</label>
            <textarea id="doc-desc" class="form-control" rows="3" required placeholder="Brief description of the document contents..."></textarea>
          </div>
        </form>
      `,
      onConfirm: async () => {
        const title = document.getElementById('doc-title').value.trim();
        const category = document.getElementById('doc-category').value;
        const tags = document.getElementById('doc-tags').value.split(',').map(s => s.trim()).filter(Boolean);
        const fileUrl = document.getElementById('doc-file-url').value.trim();
        const description = document.getElementById('doc-desc').value.trim();

        if (!title || !fileUrl || !description) {
          throw new Error('Please fill in all required fields.');
        }

        await window.API.post('/resources', {
          title, category, tags, fileUrl, description,
          isPublished: true,
          downloadsCount: 0
        });

        window.UI.showToast('Document uploaded successfully to the Downloads Center.', 'success');
        await window.DownloadsPage.render();
      }
    });
  }
};
