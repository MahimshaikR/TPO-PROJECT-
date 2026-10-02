# TPO CONNECT — Smart Training & Placement Management System

[![Technology](https://img.shields.io/badge/Stack-HTML5%20%7C%20CSS3%20%7C%20Vanilla%20JS%20%7C%20Node.js%20%7C%20Express%20%7C%20MongoDB-blue.svg)](https://github.com)
[![Deployment](https://img.shields.io/badge/Deploy-GitHub%20%7C%20Vercel%20%7C%20Render%20%7C%20Atlas-green.svg)](https://render.com)
[![License](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)

A full-stack, enterprise-grade **Smart Training & Placement Management System (TPO Connect)** engineered with **HTML5, CSS3, Vanilla JavaScript, Node.js, Express.js, and MongoDB Atlas**.

Built with a strict **"Everything Must Be Dynamic"** architecture: zero hardcoded statistics, zero static company lists, and zero fake counts. Every metric, drive, announcement, resume score, attendance percentage, and placement calculation is dynamically evaluated from the database in real-time.

---

## 🏛️ System Architecture

```text
                                PUBLIC WEBSITE
                        (Vanilla JS + HTML5 + CSS3)
                                     │
                                     ▼
                                 REST APIs
                                     │
                                     ▼
                             NODE.JS + EXPRESS
                                     │
                                     ▼
                            DUAL-MODE ADAPTER
                    ┌────────────────┴────────────────┐
                    ▼                                 ▼
             MONGODB ATLAS                EMBEDDED DOCUMENT ENGINE
          (Production / Cloud)             (Local Zero-Daemon Dev)
                    │                                 │
          ┌─────────┴───────────────┬─────────────────┴─────────┐
          ▼                         ▼                           ▼
    STUDENT PORTAL          RECRUITER PORTAL             ADMIN PORTAL
   (Profile, Drives,       (Job Postings, ATS,       (Full 25 Collections CRUD,
  Interviews, Resume)     Shortlisting, Offers)     Eligibility Engine, Audit)
```

---

## ✨ Key Features & Highlights

1. **100% Dynamic Content Engine**:
   - Placement stats (`Placement %`, `Highest Package`, `Average Package`, `Eligible Candidates`, `Total Offers`) are dynamically computed using MongoDB aggregation and records.
   - Dynamic Hero Banner, T&P Officer Message, Testimonials, FAQ, Gallery, and Social links managed from Admin Settings.

2. **Real-Time Backend Eligibility Engine**:
   - Server-side criteria evaluation enforcing Branch matching, Minimum CGPA thresholds, Active Backlogs limit, and Batch Year constraints.
   - Prevents duplicate applications with automatic state verification.

3. **Role-Based Access Control (RBAC)**:
   - 4 Distinct Portals:
     - 🎓 **Student Portal**: Profile management, skills, projects, resume PDF upload, drive applications, real-time status tracker, interview schedule, attendance breakdown.
     - 👔 **Recruiter Portal**: Post recruitment drives, candidate shortlisting, interview scheduling, offer rollout, corporate profile management.
     - 📋 **Coordinator Portal**: Department-specific student verification, drive monitoring, application tracking, mock interview planning, CSV/Excel report exports.
     - ⚙️ **Admin Portal**: Complete CRUD control over all 25 collections, recruitment funnel visualization, user role permissions, website content editor, and tamper-proof security audit logging.

4. **Dual-Mode Persistence Architecture**:
   - Direct connection to **MongoDB Atlas** (`MONGODB_URI`) with Mongoose schemas in staging and production.
   - Automatic, zero-configuration local fallback to an embedded JSON document engine (`server/data/`) that mirrors Mongoose query APIs (`find`, `findByIdAndUpdate`, `populate`, `sort`, `skip`, `limit`, `countDocuments`).

5. **AI Preparation Engine**:
   - Algorithmic ATS Resume Scoring (Keyword relevance, impact verb analysis, formatting index).
   - Dynamic Job Role Fitment Analysis and tailored interview preparation guidance.

---

## 👥 Demo Credentials (Pre-Seeded)

The database includes pre-configured credentials across all 4 roles:

| Role | Email | Password | Access Portal |
| :--- | :--- | :--- | :--- |
| **System Admin (T&P Officer)** | `admin@tpoconnect.edu` | `Admin@123` | `/admin/dashboard` |
| **Department Coordinator** | `coordinator@tpoconnect.edu` | `Coord@123` | `/coordinator/dashboard` |
| **Corporate Recruiter** | `recruiter@google.com` | `Recruit@123` | `/recruiter/dashboard` |
| **Student** | `student@tpoconnect.edu` | `Student@123` | `/student/dashboard` |

---

## 🚀 Quick Start (Local Setup)

### Prerequisites
- Node.js (v18.x or later)
- Git

### 1. Clone & Install
```bash
git clone https://github.com/your-username/tpo-connect.git
cd tpo-connect
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory:
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=supersecretjwtkey_tpoconnect_2026_xyz
JWT_EXPIRE=7d
MONGODB_URI=
CLIENT_URL=http://localhost:5000
```
> **Note**: If `MONGODB_URI` is left blank, TPO Connect automatically operates on the built-in High-Performance Dynamic Document Engine in `server/data/`.

### 3. Seed Initial Dataset
```bash
npm run seed
```

### 4. Start the Application
```bash
# Production start
npm start

# Development mode with automatic reload
npm run dev
```

Open your browser at **`http://localhost:5000`**.

---

## 🌐 Full Website & Portal URL Map

### Public Pages
- `/` — Homepage with dynamic statistics, recruiter marquee, hero banner, upcoming drives
- `/about` — About T&P, mission, vision, committee
- `/placements` — Placement drives directory & filtering
- `/placements/drives/:id` — Drive details, JD, and dynamic eligibility check
- `/companies` — Partner companies directory & tier classifications
- `/companies/:id` — Company recruitment history and past salary packages
- `/training` — Technical & soft-skill training programs
- `/training/:id` — Detailed syllabus and schedule
- `/internships` — Summer and 6-month internship opportunities
- `/students` — Verified student directory
- `/recruiters` — Corporate partnerships and past recruiters
- `/achievements` — College placement milestones and ranking records
- `/success-stories` — Placed student testimonials
- `/events` — Industry talks, hackathons, and placement calendar
- `/resources` — Aptitude sheets, coding guides, interview prep materials
- `/reports` — Placement statistics, salary curves, batch graphs
- `/gallery` — Placement day photo and celebration gallery
- `/announcements` — Official notifications and deadline alerts
- `/career-guidance` — Resume building, GD prep, mock interview tips
- `/contact` — Office address, Google map, and enquiry form
- `/faq` — Frequently Asked Questions
- `/feedback` — Recruiter and student feedback submission
- `/grievance` — Student grievance redressal cell
- `/recruit-with-us` — Corporate invitation and campus visit booking

### Authentication URLs
- `/login` — Unified portal login with automatic role redirection
- `/student/login` — Student specific login
- `/recruiter/login` — Recruiter specific login
- `/coordinator/login` — Department Coordinator login
- `/admin/login` — T&P Officer / Super Admin login
- `/register/student` — Student self-registration
- `/register/recruiter` — Corporate company registration
- `/forgot-password` — Password recovery
- `/reset-password/:token` — Secure password reset

### Student Portal (`/student/*`)
- `/student/dashboard` — Live placement status, applied drives, offers, attendance summary
- `/student/profile` — Personal profile and contact information
- `/student/academic` — 10th, 12th, B.Tech semester-wise marks, CGPA, backlogs
- `/student/skills` — Technical skills tagger
- `/student/projects` — Academic and personal project showcase
- `/student/certifications` — Industry certifications
- `/student/internships` — Past internship experience
- `/student/resume` — PDF resume upload, preview, and AI ATS score calculation
- `/student/drives` — Eligible vs non-eligible drives listing
- `/student/applications` — Active applications and recruitment round tracker
- `/student/interviews` — Scheduled interview rounds and video meeting links
- `/student/selection` — Offer letters and congratulations card
- `/student/training` — Registered training workshops and material
- `/student/attendance` — Session-by-session attendance tracker
- `/student/resources` — Placement preparatory study kits
- `/student/notifications` — Direct broadcast inbox
- `/student/settings` — Password update and preferences

### Recruiter Portal (`/recruiter/*`)
- `/recruiter/dashboard` — Overview of posted drives, applicant funnel, interviews
- `/recruiter/company` — Corporate profile and hiring history
- `/recruiter/drives` — Manage drives, view applicant counts
- `/recruiter/drives/create` — Post a new campus hiring drive
- `/recruiter/applications` — Candidate review and stage promotion
- `/recruiter/shortlisted` — Shortlisted applicant pool
- `/recruiter/interviews` — Interview scheduler with venue and video link
- `/recruiter/selected` — Final offers extended
- `/recruiter/notifications` — System announcements
- `/recruiter/settings` — Account credentials

### Coordinator Portal (`/coordinator/*`)
- `/coordinator/dashboard` — Department student placement metrics
- `/coordinator/students` — Department student roster, filtering, and profile verification
- `/coordinator/drives` — Drive status and student eligibility breakdown
- `/coordinator/applications` — Application pipeline by student
- `/coordinator/attendance` — Bulk attendance marking for drives and sessions
- `/coordinator/training` — Technical workshop tracking
- `/coordinator/interviews` — Mock interview coordination
- `/coordinator/selections` — Department job offer records
- `/coordinator/reports` — CSV/Excel departmental report downloads
- `/coordinator/notifications` — Send broadcasts to departmental candidates

### Admin Portal (`/admin/*`)
- `/admin/dashboard` — Comprehensive metrics, live recruitment funnel, branch breakdown
- `/admin/students` — Complete student database CRUD
- `/admin/companies` — Partner company directory CRUD
- `/admin/recruiters` — Recruiter verification and approval
- `/admin/drives` — Placement drives CRUD and scheduling
- `/admin/eligibility` — Dynamic eligibility simulator and rule manager
- `/admin/applications` — Global application tracking and round promotions
- `/admin/attendance` — Drive attendance recorder
- `/admin/interviews` — Campus interview schedule manager
- `/admin/selections` — Offer letter and CTC verification
- `/admin/training` — Skill programs CRUD
- `/admin/internships` — Internship opportunities CRUD
- `/admin/industry-events` — Guest lectures and workshop manager
- `/admin/announcements` — Notice board publisher
- `/admin/notifications` — Notification broadcast dispatcher
- `/admin/resources` — Learning resources repository CRUD
- `/admin/gallery` — Campus gallery image CRUD
- `/admin/achievements` — College milestone publisher
- `/admin/success-stories` — Placed student spotlight CRUD
- `/admin/reports` — CSV/Excel reports (Students, Placed, Drives, Companies, Attendance)
- `/admin/analytics` — Package distributions and top recruiter charts
- `/admin/users` — Role management and user activation/deactivation
- `/admin/audit-logs` — Security and administrative action audit trail
- `/admin/content` — Homepage hero banner, vision, officer message editor
- `/admin/faq` — FAQ management CRUD
- `/admin/feedback` — Visitor feedback review
- `/admin/grievances` — Student grievance dispute resolution
- `/admin/settings` — Institutional branding, contact details, social links

---

## ☁️ Deployment Guide

### 1. MongoDB Atlas Setup
1. Log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a free **M0 Shared Cluster**.
3. Under **Database Access**, create a user with `Read and Write to any database` privileges.
4. Under **Network Access**, add IP `0.0.0.0/0` (Allow access from anywhere).
5. Click **Connect** &rsaquo; **Drivers** &rsaquo; Copy the connection URI:
   ```text
   mongodb+srv://<username>:<password>@cluster0.mongodb.net/tpoconnect?retryWrites=true&w=majority
   ```

### 2. Backend Deployment on Render
1. Push your repository to **GitHub**.
2. Sign up / Log in to [Render](https://render.com).
3. Click **New +** &rsaquo; **Web Service** &rsaquo; Connect your GitHub repository.
4. Configure the Web Service:
   - **Name**: `tpo-connect-api`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Under **Environment Variables**, add:
   - `NODE_ENV`: `production`
   - `JWT_SECRET`: `your_secure_random_jwt_secret_key`
   - `JWT_EXPIRE`: `7d`
   - `MONGODB_URI`: `your_mongodb_atlas_connection_string`
   - `CLIENT_URL`: `https://your-frontend.vercel.app`
6. Click **Deploy Web Service**.

### 3. Frontend / Fullstack Deployment on Vercel
1. Sign up / Log in to [Vercel](https://vercel.com).
2. Click **Add New...** &rsaquo; **Project** &rsaquo; Import your GitHub repository.
3. The project includes `vercel.json` pre-configured to route API requests to the Express server and serve static assets seamlessly.
4. Set Environment Variables on Vercel:
   - `NODE_ENV`: `production`
   - `JWT_SECRET`: `your_secure_random_jwt_secret_key`
   - `MONGODB_URI`: `your_mongodb_atlas_connection_string`
5. Click **Deploy**.

---

## 🛠️ REST API Reference

| Endpoint | Method | Role | Description |
| :--- | :--- | :--- | :--- |
| `/api/health` | GET | Public | Server and database health check |
| `/api/auth/login` | POST | Public | User authentication with JWT issuance |
| `/api/auth/register` | POST | Public | Student or recruiter self-registration |
| `/api/dashboard/public-statistics` | GET | Public | Dynamic computed placement metrics |
| `/api/dashboard/admin` | GET | Admin | Admin metrics, funnel, and branch breakdown |
| `/api/dashboard/student` | GET | Student | Student personalized metrics |
| `/api/dashboard/recruiter` | GET | Recruiter | Recruiter drives and candidate metrics |
| `/api/dashboard/coordinator` | GET | Coordinator | Departmental metrics and counts |
| `/api/students/me` | GET, PUT | Student | Retrieve and update own profile |
| `/api/students/me/resume` | POST, DELETE | Student | Upload / remove resume PDF |
| `/api/students/me/ai-score` | GET | Student | Compute algorithmic ATS resume score |
| `/api/drives` | GET, POST | Public / Admin | List drives or create new placement drive |
| `/api/drives/:id` | GET, PUT, DELETE | Public / Admin | Drive details and modification |
| `/api/drives/:id/apply` | POST | Student | Apply for a drive with eligibility verification |
| `/api/eligibility/check` | POST | Auth | Server-side student drive eligibility test |
| `/api/applications` | GET, POST | Auth | List applications or apply |
| `/api/applications/:id/status`| PATCH | Admin / Recruiter | Promote or reject candidate round |
| `/api/attendance/bulk` | POST | Admin / Coord | Save candidate attendance records |
| `/api/reports/export/:type` | GET | Admin / Coord | Export CSV or Excel report |
| `/api/settings` | GET, PUT | Admin | System branding and institutional settings |

---

## 🔒 Security & Best Practices

- **Zero Hardcoded Data**: Eliminates static counts across all HTML templates.
- **Passwords**: Hashed with `bcryptjs` (salt rounds: 10).
- **JWT Authentication**: Enforces HTTP Authorization headers (`Bearer <token>`).
- **Input Sanitization**: HTML escaping across dynamic components to prevent XSS.
- **Audit Trails**: Security actions logged with user ID, action name, resource, and client IP address.

---

## 📄 License
This project is open-source and licensed under the [MIT License](LICENSE).
