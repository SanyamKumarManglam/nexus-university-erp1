import { mockUsers } from '../data/mockUsers';
import { mockFaculty } from '../data/mockFaculty';
import { mockStudents } from '../data/mockStudents';
import { mockCandidates } from '../data/mockCandidates';
import { mockOnboarding } from '../data/mockOnboarding';
import { mockAttendanceRecords, departmentAttendanceStats } from '../data/mockAttendance';
import { mockTeacherStudentReviews, mockStudentTeacherReviews } from '../data/mockReviews';
import { mockAnnouncements } from '../data/mockAnnouncements';
import { mockLeaveRequests } from '../data/mockLeaveRequests';
import { mockCalendarEvents } from '../data/mockCalendar';

const STORAGE_KEYS = {
  USERS: 'nexus_db_users_v2',
  FACULTY: 'nexus_db_faculty_v2',
  STUDENTS: 'nexus_db_students_v2',
  CANDIDATES: 'nexus_db_candidates_v2',
  ONBOARDING: 'nexus_db_onboarding_v2',
  ATTENDANCE: 'nexus_db_attendance_v2',
  TEACHER_REVIEWS: 'nexus_db_teacher_reviews_v2',
  STUDENT_REVIEWS: 'nexus_db_student_reviews_v2',
  ANNOUNCEMENTS: 'nexus_db_announcements_v2',
  LEAVE: 'nexus_db_leave_v2',
  CALENDAR: 'nexus_db_calendar_v2',
  SESSION: 'nexus_session_user_v2',
  LANGUAGE: 'nexus_lang_pref',
  THEME: 'nexus_theme_pref',
  CAPACITY_CAP: 'nexus_capacity_cap_v2'
};

function getOrInit(key, defaultData) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(defaultData));
      return defaultData;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error(`Failed to load ${key} from localStorage:`, e);
    return defaultData;
  }
}

function save(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Failed to save ${key} to localStorage:`, e);
  }
}

export const storageService = {
  KEYS: STORAGE_KEYS,

  getUsers: () => getOrInit(STORAGE_KEYS.USERS, mockUsers),
  saveUsers: (data) => save(STORAGE_KEYS.USERS, data),

  getFaculty: () => getOrInit(STORAGE_KEYS.FACULTY, mockFaculty),
  saveFaculty: (data) => save(STORAGE_KEYS.FACULTY, data),

  getStudents: () => getOrInit(STORAGE_KEYS.STUDENTS, mockStudents),
  saveStudents: (data) => save(STORAGE_KEYS.STUDENTS, data),

  getCandidates: () => getOrInit(STORAGE_KEYS.CANDIDATES, mockCandidates),
  saveCandidates: (data) => save(STORAGE_KEYS.CANDIDATES, data),

  getOnboarding: () => getOrInit(STORAGE_KEYS.ONBOARDING, mockOnboarding),
  saveOnboarding: (data) => save(STORAGE_KEYS.ONBOARDING, data),

  getAttendance: () => getOrInit(STORAGE_KEYS.ATTENDANCE, mockAttendanceRecords),
  saveAttendance: (data) => save(STORAGE_KEYS.ATTENDANCE, data),

  getTeacherReviews: () => getOrInit(STORAGE_KEYS.TEACHER_REVIEWS, mockTeacherStudentReviews),
  saveTeacherReviews: (data) => save(STORAGE_KEYS.TEACHER_REVIEWS, data),

  getStudentReviews: () => getOrInit(STORAGE_KEYS.STUDENT_REVIEWS, mockStudentTeacherReviews),
  saveStudentReviews: (data) => save(STORAGE_KEYS.STUDENT_REVIEWS, data),

  getAnnouncements: () => getOrInit(STORAGE_KEYS.ANNOUNCEMENTS, mockAnnouncements),
  saveAnnouncements: (data) => save(STORAGE_KEYS.ANNOUNCEMENTS, data),

  getLeaveRequests: () => getOrInit(STORAGE_KEYS.LEAVE, mockLeaveRequests),
  saveLeaveRequests: (data) => save(STORAGE_KEYS.LEAVE, data),

  getCalendarEvents: () => getOrInit(STORAGE_KEYS.CALENDAR, mockCalendarEvents),
  saveCalendarEvents: (data) => save(STORAGE_KEYS.CALENDAR, data),

  getSessionUser: () => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEYS.SESSION);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
  saveSessionUser: (user) => {
    if (!user) {
      sessionStorage.removeItem(STORAGE_KEYS.SESSION);
    } else {
      sessionStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(user));
    }
  },

  getCapacityCap: () => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEYS.CAPACITY_CAP) || localStorage.getItem(STORAGE_KEYS.CAPACITY_CAP);
      return raw ? parseInt(raw, 10) : null;
    } catch {
      return null;
    }
  },
  saveCapacityCap: (cap) => {
    try {
      if (cap === null || cap === undefined || isNaN(cap)) {
        sessionStorage.removeItem(STORAGE_KEYS.CAPACITY_CAP);
        localStorage.removeItem(STORAGE_KEYS.CAPACITY_CAP);
      } else {
        sessionStorage.setItem(STORAGE_KEYS.CAPACITY_CAP, String(cap));
        localStorage.setItem(STORAGE_KEYS.CAPACITY_CAP, String(cap));
      }
    } catch (e) {
      console.error('Failed to save capacity cap:', e);
    }
  },
  clearCapacityCap: () => {
    try {
      sessionStorage.removeItem(STORAGE_KEYS.CAPACITY_CAP);
      localStorage.removeItem(STORAGE_KEYS.CAPACITY_CAP);
    } catch (e) {
      console.error('Failed to clear capacity cap:', e);
    }
  },

  resetAllData: () => {
    save(STORAGE_KEYS.USERS, mockUsers);
    save(STORAGE_KEYS.FACULTY, mockFaculty);
    save(STORAGE_KEYS.STUDENTS, mockStudents);
    save(STORAGE_KEYS.CANDIDATES, mockCandidates);
    save(STORAGE_KEYS.ONBOARDING, mockOnboarding);
    save(STORAGE_KEYS.ATTENDANCE, mockAttendanceRecords);
    save(STORAGE_KEYS.TEACHER_REVIEWS, mockTeacherStudentReviews);
    save(STORAGE_KEYS.STUDENT_REVIEWS, mockStudentTeacherReviews);
    save(STORAGE_KEYS.ANNOUNCEMENTS, mockAnnouncements);
    save(STORAGE_KEYS.LEAVE, mockLeaveRequests);
    save(STORAGE_KEYS.CALENDAR, mockCalendarEvents);
    sessionStorage.removeItem(STORAGE_KEYS.CAPACITY_CAP);
    localStorage.removeItem(STORAGE_KEYS.CAPACITY_CAP);
  }
};
