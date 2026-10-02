/**
 * TPO Connect — Achievements & Hall of Fame View
 */
window.AchievementsPage = {
  async render() {
    const app = document.getElementById('app');
    app.innerHTML = '<div class="spinner"></div>';

    try {
      const achievements = await window.API.get('/achievements');

      app.innerHTML = `
        <div class="container section">
          <div class="section-title-wrap">
            <span class="section-badge">HALL OF FAME</span>
            <h1 class="section-title">Student Placement Milestones</h1>
            <p class="section-subtitle">Honoring exceptional achievements and landmark package offers across global technology giants.</p>
          </div>

          <div class="grid grid-cols-3">
            ${achievements.length === 0 ? '<p style="grid-column:1/-1; text-align:center;">No achievements published yet.</p>' : ''}
            ${achievements.map(ach => `
              <div class="card" style="display:flex; flex-direction:column; align-items:center; text-align:center; position:relative; overflow:hidden;">
                <span class="badge badge-warning" style="position:absolute; top:1rem; right:1rem;">${ach.badge || 'Super Dream'}</span>
                <img src="${ach.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}" alt="${ach.studentName}" style="width:108px; height:108px; border-radius:50%; object-fit:cover; margin-bottom:1rem; border:3px solid var(--border-color);">
                <h3 style="font-size:1.25rem; font-weight:800; color:var(--text-main); margin-bottom:0.25rem;">${window.UI.escapeHtml(ach.studentName)}</h3>
                <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:0.85rem;">Roll: ${ach.rollNumber} | ${ach.branch} | Class of ${ach.batch}</p>
                <div style="background:var(--primary-light); padding:0.75rem 1rem; border-radius:var(--radius-md); width:100%; margin-bottom:0.5rem;">
                  <div style="font-weight:700; color:var(--primary); font-size:1.1rem; margin-bottom:0.25rem;">${window.UI.escapeHtml(ach.companyName)}</div>
                  <div style="font-size:0.9rem; color:var(--text-muted); margin-bottom:0.25rem;">${window.UI.escapeHtml(ach.role || 'Software Engineer')}</div>
                  <div style="font-weight:800; color:var(--success); font-size:1.35rem;">₹${ach.packageLpa} LPA</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    } catch (err) {
      console.error(err);
      app.innerHTML = `<div class="container section">Error: ${err.message}</div>`;
    }
  }
};
