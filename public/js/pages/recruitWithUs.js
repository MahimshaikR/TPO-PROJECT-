/**
 * TPO Connect — Recruit With Us (Corporate Registration Page)
 */
window.RecruitWithUsPage = {
  async render() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="container section">
        <div class="section-title-wrap">
          <span class="section-badge">RECRUITMENT INVITATION</span>
          <h1 class="section-title">Recruit Top Tech Talent</h1>
          <p class="section-subtitle">Register your organization to hire graduating engineers, interns, and specialists.</p>
        </div>

        <div class="card" style="max-width: 750px; margin: 0 auto; padding: 3rem;">
          <h2 style="font-size: 1.4rem; font-weight: 800; margin-bottom: 0.5rem;">Corporate Employer Registration</h2>
          <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 2rem;">
            Provide your official details to receive access to our Recruiter Portal, schedule pre-placement talks, and post hiring drives.
          </p>

          <form id="recruit-form" onsubmit="window.RecruitWithUsPage.handleSubmit(event)">
            <div class="grid grid-cols-2" style="gap:1rem; margin-bottom:1rem;">
              <div>
                <label class="filter-label">HR / Recruiter Full Name:</label>
                <input type="text" id="rec-name" class="form-input" required placeholder="John Doe">
              </div>
              <div>
                <label class="filter-label">Official Work Email:</label>
                <input type="email" id="rec-email" class="form-input" required placeholder="john.doe@company.com">
              </div>
            </div>

            <div class="grid grid-cols-2" style="gap:1rem; margin-bottom:1rem;">
              <div>
                <label class="filter-label">Company Name:</label>
                <input type="text" id="rec-company" class="form-input" required placeholder="Acme Technologies Inc.">
              </div>
              <div>
                <label class="filter-label">Designation:</label>
                <input type="text" id="rec-designation" class="form-input" placeholder="e.g. Campus Talent Acquisition Lead">
              </div>
            </div>

            <div class="grid grid-cols-2" style="gap:1rem; margin-bottom:1rem;">
              <div>
                <label class="filter-label">Contact Phone Number:</label>
                <input type="tel" id="rec-phone" class="form-input" required placeholder="+91 98765 43210">
              </div>
              <div>
                <label class="filter-label">Create Portal Password:</label>
                <input type="password" id="rec-password" class="form-input" required placeholder="Min 6 characters">
              </div>
            </div>

            <div style="margin-bottom: 1.5rem;">
              <label class="filter-label">Anticipated Roles & Expected Package Range:</label>
              <textarea id="rec-notes" class="form-textarea" rows="3" placeholder="e.g. Software Engineer, Cloud Analyst (10 - 18 LPA)"></textarea>
            </div>

            <button type="submit" class="btn btn-primary btn-lg" style="width: 100%;">Submit Corporate Registration</button>
          </form>

          <div style="text-align: center; margin-top: 1.5rem; font-size: 0.9rem; color: var(--text-muted);">
            Already have a recruiter account? <a href="/recruiter/login" data-link>Login to Recruiter Portal</a>
          </div>
        </div>
      </div>
    `;
  },

  async handleSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('rec-name').value;
    const email = document.getElementById('rec-email').value;
    const companyName = document.getElementById('rec-company').value;
    const designation = document.getElementById('rec-designation').value;
    const phone = document.getElementById('rec-phone').value;
    const password = document.getElementById('rec-password').value;

    try {
      const res = await window.API.post('/auth/register/recruiter', {
        name,
        email,
        password,
        companyName,
        designation,
        phone
      });

      window.State.setAuth(res.token, res.user);
      window.UI.toast('Welcome to TPO Connect! Corporate account successfully created.', 'success');
      window.Router.navigate('/recruiter/dashboard');
    } catch (err) {
      window.UI.toast(err.message, 'error');
    }
  }
};
