import { storageService } from './storageService';

export const reviewService = {
  // Teacher Reviews of Students
  getTeacherReviewsForStudent: (studentId, isStudentViewer = false) => {
    const reviews = storageService.getTeacherReviews();
    const studentReviews = reviews.filter((r) => r.studentId === studentId);

    if (isStudentViewer) {
      // Strip private teacher notes when viewed by students!
      return studentReviews.map(({ privateNotes, ...safeReview }) => safeReview);
    }
    return studentReviews;
  },

  getAllTeacherStudentReviews: () => {
    return storageService.getTeacherReviews();
  },

  addTeacherStudentReview: (reviewData) => {
    const reviews = storageService.getTeacherReviews();
    const newReview = {
      id: `TSR-${Date.now()}`,
      teacherId: reviewData.teacherId,
      teacherName: reviewData.teacherName,
      studentId: reviewData.studentId,
      studentName: reviewData.studentName,
      course: reviewData.course,
      date: new Date().toISOString().slice(0, 10),
      ratings: {
        academic: Number(reviewData.ratings.academic) || 4,
        participation: Number(reviewData.ratings.participation) || 4,
        attendance: Number(reviewData.ratings.attendance) || 4,
        assignments: Number(reviewData.ratings.assignments) || 4,
        overall: Number(reviewData.ratings.overall) || 4.0
      },
      strengths: reviewData.strengths || '',
      improvements: reviewData.improvements || '',
      privateNotes: reviewData.privateNotes || ''
    };

    reviews.unshift(newReview);
    storageService.saveTeacherReviews(reviews);
    return newReview;
  },

  // Student Reviews of Teachers
  getReviewsForTeacher: (teacherId) => {
    const reviews = storageService.getStudentReviews();
    return reviews.filter((r) => r.teacherId === teacherId);
  },

  getAllStudentTeacherReviews: () => {
    return storageService.getStudentReviews();
  },

  addStudentTeacherReview: (reviewData) => {
    const reviews = storageService.getStudentReviews();
    const newReview = {
      id: `STR-${Date.now()}`,
      teacherId: reviewData.teacherId,
      teacherName: reviewData.teacherName,
      studentId: reviewData.isAnonymous ? 'ANON' : reviewData.studentId,
      studentName: reviewData.isAnonymous ? 'Anonymous Student' : reviewData.studentName,
      isAnonymous: Boolean(reviewData.isAnonymous),
      course: reviewData.course || 'Course Instruction',
      date: new Date().toISOString().slice(0, 10),
      ratings: {
        clarity: Number(reviewData.ratings.clarity) || 4,
        communication: Number(reviewData.ratings.communication) || 4,
        availability: Number(reviewData.ratings.availability) || 4,
        support: Number(reviewData.ratings.support) || 4,
        overall: Number(reviewData.ratings.overall) || 4.0
      },
      feedback: reviewData.feedback || ''
    };

    reviews.unshift(newReview);
    storageService.saveStudentReviews(reviews);
    return newReview;
  }
};
