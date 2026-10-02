/**
 * TPO Connect — Training Detail & Syllabus Page
 */
window.TrainingDetailPage = {
  async render(params) {
    const app = document.getElementById('app');
    app.innerHTML = '<div class="spinner"></div>';

    try {
      const trainingId = (typeof params === 'object' && params !== null) ? (params.id || params._id) : params;
      const training = await window.API.get(`/training/${trainingId}`);
      const sessions = training.sessions || [];

      app.innerHTML = `
        <div class="container section">
          <div style="margin-bottom: 1.5rem;">
            <a href="/training" class="btn btn-outline btn-sm" data-link>&larr; Back to Training Programs</a>
          </div>

          <div class="card" style="margin-bottom: 2rem;">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1rem; flex-wrap:wrap; gap:1rem;">
              <div>
                <span class="badge badge-primary">${training.category}</span>
                <h1 style="font-size:2rem; font-weight:800; margin-top:0.5rem; color:var(--text-main);">${window.UI.escapeHtml(training.title)}</h1>
                <p style="font-size:1.05rem; color:var(--primary); font-weight:700;">Code: ${training.code} | Lead Trainer: ${window.UI.escapeHtml(training.instructor)}</p>
              </div>
              <span class="badge badge-success">${training.status}</span>
            </div>

            <div class="grid grid-cols-4" style="background:var(--bg-subtle); padding:1.25rem; border-radius:var(--radius-md); margin-bottom:1.5rem;">
              <div>
                <span style="font-size:0.8rem; color:var(--text-muted); font-weight:600;">TIMELINE</span>
                <div style="font-weight:700; font-size:0.95rem;">${window.UI.formatDate(training.startDate)} to ${window.UI.formatDate(training.endDate)}</div>
              </div>
              <div>
                <span style="font-size:0.8rem; color:var(--text-muted); font-weight:600;">HOURS</span>
                <div style="font-weight:800; font-size:1.15rem; color:var(--accent);">${training.totalHours || 30} Hrs</div>
              </div>
              <div>
                <span style="font-size:0.8rem; color:var(--text-muted); font-weight:600;">TARGET BRANCHES</span>
                <div style="font-weight:700; font-size:0.95rem;">${(training.targetBranches || []).join(', ') || 'All'}</div>
              </div>
              <div>
                <span style="font-size:0.8rem; color:var(--text-muted); font-weight:600;">VENUE / LAB</span>
                <div style="font-weight:700; font-size:0.95rem;">${window.UI.escapeHtml(training.venue || 'Campus Lab')}</div>
              </div>
            </div>

            <div style="margin-bottom:1.5rem;">
              <h3 style="font-size:1.2rem; font-weight:700; margin-bottom:0.5rem;">Program Description & Outcomes</h3>
              <p style="color:var(--text-muted); line-height:1.7;">${window.UI.escapeHtml(training.description || 'Comprehensive training curriculum designed to maximize student placement conversion rates.')}</p>
            </div>

            <div style="margin-bottom:1.5rem;">
              <h3 style="font-size:1.2rem; font-weight:700; margin-bottom:0.75rem;">Detailed Syllabus & Modules</h3>
              <div style="display:flex; flex-direction:column; gap:0.5rem;">
                ${(training.syllabus || []).map((mod, idx) => `
                  <div style="background:var(--bg-subtle); padding:0.85rem 1rem; border-radius:var(--radius-md); font-weight:600; font-size:0.92rem; border-left:3px solid var(--primary);">
                    ${window.UI.escapeHtml(mod)}
                  </div>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- Sessions Schedule Table -->
          <div class="card">
            <h2 style="font-size:1.35rem; font-weight:800; margin-bottom:1.25rem;">Scheduled Classroom & Lab Sessions</h2>
            ${sessions.length === 0 ? '<p style="color:var(--text-muted);">Session dates will be updated by program coordinator.</p>' : `
              <div class="table-responsive">
                <table class="data-table">
                  <thead>
                    <tr>
                      <th>Session</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Topic Covered</th>
                      <th>Location</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${sessions.map(s => `
                      <tr>
                        <td><strong>${window.UI.escapeHtml(s.title)}</strong></td>
                        <td>${window.UI.formatDate(s.sessionDate)}</td>
                        <td>${s.startTime} - ${s.endTime}</td>
                        <td>${window.UI.escapeHtml(s.topic || 'Hands-on practice')}</td>
                        <td>${window.UI.escapeHtml(s.venue || training.venue)}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            `}
          </div>
        </div>
      `;
    } catch (err) {
      console.error(err);
      app.innerHTML = `<div class="container section"><h3>Error loading training details: ${err.message}</h3></div>`;
    }
  }
};
