/**
 * TPO Connect — Hackathons & Technical Competitions Hub
 */
window.HackathonsPage = {
  activeStatus: 'ALL',
  hackathons: [],

  async render() {
    const app = document.getElementById('app');
    app.innerHTML = '<div class="spinner"></div>';

    try {
      const res = await window.API.get('/hackathons');
      this.hackathons = res.data || [];
      this.renderView();
    } catch (err) {
      app.innerHTML = `
        <div class="container section">
          <div class="empty-state">
            <div class="empty-state-icon">⚠️</div>
            <div class="empty-state-title">Unable to Load Hackathons</div>
            <p>${window.UI.escapeHtml(err.message)}</p>
            <button class="btn btn-primary" onclick="window.HackathonsPage.render()">Try Again</button>
          </div>
        </div>
      `;
    }
  },

  renderView() {
    const app = document.getElementById('app');
    const userRole = window.State?.getRole();
    const isAdmin = ['ADMIN', 'TP_OFFICER', 'SUPER_ADMIN'].includes(userRole);

    let filtered = this.hackathons;
    if (this.activeStatus !== 'ALL') {
      filtered = filtered.filter(h => h.status === this.activeStatus);
    }

    const activeCount = this.hackathons.filter(h => h.status === 'ACTIVE').length;
    const upcomingCount = this.hackathons.filter(h => h.status === 'UPCOMING').length;
    const completedCount = this.hackathons.filter(h => h.status === 'COMPLETED').length;

    app.innerHTML = `
      <div class="container section">
        <!-- Breadcrumb & Header -->
        <div style="font-size:0.85rem; color:#64748b; margin-bottom:1rem; display:flex; align-items:center; gap:0.5rem;">
          <a href="/" data-link style="color:#64748b; text-decoration:none;">Home</a>
          <span>/</span>
          <span style="color:#0f172a; font-weight:600;">Hackathons & Competitions</span>
        </div>

        <div class="section-title-wrap" style="text-align:center; max-width:850px; margin:0 auto 2.5rem auto;">
          <span class="section-badge" style="background:#fce7f3; color:#9d174d; padding:0.25rem 0.85rem; border-radius:999px; font-size:0.8rem; font-weight:700; letter-spacing:0.05em; text-transform:uppercase; display:inline-block; margin-bottom:0.75rem;">INNOVATION & COMPETITIVE CODING</span>
          <h1 class="section-title" style="font-size:2.2rem; font-weight:800; color:#0f172a; letter-spacing:-0.02em; margin-bottom:0.75rem;">Hackathons & Collegiate Challenges</h1>
          <p class="section-subtitle" style="font-size:1.05rem; color:#475569; line-height:1.6;">
            Participate in premier national hackathons, enterprise innovation challenges, and algorithmic contests to earn prize grants and direct pre-placement interview (PPI) fast-tracks.
          </p>
        </div>

        <!-- Filter & Header Actions -->
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem; margin-bottom:2rem;">
          <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
            <button class="btn btn-sm ${this.activeStatus === 'ALL' ? 'btn-primary' : 'btn-outline'}" onclick="window.HackathonsPage.filterStatus('ALL')">All Challenges (${this.hackathons.length})</button>
            <button class="btn btn-sm ${this.activeStatus === 'ACTIVE' ? 'btn-primary' : 'btn-outline'}" onclick="window.HackathonsPage.filterStatus('ACTIVE')">🔥 Live Now (${activeCount})</button>
            <button class="btn btn-sm ${this.activeStatus === 'UPCOMING' ? 'btn-primary' : 'btn-outline'}" onclick="window.HackathonsPage.filterStatus('UPCOMING')">📅 Upcoming (${upcomingCount})</button>
            <button class="btn btn-sm ${this.activeStatus === 'COMPLETED' ? 'btn-primary' : 'btn-outline'}" onclick="window.HackathonsPage.filterStatus('COMPLETED')">🏆 Hall of Fame (${completedCount})</button>
          </div>
          ${isAdmin ? `
            <button class="btn btn-sm btn-primary" onclick="window.HackathonsPage.openCreateModal()" style="font-weight:600;">
              ➕ Announce Hackathon
            </button>
          ` : ''}
        </div>

        <!-- Hackathons List Grid -->
        <div style="display:flex; flex-direction:column; gap:2rem;">
          ${filtered.length ? filtered.map(h => this.renderHackathonCard(h)).join('') : `
            <div style="text-align:center; padding:3rem; background:#f8fafc; border-radius:12px; color:#64748b;">
              <div style="font-size:2.5rem; margin-bottom:0.5rem;">💡</div>
              <h3>No hackathons currently in this stage</h3>
              <button class="btn btn-sm btn-outline" onclick="window.HackathonsPage.filterStatus('ALL')">View All</button>
            </div>
          `}
        </div>
      </div>
    `;
  },

  filterStatus(status) {
    this.activeStatus = status;
    this.renderView();
  },

  renderHackathonCard(hack) {
    const isLive = hack.status === 'ACTIVE';
    const isUpcoming = hack.status === 'UPCOMING';
    const isCompleted = hack.status === 'COMPLETED';

    const statusBadge = isLive 
      ? '<span class="badge" style="background:#fee2e2; color:#b91c1c; font-weight:700; animation:pulse 2s infinite;">🔴 REGISTRATIONS OPEN</span>'
      : isUpcoming 
      ? '<span class="badge" style="background:#e0f2fe; color:#0369a1; font-weight:700;">📅 UPCOMING</span>'
      : '<span class="badge" style="background:#f1f5f9; color:#475569; font-weight:700;">🏁 CONCLUDED</span>';

    const statements = Array.isArray(hack.problemStatements) ? hack.problemStatements : [];
    const winners = Array.isArray(hack.winners) ? hack.winners : [];

    return `
      <div class="card" style="padding:0; overflow:hidden; border:1px solid #e2e8f0; border-radius:12px; background:#ffffff; box-shadow:0 2px 6px rgba(0,0,0,0.04);">
        <div style="display:grid; grid-template-columns:340px 1fr; @media(max-width:850px){grid-template-columns:1fr;}">
          <!-- Banner Image & Quick Stats -->
          <div style="position:relative; min-height:220px; background:#0f172a;">
            <img src="${hack.bannerUrl || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80'}" 
                 alt="${window.UI.escapeHtml(hack.title)}" 
                 style="width:100%; height:100%; object-fit:cover; opacity:0.85;" />
            <div style="position:absolute; inset:0; background:linear-gradient(to top, rgba(15,23,42,0.9) 0%, rgba(15,23,42,0.2) 100%);"></div>
            
            <div style="position:absolute; bottom:1.25rem; left:1.25rem; right:1.25rem; color:#ffffff;">
              <div style="font-size:0.75rem; text-transform:uppercase; letter-spacing:0.08em; color:#93c5fd; font-weight:700; margin-bottom:0.25rem;">${window.UI.escapeHtml(hack.category || 'Coding')}</div>
              <div style="font-size:1.1rem; font-weight:800; line-height:1.3; margin-bottom:0.5rem;">${window.UI.escapeHtml(hack.organizer || 'T&P Innovation Hub')}</div>
              <div style="font-size:0.85rem; color:#cbd5e1; display:flex; gap:0.75rem; flex-wrap:wrap;">
                <span>👥 Team: ${hack.teamSizeMin || 1} - ${hack.teamSizeMax || 4}</span>
                <span>📍 ${window.UI.escapeHtml(hack.mode || 'Online')}</span>
              </div>
            </div>
          </div>

          <!-- Body & Details -->
          <div style="padding:2rem; display:flex; flex-direction:column; justify-content:space-between;">
            <div>
              <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.75rem; flex-wrap:wrap; gap:0.5rem;">
                ${statusBadge}
                ${hack.prizePool ? `
                  <div style="background:#fef3c7; color:#92400e; padding:0.25rem 0.75rem; border-radius:6px; font-weight:700; font-size:0.85rem;">
                    🏆 Prize Pool: ${window.UI.escapeHtml(hack.prizePool)}
                  </div>
                ` : ''}
              </div>

              <h2 style="font-size:1.35rem; font-weight:800; color:#0f172a; margin:0 0 0.5rem 0; line-height:1.35;">
                ${window.UI.escapeHtml(hack.title)}
              </h2>

              <p style="font-size:0.92rem; color:#475569; line-height:1.6; margin-bottom:1.25rem;">
                ${window.UI.escapeHtml(hack.description || '')}
              </p>

              <!-- Key Dates Grid -->
              <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:0.85rem 1.25rem; display:grid; grid-template-columns:repeat(auto-fit, minmax(140px, 1fr)); gap:0.75rem; margin-bottom:1.25rem; font-size:0.82rem;">
                <div>
                  <span style="color:#64748b; display:block;">Start Date</span>
                  <strong style="color:#0f172a;">${hack.startDate || 'TBA'}</strong>
                </div>
                <div>
                  <span style="color:#64748b; display:block;">End Date</span>
                  <strong style="color:#0f172a;">${hack.endDate || 'TBA'}</strong>
                </div>
                <div>
                  <span style="color:#64748b; display:block;">Reg. Deadline</span>
                  <strong style="color:#b91c1c;">${hack.registrationDeadline || 'Closing Soon'}</strong>
                </div>
                <div>
                  <span style="color:#64748b; display:block;">Registered Teams</span>
                  <strong style="color:#0284c7;">${hack.registeredTeamsCount || 0} Teams</strong>
                </div>
              </div>

              <!-- Problem Statements Preview -->
              ${statements.length ? `
                <div style="margin-bottom:1.25rem;">
                  <span style="font-size:0.8rem; font-weight:700; color:#334155; text-transform:uppercase; letter-spacing:0.04em; display:block; margin-bottom:0.4rem;">Sample Problem Statements:</span>
                  <ul style="margin:0; padding-left:1.2rem; font-size:0.86rem; color:#475569; line-height:1.5;">
                    ${statements.slice(0, 2).map(s => `<li>${window.UI.escapeHtml(s)}</li>`).join('')}
                    ${statements.length > 2 ? `<li style="color:#0284c7; font-weight:600;">+ ${statements.length - 2} more problem statements</li>` : ''}
                  </ul>
                </div>
              ` : ''}

              <!-- Winners Section if Completed -->
              ${isCompleted && winners.length ? `
                <div style="background:#ecfdf5; border:1px solid #a7f3d0; border-radius:8px; padding:1rem; margin-bottom:1.25rem;">
                  <strong style="color:#047857; font-size:0.85rem; display:block; margin-bottom:0.5rem;">🏆 Hall of Fame Winners:</strong>
                  <div style="display:flex; flex-direction:column; gap:0.4rem;">
                    ${winners.map(w => `
                      <div style="display:flex; align-items:center; gap:0.5rem; font-size:0.84rem;">
                        <span class="badge" style="background:#047857; color:#fff; font-size:0.75rem;">Rank #${w.rank}</span>
                        <strong>${window.UI.escapeHtml(w.teamName)}</strong>
                        <span style="color:#64748b;">— ${window.UI.escapeHtml(w.projectTitle)}</span>
                      </div>
                    `).join('')}
                  </div>
                </div>
              ` : ''}
            </div>

            <!-- Footer Action Row -->
            <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid #f1f5f9; padding-top:1rem; margin-top:0.5rem; flex-wrap:wrap; gap:0.75rem;">
              <span style="font-size:0.82rem; color:#64748b;">
                Eligibility: <strong>${window.UI.escapeHtml(hack.eligibility || 'All Students')}</strong>
              </span>

              <div style="display:flex; gap:0.5rem;">
                ${!isCompleted ? `
                  <button class="btn btn-primary" onclick="window.HackathonsPage.openRegisterModal('${hack._id}', '${window.UI.escapeHtml(hack.title)}', ${hack.teamSizeMin || 1}, ${hack.teamSizeMax || 4})" style="font-weight:600; padding:0.5rem 1.25rem;">
                    🚀 Register Team Now
                  </button>
                ` : `
                  <button class="btn btn-outline btn-sm" disabled style="opacity:0.7;">Challenge Concluded</button>
                `}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  openRegisterModal(id, title, minSize, maxSize) {
    const isAuth = window.State?.isAuthenticated();
    if (!isAuth) {
      window.UI.modal({
        title: 'Authentication Required',
        content: `
          <p style="color:#475569; font-size:0.95rem; line-height:1.6;">
            Please log in with your student account to register your team for <strong>${title}</strong>.
          </p>
        `,
        footer: `
          <button class="btn btn-secondary btn-sm" onclick="window.UI.closeModal()">Close</button>
          <a href="/student/login" class="btn btn-primary btn-sm" data-link onclick="window.UI.closeModal()">Student Login</a>
        `
      });
      return;
    }

    window.UI.modal({
      title: `Team Registration — ${title}`,
      content: `
        <div style="font-size:0.88rem; color:#475569; margin-bottom:1rem;">
          Team Size Requirements: <strong>${minSize} to ${maxSize} members</strong>. All team members must be enrolled students.
        </div>
        <form id="team-reg-form" style="display:flex; flex-direction:column; gap:1rem;">
          <div>
            <label style="display:block; font-size:0.85rem; font-weight:600; margin-bottom:0.35rem;">Team Name *</label>
            <input type="text" id="reg-team-name" class="form-control" required placeholder="e.g. AlgoWarriors / CodeCraft" />
          </div>
          <div>
            <label style="display:block; font-size:0.85rem; font-weight:600; margin-bottom:0.35rem;">Team Leader (Name & Roll Number) *</label>
            <input type="text" id="reg-leader" class="form-control" required placeholder="Full Name - Roll No" />
          </div>
          <div>
            <label style="display:block; font-size:0.85rem; font-weight:600; margin-bottom:0.35rem;">Team Members (Names & Branches, comma-separated) *</label>
            <textarea id="reg-members" class="form-control" rows="3" required placeholder="Member 1 (CSE), Member 2 (IT)..."></textarea>
          </div>
          <div>
            <label style="display:block; font-size:0.85rem; font-weight:600; margin-bottom:0.35rem;">Preferred Problem Statement / Track</label>
            <input type="text" id="reg-track" class="form-control" placeholder="e.g. AI / Smart Logistics / Web3" />
          </div>
        </form>
      `,
      onConfirm: async () => {
        const teamName = document.getElementById('reg-team-name').value.trim();
        const leader = document.getElementById('reg-leader').value.trim();
        const members = document.getElementById('reg-members').value.trim();

        if (!teamName || !leader || !members) {
          throw new Error('Please fill in team name, leader, and members.');
        }

        await window.API.post(`/hackathons/${id}/register`, {
          teamName, leader, members
        });

        window.UI.showToast(`Congratulations! Team "${teamName}" has been successfully registered.`, 'success');
        await window.HackathonsPage.render();
      }
    });
  },

  openCreateModal() {
    window.UI.modal({
      title: 'Announce New Hackathon or Competition',
      content: `
        <form id="create-hack-form" style="display:flex; flex-direction:column; gap:1rem;">
          <div>
            <label style="display:block; font-size:0.85rem; font-weight:600; margin-bottom:0.35rem;">Challenge Title *</label>
            <input type="text" id="hack-title" class="form-control" required placeholder="Title" />
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
            <div>
              <label style="display:block; font-size:0.85rem; font-weight:600; margin-bottom:0.35rem;">Organizer *</label>
              <input type="text" id="hack-org" class="form-control" required placeholder="Organizer" />
            </div>
            <div>
              <label style="display:block; font-size:0.85rem; font-weight:600; margin-bottom:0.35rem;">Prize Pool</label>
              <input type="text" id="hack-prize" class="form-control" placeholder="e.g. ₹ 1,00,000" />
            </div>
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:0.75rem;">
            <div>
              <label style="display:block; font-size:0.85rem; font-weight:600; margin-bottom:0.35rem;">Start Date *</label>
              <input type="date" id="hack-start" class="form-control" required />
            </div>
            <div>
              <label style="display:block; font-size:0.85rem; font-weight:600; margin-bottom:0.35rem;">End Date *</label>
              <input type="date" id="hack-end" class="form-control" required />
            </div>
            <div>
              <label style="display:block; font-size:0.85rem; font-weight:600; margin-bottom:0.35rem;">Reg. Deadline *</label>
              <input type="date" id="hack-deadline" class="form-control" required />
            </div>
          </div>
          <div>
            <label style="display:block; font-size:0.85rem; font-weight:600; margin-bottom:0.35rem;">Description *</label>
            <textarea id="hack-desc" class="form-control" rows="3" required></textarea>
          </div>
        </form>
      `,
      onConfirm: async () => {
        const title = document.getElementById('hack-title').value.trim();
        const organizer = document.getElementById('hack-org').value.trim();
        const prizePool = document.getElementById('hack-prize').value.trim();
        const startDate = document.getElementById('hack-start').value;
        const endDate = document.getElementById('hack-end').value;
        const registrationDeadline = document.getElementById('hack-deadline').value;
        const description = document.getElementById('hack-desc').value.trim();

        if (!title || !startDate || !registrationDeadline) {
          throw new Error('Please fill all mandatory fields.');
        }

        await window.API.post('/hackathons', {
          title, organizer, prizePool, startDate, endDate, registrationDeadline, description,
          status: 'ACTIVE'
        });

        window.UI.showToast('Hackathon announced successfully!', 'success');
        await window.HackathonsPage.render();
      }
    });
  }
};
