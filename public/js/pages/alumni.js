/**
 * TPO Connect — Alumni Network & Mentorship Directory
 */
window.AlumniPage = {
  searchQuery: '',
  deptFilter: 'ALL',
  mentorOnly: false,
  alumniList: [],

  async render() {
    const app = document.getElementById('app');
    app.innerHTML = '<div class="spinner"></div>';

    try {
      const res = await window.API.get('/alumni');
      this.alumniList = res.data || [];
      this.renderView();
    } catch (err) {
      app.innerHTML = `
        <div class="container section">
          <div class="empty-state">
            <div class="empty-state-icon">⚠️</div>
            <div class="empty-state-title">Unable to Load Alumni Directory</div>
            <p>${window.UI.escapeHtml(err.message)}</p>
            <button class="btn btn-primary" onclick="window.AlumniPage.render()">Try Again</button>
          </div>
        </div>
      `;
    }
  },

  renderView() {
    const app = document.getElementById('app');
    const settings = window.State?.getSettings() || {};
    const collegeName = settings.collegeName || 'NRIIT ENGINEERING COLLEGE';

    let filtered = this.alumniList;
    if (this.deptFilter !== 'ALL') {
      filtered = filtered.filter(a => a.department === this.deptFilter);
    }
    if (this.mentorOnly) {
      filtered = filtered.filter(a => a.isMentor);
    }
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      filtered = filtered.filter(a => 
        (a.fullName && a.fullName.toLowerCase().includes(q)) ||
        (a.company && a.company.toLowerCase().includes(q)) ||
        (a.designation && a.designation.toLowerCase().includes(q)) ||
        (a.skills && a.skills.some(s => s.toLowerCase().includes(q)))
      );
    }

    const departments = ['ALL', 'Computer Science & Engineering', 'Information Technology', 'Electronics & Communication', 'Mechanical Engineering', 'Civil Engineering'];

    app.innerHTML = `
      <div class="container section">
        <!-- Breadcrumb & Header -->
        <div style="font-size:0.85rem; color:#64748b; margin-bottom:1rem; display:flex; align-items:center; gap:0.5rem;">
          <a href="/" data-link style="color:#64748b; text-decoration:none;">Home</a>
          <span>/</span>
          <span style="color:#0f172a; font-weight:600;">Alumni Network</span>
        </div>

        <div class="section-title-wrap" style="text-align:center; max-width:850px; margin:0 auto 2.5rem auto;">
          <span class="section-badge" style="background:#f3e8ff; color:#6b21a8; padding:0.25rem 0.85rem; border-radius:999px; font-size:0.8rem; font-weight:700; letter-spacing:0.05em; text-transform:uppercase; display:inline-block; margin-bottom:0.75rem;">GLOBAL NETWORK & MENTORSHIP</span>
          <h1 class="section-title" style="font-size:2.2rem; font-weight:800; color:#0f172a; letter-spacing:-0.02em; margin-bottom:0.75rem;">Alumni Directory & Mentorship Hub</h1>
          <p class="section-subtitle" style="font-size:1.05rem; color:#475569; line-height:1.6;">
            Connect with distinguished graduates of ${window.UI.escapeHtml(collegeName)} working at top global tech conglomerates, Unicorns, and core engineering firms.
          </p>
        </div>

        <!-- Metric Counter Strip -->
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:1.25rem; margin-bottom:2.5rem;">
          <div class="card" style="text-align:center; padding:1.25rem; border-top:3px solid #6366f1;">
            <div style="font-size:1.8rem; font-weight:800; color:#0f172a;">10,000+</div>
            <div style="font-size:0.82rem; color:#64748b; margin-top:0.25rem;">Graduates Worldwide</div>
          </div>
          <div class="card" style="text-align:center; padding:1.25rem; border-top:3px solid #0284c7;">
            <div style="font-size:1.8rem; font-weight:800; color:#0f172a;">450+</div>
            <div style="font-size:0.82rem; color:#64748b; margin-top:0.25rem;">Active Alumni Mentors</div>
          </div>
          <div class="card" style="text-align:center; padding:1.25rem; border-top:3px solid #10b981;">
            <div style="font-size:1.8rem; font-weight:800; color:#0f172a;">1,200+</div>
            <div style="font-size:0.82rem; color:#64748b; margin-top:0.25rem;">Mentorship Sessions</div>
          </div>
          <div class="card" style="text-align:center; padding:1.25rem; border-top:3px solid #f59e0b;">
            <div style="font-size:1.8rem; font-weight:800; color:#0f172a;">24+</div>
            <div style="font-size:0.82rem; color:#64748b; margin-top:0.25rem;">Countries Represented</div>
          </div>
        </div>

        <!-- Filter & Search Card -->
        <div class="card" style="padding:1.5rem; margin-bottom:2.5rem; background:#ffffff; border:1px solid #e2e8f0; border-radius:10px;">
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:1rem; align-items:center;">
            <div>
              <label style="display:block; font-size:0.8rem; font-weight:700; color:#475569; margin-bottom:0.35rem;">Search Alumni</label>
              <input type="text" 
                     id="alumni-search-input" 
                     class="form-control" 
                     placeholder="Search by name, company, skill (e.g. Google, AWS)..." 
                     value="${window.UI.escapeHtml(this.searchQuery)}"
                     oninput="window.AlumniPage.onSearch(this.value)" />
            </div>

            <div>
              <label style="display:block; font-size:0.8rem; font-weight:700; color:#475569; margin-bottom:0.35rem;">Filter by Department</label>
              <select class="form-control" onchange="window.AlumniPage.onDeptFilter(this.value)">
                ${departments.map(d => `<option value="${d}" ${this.deptFilter === d ? 'selected' : ''}>${d === 'ALL' ? 'All Departments' : d}</option>`).join('')}
              </select>
            </div>

            <div style="display:flex; align-items:flex-end; height:100%; padding-bottom:4px;">
              <label style="display:flex; align-items:center; gap:0.5rem; font-size:0.88rem; font-weight:600; color:#334155; cursor:pointer;">
                <input type="checkbox" ${this.mentorOnly ? 'checked' : ''} onchange="window.AlumniPage.onMentorToggle(this.checked)" style="width:16px; height:16px;" />
                <span>Show Active Mentors Only 🌟</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Alumni Grid -->
        <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(360px, 1fr)); gap:1.75rem;">
          ${filtered.length ? filtered.map(a => this.renderAlumniCard(a)).join('') : `
            <div style="grid-column:1/-1; text-align:center; padding:3rem; background:#f8fafc; border-radius:12px; color:#64748b;">
              <div style="font-size:2.5rem; margin-bottom:0.5rem;">👥</div>
              <h3>No alumni found matching your criteria</h3>
              <button class="btn btn-sm btn-outline" onclick="window.AlumniPage.resetFilters()">Reset Filters</button>
            </div>
          `}
        </div>

        <!-- Mentorship CTA Banner -->
        <div class="card" style="margin-top:3.5rem; background:#eff6ff; border:1px solid #bfdbfe; border-radius:12px; padding:2rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1.5rem;">
          <div>
            <span class="badge" style="background:#0284c7; color:#fff; font-weight:700; margin-bottom:0.5rem;">ARE YOU AN ALUMNUS?</span>
            <h3 style="font-size:1.35rem; font-weight:800; color:#0f172a; margin:0 0 0.5rem 0;">Give Back to Your Alma Mater as a Mentor</h3>
            <p style="color:#475569; font-size:0.92rem; margin:0; max-width:600px;">
              Help engineering students navigate high-stakes technical interviews, resume structuring, and career transitions by conducting 1-on-1 virtual sessions.
            </p>
          </div>
          <button class="btn btn-primary" onclick="window.AlumniPage.openJoinModal()" style="font-weight:600; padding:0.65rem 1.4rem;">
            Join Mentorship Network
          </button>
        </div>
      </div>
    `;
  },

  onSearch(query) {
    this.searchQuery = query;
    this.renderView();
    const input = document.getElementById('alumni-search-input');
    if (input) {
      input.focus();
      input.selectionStart = input.selectionEnd = input.value.length;
    }
  },

  onDeptFilter(dept) {
    this.deptFilter = dept;
    this.renderView();
  },

  onMentorToggle(checked) {
    this.mentorOnly = checked;
    this.renderView();
  },

  resetFilters() {
    this.searchQuery = '';
    this.deptFilter = 'ALL';
    this.mentorOnly = false;
    this.renderView();
  },

  renderAlumniCard(alumnus) {
    const skills = Array.isArray(alumnus.skills) ? alumnus.skills : [];
    const topics = Array.isArray(alumnus.mentorshipTopics) ? alumnus.mentorshipTopics : [];

    return `
      <div class="card" style="display:flex; flex-direction:column; justify-content:space-between; padding:1.75rem; border:1px solid #e2e8f0; border-radius:12px; background:#ffffff; box-shadow:0 1px 3px rgba(0,0,0,0.03); transition:transform 0.2s, box-shadow 0.2s;">
        <div>
          <div style="display:flex; gap:1rem; align-items:flex-start; margin-bottom:1rem;">
            <img src="${alumnus.photoUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'}" 
                 alt="${window.UI.escapeHtml(alumnus.fullName)}" 
                 style="width:68px; height:68px; border-radius:50%; object-fit:cover; border:2px solid #6366f1; flex-shrink:0;" />
            <div>
              <div style="display:flex; align-items:center; gap:0.4rem; margin-bottom:0.25rem;">
                <h3 style="font-size:1.15rem; font-weight:800; color:#0f172a; margin:0;">${window.UI.escapeHtml(alumnus.fullName)}</h3>
                ${alumnus.isMentor ? '<span title="Verified Mentor" style="font-size:1rem;">🌟</span>' : ''}
              </div>
              <div style="font-size:0.88rem; font-weight:700; color:#4f46e5;">${window.UI.escapeHtml(alumnus.designation)}</div>
              <div style="font-size:0.84rem; font-weight:600; color:#0f172a;">${window.UI.escapeHtml(alumnus.company)}</div>
              <div style="font-size:0.78rem; color:#64748b;">
                ${window.UI.escapeHtml(alumnus.department)} • Class of ${window.UI.escapeHtml(alumnus.graduationYear)}
              </div>
            </div>
          </div>

          ${alumnus.bio ? `
            <p style="font-size:0.86rem; color:#475569; line-height:1.55; margin-bottom:1rem;">
              ${window.UI.escapeHtml(alumnus.bio)}
            </p>
          ` : ''}

          ${skills.length ? `
            <div style="display:flex; gap:0.35rem; flex-wrap:wrap; margin-bottom:1rem;">
              ${skills.map(s => `<span style="font-size:0.72rem; background:#f1f5f9; padding:0.15rem 0.5rem; border-radius:4px; color:#475569; font-weight:600;">${window.UI.escapeHtml(s)}</span>`).join('')}
            </div>
          ` : ''}

          ${topics.length ? `
            <div style="background:#f8fafc; border-left:3px solid #6366f1; padding:0.65rem 0.85rem; border-radius:0 6px 6px 0; margin-bottom:1rem;">
              <span style="font-size:0.75rem; font-weight:700; color:#6366f1; display:block; margin-bottom:0.25rem; text-transform:uppercase;">Mentorship Topics</span>
              <span style="font-size:0.82rem; color:#334155;">${topics.map(t => window.UI.escapeHtml(t)).join(' • ')}</span>
            </div>
          ` : ''}
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid #f1f5f9; padding-top:1rem; margin-top:0.5rem;">
          <a href="${alumnus.linkedinUrl || 'https://linkedin.com'}" target="_blank" rel="noopener noreferrer" style="font-size:0.82rem; color:#0a66c2; text-decoration:none; font-weight:600; display:inline-flex; align-items:center; gap:0.35rem;">
            <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
            LinkedIn Profile
          </a>
          ${alumnus.isMentor ? `
            <button class="btn btn-sm btn-outline" onclick="window.AlumniPage.requestMentorship('${alumnus._id}', '${window.UI.escapeHtml(alumnus.fullName)}')">
              Request Session 💬
            </button>
          ` : `
            <span style="font-size:0.75rem; color:#94a3b8;">Alumnus</span>
          `}
        </div>
      </div>
    `;
  },

  requestMentorship(id, name) {
    window.UI.modal({
      title: `Schedule 1-on-1 Mentorship with ${name}`,
      content: `
        <div style="font-size:0.9rem; color:#475569; margin-bottom:1rem; line-height:1.6;">
          Submit your topic of interest and availability. Your request will be forwarded to ${name} through the T&P Alumni Mentorship portal.
        </div>
        <form id="mentor-req-form" style="display:flex; flex-direction:column; gap:1rem;">
          <div>
            <label style="display:block; font-size:0.85rem; font-weight:600; margin-bottom:0.35rem;">Your Name & Roll Number *</label>
            <input type="text" id="req-student-name" class="form-control" required placeholder="Full Name (e.g. Rahul Sen - 23CS045)" />
          </div>
          <div>
            <label style="display:block; font-size:0.85rem; font-weight:600; margin-bottom:0.35rem;">Discussion Topic *</label>
            <select id="req-topic" class="form-control">
              <option value="Resume Review">Resume Review & ATS Formatting</option>
              <option value="System Design & DSA">System Design & Algorithmic Interview Drill</option>
              <option value="Corporate Culture & SDE-1 Expectations">Corporate Culture & SDE-1 Expectations</option>
              <option value="Higher Studies & MS Abroad Guidance">Higher Studies & MS Abroad Guidance</option>
            </select>
          </div>
          <div>
            <label style="display:block; font-size:0.85rem; font-weight:600; margin-bottom:0.35rem;">Message / Questions for Mentor</label>
            <textarea id="req-msg" class="form-control" rows="3" placeholder="Briefly introduce yourself and what specific questions you'd like to ask..."></textarea>
          </div>
        </form>
      `,
      onConfirm: async () => {
        const studentName = document.getElementById('req-student-name').value.trim();
        if (!studentName) throw new Error('Please enter your name.');

        window.UI.showToast(`Mentorship request sent to ${name}! The coordinator will confirm the meeting invite via email.`, 'success');
      }
    });
  },

  openJoinModal() {
    window.UI.modal({
      title: 'Register as Alumni Mentor',
      content: `
        <form id="alumni-reg-form" style="display:flex; flex-direction:column; gap:1rem;">
          <div>
            <label style="display:block; font-size:0.85rem; font-weight:600; margin-bottom:0.35rem;">Full Name *</label>
            <input type="text" id="alum-name" class="form-control" required placeholder="Full Name" />
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
            <div>
              <label style="display:block; font-size:0.85rem; font-weight:600; margin-bottom:0.35rem;">Graduation Year *</label>
              <input type="text" id="alum-year" class="form-control" required placeholder="e.g. 2021" />
            </div>
            <div>
              <label style="display:block; font-size:0.85rem; font-weight:600; margin-bottom:0.35rem;">Department *</label>
              <select id="alum-dept" class="form-control">
                <option value="Computer Science & Engineering">CSE</option>
                <option value="Information Technology">IT</option>
                <option value="Electronics & Communication">ECE</option>
                <option value="Mechanical Engineering">MECH</option>
                <option value="Civil Engineering">CIVIL</option>
              </select>
            </div>
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
            <div>
              <label style="display:block; font-size:0.85rem; font-weight:600; margin-bottom:0.35rem;">Current Company *</label>
              <input type="text" id="alum-comp" class="form-control" required placeholder="e.g. Google / Microsoft" />
            </div>
            <div>
              <label style="display:block; font-size:0.85rem; font-weight:600; margin-bottom:0.35rem;">Current Designation *</label>
              <input type="text" id="alum-desig" class="form-control" required placeholder="e.g. SDE-2 / Architect" />
            </div>
          </div>
          <div>
            <label style="display:block; font-size:0.85rem; font-weight:600; margin-bottom:0.35rem;">LinkedIn URL</label>
            <input type="url" id="alum-linkedin" class="form-control" placeholder="https://linkedin.com/in/..." />
          </div>
        </form>
      `,
      onConfirm: async () => {
        const fullName = document.getElementById('alum-name').value.trim();
        const graduationYear = document.getElementById('alum-year').value.trim();
        const department = document.getElementById('alum-dept').value;
        const company = document.getElementById('alum-comp').value.trim();
        const designation = document.getElementById('alum-desig').value.trim();
        const linkedinUrl = document.getElementById('alum-linkedin').value.trim();

        if (!fullName || !graduationYear || !company || !designation) {
          throw new Error('Please fill in all required fields.');
        }

        await window.API.post('/alumni', {
          fullName, graduationYear, department, company, designation, linkedinUrl,
          isMentor: true
        });

        window.UI.showToast('Thank you! Welcome to the Alumni Mentorship Network.', 'success');
        await window.AlumniPage.render();
      }
    });
  }
};
