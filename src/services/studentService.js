import { storageService } from './storageService';

export const studentService = {
  getAllStudents: () => {
    return storageService.getStudents();
  },

  getStudentById: (id) => {
    const students = storageService.getStudents();
    return students.find((s) => s.id === id) || null;
  },

  addStudent: (studentData) => {
    const list = storageService.getStudents();
    const newStudent = {
      id: `STU-${String(list.length + 1).padStart(3, '0')}`,
      name: studentData.name,
      age: Number(studentData.age) || 20,
      email: studentData.email,
      phone: studentData.phone || '+91 91234 00000',
      department: studentData.department,
      program: studentData.program || `B.Tech ${studentData.department}`,
      semester: Number(studentData.semester) || 1,
      rollNumber: studentData.rollNumber || `2026${studentData.department.slice(0, 3).toUpperCase()}${String(list.length + 1).padStart(4, '0')}`,
      section: studentData.section || `${studentData.department.slice(0, 2).toUpperCase()}-1A`,
      advisorId: studentData.advisorId || 'T001',
      advisorName: studentData.advisorName || 'Dr. Ananya Mehta',
      assignedTeacherId: studentData.assignedTeacherId || 'T001',
      assignedTeacherName: studentData.assignedTeacherName || 'Dr. Ananya Mehta',
      attendance: Number(studentData.attendance) || 85,
      studentIndex: 82,
      indexBreakdown: {
        attendance: 85,
        performance: 80,
        engagement: 82,
        assignments: 80,
        reviews: 83
      },
      riskLevel: 'Healthy',
      cgpa: 8.0,
      completedCredits: 20,
      pendingLeaves: 0,
      academicWarning: false
    };

    list.unshift(newStudent);
    storageService.saveStudents(list);
    return newStudent;
  },

  updateStudent: (id, updatedFields) => {
    const list = storageService.getStudents();
    const idx = list.findIndex((s) => s.id === id);
    if (idx === -1) throw new Error('Student not found.');

    list[idx] = { ...list[idx], ...updatedFields };
    storageService.saveStudents(list);
    return list[idx];
  },

  assignAdvisor: (studentId, advisorId, advisorName) => {
    return studentService.updateStudent(studentId, {
      advisorId,
      advisorName
    });
  },

  assignTeacher: (studentId, assignedTeacherId, assignedTeacherName) => {
    return studentService.updateStudent(studentId, {
      assignedTeacherId,
      assignedTeacherName
    });
  }
};
