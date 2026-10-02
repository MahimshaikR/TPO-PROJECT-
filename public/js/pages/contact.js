/**
 * TPO Connect — Dynamic Contact Information View
 */
window.ContactPage = {
  async render() {
    const app = document.getElementById('app');
    app.innerHTML = '<div class="spinner"></div>';

    try {
      const settings = window.State?.getSettings() || await window.API.get('/settings/public');

      app.innerHTML = `
        <div class="container section">
          <div class="section-title-wrap">
            <span class="section-badge">GET IN TOUCH</span>
            <h1 class="section-title">Contact Training & Placement Cell</h1>
            <p class="section-subtitle">Reach out to our placement officers, recruiters desk, or student coordinators.</p>
          </div>

          <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: flex-start;">
            <!-- Contact Info Details -->
            <div class="card" style="padding: 2.5rem;">
              <h2 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 1.5rem; color: var(--primary);">Placement Secretariat</h2>

              <div style="display:flex; flex-direction:column; gap:1.25rem; font-size:0.95rem; line-height:1.7;">
                <div>
                  <strong style="color:var(--text-main);">🏛️ Office Address:</strong>
                  <p style="color:var(--text-muted);">${window.UI.escapeHtml(settings.officeAddress || 'NRI Institute of Technology, Pothavarappadu (V), Agiripalli (M), Vijayawada Rural, AP - 521212')}</p>
                </div>

                <div>
                  <strong style="color:var(--text-main);">👨‍💼 Head of Training & Placement:</strong>
                  <p style="color:var(--text-muted);">${window.UI.escapeHtml(settings.officerName || 'Dr. Rajesh Sharma')} (${window.UI.escapeHtml(settings.officerDesignation || 'Head - T&P')})</p>
                </div>

                <div>
                  <strong style="color:var(--text-main);">📞 Direct Phone & Helpline:</strong>
                  <p style="color:var(--text-muted);">
                    <a href="tel:${settings.phone || '+91 866 2469666'}">${window.UI.escapeHtml(settings.phone || '+91 866 2469666')}</a> | 
                    <a href="tel:${settings.primaryContact || '+91 866 2469666'}">${window.UI.escapeHtml(settings.primaryContact || '+91 866 2469666')}</a>
                  </p>
                </div>

                <div>
                  <strong style="color:var(--text-main);">✉️ Official Placement Email:</strong>
                  <p style="color:var(--text-muted);">
                    <a href="mailto:${settings.email || 'placements@nriit.edu.in'}">${window.UI.escapeHtml(settings.email || 'placements@nriit.edu.in')}</a>
                  </p>
                </div>

                <div>
                  <strong style="color:var(--text-main);">⏰ Office Working Hours:</strong>
                  <p style="color:var(--text-muted);">${window.UI.escapeHtml(settings.workingHours || 'Mon-Fri: 9:00 AM - 5:30 PM')}</p>
                </div>
              </div>
            </div>

            <!-- Quick Inquiry / Message Form -->
            <div class="card" style="padding: 2.5rem;">
              <h2 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 1.5rem;">Send a Message to T&P Cell</h2>
              <form id="contact-form" onsubmit="window.ContactPage.handleSubmit(event)">
                <div style="margin-bottom: 1rem;">
                  <label class="filter-label">Full Name:</label>
                  <input type="text" id="contact-name" class="form-input" required placeholder="Your Name">
                </div>
                <div style="margin-bottom: 1rem;">
                  <label class="filter-label">Email Address:</label>
                  <input type="email" id="contact-email" class="form-input" required placeholder="name@domain.com">
                </div>
                <div style="margin-bottom: 1rem;">
                  <label class="filter-label">Subject:</label>
                  <input type="text" id="contact-subject" class="form-input" required placeholder="e.g. Campus Recruitment Inquiry">
                </div>
                <div style="margin-bottom: 1.5rem;">
                  <label class="filter-label">Message:</label>
                  <textarea id="contact-message" class="form-textarea" rows="4" required placeholder="How can the T&P Cell assist you?"></textarea>
                </div>
                <button type="submit" class="btn btn-primary" style="width: 100%;">Transmit Message</button>
              </form>
            </div>
          </div>
        </div>
      `;
    } catch (err) {
      console.error(err);
      app.innerHTML = `<div class="container section">Error: ${err.message}</div>`;
    }
  },

  async handleSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('contact-name').value;
    const email = document.getElementById('contact-email').value;
    const subject = document.getElementById('contact-subject').value;
    const message = document.getElementById('contact-message').value;

    try {
      await window.API.post('/feedback', { name, email, subject, message });
      window.UI.toast('Your message has been safely delivered to the T&P Office. We will get back to you shortly!', 'success');
      document.getElementById('contact-form').reset();
    } catch (err) {
      window.UI.toast(err.message, 'error');
    }
  }
};
