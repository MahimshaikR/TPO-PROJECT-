/**
 * TPO Connect — Authentication Views (Login, Student & Recruiter Register, Forgot & Reset Password)
 */
window.AuthPage = {
  renderLogin(role = 'ALL') {
    if (role === 'ALL') {
      this.renderPortalGateway();
    } else {
      this.renderRoleLogin(role);
    }
  },

  renderPortalGateway() {
    const app = document.getElementById('app');
    const settings = window.State?.getSettings() || {};
    const collegeName = settings.collegeName || 'NRIIT ENGINEERING COLLEGE';

    app.innerHTML = `
      <div class="container section">
        <!-- Breadcrumb -->
        <div style="font-size:0.85rem; color:#64748b; margin-bottom:1.5rem; display:flex; align-items:center; gap:0.5rem;">
          <a href="/" data-link style="color:#64748b; text-decoration:none;">Home</a>
          <span>/</span>
          <span style="color:#0f172a; font-weight:600;">Portal Gateway</span>
        </div>

        <!-- Section Header -->
        <div class="section-title-wrap" style="text-align:center; max-width:850px; margin:0 auto 3rem auto;">
          <span class="section-badge" style="background:#e0f2fe; color:#0369a1; padding:0.25rem 0.85rem; border-radius:999px; font-size:0.8rem; font-weight:700; letter-spacing:0.05em; text-transform:uppercase; display:inline-block; margin-bottom:0.75rem;">SECURE INSTITUTIONAL AUTHENTICATION</span>
          <h1 class="section-title" style="font-size:2.3rem; font-weight:800; color:#0f172a; letter-spacing:-0.02em; margin-bottom:0.75rem;">TPO Connect Portal Gateway</h1>
          <p class="section-subtitle" style="font-size:1.05rem; color:#475569; line-height:1.6;">
            Select your specialized platform below to review portal features, view authorized capabilities, and sign in to your dashboard.
          </p>
        </div>

        <!-- 4 Role Information Cards -->
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:1.75rem; margin-bottom:3.5rem;">
          
          <!-- Card 1: Student Portal -->
          <div class="card" style="display:flex; flex-direction:column; justify-content:space-between; padding:2rem; border-radius:12px; border:1px solid #e2e8f0; border-top:4px solid #0284c7; background:#ffffff; box-shadow:0 4px 6px -1px rgba(0,0,0,0.05); transition:transform 0.2s, box-shadow 0.2s;">
            <div>
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
                <div style="width:48px; height:48px; border-radius:10px; background:#e0f2fe; color:#0284c7; display:flex; align-items:center; justify-content:center; font-size:1.5rem;">🎓</div>
                <span class="badge" style="background:#f0f9ff; color:#0284c7; font-weight:700;">STUDENTS</span>
              </div>
              <h2 style="font-size:1.3rem; font-weight:800; color:#0f172a; margin-bottom:0.5rem;">Student Portal</h2>
              <p style="font-size:0.88rem; color:#64748b; line-height:1.6; margin-bottom:1.25rem;">
                Dedicated career suite for enrolled students to apply for on-campus drives, complete training assessments, and track interview offers.
              </p>
              
              <div style="background:#f8fafc; border-radius:8px; padding:1rem; margin-bottom:1.5rem; font-size:0.82rem; color:#334155;">
                <div style="font-weight:700; color:#0f172a; margin-bottom:0.5rem; text-transform:uppercase; font-size:0.75rem; letter-spacing:0.04em;">Portal Capabilities:</div>
                <div style="display:flex; flex-direction:column; gap:0.4rem;">
                  <div>✓ Apply for verified campus recruitment drives</div>
                  <div>✓ Live application & interview round tracker</div>
                  <div>✓ Aptitude, DSA & company-specific modules</div>
                  <div>✓ ATS-formatted single-page resume builder</div>
                </div>
              </div>
            </div>

            <div>
              <a href="/student/login" class="btn btn-primary" style="width:100%; justify-content:center; font-weight:700; background:#0284c7; margin-bottom:0.75rem;" data-link>
                Open Student Login &rarr;
              </a>
              <div style="text-align:center; font-size:0.8rem; color:#64748b;">
                First time user? <a href="/register/student" style="color:#0284c7; font-weight:600;" data-link>Register Profile</a>
              </div>
            </div>
          </div>

          <!-- Card 2: Recruiter Portal -->
          <div class="card" style="display:flex; flex-direction:column; justify-content:space-between; padding:2rem; border-radius:12px; border:1px solid #e2e8f0; border-top:4px solid #0f172a; background:#ffffff; box-shadow:0 4px 6px -1px rgba(0,0,0,0.05); transition:transform 0.2s, box-shadow 0.2s;">
            <div>
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
                <div style="width:48px; height:48px; border-radius:10px; background:#f1f5f9; color:#0f172a; display:flex; align-items:center; justify-content:center; font-size:1.5rem;">🏢</div>
                <span class="badge" style="background:#f8fafc; color:#0f172a; font-weight:700;">EMPLOYERS</span>
              </div>
              <h2 style="font-size:1.3rem; font-weight:800; color:#0f172a; margin-bottom:0.5rem;">Recruiter Portal</h2>
              <p style="font-size:0.88rem; color:#64748b; line-height:1.6; margin-bottom:1.25rem;">
                Enterprise campus recruitment platform for visiting corporations to configure drive eligibility, evaluate resumes, and roll out offers.
              </p>
              
              <div style="background:#f8fafc; border-radius:8px; padding:1rem; margin-bottom:1.5rem; font-size:0.82rem; color:#334155;">
                <div style="font-weight:700; color:#0f172a; margin-bottom:0.5rem; text-transform:uppercase; font-size:0.75rem; letter-spacing:0.04em;">Portal Capabilities:</div>
                <div style="display:flex; flex-direction:column; gap:0.4rem;">
                  <div>✓ Post job drives, packages, and eligibility criteria</div>
                  <div>✓ Filter and review verified student candidates</div>
                  <div>✓ Schedule technical & HR interview rounds</div>
                  <div>✓ Direct digital offer rollout & confirmation</div>
                </div>
              </div>
            </div>

            <div>
              <a href="/recruiter/login" class="btn btn-primary" style="width:100%; justify-content:center; font-weight:700; background:#0f172a; margin-bottom:0.75rem;" data-link>
                Open Recruiter Login &rarr;
              </a>
              <div style="text-align:center; font-size:0.8rem; color:#64748b;">
                Visiting Employer? <a href="/register/recruiter" style="color:#0f172a; font-weight:600;" data-link>Register Company</a>
              </div>
            </div>
          </div>

          <!-- Card 3: Coordinator Portal -->
          <div class="card" style="display:flex; flex-direction:column; justify-content:space-between; padding:2rem; border-radius:12px; border:1px solid #e2e8f0; border-top:4px solid #4338ca; background:#ffffff; box-shadow:0 4px 6px -1px rgba(0,0,0,0.05); transition:transform 0.2s, box-shadow 0.2s;">
            <div>
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
                <div style="width:48px; height:48px; border-radius:10px; background:#e0e7ff; color:#4338ca; display:flex; align-items:center; justify-content:center; font-size:1.5rem;">👨‍🏫</div>
                <span class="badge" style="background:#eef2ff; color:#4338ca; font-weight:700;">COORDINATORS</span>
              </div>
              <h2 style="font-size:1.3rem; font-weight:800; color:#0f172a; margin-bottom:0.5rem;">Coordinator Portal</h2>
              <p style="font-size:0.88rem; color:#64748b; line-height:1.6; margin-bottom:1.25rem;">
                Departmental coordination workspace for faculty placement coordinators and academic branch leads to monitor student compliance.
              </p>
              
              <div style="background:#f8fafc; border-radius:8px; padding:1rem; margin-bottom:1.5rem; font-size:0.82rem; color:#334155;">
                <div style="font-weight:700; color:#0f172a; margin-bottom:0.5rem; text-transform:uppercase; font-size:0.75rem; letter-spacing:0.04em;">Portal Capabilities:</div>
                <div style="display:flex; flex-direction:column; gap:0.4rem;">
                  <div>✓ Departmental student roster & backlog audits</div>
                  <div>✓ Training program attendance & session verification</div>
                  <div>✓ Drive coordination & test venue invigilation</div>
                  <div>✓ Log NAAC Criterion 5 & NBA activity evidence</div>
                </div>
              </div>
            </div>

            <div>
              <a href="/coordinator/login" class="btn btn-primary" style="width:100%; justify-content:center; font-weight:700; background:#4338ca; margin-bottom:0.75rem;" data-link>
                Open Coordinator Login &rarr;
              </a>
              <div style="text-align:center; font-size:0.8rem; color:#64748b;">
                Faculty access assigned by Department Head
              </div>
            </div>
          </div>

          <!-- Card 4: Administration & Officer Portal -->
          <div class="card" style="display:flex; flex-direction:column; justify-content:space-between; padding:2rem; border-radius:12px; border:1px solid #e2e8f0; border-top:4px solid #059669; background:#ffffff; box-shadow:0 4px 6px -1px rgba(0,0,0,0.05); transition:transform 0.2s, box-shadow 0.2s;">
            <div>
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
                <div style="width:48px; height:48px; border-radius:10px; background:#ecfdf5; color:#059669; display:flex; align-items:center; justify-content:center; font-size:1.5rem;">🛡️</div>
                <span class="badge" style="background:#ecfdf5; color:#059669; font-weight:700;">DIRECTORATE</span>
              </div>
              <h2 style="font-size:1.3rem; font-weight:800; color:#0f172a; margin-bottom:0.5rem;">Admin & Officer Portal</h2>
              <p style="font-size:0.88rem; color:#64748b; line-height:1.6; margin-bottom:1.25rem;">
                Central management portal for T&P Dean, Head Officers, Super Admins, and Principal to orchestrate campus-wide hiring.
              </p>
              
              <div style="background:#f8fafc; border-radius:8px; padding:1rem; margin-bottom:1.5rem; font-size:0.82rem; color:#334155;">
                <div style="font-weight:700; color:#0f172a; margin-bottom:0.5rem; text-transform:uppercase; font-size:0.75rem; letter-spacing:0.04em;">Portal Capabilities:</div>
                <div style="display:flex; flex-direction:column; gap:0.4rem;">
                  <div>✓ Placement drive approval & calendar management</div>
                  <div>✓ Institutional analytics, NIRF & NAAC reports</div>
                  <div>✓ Corporate recruiter registration approvals</div>
                  <div>✓ Immutable security audit logs & system configs</div>
                </div>
              </div>
            </div>

            <div>
              <a href="/admin/login" class="btn btn-primary" style="width:100%; justify-content:center; font-weight:700; background:#059669; margin-bottom:0.75rem;" data-link>
                Open Admin Login &rarr;
              </a>
              <div style="text-align:center; font-size:0.8rem; color:#64748b;">
                Strict RBAC security authentication
              </div>
            </div>
          </div>

        </div>

        <!-- Helpdesk & Assistance Bar -->
        <div class="card" style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:1.5rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem;">
          <div style="display:flex; align-items:center; gap:0.75rem;">
            <span style="font-size:1.75rem;">💡</span>
            <div>
              <h3 style="font-size:1rem; font-weight:800; color:#0f172a; margin:0 0 0.15rem 0;">Need Assistance or Forgot Credentials?</h3>
              <p style="font-size:0.85rem; color:#64748b; margin:0;">
                Our helpdesk supports students, recruiters, and faculty with portal access and credentials.
              </p>
            </div>
          </div>
          <div style="display:flex; gap:0.75rem;">
            <a href="/forgot-password" class="btn btn-outline btn-sm" data-link>Forgot Password</a>
            <a href="/contact" class="btn btn-primary btn-sm" data-link>Contact T&P Office</a>
          </div>
        </div>
      </div>
    `;
  },

  renderRoleLogin(role = 'STUDENT') {
    const app = document.getElementById('app');

    const roleConfigs = {
      STUDENT: {
        title: 'Student Portal Login',
        badge: 'STUDENT AUTHENTICATION',
        badgeBg: '#e0f2fe',
        badgeColor: '#0284c7',
        icon: '🎓',
        accentColor: '#0284c7',
        info: 'Log in with your official college email ID to view and apply for placement drives.',
        demoEmail: 'mahi.cse23@nriit.edu.in',
        demoPass: 'Student@123',
        regLink: '/register/student',
        regText: "Don't have a student account? Register Profile"
      },
      RECRUITER: {
        title: 'Corporate Recruiter Login',
        badge: 'RECRUITER AUTHENTICATION',
        badgeBg: '#f1f5f9',
        badgeColor: '#0f172a',
        icon: '🏢',
        accentColor: '#0f172a',
        info: 'Sign in to review applicant resumes, schedule interview slots, and roll out offers.',
        demoEmail: 'recruiter@google.com',
        demoPass: 'Recruiter@123',
        regLink: '/register/recruiter',
        regText: 'New corporate partner? Register Company'
      },
      COORDINATOR: {
        title: 'Faculty Coordinator Login',
        badge: 'FACULTY & COORDINATOR',
        badgeBg: '#e0e7ff',
        badgeColor: '#4338ca',
        icon: '👨‍🏫',
        accentColor: '#4338ca',
        info: 'Access departmental rosters, manage attendance, and submit accreditation evidence.',
        demoEmail: 'coordinator.cse@nriit.edu.in',
        demoPass: 'Coord@123',
        regLink: null,
        regText: 'Faculty coordinator accounts are provisioned by T&P Admin'
      },
      ADMIN: {
        title: 'T&P Administration & Officer Login',
        badge: 'OFFICER & SUPER ADMIN',
        badgeBg: '#ecfdf5',
        badgeColor: '#059669',
        icon: '🛡️',
        accentColor: '#059669',
        info: 'Administrative command center for drive publishing, NIRF analytics, and settings.',
        demoEmail: 'admin@nriit.edu.in',
        demoPass: 'Admin@123',
        regLink: null,
        regText: 'Restricted access for authorized college administration'
      }
    };

    const cfg = roleConfigs[role] || roleConfigs.STUDENT;

    app.innerHTML = `
      <div class="container section" style="display:flex; justify-content:center; align-items:center; min-height:75vh; padding:2rem 1rem;">
        <div class="card" style="max-width: 480px; width: 100%; padding: 2.5rem; border-radius: 12px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.08), 0 8px 10px -6px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; border-top: 4px solid ${cfg.accentColor}; background: #ffffff;">
          
          <!-- Top Back Link -->
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem;">
            <a href="/login" data-link style="font-size:0.84rem; color:#64748b; text-decoration:none; display:inline-flex; align-items:center; gap:0.35rem; font-weight:600;">
              &larr; All Portals Directory
            </a>
            <span class="badge" style="background:${cfg.badgeBg}; color:${cfg.badgeColor}; font-size:0.72rem; font-weight:700;">
              ${cfg.badge}
            </span>
          </div>

          <div style="text-align:center; margin-bottom: 1.75rem;">
            <div style="width:52px; height:52px; border-radius:12px; background:${cfg.badgeBg}; color:${cfg.accentColor}; display:flex; align-items:center; justify-content:center; font-size:1.6rem; margin:0 auto 0.75rem auto;">
              ${cfg.icon}
            </div>
            <h1 style="font-size: 1.55rem; font-weight: 800; color: #0f172a; margin-bottom: 0.35rem;">
              ${cfg.title}
            </h1>
            <p style="font-size: 0.88rem; color: #64748b; line-height: 1.5;">
              ${cfg.info}
            </p>
          </div>

          <!-- Quick Role Selector Tabs -->
          <div style="display:flex; gap:0.25rem; background:#f1f5f9; padding:0.25rem; border-radius:8px; margin-bottom:1.5rem; font-size:0.8rem; font-weight:600;">
            <a href="/student/login" class="btn btn-sm ${role === 'STUDENT' ? 'btn-primary' : 'btn-outline'}" style="flex:1; border:none; padding:0.4rem 0.2rem; font-size:0.78rem;" data-link>Student</a>
            <a href="/recruiter/login" class="btn btn-sm ${role === 'RECRUITER' ? 'btn-primary' : 'btn-outline'}" style="flex:1; border:none; padding:0.4rem 0.2rem; font-size:0.78rem;" data-link>Recruiter</a>
            <a href="/coordinator/login" class="btn btn-sm ${role === 'COORDINATOR' ? 'btn-primary' : 'btn-outline'}" style="flex:1; border:none; padding:0.4rem 0.2rem; font-size:0.78rem;" data-link>Coord</a>
            <a href="/admin/login" class="btn btn-sm ${role === 'ADMIN' ? 'btn-primary' : 'btn-outline'}" style="flex:1; border:none; padding:0.4rem 0.2rem; font-size:0.78rem;" data-link>Admin</a>
          </div>

          <form id="login-form" onsubmit="window.AuthPage.handleLogin(event, '${role}')">
            <div style="margin-bottom: 1.25rem;">
              <label class="filter-label" style="display:block; font-size:0.85rem; font-weight:600; color:#334155; margin-bottom:0.35rem;">Official Email Address:</label>
              <input type="email" id="login-email" class="form-input form-control" required placeholder="name@domain.edu" autocomplete="username">
            </div>

            <div style="margin-bottom: 1.25rem;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.35rem;">
                <label class="filter-label" style="font-size:0.85rem; font-weight:600; color:#334155; margin-bottom:0;">Password:</label>
                <a href="/forgot-password" style="font-size:0.8rem; color:#0284c7; text-decoration:none;" data-link>Forgot Password?</a>
              </div>
              <input type="password" id="login-password" class="form-input form-control" required placeholder="••••••••" autocomplete="current-password">
            </div>

            <button type="submit" class="btn btn-primary" id="btn-login-submit" style="width: 100%; margin-top: 0.5rem; background:${cfg.accentColor}; font-weight:700; padding:0.65rem;">
              Sign In to ${cfg.title.split(' ')[0]} Portal
            </button>
          </form>

          <!-- 1-Click Institutional Demo Credentials -->
          <div style="background:#f8fafc; border:1px dashed #cbd5e1; border-radius:8px; padding:0.85rem; margin-top:1.25rem;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
              <span style="font-size:0.72rem; font-weight:700; color:#64748b; text-transform:uppercase; letter-spacing:0.04em;">
                ⚡ 1-Click Demo Fill
              </span>
              <button type="button" 
                      class="btn btn-sm btn-outline" 
                      style="font-size:0.75rem; padding:0.2rem 0.5rem; border-color:${cfg.accentColor}; color:${cfg.accentColor};" 
                      onclick="document.getElementById('login-email').value='${cfg.demoEmail}'; document.getElementById('login-password').value='${cfg.demoPass}';">
                Fill ${cfg.title.split(' ')[0]} Credentials
              </button>
            </div>
            <div style="font-size:0.75rem; color:#64748b; line-height:1.4;">
              Demo Account: <code style="background:#f1f5f9; padding:0.1rem 0.35rem; border-radius:4px; color:#0f172a;">${cfg.demoEmail}</code>
            </div>
          </div>

          <div style="border-top:1px solid #e2e8f0; margin-top:1.25rem; padding-top:1rem; text-align:center; font-size:0.85rem; color:#64748b;">
            ${cfg.regLink ? `
              <a href="${cfg.regLink}" style="color:${cfg.accentColor}; font-weight:600; text-decoration:none;" data-link>${cfg.regText} &rarr;</a>
            ` : `
              <span style="font-size:0.8rem;">${cfg.regText}</span>
            `}
          </div>
        </div>
      </div>
    `;
  },

  async handleLogin(e, role) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const btn = document.getElementById('btn-login-submit');

    btn.disabled = true;
    btn.innerText = 'Verifying credentials...';

    try {
      const res = await window.API.post('/auth/login', { email, password, role });
      window.State.setAuth(res.token, res.user);
      window.UI.toast(`Welcome back, ${res.user.name}!`, 'success');

      // Check for redirect param
      const urlParams = new URLSearchParams(window.location.search);
      const redirectUrl = urlParams.get('redirect');
      if (redirectUrl && (redirectUrl.startsWith('/') || redirectUrl.startsWith(window.location.origin))) {
        const cleanRedirect = redirectUrl.startsWith('http') ? new URL(redirectUrl).pathname : redirectUrl;
        window.Router.navigate(cleanRedirect);
        return;
      }

      // Institutional 7-role redirection
      const userRole = res.user.role;
      if (['ADMIN', 'TP_OFFICER', 'SUPER_ADMIN', 'MANAGEMENT_PRINCIPAL'].includes(userRole)) {
        window.Router.navigate('/admin/dashboard');
      } else if (['COORDINATOR', 'TP_COORDINATOR', 'DEPARTMENT_COORDINATOR'].includes(userRole)) {
        window.Router.navigate('/coordinator/dashboard');
      } else if (userRole === 'RECRUITER') {
        window.Router.navigate('/recruiter/dashboard');
      } else {
        window.Router.navigate('/student/dashboard');
      }
    } catch (err) {
      window.UI.toast(err.message, 'error');
      btn.disabled = false;
      btn.innerText = 'Sign In to Portal';
    }
  },

  renderRegister(role = 'STUDENT') {
    if (role === 'RECRUITER') {
      window.Router.navigate('/recruit-with-us');
    } else {
      this.renderRegisterStudent();
    }
  },

  renderRegisterStudent() {
    const app = document.getElementById('app');
    const settings = window.State?.getSettings() || {};
    const branches = settings.branches || ['CSE', 'IT', 'ECE', 'EEE', 'AIML', 'Data Science', 'Mechanical', 'Civil'];
    const batches = ['2026', '2027', '2028'];

    app.innerHTML = `
      <div class="container section" style="display:flex; justify-content:center; align-items:center;">
        <div class="card" style="max-width: 600px; width: 100%; padding: 2.5rem; box-shadow: var(--shadow-xl);">
          <div style="text-align:center; margin-bottom: 2rem;">
            <span class="badge badge-primary" style="margin-bottom:0.5rem;">STUDENT REGISTRATION</span>
            <h1 style="font-size: 1.65rem; font-weight: 800; color: var(--text-main);">Create Student Profile</h1>
            <p style="font-size: 0.88rem; color: var(--text-muted);">Enroll into the official T&P recruitment portal.</p>
          </div>

          <form id="student-reg-form" onsubmit="window.AuthPage.handleStudentRegister(event)">
            <div class="grid grid-cols-2" style="gap:1rem; margin-bottom:1rem;">
              <div>
                <label class="filter-label">Full Name:</label>
                <input type="text" id="reg-name" class="form-input" required placeholder="Full Name">
              </div>
              <div>
                <label class="filter-label">Roll / University ID:</label>
                <input type="text" id="reg-roll" class="form-input" required placeholder="e.g. 23CS001">
              </div>
            </div>

            <div class="grid grid-cols-2" style="gap:1rem; margin-bottom:1rem;">
              <div>
                <label class="filter-label">College Email:</label>
                <input type="email" id="reg-email" class="form-input" required placeholder="roll.branch@college.edu">
              </div>
              <div>
                <label class="filter-label">Phone Number:</label>
                <input type="tel" id="reg-phone" class="form-input" required placeholder="+91 98765 43210">
              </div>
            </div>

            <div class="grid grid-cols-2" style="gap:1rem; margin-bottom:1rem;">
              <div>
                <label class="filter-label">Branch / Department:</label>
                <select id="reg-branch" class="form-select">
                  ${branches.map(b => `<option value="${b}">${b}</option>`).join('')}
                </select>
              </div>
              <div>
                <label class="filter-label">Graduating Batch:</label>
                <select id="reg-batch" class="form-select">
                  ${batches.map(b => `<option value="${b}">${b}</option>`).join('')}
                </select>
              </div>
            </div>

            <div class="grid grid-cols-2" style="gap:1rem; margin-bottom:1rem;">
              <div>
                <label class="filter-label">Current CGPA (out of 10):</label>
                <input type="number" id="reg-cgpa" class="form-input" step="0.01" min="0" max="10" required placeholder="8.50">
              </div>
              <div>
                <label class="filter-label">Active Backlogs:</label>
                <input type="number" id="reg-backlogs" class="form-input" min="0" max="20" required value="0">
              </div>
            </div>

            <div style="margin-bottom: 1.5rem;">
              <label class="filter-label">Choose Password:</label>
              <input type="password" id="reg-password" class="form-input" required placeholder="Minimum 6 characters">
            </div>

            <button type="submit" class="btn btn-primary" style="width: 100%;">Create Student Account</button>
          </form>

          <div style="margin-top:1.5rem; text-align:center; font-size:0.85rem; color:var(--text-muted);">
            Already have an account? <a href="/student/login" data-link>Login here</a>
          </div>
        </div>
      </div>
    `;
  },

  async handleStudentRegister(e) {
    e.preventDefault();
    const name = document.getElementById('reg-name').value;
    const rollNumber = document.getElementById('reg-roll').value;
    const email = document.getElementById('reg-email').value;
    const phone = document.getElementById('reg-phone').value;
    const branch = document.getElementById('reg-branch').value;
    const batch = document.getElementById('reg-batch').value;
    const cgpa = document.getElementById('reg-cgpa').value;
    const backlogs = document.getElementById('reg-backlogs').value;
    const password = document.getElementById('reg-password').value;

    try {
      const res = await window.API.post('/auth/register/student', {
        name,
        rollNumber,
        email,
        phone,
        branch,
        batch,
        cgpa,
        backlogs,
        password
      });

      window.State.setAuth(res.token, res.user);
      window.UI.toast('Account registered successfully! Welcome to Student Portal.', 'success');
      window.Router.navigate('/student/dashboard');
    } catch (err) {
      window.UI.toast(err.message, 'error');
    }
  },

  renderForgotPassword() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="container section" style="display:flex; justify-content:center; align-items:center; min-height:60vh;">
        <div class="card" style="max-width: 440px; width: 100%; padding: 2.5rem;">
          <h2 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 0.5rem;">Forgot Password</h2>
          <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 1.5rem;">
            Enter your registered email address and we'll generate password reset instructions.
          </p>
          <form onsubmit="window.AuthPage.handleForgotPassword(event)">
            <div style="margin-bottom: 1.5rem;">
              <label class="filter-label">Registered Email:</label>
              <input type="email" id="forgot-email" class="form-input" required placeholder="name@domain.com">
            </div>
            <button type="submit" class="btn btn-primary" style="width: 100%;">Send Reset Instructions</button>
          </form>
          <div style="margin-top: 1.5rem; text-align: center;">
            <a href="/login" class="btn btn-outline btn-sm" data-link>&larr; Back to Login</a>
          </div>
        </div>
      </div>
    `;
  },

  async handleForgotPassword(e) {
    e.preventDefault();
    const email = document.getElementById('forgot-email').value;
    try {
      const res = await window.API.post('/auth/forgot-password', { email });
      window.UI.modal({
        title: 'Reset Instructions Issued',
        content: `
          <p style="color:var(--text-muted); font-size:0.95rem; line-height:1.6;">
            ${res.message || 'Password reset link generated.'}
          </p>
          ${res.data?.resetUrl ? `
            <div style="margin-top:1rem; background:var(--bg-subtle); padding:0.75rem; border-radius:var(--radius-sm); font-size:0.85rem; word-break:break-all;">
              Direct Link: <a href="${res.data.resetUrl}" data-link>${res.data.resetUrl}</a>
            </div>
          ` : ''}
        `
      });
    } catch (err) {
      window.UI.toast(err.message, 'error');
    }
  },

  renderResetPassword(params) {
    const token = params.token;
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="container section" style="display:flex; justify-content:center; align-items:center; min-height:60vh;">
        <div class="card" style="max-width: 440px; width: 100%; padding: 2.5rem;">
          <h2 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 0.5rem;">Set New Password</h2>
          <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 1.5rem;">
            Create a secure password with at least 6 characters.
          </p>
          <form onsubmit="window.AuthPage.handleResetPassword(event, '${token}')">
            <div style="margin-bottom: 1.5rem;">
              <label class="filter-label">New Password:</label>
              <input type="password" id="reset-new-password" class="form-input" required placeholder="Minimum 6 characters">
            </div>
            <button type="submit" class="btn btn-primary" style="width: 100%;">Update Password</button>
          </form>
        </div>
      </div>
    `;
  },

  async handleResetPassword(e, token) {
    e.preventDefault();
    const password = document.getElementById('reset-new-password').value;
    try {
      await window.API.post(`/auth/reset-password/${token}`, { password });
      window.UI.toast('Password updated successfully! Please log in.', 'success');
      window.Router.navigate('/login');
    } catch (err) {
      window.UI.toast(err.message, 'error');
    }
  },

  async handleLogout() {
    try {
      await window.API.post('/auth/logout');
    } catch (e) {
      // Ignore
    }
    window.State.clearAuth();
    window.UI.toast('You have been logged out successfully.', 'info');
    window.Router.navigate('/login');
  }
};
