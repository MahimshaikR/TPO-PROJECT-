/**
 * TPO Connect — About T&P Cell View
 */
window.AboutPage = {
  async render() {
    const app = document.getElementById('app');
    app.innerHTML = '<div class="spinner"></div>';

    try {
      const settings = window.State?.getSettings() || await window.API.get('/settings/public');

      app.innerHTML = `
        <div class="container section">
          <div class="section-title-wrap">
            <span class="section-badge">INSTITUTIONAL EXCELLENCE</span>
            <h1 class="section-title">About Training & Placement Cell</h1>
            <p class="section-subtitle">${window.UI.escapeHtml(settings.collegeName || 'NRIIT ENGINEERING COLLEGE')}</p>
          </div>

          <!-- Vision & Mission Grid -->
          <div class="grid grid-cols-2" style="margin-bottom: 3.5rem;">
            <div class="card" style="border-top: 4px solid var(--primary);">
              <h2 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 1rem; color: var(--primary);">🎯 Our Vision</h2>
              <p style="color: var(--text-muted); line-height: 1.75; font-size: 1rem;">
                To emerge as a premier center of career development and placement excellence, transforming young engineers into highly competent, ethical, and versatile global technology leaders sought after by premier worldwide employers.
              </p>
            </div>
            <div class="card" style="border-top: 4px solid var(--accent);">
              <h2 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 1rem; color: var(--accent);">🚀 Our Mission</h2>
              <p style="color: var(--text-muted); line-height: 1.75; font-size: 1rem;">
                To continuously nurture technical innovation, algorithmic problem solving, and corporate communication skills through structured training, fostering strong bilateral corporate tie-ups, and delivering 100% placement conversion opportunities.
              </p>
            </div>
          </div>

          <!-- Placement Policy Overview -->
          <div class="card" style="margin-bottom: 3.5rem; padding: 2.5rem;">
            <h2 style="font-size: 1.65rem; font-weight: 800; margin-bottom: 1rem;">Campus Placement Policy & Code of Conduct</h2>
            <div style="color: var(--text-muted); line-height: 1.8; font-size: 0.95rem;">
              <p style="margin-bottom: 0.85rem;">
                1. <strong>Registration & Eligibility:</strong> Only students registered with the T&P Cell and fulfilling all academic attendance criteria (minimum 85% training attendance) are eligible to participate in on-campus recruitment drives.
              </p>
              <p style="margin-bottom: 0.85rem;">
                2. <strong>One Student, One Offer Policy:</strong> Once a student receives a verified offer, they are designated as placed. Students securing a Regular or Tier 2 offer remain eligible for "Dream" (>= 12 LPA) and "Super Dream" (>= 25 LPA) recruitment drives.
              </p>
              <p style="margin-bottom: 0.85rem;">
                3. <strong>Punctuality & Discipline:</strong> Strict corporate decorum, formal attire, and mandatory attendance for registered drives are compulsory. Unexcused absence results in debarment from subsequent campus drives.
              </p>
              <p>
                4. <strong>Direct Communication:</strong> Students are strictly prohibited from contacting corporate HR recruiters directly outside of the official T&P channel.
              </p>
            </div>
          </div>

          <!-- T&P Team -->
          <div class="section-title-wrap" style="text-align: left; margin-bottom: 2rem;">
            <span class="section-badge">OUR LEADERSHIP</span>
            <h2 class="section-title">Training & Placement Leadership</h2>
          </div>

          <div class="grid grid-cols-3">
            <div class="card" style="text-align:center;">
              <img src="${settings.officerPhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}" alt="${settings.officerName}" style="width:120px; height:120px; border-radius:50%; object-fit:cover; margin:0 auto 1rem auto; border:3px solid var(--border-color);">
              <h3 style="font-size:1.2rem; font-weight:800;">${window.UI.escapeHtml(settings.officerName || 'Dr. Rajesh Kumar')}</h3>
              <p style="color:var(--primary); font-weight:600; font-size:0.9rem; margin-bottom:0.5rem;">${window.UI.escapeHtml(settings.officerDesignation || 'Head - Training & Placement')}</p>
              <p style="font-size:0.85rem; color:var(--text-muted);">placements@nriit.edu.in</p>
            </div>

            <div class="card" style="text-align:center;">
              <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80" alt="Prof. Sunita Rao" style="width:120px; height:120px; border-radius:50%; object-fit:cover; margin:0 auto 1rem auto; border:3px solid var(--border-color);">
              <h3 style="font-size:1.2rem; font-weight:800;">Prof. Sunita Rao</h3>
              <p style="color:var(--primary); font-weight:600; font-size:0.9rem; margin-bottom:0.5rem;">Associate Placement Officer</p>
              <p style="font-size:0.85rem; color:var(--text-muted);">tpo.relations@nriit.edu.in</p>
            </div>

            <div class="card" style="text-align:center;">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80" alt="Prof. Vikram Verma" style="width:120px; height:120px; border-radius:50%; object-fit:cover; margin:0 auto 1rem auto; border:3px solid var(--border-color);">
              <h3 style="font-size:1.2rem; font-weight:800;">Prof. Vikram Verma</h3>
              <p style="color:var(--primary); font-weight:600; font-size:0.9rem; margin-bottom:0.5rem;">Lead Faculty Coordinator</p>
              <p style="font-size:0.85rem; color:var(--text-muted);">coordinator.cse@nriit.edu.in</p>
            </div>
          </div>
        </div>
      `;
    } catch (err) {
      console.error(err);
      app.innerHTML = `<div class="container section"><h3>Error loading about page: ${err.message}</h3></div>`;
    }
  }
};
