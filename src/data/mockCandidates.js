export const mockCandidates = [
  {
    id: 'CAN-001',
    name: 'Dr. Tarun Saxena',
    email: 'tarun.saxena@gmail.com',
    phone: '+91 98112 34567',
    age: 36,
    department: 'CSE',
    position: 'Associate Professor - AI & Robotics',
    qualification: 'Ph.D. in Computer Science (IIT Madras)',
    experience: 7,
    skills: ['PyTorch', 'Computer Vision', 'Deep Learning', 'ROS'],
    applicationDate: '2026-08-10',
    resumeUrl: 'tarun_saxena_cv.pdf',
    resumeStatus: 'Verified',
    status: 'Interview', // Applied, Screening, Shortlisted, Interview, Selected, Hired, Rejected
    interviewScore: 88,
    matchScore: 94,
    aiAssessment: {
      matchPercent: 94,
      strengths: [
        'Strong research track record (12 Q1 journal publications)',
        '7 years postgraduate teaching experience',
        'Proven grant acquisition track record (₹35L DST grant)'
      ],
      concerns: [
        'Requires onboarding orientation in LMS digital grading tools'
      ],
      recommendation: 'Strong candidate for interview panel evaluation. Recommended for Associate Professor tier.'
    }
  },
  {
    id: 'CAN-002',
    name: 'Dr. Shalini Ramachandran',
    email: 'shalini.r@gmail.com',
    phone: '+91 98112 34568',
    age: 33,
    department: 'ECE',
    position: 'Assistant Professor - VLSI & Embedded',
    qualification: 'Ph.D. in Microelectronics (IISc Bangalore)',
    experience: 5,
    skills: ['Cadence Virtuoso', 'Verilog', 'ASIC Design', 'FPGA'],
    applicationDate: '2026-08-14',
    resumeUrl: 'shalini_ramachandran_cv.pdf',
    resumeStatus: 'Verified',
    status: 'Shortlisted',
    interviewScore: null,
    matchScore: 91,
    aiAssessment: {
      matchPercent: 91,
      strengths: [
        'Specialized expertise in 7nm finFET layout and tape-out',
        'Outstanding student mentorship ratings during post-doc'
      ],
      concerns: [
        'Limited industrial consultancy experience'
      ],
      recommendation: 'Shortlist for Technical Interview round with ECE Dean.'
    }
  },
  {
    id: 'CAN-003',
    name: 'Prof. Manish Goswami',
    email: 'manish.g@yahoo.com',
    phone: '+91 98112 34569',
    age: 44,
    department: 'Mechanical',
    position: 'Professor - Thermal & Energy Systems',
    qualification: 'Ph.D. in Thermal Engineering (IIT Roorkee)',
    experience: 16,
    skills: ['Ansys Fluent', 'Computational Fluid Dynamics', 'Renewable Energy'],
    applicationDate: '2026-08-01',
    resumeUrl: 'manish_goswami_cv.pdf',
    resumeStatus: 'Verified',
    status: 'Selected',
    interviewScore: 92,
    matchScore: 96,
    aiAssessment: {
      matchPercent: 96,
      strengths: [
        '16 years senior academic leadership',
        'Direct expertise running clean-energy incubation centers'
      ],
      concerns: [
        'Expected joining timeline is 60 days notice period'
      ],
      recommendation: 'Ideal candidate for Department Chair track.'
    }
  },
  {
    id: 'CAN-004',
    name: 'Dr. Neha Bhasin',
    email: 'neha.bhasin@outlook.com',
    phone: '+91 98112 34570',
    age: 31,
    department: 'Biotechnology',
    position: 'Assistant Professor - Bioprocess & Genomics',
    qualification: 'Ph.D. in Molecular Biology (NCBS Bangalore)',
    experience: 4,
    skills: ['CRISPR-Cas9', 'Next-Gen Sequencing', 'Python for Genomics'],
    applicationDate: '2026-08-18',
    resumeUrl: 'neha_bhasin_cv.pdf',
    resumeStatus: 'Verified',
    status: 'Screening',
    interviewScore: null,
    matchScore: 87,
    aiAssessment: {
      matchPercent: 87,
      strengths: [
        'High-impact Nature Genetics co-author',
        'Modern molecular laboratory protocols mastery'
      ],
      concerns: [
        'Teaching experience is limited to 2 years TAship'
      ],
      recommendation: 'Progress to screening interview.'
    }
  },
  {
    id: 'CAN-005',
    name: 'Mr. Vivek Sundaram',
    email: 'vivek.s@gmail.com',
    phone: '+91 98112 34571',
    age: 29,
    department: 'CSE',
    position: 'Assistant Professor - Cybersecurity',
    qualification: 'M.Tech in Information Security (NIT Trichy)',
    experience: 3,
    skills: ['Ethical Hacking', 'Penetration Testing', 'Network Security'],
    applicationDate: '2026-08-20',
    resumeUrl: 'vivek_sundaram_cv.pdf',
    resumeStatus: 'Pending Verification',
    status: 'Applied',
    interviewScore: null,
    matchScore: 76,
    aiAssessment: {
      matchPercent: 76,
      strengths: [
        'Industry certifications (CEH, OSCP)',
        'Hands-on SOC operations expertise'
      ],
      concerns: [
        'Does not hold a Ph.D. (Ph.D. is preferred for tenure track)'
      ],
      recommendation: 'Review qualification equivalence before shortlisting.'
    }
  },
  {
    id: 'CAN-006',
    name: 'Dr. Radhika Pillai',
    email: 'radhika.pillai@gmail.com',
    phone: '+91 98112 34572',
    age: 37,
    department: 'ECE',
    position: 'Associate Professor - Optical Networks',
    qualification: 'Ph.D. in Photonics (IIT Delhi)',
    experience: 9,
    skills: ['Fiber Optics', 'Optoelectronics', 'MATLAB Optics'],
    applicationDate: '2026-08-05',
    resumeUrl: 'radhika_pillai_cv.pdf',
    resumeStatus: 'Verified',
    status: 'Hired',
    interviewScore: 90,
    matchScore: 93,
    aiAssessment: {
      matchPercent: 93,
      strengths: ['9 years teaching excellence', 'Active IEEE Photonics Senior Member'],
      concerns: [],
      recommendation: 'Hired. Moved to Faculty Onboarding.'
    }
  },
  {
    id: 'CAN-007',
    name: 'Dr. Alok Nath Tripathy',
    email: 'alok.tripathy@gmail.com',
    phone: '+91 98112 34573',
    age: 40,
    department: 'Mechanical',
    position: 'Associate Professor - Dynamics & Control',
    qualification: 'Ph.D. (IIT Kanpur)',
    experience: 11,
    skills: ['Vibrations', 'Control Engineering', 'Simulink'],
    applicationDate: '2026-08-11',
    resumeUrl: 'alok_tripathy_cv.pdf',
    resumeStatus: 'Verified',
    status: 'Interview',
    interviewScore: 84,
    matchScore: 88,
    aiAssessment: {
      matchPercent: 88,
      strengths: ['Solid core mechanical background', 'Industry consulting ties with Tata Motors'],
      concerns: ['Digital teaching tools familiarity needed'],
      recommendation: 'Interview completed; panel finalizing decision.'
    }
  },
  {
    id: 'CAN-008',
    name: 'Ms. Priyanka Sen',
    email: 'priyanka.sen@gmail.com',
    phone: '+91 98112 34574',
    age: 28,
    department: 'CSE',
    position: 'Assistant Professor - Web Technologies',
    qualification: 'M.Tech CSE (IIIT Hyderabad)',
    experience: 2,
    skills: ['Fullstack Web', 'Cloud Architecture', 'DevOps'],
    applicationDate: '2026-08-22',
    resumeUrl: 'priyanka_sen_cv.pdf',
    resumeStatus: 'Verified',
    status: 'Screening',
    interviewScore: null,
    matchScore: 82,
    aiAssessment: {
      matchPercent: 82,
      strengths: ['Modern tech stack curriculum alignment', 'Strong open source contributions'],
      concerns: ['Entry level teaching experience'],
      recommendation: 'Consider for adjunct or lecturer pathway.'
    }
  },
  {
    id: 'CAN-009',
    name: 'Dr. Bhavesh Patel',
    email: 'bhavesh.patel@gmail.com',
    phone: '+91 98112 34575',
    age: 39,
    department: 'Biotechnology',
    position: 'Associate Professor - Bioremediation',
    qualification: 'Ph.D. (ICT Mumbai)',
    experience: 10,
    skills: ['Environmental Biotech', 'Waste Management', 'Biochemistry'],
    applicationDate: '2026-08-08',
    resumeUrl: 'bhavesh_patel_cv.pdf',
    resumeStatus: 'Verified',
    status: 'Shortlisted',
    interviewScore: null,
    matchScore: 89,
    aiAssessment: {
      matchPercent: 89,
      strengths: ['Multiple patents filed in effluent treatment', 'Strong industrial collaborative grants'],
      concerns: [],
      recommendation: 'Shortlisted for Faculty Selection Committee round.'
    }
  },
  {
    id: 'CAN-010',
    name: 'Mr. Devendra Jha',
    email: 'devendra.jha@gmail.com',
    phone: '+91 98112 34576',
    age: 32,
    department: 'Mechanical',
    position: 'Assistant Professor - Material Science',
    qualification: 'M.Tech (VNIT Nagpur)',
    experience: 4,
    skills: ['Metallurgy', 'Composite Materials'],
    applicationDate: '2026-08-16',
    resumeUrl: 'devendra_jha_cv.pdf',
    resumeStatus: 'Verified',
    status: 'Applied',
    interviewScore: null,
    matchScore: 78,
    aiAssessment: {
      matchPercent: 78,
      strengths: ['Practical lab experience in SEM analysis'],
      concerns: ['Needs publication profile enhancement'],
      recommendation: 'Keep in active applicant pool.'
    }
  }
];
