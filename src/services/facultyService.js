import { storageService } from './storageService';

export const facultyService = {
  getAllFaculty: () => {
    return storageService.getFaculty();
  },

  getFacultyById: (id) => {
    const list = storageService.getFaculty();
    return list.find((f) => f.id === id) || null;
  },

  addFaculty: (facultyData) => {
    const list = storageService.getFaculty();
    const newFaculty = {
      id: facultyData.id || `T${String(list.length + 1).padStart(3, '0')}`,
      name: facultyData.name,
      department: facultyData.department,
      role: facultyData.role || 'Assistant Professor',
      email: facultyData.email,
      phone: facultyData.phone || '+91 98765 00000',
      joinedDate: new Date().toISOString().slice(0, 10),
      studentsAssigned: facultyData.studentsAssigned || 45,
      maxCapacity: facultyData.maxCapacity || 120,
      workloadPercent: Math.round(((facultyData.studentsAssigned || 45) / (facultyData.maxCapacity || 120)) * 100),
      performanceScore: 88,
      studentSuccessScore: 85,
      attendanceRate: 95,
      retentionRisk: 'Low',
      retentionFactors: {
        workload: 'Normal load',
        slaDecay: 'On track',
        studentEngagement: 'Positive',
        leaveFrequency: 'Low'
      },
      recommendation: 'New faculty onboarded successfully.',
      leaveBalance: { casual: 8, medical: 10, academic: 5 },
      onboardingStatus: 'Completed',
      qualification: facultyData.qualification || 'Ph.D.',
      experience: Number(facultyData.experience) || 3,
      subjects: Array.isArray(facultyData.subjects) ? facultyData.subjects : (facultyData.subjects || '').split(',').map(s => s.trim()).filter(Boolean),
      researchPapers: Number(facultyData.researchPapers) || 2,
      grantsWon: facultyData.grantsWon || '—',
      bio: facultyData.bio || 'Faculty member at Nexus University.'
    };

    list.push(newFaculty);
    storageService.saveFaculty(list);
    return newFaculty;
  },

  updateFaculty: (id, updatedFields) => {
    const list = storageService.getFaculty();
    const idx = list.findIndex((f) => f.id === id);
    if (idx === -1) throw new Error('Faculty not found.');

    const updated = { ...list[idx], ...updatedFields };
    if (updated.studentsAssigned && updated.maxCapacity) {
      updated.workloadPercent = Math.round((updated.studentsAssigned / updated.maxCapacity) * 100);
    }
    list[idx] = updated;
    storageService.saveFaculty(list);
    return updated;
  },

  deleteFaculty: (id) => {
    const list = storageService.getFaculty();
    const filtered = list.filter((f) => f.id !== id);
    storageService.saveFaculty(filtered);
    return true;
  }
};
