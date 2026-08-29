import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { storageService } from '../../services/storageService';
import { reviewService } from '../../services/reviewService';
import { RadialProgress } from '../common/RadialProgress';
import { StatusBadge, PriorityBadge } from '../common/PriorityBadge';
import {
  GraduationCap,
  CalendarCheck,
  TrendingUp,
  Star,
  Clock,
  Megaphone,
  User,
  Calendar,
  Sparkles,
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export function StudentDashboard({ onNavigate }) {
  const { currentUser } = useAuth();
  const { t } = useLanguage();

  const [student, setStudent] = useState(null);
  const [sanitizedReviews, setSanitizedReviews] = useState([]);
  const [myLeaves, setMyLeaves] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const allStudents = storageService.getStudents();
    const currentStudent = allStudents.find((s) => s.id === currentUser?.id || s.name === currentUser?.name) || allStudents[0];
    setStudent(currentStudent);

    // Get sanitized reviews (isStudentViewer = true ensures private teacher notes are stripped!)
    if (currentStudent) {
      const reviews = reviewService.getTeacherReviewsForStudent(currentStudent.id, true);
      setSanitizedReviews(reviews);

      const leaves = storageService.getLeaveRequests().filter((l) => l.applicantId === currentStudent.id);
      setMyLeaves(leaves);
    }

    setAnnouncements(storageService.getAnnouncements().slice(0, 3));
  }, [currentUser]);

  if (!student) return null;

  return (
    <div>
      {/* Hero Welcome Banner */}
      <div className="hero-banner">
        <div className="hero-content">
          <h2>Welcome back, {student.name} 👋</h2>
          <p>
            {student.program} · Semester {student.semester} ({student.section}) · Roll Number: {student.rollNumber}
          </p>
          <div className="hero-actions">
            <button className="btn-white" onClick={() => onNavigate('student-leave')}>
              <Clock size={16} /> Request Leave
            </button>
            <button className="btn-ghost" onClick={() => onNavigate('student-attendance')}>
              <CalendarCheck size={16} /> View Attendance ({student.attendance}%)
            </button>
            <button className="btn-ghost" onClick={() => onNavigate('student-reviews')}>
              <Star size={16} /> Review My Faculty
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="cards-grid">
        <div className="glass-card metric-card" onClick={() => onNavigate('student-performance')} style={{ cursor: 'pointer' }}>
          <div>
            <div className="metric-label">My Student Index</div>
            <div className="metric-value">{student.studentIndex} / 100</div>
            <div className="metric-delta delta-up">
              <span>{student.riskLevel} Academic Standing</span>
            </div>
          </div>
          <div className="metric-icon-box">
            <TrendingUp size={20} />
          </div>
        </div>

        <div className="glass-card metric-card" onClick={() => onNavigate('student-attendance')} style={{ cursor: 'pointer' }}>
          <div>
            <div className="metric-label">Course Attendance</div>
            <div className="metric-value">{student.attendance}%</div>
            <div className="metric-delta delta-up">
              <span>Complies with 75% examination threshold</span>
            </div>
          </div>
          <div className="metric-icon-box" style={{ color: 'var(--green)', background: 'rgba(16, 185, 129, 0.12)' }}>
            <CalendarCheck size={20} />
          </div>
        </div>

        <div className="glass-card metric-card">
          <div>
            <div className="metric-label">Current CGPA</div>
            <div className="metric-value">{student.cgpa || 8.7}</div>
            <div className="metric-delta delta-up">
              <span>{student.completedCredits || 124} Credits Earned</span>
            </div>
          </div>
          <div className="metric-icon-box" style={{ color: 'var(--purple-light)', background: 'rgba(124, 58, 237, 0.12)' }}>
            <GraduationCap size={20} />
          </div>
        </div>

        <div className="glass-card metric-card">
          <div>
            <div className="metric-label">Assigned Advisor</div>
            <div style={{ fontSize: '16px', fontWeight: 800, margin: '8px 0 2px', color: 'var(--cyan)' }}>
              {student.advisorName}
            </div>
            <div className="metric-delta delta-neutral">
              <span>Office: CSE Block Room 302</span>
            </div>
          </div>
          <div className="metric-icon-box" style={{ color: 'var(--orange)', background: 'rgba(245, 158, 11, 0.12)' }}>
            <User size={20} />
          </div>
        </div>
      </div>

      {/* Main Two Column View */}
      <div className="grid-2">
        {/* Left: Student Index Radial & Factor Breakdown */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Sparkles size={18} style={{ color: 'var(--cyan)' }} />
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 800 }}>My Student Index Breakdown</h3>
            </div>
            <StatusBadge status={student.riskLevel.toLowerCase()} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr', gap: 16, alignItems: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <RadialProgress value={student.studentIndex} size={92} strokeWidth={8} sublabel="/ 100" />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 7, fontSize: '12px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                  <span>Lecture Attendance</span>
                  <b>{student.indexBreakdown?.attendance || student.attendance}%</b>
                </div>
                <div className="progress-track" style={{ height: 5 }}>
                  <div className="progress-fill green" style={{ width: `${student.indexBreakdown?.attendance || student.attendance}%` }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                  <span>Academic Exams</span>
                  <b>{student.indexBreakdown?.performance || 85}%</b>
                </div>
                <div className="progress-track" style={{ height: 5 }}>
                  <div className="progress-fill green" style={{ width: `${student.indexBreakdown?.performance || 85}%` }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                  <span>Assignment Completion</span>
                  <b>{student.indexBreakdown?.assignments || 82}%</b>
                </div>
                <div className="progress-track" style={{ height: 5 }}>
                  <div className="progress-fill green" style={{ width: `${student.indexBreakdown?.assignments || 82}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 14, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: '11px', color: 'var(--text-dim)', fontStyle: 'italic' }}>
            ℹ Your Student Index is an internal progress metric to help faculty advisors support your learning journey.
          </div>
        </div>

        {/* Right: Teacher Reviews & Feedback (Sanitized) */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 800 }}>Faculty Mentorship Feedback</h3>
            <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>{sanitizedReviews.length} Reviews</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {sanitizedReviews.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-muted)', fontSize: '12.5px' }}>
                No faculty reviews recorded yet for this semester.
              </div>
            ) : (
              sanitizedReviews.map((rev) => (
                <div key={rev.id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <b style={{ fontSize: '12.5px', color: 'var(--cyan)' }}>{rev.teacherName}</b>
                    <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>{formatDate(rev.date)}</span>
                  </div>
                  <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: 2 }}>{rev.course}</div>

                  {rev.strengths && (
                    <p style={{ margin: '6px 0 0', fontSize: '12px', color: 'var(--text-main)', lineHeight: 1.4 }}>
                      "{rev.strengths}"
                    </p>
                  )}
                  {/* Notice that privateNotes is NEVER rendered to student! */}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Announcements Stream */}
      <div className="section-header">
        <h3>Campus Announcements & Notices</h3>
        <button onClick={() => onNavigate('announcements')} className="btn-secondary" style={{ padding: '4px 10px', fontSize: '11.5px' }}>
          View All Notices →
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {announcements.map((ann) => (
          <div key={ann.id} className="glass-card" style={{ padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <PriorityBadge priority={ann.priority} />
                <b style={{ fontSize: '13px' }}>{ann.title}</b>
              </div>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>
                {ann.message.slice(0, 140)}...
              </p>
            </div>
            <span style={{ fontSize: '11px', color: 'var(--text-dim)', whiteSpace: 'nowrap', marginLeft: 16 }}>
              {formatDate(ann.publishDate)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
