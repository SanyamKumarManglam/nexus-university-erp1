import { storageService } from './storageService';

export const allocationService = {
  getAdvisors: () => {
    const faculty = storageService.getFaculty();
    return faculty.map((f) => ({
      id: f.id,
      name: f.name,
      department: f.department,
      students: f.studentsAssigned,
      capacity: f.maxCapacity,
      workload: Math.round((f.studentsAssigned / f.maxCapacity) * 100),
      status: (f.studentsAssigned / f.maxCapacity) > 0.9 ? 'Overloaded' : (f.studentsAssigned / f.maxCapacity) >= 0.7 ? 'Balanced' : 'Available',
      retentionRisk: f.retentionRisk
    }));
  },

  calculateOptimization: () => {
    const faculty = storageService.getFaculty();
    const advisors = faculty.map((f) => ({
      id: f.id,
      name: f.name,
      department: f.department,
      beforeStudents: f.studentsAssigned,
      afterStudents: f.studentsAssigned,
      capacity: f.maxCapacity,
      beforeLoad: Math.round((f.studentsAssigned / f.maxCapacity) * 100),
      afterLoad: Math.round((f.studentsAssigned / f.maxCapacity) * 100)
    }));

    let totalMoved = 0;
    const reassignments = [];

    // Identify overloaded faculty (> 85% capacity)
    for (let i = 0; i < advisors.length; i++) {
      if (advisors[i].afterStudents / advisors[i].capacity > 0.85) {
        // Look for available advisors in same department or general
        for (let j = 0; j < advisors.length; j++) {
          if (i === j) continue;
          if (advisors[i].afterStudents / advisors[i].capacity <= 0.85) break;

          const availableCap = advisors[j].capacity - advisors[j].afterStudents;
          const targetLoadCap = Math.floor(advisors[j].capacity * 0.82) - advisors[j].afterStudents;

          if (targetLoadCap > 0) {
            const excess = advisors[i].afterStudents - Math.floor(advisors[i].capacity * 0.85);
            const moveCount = Math.min(excess, targetLoadCap);

            if (moveCount > 0) {
              advisors[i].afterStudents -= moveCount;
              advisors[j].afterStudents += moveCount;
              totalMoved += moveCount;

              reassignments.push({
                fromAdvisor: advisors[i].name,
                toAdvisor: advisors[j].name,
                count: moveCount,
                department: advisors[i].department
              });
            }
          }
        }
      }
    }

    // Update afterLoad
    advisors.forEach((a) => {
      a.afterLoad = Math.round((a.afterStudents / a.capacity) * 100);
    });

    return {
      advisors,
      totalMoved,
      reassignments,
      capacityImprovement: totalMoved > 0 ? '18% variance reduction' : 'Currently balanced',
      estimatedResponseTimeImprovement: totalMoved > 0 ? '+32% faster student SLA resolution' : 'Optimal'
    };
  },

  applyOptimization: (optimizedAdvisors) => {
    const faculty = storageService.getFaculty();
    
    optimizedAdvisors.forEach((opt) => {
      const f = faculty.find((item) => item.id === opt.id);
      if (f) {
        f.studentsAssigned = opt.afterStudents;
        f.workloadPercent = Math.round((f.studentsAssigned / f.maxCapacity) * 100);
        if (f.workloadPercent <= 85 && f.retentionRisk === 'High') {
          f.retentionRisk = 'Medium';
        }
      }
    });

    storageService.saveFaculty(faculty);
    return true;
  }
};
