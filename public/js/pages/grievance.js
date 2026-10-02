/**
 * TPO Connect — Grievance Redressal Cell & Ticket Tracker
 */
window.GrievancePage = {
  async render() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="container section">
        <div class="section-title-wrap">
          <span class="section-badge">STUDENT REDRESSAL</span>
          <h1 class="section-title">Grievance Redressal Cell</h1>
          <p class="section-subtitle">Submit concerns regarding drive eligibility, attendance discrepancies, or placement disputes.</p>
        </div>

        <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: flex-start;">
          <!-- Submit Ticket Form -->
          <div class="card" style="padding: 2.5rem;">
            <h2 style="font-size: 1.4rem; font-weight: 800; margin-bottom: 1.25rem;">File a New Grievance</h2>
            <form id="grievance-form" onsubmit="window.GrievancePage.handleSubmit(event)">
              <div style="margin-bottom: 1rem;">
                <label class="filter-label">Student Name:</label>
                <input type="text" id="grv-name" class="form-input" required placeholder="Full Name" value="${window.State?.getUser()?.name || ''}">
              </div>
              <div style="margin-bottom: 1rem;">
                <label class="filter-label">Roll Number:</label>
                <input type="text" id="grv-roll" class="form-input" required placeholder="e.g. 23CS001">
              </div>
              <div style="margin-bottom: 1rem;">
                <label class="filter-label">Email Address:</label>
                <input type="email" id="grv-email" class="form-input" required placeholder="name@domain.com" value="${window.State?.getUser()?.email || ''}">
              </div>
              <div style="margin-bottom: 1rem;">
                <label class="filter-label">Category:</label>
                <select id="grv-cat" class="form-select">
                  <option value="ELIGIBILITY">Eligibility Calculation Discrepancy</option>
                  <option value="ATTENDANCE">Training Attendance Discrepancy</option>
                  <option value="DRIVE">Drive Registration or Test Issue</option>
                  <option value="TRAINING">Training Session Issue</option>
                  <option value="GENERAL">General Dispute</option>
                </select>
              </div>
              <div style="margin-bottom: 1.5rem;">
                <label class="filter-label">Detailed Explanation of Issue:</label>
                <textarea id="grv-desc" class="form-textarea" rows="4" required placeholder="Please describe the discrepancy with relevant dates or subject details..."></textarea>
              </div>
              <button type="submit" class="btn btn-primary" style="width: 100%;">Submit Grievance & Generate Ticket</button>
            </form>
          </div>

          <!-- Live Ticket Tracker -->
          <div class="card" style="padding: 2.5rem;">
            <h2 style="font-size: 1.4rem; font-weight: 800; margin-bottom: 1.25rem;">Track Existing Ticket Status</h2>
            <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 1.5rem;">
              Enter your tracking ticket number (e.g. <code>GRV-2026-8941</code>) to review resolution status and committee remarks.
            </p>

            <div style="display:flex; gap:0.5rem; margin-bottom: 1.5rem;">
              <input type="text" id="track-ticket-input" class="form-input" placeholder="e.g. GRV-2026-8941">
              <button class="btn btn-primary" onclick="window.GrievancePage.trackTicket()">Track</button>
            </div>

            <div id="ticket-result-box" style="display:none; padding:1.25rem; background:var(--bg-subtle); border-radius:var(--radius-md); border:1px solid var(--border-color);"></div>
          </div>
        </div>
      </div>
    `;
  },

  async handleSubmit(e) {
    e.preventDefault();
    const studentName = document.getElementById('grv-name').value;
    const rollNumber = document.getElementById('grv-roll').value;
    const email = document.getElementById('grv-email').value;
    const category = document.getElementById('grv-cat').value;
    const description = document.getElementById('grv-desc').value;

    try {
      const res = await window.API.post('/grievance', { studentName, rollNumber, email, category, description });
      window.UI.modal({
        title: 'Grievance Submitted',
        content: `
          <div style="text-align:center; padding:1rem 0;">
            <div style="font-size:3rem; margin-bottom:0.5rem;">🎫</div>
            <h3 style="font-size:1.35rem; font-weight:800; color:var(--primary); margin-bottom:0.5rem;">
              Ticket ID: ${res.ticketNumber}
            </h3>
            <p style="color:var(--text-muted); font-size:0.95rem;">
              Your grievance has been submitted to the T&P Grievance Committee. Please save this ticket number for tracking your resolution status.
            </p>
          </div>
        `
      });
      document.getElementById('grievance-form').reset();
    } catch (err) {
      window.UI.toast(err.message, 'error');
    }
  },

  async trackTicket() {
    const ticket = document.getElementById('track-ticket-input')?.value.trim();
    const box = document.getElementById('ticket-result-box');
    if (!ticket) {
      window.UI.toast('Please enter a ticket number', 'warning');
      return;
    }

    box.style.display = 'block';
    box.innerHTML = '<div class="spinner"></div>';

    try {
      const data = await window.API.get(`/grievance/track/${ticket}`);
      box.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
          <strong style="font-size:1.1rem; color:var(--primary);">${window.UI.escapeHtml(data.ticketNumber)}</strong>
          ${window.UI.badge(data.status)}
        </div>
        <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:0.5rem;">
          Student: <strong>${window.UI.escapeHtml(data.studentName)}</strong> (${data.rollNumber}) | Category: <strong>${data.category}</strong>
        </p>
        <div style="font-size:0.9rem; line-height:1.6; margin-bottom:0.75rem;">
          <strong>Issue:</strong> ${window.UI.escapeHtml(data.description)}
        </div>
        ${data.adminRemarks ? `
          <div style="background:var(--success-bg); border:1px solid var(--success-border); padding:0.75rem; border-radius:var(--radius-sm); font-size:0.85rem; color:#065f46;">
            <strong>Committee Remarks:</strong> ${window.UI.escapeHtml(data.adminRemarks)}
          </div>
        ` : `
          <div style="font-size:0.8rem; color:var(--text-muted); font-style:italic;">
            Under active review by Department Placement Coordinator.
          </div>
        `}
      `;
    } catch (err) {
      box.innerHTML = `<p style="color:var(--danger);">${err.message || 'Ticket not found'}</p>`;
    }
  }
};
