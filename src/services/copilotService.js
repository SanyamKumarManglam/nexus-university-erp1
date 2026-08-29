import { storageService } from './storageService';

export const copilotService = {
  getSuggestedQueries: () => {
    return [
      'Which advisors are overloaded?',
      'Which students are at risk?',
      'Who is likely to need academic intervention?',
      'Which faculty should receive workload support?',
      'Which recruitment candidates are strongest?',
      'What are today\'s critical operational priorities?'
    ];
  },

  askCopilot: async (queryText) => {
    await new Promise((resolve) => setTimeout(resolve, 450));

    const query = queryText.toLowerCase().trim();
    const faculty = storageService.getFaculty();
    const students = storageService.getStudents();
    const candidates = storageService.getCandidates();
    const leaveRequests = storageService.getLeaveRequests();
    const onboarding = storageService.getOnboarding();

    if (query.includes('overload') || query.includes('workload')) {
      const overloaded = faculty.filter((f) => (f.studentsAssigned / f.maxCapacity) > 0.88);
      if (overloaded.length === 0) {
        return {
          title: 'Advisor Workload Analysis',
          summary: 'All faculty advisors are currently operating within safe capacity thresholds (< 88%).',
          details: 'No immediate rebalancing is required.',
          action: 'View Smart Allocation'
        };
      }
      return {
        title: 'Advisor Overload Detected',
        summary: `Found ${overloaded.length} advisors operating above 88% capacity:`,
        bullets: overloaded.map((f) => `• ${f.name} (${f.department}): ${f.studentsAssigned}/${f.maxCapacity} students (${Math.round((f.studentsAssigned / f.maxCapacity) * 100)}% load)`),
        recommendation: 'Run Smart Allocation to reassign advisees to underutilized faculty such as Dr. Sunita Rao (50%) or Prof. Nitin Patel (49%).',
        action: 'Run Smart Allocation'
      };
    }

    if (query.includes('student') || query.includes('risk') || query.includes('intervention')) {
      const atRiskStudents = students.filter((s) => s.studentIndex < 65 || s.attendance < 70);
      return {
        title: 'Student Risk & Mentorship Intelligence',
        summary: `Identified ${atRiskStudents.length} students requiring proactive intervention:`,
        bullets: atRiskStudents.slice(0, 5).map((s) => `• ${s.name} (${s.rollNumber}, ${s.department}): Index ${s.studentIndex}/100, Attendance ${s.attendance}%, Risk: ${s.riskLevel}`),
        recommendation: 'Schedule proactive 1-on-1 advisor sessions. 3 students have pending leave deficits impacting coursework.',
        action: 'View Student Directory'
      };
    }

    if (query.includes('candidate') || query.includes('recruit') || query.includes('hire') || query.includes('strongest')) {
      const topCandidates = candidates.filter((c) => c.matchScore >= 90).sort((a, b) => b.matchScore - a.matchScore);
      return {
        title: 'Recruitment AI Suitability Assessment',
        summary: `Top candidates with highest suitability scores:`,
        bullets: topCandidates.map((c) => `• ${c.name} (${c.department} - ${c.position}): ${c.matchScore}% Match (${c.qualification}, ${c.experience} yrs exp)`),
        recommendation: 'Dr. Tarun Saxena and Prof. Manish Goswami have completed interviews with unanimous panel recommendations.',
        action: 'Open Recruitment Hub'
      };
    }

    if (query.includes('priority') || query.includes('today')) {
      const pendingLeave = leaveRequests.filter((l) => l.status === 'Pending').length;
      const activeOnboarding = onboarding.filter((o) => o.status === 'In Progress').length;
      const overloadedCount = faculty.filter((f) => (f.studentsAssigned / f.maxCapacity) > 0.9).length;

      return {
        title: 'Today\'s Executive Priorities',
        summary: 'Key operational tasks requiring administrator attention:',
        bullets: [
          `• ${overloadedCount} advisors operating at > 90% capacity`,
          `• ${activeOnboarding} faculty onboarding workflows in progress`,
          `• ${pendingLeave} leave requests awaiting approval`
        ],
        recommendation: 'Review the Priority Hub on your Command Center.',
        action: 'View Command Center'
      };
    }

    // Default intelligent overview
    return {
      title: 'NEXUS University Intelligence Summary',
      summary: `Analyzed ${faculty.length} faculty, ${students.length} students, and active operational pipelines.`,
      bullets: [
        `• Average Faculty Retention Index: 92% (Healthy)`,
        `• University Attendance Rate: 91.4%`,
        `• Average Student Composite Index: 84 / 100`,
        `• Recruitment Pipeline: ${candidates.length} active candidates`
      ],
      recommendation: 'Ask specific questions about advisors, student risks, candidate matches, or leave approvals for targeted insights.',
      action: 'Explore System'
    };
  }
};
