/**
 * TPO Connect — Student Guidelines & Hub
 */
window.StudentsPage = {
  async render() {
    const app = document.getElementById('app');
    app.innerHTML = '<div class="spinner"></div>';

    try {
      app.innerHTML = `
        <div class="container section">
          <div class="section-title-wrap">
            <span class="section-badge">STUDENT CORNER</span>
            <h1 class="section-title">Student Placement Guidelines & Preparation Roadmap</h1>
            <p class="section-subtitle">Your step-by-step roadmap to acing campus recruitment drives.</p>
          </div>

          <div class="grid grid-cols-3" style="margin-bottom: 3.5rem;">
            <div class="card" style="border-top: 4px solid var(--primary);">
              <div style="font-size:2rem; margin-bottom:0.75rem;">1️⃣</div>
              <h3 style="font-size:1.25rem; font-weight:800; margin-bottom:0.5rem;">Profile & Resume Setup</h3>
              <p style="color:var(--text-muted); font-size:0.92rem; line-height:1.6; margin-bottom:1rem;">
                Keep your academic details, CGPA, backlogs, skills, and certifications verified and updated in the Student Portal.
              </p>
              <a href="/student/login" class="btn btn-secondary btn-sm" data-link>Access Portal &rarr;</a>
            </div>

            <div class="card" style="border-top: 4px solid var(--accent);">
              <div style="font-size:2rem; margin-bottom:0.75rem;">2️⃣</div>
              <h3 style="font-size:1.25rem; font-weight:800; margin-bottom:0.5rem;">Skill & Aptitude Training</h3>
              <p style="color:var(--text-muted); font-size:0.92rem; line-height:1.6; margin-bottom:1rem;">
                Participate in mandatory bootcamps, coding practice sessions, and mock assessments to maintain 85%+ attendance.
              </p>
              <a href="/training" class="btn btn-secondary btn-sm" data-link>View Bootcamps &rarr;</a>
            </div>

            <div class="card" style="border-top: 4px solid var(--success);">
              <div style="font-size:2rem; margin-bottom:0.75rem;">3️⃣</div>
              <h3 style="font-size:1.25rem; font-weight:800; margin-bottom:0.5rem;">Check Eligibility & Apply</h3>
              <p style="color:var(--text-muted); font-size:0.92rem; line-height:1.6; margin-bottom:1rem;">
                Browse scheduled drives, verify criteria instantly via our dynamic eligibility engine, and submit applications.
              </p>
              <a href="/placements/drives" class="btn btn-secondary btn-sm" data-link>Explore Drives &rarr;</a>
            </div>
          </div>

          <div class="card" style="padding: 2.5rem; background: var(--bg-surface);">
            <h2 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 1rem;">Essential Student Checklists</h2>
            <div class="grid grid-cols-2" style="gap: 2rem;">
              <div>
                <h4 style="font-size: 1.1rem; font-weight: 700; color: var(--primary); margin-bottom: 0.5rem;">📋 Before Every Drive</h4>
                <ul style="color: var(--text-muted); line-height: 1.8; font-size: 0.92rem; padding-left: 1.25rem;">
                  <li>Verify that your resume is formatted in clean ATS-compliant PDF.</li>
                  <li>Check company recruitment rounds, test syllabus, and previous question papers.</li>
                  <li>Bring your College ID Card, Government Photo ID, and bonafide transcripts.</li>
                  <li>Ensure dress code adheres to formal corporate standards.</li>
                </ul>
              </div>
              <div>
                <h4 style="font-size: 1.1rem; font-weight: 700; color: var(--accent); margin-bottom: 0.5rem;">💻 Online Assessment Etiquette</h4>
                <ul style="color: var(--text-muted); line-height: 1.8; font-size: 0.92rem; padding-left: 1.25rem;">
                  <li>Stable internet connection and functional webcam/microphone are mandatory.</li>
                  <li>Ensure zero tabs or background proctoring violations during coding tests.</li>
                  <li>Join test and interview sessions at least 15 minutes prior to scheduled slot.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      `;
    } catch (err) {
      app.innerHTML = `<div class="container section">Error: ${err.message}</div>`;
    }
  }
};
