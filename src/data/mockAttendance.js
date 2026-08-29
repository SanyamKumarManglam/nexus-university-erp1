export const mockClasses = [
  { id: 'CSE-3A', name: 'B.Tech CSE - Section 3A', department: 'CSE', subject: 'Machine Learning (CS601)', teacherId: 'T002', teacherName: 'Dr. Karthik Rao' },
  { id: 'CSE-3B', name: 'B.Tech CSE - Section 3B', department: 'CSE', subject: 'Distributed Systems (CS602)', teacherId: 'T004', teacherName: 'Prof. Rajesh Sharma' },
  { id: 'ECE-4A', name: 'B.Tech ECE - Section 4A', department: 'ECE', subject: 'VLSI Design (EC801)', teacherId: 'T001', teacherName: 'Dr. Ananya Mehta' },
  { id: 'ECE-3A', name: 'B.Tech ECE - Section 3A', department: 'ECE', subject: 'Wireless Communications (EC601)', teacherId: 'T003', teacherName: 'Dr. Shahid Khan' },
  { id: 'ME-4A', name: 'B.Tech ME - Section 4A', department: 'Mechanical', subject: 'Robotics & Automation (ME801)', teacherId: 'T006', teacherName: 'Prof. Arvind Swaminathan' },
  { id: 'BT-3A', name: 'B.Tech BT - Section 3A', department: 'Biotechnology', subject: 'Computational Genomics (BT601)', teacherId: 'T005', teacherName: 'Dr. Pooja Das' }
];

export const mockAttendanceRecords = [
  {
    id: 'ATT-20260828-CSE3A',
    classId: 'CSE-3A',
    date: '2026-08-28',
    teacherId: 'T002',
    records: {
      'STU-001': 'Present',
      'STU-002': 'Present',
      'STU-007': 'Absent',
      'STU-011': 'Present',
      'STU-012': 'Late',
      'STU-013': 'Present',
      'STU-014': 'Excused'
    },
    summary: { present: 5, absent: 1, late: 1, excused: 1, total: 8, percentage: 87.5 }
  },
  {
    id: 'ATT-20260829-CSE3A',
    classId: 'CSE-3A',
    date: '2026-08-29',
    teacherId: 'T002',
    records: {
      'STU-001': 'Present',
      'STU-002': 'Present',
      'STU-007': 'Present',
      'STU-011': 'Present',
      'STU-012': 'Present',
      'STU-013': 'Absent',
      'STU-014': 'Present'
    },
    summary: { present: 6, absent: 1, late: 0, excused: 0, total: 7, percentage: 85.7 }
  },
  {
    id: 'ATT-20260829-ECE4A',
    classId: 'ECE-4A',
    date: '2026-08-29',
    teacherId: 'T001',
    records: {
      'STU-003': 'Present',
      'STU-004': 'Present',
      'STU-008': 'Present',
      'STU-015': 'Present',
      'STU-016': 'Late'
    },
    summary: { present: 4, absent: 0, late: 1, excused: 0, total: 5, percentage: 100 }
  }
];

export const departmentAttendanceStats = [
  { department: 'CSE', today: 92, weekly: 90, monthly: 89, totalStudents: 620 },
  { department: 'ECE', today: 94, weekly: 93, monthly: 91, totalStudents: 480 },
  { department: 'Mechanical', today: 88, weekly: 87, monthly: 86, totalStudents: 410 },
  { department: 'Biotechnology', today: 95, weekly: 94, monthly: 93, totalStudents: 290 }
];
