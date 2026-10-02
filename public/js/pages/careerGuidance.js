/**
 * TPO Connect — Career Guidance & Roadmap View
 */
window.CareerGuidancePage = {
  async render() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="container section">
        <div class="section-title-wrap">
          <span class="section-badge">CAREER STRATEGY</span>
          <h1 class="section-title">Career Guidance & Tech Placement Roadmap</h1>
          <p class="section-subtitle">Structured career navigation for Software Engineering, AI/ML, Cloud DevOps, and Core Engineering.</p>
        </div>

        <div class="grid grid-cols-2" style="margin-bottom:3rem;">
          <div class="card" style="padding:2rem;">
            <h3 style="font-size:1.35rem; font-weight:800; color:var(--primary); margin-bottom:1rem;">💻 Software Development Engineer (SDE) Path</h3>
            <ul style="color:var(--text-muted); line-height:1.8; font-size:0.95rem; padding-left:1.25rem;">
              <li><strong>Year 1 & 2:</strong> Master C++ or Java syntax; complete 150+ LeetCode problems covering Arrays, Strings, Trees, and DP.</li>
              <li><strong>Year 3:</strong> Build 2 full-stack projects using modern web stacks (Node.js, MongoDB, React) with unit tests and Docker deployments.</li>
              <li><strong>Pre-Final / Final Year:</strong> Study low-level and high-level System Design (LLD/HLD), concurrency, database indexing, and mock interviews.</li>
            </ul>
          </div>

          <div class="card" style="padding:2rem;">
            <h3 style="font-size:1.35rem; font-weight:800; color:var(--accent); margin-bottom:1rem;">🤖 AI, Data Science & Machine Learning Path</h3>
            <ul style="color:var(--text-muted); line-height:1.8; font-size:0.95rem; padding-left:1.25rem;">
              <li><strong>Core Math:</strong> Linear Algebra, Multivariate Calculus, Probability Distributions, and Inferential Statistics.</li>
              <li><strong>Machine Learning:</strong> Scikit-Learn, XGBoost, Cross-Validation, Feature Engineering, and Model Optimization.</li>
              <li><strong>Deep Learning:</strong> PyTorch, CNNs for Computer Vision, Transformers for NLP, and Model Quantization.</li>
            </ul>
          </div>
        </div>

        <!-- AI Career Coach Tool Callout -->
        <div class="card" style="background:var(--hero-gradient); color:#ffffff; padding:2.5rem; text-align:center;">
          <h2 style="font-size:1.85rem; font-weight:800; margin-bottom:0.75rem; color:#ffffff;">Practice with AI Interview Simulator</h2>
          <p style="color:#cbd5e1; max-width:600px; margin:0 auto 1.5rem auto;">
            Generate role-specific technical and behavioral questions customized to your target job profile.
          </p>
          <div style="max-width:500px; margin:0 auto; display:flex; gap:0.5rem;">
            <input type="text" id="ai-role-input" class="form-input" placeholder="e.g. SDE Backend, Data Scientist" style="background:#ffffff; color:#0f172a;">
            <button class="btn btn-accent" onclick="window.CareerGuidancePage.generateInterviewQuestions()">Generate Questions</button>
          </div>
          <div id="ai-questions-box" style="margin-top:2rem; text-align:left; display:none; background:rgba(255,255,255,0.1); padding:1.5rem; border-radius:var(--radius-md);"></div>
        </div>
      </div>
    `;
  },

  async generateInterviewQuestions() {
    const role = document.getElementById('ai-role-input')?.value || 'Software Engineer';
    const box = document.getElementById('ai-questions-box');
    box.style.display = 'block';
    box.innerHTML = '<div class="spinner"></div>';

    try {
      const data = await window.API.post('/ai/interview-prep', { role });
      box.innerHTML = `
        <h3 style="color:#ffffff; font-weight:800; margin-bottom:1rem;">Recommended Interview Prep for: ${window.UI.escapeHtml(data.role)}</h3>
        <h4 style="color:#60a5fa; margin-bottom:0.5rem;">Technical Rounds:</h4>
        <ul style="color:#e2e8f0; line-height:1.7; padding-left:1.25rem; margin-bottom:1rem;">
          ${data.technicalQuestions.map(q => `<li>${window.UI.escapeHtml(q)}</li>`).join('')}
        </ul>
        <h4 style="color:#34d399; margin-bottom:0.5rem;">Behavioral & Leadership:</h4>
        <ul style="color:#e2e8f0; line-height:1.7; padding-left:1.25rem;">
          ${data.behavioralQuestions.map(q => `<li>${window.UI.escapeHtml(q)}</li>`).join('')}
        </ul>
      `;
    } catch (err) {
      box.innerHTML = `<p style="color:#ef4444;">Failed to generate: ${err.message}</p>`;
    }
  }
};
