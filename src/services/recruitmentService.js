import { storageService } from './storageService';

export const recruitmentService = {
  getAllCandidates: () => {
    return storageService.getCandidates();
  },

  getCandidateById: (id) => {
    const list = storageService.getCandidates();
    return list.find((c) => c.id === id) || null;
  },

  calculateAIMatch: ({ experience, qualification, skills, department }) => {
    const expYears = Number(experience) || 0;
    const isPhD = qualification && qualification.toLowerCase().includes('ph');
    const isMTech = qualification && qualification.toLowerCase().includes('m');
    const hasSkills = skills && skills.length > 0;

    let score = 55 + Math.min(expYears * 4, 20);
    if (isPhD) score += 15;
    else if (isMTech) score += 8;

    if (hasSkills) score += 8;

    score = Math.min(98, Math.max(50, score));

    const strengths = [];
    const concerns = [];

    if (expYears >= 5) {
      strengths.push(`${expYears} years of teaching and research background`);
    } else {
      concerns.push('Entry-level teaching tenure; mentor pairing advised');
    }

    if (isPhD) {
      strengths.push('Doctoral credential aligns with UGC/AICTE professorial norms');
    } else {
      concerns.push('Ph.D. enrollment or completion will be required for full tenure');
    }

    if (hasSkills) {
      strengths.push('Strong domain specialization matching active syllabus requirements');
    }

    return {
      matchPercent: score,
      strengths,
      concerns,
      recommendation: score >= 85
        ? 'High suitability match. Recommended for Interview stage by NEXUS Intelligence.'
        : 'Moderate suitability match. Review technical portfolio and publications.'
    };
  },

  addCandidate: (data) => {
    const list = storageService.getCandidates();
    const aiAssessment = recruitmentService.calculateAIMatch({
      experience: data.experience,
      qualification: data.qualification,
      skills: data.skills,
      department: data.department
    });

    const newCandidate = {
      id: `CAN-${String(list.length + 1).padStart(3, '0')}`,
      name: data.name,
      email: data.email,
      phone: data.phone || '+91 98112 00000',
      age: Number(data.age) || 32,
      department: data.department,
      position: data.position || `Assistant Professor - ${data.department}`,
      qualification: data.qualification || 'Ph.D.',
      experience: Number(data.experience) || 3,
      skills: Array.isArray(data.skills) ? data.skills : (data.skills || '').split(',').map(s => s.trim()).filter(Boolean),
      applicationDate: new Date().toISOString().slice(0, 10),
      resumeUrl: 'candidate_resume.pdf',
      resumeStatus: 'Verified',
      status: 'Applied',
      interviewScore: null,
      matchScore: aiAssessment.matchPercent,
      aiAssessment
    };

    list.unshift(newCandidate);
    storageService.saveCandidates(list);
    return newCandidate;
  },

  updateCandidateStatus: (id, newStatus) => {
    const list = storageService.getCandidates();
    const candidate = list.find((c) => c.id === id);
    if (!candidate) throw new Error('Candidate not found.');

    candidate.status = newStatus;
    storageService.saveCandidates(list);

    // If candidate status is moved to 'Hired', automatically spawn onboarding record!
    if (newStatus === 'Hired') {
      recruitmentService.hireCandidate(id);
    }

    return candidate;
  },

  hireCandidate: (id) => {
    const candidates = storageService.getCandidates();
    const candidate = candidates.find((c) => c.id === id);
    if (!candidate) throw new Error('Candidate not found.');

    candidate.status = 'Hired';
    storageService.saveCandidates(candidates);

    // Create onboarding entry if not already present
    const onboardingList = storageService.getOnboarding();
    const existing = onboardingList.find((o) => o.candidateId === id);

    if (!existing) {
      const newOnboarding = {
        id: `ONB-${String(onboardingList.length + 1).padStart(3, '0')}`,
        candidateId: candidate.id,
        candidateName: candidate.name,
        department: candidate.department,
        role: candidate.position.includes('Associate') ? 'Associate Professor' : candidate.position.includes('Professor') ? 'Professor' : 'Assistant Professor',
        email: candidate.email,
        phone: candidate.phone,
        assignedHR: 'Dr. Kavita Nambiar',
        assignedMentor: 'Dr. Ananya Mehta',
        startDate: new Date().toISOString().slice(0, 10),
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
        completedSteps: [1, 2],
        currentStepIndex: 3,
        progressPercent: 20,
        missingDocuments: [],
        status: 'In Progress',
        preferredLanguage: 'English'
      };

      onboardingList.unshift(newOnboarding);
      storageService.saveOnboarding(onboardingList);
    }

    return candidate;
  },

  deleteCandidate: (id) => {
    const list = storageService.getCandidates();
    const filtered = list.filter((c) => c.id !== id);
    storageService.saveCandidates(filtered);
    return true;
  }
};
