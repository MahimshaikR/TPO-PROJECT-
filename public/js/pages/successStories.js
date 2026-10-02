/**
 * TPO Connect — Alumni Success Stories & Testimonials View
 */
window.SuccessStoriesPage = {
  async render() {
    const app = document.getElementById('app');
    app.innerHTML = '<div class="spinner"></div>';

    try {
      const stories = await window.API.get('/success-stories');

      app.innerHTML = `
        <div class="container section">
          <div class="section-title-wrap">
            <span class="section-badge">ALUMNI VOICES</span>
            <h1 class="section-title">Alumni Success Stories</h1>
            <p class="section-subtitle">Real experiences and career reflections from graduates placed in leading global corporations.</p>
          </div>

          <div class="grid grid-cols-2">
            ${stories.length === 0 ? '<p style="grid-column:1/-1; text-align:center;">No stories published yet.</p>' : ''}
            ${stories.map(s => `
              <div class="card" style="padding: 2rem; display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                  <div style="display:flex; gap:1.25rem; align-items:center; margin-bottom:1.25rem;">
                    <img src="${s.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}" alt="${s.studentName}" style="width:64px; height:64px; border-radius:50%; object-fit:cover;">
                    <div>
                      <h3 style="font-size:1.2rem; font-weight:800; color:var(--text-main);">${window.UI.escapeHtml(s.studentName)}</h3>
                      <p style="font-size:0.85rem; color:var(--text-muted);">${window.UI.escapeHtml(s.branch)} (Batch ${s.batch})</p>
                      <p style="font-size:0.9rem; font-weight:700; color:var(--primary);">${window.UI.escapeHtml(s.designation)} at ${window.UI.escapeHtml(s.currentCompany)}</p>
                    </div>
                  </div>
                  <div style="font-style:italic; color:var(--text-muted); line-height:1.75; font-size:0.95rem; margin-bottom:1.5rem;">
                    "${window.UI.escapeHtml(s.testimonial)}"
                  </div>
                </div>
                <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border-color); padding-top:1rem;">
                  <span style="font-weight:800; color:var(--success); font-size:1.1rem;">Package: ₹${s.packageLpa} LPA</span>
                  ${s.linkedinUrl ? `<a href="${s.linkedinUrl}" target="_blank" class="btn btn-outline btn-sm">LinkedIn Profile &nearr;</a>` : ''}
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
