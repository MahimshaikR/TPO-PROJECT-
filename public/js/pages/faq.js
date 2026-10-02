/**
 * TPO Connect — Dynamic FAQ View
 */
window.FAQPage = {
  async render() {
    const app = document.getElementById('app');
    app.innerHTML = '<div class="spinner"></div>';

    try {
      const faqs = await window.API.get('/faq');

      app.innerHTML = `
        <div class="container section">
          <div class="section-title-wrap">
            <span class="section-badge">HELP & SUPPORT</span>
            <h1 class="section-title">Frequently Asked Questions</h1>
            <p class="section-subtitle">Clear answers to questions regarding placement policies, eligibility, and recruiter drives.</p>
          </div>

          <div style="max-width: 820px; margin: 0 auto; display: flex; flex-direction: column; gap: 1rem;">
            ${faqs.length === 0 ? '<p style="text-align:center;">No FAQs available.</p>' : ''}
            ${faqs.map(f => `
              <div class="card" style="padding: 1.5rem;">
                <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.5rem;">
                  <h3 style="font-size: 1.15rem; font-weight: 800; color: var(--text-main);">
                    ❓ ${window.UI.escapeHtml(f.question)}
                  </h3>
                  <span class="badge badge-primary">${f.category}</span>
                </div>
                <p style="color: var(--text-muted); line-height: 1.7; font-size: 0.95rem;">
                  ${window.UI.escapeHtml(f.answer)}
                </p>
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
