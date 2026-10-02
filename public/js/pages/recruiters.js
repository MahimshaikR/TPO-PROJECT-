/**
 * TPO Connect — Recruiter Information & Campus Facilities View
 */
window.RecruitersPage = {
  async render() {
    const app = document.getElementById('app');
    app.innerHTML = '<div class="spinner"></div>';

    try {
      const settings = window.State?.getSettings() || await window.API.get('/settings/public');

      app.innerHTML = `
        <div class="container section">
          <div class="section-title-wrap">
            <span class="section-badge">CORPORATE PARTNERSHIP</span>
            <h1 class="section-title">Partner with Our Institution for Campus Recruitment</h1>
            <p class="section-subtitle">Engage with top-tier engineering talent trained in modern tech stacks and real-world projects.</p>
          </div>

          <div class="grid grid-cols-3" style="margin-bottom: 3.5rem;">
            <div class="card" style="text-align: center; padding: 2rem;">
              <div style="font-size: 2.5rem; margin-bottom: 1rem;">🏢</div>
              <h3 style="font-size: 1.25rem; font-weight: 800; margin-bottom: 0.5rem;">Dedicated Interview Suites</h3>
              <p style="color: var(--text-muted); font-size: 0.92rem; line-height: 1.6;">
                Air-conditioned corporate GD halls, 20+ dedicated interview rooms, and high-speed dedicated gigabit connectivity.
              </p>
            </div>
            <div class="card" style="text-align: center; padding: 2rem;">
              <div style="font-size: 2.5rem; margin-bottom: 1rem;">💻</div>
              <h3 style="font-size: 1.25rem; font-weight: 800; margin-bottom: 0.5rem;">1000+ Online Test Terminals</h3>
              <p style="color: var(--text-muted); font-size: 0.92rem; line-height: 1.6;">
                State-of-the-art computer labs with UPS power backup, proctoring infrastructure, and custom sandbox environments.
              </p>
            </div>
            <div class="card" style="text-align: center; padding: 2rem;">
              <div style="font-size: 2.5rem; margin-bottom: 1rem;">🤝</div>
              <h3 style="font-size: 1.25rem; font-weight: 800; margin-bottom: 0.5rem;">End-to-End T&P Assistance</h3>
              <p style="color: var(--text-muted); font-size: 0.92rem; line-height: 1.6;">
                Dedicated student volunteer coordinators, hospitality arrangements, and instant digital shortlisting tools.
              </p>
            </div>
          </div>

          <div class="card" style="background: var(--hero-gradient); color: #ffffff; padding: 3rem; text-align: center; border-radius: var(--radius-lg);">
            <h2 style="font-size: 2rem; font-weight: 800; margin-bottom: 1rem; color: #ffffff;">Ready to Schedule a Recruitment Drive?</h2>
            <p style="font-size: 1.1rem; color: #cbd5e1; max-width: 650px; margin: 0 auto 2rem auto;">
              Register your enterprise or contact our placement director directly to reserve drive slots for the 2026-27 graduating batch.
            </p>
            <div style="display:flex; justify-content:center; gap:1rem; flex-wrap:wrap;">
              <a href="/recruit-with-us" class="btn btn-accent btn-lg" data-link>Register Company Online</a>
              <a href="/contact" class="btn btn-outline btn-lg" style="color:#ffffff; border-color:rgba(255,255,255,0.4);" data-link>Contact Placement Cell</a>
            </div>
          </div>
        </div>
      `;
    } catch (err) {
      app.innerHTML = `<div class="container section">Error: ${err.message}</div>`;
    }
  }
};
