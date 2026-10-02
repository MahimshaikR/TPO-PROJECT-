/**
 * TPO Connect — Training & Placement Cell Team Directory
 */
window.TeamPage = {
  activeFilter: 'ALL',
  teamMembers: [],

  async render() {
    const app = document.getElementById('app');
    app.innerHTML = '<div class="spinner"></div>';

    try {
      const res = await window.API.get('/team');
      this.teamMembers = res.data || [];

      this.renderView();
    } catch (err) {
      app.innerHTML = `
        <div class="container section">
          <div class="empty-state">
            <div class="empty-state-icon">⚠️</div>
            <div class="empty-state-title">Unable to Load Team Directory</div>
            <p>${window.UI.escapeHtml(err.message)}</p>
            <button class="btn btn-primary" onclick="window.TeamPage.render()">Try Again</button>
          </div>
        </div>
      `;
    }
  },

  renderView() {
    const app = document.getElementById('app');
    const settings = window.State?.getSettings() || {};
    const collegeName = settings.collegeName || 'NRIIT ENGINEERING COLLEGE';

    const leadership = this.teamMembers.filter(m => m.role === 'HEAD' || m.role === 'OFFICER');
    const deptCoords = this.teamMembers.filter(m => m.role === 'DEPT_COORDINATOR');
    const studentReps = this.teamMembers.filter(m => m.role === 'STUDENT_REP');

    app.innerHTML = `
      <div class="container section">
        <!-- Breadcrumb & Header -->
        <div style="font-size:0.85rem; color:#64748b; margin-bottom:1rem; display:flex; align-items:center; gap:0.5rem;">
          <a href="/" data-link style="color:#64748b; text-decoration:none;">Home</a>
          <span>/</span>
          <span style="color:#0f172a; font-weight:600;">T&P Team</span>
        </div>

        <div class="section-title-wrap" style="text-align:center; max-width:850px; margin:0 auto 2.5rem auto;">
          <span class="section-badge" style="background:#e0f2fe; color:#0369a1; padding:0.25rem 0.85rem; border-radius:999px; font-size:0.8rem; font-weight:700; letter-spacing:0.05em; text-transform:uppercase; display:inline-block; margin-bottom:0.75rem;">FACULTY & STUDENT EXCELLENCE</span>
          <h1 class="section-title" style="font-size:2.2rem; font-weight:800; color:#0f172a; letter-spacing:-0.02em; margin-bottom:0.75rem;">Training & Placement Team</h1>
          <p class="section-subtitle" style="font-size:1.05rem; color:#475569; line-height:1.6;">
            The dedicated team of officers, departmental faculty coordinators, and student placement representatives driving industry partnerships and student career success at ${window.UI.escapeHtml(collegeName)}.
          </p>
        </div>

        <!-- Filter Bar -->
        <div style="display:flex; justify-content:center; gap:0.5rem; flex-wrap:wrap; margin-bottom:2.5rem;">
          <button class="btn btn-sm ${this.activeFilter === 'ALL' ? 'btn-primary' : 'btn-outline'}" onclick="window.TeamPage.filter('ALL')">All Members (${this.teamMembers.length})</button>
          <button class="btn btn-sm ${this.activeFilter === 'LEADERSHIP' ? 'btn-primary' : 'btn-outline'}" onclick="window.TeamPage.filter('LEADERSHIP')">Officers & Leadership (${leadership.length})</button>
          <button class="btn btn-sm ${this.activeFilter === 'DEPT' ? 'btn-primary' : 'btn-outline'}" onclick="window.TeamPage.filter('DEPT')">Department Coordinators (${deptCoords.length})</button>
          <button class="btn btn-sm ${this.activeFilter === 'STUDENT' ? 'btn-primary' : 'btn-outline'}" onclick="window.TeamPage.filter('STUDENT')">Student SPOCs (${studentReps.length})</button>
        </div>

        <!-- Team Display Container -->
        <div id="team-cards-container">
          ${this.renderTeamSections(leadership, deptCoords, studentReps)}
        </div>

        <!-- Contact T&P Banner -->
        <div class="card" style="margin-top:3.5rem; background:linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color:#ffffff; padding:2.5rem; border-radius:12px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1.5rem; border:none;">
          <div>
            <h3 style="font-size:1.4rem; font-weight:800; margin-bottom:0.5rem; color:#ffffff;">Have an Inquiry or Looking to Host a Campus Drive?</h3>
            <p style="color:#94a3b8; font-size:0.95rem; margin:0; max-width:620px;">
              Our placement officers and department coordinators are available for recruiter engagements, student queries, and industry collaborations.
            </p>
          </div>
          <div style="display:flex; gap:0.75rem;">
            <a href="/contact" class="btn btn-primary" data-link style="background:#0284c7; color:#fff; border:none; padding:0.6rem 1.4rem; font-weight:600;">Contact T&P Office</a>
            <a href="/recruit-with-us" class="btn btn-outline" data-link style="border:1.5px solid #ffffff; color:#ffffff; padding:0.6rem 1.4rem; font-weight:600;">Recruit With Us</a>
          </div>
        </div>
      </div>
    `;
  },

  filter(type) {
    this.activeFilter = type;
    this.renderView();
  },

  renderTeamSections(leadership, deptCoords, studentReps) {
    let html = '';

    if (this.activeFilter === 'ALL' || this.activeFilter === 'LEADERSHIP') {
      html += `
        <div style="margin-bottom:3rem;">
          <div style="display:flex; align-items:center; gap:0.75rem; margin-bottom:1.5rem; border-bottom:2px solid #e2e8f0; padding-bottom:0.75rem;">
            <span style="font-size:1.35rem;">🏛️</span>
            <h2 style="font-size:1.35rem; font-weight:800; color:#0f172a; margin:0;">T&P Directorate & Officers</h2>
          </div>
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(360px, 1fr)); gap:1.5rem;">
            ${leadership.map(m => this.renderMemberCard(m, true)).join('')}
          </div>
        </div>
      `;
    }

    if (this.activeFilter === 'ALL' || this.activeFilter === 'DEPT') {
      html += `
        <div style="margin-bottom:3rem;">
          <div style="display:flex; align-items:center; gap:0.75rem; margin-bottom:1.5rem; border-bottom:2px solid #e2e8f0; padding-bottom:0.75rem;">
            <span style="font-size:1.35rem;">👨‍🏫</span>
            <h2 style="font-size:1.35rem; font-weight:800; color:#0f172a; margin:0;">Department-Wise Faculty Coordinators</h2>
          </div>
          <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(320px, 1fr)); gap:1.5rem;">
            ${deptCoords.map(m => this.renderMemberCard(m, false)).join('')}
          </div>
        </div>
      `;
    }

    if (this.activeFilter === 'ALL' || this.activeFilter === 'STUDENT') {
      html += `
        <div style="margin-bottom:2rem;">
          <div style="display:flex; align-items:center; gap:0.75rem; margin-bottom:1.5rem; border-bottom:2px solid #e2e8f0; padding-bottom:0.75rem;">
            <span style="font-size:1.35rem;">🎓</span>
            <h2 style="font-size:1.35rem; font-weight:800; color:#0f172a; margin:0;">Lead Student Placement Representatives (SPOCs)</h2>
          </div>
          <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(320px, 1fr)); gap:1.5rem;">
            ${studentReps.map(m => this.renderMemberCard(m, false)).join('')}
          </div>
        </div>
      `;
    }

    return html;
  },

  renderMemberCard(member, isLead = false) {
    const roleBadge = member.role === 'HEAD' 
      ? '<span class="badge" style="background:#fef3c7; color:#92400e; font-weight:700;">Dean / Head T&P</span>'
      : member.role === 'OFFICER'
      ? '<span class="badge" style="background:#e0f2fe; color:#0369a1; font-weight:700;">Placement Officer</span>'
      : member.role === 'DEPT_COORDINATOR'
      ? `<span class="badge" style="background:#f1f5f9; color:#334155; font-weight:600;">${window.UI.escapeHtml(member.department)}</span>`
      : '<span class="badge" style="background:#ecfdf5; color:#047857; font-weight:600;">Student SPOC</span>';

    return `
      <div class="card" style="display:flex; flex-direction:column; justify-content:space-between; padding:1.5rem; border:1px solid #e2e8f0; border-radius:10px; transition:transform 0.2s, box-shadow 0.2s; background:#ffffff;">
        <div>
          <div style="display:flex; gap:1.25rem; align-items:flex-start; margin-bottom:1.25rem;">
            <img src="${member.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}" 
                 alt="${window.UI.escapeHtml(member.name)}" 
                 style="width:${isLead ? '88px' : '72px'}; height:${isLead ? '88px' : '72px'}; border-radius:50%; object-fit:cover; border:2.5px solid #0284c7; flex-shrink:0; box-shadow:0 2px 8px rgba(0,0,0,0.08);" />
            <div>
              <div style="margin-bottom:0.35rem;">${roleBadge}</div>
              <h3 style="font-size:1.15rem; font-weight:800; color:#0f172a; margin:0 0 0.25rem 0;">${window.UI.escapeHtml(member.name)}</h3>
              <p style="font-size:0.86rem; font-weight:600; color:#0284c7; margin:0 0 0.25rem 0;">${window.UI.escapeHtml(member.position)}</p>
              <p style="font-size:0.8rem; color:#64748b; margin:0;">${window.UI.escapeHtml(member.department)}</p>
            </div>
          </div>

          ${member.bio ? `
            <p style="font-size:0.88rem; color:#475569; line-height:1.6; margin-bottom:1rem; border-left:3px solid #0284c7; padding-left:0.75rem;">
              ${window.UI.escapeHtml(member.bio)}
            </p>
          ` : ''}

          <div style="background:#f8fafc; border-radius:8px; padding:0.85rem; font-size:0.82rem; color:#334155; margin-bottom:1rem; display:flex; flex-direction:column; gap:0.4rem;">
            ${member.email ? `
              <div style="display:flex; align-items:center; gap:0.5rem; word-break:break-all;">
                <span>✉️</span>
                <a href="mailto:${window.UI.escapeHtml(member.email)}" style="color:#0284c7; text-decoration:none;">${window.UI.escapeHtml(member.email)}</a>
              </div>
            ` : ''}
            ${member.phone ? `
              <div style="display:flex; align-items:center; gap:0.5rem;">
                <span>📞</span>
                <span>${window.UI.escapeHtml(member.phone)}</span>
              </div>
            ` : ''}
            ${member.officeHours ? `
              <div style="display:flex; align-items:center; gap:0.5rem; color:#64748b;">
                <span>🕒</span>
                <span><strong>Office Hours:</strong> ${window.UI.escapeHtml(member.officeHours)}</span>
              </div>
            ` : ''}
          </div>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid #f1f5f9; padding-top:0.75rem; margin-top:0.5rem;">
          <a href="${member.linkedin || 'https://linkedin.com'}" target="_blank" rel="noopener noreferrer" style="font-size:0.82rem; color:#0a66c2; text-decoration:none; display:inline-flex; align-items:center; gap:0.35rem; font-weight:600;">
            <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
            Connect on LinkedIn
          </a>
          <span style="font-size:0.75rem; color:#94a3b8;">Official Directory</span>
        </div>
      </div>
    `;
  }
};
