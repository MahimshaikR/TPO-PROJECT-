/**
 * TPO Connect — Dynamic Client-Side Router
 * Supports HTML5 History API, parameterized routes, and RBAC guards
 */
class Router {
  constructor() {
    this.routes = [];
    this.currentRoute = null;
    this.currentParams = {};

    window.addEventListener('popstate', () => {
      this.handleRoute(window.location.pathname);
    });

    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (link && (link.hasAttribute('data-link') || this.isInternalLink(link.href))) {
        const target = link.getAttribute('target');
        if (target === '_blank') return;

        const href = link.getAttribute('href');
        if (href && (href.startsWith('/') || href.startsWith(window.location.origin))) {
          e.preventDefault();
          const cleanPath = href.startsWith('http') ? new URL(href).pathname : href;
          this.navigate(cleanPath);
        }
      }
    });
  }

  isInternalLink(url) {
    if (!url) return false;
    return url.startsWith(window.location.origin) || url.startsWith('/');
  }

  addRoute(pattern, handler, options = {}) {
    // Convert pattern like /placements/drives/:id to regex
    const paramNames = [];
    const regexPath = pattern.replace(/:([a-zA-Z0-9_]+)/g, (_, paramName) => {
      paramNames.push(paramName);
      return '([^/]+)';
    });

    const regex = new RegExp(`^${regexPath}$`);

    this.routes.push({
      pattern,
      regex,
      paramNames,
      handler,
      roles: options.roles || null,
      authRequired: options.authRequired || false,
      title: options.title || 'TPO Connect'
    });
  }

  navigate(path) {
    window.history.pushState(null, null, path);
    this.handleRoute(path);
  }

  async handleRoute(path) {
    const cleanPath = path.split('?')[0] || '/';
    let matched = null;
    let params = {};

    for (const route of this.routes) {
      const match = cleanPath.match(route.regex);
      if (match) {
        matched = route;
        route.paramNames.forEach((name, index) => {
          params[name] = decodeURIComponent(match[index + 1]);
        });
        break;
      }
    }

    if (!matched) {
      // Check 404
      const notFoundRoute = this.routes.find(r => r.pattern === '/404');
      if (notFoundRoute) {
        document.title = '404 — Page Not Found | TPO Connect';
        window.UI?.renderNavbar(cleanPath);
        window.UI?.renderFooter();
        await notFoundRoute.handler({}, cleanPath);
      }
      return;
    }

    // Role-based Access Control Guard
    if (matched.authRequired || matched.roles) {
      const isAuth = window.State?.isAuthenticated();
      const userRole = window.State?.getRole();

      if (!isAuth) {
        window.UI?.toast('Please log in to access this portal.', 'warning');
        if (cleanPath.startsWith('/admin')) {
          this.navigate('/admin/login');
        } else if (cleanPath.startsWith('/recruiter')) {
          this.navigate('/recruiter/login');
        } else if (cleanPath.startsWith('/coordinator')) {
          this.navigate('/coordinator/login');
        } else {
          this.navigate('/student/login');
        }
        return;
      }

      if (matched.roles && matched.roles.length > 0) {
        const adminRoles = ['ADMIN', 'TP_OFFICER', 'SUPER_ADMIN'];
        const isPermitted = matched.roles.some(role => {
          if (role === 'ADMIN' && adminRoles.includes(userRole)) return true;
          return role === userRole;
        });

        if (!isPermitted) {
          window.UI?.toast(`Access denied: You do not have permission to view ${cleanPath}`, 'error');
          if (adminRoles.includes(userRole)) this.navigate('/admin/dashboard');
          else if (userRole === 'RECRUITER') this.navigate('/recruiter/dashboard');
          else if (userRole === 'COORDINATOR') this.navigate('/coordinator/dashboard');
          else this.navigate('/student/dashboard');
          return;
        }
      }
    }

    this.currentRoute = matched;
    this.currentParams = params;

    document.title = `${matched.title} | TPO Connect`;
    window.scrollTo(0, 0);

    window.UI?.renderNavbar(cleanPath);
    window.UI?.renderFooter();

    const appContainer = document.getElementById('app');
    if (appContainer) {
      appContainer.innerHTML = '<div class="spinner"></div>';
    }

    try {
      await matched.handler(params, cleanPath);
    } catch (err) {
      console.error('Routing execution error:', err);
      if (appContainer) {
        appContainer.innerHTML = `
          <div class="container section" style="text-align: center;">
            <div class="card" style="max-width: 500px; margin: 0 auto; padding: 2.5rem;">
              <h2 style="color: var(--danger); margin-bottom: 1rem;">Unable to load page</h2>
              <p style="color: var(--text-muted); margin-bottom: 1.5rem;">${err.message || 'An unexpected error occurred while loading this view.'}</p>
              <button class="btn btn-primary" onclick="window.Router.navigate('/')">Return to Home</button>
            </div>
          </div>
        `;
      }
    }
  }
}

window.Router = new Router();
