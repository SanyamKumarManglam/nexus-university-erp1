import { storageService } from './storageService';

export const leaveService = {
  getAllLeaves: () => {
    return storageService.getLeaveRequests();
  },

  getLeavesByApplicant: (applicantId) => {
    const list = storageService.getLeaveRequests();
    return list.filter((l) => l.applicantId === applicantId);
  },

  getLeavesForReviewer: (reviewerId) => {
    const list = storageService.getLeaveRequests();
    return list.filter((l) => l.reviewerId === reviewerId);
  },

  submitLeaveRequest: (leaveData) => {
    const list = storageService.getLeaveRequests();
    
    // Calculate total days
    const start = new Date(leaveData.startDate);
    const end = new Date(leaveData.endDate);
    const diffTime = Math.abs(end - start);
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    const newLeave = {
      id: `LEV-${leaveData.applicantRole === 'student' ? 'STU' : 'FAC'}-${Date.now()}`,
      type: leaveData.applicantRole === 'student' ? 'student' : 'teacher',
      applicantId: leaveData.applicantId,
      applicantName: leaveData.applicantName,
      applicantDepartment: leaveData.applicantDepartment || 'CSE',
      applicantRole: leaveData.applicantRole,
      leaveCategory: leaveData.leaveCategory || 'Casual Leave',
      startDate: leaveData.startDate,
      endDate: leaveData.endDate,
      totalDays: isNaN(totalDays) ? 1 : totalDays,
      reason: leaveData.reason,
      documentAttachment: leaveData.documentAttachment || null,
      reviewerId: leaveData.reviewerId || (leaveData.applicantRole === 'student' ? 'T004' : 'U-ADM-01'),
      reviewerName: leaveData.reviewerName || (leaveData.applicantRole === 'student' ? 'Prof. Rajesh Sharma' : 'Dr. Rajeshwari Sundaram'),
      status: 'Pending',
      reviewerComment: null,
      appliedDate: new Date().toISOString()
    };

    list.unshift(newLeave);
    storageService.saveLeaveRequests(list);
    return newLeave;
  },

  updateLeaveStatus: (leaveId, status, reviewerComment = null) => {
    const list = storageService.getLeaveRequests();
    const item = list.find((l) => l.id === leaveId);
    if (!item) throw new Error('Leave request not found.');

    item.status = status;
    if (reviewerComment) {
      item.reviewerComment = reviewerComment;
    }

    storageService.saveLeaveRequests(list);
    return item;
  }
};
