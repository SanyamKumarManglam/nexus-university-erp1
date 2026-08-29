import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { storageService } from '../../services/storageService';
import {
  BookOpen,
  Users,
  CalendarCheck,
  Star,
  Clock,
  TrendingUp,
  Scale,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Megaphone
} from 'lucide-react';
import { StatusBadge } from '../common/PriorityBadge';
import { RadialProgress } from '../common/RadialProgress';

export function TeacherDashboard({ onNavigate }) {
  const { currentUser } = useAuth();
  const { t } = useLanguage();

  const [students, setStudents] = useState([]);
  const [facultyProfile, setFacultyProfile] = useState(null);
  const [leaves, setLeaves] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const allStudents = storageService.getStudents();
    const faculty = storageService.getFaculty().find((f) => f.id === currentUser?.id || f.name === currentUser?.name);
    setFacultyProfile(faculty || {
      name: currentUser?.name || 'Faculty Member',
      department: currentUser?.department || 'ECE',
      role: 'Associate Professor',
      studentsAssigned: 42,
      maxCapacity: 120,
      workloadPercent: 70,
      performanceScore: 92,
      attendanceRate: 96
    });

    // Students assigned to this teacher / advisor
    const myStudents = allStudents.filter(
      (s) => s.advisorId === currentUser?.id || s.advisorName === currentUser?.name || s.department === currentUser?.department
    );
    setStudents(myStudents);

    setLeaves(storageService.getLeaveRequests().filter((l) => l.applicantId === currentUser?.id));
    setAnnouncements(storageService.getAnnouncements().slice(0, 3));
  }, [currentUser]);

  const atRiskStudents = students.filter((s) => s.riskLevel === 'At Risk' || s.riskLevel === 'Critical');

  return (
    <div>
      {/* Hero Greeting */}
      <div className="hero-banner">
        <div className="hero-content">
          <h2>Good day, {currentUser?.name || 'Professor'} 👋</h2>
          <p>
            You are managing {students.length} students across 2 active lecture courses. Department of {currentUser?.department || 'ECE'}.
          </p>
          <div className="hero-actions">
            <button className="btn-white" onClick={() => onNavigate('attendance')}>
              <CalendarCheck size={16} /> Take Today's Attendance
            </button>
            <button className="btn-ghost" onClick={() => onNavigate('teacher-reviews')}>
              <Star size={16} /> Submit Student Review
            </button>
            <button className="btn-ghost" onClick={() => onNavigate('teacher-leave')}>
              <Clock size={16} /> Request Leave
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="cards-grid">
        <div className="glass-card" onClick={() => onNavigate('teacher-students')} style={{ cursor: 'pointer' }}>
          <div className="metric-label">My Assigned Students</div>
          <div className="metric-value">{students.length}</div>
          <div className="metric-delta delta-up">Active mentees this semester</div>
        </div>

        <div className="glass-card" onClick={() => onNavigate('attendance')} style={{ cursor: 'pointer' }}>
          <div className="metric-label">Lecture Attendance Rate</div>
          <div className="metric-value">{facultyProfile?.attendanceRate || 95}%</div>
          <div className="metric-delta delta-up">Instructional reliability score</div>
        </div>

        <div className="glass-card" onClick={() => onNavigate('performance')} style={{ cursor: 'pointer' }}>
          <div className="metric-label">Teaching Rating</div>
          <div className="metric-value">{facultyProfile?.performanceScore || 90} / 100</div>
          <div className="metric-delta delta-up">Based on student evaluations</div>
        </div>

        <div className="glass-card">
          <div className="metric-label">Workload Capacity</div>
          <div className="metric-value">{facultyProfile?.workloadPercent || 65}%</div>
          <div className="metric-delta delta-neutral">Balanced advising load</div>
        </div>
      </div>

      {/* Main Two Columns */}
      <div className="grid-2">
        {/* Left: At-Risk Mentee Alerts */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <AlertTriangle size={18} style={{ color: 'var(--orange)' }} />
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 800 }}>Student Mentorship Risk Alerts</h3>
            </div>
            <button className="btn-secondary" onClick={() => onNavigate('teacher-students')} style={{ padding: '4px 10px', fontSize: '11.5px' }}>
              View All Students →
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {atRiskStudents.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-muted)', fontSize: '12.5px' }}>
                All assigned mentees currently hold healthy student indices (&gt;75).
              </div>
            ) : (
              atRiskStudents.map((stu) => (
                <div key={stu.id} className="insight-card" style={{ margin: 0, border: '1px solid rgba(239, 68, 68, 0.25)' }}>
                  <div className="insight-dot" style={{ background: 'var(--red)' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <b style={{ fontSize: '13px' }}>{stu.name}</b>
                      <StatusBadge status={stu.riskLevel.toLowerCase()} />
                    </div>
                    <p style={{ margin: '3px 0 0', fontSize: '11.5px', color: 'var(--text-muted)' }}>
                      Index: <b>{stu.studentIndex}/100</b> · Attendance: <b>{stu.attendance}%</b> · Roll: {stu.rollNumber}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Quick Action Center & Active Notices */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 800 }}>Institutional Notice Board</h3>
            <button className="btn-secondary" onClick={() => onNavigate('announcements')} style={{ padding: '4px 10px', fontSize: '11.5px' }}>
              Full Board →
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {announcements.map((ann) => (
              <div key={ann.id} style={{ background: 'rgba(255,255,255,0.02)', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <b style={{ fontSize: '12.5px', color: 'var(--text-main)' }}>{ann.title}</b>
                <p style={{ margin: '4px 0 0', fontSize: '11.5px', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  {ann.message.slice(0, 110)}...
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
