/**
 * TPO Connect — Dynamic Home Page View
 * Designed to exactly mirror the modern institutional reference layout
 * Dynamically binds data from GET /api/dashboard/public
 */
window.HomePage = {
  async render() {
    const app = document.getElementById('app');
    app.innerHTML = '<div class="spinner"></div>';

    try {
      const data = await window.API.get('/dashboard/public');
      const stats = data.statistics || {};
      const settings = data.settings || {};
      const announcements = data.announcements || [];
      const upcomingDrives = data.upcomingDrives || [];
      const recruiters = data.recruiters || [];
      const events = data.events || [];
      const successStories = data.successStories || [];

      // Format date helper for date box
      const parseDateBox = (dateStr) => {
        try {
          const d = new Date(dateStr);
          if (isNaN(d.getTime())) return { day: '15', month: 'Dec' };
          const day = String(d.getDate()).padStart(2, '0');
          const month = d.toLocaleString('en-US', { month: 'short' });
          return { day, month };
        } catch (e) {
          return { day: '15', month: 'Dec' };
        }
      };

      app.innerHTML = `
        <!-- 1. HERO SECTION -->
        <section class="hero">
          <div class="hero-cursive">Opportunities<br>Begin Here...</div>
          <div class="container" style="max-width:1380px; padding:0 1rem; position:relative; z-index:5;">
            <div class="hero-content">
              <h1 class="hero-heading">
                ${window.UI.escapeHtml(settings.heroTitle || 'Your Future\nOur Commitment').replace(/\n/g, '<br>')}
              </h1>
              <p class="hero-desc">
                ${window.UI.escapeHtml(settings.heroSubtitle || 'Empowering Students. Enabling Opportunities.\nBuilding Successful Careers.').replace(/\n/g, '<br>')}
              </p>
              <div class="hero-actions">
                <a href="/placements/drives" class="btn-hero-primary" data-link>
                  <span>🎓</span>
                  <span>Explore Placements</span>
                  <span>&rarr;</span>
                </a>
                <a href="/about" class="btn-hero-secondary" data-link>
                  About T&P
                </a>
              </div>
            </div>
          </div>
        </section>

        <!-- 2. FLOATING DYNAMIC STATISTICS STRIP -->
        <div class="container stats-strip-container" style="max-width:1380px; padding:0 1rem;">
          <div class="stats-strip">
            <!-- 1. Total Students -->
            <div class="stats-strip-item">
              <div class="stats-strip-icon" style="background:#eff6ff; color:#3b82f6;">👥</div>
              <div>
                <div class="stats-strip-value">${Number(stats.totalStudents || 4250).toLocaleString()}</div>
                <div class="stats-strip-label">Total Students</div>
              </div>
            </div>

            <!-- 2. Eligible Students -->
            <div class="stats-strip-item">
              <div class="stats-strip-icon" style="background:#eff6ff; color:#2563eb;">🎓</div>
              <div>
                <div class="stats-strip-value">${Number(stats.eligibleStudents || 3100).toLocaleString()}</div>
                <div class="stats-strip-label">Eligible Students</div>
              </div>
            </div>

            <!-- 3. Students Placed -->
            <div class="stats-strip-item">
              <div class="stats-strip-icon" style="background:#f0fdfa; color:#0d9488;">💼</div>
              <div>
                <div class="stats-strip-value">${Number(stats.studentsPlaced || 1950).toLocaleString()}</div>
                <div class="stats-strip-label">Students Placed</div>
              </div>
            </div>

            <!-- 4. Recruiting Companies -->
            <div class="stats-strip-item">
              <div class="stats-strip-icon" style="background:#f0f9ff; color:#0284c7;">🏢</div>
              <div>
                <div class="stats-strip-value">${stats.companies || 87}</div>
                <div class="stats-strip-label">Recruiting Companies</div>
              </div>
            </div>

            <!-- 5. Placement Rate -->
            <div class="stats-strip-item">
              <div class="stats-strip-icon" style="background:#fff7ed; color:#ea580c; font-weight:800;">%</div>
              <div>
                <div class="stats-strip-value">${stats.placementPercentage || 62.9}%</div>
                <div class="stats-strip-label">Placement Rate</div>
              </div>
            </div>

            <!-- 6. Highest Package -->
            <div class="stats-strip-item">
              <div class="stats-strip-icon" style="background:#faf5ff; color:#9333ea;">📊</div>
              <div>
                <div class="stats-strip-value">${stats.highestPackage || 18} LPA</div>
                <div class="stats-strip-label">Highest Package</div>
              </div>
            </div>

            <!-- 7. Average Package -->
            <div class="stats-strip-item">
              <div class="stats-strip-icon" style="background:#f0fdf4; color:#16a34a;">📈</div>
              <div>
                <div class="stats-strip-value">${stats.averagePackage || 6.8} LPA</div>
                <div class="stats-strip-label">Average Package</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 3. MIDDLE 3-COLUMN SECTION (Announcements, Drives, Officer's Message) -->
        <section class="section" style="padding-top:1rem; padding-bottom:2rem;">
          <div class="container" style="max-width:1380px; padding:0 1rem;">
            <div style="display:grid; grid-template-columns: 1fr 1.25fr 1fr; gap:1.5rem; align-items:stretch;">
              
              <!-- Column 1: Latest Announcements -->
              <div>
                <div class="dashboard-col-header">
                  <div class="col-header-title">
                    <span style="color:#0284c7; font-size:1.25rem;">📢</span>
                    <span>Latest Announcements</span>
                  </div>
                  <a href="/announcements" class="col-header-link" data-link>View All &rarr;</a>
                </div>

                <div class="card" style="padding:1rem 1.25rem; height:calc(100% - 2.5rem);">
                  <div style="display:flex; flex-direction:column;">
                    ${announcements.slice(0, 5).map((a, idx) => {
                      const dt = parseDateBox(a.createdAt);
                      return `
                        <div class="announcement-row">
                          <div class="date-box">
                            <span class="date-box-day">${dt.day}</span>
                            <span class="date-box-month">${dt.month}</span>
                          </div>
                          <div style="flex:1; display:flex; align-items:center; flex-wrap:wrap;">
                            <a href="/announcements/${a._id}" style="color:#1e293b; font-size:0.87rem; font-weight:500; line-height:1.4; text-decoration:none;" data-link>
                              ${window.UI.escapeHtml(a.title)}
                            </a>
                            ${(idx === 0 || a.isNew || a.priority === 'URGENT') ? '<span class="badge-new-pill">New</span>' : ''}
                          </div>
                        </div>
                      `;
                    }).join('')}
                  </div>
                </div>
              </div>

              <!-- Column 2: Upcoming Placement Drives -->
              <div>
                <div class="dashboard-col-header">
                  <div class="col-header-title">
                    <span style="color:#0284c7; font-size:1.25rem;">💼</span>
                    <span>Upcoming Placement Drives</span>
                  </div>
                  <a href="/placements/drives" class="col-header-link" data-link>View All &rarr;</a>
                </div>

                <div class="card" style="padding:0.75rem 1.25rem; height:calc(100% - 2.5rem);">
                  <div style="display:flex; flex-direction:column;">
                    ${upcomingDrives.slice(0, 4).map(d => {
                      const branches = (d.eligibility?.branches || ['All Branches']).join(', ');
                      return `
                        <div class="drive-item-row">
                          <div style="display:flex; align-items:center; gap:0.85rem;">
                            <div class="drive-logo-box">
                              ${d.companyLogo
                                ? `<img src="${d.companyLogo}" alt="${window.UI.escapeHtml(d.companyName)}" onerror="this.src='/favicon.ico'">`
                                : `<span style="font-weight:800; color:#0284c7; font-size:0.9rem;">${(d.companyName || 'CO').substring(0, 3)}</span>`}
                            </div>
                            <div>
                              <div style="font-weight:700; font-size:0.92rem; color:#0f172a; line-height:1.2;">
                                ${window.UI.escapeHtml(d.companyName)}
                              </div>
                              <div style="font-size:0.82rem; color:#475569; font-weight:500;">
                                ${window.UI.escapeHtml(d.jobRole || d.role || 'Software Engineer')}
                              </div>
                              <div style="font-size:0.74rem; color:#64748b; margin-top:0.2rem; display:flex; gap:0.75rem; align-items:center;">
                                <span>📅 ${window.UI.formatDate(d.driveDate)}</span>
                                <span>👥 ${window.UI.escapeHtml(branches)}</span>
                              </div>
                            </div>
                          </div>
                          <div>
                            <a href="/placements/drives/${d._id}" class="btn-apply-sm" data-link>Apply Now</a>
                          </div>
                        </div>
                      `;
                    }).join('')}
                  </div>
                </div>
              </div>

              <!-- Column 3: T&P Officer's Message -->
              <div>
                <div class="dashboard-col-header">
                  <div class="col-header-title">
                    <span style="color:#0284c7; font-size:1.25rem;">👤</span>
                    <span>T&P Officer's Message</span>
                  </div>
                </div>

                <div class="card" style="padding:1.25rem; height:calc(100% - 2.5rem); display:flex; align-items:center;">
                  <div style="display:grid; grid-template-columns: 120px 1fr; gap:1rem; align-items:center; width:100%;">
                    <div>
                      <img src="${settings.officerPhoto || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=500&q=80'}"
                           alt="${window.UI.escapeHtml(settings.officerName || 'Dr. Rajesh Kumar')}"
                           style="width:100%; height:150px; object-fit:cover; border-radius:8px; box-shadow:0 4px 6px rgba(0,0,0,0.06);">
                    </div>
                    <div style="position:relative; padding-bottom:0.5rem;">
                      <div style="color:#0284c7; font-size:1.8rem; line-height:1; font-family:Georgia, serif; margin-bottom:0.15rem;">“</div>
                      <p style="font-size:0.83rem; color:#334155; line-height:1.5; font-style:italic; margin:0 0 0.85rem 0;">
                        ${window.UI.escapeHtml(settings.officerMessage || 'We are committed to providing our students with the best career opportunities and industry exposure. Our goal is to bridge the gap between academia and industry, enabling students to become industry-ready professionals.')}
                      </p>
                      <div style="display:flex; justify-content:space-between; align-items:flex-end;">
                        <div>
                          <div style="font-size:0.92rem; font-weight:800; color:#0f172a; line-height:1.15;">
                            ${window.UI.escapeHtml(settings.officerName || 'Dr. Rajesh Kumar')}
                          </div>
                          <div style="font-size:0.75rem; color:#64748b; font-weight:500;">
                            ${window.UI.escapeHtml(settings.officerDesignation || 'Training & Placement Officer')}
                          </div>
                        </div>
                        <div style="color:#0284c7; font-size:1.8rem; line-height:1; font-family:Georgia, serif;">”</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        <!-- 4. OUR RECRUITERS (CAROUSEL BAR) -->
        <section class="section" style="padding-top:1rem; padding-bottom:2rem;">
          <div class="container" style="max-width:1380px; padding:0 1rem;">
            <div class="dashboard-col-header" style="margin-bottom:1rem;">
              <div class="col-header-title">
                <span style="color:#0284c7; font-size:1.25rem;">🏢</span>
                <span>Our Recruiters</span>
              </div>
            </div>

            <div style="position:relative; display:flex; align-items:center; gap:0.5rem;">
              <button onclick="document.getElementById('recruiter-marquee').scrollBy({left: -240, behavior: 'smooth'})"
                      style="width:32px; height:32px; border-radius:50%; background:#ffffff; border:1px solid #cbd5e1; display:flex; align-items:center; justify-content:center; cursor:pointer; color:#475569; font-weight:bold; flex-shrink:0; box-shadow:0 2px 4px rgba(0,0,0,0.05);">
                &lsaquo;
              </button>

              <div id="recruiter-marquee" class="recruiters-strip" style="flex:1; scrollbar-width:none;">
                ${(recruiters.length > 0 ? recruiters : [
                  { name: 'TCS', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Tata_Consultancy_Services_Logo.svg' },
                  { name: 'Infosys', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg' },
                  { name: 'Wipro', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Wipro_Logo_RGB.svg' },
                  { name: 'Accenture', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/cd/Accenture.svg' },
                  { name: 'Capgemini', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Capgemini_201x_logo.svg' },
                  { name: 'Cognizant', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/43/Cognizant_logo_2022.svg' },
                  { name: 'IBM', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg' },
                  { name: 'Tech Mahindra', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/07/Tech_Mahindra_New_Logo.svg' },
                  { name: 'Deloitte', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/56/Deloitte.svg' },
                  { name: 'HCL Tech', logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/HCLTech_Logo.svg' }
                ]).map(c => `
                  <a href="/companies" class="recruiter-pill" data-link title="${window.UI.escapeHtml(c.name)}">
                    ${c.logo
                      ? `<img src="${c.logo}" alt="${window.UI.escapeHtml(c.name)}" onerror="this.parentElement.innerText='${c.name}'">`
                      : `<span style="font-weight:700; font-size:0.9rem; color:#0f172a;">${window.UI.escapeHtml(c.name)}</span>`}
                  </a>
                `).join('')}
              </div>

              <button onclick="document.getElementById('recruiter-marquee').scrollBy({left: 240, behavior: 'smooth'})"
                      style="width:32px; height:32px; border-radius:50%; background:#ffffff; border:1px solid #cbd5e1; display:flex; align-items:center; justify-content:center; cursor:pointer; color:#475569; font-weight:bold; flex-shrink:0; box-shadow:0 2px 4px rgba(0,0,0,0.05);">
                &rsaquo;
              </button>
            </div>
          </div>
        </section>

        <!-- 5. BOTTOM 2-COLUMN SECTION (Recent Events & Student Success Stories) -->
        <section class="section" style="padding-top:0.5rem; padding-bottom:4rem;">
          <div class="container" style="max-width:1380px; padding:0 1rem;">
            <div style="display:grid; grid-template-columns: 1.4fr 1fr; gap:1.5rem; align-items:stretch;">
              
              <!-- Left: Recent Events -->
              <div>
                <div class="dashboard-col-header">
                  <div class="col-header-title">
                    <span style="color:#0284c7; font-size:1.25rem;">📅</span>
                    <span>Recent Events</span>
                  </div>
                  <a href="/events" class="col-header-link" data-link>View All &rarr;</a>
                </div>

                <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:0.85rem;">
                  ${(events.length > 0 ? events : [
                    { title: 'Industry Visit to TCS', eventDate: '2024-12-10', imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=500&q=80' },
                    { title: 'Guest Lecture on AI', eventDate: '2024-12-05', imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=500&q=80' },
                    { title: 'Workshop on Resume Building', eventDate: '2024-11-28', imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=500&q=80' },
                    { title: 'MoU with Tech Solutions', eventDate: '2024-11-20', imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=500&q=80' }
                  ]).slice(0, 4).map(ev => `
                    <a href="/events" class="event-thumb-card" style="text-decoration:none;" data-link>
                      <img src="${ev.imageUrl || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=500&q=80'}" alt="${window.UI.escapeHtml(ev.title)}">
                      <div style="padding:0.65rem 0.75rem;">
                        <div style="font-weight:700; font-size:0.82rem; color:#0f172a; line-height:1.25; margin-bottom:0.35rem; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">
                          ${window.UI.escapeHtml(ev.title)}
                        </div>
                        <div style="font-size:0.72rem; color:#64748b;">
                          📅 ${window.UI.formatDate(ev.eventDate)}
                        </div>
                      </div>
                    </a>
                  `).join('')}
                </div>
              </div>

              <!-- Right: Student Success Stories -->
              <div>
                <div class="dashboard-col-header">
                  <div class="col-header-title">
                    <span style="color:#0284c7; font-size:1.25rem;">⭐</span>
                    <span>Student Success Stories</span>
                  </div>
                  <a href="/success-stories" class="col-header-link" data-link>View All &rarr;</a>
                </div>

                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:0.85rem; height:calc(100% - 2.5rem);">
                  ${(successStories.length > 0 ? successStories : [
                    {
                      studentName: 'Priya Sharma',
                      role: 'Software Engineer at Infosys',
                      branch: 'CSE',
                      batch: '2024 Batch',
                      story: 'The training and placement cell provided excellent support throughout my journey.',
                      photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80'
                    },
                    {
                      studentName: 'Amit Verma',
                      role: 'Associate Engineer at TCS',
                      branch: 'IT',
                      batch: '2024 Batch',
                      story: 'The mock interviews and training sessions helped me crack the interview.',
                      photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80'
                    }
                  ]).slice(0, 2).map(st => `
                    <div class="story-card-compact">
                      <div style="display:flex; align-items:center; gap:0.65rem; margin-bottom:0.75rem;">
                        <img src="${st.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}"
                             alt="${window.UI.escapeHtml(st.studentName)}"
                             style="width:44px; height:44px; border-radius:50%; object-fit:cover; flex-shrink:0;">
                        <div>
                          <div style="font-weight:800; font-size:0.88rem; color:#0f172a; line-height:1.2;">
                            ${window.UI.escapeHtml(st.studentName)}
                          </div>
                          <div style="font-size:0.75rem; color:#475569; font-weight:500;">
                            ${window.UI.escapeHtml(st.role || st.companyName || 'Software Engineer')}
                          </div>
                          <div style="font-size:0.68rem; color:#64748b;">
                            ${window.UI.escapeHtml(st.branch || 'CSE')} | ${window.UI.escapeHtml(st.batch || '2024 Batch')}
                          </div>
                        </div>
                      </div>
                      <p style="font-size:0.8rem; color:#475569; line-height:1.45; font-style:italic; margin:0; flex:1;">
                        “${window.UI.escapeHtml(st.story || 'The placement cell provided top-notch training that helped me crack my dream company interview.')}”
                      </p>
                    </div>
                  `).join('')}
                </div>
              </div>

            </div>

            <!-- 6. INSTITUTIONAL MODULES & QUICK ACCESS HUB -->
            <div style="margin-top:2.5rem; background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:1.75rem;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.25rem; flex-wrap:wrap; gap:0.5rem;">
                <div style="display:flex; align-items:center; gap:0.5rem;">
                  <span style="font-size:1.25rem;">🏛️</span>
                  <h3 style="font-size:1.1rem; font-weight:800; color:#0f172a; margin:0;">Institutional Hub & Resources</h3>
                </div>
                <span style="font-size:0.8rem; color:#64748b; font-weight:600;">Official Training & Placement Facilities</span>
              </div>

              <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:1rem;">
                <a href="/team" class="card" data-link style="text-decoration:none; padding:1.1rem; border:1px solid #e2e8f0; border-radius:8px; background:#ffffff; transition:transform 0.2s, box-shadow 0.2s; display:flex; align-items:center; gap:0.75rem;">
                  <div style="width:38px; height:38px; border-radius:8px; background:#e0f2fe; color:#0284c7; display:flex; align-items:center; justify-content:center; font-size:1.2rem; flex-shrink:0;">👨‍🏫</div>
                  <div>
                    <div style="font-weight:700; font-size:0.88rem; color:#0f172a;">T&P Team & SPOCs</div>
                    <div style="font-size:0.75rem; color:#64748b;">Faculty & Officers</div>
                  </div>
                </a>

                <a href="/hackathons" class="card" data-link style="text-decoration:none; padding:1.1rem; border:1px solid #e2e8f0; border-radius:8px; background:#ffffff; transition:transform 0.2s, box-shadow 0.2s; display:flex; align-items:center; gap:0.75rem;">
                  <div style="width:38px; height:38px; border-radius:8px; background:#fce7f3; color:#db2777; display:flex; align-items:center; justify-content:center; font-size:1.2rem; flex-shrink:0;">🏆</div>
                  <div>
                    <div style="font-weight:700; font-size:0.88rem; color:#0f172a;">Hackathons & SIH</div>
                    <div style="font-size:0.75rem; color:#64748b;">Competitions & Grants</div>
                  </div>
                </a>

                <a href="/alumni" class="card" data-link style="text-decoration:none; padding:1.1rem; border:1px solid #e2e8f0; border-radius:8px; background:#ffffff; transition:transform 0.2s, box-shadow 0.2s; display:flex; align-items:center; gap:0.75rem;">
                  <div style="width:38px; height:38px; border-radius:8px; background:#f3e8ff; color:#7e22ce; display:flex; align-items:center; justify-content:center; font-size:1.2rem; flex-shrink:0;">🌟</div>
                  <div>
                    <div style="font-weight:700; font-size:0.88rem; color:#0f172a;">Alumni Mentorship</div>
                    <div style="font-size:0.75rem; color:#64748b;">Global Tech Directory</div>
                  </div>
                </a>

                <a href="/testimonials" class="card" data-link style="text-decoration:none; padding:1.1rem; border:1px solid #e2e8f0; border-radius:8px; background:#ffffff; transition:transform 0.2s, box-shadow 0.2s; display:flex; align-items:center; gap:0.75rem;">
                  <div style="width:38px; height:38px; border-radius:8px; background:#fef3c7; color:#d97706; display:flex; align-items:center; justify-content:center; font-size:1.2rem; flex-shrink:0;">💬</div>
                  <div>
                    <div style="font-weight:700; font-size:0.88rem; color:#0f172a;">Testimonials</div>
                    <div style="font-size:0.75rem; color:#64748b;">Recruiter & Student Voice</div>
                  </div>
                </a>

                <a href="/downloads" class="card" data-link style="text-decoration:none; padding:1.1rem; border:1px solid #e2e8f0; border-radius:8px; background:#ffffff; transition:transform 0.2s, box-shadow 0.2s; display:flex; align-items:center; gap:0.75rem;">
                  <div style="width:38px; height:38px; border-radius:8px; background:#e0e7ff; color:#4f46e5; display:flex; align-items:center; justify-content:center; font-size:1.2rem; flex-shrink:0;">📄</div>
                  <div>
                    <div style="font-weight:700; font-size:0.88rem; color:#0f172a;">Downloads Center</div>
                    <div style="font-size:0.75rem; color:#64748b;">ATS Resumes & Forms</div>
                  </div>
                </a>

                <a href="/recruit-with-us" class="card" data-link style="text-decoration:none; padding:1.1rem; border:1px solid #e2e8f0; border-radius:8px; background:#ffffff; transition:transform 0.2s, box-shadow 0.2s; display:flex; align-items:center; gap:0.75rem;">
                  <div style="width:38px; height:38px; border-radius:8px; background:#ecfdf5; color:#059669; display:flex; align-items:center; justify-content:center; font-size:1.2rem; flex-shrink:0;">🤝</div>
                  <div>
                    <div style="font-weight:700; font-size:0.88rem; color:#0f172a;">Recruit With Us</div>
                    <div style="font-size:0.75rem; color:#64748b;">Host Campus Drives</div>
                  </div>
                </a>
              </div>
            </div>

          </div>
        </section>
      `;
    } catch (err) {
      console.error('Failed to load homepage:', err);
      app.innerHTML = `
        <div class="container section" style="text-align:center;">
          <h2>Unable to connect to placement server</h2>
          <p style="color:var(--text-muted); margin-bottom:1.5rem;">${err.message}</p>
          <button class="btn btn-primary" onclick="window.location.reload()">Retry Connection</button>
        </div>
      `;
    }
  }
};
