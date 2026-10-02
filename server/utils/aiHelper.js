/**
 * AI Career & Placement Engine
 * Provides smart heuristics, keyword extraction, resume scoring,
 * role match percentages, and automated interview question generation.
 */

const analyzeResumeSkills = (studentData) => {
  const commonTechKeywords = [
    'JavaScript', 'Python', 'Java', 'C++', 'React', 'Node.js', 'SQL',
    'MongoDB', 'Docker', 'Kubernetes', 'AWS', 'Git', 'Machine Learning',
    'Data Structures', 'Algorithms', 'TypeScript', 'REST API', 'Express.js',
    'HTML5', 'CSS3', 'Next.js', 'Tailwind', 'DevOps', 'CI/CD', 'Linux'
  ];

  const presentSkills = studentData.skills || [];
  const projectCount = (studentData.projects || []).length;
  const certCount = (studentData.certifications || []).length;
  const internshipCount = (studentData.internships || []).length;
  const cgpa = Number(studentData.cgpa || 0);

  // Calculate ATS completeness score (0 - 100)
  let score = 30; // base score
  score += Math.min(25, presentSkills.length * 4);
  score += Math.min(20, projectCount * 7);
  score += Math.min(15, certCount * 5);
  score += Math.min(10, internshipCount * 10);
  if (cgpa >= 8.0) score += 5;
  score = Math.min(100, Math.round(score));

  // Determine strengths & suggestions
  const strengths = [];
  const suggestions = [];

  if (presentSkills.length >= 6) {
    strengths.push('Strong diversity of core technical competencies');
  } else {
    suggestions.push('Add more specialized domain skills (Cloud, Databases, Frameworks)');
  }

  if (projectCount >= 2) {
    strengths.push('Demonstrated hands-on experience through project implementations');
  } else {
    suggestions.push('Add at least 2 full-stack or domain-specific projects with GitHub & demo links');
  }

  if (internshipCount > 0) {
    strengths.push('Valuable industry exposure through previous internships');
  } else {
    suggestions.push('Apply for internships or open-source programs to showcase real-world teamwork');
  }

  // Recommended next skills
  const missingKeywords = commonTechKeywords.filter(k => 
    !presentSkills.some(s => s.toLowerCase() === k.toLowerCase())
  ).slice(0, 5);

  return {
    score,
    grade: score >= 85 ? 'EXCELLENT' : score >= 70 ? 'STRONG' : score >= 50 ? 'AVERAGE' : 'NEEDS_IMPROVEMENT',
    strengths,
    suggestions,
    recommendedKeywords: missingKeywords,
    summary: `Your profile currently scores ${score}/100 in ATS readiness. Enhancing projects and targeted certifications will significantly increase recruiter response rates.`
  };
};

const calculateJobMatch = (student, drive) => {
  let score = 50;
  const reasons = [];

  // Branch check
  const allowedBranches = drive.eligibility?.branches || [];
  if (allowedBranches.length === 0 || allowedBranches.includes(student.branch)) {
    score += 20;
    reasons.push(`Branch ${student.branch} matches criteria`);
  } else {
    score -= 30;
    reasons.push(`Branch ${student.branch} not listed in preferred branches`);
  }

  // CGPA check
  const minCgpa = drive.eligibility?.minCgpa || 0;
  if ((student.cgpa || 0) >= minCgpa) {
    score += 15;
    reasons.push(`CGPA ${student.cgpa} exceeds minimum threshold (${minCgpa})`);
  } else {
    score -= 25;
    reasons.push(`CGPA ${student.cgpa} is below requirement (${minCgpa})`);
  }

  // Backlogs
  const maxBacklogs = drive.eligibility?.maxBacklogs ?? 0;
  if ((student.backlogs || 0) <= maxBacklogs) {
    score += 15;
    reasons.push(`Backlog count (${student.backlogs}) within acceptable limits`);
  } else {
    score -= 30;
    reasons.push(`Active backlogs exceed maximum allowed (${maxBacklogs})`);
  }

  score = Math.max(10, Math.min(98, score));

  return {
    matchPercentage: score,
    isHighlyRecommended: score >= 80,
    reasons
  };
};

const generateInterviewQuestions = (jobRole, companyName = 'Recruiter') => {
  const roleLower = (jobRole || '').toLowerCase();

  let technical = [];
  let systemDesign = [];
  let behavioral = [
    'Tell me about a challenging technical problem you encountered in a college project and how you solved it.',
    'Describe a situation where you had to learn a completely new technology or tool under a tight deadline.',
    `Why are you specifically interested in starting your career with ${companyName}?`,
    'How do you prioritize competing deadlines between academic exams and recruitment preparation?'
  ];

  if (roleLower.includes('software') || roleLower.includes('developer') || roleLower.includes('sde') || roleLower.includes('backend') || roleLower.includes('full stack')) {
    technical = [
      'Explain the difference between synchronous and asynchronous execution in Node.js event loops.',
      'How does indexing work in MongoDB, and what are compound indexes?',
      'Describe how RESTful API authentication can be securely implemented using JWT tokens and HTTP-only cookies.',
      'What is the time and space complexity of QuickSort vs MergeSort, and when would you choose one over the other?',
      'Explain database transactions and ACID properties with an example.'
    ];
    systemDesign = [
      'Design a scalable URL shortener service (like Bitly) handling 10,000 requests per second.',
      'How would you design a real-time notification service for college placement drives?'
    ];
  } else if (roleLower.includes('data') || roleLower.includes('ai') || roleLower.includes('ml')) {
    technical = [
      'Explain the trade-off between Bias and Variance in predictive modeling.',
      'What is the difference between supervised, unsupervised, and reinforcement learning?',
      'How do you handle class imbalance in a dataset with 99% negative labels?',
      'Explain the internal architecture of Transformer models and attention mechanisms.',
      'How do SQL window functions (ROW_NUMBER, RANK, DENSE_RANK) differ?'
    ];
    systemDesign = [
      'Design a real-time analytics pipeline for streaming student test scores.',
      'How would you deploy an ML inference model with low latency and high availability?'
    ];
  } else {
    technical = [
      'Explain Object-Oriented Programming (OOP) concepts with real-world software examples.',
      'What are the primary differences between SQL (relational) and NoSQL (document-oriented) databases?',
      'How does HTTP/HTTPS encryption work using SSL/TLS handshakes?',
      'What strategies do you employ when debugging a memory leak or slow query?'
    ];
    systemDesign = [
      'Design an automated college attendance management system with barcode/RFID support.'
    ];
  }

  return {
    role: jobRole,
    company: companyName,
    technicalQuestions: technical,
    systemDesignQuestions: systemDesign,
    behavioralQuestions: behavioral,
    prepTips: [
      'Review your projects thoroughly; be prepared to explain architecture and design trade-offs.',
      'Practice writing clean, modular code with descriptive variable naming during live coding rounds.',
      'Use the STAR method (Situation, Task, Action, Result) for behavioral answers.'
    ]
  };
};

module.exports = {
  analyzeResumeSkills,
  calculateJobMatch,
  generateInterviewQuestions
};
