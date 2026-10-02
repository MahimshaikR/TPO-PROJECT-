/**
 * TPO Connect — 404 Page Not Found View
 */
window.NotFoundPage = {
  render(params, path = '') {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="container section" style="text-align: center; padding: 6rem 1rem;">
        <div style="font-size: 6rem; font-weight: 900; color: var(--primary); line-height: 1; margin-bottom: 1rem;">
          404
        </div>
        <h1 style="font-size: 2.25rem; font-weight: 800; color: var(--text-main); margin-bottom: 0.75rem;">
          Page Not Found
        </h1>
        <p style="font-size: 1.15rem; color: var(--text-muted); max-width: 520px; margin: 0 auto 2.5rem auto; line-height: 1.6;">
          The page or dynamic URL you are looking for does not exist or has been moved.
          ${path ? `<br><code style="font-size:0.9rem; background:var(--bg-subtle); padding:0.2rem 0.5rem; border-radius:var(--radius-sm);">${window.UI.escapeHtml(path)}</code>` : ''}
        </p>
        <div style="display: flex; justify-content: center; gap: 1rem;">
          <a href="/" class="btn btn-primary btn-lg" data-link>Go Home</a>
          <button class="btn btn-outline btn-lg" onclick="window.history.back()">Go Back</button>
        </div>
      </div>
    `;
  }
};
