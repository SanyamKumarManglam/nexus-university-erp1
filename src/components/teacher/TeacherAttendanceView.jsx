import React, { useState, useEffect } from 'react';
import { attendanceService } from '../../services/attendanceService';
import { studentService } from '../../services/studentService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  Save,
  Users,
  Calendar,
  Sparkles
} from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export function TeacherAttendanceView() {
  const { currentUser, role } = useAuth();
  const toast = useToast();

  const classes = attendanceService.getClasses();
  const [selectedClassId, setSelectedClassId] = useState(classes[0]?.id || 'CSE-3A');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [students, setStudents] = useState([]);
  const [attendanceMap, setAttendanceMap] = useState({});
  const [savedSummary, setSavedSummary] = useState(null);

  const deptStats = attendanceService.getDepartmentStats();

  useEffect(() => {
    // Filter students belonging to this class/department
    const allStudents = studentService.getAllStudents();
    const classInfo = classes.find((c) => c.id === selectedClassId);
    const classStudents = allStudents.filter(
      (s) => s.section === selectedClassId || s.department === classInfo?.department
    ).slice(0, 12);

    setStudents(classStudents);

    // Check if attendance already recorded for this class & date
    const existing = attendanceService.getAttendanceRecord(selectedClassId, selectedDate);
    if (existing && existing.records) {
      setAttendanceMap(existing.records);
      setSavedSummary(existing.summary);
    } else {
      // Default all to Present
      const initialMap = {};
      classStudents.forEach((s) => {
        initialMap[s.id] = 'Present';
      });
      setAttendanceMap(initialMap);
      setSavedSummary(null);
    }
  }, [selectedClassId, selectedDate]);

  const handleStatusChange = (studentId, status) => {
    setAttendanceMap((prev) => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleMarkAllPresent = () => {
    const newMap = {};
    students.forEach((s) => {
      newMap[s.id] = 'Present';
    });
    setAttendanceMap(newMap);
    toast.info('All students marked Present.');
  };

  const handleSaveAttendance = () => {
    try {
      const rec = attendanceService.saveAttendance(
        selectedClassId,
        selectedDate,
        currentUser?.id || 'T001',
        attendanceMap
      );
      setSavedSummary(rec.summary);
      toast.success(`Attendance successfully recorded! Class Attendance: ${rec.summary.percentage}%`);
    } catch (e) {
      toast.error('Failed to save attendance');
    }
  };

  const selectedClass = classes.find((c) => c.id === selectedClassId);

  return (
    <div>
      <div className="hero-banner">
        <div className="hero-content">
          <h2>Lecture Attendance & Classroom Verification</h2>
          <p>
            Record real-time attendance for allocated courses, track class-level absence trends, and trigger automatic early risk warnings.
          </p>
        </div>
      </div>

      {/* Selector Toolbar */}
      <div className="glass-card" style={{ marginBottom: 20, padding: '14px 18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <div>
              <label className="form-label" style={{ marginBottom: 4 }}>Select Course / Section</label>
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="form-select"
                style={{ width: '260px' }}
              >
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.id} — {c.subject}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label" style={{ marginBottom: 4 }}>Attendance Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="form-input"
                style={{ width: '160px' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button type="button" onClick={handleMarkAllPresent} className="btn-secondary">
              <CheckCircle2 size={15} /> Mark All Present
            </button>
            <button type="button" onClick={handleSaveAttendance} className="btn-primary">
              <Save size={15} /> Save Attendance Record
            </button>
          </div>
        </div>
      </div>

      {/* Attendance Summary Banner (if saved) */}
      {savedSummary && (
        <div className="glass-card" style={{ marginBottom: 20, background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '14px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <CheckCircle2 size={18} style={{ color: 'var(--green)' }} />
              <span style={{ fontWeight: 800, fontSize: '14px' }}>
                Attendance Recorded for {selectedClass?.name} ({formatDate(selectedDate)})
              </span>
            </div>
            <div style={{ display: 'flex', gap: 16, fontSize: '12.5px' }}>
              <span>Present: <b style={{ color: 'var(--green)' }}>{savedSummary.present}</b></span>
              <span>Absent: <b style={{ color: 'var(--red)' }}>{savedSummary.absent}</b></span>
              <span>Late: <b style={{ color: 'var(--orange)' }}>{savedSummary.late}</b></span>
              <span>Class Attendance Rate: <b style={{ color: 'var(--cyan)' }}>{savedSummary.percentage}%</b></span>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Student Attendance Sheet & Department Stats */}
      <div className="grid-2">
        {/* Student Roster */}
        <div className="glass-card table-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 800 }}>Student Roster ({students.length})</h3>
            <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>Class: {selectedClass?.subject}</span>
          </div>

          <table className="custom-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Roll No</th>
                <th>Avg. Attendance</th>
                <th>Mark Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map((stu) => {
                const curStatus = attendanceMap[stu.id] || 'Present';

                return (
                  <tr key={stu.id}>
                    <td>
                      <b>{stu.name}</b>
                    </td>
                    <td>
                      <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>{stu.rollNumber}</span>
                    </td>
                    <td>
                      <span style={{ fontWeight: 700, color: stu.attendance >= 80 ? 'var(--green)' : 'var(--red)' }}>
                        {stu.attendance}%
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        {['Present', 'Absent', 'Late', 'Excused'].map((st) => (
                          <button
                            key={st}
                            type="button"
                            onClick={() => handleStatusChange(stu.id, st)}
                            style={{
                              padding: '5px 8px',
                              borderRadius: 'var(--radius-sm)',
                              border: curStatus === st ? '1px solid currentColor' : '1px solid var(--border-subtle)',
                              background: curStatus === st
                                ? st === 'Present' ? 'var(--green-bg)' : st === 'Absent' ? 'var(--red-bg)' : st === 'Late' ? 'var(--orange-bg)' : 'rgba(0,169,224,0.15)'
                                : 'transparent',
                              color: curStatus === st
                                ? st === 'Present' ? 'var(--green)' : st === 'Absent' ? 'var(--red)' : st === 'Late' ? 'var(--orange)' : 'var(--cyan)'
                                : 'var(--text-dim)',
                              fontSize: '10.5px',
                              fontWeight: 700,
                              cursor: 'pointer',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Department Attendance Analytics */}
        <div className="glass-card">
          <h3 style={{ margin: '0 0 14px', fontSize: '15px', fontWeight: 800 }}>
            University Department Attendance
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {deptStats.map((stat) => (
              <div key={stat.department} style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginBottom: 4 }}>
                  <span style={{ fontWeight: 700 }}>Department of {stat.department}</span>
                  <span style={{ color: 'var(--cyan)', fontWeight: 800 }}>{stat.today}%</span>
                </div>
                <div className="progress-track" style={{ height: 6, marginBottom: 6 }}>
                  <div className="progress-fill green" style={{ width: `${stat.today}%` }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-dim)' }}>
                  <span>Weekly Avg: {stat.weekly}%</span>
                  <span>Monthly Avg: {stat.monthly}%</span>
                  <span>{stat.totalStudents} Students</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
