/**
 * TPO Connect — Testimonials & Feedback Showcase
 */
window.TestimonialsPage = {
  activeType: 'ALL',
  testimonials: [],

  async render() {
    const app = document.getElementById('app');
    app.innerHTML = '<div class="spinner"></div>';

    try {
      const res = await window.API.get('/testimonials');
      this.testimonials = res.data || [];
      this.renderView();
    } catch (err) {
      app.innerHTML = `
        <div class="container section">
          <div class="empty-state">
            <div class="empty-state-icon">⚠️</div>
            <div class="empty-state-title">Unable to Load Testimonials</div>
            <p>${window.UI.escapeHtml(err.message)}</p>
            <button class="btn btn-primary" onclick="window.TestimonialsPage.render()">Try Again</button>
          </div>
        </div>
      `;
    }
  },

  renderView() {
    const app = document.getElementById('app');
    const settings = window.State?.getSettings() || {};
    const collegeName = settings.collegeName || 'NRIIT ENGINEERING COLLEGE';

    const filtered = this.activeType === 'ALL'
      ? this.testimonials
      : this.testimonials.filter(t => t.type === this.activeType);

    const studentCount = this.testimonials.filter(t => t.type === 'STUDENT').length;
    const recruiterCount = this.testimonials.filter(t => t.type === 'RECRUITER').length;
    const alumniCount = this.testimonials.filter(t => t.type === 'ALUMNI').length;

    app.innerHTML = `
      <div class="container section">
        <!-- Breadcrumb & Header -->
        <div style="font-size:0.85rem; color:#64748b; margin-bottom:1rem; display:flex; align-items:center; gap:0.5rem;">
          <a href="/" data-link style="color:#64748b; text-decoration:none;">Home</a>
          <span>/</span>
          <span style="color:#0f172a; font-weight:600;">Testimonials</span>
        </div>

        <div class="section-title-wrap" style="text-align:center; max-width:820px; margin:0 auto 2.5rem auto;">
          <span class="section-badge" style="background:#fef3c7; color:#92400e; padding:0.25rem 0.85rem; border-radius:999px; font-size:0.8rem; font-weight:700; letter-spacing:0.05em; text-transform:uppercase; display:inline-block; margin-bottom:0.75rem;">VOICES OF EXCELLENCE</span>
          <h1 class="section-title" style="font-size:2.2rem; font-weight:800; color:#0f172a; letter-spacing:-0.02em; margin-bottom:0.75rem;">What Students, Recruiters & Alumni Say</h1>
          <p class="section-subtitle" style="font-size:1.05rem; color:#475569; line-height:1.6;">
            Real experiences and reflections from corporate recruiters who hire our graduates, students who built their careers, and alumni excelling across global technology hubs.
          </p>
        </div>

        <!-- Metric Highlight Bar -->
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:1.25rem; margin-bottom:2.5rem;">
          <div class="card" style="text-align:center; padding:1.25rem; border-top:3px solid #f59e0b;">
            <div style="font-size:1.8rem; font-weight:800; color:#0f172a;">4.9 / 5.0</div>
            <div style="color:#f59e0b; font-size:1.1rem; margin-bottom:0.25rem;">★★★★★</div>
            <div style="font-size:0.8rem; color:#64748b;">Recruiter Satisfaction Score</div>
          </div>
          <div class="card" style="text-align:center; padding:1.25rem; border-top:3px solid #0284c7;">
            <div style="font-size:1.8rem; font-weight:800; color:#0f172a;">94.8%</div>
            <div style="color:#0284c7; font-size:1.1rem; margin-bottom:0.25rem;">Student Approval</div>
            <div style="font-size:0.8rem; color:#64748b;">Training & Drive Logistics</div>
          </div>
          <div class="card" style="text-align:center; padding:1.25rem; border-top:3px solid #10b981;">
            <div style="font-size:1.8rem; font-weight:800; color:#0f172a;">85+</div>
            <div style="color:#10b981; font-size:1.1rem; margin-bottom:0.25rem;">Tier-1 Partners</div>
            <div style="font-size:0.8rem; color:#64748b;">Recurring Campus Hirers</div>
          </div>
          <div class="card" style="text-align:center; padding:1.25rem; border-top:3px solid #6366f1;">
            <div style="font-size:1.8rem; font-weight:800; color:#0f172a;">10,000+</div>
            <div style="color:#6366f1; font-size:1.1rem; margin-bottom:0.25rem;">Global Alumni</div>
            <div style="font-size:0.8rem; color:#64748b;">Across 24+ Countries</div>
          </div>
        </div>

        <!-- Filter Controls & Action -->
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem; margin-bottom:2rem;">
          <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
            <button class="btn btn-sm ${this.activeType === 'ALL' ? 'btn-primary' : 'btn-outline'}" onclick="window.TestimonialsPage.filter('ALL')">All Testimonials (${this.testimonials.length})</button>
            <button class="btn btn-sm ${this.activeType === 'STUDENT' ? 'btn-primary' : 'btn-outline'}" onclick="window.TestimonialsPage.filter('STUDENT')">Placed Students (${studentCount})</button>
            <button class="btn btn-sm ${this.activeType === 'RECRUITER' ? 'btn-primary' : 'btn-outline'}" onclick="window.TestimonialsPage.filter('RECRUITER')">Corporate Recruiters (${recruiterCount})</button>
            <button class="btn btn-sm ${this.activeType === 'ALUMNI' ? 'btn-primary' : 'btn-outline'}" onclick="window.TestimonialsPage.filter('ALUMNI')">Distinguished Alumni (${alumniCount})</button>
          </div>
          <button class="btn btn-sm btn-outline" onclick="window.TestimonialsPage.openSubmitModal()" style="font-weight:600;">
            ✍️ Share Your Experience
          </button>
        </div>

        <!-- Testimonials Grid -->
        <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(360px, 1fr)); gap:1.75rem;">
          ${filtered.length ? filtered.map(t => this.renderTestimonialCard(t)).join('') : `
            <div style="grid-column:1/-1; text-align:center; padding:3rem; background:#f8fafc; border-radius:12px; color:#64748b;">
              No testimonials found in this category.
            </div>
          `}
        </div>
      </div>
    `;
  },

  filter(type) {
    this.activeType = type;
    this.renderView();
  },

  renderTestimonialCard(t) {
    const typeBadge = t.type === 'STUDENT'
      ? '<span class="badge" style="background:#e0f2fe; color:#0369a1; font-weight:700;">Placed Student</span>'
      : t.type === 'RECRUITER'
      ? '<span class="badge" style="background:#fef3c7; color:#92400e; font-weight:700;">Corporate Recruiter</span>'
      : '<span class="badge" style="background:#f3e8ff; color:#6b21a8; font-weight:700;">Distinguished Alumni</span>';

    const stars = '★'.repeat(t.rating || 5) + '☆'.repeat(5 - (t.rating || 5));

    return `
      <div class="card" style="display:flex; flex-direction:column; justify-content:space-between; padding:1.75rem; border:1px solid #e2e8f0; border-radius:12px; background:#ffffff; box-shadow:0 2px 4px rgba(0,0,0,0.03); position:relative;">
        <div style="position:absolute; right:1.5rem; top:1.5rem; font-size:2.8rem; line-height:1; color:#e2e8f0; font-family:serif; user-select:none;">“</div>
        
        <div>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.85rem;">
            ${typeBadge}
            <div style="color:#f59e0b; font-size:1rem; letter-spacing:0.1em;">${stars}</div>
          </div>

          <p style="font-size:0.95rem; color:#334155; line-height:1.7; font-style:italic; margin-bottom:1.5rem; position:relative; z-index:1;">
            "${window.UI.escapeHtml(t.quote)}"
          </p>
        </div>

        <div style="display:flex; align-items:center; gap:1rem; border-top:1px solid #f1f5f9; padding-top:1rem; margin-top:0.5rem;">
          <img src="${t.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}" 
               alt="${window.UI.escapeHtml(t.name)}" 
               style="width:52px; height:52px; border-radius:50%; object-fit:cover; border:2px solid #0284c7; flex-shrink:0;" />
          <div>
            <h4 style="font-size:1rem; font-weight:800; color:#0f172a; margin:0 0 0.15rem 0;">${window.UI.escapeHtml(t.name)}</h4>
            <div style="font-size:0.84rem; font-weight:600; color:#0284c7;">${window.UI.escapeHtml(t.role)}</div>
            <div style="font-size:0.8rem; color:#64748b;">
              ${window.UI.escapeHtml(t.company)} ${t.packageLpa ? `• <strong>${t.packageLpa} LPA</strong>` : ''} ${t.batch ? `• ${window.UI.escapeHtml(t.batch)}` : ''}
            </div>
          </div>
        </div>
      </div>
    `;
  },

  openSubmitModal() {
    window.UI.modal({
      title: 'Share Your Placement or Campus Experience',
      content: `
        <form id="testimonial-form" style="display:flex; flex-direction:column; gap:1rem;">
          <div>
            <label style="display:block; font-size:0.85rem; font-weight:600; margin-bottom:0.35rem;">Your Name *</label>
            <input type="text" id="test-name" class="form-control" required placeholder="Full Name" />
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
            <div>
              <label style="display:block; font-size:0.85rem; font-weight:600; margin-bottom:0.35rem;">Role / Designation *</label>
              <input type="text" id="test-role" class="form-control" required placeholder="e.g. SDE-1 / HR Manager" />
            </div>
            <div>
              <label style="display:block; font-size:0.85rem; font-weight:600; margin-bottom:0.35rem;">Company / Organization *</label>
              <input type="text" id="test-company" class="form-control" required placeholder="e.g. TCS / Infosys / Google" />
            </div>
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
            <div>
              <label style="display:block; font-size:0.85rem; font-weight:600; margin-bottom:0.35rem;">Category *</label>
              <select id="test-type" class="form-control">
                <option value="STUDENT">Placed Student</option>
                <option value="ALUMNI">Alumni</option>
                <option value="RECRUITER">Corporate Recruiter</option>
              </select>
            </div>
            <div>
              <label style="display:block; font-size:0.85rem; font-weight:600; margin-bottom:0.35rem;">Star Rating</label>
              <select id="test-rating" class="form-control">
                <option value="5">★★★★★ (5 Stars - Exceptional)</option>
                <option value="4">★★★★☆ (4 Stars - Very Good)</option>
                <option value="3">★★★☆☆ (3 Stars - Good)</option>
              </select>
            </div>
          </div>
          <div>
            <label style="display:block; font-size:0.85rem; font-weight:600; margin-bottom:0.35rem;">Your Experience & Feedback *</label>
            <textarea id="test-quote" class="form-control" rows="4" required placeholder="Share your experience with the Training & Placement Cell..."></textarea>
          </div>
        </form>
      `,
      onConfirm: async () => {
        const name = document.getElementById('test-name').value.trim();
        const role = document.getElementById('test-role').value.trim();
        const company = document.getElementById('test-company').value.trim();
        const type = document.getElementById('test-type').value;
        const rating = parseInt(document.getElementById('test-rating').value, 10);
        const quote = document.getElementById('test-quote').value.trim();

        if (!name || !role || !company || !quote) {
          throw new Error('Please fill in all required fields.');
        }

        await window.API.post('/testimonials', {
          name, role, company, type, rating, quote,
          isPublished: true
        });

        window.UI.showToast('Thank you! Your testimonial has been submitted successfully.', 'success');
        await window.TestimonialsPage.render();
      }
    });
  }
};
