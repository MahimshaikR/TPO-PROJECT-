/**
 * TPO Connect — Reusable UI Components & View Helpers
 */
class UIManager {
  constructor() {
    this.toastContainer = null;
    this.modalContainer = null;
  }

  init() {
    this.toastContainer = document.getElementById('toast-container');
    this.modalContainer = document.getElementById('modal-container');
  }

  toast(message, type = 'info', duration = 4000) {
    if (!this.toastContainer) this.init();

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const iconMap = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ'
    };

    toast.innerHTML = `
      <div style="display:flex; align-items:center; gap:0.65rem;">
        <span style="font-weight:bold; font-size:1.1rem;">${iconMap[type] || 'ℹ'}</span>
        <span>${this.escapeHtml(message)}</span>
      </div>
      <button style="color:#94a3b8; font-size:1.1rem; margin-left:1rem; cursor:pointer;" onclick="this.parentElement.remove()">✕</button>
    `;

    this.toastContainer.appendChild(toast);

    setTimeout(() => {
      if (toast.parentElement) {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 250);
      }
    }, duration);
  }

  modal({ title, content, footer, onConfirm }) {
    if (!this.modalContainer) this.init();

    this.modalContainer.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title">${this.escapeHtml(title)}</h3>
          <button class="modal-close" onclick="UI.closeModal()">&times;</button>
        </div>
        <div class="modal-body">
          ${content}
        </div>
        <div class="modal-footer">
          ${footer || `
            <button class="btn btn-secondary btn-sm" onclick="UI.closeModal()">Cancel</button>
            <button class="btn btn-primary btn-sm" id="modal-confirm-btn">Confirm</button>
          `}
        </div>
      </div>
    `;

    this.modalContainer.style.display = 'flex';

    const confirmBtn = document.getElementById('modal-confirm-btn');
    if (confirmBtn && onConfirm) {
      confirmBtn.addEventListener('click', async () => {
        confirmBtn.disabled = true;
        confirmBtn.innerText = 'Processing...';
        try {
          await onConfirm();
          this.closeModal();
        } catch (err) {
          confirmBtn.disabled = false;
          confirmBtn.innerText = 'Confirm';
          this.toast(err.message, 'error');
        }
      });
    }
  }

  showToast(message, type = 'info', duration = 4000) {
    return this.toast(message, type, duration);
  }

  renderBadge(status) {
    return this.badge(status);
  }

  openModal(htmlContent) {
    if (!this.modalContainer) this.init();
    this.modalContainer.innerHTML = `
      <div class="modal-content" style="max-height:90vh; overflow-y:auto; position:relative;">
        <button class="modal-close" style="position:absolute; right:1.25rem; top:1.25rem; font-size:1.5rem; background:none; border:none; cursor:pointer;" onclick="window.UI.closeModal()">&times;</button>
        <div class="modal-body" style="padding:1.5rem 0.5rem 0.5rem 0.5rem;">
          ${htmlContent}
        </div>
      </div>
    `;
    this.modalContainer.style.display = 'flex';
  }

  closeModal() {
    if (!this.modalContainer) this.init();
    this.modalContainer.style.display = 'none';
    this.modalContainer.innerHTML = '';
  }

  confirm(title, message, onConfirm) {
    this.modal({
      title,
      content: `<p style="color: var(--text-muted); font-size: 1rem; line-height: 1.5;">${this.escapeHtml(message)}</p>`,
      onConfirm
    });
  }

  renderNavbar(currentPath = '/') {
    const navEl = document.getElementById('main-navbar');
    if (!navEl) return;

    const user = window.State?.getUser();
    const isAuth = window.State?.isAuthenticated();
    const role = window.State?.getRole();
    const settings = window.State?.getSettings() || {};

    const collegeName = settings.collegeName || 'NRIIT ENGINEERING COLLEGE';
    const collegeLogo = settings.collegeLogo || '/assets/images/nriit-logo.png';
    const deptName = settings.departmentName || 'Training & Placement Cell';

    let portalDashboardLink = '/login';
    let roleTitle = 'Login';
    if (isAuth) {
      if (['ADMIN', 'TP_OFFICER', 'SUPER_ADMIN'].includes(role)) {
        portalDashboardLink = '/admin/dashboard';
        roleTitle = 'Admin Portal';
      } else if (role === 'RECRUITER') {
        portalDashboardLink = '/recruiter/dashboard';
        roleTitle = 'Recruiter Portal';
      } else if (role === 'COORDINATOR') {
        portalDashboardLink = '/coordinator/dashboard';
        roleTitle = 'Coordinator Portal';
      } else {
        portalDashboardLink = '/student/dashboard';
        roleTitle = 'Student Portal';
      }
    }

    const isPortal = currentPath.startsWith('/admin') ||
                     currentPath.startsWith('/student') ||
                     currentPath.startsWith('/recruiter') ||
                     currentPath.startsWith('/coordinator');

    if (isPortal && isAuth) {
      navEl.innerHTML = `
        <div class="container" style="display:flex; justify-content:space-between; align-items:center; width:100%;">
          <div style="display:flex; align-items:center; gap:1rem;">
            <a href="/" class="brand" data-link style="text-decoration:none; display:flex; align-items:center; gap:0.65rem;">
              <img src="${collegeLogo}" alt="${this.escapeHtml(collegeName)}" style="width:38px; height:38px; object-fit:contain; border-radius:50%; background:#fff; border:1px solid #e2e8f0; box-shadow:0 1px 3px rgba(0,0,0,0.1);">
              <div class="brand-text">
                <span class="brand-name" style="font-size:1rem; font-weight:800; color:#0f172a;">TPO CONNECT</span>
                <span class="brand-sub" style="font-size:0.72rem; font-weight:700; color:#0284c7;">${this.escapeHtml(collegeName)}</span>
              </div>
            </a>
            <span class="badge badge-primary" style="font-size:0.75rem;">${roleTitle}</span>
          </div>

          <div style="display:flex; align-items:center; gap:1rem;">
            <a href="/" class="btn btn-outline btn-sm" data-link title="Back to Public Site">🏠 Public Site</a>
            <div style="display:flex; align-items:center; gap:0.5rem; font-size:0.9rem;">
              <span>👤 <strong>${this.escapeHtml(user?.name || user?.fullName || 'User')}</strong></span>
            </div>
            <button class="btn btn-outline btn-sm" onclick="window.AuthPage.handleLogout()">
              🚪 Logout
            </button>
          </div>
        </div>
      `;
      return;
    }

    const tagline = settings.tagline || 'A POWERHOUSE OF TECHNOLOGY';

    const primaryLinks = [
      { path: '/', label: 'Home' },
      { path: '/about', label: 'About' },
      { path: '/team', label: 'T&P Team' },
      { path: '/placements', label: 'Placements' },
      { path: '/companies', label: 'Companies' },
      { path: '/training', label: 'Training' },
      { path: '/internships', label: 'Internships' },
      { path: '/hackathons', label: 'Hackathons' }
    ];

    const moreLinks = [
      { path: '/alumni', label: 'Alumni Network', icon: '🌟', desc: 'Mentorship & Global Directory' },
      { path: '/testimonials', label: 'Testimonials', icon: '💬', desc: 'Student & Recruiter Feedback' },
      { path: '/downloads', label: 'Downloads Center', icon: '📄', desc: 'ATS Resumes & Policy Forms' },
      { path: '/events', label: 'Placement Events', icon: '📅', desc: 'Workshops & Guest Lectures' },
      { path: '/contact', label: 'Contact T&P Office', icon: '✉️', desc: 'Office Hours & Inquiries' }
    ];

    const isMoreActive = moreLinks.some(link => currentPath.startsWith(link.path));

    navEl.innerHTML = `
      <div class="container navbar-container">
        <!-- Brand -->
        <a href="/" class="brand" data-link style="display:flex; align-items:center; gap:0.65rem; text-decoration:none;">
          <img src="${collegeLogo}" alt="${this.escapeHtml(collegeName)}" class="brand-logo-img" style="width:42px; height:42px; object-fit:contain; border-radius:50%; background:#ffffff; box-shadow:0 1px 4px rgba(0,0,0,0.15); border:1.5px solid #dbeafe; flex-shrink:0;">
          <div class="brand-text">
            <span class="brand-name" style="font-size:1.05rem; font-weight:800; color:#0f172a; line-height:1.15; letter-spacing:-0.02em;">${this.escapeHtml(collegeName)}</span>
            <div style="display:flex; align-items:center; gap:0.4rem;">
              <span class="brand-sub" style="font-size:0.72rem; color:#0284c7; font-weight:700; text-transform:uppercase; letter-spacing:0.04em; line-height:1.2;">${this.escapeHtml(deptName)}</span>
              <span style="font-size:0.55rem; background:#ecfdf5; color:#059669; font-weight:800; padding:0.05rem 0.35rem; border-radius:3px; border:1px solid #a7f3d0; text-transform:uppercase; letter-spacing:0.04em;">NAAC A+ • NBA</span>
            </div>
          </div>
        </a>

        <!-- Main Navigation Links -->
        <ul class="nav-links" id="nav-links-list">
          ${primaryLinks.map(link => {
            const isActive = currentPath === link.path || (link.path !== '/' && currentPath.startsWith(link.path));
            return `
              <li class="nav-item">
                <a href="${link.path}" class="nav-link ${isActive ? 'active' : ''}" data-link>${link.label}</a>
              </li>
            `;
          }).join('')}

          <!-- More Resources Dropdown -->
          <li class="nav-item nav-dropdown">
            <button class="nav-dropdown-btn ${isMoreActive ? 'active' : ''}">
              <span>More</span>
              <span style="font-size:0.7rem;">▾</span>
            </button>
            <div class="nav-dropdown-menu">
              ${moreLinks.map(item => `
                <a href="${item.path}" class="nav-dropdown-item" data-link>
                  <span>${item.icon}</span>
                  <div>
                    <div>${item.label}</div>
                    <span style="font-size:0.72rem; color:#64748b; font-weight:400;">${item.desc}</span>
                  </div>
                </a>
              `).join('')}
            </div>
          </li>
        </ul>

        <!-- Right Action Controls -->
        <div class="nav-actions">
          <a href="/placements" class="nav-search-btn" title="Search Placements" data-link>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#475569" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </a>

          ${isAuth ? `
            <a href="${portalDashboardLink}" class="btn btn-primary btn-sm" style="font-weight:700; background:#0284c7; padding:0.42rem 0.95rem; border-radius:6px;" data-link>
              <span>${roleTitle}</span>
            </a>
            <button class="btn btn-outline btn-sm" style="border:1.5px solid #cbd5e1; color:#475569; border-radius:6px; font-weight:600; padding:0.42rem 0.85rem;" id="btn-header-logout" onclick="window.AuthPage.handleLogout()">
              Logout
            </button>
          ` : `
            <a href="/login" class="btn-portal-login" data-link title="Access Student, Recruiter, Coordinator & Admin Portals">
              <span>Portal Login</span>
              <span style="font-size:0.9rem;">&rarr;</span>
            </a>
          `}

          <button class="mobile-menu-btn" aria-label="Toggle Navigation" onclick="document.getElementById('nav-links-list').classList.toggle('show')">☰</button>
        </div>
      </div>
    `;
  }

  renderFooter() {
    const footerEl = document.getElementById('main-footer');
    if (!footerEl) return;

    const currentPath = window.location.pathname;
    const isPortal = currentPath.startsWith('/admin') ||
                     currentPath.startsWith('/student') ||
                     currentPath.startsWith('/recruiter') ||
                     currentPath.startsWith('/coordinator');

    if (isPortal) {
      footerEl.style.display = 'none';
      return;
    }
    footerEl.style.display = 'block';

    const settings = window.State?.getSettings() || {};
    const collegeName = settings.collegeName || 'NRIIT ENGINEERING COLLEGE';
    const collegeLogo = settings.collegeLogo || '/assets/images/nriit-logo.png';
    const deptName = settings.departmentName || 'Training & Placement Cell';
    const email = settings.email || 'placements@nriit.edu.in';
    const phone = settings.phone || '+91 866 2469666';
    const address = settings.officeAddress || 'NRI Institute of Technology, Pothavarappadu (V), Agiripalli (M), Vijayawada Rural, Eluru District, Andhra Pradesh - 521212';
    const footerText = settings.footerText || `© 2026 ${collegeName}. Autonomous | NAAC A+ | NBA Accredited. All rights reserved.`;

    const social = settings.socialLinks || {};

    footerEl.innerHTML = `
      <div class="container">
        <div class="footer-grid">
          <div class="footer-col">
            <div style="display:flex; align-items:center; gap:0.75rem; margin-bottom:1rem;">
              <img src="${collegeLogo}" alt="${this.escapeHtml(collegeName)}" style="width:48px; height:48px; object-fit:contain; border-radius:50%; background:#ffffff; padding:2px; box-shadow:0 2px 8px rgba(0,0,0,0.25);">
              <div>
                <h3 style="color:#ffffff; font-weight:800; font-size:1.15rem; margin:0; line-height:1.2;">${this.escapeHtml(collegeName)}</h3>
                <span style="font-size:0.72rem; color:#38bdf8; font-weight:700; text-transform:uppercase; letter-spacing:0.04em;">${this.escapeHtml(deptName)}</span>
              </div>
            </div>
            <p style="font-size:0.88rem; line-height:1.6; margin-bottom:1.25rem; color:#cbd5e1;">
              Autonomous Institution | Approved by AICTE, New Delhi | Permanently Affiliated to JNTUK, Kakinada | Accredited by NAAC with 'A+' Grade | NBA Accredited.
            </p>
            <div style="font-size:0.85rem; line-height:1.6;">
              <p>📍 ${this.escapeHtml(address)}</p>
              <p>✉️ <a href="mailto:${email}" style="color:#94a3b8;">${email}</a></p>
              <p>📞 <a href="tel:${phone}" style="color:#94a3b8;">${phone}</a></p>
            </div>
          </div>

          <div class="footer-col">
            <h4>T&P Cell</h4>
            <ul>
              <li><a href="/about" data-link>About T&P</a></li>
              <li><a href="/team" data-link>T&P Team & Officers</a></li>
              <li><a href="/about" data-link>Placement Policy</a></li>
              <li><a href="/testimonials" data-link>Testimonials</a></li>
              <li><a href="/downloads" data-link>Downloads Center</a></li>
            </ul>
          </div>

          <div class="footer-col">
            <h4>Placements & Contests</h4>
            <ul>
              <li><a href="/placements" data-link>Placement Drives</a></li>
              <li><a href="/companies" data-link>Visiting Companies</a></li>
              <li><a href="/reports" data-link>Placement Statistics</a></li>
              <li><a href="/hackathons" data-link>Hackathons & Contests</a></li>
              <li><a href="/achievements" data-link>Hall of Fame</a></li>
              <li><a href="/alumni" data-link>Alumni Network</a></li>
            </ul>
          </div>

          <div class="footer-col">
            <h4>Students</h4>
            <ul>
              <li><a href="/student/login" data-link>Student Login</a></li>
              <li><a href="/training" data-link>Training Programs</a></li>
              <li><a href="/internships" data-link>Internship Opportunities</a></li>
              <li><a href="/downloads" data-link>ATS Resume Templates</a></li>
              <li><a href="/career-guidance" data-link>Career Guidance</a></li>
            </ul>
          </div>

          <div class="footer-col">
            <h4>Recruiters & Support</h4>
            <ul>
              <li><a href="/recruit-with-us" data-link>Recruit With Us</a></li>
              <li><a href="/recruiter/login" data-link>Recruiter Login</a></li>
              <li><a href="/admin/login" data-link>Officer & Admin Login</a></li>
              <li><a href="/faq" data-link>Frequently Asked Questions</a></li>
              <li><a href="/feedback" data-link>Feedback & Ratings</a></li>
              <li><a href="/grievance" data-link>Grievance Redressal</a></li>
            </ul>
          </div>
        </div>

        <div class="footer-bottom">
          <div>${this.escapeHtml(footerText)}</div>
          <div class="footer-social-links">
            <a href="${social.linkedin || 'https://linkedin.com'}" target="_blank" title="LinkedIn">🔗</a>
            <a href="${social.youtube || 'https://youtube.com'}" target="_blank" title="YouTube">📺</a>
            <a href="${social.facebook || 'https://facebook.com'}" target="_blank" title="Facebook">🌐</a>
            <a href="${social.instagram || 'https://instagram.com'}" target="_blank" title="Instagram">📷</a>
            <a href="${social.collegeWebsite || '#'}" target="_blank" title="College Website">🏛️</a>
          </div>
        </div>
      </div>
    `;
  }

  escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  formatCurrency(num) {
    if (!num) return '₹0 LPA';
    return `₹${num} LPA`;
  }

  formatDate(dateStr) {
    if (!dateStr) return 'N/A';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch (e) {
      return dateStr;
    }
  }

  badge(status) {
    const s = String(status || '').toUpperCase();
    if (['PLACED', 'SELECTED', 'ACCEPTED', 'APPROVED', 'ACTIVE', 'COMPLETED'].includes(s)) {
      return `<span class="badge badge-success">${s}</span>`;
    }
    if (['UPCOMING', 'INTERVIEW', 'SHORTLISTED', 'TEST_QUALIFIED', 'TIER_1'].includes(s)) {
      return `<span class="badge badge-primary">${s}</span>`;
    }
    if (['PENDING', 'REGISTERED', 'APPLIED', 'WAITLISTED', 'ONGOING'].includes(s)) {
      return `<span class="badge badge-warning">${s}</span>`;
    }
    if (['REJECTED', 'CANCELLED', 'INACTIVE', 'DECLINED'].includes(s)) {
      return `<span class="badge badge-danger">${s}</span>`;
    }
    return `<span class="badge badge-info">${s}</span>`;
  }
}

window.UI = new UIManager();
