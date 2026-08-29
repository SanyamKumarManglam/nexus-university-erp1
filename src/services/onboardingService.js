import { storageService } from './storageService';
import { facultyService } from './facultyService';

export const onboardingService = {
  getAllOnboarding: () => {
    return storageService.getOnboarding();
  },

  getOnboardingById: (id) => {
    const list = storageService.getOnboarding();
    return list.find((o) => o.id === id) || null;
  },

  toggleStep: (onboardingId, stepNumber) => {
    const list = storageService.getOnboarding();
    const item = list.find((o) => o.id === onboardingId);
    if (!item) throw new Error('Onboarding record not found.');

    const stepNum = Number(stepNumber);
    const hasStep = item.completedSteps.includes(stepNum);

    if (hasStep) {
      item.completedSteps = item.completedSteps.filter((s) => s !== stepNum);
    } else {
      item.completedSteps.push(stepNum);
      item.completedSteps.sort((a, b) => a - b);
    }

    item.progressPercent = Math.round((item.completedSteps.length / 10) * 100);
    item.currentStepIndex = Math.min(10, Math.max(1, item.completedSteps.length + 1));

    if (item.completedSteps.length === 10) {
      item.status = 'Completed';
    } else {
      item.status = 'In Progress';
    }

    storageService.saveOnboarding(list);
    return item;
  },

  completeOnboarding: (onboardingId) => {
    const list = storageService.getOnboarding();
    const item = list.find((o) => o.id === onboardingId);
    if (!item) throw new Error('Onboarding record not found.');

    item.completedSteps = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    item.currentStepIndex = 10;
    item.progressPercent = 100;
    item.status = 'Completed';

    storageService.saveOnboarding(list);

    // Promote candidate to Active Faculty Directory if not already in Faculty
    const facultyList = facultyService.getAllFaculty();
    const exists = facultyList.some((f) => f.email.toLowerCase() === item.email.toLowerCase());

    if (!exists) {
      facultyService.addFaculty({
        name: item.candidateName,
        department: item.department,
        role: item.role,
        email: item.email,
        phone: item.phone,
        studentsAssigned: 35,
        maxCapacity: 120
      });
    }

    return item;
  },

  updateLanguage: (onboardingId, language) => {
    const list = storageService.getOnboarding();
    const item = list.find((o) => o.id === onboardingId);
    if (!item) throw new Error('Onboarding record not found.');

    item.preferredLanguage = language;
    storageService.saveOnboarding(list);
    return item;
  }
};
