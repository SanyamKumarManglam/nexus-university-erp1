export const mockTeacherStudentReviews = [
  {
    id: 'TSR-001',
    teacherId: 'T004',
    teacherName: 'Prof. Rajesh Sharma',
    studentId: 'STU-001',
    studentName: 'Rahul Sharma',
    course: 'Distributed Systems (CS602)',
    date: '2026-08-20',
    ratings: {
      academic: 5,
      participation: 4,
      attendance: 5,
      assignments: 5,
      overall: 4.8
    },
    strengths: 'Exceptional conceptual understanding of consensus algorithms (Raft & Paxos). Proactive in laboratory discussions.',
    improvements: 'Can contribute more frequently in open class Q&A sessions to assist peers.',
    privateNotes: 'Candidate is recommended for department research assistantship in distributed storage architectures.'
  },
  {
    id: 'TSR-002',
    teacherId: 'T002',
    teacherName: 'Dr. Karthik Rao',
    studentId: 'STU-007',
    studentName: 'Vikramaditya Rathore',
    course: 'Machine Learning (CS601)',
    date: '2026-08-22',
    ratings: {
      academic: 2,
      participation: 2,
      attendance: 2,
      assignments: 3,
      overall: 2.2
    },
    strengths: 'Shows keen practical interest when building web UIs for ML models.',
    improvements: 'Frequently misses morning 8:30 AM lectures. Lags behind in mathematical foundations of gradient descent.',
    privateNotes: 'Needs urgent advisor intervention. Student mentioned part-time night shift commitments impacting attendance.'
  },
  {
    id: 'TSR-003',
    teacherId: 'T001',
    teacherName: 'Dr. Ananya Mehta',
    studentId: 'STU-003',
    studentName: 'Aditya Venkatesh',
    course: 'VLSI Design (EC801)',
    date: '2026-08-25',
    ratings: {
      academic: 3,
      participation: 2,
      attendance: 2,
      assignments: 3,
      overall: 2.5
    },
    strengths: 'Good laboratory hardware debugging capability.',
    improvements: 'Attendance is critically low at 64%. Needs to submit pending design assignments.',
    privateNotes: 'Issued first academic alert. Parent-advisor meeting recommended if attendance does not improve by next week.'
  }
];

export const mockStudentTeacherReviews = [
  {
    id: 'STR-001',
    teacherId: 'T001',
    teacherName: 'Dr. Ananya Mehta',
    studentId: 'STU-004',
    studentName: 'Sneha Kulkarni',
    isAnonymous: false,
    course: 'VLSI Design (EC801)',
    date: '2026-08-18',
    ratings: {
      clarity: 5,
      communication: 5,
      availability: 4,
      support: 5,
      overall: 4.8
    },
    feedback: 'Dr. Mehta explains complex CMOS layouts with remarkable clarity and step-by-step simulations.'
  },
  {
    id: 'STR-002',
    teacherId: 'T002',
    teacherName: 'Dr. Karthik Rao',
    studentId: 'STU-001',
    studentName: 'Rahul Sharma',
    isAnonymous: false,
    course: 'Machine Learning (CS601)',
    date: '2026-08-19',
    ratings: {
      clarity: 5,
      communication: 5,
      availability: 5,
      support: 5,
      overall: 5.0
    },
    feedback: 'One of the best professors at Nexus. Hands-on coding assignments helped me crack my internship interview.'
  },
  {
    id: 'STR-003',
    teacherId: 'T004',
    teacherName: 'Prof. Rajesh Sharma',
    studentId: 'STU-007',
    studentName: 'Anonymous Student',
    isAnonymous: true,
    course: 'Distributed Systems (CS602)',
    date: '2026-08-24',
    ratings: {
      clarity: 4,
      communication: 3,
      availability: 3,
      support: 4,
      overall: 3.5
    },
    feedback: 'Great subject depth, but office hours are very crowded due to high student caseload. Faster email replies would be helpful.'
  }
];
