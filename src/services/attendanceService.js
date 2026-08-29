import { storageService } from './storageService';
import { mockClasses, departmentAttendanceStats } from '../data/mockAttendance';

export const attendanceService = {
  getClasses: () => {
    return mockClasses;
  },

  getAttendanceRecord: (classId, date) => {
    const records = storageService.getAttendance();
    return records.find((r) => r.classId === classId && r.date === date) || null;
  },

  saveAttendance: (classId, date, teacherId, studentStatuses) => {
    const records = storageService.getAttendance();
    const existingIdx = records.findIndex((r) => r.classId === classId && r.date === date);

    const studentIds = Object.keys(studentStatuses);
    const total = studentIds.length;
    const present = studentIds.filter((id) => studentStatuses[id] === 'Present').length;
    const absent = studentIds.filter((id) => studentStatuses[id] === 'Absent').length;
    const late = studentIds.filter((id) => studentStatuses[id] === 'Late').length;
    const excused = studentIds.filter((id) => studentStatuses[id] === 'Excused').length;
    const percentage = total > 0 ? Number(((present + late * 0.8) / total * 100).toFixed(1)) : 100;

    const recordPayload = {
      id: `ATT-${date.replace(/-/g, '')}-${classId}`,
      classId,
      date,
      teacherId,
      records: studentStatuses,
      summary: { present, absent, late, excused, total, percentage }
    };

    if (existingIdx !== -1) {
      records[existingIdx] = recordPayload;
    } else {
      records.unshift(recordPayload);
    }

    storageService.saveAttendance(records);
    return recordPayload;
  },

  getDepartmentStats: () => {
    return departmentAttendanceStats;
  },

  getStudentAttendanceHistory: (studentId) => {
    const records = storageService.getAttendance();
    const history = [];

    records.forEach((rec) => {
      if (rec.records && rec.records[studentId]) {
        history.push({
          date: rec.date,
          classId: rec.classId,
          status: rec.records[studentId]
        });
      }
    });

    return history;
  }
};
