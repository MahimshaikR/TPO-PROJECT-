/**
 * TPO Connect — Training & Skill Development Programs Page
 */
window.TrainingPage = {
  async render() {
    const app = document.getElementById('app');
    app.innerHTML = '<div class="spinner"></div>';

    try {
      const trainings = await window.API.get('/training');

      app.innerHTML = `
        <div class="container section">
          <div class="section-title-wrap" style="text-align:left; margin-bottom:2rem;">
            <span class="section-badge">SKILL ACCELERATION</span>
            <h1 class="section-title">Corporate Training & Bootcamps</h1>
            <p class="section-subtitle">Intensive industry-aligned training programs in DSA, Full Stack, Aptitude, and Soft Skills.</p>
          </div>

          <!-- Category Filter Bar -->
          <div class="filter-bar">
            <div class="filter-group">
              <span class="filter-label">Category:</span>
              <select id="training-cat-filter" class="form-select" onchange="window.TrainingPage.applyFilter()">
                <option value="ALL">All Categories</option>
                <option value="TECHNICAL">Technical & Coding</option>
                <option value="INTERVIEW_PREP">Interview Preparation</option>
                <option value="APTITUDE">Quantitative & Verbal Aptitude</option>
                <option value="SOFT_SKILLS">Soft Skills & Personality</option>
                <option value="WORKSHOP">Specialized Workshop</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-3" id="trainings-grid">
            ${this.renderTrainingCards(trainings)}
          </div>
        </div>
      `;
      this.allTrainings = trainings;
    } catch (err) {
      console.error(err);
      app.innerHTML = `<div class="container section"><h3>Error loading training programs: ${err.message}</h3></div>`;
    }
  },

  renderTrainingCards(trainings) {
    if (!trainings || trainings.length === 0) {
      return '<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 3rem 0;">No training programs matching criteria.</p>';
    }

    return trainings.map(t => `
      <div class="card card-clickable" onclick="window.Router.navigate('/training/${t._id}')">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1rem;">
          <span class="badge badge-primary">${t.category}</span>
          <span style="font-size:0.8rem; font-weight:700; color:var(--text-muted);">${t.code}</span>
        </div>
        <h3 style="font-size:1.15rem; font-weight:800; color:var(--text-main); margin-bottom:0.5rem; line-height:1.3;">${window.UI.escapeHtml(t.title)}</h3>
        <p style="font-size:0.85rem; color:var(--primary); font-weight:600; margin-bottom:0.75rem;">👨‍🏫 ${window.UI.escapeHtml(t.instructor)}</p>
        <p style="font-size:0.9rem; color:var(--text-muted); line-height:1.6; margin-bottom:1.25rem; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">
          ${window.UI.escapeHtml(t.description || 'Intensive skill enhancement module.')}
        </p>
        <div style="font-size:0.85rem; line-height:1.6; color:var(--text-muted); border-top:1px solid var(--border-color); padding-top:0.75rem; margin-bottom:1rem;">
          <p>📅 <strong>Duration:</strong> ${window.UI.formatDate(t.startDate)} - ${window.UI.formatDate(t.endDate)}</p>
          <p>⏱️ <strong>Total Hours:</strong> ${t.totalHours || 30} Hours</p>
          <p>🏛️ <strong>Venue:</strong> ${window.UI.escapeHtml(t.venue || 'Virtual/Auditorium')}</p>
        </div>
        <a href="/training/${t._id}" class="btn btn-secondary btn-sm" style="width:100%;" data-link>View Syllabus & Schedule</a>
      </div>
    `).join('');
  },

  applyFilter() {
    const cat = document.getElementById('training-cat-filter')?.value || 'ALL';
    let filtered = this.allTrainings || [];

    if (cat !== 'ALL') {
      filtered = filtered.filter(t => t.category === cat);
    }

    const grid = document.getElementById('trainings-grid');
    if (grid) {
      grid.innerHTML = this.renderTrainingCards(filtered);
    }
  }
};
