/**
 * TPO Connect — Event Details View
 */
window.EventDetailPage = {
  async render(params) {
    const app = document.getElementById('app');
    app.innerHTML = '<div class="spinner"></div>';

    try {
      const eventId = (typeof params === 'object' && params !== null) ? (params.id || params._id) : params;
      const event = await window.API.get(`/events/${eventId}`);

      app.innerHTML = `
        <div class="container section">
          <div style="margin-bottom: 1.5rem;">
            <a href="/events" class="btn btn-outline btn-sm" data-link>&larr; Back to Events</a>
          </div>

          <div class="card" style="max-width: 860px; margin: 0 auto; overflow: hidden; padding: 0;">
            ${event.bannerImage ? `
              <div style="height: 320px; overflow: hidden;">
                <img src="${event.bannerImage}" alt="${event.title}" style="width: 100%; height: 100%; object-fit: cover;">
              </div>
            ` : ''}

            <div style="padding: 2.5rem;">
              <span class="badge badge-primary">${event.category}</span>
              <h1 style="font-size: 2.25rem; font-weight: 800; margin-top: 0.5rem; margin-bottom: 0.5rem; color: var(--text-main); line-height: 1.2;">
                ${window.UI.escapeHtml(event.title)}
              </h1>
              <p style="font-size: 1.1rem; color: var(--primary); font-weight: 700; margin-bottom: 1.5rem;">
                ${window.UI.escapeHtml(event.speakerOrGuest || '')} ${event.organization ? `(${window.UI.escapeHtml(event.organization)})` : ''}
              </p>

              <div class="grid grid-cols-3" style="background: var(--bg-subtle); padding: 1.25rem; border-radius: var(--radius-md); margin-bottom: 2rem;">
                <div>
                  <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600;">DATE</span>
                  <div style="font-weight: 700; font-size: 1.05rem;">${window.UI.formatDate(event.eventDate)}</div>
                </div>
                <div>
                  <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600;">TIME</span>
                  <div style="font-weight: 700; font-size: 1.05rem;">${window.UI.escapeHtml(event.time || '10:00 AM')}</div>
                </div>
                <div>
                  <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600;">LOCATION</span>
                  <div style="font-weight: 700; font-size: 1.05rem;">${window.UI.escapeHtml(event.venue || 'Auditorium')}</div>
                </div>
              </div>

              <div style="margin-bottom: 2rem;">
                <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 0.75rem;">Event Overview & Details</h3>
                <p style="color: var(--text-muted); line-height: 1.8; font-size: 1rem;">
                  ${window.UI.escapeHtml(event.description || 'Exclusive industry engagement session organized by Training and Placement Cell.')}
                </p>
              </div>

              ${event.registrationLink ? `
                <div style="text-align: center; border-top: 1px solid var(--border-color); padding-top: 1.5rem;">
                  <a href="${event.registrationLink}" target="_blank" class="btn btn-primary btn-lg">Register for this Event &nearr;</a>
                </div>
              ` : `
                <div style="background: var(--primary-light); padding: 1rem; border-radius: var(--radius-md); text-align: center; color: var(--primary); font-weight: 600;">
                  Open to all registered students. Walk-in entry at the venue.
                </div>
              `}
            </div>
          </div>
        </div>
      `;
    } catch (err) {
      console.error(err);
      app.innerHTML = `<div class="container section">Error: ${err.message}</div>`;
    }
  }
};
