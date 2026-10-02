/**
 * TPO Connect — Campus & Corporate Events Page
 */
window.EventsPage = {
  async render() {
    const app = document.getElementById('app');
    app.innerHTML = '<div class="spinner"></div>';

    try {
      const events = await window.API.get('/events');

      app.innerHTML = `
        <div class="container section">
          <div class="section-title-wrap" style="text-align:left; margin-bottom:2rem;">
            <span class="section-badge">CAMPUS HAPPENINGS</span>
            <h1 class="section-title">Industry Events, Summits & Workshops</h1>
            <p class="section-subtitle">Corporate tech summits, guest keynotes, hackathons, and industrial excursions.</p>
          </div>

          <div class="grid grid-cols-3">
            ${events.length === 0 ? '<p style="grid-column:1/-1; text-align:center;">No upcoming events currently scheduled.</p>' : ''}
            ${events.map(e => `
              <div class="card card-clickable" onclick="window.Router.navigate('/events/${e._id}')">
                ${(e.imageUrl || e.bannerImage) ? `
                  <div style="height:160px; margin:-1.5rem -1.5rem 1.25rem -1.5rem; overflow:hidden; border-top-left-radius:var(--radius-lg); border-top-right-radius:var(--radius-lg);">
                    <img src="${e.imageUrl || e.bannerImage}" alt="${e.title}" style="width:100%; height:100%; object-fit:cover;">
                  </div>
                ` : ''}
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
                  <span class="badge badge-primary">${e.category}</span>
                  <span style="font-size:0.82rem; font-weight:600; color:var(--text-muted);">📅 ${window.UI.formatDate(e.eventDate)}</span>
                </div>
                <h3 style="font-size:1.15rem; font-weight:800; color:var(--text-main); margin-bottom:0.5rem; line-height:1.3;">${window.UI.escapeHtml(e.title)}</h3>
                <p style="font-size:0.85rem; color:var(--primary); font-weight:600; margin-bottom:0.75rem;">🎤 ${window.UI.escapeHtml(e.speaker || e.speakerOrGuest || e.organization || 'Corporate Speaker')}</p>
                <div style="font-size:0.85rem; line-height:1.6; color:var(--text-muted); margin-bottom:1.25rem;">
                  <p>🏛️ <strong>Venue:</strong> ${window.UI.escapeHtml(e.venue || 'Campus Auditorium')}</p>
                  <p>⏰ <strong>Time:</strong> ${window.UI.escapeHtml(e.time || '10:00 AM')}</p>
                </div>
                <a href="/events/${e._id}" class="btn btn-secondary btn-sm" style="width:100%;" data-link>View Event Details</a>
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
