import { storageService } from './storageService.js';

export const allocationService = {
  getAdvisors: (facultyCapsMap = null, globalCap = null) => {
    const faculty = storageService.getFaculty();
    const storedFacultyCaps = storageService.getFacultyCaps();
    const storedGlobalCap = storageService.getCapacityCap();

    return faculty.map((f) => {
      let activeCap = null;
      let isIndividualCustom = false;

      // 1. Check passed-in or stored per-faculty cap
      if (facultyCapsMap && facultyCapsMap[f.id] !== undefined && facultyCapsMap[f.id] !== null) {
        activeCap = facultyCapsMap[f.id];
        isIndividualCustom = true;
      } else if (storedFacultyCaps && storedFacultyCaps[f.id] !== undefined && storedFacultyCaps[f.id] !== null) {
        activeCap = storedFacultyCaps[f.id];
        isIndividualCustom = true;
      } else if (globalCap !== null && globalCap !== undefined) {
        activeCap = globalCap;
      } else if (storedGlobalCap !== null && storedGlobalCap !== undefined) {
        activeCap = storedGlobalCap;
      }

      const defaultBenchmark = f.maxCapacity || 120;
      const effectiveCap = activeCap || defaultBenchmark;
      const students = f.studentsAssigned || 0;
      const remainingCapacity = effectiveCap - students;
      const workload = Math.round((students / effectiveCap) * 100);
      const ratio = students / effectiveCap;

      let status = 'Available';
      if (students > effectiveCap) {
        status = 'Overloaded';
      } else if (ratio > 0.85) {
        status = 'Overloaded';
      } else if (ratio >= 0.7) {
        status = 'Balanced';
      } else {
        status = 'Available';
      }

      return {
        id: f.id,
        name: f.name,
        department: f.department,
        students,
        capacity: effectiveCap,
        defaultCapacity: defaultBenchmark,
        isCustomCap: Boolean(isIndividualCustom || (globalCap ?? storedGlobalCap)),
        isIndividualCustom,
        remainingCapacity,
        isOverCapacity: students > effectiveCap,
        workload,
        status,
        retentionRisk: f.retentionRisk || 'Low'
      };
    });
  },

  calculateOptimization: (facultyCapsMap = null, globalCap = null) => {
    const faculty = storageService.getFaculty();
    const storedFacultyCaps = storageService.getFacultyCaps();
    const storedGlobalCap = storageService.getCapacityCap();

    const advisors = faculty.map((f) => {
      let activeCap = null;
      let isIndividualCustom = false;

      if (facultyCapsMap && facultyCapsMap[f.id] !== undefined && facultyCapsMap[f.id] !== null) {
        activeCap = facultyCapsMap[f.id];
        isIndividualCustom = true;
      } else if (storedFacultyCaps && storedFacultyCaps[f.id] !== undefined && storedFacultyCaps[f.id] !== null) {
        activeCap = storedFacultyCaps[f.id];
        isIndividualCustom = true;
      } else if (globalCap !== null && globalCap !== undefined) {
        activeCap = globalCap;
      } else if (storedGlobalCap !== null && storedGlobalCap !== undefined) {
        activeCap = storedGlobalCap;
      }

      const defaultBenchmark = f.maxCapacity || 120;
      const effectiveCap = activeCap || defaultBenchmark;
      const students = f.studentsAssigned || 0;
      const load = Math.round((students / effectiveCap) * 100);

      return {
        id: f.id,
        name: f.name,
        department: f.department,
        beforeStudents: students,
        afterStudents: students,
        capacity: effectiveCap,
        defaultCapacity: defaultBenchmark,
        isCustomCap: Boolean(isIndividualCustom || (globalCap ?? storedGlobalCap)),
        isIndividualCustom,
        beforeRemaining: effectiveCap - students,
        afterRemaining: effectiveCap - students,
        beforeLoad: load,
        afterLoad: load
      };
    });

    let totalMoved = 0;
    const reassignments = [];

    // Identify overloaded faculty (> 85% capacity or exceeding individual capacity cap)
    for (let i = 0; i < advisors.length; i++) {
      if (advisors[i].afterStudents / advisors[i].capacity > 0.85) {
        // Look for available advisors in same department or cross-department with available headroom
        for (let j = 0; j < advisors.length; j++) {
          if (i === j) continue;
          if (advisors[i].afterStudents / advisors[i].capacity <= 0.85) break;

          const availableCap = advisors[j].capacity - advisors[j].afterStudents;
          const targetLoadCap = Math.floor(advisors[j].capacity * 0.82) - advisors[j].afterStudents;

          if (targetLoadCap > 0 && availableCap > 0) {
            const excess = advisors[i].afterStudents - Math.floor(advisors[i].capacity * 0.85);
            const moveCount = Math.min(excess, targetLoadCap, availableCap);

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

    // Update afterLoad and afterRemaining
    advisors.forEach((a) => {
      a.afterLoad = Math.round((a.afterStudents / a.capacity) * 100);
      a.afterRemaining = a.capacity - a.afterStudents;
    });

    return {
      advisors,
      totalMoved,
      reassignments,
      capacityCapUsed: globalCap || storedGlobalCap,
      capacityImprovement: totalMoved > 0 ? `${Math.min(35, 14 + totalMoved * 2)}% variance reduction` : 'Currently balanced',
      estimatedResponseTimeImprovement: totalMoved > 0 ? `+${Math.min(48, 20 + totalMoved * 3)}% faster student SLA resolution` : 'Optimal'
    };
  },

  applyOptimization: (optimizedAdvisors, facultyCapsMap = null, globalCap = null) => {
    const faculty = storageService.getFaculty();
    const storedFacultyCaps = storageService.getFacultyCaps();
    const storedGlobalCap = storageService.getCapacityCap();

    optimizedAdvisors.forEach((opt) => {
      const f = faculty.find((item) => item.id === opt.id);
      if (f) {
        let activeCap = null;
        if (facultyCapsMap && facultyCapsMap[f.id] !== undefined) activeCap = facultyCapsMap[f.id];
        else if (storedFacultyCaps && storedFacultyCaps[f.id] !== undefined) activeCap = storedFacultyCaps[f.id];
        else if (globalCap) activeCap = globalCap;
        else if (storedGlobalCap) activeCap = storedGlobalCap;

        const effectiveCap = activeCap || f.maxCapacity || 120;
        f.studentsAssigned = opt.afterStudents;
        f.workloadPercent = Math.round((f.studentsAssigned / effectiveCap) * 100);
        if (f.workloadPercent <= 85 && f.retentionRisk === 'High') {
          f.retentionRisk = 'Medium';
        }
      }
    });

    storageService.saveFaculty(faculty);
    return true;
  },

  allocateWorkload: (facultyId, studentCount, allowOverride = false) => {
    const faculty = storageService.getFaculty();
    const f = faculty.find((item) => item.id === facultyId);
    if (!f) return { success: false, error: 'Faculty member not found.' };

    const storedFacultyCaps = storageService.getFacultyCaps();
    const storedGlobalCap = storageService.getCapacityCap();
    const effectiveCap = storedFacultyCaps[f.id] || storedGlobalCap || f.maxCapacity || 120;

    const count = parseInt(studentCount, 10);
    if (isNaN(count) || count <= 0) {
      return { success: false, error: 'Please enter a valid positive number of students to allocate.' };
    }

    const currentStudents = f.studentsAssigned || 0;
    const newStudents = currentStudents + count;
    const remainingBefore = effectiveCap - currentStudents;

    if (newStudents > effectiveCap && !allowOverride) {
      return {
        success: false,
        requiresOverride: true,
        isBreach: true,
        error: `Allocation of +${count} students exceeds capacity cap of ${effectiveCap} (Current: ${currentStudents}, Remaining: ${remainingBefore}).`,
        currentStudents,
        effectiveCap,
        remainingBefore,
        overage: newStudents - effectiveCap
      };
    }

    f.studentsAssigned = newStudents;
    f.workloadPercent = Math.round((newStudents / effectiveCap) * 100);
    storageService.saveFaculty(faculty);

    return {
      success: true,
      facultyName: f.name,
      newStudents,
      effectiveCap,
      remainingCapacity: effectiveCap - newStudents
    };
  }
};

