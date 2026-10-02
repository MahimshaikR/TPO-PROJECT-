/**
 * TPO Connect — Feedback Submission View
 */
window.FeedbackPage = {
  async render() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="container section">
        <div class="section-title-wrap">
          <span class="section-badge">CONTINUOUS IMPROVEMENT</span>
          <h1 class="section-title">Share Your Feedback</h1>
          <p class="section-subtitle">We value student and recruiter suggestions to make our placement drives seamless.</p>
        </div>

        <div class="card" style="max-width: 650px; margin: 0 auto; padding: 2.5rem;">
          <form id="feedback-form" onsubmit="window.FeedbackPage.handleSubmit(event)">
            <div style="margin-bottom: 1rem;">
              <label class="filter-label">Full Name:</label>
              <input type="text" id="fb-name" class="form-input" required placeholder="Your Name" value="${window.State?.getUser()?.name || ''}">
            </div>
            <div style="margin-bottom: 1rem;">
              <label class="filter-label">Email Address:</label>
              <input type="email" id="fb-email" class="form-input" required placeholder="name@domain.com" value="${window.State?.getUser()?.email || ''}">
            </div>
            <div style="margin-bottom: 1rem;">
              <label class="filter-label">I am a:</label>
              <select id="fb-role" class="form-select">
                <option value="Student">Student</option>
                <option value="Recruiter">Corporate Recruiter</option>
                <option value="Faculty">Faculty Coordinator</option>
                <option value="Alumni">Alumni</option>
              </select>
            </div>
            <div style="margin-bottom: 1rem;">
              <label class="filter-label">Subject / Topic:</label>
              <input type="text" id="fb-subject" class="form-input" required placeholder="e.g. Assessment Lab Feedback">
            </div>
            <div style="margin-bottom: 1rem;">
              <label class="filter-label">Rating:</label>
              <select id="fb-rating" class="form-select">
                <option value="5">⭐⭐⭐⭐⭐ Excellent (5/5)</option>
                <option value="4">⭐⭐⭐⭐ Very Good (4/5)</option>
                <option value="3">⭐⭐⭐ Good (3/5)</option>
                <option value="2">⭐⭐ Needs Improvement (2/5)</option>
                <option value="1">⭐ Poor (1/5)</option>
              </select>
            </div>
            <div style="margin-bottom: 1.5rem;">
              <label class="filter-label">Detailed Comments & Suggestions:</label>
              <textarea id="fb-message" class="form-textarea" rows="4" required placeholder="Your suggestions..."></textarea>
            </div>
            <button type="submit" class="btn btn-primary" style="width: 100%;">Submit Feedback</button>
          </form>
        </div>
      </div>
    `;
  },

  async handleSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('fb-name').value;
    const email = document.getElementById('fb-email').value;
    const role = document.getElementById('fb-role').value;
    const subject = document.getElementById('fb-subject').value;
    const rating = document.getElementById('fb-rating').value;
    const message = document.getElementById('fb-message').value;

    try {
      await window.API.post('/feedback', { name, email, role, subject, rating, message });
      window.UI.toast('Thank you! Your feedback has been recorded.', 'success');
      document.getElementById('feedback-form').reset();
    } catch (err) {
      window.UI.toast(err.message, 'error');
    }
  }
};
