const bcrypt = require('bcryptjs');

const getSeedData = async () => {
  const adminPassword = await bcrypt.hash('Admin@123', 10);
  const recruiterPassword = await bcrypt.hash('Recruiter@123', 10);
  const studentPassword = await bcrypt.hash('Student@123', 10);
  const coordinatorPassword = await bcrypt.hash('Coord@123', 10);

  const users = [
    {
      _id: 'user_admin_001',
      name: 'Dr. Rajesh Sharma',
      email: 'admin@nriit.edu.in',
      password: adminPassword,
      role: 'ADMIN',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      isActive: true,
      isApproved: true
    },
    {
      _id: 'user_tpo_002',
      name: 'Prof. Sunita Rao',
      email: 'tpo@nriit.edu.in',
      password: adminPassword,
      role: 'TP_OFFICER',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
      isActive: true,
      isApproved: true
    },
    {
      _id: 'user_coord_001',
      name: 'Prof. Vikram Verma',
      email: 'coordinator.cse@nriit.edu.in',
      password: coordinatorPassword,
      role: 'COORDINATOR',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      isActive: true,
      isApproved: true
    },
    {
      _id: 'user_rec_google_001',
      name: 'Aakash Mehra',
      email: 'recruiter@google.com',
      password: recruiterPassword,
      role: 'RECRUITER',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      isActive: true,
      isApproved: true
    },
    {
      _id: 'user_rec_msft_002',
      name: 'Sarah Jenkins',
      email: 'sarah@microsoft.com',
      password: recruiterPassword,
      role: 'RECRUITER',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
      isActive: true,
      isApproved: true
    },
    {
      _id: 'user_stu_mahi_001',
      name: 'Mahi Sharma',
      email: 'mahi.cse23@nriit.edu.in',
      password: studentPassword,
      role: 'STUDENT',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
      isActive: true,
      isApproved: true
    },
    {
      _id: 'user_stu_rahul_002',
      name: 'Rahul Sen',
      email: 'rahul.ece23@nriit.edu.in',
      password: studentPassword,
      role: 'STUDENT',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
      isActive: true,
      isApproved: true
    },
    {
      _id: 'user_stu_ananya_003',
      name: 'Ananya Iyer',
      email: 'ananya.aiml23@nriit.edu.in',
      password: studentPassword,
      role: 'STUDENT',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
      isActive: true,
      isApproved: true
    },
    {
      _id: 'user_stu_kunal_004',
      name: 'Kunal Patil',
      email: 'kunal.mech23@nriit.edu.in',
      password: studentPassword,
      role: 'STUDENT',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80',
      isActive: true,
      isApproved: true
    }
  ];

  const companies = [
    {
      _id: 'comp_google_001',
      name: 'Google LLC',
      logo: 'https://www.google.com/favicon.ico',
      website: 'https://careers.google.com',
      industry: 'Technology & Cloud',
      description: 'Global technology leader specializing in search engine, cloud computing, quantum computing, AI, and online software.',
      headOffice: 'Bengaluru / Hyderabad, India',
      contactEmail: 'campus-recruitment@google.com',
      contactPhone: '+91 80 6721 8000',
      tier: 'TIER_1',
      status: 'ACTIVE',
      totalOffersCount: 14,
      highestPackageOffered: 45,
      averagePackageOffered: 34.5
    },
    {
      _id: 'comp_msft_002',
      name: 'Microsoft Corporation',
      logo: 'https://www.microsoft.com/favicon.ico',
      website: 'https://careers.microsoft.com',
      industry: 'Enterprise Software & Cloud',
      description: 'World-renowned technology company producing computer software, consumer electronics, personal computers, and related cloud services.',
      headOffice: 'Bengaluru / Hyderabad / Noida',
      contactEmail: 'indiarecruiting@microsoft.com',
      contactPhone: '+91 80 4018 8000',
      tier: 'TIER_1',
      status: 'ACTIVE',
      totalOffersCount: 18,
      highestPackageOffered: 43.5,
      averagePackageOffered: 32.2
    },
    {
      _id: 'comp_amazon_003',
      name: 'Amazon Web Services',
      logo: 'https://www.amazon.com/favicon.ico',
      website: 'https://amazon.jobs',
      industry: 'E-commerce & Cloud Computing',
      description: 'Comprehensive, evolving cloud computing platform provided by Amazon offering IaaS, PaaS, and packaged software solutions.',
      headOffice: 'Hyderabad / Chennai / Bengaluru',
      contactEmail: 'campus-in@amazon.com',
      contactPhone: '+91 40 4000 5000',
      tier: 'TIER_1',
      status: 'ACTIVE',
      totalOffersCount: 28,
      highestPackageOffered: 36,
      averagePackageOffered: 28.5
    },
    {
      _id: 'comp_cisco_004',
      name: 'Cisco Systems',
      logo: 'https://www.cisco.com/favicon.ico',
      website: 'https://jobs.cisco.com',
      industry: 'Networking & Cybersecurity',
      description: 'Worldwide leader in technology that powers the Internet, secure networking, and unified collaboration solutions.',
      headOffice: 'Bengaluru, Karnataka',
      contactEmail: 'cisco-hires@cisco.com',
      contactPhone: '+91 80 4426 0000',
      tier: 'TIER_1',
      status: 'ACTIVE',
      totalOffersCount: 22,
      highestPackageOffered: 24,
      averagePackageOffered: 18.5
    },
    {
      _id: 'comp_deloitte_005',
      name: 'Deloitte USI',
      logo: 'https://www.deloitte.com/favicon.ico',
      website: 'https://www2.deloitte.com/in/en/careers.html',
      industry: 'Management & Technology Consulting',
      description: 'Leading global provider of audit and assurance, consulting, financial advisory, risk advisory, tax, and related services.',
      headOffice: 'Hyderabad / Bengaluru / Mumbai / Gurugram',
      contactEmail: 'deloittecampus@deloitte.com',
      contactPhone: '+91 40 6762 1000',
      tier: 'TIER_2',
      status: 'ACTIVE',
      totalOffersCount: 45,
      highestPackageOffered: 14.5,
      averagePackageOffered: 9.8
    },
    {
      _id: 'comp_tcs_006',
      name: 'Tata Consultancy Services',
      logo: 'https://www.tcs.com/favicon.ico',
      website: 'https://www.tcs.com/careers',
      industry: 'IT Services & Consulting',
      description: 'Global leader in IT services, digital and business solutions that partners with the world’s largest businesses.',
      headOffice: 'Mumbai / Pan India',
      contactEmail: 'campus.tcs@tcs.com',
      contactPhone: '+91 22 6778 9999',
      tier: 'MASS',
      status: 'ACTIVE',
      totalOffersCount: 160,
      highestPackageOffered: 9.2,
      averagePackageOffered: 7.2
    }
  ];

  const recruiters = [
    {
      _id: 'rec_google_profile_001',
      userId: 'user_rec_google_001',
      fullName: 'Aakash Mehra',
      email: 'recruiter@google.com',
      phone: '+91 98112 34567',
      companyId: 'comp_google_001',
      companyName: 'Google LLC',
      designation: 'University Relations Lead',
      officialEmail: 'aakashm@google.com',
      isVerified: true,
      status: 'APPROVED'
    },
    {
      _id: 'rec_msft_profile_002',
      userId: 'user_rec_msft_002',
      fullName: 'Sarah Jenkins',
      email: 'sarah@microsoft.com',
      phone: '+91 98223 45678',
      companyId: 'comp_msft_002',
      companyName: 'Microsoft Corporation',
      designation: 'Senior Technical Recruiter',
      officialEmail: 'sarah.j@microsoft.com',
      isVerified: true,
      status: 'APPROVED'
    }
  ];

  const students = [
    {
      _id: 'stu_mahi_001',
      userId: 'user_stu_mahi_001',
      rollNumber: '23CS001',
      fullName: 'Mahi Sharma',
      email: 'mahi.cse23@nriit.edu.in',
      phone: '+91 91234 56780',
      branch: 'CSE',
      batch: '2027',
      academicYear: '2026-27',
      cgpa: 8.92,
      backlogs: 0,
      gender: 'Female',
      dob: '2004-05-14',
      address: 'H-402, Green Valley Enclave, Bengaluru',
      tenthPercentage: 94.5,
      twelfthPercentage: 92.8,
      skills: ['JavaScript', 'TypeScript', 'Node.js', 'React', 'MongoDB', 'Python', 'AWS', 'Data Structures & Algorithms'],
      certifications: [
        { name: 'AWS Certified Cloud Practitioner', issuer: 'Amazon Web Services', issueDate: '2025-11-10', credentialUrl: 'https://aws.amazon.com/verify' },
        { name: 'Meta Full-Stack Developer Professional Certificate', issuer: 'Meta (Coursera)', issueDate: '2025-08-20', credentialUrl: 'https://coursera.org' }
      ],
      projects: [
        {
          title: 'TPO Connect - Smart Campus Placement Suite',
          techStack: 'Node.js, Express, MongoDB, Vanilla JavaScript, HTML5/CSS3',
          description: 'A completely dynamic, end-to-end training and placement management portal with dynamic eligibility engine, report exports, and role-based access control.',
          githubUrl: 'https://github.com/mahi-sharma/tpo-connect',
          liveUrl: 'https://tpoconnect.demo.app'
        },
        {
          title: 'Algorithmic Visualizer Studio',
          techStack: 'React, TypeScript, Canvas API',
          description: 'Interactive visualization sandbox for graph algorithms (Dijkstra, A*) and tree traversals with audio-visual cues.',
          githubUrl: 'https://github.com/mahi-sharma/algo-viz',
          liveUrl: 'https://algo-viz.demo.app'
        }
      ],
      internships: [
        {
          company: 'InnoTech Labs',
          role: 'Full Stack Engineering Intern',
          duration: '3 Months (May 2025 - Jul 2025)',
          stipend: '₹30,000 / month',
          description: 'Engineered REST APIs and microservice adapters in Node.js, reducing endpoint latency by 28%.',
          certificateUrl: 'https://innotech.io/cert/123'
        }
      ],
      resumeUrl: '/uploads/resumes/resume-sample-mahi.pdf',
      resumeOriginalName: 'Mahi_Sharma_Resume_2026.pdf',
      resumeUpdatedAt: new Date('2026-09-01'),
      linkedinUrl: 'https://linkedin.com/in/mahi-sharma',
      githubUrl: 'https://github.com/mahi-sharma',
      portfolioUrl: 'https://mahisharma.dev',
      placementStatus: 'PLACED',
      placedCompany: 'Google LLC',
      placedPackage: 38.5,
      offerLetters: [
        {
          company: 'Google LLC',
          packageLpa: 38.5,
          designation: 'Associate Software Engineer',
          issueDate: '2026-09-20',
          fileUrl: '/uploads/documents/offer-google-mahi.pdf'
        }
      ],
      preferences: {
        preferredRoles: ['Software Engineer', 'Full Stack Developer', 'Cloud Engineer'],
        preferredLocations: ['Bengaluru', 'Hyderabad', 'Remote'],
        willingToRelocate: true
      }
    },
    {
      _id: 'stu_rahul_002',
      userId: 'user_stu_rahul_002',
      rollNumber: '23EC014',
      fullName: 'Rahul Sen',
      email: 'rahul.ece23@nriit.edu.in',
      phone: '+91 92345 67891',
      branch: 'ECE',
      batch: '2027',
      academicYear: '2026-27',
      cgpa: 8.15,
      backlogs: 0,
      gender: 'Male',
      dob: '2004-08-22',
      address: 'Flat 12B, Lakeview Apartments, Bengaluru',
      tenthPercentage: 89.2,
      twelfthPercentage: 88.0,
      skills: ['Embedded C', 'C++', 'IoT', 'Python', 'Verilog', 'Microcontrollers', 'Git'],
      certifications: [
        { name: 'Embedded Systems & IoT Specialization', issuer: 'UC Irvine', issueDate: '2025-06-15', credentialUrl: '' }
      ],
      projects: [
        {
          title: 'Smart Edge IoT Health Monitor',
          techStack: 'ESP32, C++, MQTT, AWS IoT Core',
          description: 'Low-power wearable vital sign telemetry device transmission over lightweight MQTT protocol.',
          githubUrl: 'https://github.com/rahul-sen/edge-iot',
          liveUrl: ''
        }
      ],
      internships: [],
      resumeUrl: '',
      placementStatus: 'REGISTERED',
      placedCompany: '',
      placedPackage: 0,
      offerLetters: [],
      preferences: {
        preferredRoles: ['Hardware Engineer', 'Firmware Developer', 'IoT Systems Architect'],
        preferredLocations: ['Bengaluru', 'Pune'],
        willingToRelocate: true
      }
    },
    {
      _id: 'stu_ananya_003',
      userId: 'user_stu_ananya_003',
      rollNumber: '23AI008',
      fullName: 'Ananya Iyer',
      email: 'ananya.aiml23@nriit.edu.in',
      phone: '+91 93456 78902',
      branch: 'AIML',
      batch: '2027',
      academicYear: '2026-27',
      cgpa: 9.35,
      backlogs: 0,
      gender: 'Female',
      dob: '2004-11-03',
      address: 'Prithvi Palms, Whitefield, Bengaluru',
      tenthPercentage: 96.0,
      twelfthPercentage: 95.4,
      skills: ['Python', 'PyTorch', 'TensorFlow', 'NLP', 'Computer Vision', 'FastAPI', 'Docker', 'SQL'],
      certifications: [
        { name: 'Deep Learning Specialization', issuer: 'DeepLearning.AI', issueDate: '2025-04-12', credentialUrl: '' }
      ],
      projects: [
        {
          title: 'MedScan AI - Diagnostic Pathology Vision',
          techStack: 'Python, PyTorch, TorchVision, FastAPI',
          description: 'Convolutional neural network for high-accuracy cellular anomaly detection with 97.4% test sensitivity.',
          githubUrl: 'https://github.com/ananya-iyer/medscan-ai',
          liveUrl: ''
        }
      ],
      internships: [
        {
          company: 'AI Synergy Corp',
          role: 'Machine Learning Research Intern',
          duration: '6 Months',
          stipend: '₹40,000 / month',
          description: 'Optimized quantized LLM models for edge compute devices.',
          certificateUrl: ''
        }
      ],
      resumeUrl: '/uploads/resumes/resume-ananya.pdf',
      resumeOriginalName: 'Ananya_Iyer_Resume.pdf',
      resumeUpdatedAt: new Date('2026-08-15'),
      placementStatus: 'PLACED',
      placedCompany: 'Microsoft Corporation',
      placedPackage: 43.5,
      offerLetters: [
        {
          company: 'Microsoft Corporation',
          packageLpa: 43.5,
          designation: 'Software Engineer - AI Systems',
          issueDate: '2026-09-18',
          fileUrl: '/uploads/documents/offer-msft-ananya.pdf'
        }
      ],
      preferences: {
        preferredRoles: ['AI Research Engineer', 'Data Scientist', 'Machine Learning Engineer'],
        preferredLocations: ['Bengaluru', 'Hyderabad'],
        willingToRelocate: true
      }
    },
    {
      _id: 'stu_kunal_004',
      userId: 'user_stu_kunal_004',
      rollNumber: '23ME045',
      fullName: 'Kunal Patil',
      email: 'kunal.mech23@nriit.edu.in',
      phone: '+91 94567 89013',
      branch: 'Mechanical',
      batch: '2027',
      academicYear: '2026-27',
      cgpa: 6.80,
      backlogs: 1,
      gender: 'Male',
      dob: '2004-03-29',
      address: '22, Rosewood Garden, Bengaluru',
      tenthPercentage: 81.0,
      twelfthPercentage: 79.5,
      skills: ['AutoCAD', 'SolidWorks', 'ANSYS', 'Python Basics', 'Manufacturing Processes'],
      certifications: [],
      projects: [],
      internships: [],
      resumeUrl: '',
      placementStatus: 'UNPLACED',
      placedCompany: '',
      placedPackage: 0,
      offerLetters: [],
      preferences: {
        preferredRoles: ['Design Engineer', 'Production Specialist', 'Quality Analyst'],
        preferredLocations: ['Pune', 'Chennai'],
        willingToRelocate: true
      }
    }
  ];

  const drives = [
    {
      _id: 'drive_google_2026_01',
      title: 'Google Software Engineering Campus Drive 2026',
      companyId: 'comp_google_001',
      companyName: 'Google LLC',
      companyLogo: 'https://www.google.com/favicon.ico',
      jobRole: 'Associate Software Engineer',
      jobType: 'FULL_TIME',
      description: 'Google is hiring graduating engineering minds to work on our most critical global scale infrastructure, distributed systems, web applications, and developer productivity tools.',
      packageLpa: 38.5,
      stipendMonthly: 85000,
      location: 'Bengaluru / Hyderabad',
      venue: 'Main Auditorium (Pre-Placement Talk) & Virtual Online Assessment',
      vacancies: 15,
      eligibility: {
        branches: ['CSE', 'IT', 'AIML', 'Data Science'],
        batch: ['2027'],
        minCgpa: 8.0,
        maxBacklogs: 0,
        genderPreference: 'All'
      },
      selectionProcess: [
        'Round 1: Online Coding Assessment (2 LeetCode Medium/Hard questions)',
        'Round 2: Technical Interview I (Data Structures & System Fundamentals)',
        'Round 3: Technical Interview II (Algorithms & Coding Excellence)',
        'Round 4: Googleyness & Leadership Round'
      ],
      requiredDocuments: [
        'Updated Resume in PDF format',
        'College ID Card & Government Photo ID',
        'Official Academic Transcripts (Sem 1 to Sem 6)'
      ],
      driveDate: '2026-10-15',
      deadline: '2026-10-10',
      status: 'UPCOMING',
      createdBy: 'user_admin_001'
    },
    {
      _id: 'drive_msft_2026_02',
      title: 'Microsoft Accelerate Campus Hiring Program',
      companyId: 'comp_msft_002',
      companyName: 'Microsoft Corporation',
      companyLogo: 'https://www.microsoft.com/favicon.ico',
      jobRole: 'Software Engineer - Core Cloud & AI',
      jobType: 'FULL_TIME',
      description: 'Join Azure, Office 365, and AI Innovation teams to build next-generation enterprise platforms reaching billions of users worldwide.',
      packageLpa: 43.5,
      stipendMonthly: 90000,
      location: 'Bengaluru / Hyderabad / Noida',
      venue: 'Virtual Teams Assessment & On-Campus Interviews',
      vacancies: 20,
      eligibility: {
        branches: ['CSE', 'IT', 'ECE', 'AIML', 'Data Science'],
        batch: ['2027'],
        minCgpa: 7.5,
        maxBacklogs: 0,
        genderPreference: 'All'
      },
      selectionProcess: [
        'Round 1: Online Technical Assessment (Cognitive + 2 Coding Questions)',
        'Round 2: Technical Discussion I (Problem Solving & Code Design)',
        'Round 3: Technical Discussion II (System Design & OOP Patterns)',
        'Round 4: HR & Cultural Fitment Discussion'
      ],
      requiredDocuments: [
        'Resume',
        'Bonafide Certificate',
        'Grade Cards'
      ],
      driveDate: '2026-10-20',
      deadline: '2026-10-14',
      status: 'UPCOMING',
      createdBy: 'user_admin_001'
    },
    {
      _id: 'drive_cisco_2026_03',
      title: 'Cisco Systems Software & Networking Recruitment',
      companyId: 'comp_cisco_004',
      companyName: 'Cisco Systems',
      companyLogo: 'https://www.cisco.com/favicon.ico',
      jobRole: 'Software Consulting Engineer',
      jobType: 'FULL_TIME',
      description: 'Solve real-world networking, cloud architecture, and security challenges for Fortune 500 customers across the globe.',
      packageLpa: 19.5,
      stipendMonthly: 50000,
      location: 'Bengaluru',
      venue: 'Virtual & Tech Lab 3',
      vacancies: 25,
      eligibility: {
        branches: ['CSE', 'ECE', 'EEE', 'IT', 'AIML'],
        batch: ['2027'],
        minCgpa: 7.0,
        maxBacklogs: 0,
        genderPreference: 'All'
      },
      selectionProcess: [
        'Round 1: HackerRank Online Coding & Aptitude Test',
        'Round 2: Technical Interview (Computer Networks, OS, C/Python)',
        'Round 3: Managerial Interview',
        'Round 4: HR Evaluation'
      ],
      requiredDocuments: ['College ID', 'Updated CV'],
      driveDate: '2026-10-25',
      deadline: '2026-10-18',
      status: 'UPCOMING',
      createdBy: 'user_admin_001'
    },
    {
      _id: 'drive_deloitte_2026_04',
      title: 'Deloitte USI Analyst Campus Recruitment',
      companyId: 'comp_deloitte_005',
      companyName: 'Deloitte USI',
      companyLogo: 'https://www.deloitte.com/favicon.ico',
      jobRole: 'Technology Consulting Analyst',
      jobType: 'FULL_TIME',
      description: 'Consulting analyst roles focusing on Enterprise cloud transformations, SAP, Salesforce, Cyber Risk, and AI Advisory.',
      packageLpa: 12.0,
      stipendMonthly: 35000,
      location: 'Hyderabad / Bengaluru',
      venue: 'College Convention Centre',
      vacancies: 40,
      eligibility: {
        branches: ['CSE', 'ECE', 'EEE', 'IT', 'AIML', 'Mechanical', 'Civil'],
        batch: ['2027'],
        minCgpa: 6.5,
        maxBacklogs: 1,
        genderPreference: 'All'
      },
      selectionProcess: [
        'Round 1: Versant Voice & English Proficiency',
        'Round 2: Quantitative Aptitude & Logical Reasoning',
        'Round 3: Group Discussion / Case Study Presentation',
        'Round 4: Combined Technical & Partner Interview'
      ],
      requiredDocuments: ['Govt ID', 'College ID', 'Resume'],
      driveDate: '2026-11-05',
      deadline: '2026-10-28',
      status: 'UPCOMING',
      createdBy: 'user_admin_001'
    },
    {
      _id: 'drive_tcs_2026_05',
      title: 'TCS National Qualifier Test (NQT) - Digital & Prime',
      companyId: 'comp_tcs_006',
      companyName: 'Tata Consultancy Services',
      companyLogo: 'https://www.tcs.com/favicon.ico',
      jobRole: 'Digital & Prime Software Engineer',
      jobType: 'FULL_TIME',
      description: 'Premier national talent initiative by TCS recognizing top engineering talent with high-impact roles in cloud, cybersecurity, and modern technologies.',
      packageLpa: 9.0,
      stipendMonthly: 25000,
      location: 'Pan India',
      venue: 'iON Digital Test Zone & Virtual Interviews',
      vacancies: 120,
      eligibility: {
        branches: ['CSE', 'ECE', 'EEE', 'IT', 'AIML', 'Mechanical', 'Civil'],
        batch: ['2027'],
        minCgpa: 6.0,
        maxBacklogs: 1,
        genderPreference: 'All'
      },
      selectionProcess: [
        'Round 1: TCS NQT Cognitive + Advanced Coding Test',
        'Round 2: Technical Interview',
        'Round 3: HR Interview'
      ],
      requiredDocuments: ['NQT Hall Ticket', 'Government ID', 'Resume'],
      driveDate: '2026-11-12',
      deadline: '2026-11-02',
      status: 'UPCOMING',
      createdBy: 'user_admin_001'
    }
  ];

  const applications = [
    {
      _id: 'app_001',
      studentId: 'stu_mahi_001',
      driveId: 'drive_google_2026_01',
      companyId: 'comp_google_001',
      appliedDate: new Date('2026-09-10'),
      status: 'SELECTED',
      currentRound: 'Final Selection Completed',
      notes: 'Exceptional performance in algorithmic problem solving and system design.',
      feedback: 'Offered Associate Software Engineer role at 38.5 LPA'
    },
    {
      _id: 'app_002',
      studentId: 'stu_ananya_003',
      driveId: 'drive_msft_2026_02',
      companyId: 'comp_msft_002',
      appliedDate: new Date('2026-09-12'),
      status: 'SELECTED',
      currentRound: 'Final Selection Completed',
      notes: 'Outstanding deep learning project background and strong coding skills.',
      feedback: 'Offered Software Engineer - AI Systems at 43.5 LPA'
    },
    {
      _id: 'app_003',
      studentId: 'stu_rahul_002',
      driveId: 'drive_cisco_2026_03',
      companyId: 'comp_cisco_004',
      appliedDate: new Date('2026-09-15'),
      status: 'INTERVIEW',
      currentRound: 'Technical Interview II',
      notes: 'Passed online coding assessment with 100% score.',
      feedback: 'Interview scheduled for Oct 12th'
    },
    {
      _id: 'app_004',
      studentId: 'stu_mahi_001',
      driveId: 'drive_msft_2026_02',
      companyId: 'comp_msft_002',
      appliedDate: new Date('2026-09-14'),
      status: 'SHORTLISTED',
      currentRound: 'Technical Interview I',
      notes: 'Shortlisted based on high assessment marks.',
      feedback: ''
    }
  ];

  const attendances = [
    {
      _id: 'att_001',
      driveId: 'drive_google_2026_01',
      roundName: 'Online Assessment',
      studentId: 'stu_mahi_001',
      isPresent: true,
      markedAt: new Date('2026-09-12'),
      markedBy: 'user_admin_001'
    },
    {
      _id: 'att_002',
      driveId: 'drive_msft_2026_02',
      roundName: 'Online Assessment',
      studentId: 'stu_ananya_003',
      isPresent: true,
      markedAt: new Date('2026-09-14'),
      markedBy: 'user_admin_001'
    },
    {
      _id: 'att_003',
      driveId: 'drive_cisco_2026_03',
      roundName: 'Online Assessment',
      studentId: 'stu_rahul_002',
      isPresent: true,
      markedAt: new Date('2026-09-16'),
      markedBy: 'user_admin_001'
    }
  ];

  const interviews = [
    {
      _id: 'int_001',
      driveId: 'drive_cisco_2026_03',
      applicationId: 'app_003',
      studentId: 'stu_rahul_002',
      companyId: 'comp_cisco_004',
      roundName: 'Technical Interview - Core Systems',
      roundNumber: 2,
      scheduledAt: '2026-10-12 11:30 AM',
      mode: 'ONLINE',
      venueOrLink: 'https://meet.google.com/xyz-abcd-efg',
      status: 'SCHEDULED',
      feedback: 'Candidate demonstrated good knowledge in TCP/IP; proceeding to second technical evaluation.',
      interviewer: 'Rajesh Nair (Principal Architect, Cisco)'
    }
  ];

  const selections = [
    {
      _id: 'sel_001',
      driveId: 'drive_google_2026_01',
      applicationId: 'app_001',
      studentId: 'stu_mahi_001',
      companyId: 'comp_google_001',
      packageLpa: 38.5,
      designation: 'Associate Software Engineer',
      offerLetterUrl: '/uploads/documents/offer-google-mahi.pdf',
      selectionDate: '2026-09-20',
      status: 'ACCEPTED',
      academicYear: '2026-27'
    },
    {
      _id: 'sel_002',
      driveId: 'drive_msft_2026_02',
      applicationId: 'app_002',
      studentId: 'stu_ananya_003',
      companyId: 'comp_msft_002',
      packageLpa: 43.5,
      designation: 'Software Engineer - AI Systems',
      offerLetterUrl: '/uploads/documents/offer-msft-ananya.pdf',
      selectionDate: '2026-09-18',
      status: 'ACCEPTED',
      academicYear: '2026-27'
    }
  ];

  const trainings = [
    {
      _id: 'trn_001',
      title: 'Full Stack Web Engineering & Cloud Deployment Bootcamp',
      code: 'TRN-FSW-2026',
      category: 'TECHNICAL',
      description: 'Comprehensive 40-hour intensive hands-on bootcamp covering Node.js microservices, React single-page applications, MongoDB aggregations, and AWS Cloud deployments.',
      instructor: 'Kavita Menon (Ex-Amazon Staff Engineer)',
      startDate: '2026-10-05',
      endDate: '2026-10-25',
      targetBranches: ['CSE', 'IT', 'AIML', 'ECE'],
      targetBatches: ['2027'],
      venue: 'Computer Center Lab 1 & Microsoft Teams',
      status: 'ACTIVE',
      syllabus: [
        'Module 1: Modern JavaScript ES6+, Asynchronous Patterns & Node Internals',
        'Module 2: Building Production REST APIs with Express & Security Middlewares',
        'Module 3: Database Design, Schema Modeling & Indexing in MongoDB',
        'Module 4: React Fundamentals, State Management & Custom Hooks',
        'Module 5: Docker Containerization, CI/CD Pipelines & Cloud Hosting'
      ],
      totalHours: 40
    },
    {
      _id: 'trn_002',
      title: 'Competitive DSA & FAANG Coding Interview Mastery',
      code: 'TRN-DSA-2026',
      category: 'INTERVIEW_PREP',
      description: 'Systematic drill on advanced data structures, graph traversals, dynamic programming patterns, and time-space optimization strategies required for Tier 1 tech interviews.',
      instructor: 'Prof. Vikram Verma (Competitive Coding Lead)',
      startDate: '2026-09-20',
      endDate: '2026-10-18',
      targetBranches: ['CSE', 'IT', 'AIML', 'Data Science', 'ECE', 'EEE'],
      targetBatches: ['2027'],
      venue: 'Seminar Hall 2',
      status: 'ACTIVE',
      syllabus: [
        'Module 1: Asymptotic Analysis & Two-Pointer / Sliding Window Techniques',
        'Module 2: Trees, Tries & Binary Search Invariants',
        'Module 3: Graph Algorithms (BFS, DFS, Dijkstra, Union-Find)',
        'Module 4: Dynamic Programming (Memoization vs Tabulation, Knapsack, Matrix Chain)',
        'Module 5: Live Mock Technical Coding Rounds & Timed Assessments'
      ],
      totalHours: 45
    },
    {
      _id: 'trn_003',
      title: 'Corporate Aptitude, Quantitative Reasoning & Verbal Ability',
      code: 'TRN-APT-2026',
      category: 'APTITUDE',
      description: 'Master time-saving speed math tricks, logical puzzles, critical reasoning, and business communication required to clear first-round corporate screening tests.',
      instructor: 'Anand Kulkarni (Senior Aptitude Trainer)',
      startDate: '2026-10-01',
      endDate: '2026-10-30',
      targetBranches: ['All'],
      targetBatches: ['2027'],
      venue: 'Auditorium & LMS Portal',
      status: 'ACTIVE',
      syllabus: [
        'Module 1: Speed Arithmetic, Percentages, Profit & Loss, Ratio Proportions',
        'Module 2: Time-Speed-Distance, Work & Pipes, Permutations & Probability',
        'Module 3: Logical Seating Arrangements, Syllogisms, Blood Relations',
        'Module 4: Reading Comprehension, Sentence Correction & Vocabulary in Context'
      ],
      totalHours: 30
    }
  ];

  const trainingSessions = [
    {
      _id: 'sess_001',
      trainingId: 'trn_001',
      title: 'Session 1: Node.js Architecture & Asynchronous Event Loop',
      sessionDate: '2026-10-05',
      startTime: '10:00 AM',
      endTime: '12:00 PM',
      topic: 'Event loop mechanics, libuv, non-blocking I/O, streams and buffers',
      venue: 'Computer Center Lab 1'
    },
    {
      _id: 'sess_002',
      trainingId: 'trn_001',
      title: 'Session 2: RESTful API Security & Token Architecture',
      sessionDate: '2026-10-07',
      startTime: '10:00 AM',
      endTime: '12:00 PM',
      topic: 'JWT payload signing, helmet headers, rate limiting, and CORS best practices',
      venue: 'Computer Center Lab 1'
    }
  ];

  const trainingAttendances = [
    {
      _id: 'tr_att_001',
      trainingId: 'trn_001',
      sessionId: 'sess_001',
      studentId: 'stu_mahi_001',
      isPresent: true,
      markedAt: new Date('2026-10-05')
    },
    {
      _id: 'tr_att_002',
      trainingId: 'trn_001',
      sessionId: 'sess_001',
      studentId: 'stu_rahul_002',
      isPresent: true,
      markedAt: new Date('2026-10-05')
    }
  ];

  const internships = [
    {
      _id: 'intn_001',
      title: 'Software Engineering Summer Intern 2027',
      company: 'Google India',
      stipend: '₹1,00,000 / month',
      duration: '8 - 12 Weeks (Summer 2027)',
      location: 'Bengaluru / Hyderabad',
      type: 'SUMMER',
      applyLink: 'https://careers.google.com/internships',
      deadline: '2026-11-15',
      branches: ['CSE', 'IT', 'AIML', 'ECE'],
      description: 'Interns at Google work on core products that impact billions of users worldwide. You will partner with an experienced mentor, write production-ready code, and present project milestones.',
      requirements: ['Enrolled in B.Tech 2027 batch', 'Proficiency in C++, Java, or Python', 'Solid data structures foundation'],
      status: 'ACTIVE'
    },
    {
      _id: 'intn_002',
      title: 'Cloud Solutions Engineering Intern',
      company: 'Amazon Web Services',
      stipend: '₹80,000 / month',
      duration: '6 Months (Jan 2027 - Jun 2027)',
      location: 'Bengaluru',
      type: 'SEMESTER_LONG',
      applyLink: 'https://amazon.jobs',
      deadline: '2026-11-20',
      branches: ['CSE', 'IT', 'ECE', 'EEE'],
      description: 'Assist enterprise AWS customers in designing resilient, fault-tolerant cloud architectures and automating infrastructure via Terraform and CloudFormation.',
      requirements: ['Familiarity with Linux OS', 'Networking fundamentals', 'Strong verbal and written communication'],
      status: 'ACTIVE'
    },
    {
      _id: 'intn_003',
      title: 'AI & Data Science Research Intern',
      company: 'Microsoft Research India',
      stipend: '₹90,000 / month',
      duration: '6 Months',
      location: 'Bengaluru',
      type: 'SEMESTER_LONG',
      applyLink: 'https://careers.microsoft.com',
      deadline: '2026-11-25',
      branches: ['CSE', 'AIML', 'Data Science'],
      description: 'Collaborate with world-class computer scientists on state-of-the-art multimodal vision and language architectures.',
      requirements: ['PyTorch or JAX proficiency', 'Linear algebra & calculus understanding', 'Prior academic publications or open source contributions preferred'],
      status: 'ACTIVE'
    }
  ];

  const events = [
    {
      _id: 'evt_001',
      title: 'Annual Campus Placement Drive & Corporate Summit 2026',
      category: 'JOB_FAIR',
      speakerOrGuest: 'Chief Guest: Dr. N. Murthy (Tech Visionary) & HR Directors of 30+ Tech Majors',
      organization: 'Training and Placement Cell',
      eventDate: '2026-10-18',
      time: '9:00 AM - 6:00 PM',
      venue: 'Main Campus Convention Center & Exhibition Pavilion',
      description: 'Mega recruitment congregation bringing together over 60 premier hiring partners, on-spot assessment hubs, and senior leadership panel discussions on emerging hiring trends.',
      bannerImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
      registrationLink: 'https://forms.gle/summit2026',
      isPublic: true
    },
    {
      _id: 'evt_002',
      title: 'Workshop: Cracking System Design & Scalability Interviews',
      category: 'WORKSHOP',
      speakerOrGuest: 'Rohan Deshmukh (Principal Architect at Uber)',
      organization: 'NRIIT Computing Society in association with TPO',
      eventDate: '2026-10-22',
      time: '2:00 PM - 5:30 PM',
      venue: 'Auditorium 2 & Live Stream',
      description: 'Deep dive into load balancers, caching tiers, database sharding, consistency models, and microservice resiliency with interactive whiteboard sessions.',
      bannerImage: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
      registrationLink: '',
      isPublic: true
    },
    {
      _id: 'evt_003',
      title: 'Industry Visit: Cisco Security & Networking Labs',
      category: 'INDUSTRY_VISIT',
      speakerOrGuest: 'Hosted by Cisco University Relations Team',
      organization: 'Cisco Systems India',
      eventDate: '2026-11-04',
      time: '8:30 AM - 4:30 PM',
      venue: 'Cisco Campus, Cessna Business Park, Bengaluru',
      description: 'Exclusive on-site industrial tour for eligible final and pre-final year students to observe hyperscale switching infrastructure and cyber defense command center.',
      bannerImage: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
      registrationLink: '',
      isPublic: true
    }
  ];

  const announcements = [
    {
      _id: 'anc_001',
      title: 'Urgent: Google SWE Campus Drive 2026 Registration Deadline Approaching',
      category: 'DRIVE',
      content: 'All eligible students from CSE, IT, and AIML branches with CGPA 8.0 and above are reminded to submit their applications along with updated ATS-compliant resumes before 10th October 2026, 11:59 PM. No late submissions will be entertained.',
      targetAudience: 'STUDENTS',
      priority: 'URGENT',
      isPublished: true,
      expiresAt: '2026-10-10',
      attachments: [{ name: 'Google_Job_Description_2026.pdf', url: '/uploads/documents/google-jd.pdf' }],
      createdBy: 'user_admin_001'
    },
    {
      _id: 'anc_002',
      title: 'TCS National Qualifier Test (NQT) Mandatory Registration Notification',
      category: 'DRIVE',
      content: 'TCS NQT registration portal is now live for all 2027 batch graduating students. Students across all engineering branches are strongly advised to complete registration and upload verified grade sheets.',
      targetAudience: 'ALL',
      priority: 'HIGH',
      isPublished: true,
      expiresAt: '2026-11-02',
      attachments: [{ name: 'TCS_NQT_Guidelines.pdf', url: '/uploads/documents/tcs-nqt-guide.pdf' }],
      createdBy: 'user_admin_001'
    },
    {
      _id: 'anc_003',
      title: 'Placement Cell Policy Update: One Student, One Dream Job Guideline',
      category: 'POLICY',
      content: 'To maximize career opportunities for all students, the Placement Committee has revised the policy on concurrent job offers. A student securing a Tier 1 offer (>= 15 LPA) shall not be eligible for subsequent campus recruitment drives unless designated as a Super Dream opportunity (> 30 LPA).',
      targetAudience: 'ALL',
      priority: 'HIGH',
      isPublished: true,
      expiresAt: '2027-06-30',
      attachments: [],
      createdBy: 'user_admin_001'
    }
  ];

  const notifications = [
    {
      _id: 'notif_001',
      recipientId: 'stu_mahi_001',
      recipientRole: 'STUDENT',
      title: 'Congratulations! Official Offer Received from Google LLC',
      message: 'You have been selected for the position of Associate Software Engineer at Google LLC with an annual package of 38.5 LPA. Your offer letter is available in your Selection Portal.',
      type: 'SELECTION',
      link: '/student/selection',
      isRead: false
    },
    {
      _id: 'notif_002',
      recipientId: 'stu_rahul_002',
      recipientRole: 'STUDENT',
      title: 'Interview Scheduled: Cisco Systems Technical Round II',
      message: 'Your Technical Interview with Cisco Systems is scheduled for 12th October 2026 at 11:30 AM via Google Meet.',
      type: 'INTERVIEW',
      link: '/student/interviews',
      isRead: false
    },
    {
      _id: 'notif_003',
      recipientId: 'ALL',
      recipientRole: 'ALL',
      title: 'New Campus Placement Drive: Microsoft Accelerate Program',
      message: 'Microsoft Corporation has announced its campus drive for Software Engineer roles (43.5 LPA). Eligible students can review criteria and apply online.',
      type: 'DRIVE',
      link: '/placements/drives/drive_msft_2026_02',
      isRead: false
    }
  ];

  const resources = [
    {
      _id: 'res_001',
      title: 'Comprehensive Quantitative Aptitude & Speed Math Master Formula Sheet',
      category: 'APTITUDE',
      description: 'Handcrafted speed calculation shortcuts, mental math formulas, and 500+ solved practice problems covering all major corporate recruitment exams.',
      fileUrl: '/uploads/documents/aptitude-master-sheet.pdf',
      externalLink: 'https://indiabix.com',
      tags: ['Aptitude', 'Quantitative', 'Speed Math', 'TCS', 'Infosys'],
      isPublished: true,
      downloadsCount: 1420
    },
    {
      _id: 'res_002',
      title: 'Blind 75 & LeetCode Top 150 Coding Problem Explanations with Code in C++, Java & Python',
      category: 'CODING',
      description: 'Curated list of must-solve algorithmic interview problems classified by pattern: Sliding Window, Two Heaps, Topological Sort, and Dynamic Programming.',
      fileUrl: '/uploads/documents/dsa-top-150.pdf',
      externalLink: 'https://leetcode.com',
      tags: ['DSA', 'LeetCode', 'Algorithms', 'FAANG', 'Coding'],
      isPublished: true,
      downloadsCount: 2315
    },
    {
      _id: 'res_003',
      title: 'FAANG-Standard ATS-Optimized Single Page Resume LaTeX and Word Templates',
      category: 'RESUME',
      description: 'Tested and proven resume template formats designed to pass modern Applicant Tracking Systems (ATS) with 95%+ parser fidelity.',
      fileUrl: '/uploads/documents/ats-resume-templates.zip',
      externalLink: 'https://overleaf.com',
      tags: ['Resume', 'ATS', 'LaTeX', 'Career Preparation'],
      isPublished: true,
      downloadsCount: 1890
    },
    {
      _id: 'res_004',
      title: 'Top 50 Behavioral Interview Questions & STAR Method Response Guide',
      category: 'HR',
      description: 'Proven strategies for answering HR questions: "Tell me about yourself", "Conflict resolution", "Weaknesses", and salary negotiation.',
      fileUrl: '/uploads/documents/hr-star-guide.pdf',
      externalLink: '',
      tags: ['HR Interview', 'Behavioral', 'STAR Method', 'Soft Skills'],
      isPublished: true,
      downloadsCount: 970
    }
  ];

  const gallery = [
    {
      _id: 'gal_001',
      title: 'Google Day - On-Campus Interactive Tech Keynote & Welcome Ceremony',
      category: 'COMPANY_VISIT',
      imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
      caption: 'Google University Hiring team engaging with final year engineering students during pre-placement orientation.',
      eventDate: '2026-09-10',
      isFeatured: true
    },
    {
      _id: 'gal_002',
      title: 'Grand Felicitation Ceremony - Honoring Super Dream Placement Achievers',
      category: 'AWARDS',
      imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
      caption: 'College Chairman and T&P Head presenting distinction awards and mementos to students securing 30+ LPA offers.',
      eventDate: '2026-09-22',
      isFeatured: true
    },
    {
      _id: 'gal_003',
      title: 'Hands-On Cloud Architecture & Kubernetes Hackathon in Progress',
      category: 'HACKATHON',
      imageUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80',
      caption: 'Over 200 student developers solving live enterprise cloud deployment challenges over a 24-hour sprint.',
      eventDate: '2026-08-30',
      isFeatured: true
    },
    {
      _id: 'gal_004',
      title: 'Industry Leaders Round Table & Academic Advisory Meet',
      category: 'PLACEMENT',
      imageUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80',
      caption: 'Industry HR directors discussing curriculum modernization to match futuristic AI and quantum computing demands.',
      eventDate: '2026-09-05',
      isFeatured: false
    }
  ];

  const achievements = [
    {
      _id: 'ach_001',
      studentName: 'Mahi Sharma',
      rollNumber: '23CS001',
      branch: 'CSE',
      batch: '2027',
      companyName: 'Google LLC',
      companyLogo: 'https://www.google.com/favicon.ico',
      packageLpa: 38.5,
      role: 'Associate Software Engineer',
      photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
      badge: 'Super Dream Offer',
      year: '2026-27',
      isFeatured: true
    },
    {
      _id: 'ach_002',
      studentName: 'Ananya Iyer',
      rollNumber: '23AI008',
      branch: 'AIML',
      batch: '2027',
      companyName: 'Microsoft Corporation',
      companyLogo: 'https://www.microsoft.com/favicon.ico',
      packageLpa: 43.5,
      role: 'Software Engineer - AI Systems',
      photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
      badge: 'Super Dream Offer',
      year: '2026-27',
      isFeatured: true
    },
    {
      _id: 'ach_003',
      studentName: 'Siddharth Rao',
      rollNumber: '22CS089',
      branch: 'CSE',
      batch: '2026',
      companyName: 'Amazon Web Services',
      companyLogo: 'https://www.amazon.com/favicon.ico',
      packageLpa: 36.0,
      role: 'Cloud Development Engineer',
      photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
      badge: 'Super Dream Offer',
      year: '2025-26',
      isFeatured: true
    }
  ];

  const successStories = [
    {
      _id: 'succ_001',
      studentName: 'Mahi Sharma',
      batch: '2027',
      branch: 'Computer Science & Engineering',
      currentCompany: 'Google LLC',
      designation: 'Associate Software Engineer',
      packageLpa: 38.5,
      testimonial: 'The continuous mentoring, technical bootcamps, and mock interviews organized by TPO Connect were instrumental in shaping my problem-solving speed. The dynamic portal made tracking eligibility and applications effortless.',
      photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
      linkedinUrl: 'https://linkedin.com/in/mahi-sharma',
      isFeatured: true
    },
    {
      _id: 'succ_002',
      studentName: 'Ananya Iyer',
      batch: '2027',
      branch: 'Artificial Intelligence & Machine Learning',
      currentCompany: 'Microsoft Corporation',
      designation: 'Software Engineer - AI Systems',
      packageLpa: 43.5,
      testimonial: 'From resume reviews to personalized guidance from industry alumni, our T&P Cell provided every tool needed to convert opportunities at Microsoft. Highly grateful for the relentless support!',
      photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
      linkedinUrl: 'https://linkedin.com/in/ananya-iyer',
      isFeatured: true
    }
  ];

  const faqs = [
    {
      _id: 'faq_001',
      question: 'What is the eligibility criterion for participating in campus placement drives?',
      answer: 'Eligibility criteria are determined dynamically per recruitment drive by the visiting employer. Generally, students must maintain a minimum CGPA (commonly 6.5 - 8.0) and have zero or limited active backlogs in accordance with company policy.',
      category: 'STUDENTS',
      order: 1,
      isPublished: true
    },
    {
      _id: 'faq_002',
      question: 'What is the "One Student, One Offer" policy at our institution?',
      answer: 'Once a student secures an official offer, they are placed. They may only apply for higher category "Dream" (>= 12 LPA) or "Super Dream" (>= 25 LPA) recruitment drives in accordance with official placement guidelines.',
      category: 'POLICY',
      order: 2,
      isPublished: true
    },
    {
      _id: 'faq_003',
      question: 'How do corporate recruiters schedule an on-campus or virtual recruitment drive?',
      answer: 'Recruiters can register directly through our "Recruit With Us" portal or contact the T&P Cell at placements@nriit.edu.in. Once verified, recruiters can post job requirements, schedule pre-placement talks, and shortlist candidates directly.',
      category: 'RECRUITERS',
      order: 3,
      isPublished: true
    },
    {
      _id: 'faq_004',
      question: 'Are pre-placement training sessions and aptitude classes mandatory?',
      answer: 'Yes. Attendance in accredited training programs, company-specific bootcamps, and mock interviews is mandatory. A minimum 85% attendance is required to remain eligible for premier Tier 1 company recruitment drives.',
      category: 'TRAINING',
      order: 4,
      isPublished: true
    }
  ];

  const feedbacks = [
    {
      _id: 'fb_001',
      name: 'Rohan Mehta',
      email: 'rohan.m@gmail.com',
      role: 'Student',
      subject: 'Great initiative with the new TPO Connect portal',
      message: 'The new dynamic eligibility calculator and one-click application feature saves an immense amount of time during drive registrations!',
      rating: 5,
      status: 'REVIEWED',
      response: 'Thank you for your valuable feedback, Rohan! We continuously enhance features for student success.'
    }
  ];

  const grievances = [
    {
      _id: 'grv_001',
      ticketNumber: 'GRV-2026-8941',
      studentName: 'Kunal Patil',
      rollNumber: '23ME045',
      email: 'kunal.mech23@nriit.edu.in',
      category: 'ELIGIBILITY',
      description: 'Re-evaluation mark sheet updated with no backlogs, but portal still lists 1 backlog in records.',
      status: 'RESOLVED',
      adminRemarks: 'Grade card verified with Academic Section. Backlogs updated to 0.',
      resolvedAt: new Date('2026-09-25')
    }
  ];

  const settings = {
    _id: 'settings_singleton_001',
    collegeName: 'NRIIT ENGINEERING COLLEGE',
    collegeLogo: '/assets/images/nriit-logo.png',
    favicon: '/assets/images/nriit-logo.png',
    departmentName: 'Department of Training & Placement',
    heroTitle: 'Empowering Careers, Shaping Tomorrow’s Technology Leaders',
    heroSubtitle: 'Connecting premier engineering talent with global Fortune 500 enterprises, innovative high-growth startups, and cutting-edge research labs.',
    officerName: 'Dr. Rajesh Sharma',
    officerDesignation: 'Director & Head - Training & Placement',
    officerPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80',
    officerMessage: 'At NRIIT ENGINEERING COLLEGE, our mission is to ensure every student is prepared not just for their first job, but for an enduring, impactful technology career. Our holistic training architecture, strong industry partnerships, and dedicated faculty mentors work tirelessly to deliver transformative career outcomes.',
    primaryContact: '+91 866 2469666',
    email: 'placements@nriit.edu.in',
    phone: '+91 866 2469666',
    officeAddress: 'NRI Institute of Technology, Pothavarappadu (V), Agiripalli (M), Vijayawada Rural, Eluru District, Andhra Pradesh - 521212',
    workingHours: 'Monday - Friday: 8:30 AM - 5:30 PM, Saturday: 9:00 AM - 1:30 PM',
    googleMapsUrl: 'https://maps.google.com/?q=NRI+Institute+of+Technology+Vijayawada',
    socialLinks: {
      facebook: 'https://facebook.com/nriit',
      instagram: 'https://instagram.com/nriit',
      linkedin: 'https://linkedin.com/school/nriit',
      youtube: 'https://youtube.com/nriit',
      twitter: 'https://twitter.com/nriit',
      collegeWebsite: 'https://nriit.edu.in'
    },
    footerText: '© 2026 NRIIT ENGINEERING COLLEGE. Autonomous | NAAC A+ | NBA Accredited. All Rights Reserved.',
    maintenanceMode: false,
    academicYears: ['2023-24', '2024-25', '2025-26', '2026-27', '2027-28'],
    branches: [
      'CSE',
      'ECE',
      'EEE',
      'IT',
      'AIML',
      'Data Science',
      'Mechanical',
      'Civil',
      'Biotechnology'
    ],
    placementStatuses: [
      'UNPLACED',
      'REGISTERED',
      'PLACED',
      'OPTED_OUT',
      'HIGHER_STUDIES'
    ],
    applicationStatuses: [
      'REGISTERED',
      'ATTENDED',
      'SHORTLISTED',
      'TEST_QUALIFIED',
      'INTERVIEW',
      'SELECTED',
      'REJECTED',
      'WAITLISTED',
      'OFFER_RECEIVED',
      'JOINED'
    ],
    trainingCategories: [
      'APTITUDE',
      'TECHNICAL',
      'SOFT_SKILLS',
      'INTERVIEW_PREP',
      'WORKSHOP',
      'BOOTCAMP'
    ]
  };

  const auditLogs = [
    {
      action: 'SYSTEM_INITIALIZATION',
      performedBy: {
        userId: 'SYSTEM',
        name: 'System Kernel',
        email: 'system@nriit.edu.in',
        role: 'SUPER_ADMIN'
      },
      targetModel: 'Settings',
      targetId: 'settings_singleton_001',
      ipAddress: '127.0.0.1',
      details: { message: 'TPO Connect system initialized with dynamic configuration.' },
      timestamp: new Date()
    }
  ];

  return {
    users,
    companies,
    recruiters,
    students,
    drives,
    applications,
    attendances,
    interviews,
    selections,
    trainings,
    trainingSessions,
    trainingAttendances,
    internships,
    events,
    announcements,
    notifications,
    resources,
    gallery,
    achievements,
    successStories,
    faqs,
    feedbacks,
    grievances,
    settings,
    auditLogs
  };
};

module.exports = {
  getSeedData
};

