/**
 * TPO Connect — Placement Drive Detail & Dynamic Application Page
 */
window.DriveDetailPage = {
  async render(params) {
    const app = document.getElementById('app');
    app.innerHTML = '<div class="spinner"></div>';

    try {
      const driveId = (typeof params === 'object' && params !== null) ? (params.id || params._id) : params;
      const drive = await window.API.get(`/drives/${driveId}`);
      const isAuth = window.State?.isAuthenticated();
      const isStudent = window.State?.getRole() === 'STUDENT';

      // Check student eligibility if student
      let eligibility = null;
      let hasApplied = drive.hasApplied || false;

      if (isAuth && isStudent) {
        try {
          eligibility = await window.API.get(`/eligibility/${driveId}`);
        } catch (e) {
          console.warn('Could not fetch eligibility:', e.message);
        }
      }

      app.innerHTML = `
        <div class="container section">
          <!-- Back Link -->
          <div style="margin-bottom: 1.5rem;">
            <a href="/placements/drives" class="btn btn-outline btn-sm" data-link>&larr; Back to Placement Drives</a>
          </div>

          <div style="display:grid; grid-template-columns: 2fr 1fr; gap: 2rem; align-items: flex-start;">
            <!-- Left Column: Details -->
            <div>
              <div class="card" style="margin-bottom: 2rem;">
                <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1rem;">
                  <div>
                    ${window.UI.badge(drive.status)}
                    <h1 style="font-size:2rem; font-weight:800; margin-top:0.5rem; color:var(--text-main);">${window.UI.escapeHtml(drive.title)}</h1>
                    <p style="font-size:1.1rem; color:var(--primary); font-weight:700;">
                      <a href="/companies/${drive.companyId}" data-link>${window.UI.escapeHtml(drive.companyName)}</a>
                    </p>
                  </div>
                  ${drive.companyLogo ? `<img src="${drive.companyLogo}" style="max-height:54px; max-width:120px; object-fit:contain;">` : ''}
                </div>

                <div class="grid grid-cols-3" style="background:var(--bg-subtle); padding:1.25rem; border-radius:var(--radius-md); margin-bottom:1.5rem;">
                  <div>
                    <span style="font-size:0.8rem; color:var(--text-muted); font-weight:600;">JOB ROLE</span>
                    <div style="font-weight:700; font-size:1.05rem;">${window.UI.escapeHtml(drive.jobRole)}</div>
                  </div>
                  <div>
                    <span style="font-size:0.8rem; color:var(--text-muted); font-weight:600;">SALARY PACKAGE</span>
                    <div style="font-weight:800; font-size:1.2rem; color:var(--success);">₹${drive.packageLpa} LPA</div>
                  </div>
                  <div>
                    <span style="font-size:0.8rem; color:var(--text-muted); font-weight:600;">STIPEND (MONTHLY)</span>
                    <div style="font-weight:700; font-size:1.05rem;">${drive.stipendMonthly ? `₹${drive.stipendMonthly.toLocaleString()}` : 'N/A'}</div>
                  </div>
                </div>

                <div style="margin-bottom:1.5rem;">
                  <h3 style="font-size:1.15rem; font-weight:700; margin-bottom:0.5rem;">Job Description & Scope</h3>
                  <div style="line-height:1.7; color:var(--text-muted); font-size:0.95rem;">
                    ${window.UI.escapeHtml(drive.description || 'No detailed description provided.')}
                  </div>
                </div>

                <div style="margin-bottom:1.5rem;">
                  <h3 style="font-size:1.15rem; font-weight:700; margin-bottom:0.5rem;">Selection Process & Rounds</h3>
                  <ul style="padding-left:1.25rem; line-height:1.7; color:var(--text-muted);">
                    ${(drive.selectionProcess || []).map(round => `<li>${window.UI.escapeHtml(round)}</li>`).join('')}
                  </ul>
                </div>

                <div>
                  <h3 style="font-size:1.15rem; font-weight:700; margin-bottom:0.5rem;">Mandatory Documents</h3>
                  <ul style="padding-left:1.25rem; line-height:1.7; color:var(--text-muted);">
                    ${(drive.requiredDocuments || []).map(doc => `<li>${window.UI.escapeHtml(doc)}</li>`).join('')}
                  </ul>
                </div>
              </div>

              <!-- AI Job Match Widget -->
              ${isStudent ? `
                <div class="card" style="border: 1px solid #bfdbfe; background: #eff6ff; margin-bottom: 2rem;">
                  <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div>
                      <h4 style="font-size:1.1rem; font-weight:700; color:var(--primary);">🤖 AI Smart Profile Match</h4>
                      <p style="font-size:0.85rem; color:var(--text-muted);">Check how your skills and academic profile match this drive.</p>
                    </div>
                    <button class="btn btn-primary btn-sm" id="btn-run-ai-match" onclick="window.DriveDetailPage.runAiMatch('${drive._id}')">
                      Calculate AI Fit
                    </button>
                  </div>
                  <div id="ai-match-result" style="display:none; margin-top:1rem; padding-top:1rem; border-top:1px solid #bfdbfe;"></div>
                </div>
              ` : ''}
            </div>

            <!-- Right Column: Eligibility & Application -->
            <div>
              <div class="card" style="position:sticky; top:5.5rem;">
                <h3 style="font-size:1.2rem; font-weight:700; margin-bottom:1.25rem; border-bottom:1px solid var(--border-color); padding-bottom:0.75rem;">
                  Drive Overview
                </h3>

                <div style="font-size:0.9rem; line-height:1.8; margin-bottom:1.5rem;">
                  <p>📍 <strong>Location:</strong> ${window.UI.escapeHtml(drive.location || 'Pan India')}</p>
                  <p>🏛️ <strong>Venue:</strong> ${window.UI.escapeHtml(drive.venue || 'College Auditorium')}</p>
                  <p>👥 <strong>Vacancies:</strong> ${drive.vacancies || 10}</p>
                  <p>📅 <strong>Drive Date:</strong> ${window.UI.formatDate(drive.driveDate)}</p>
                  <p>⏳ <strong>Deadline:</strong> ${window.UI.formatDate(drive.deadline)}</p>
                </div>

                <div style="background:var(--bg-subtle); padding:1rem; border-radius:var(--radius-md); margin-bottom:1.5rem; font-size:0.85rem; line-height:1.6;">
                  <div style="font-weight:700; margin-bottom:0.4rem; color:var(--text-main);">ELIGIBILITY CRITERIA</div>
                  <p>• <strong>Branches:</strong> ${drive.eligibility?.branches?.join(', ') || 'All'}</p>
                  <p>• <strong>Batch:</strong> ${drive.eligibility?.batch?.join(', ') || 'All'}</p>
                  <p>• <strong>Min CGPA:</strong> ${drive.eligibility?.minCgpa || 6.5}</p>
                  <p>• <strong>Max Backlogs:</strong> ${drive.eligibility?.maxBacklogs ?? 0}</p>
                </div>

                <!-- Dynamic Application Box -->
                <div id="application-action-box">
                  ${this.renderApplicationBox(drive, isAuth, isStudent, eligibility, hasApplied)}
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    } catch (err) {
      console.error(err);
      app.innerHTML = `<div class="container section"><h3>Error loading drive: ${err.message}</h3></div>`;
    }
  },

  renderApplicationBox(drive, isAuth, isStudent, eligibility, hasApplied) {
    if (!isAuth) {
      return `
        <div style="text-align:center; padding:1.25rem; background:var(--bg-subtle); border-radius:var(--radius-md); border:1px solid var(--border-color);">
          <p style="font-size:0.9rem; margin-bottom:0.75rem; color:var(--text-muted); line-height:1.5;">Log in as student to check your dynamic eligibility and apply.</p>
          <a href="/student/login?redirect=/placements/drives/${drive._id}" class="btn btn-primary btn-sm" style="width:100%; font-weight:700;" data-link>Student Login to Apply</a>
        </div>
      `;
    }

    if (!isStudent) {
      return `
        <div style="padding:0.75rem; background:var(--bg-subtle); border-radius:var(--radius-md); font-size:0.85rem; color:var(--text-muted); text-align:center;">
          You are logged in as <strong>${window.State?.getRole()}</strong>. Drive application is reserved for registered students.
        </div>
      `;
    }

    if (hasApplied) {
      return `
        <div class="eligibility-box eligible">
          <div class="eligibility-title">✓ Application Submitted</div>
          <p style="font-size:0.85rem;">You have registered for this recruitment drive. Check your Student Portal for upcoming rounds.</p>
          <a href="/student/applications" class="btn btn-success btn-sm" style="width:100%; margin-top:0.75rem;" data-link>View My Application</a>
        </div>
      `;
    }

    if (eligibility) {
      if (eligibility.isEligible) {
        return `
          <div class="eligibility-box eligible">
            <div class="eligibility-title">✓ You are Eligible!</div>
            <p style="font-size:0.85rem; margin-bottom:1rem;">Your CGPA (${eligibility.studentData?.cgpa}) and academic credentials satisfy all company prerequisites.</p>
            <button class="btn btn-success" style="width:100%;" id="btn-submit-application" onclick="window.DriveDetailPage.submitApplication('${drive._id}')">
              Submit Application Now
            </button>
          </div>
        `;
      } else {
        return `
          <div class="eligibility-box ineligible">
            <div class="eligibility-title">✕ Not Eligible for this Drive</div>
            <ul class="eligibility-list" style="margin-bottom:0.5rem;">
              ${(eligibility.reasons || []).map(r => `<li>${window.UI.escapeHtml(r)}</li>`).join('')}
            </ul>
            <p style="font-size:0.8rem; margin-top:0.5rem; opacity:0.85;">Based on verified academic records.</p>
          </div>
        `;
      }
    }

    return `
      <button class="btn btn-primary" style="width:100%;" onclick="window.DriveDetailPage.submitApplication('${drive._id}')">
        Apply for Drive
      </button>
    `;
  },

  async submitApplication(driveId) {
    const btn = document.getElementById('btn-submit-application');
    if (btn) {
      btn.disabled = true;
      btn.innerText = 'Submitting Application...';
    }

    try {
      await window.API.post('/applications', { driveId });
      window.UI.toast('Application submitted successfully!', 'success');
      // Re-render
      await this.render({ id: driveId });
    } catch (err) {
      window.UI.toast(err.message, 'error');
      if (btn) {
        btn.disabled = false;
        btn.innerText = 'Submit Application Now';
      }
    }
  },

  async runAiMatch(driveId) {
    const btn = document.getElementById('btn-run-ai-match');
    const resultBox = document.getElementById('ai-match-result');
    if (btn) btn.innerText = 'Analyzing...';

    try {
      const match = await window.API.post('/ai/job-match', { driveId });
      resultBox.style.display = 'block';
      resultBox.innerHTML = `
        <div style="display:flex; align-items:center; gap:1rem; margin-bottom:0.75rem;">
          <div style="font-size:2rem; font-weight:900; color:var(--accent);">${match.matchPercentage}%</div>
          <div>
            <div style="font-weight:700; font-size:0.95rem;">${match.isHighlyRecommended ? '🔥 Highly Recommended Match' : 'Moderate Match'}</div>
            <div style="font-size:0.82rem; color:var(--text-muted);">Calculated using your skills and branch requirements.</div>
          </div>
        </div>
        <ul style="font-size:0.85rem; color:var(--text-muted); padding-left:1.25rem;">
          ${(match.reasons || []).map(r => `<li>${window.UI.escapeHtml(r)}</li>`).join('')}
        </ul>
      `;
    } catch (err) {
      window.UI.toast(err.message, 'error');
    } finally {
      if (btn) btn.innerText = 'Calculate AI Fit';
    }
  }
};
