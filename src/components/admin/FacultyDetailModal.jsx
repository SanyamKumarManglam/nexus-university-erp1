import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { StatusBadge } from '../common/PriorityBadge';
import { RadialProgress } from '../common/RadialProgress';
import { StarRating } from '../common/StarRating';
import {
  User,
  GraduationCap,
  CalendarCheck,
  TrendingUp,
  Star,
  Clock,
  BookOpen,
  FileText,
  Mail,
  Phone,
  Calendar,
  Award,
  AlertTriangle
} from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export function FacultyDetailModal({ faculty, isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('overview');

  if (!faculty) return null;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'students', label: `Assigned Students (${faculty.studentsAssigned})`, icon: GraduationCap },
    { id: 'attendance', label: 'Attendance & Reliability', icon: CalendarCheck },
    { id: 'performance', label: 'Performance Scorecard', icon: TrendingUp },
    { id: 'reviews', label: 'Reviews & Feedback', icon: Star },
    { id: 'leave', label: 'Leave Balance', icon: Clock },
    { id: 'training', label: 'FDP & Training', icon: BookOpen },
    { id: 'documents', label: 'Documents & Credentials', icon: FileText }
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${faculty.name} — Faculty Dossier`} maxWidth="760px">
      {/* Header Info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, background: 'rgba(0, 169, 224, 0.06)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '14px 18px' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>{faculty.name}</h3>
          <div style={{ fontSize: '12.5px', color: 'var(--cyan)', fontWeight: 600 }}>
            {faculty.role} · Department of {faculty.department}
          </div>
          <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: 4 }}>
            Faculty ID: <b>{faculty.id}</b> · Joined: {formatDate(faculty.joinedDate)}
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ marginBottom: 4 }}>
            <span style={{ fontSize: '11px', color: 'var(--text-dim)', marginRight: 6 }}>Retention Risk:</span>
            <StatusBadge status={faculty.retentionRisk === 'High' ? 'at risk' : faculty.retentionRisk === 'Medium' ? 'monitor' : 'healthy'} />
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Workload: <b>{faculty.workloadPercent}%</b> ({faculty.studentsAssigned}/{faculty.maxCapacity})
          </div>
        </div>
      </div>

      {/* 8 Tabs Navigation */}
      <div className="tabs-container" style={{ marginBottom: 18 }}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <Icon size={14} />
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="glass-card" style={{ padding: '16px' }}>
            <h4 style={{ margin: '0 0 8px', fontSize: '13px', color: 'var(--cyan)' }}>Faculty Biography & Focus</h4>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              {faculty.bio}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div className="glass-card" style={{ padding: '14px' }}>
              <b style={{ fontSize: '12.5px', color: 'var(--text-main)', display: 'block', marginBottom: 8 }}>Contact & Personal Details</b>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Mail size={13} /> {faculty.email}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Phone size={13} /> {faculty.phone}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Calendar size={13} /> Joined: {formatDate(faculty.joinedDate)}</span>
              </div>
            </div>

            <div className="glass-card" style={{ padding: '14px' }}>
              <b style={{ fontSize: '12.5px', color: 'var(--text-main)', display: 'block', marginBottom: 8 }}>Academic Research Profile</b>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span><b>Qualification:</b> {faculty.qualification}</span>
                <span><b>Total Publications:</b> {faculty.researchPapers} Q1/Q2 Papers</span>
                <span><b>Funded Research Grants:</b> {faculty.grantsWon}</span>
              </div>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '14px' }}>
            <b style={{ fontSize: '12.5px', color: 'var(--text-main)', display: 'block', marginBottom: 8 }}>Subjects & Course Specializations</b>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {faculty.subjects?.map((sub, i) => (
                <span key={i} className="badge badge-purple" style={{ textTransform: 'none', fontSize: '11.5px' }}>
                  {sub}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Students */}
      {activeTab === 'students' && (
        <div className="glass-card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h4 style={{ margin: 0, fontSize: '14px' }}>Assigned Mentorship Caseload</h4>
            <span style={{ fontSize: '12px', color: 'var(--cyan)' }}><b>{faculty.studentsAssigned}</b> / {faculty.maxCapacity} students</span>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: 14 }}>
            Faculty advises {faculty.studentsAssigned} undergraduate students in the {faculty.department} department. Recommended maximum capacity under NBA accreditation norms is 120 advisees.
          </p>
          <div className="progress-track" style={{ height: 10 }}>
            <div className={`progress-fill ${faculty.workloadPercent > 90 ? 'red' : 'green'}`} style={{ width: `${faculty.workloadPercent}%` }} />
          </div>
        </div>
      )}

      {/* Tab 3: Attendance */}
      {activeTab === 'attendance' && (
        <div className="glass-card" style={{ padding: '18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h4 style={{ margin: '0 0 6px', fontSize: '14px' }}>Instructional Attendance & Reliability</h4>
            <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--green)', fontFamily: 'var(--font-mono)' }}>
              {faculty.attendanceRate}%
            </div>
            <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>
              Zero unexcused lecture absences recorded this semester.
            </p>
          </div>
          <RadialProgress value={faculty.attendanceRate} size={84} strokeWidth={8} sublabel="Reliability" />
        </div>
      )}

      {/* Tab 4: Performance */}
      {activeTab === 'performance' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div className="glass-card" style={{ padding: '16px', textAlign: 'center' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: 6 }}>Teaching Excellence Index</div>
            <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--cyan)', fontFamily: 'var(--font-mono)' }}>
              {faculty.performanceScore} / 100
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--green)', fontWeight: 700, marginTop: 4 }}>Top 10% in Department</div>
          </div>

          <div className="glass-card" style={{ padding: '16px', textAlign: 'center' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: 6 }}>Advisee Success Score</div>
            <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--purple-light)', fontFamily: 'var(--font-mono)' }}>
              {faculty.studentSuccessScore} / 100
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--green)', fontWeight: 700, marginTop: 4 }}>High Placement Rate</div>
          </div>
        </div>
      )}

      {/* Tab 5: Reviews */}
      {activeTab === 'reviews' && (
        <div className="glass-card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h4 style={{ margin: 0, fontSize: '14px' }}>Student & Peer Reviews</h4>
            <StarRating value={4.8} readOnly size={16} />
          </div>
          <div className="insight-card">
            <div className="insight-dot" style={{ background: 'var(--green)' }} />
            <div className="insight-content">
              <b>"Outstanding subject clarity and accessible lab mentoring."</b>
              <p>Aggregated student review summary · 94% positive sentiment across 86 course evaluation surveys.</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: Leave Balance */}
      {activeTab === 'leave' && (
        <div className="glass-card" style={{ padding: '16px' }}>
          <h4 style={{ margin: '0 0 14px', fontSize: '14px' }}>Annual Leave Balances</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: 12, borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Casual Leave</div>
              <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--cyan)', marginTop: 4 }}>
                {faculty.leaveBalance?.casual ?? 8} Days
              </div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: 12, borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Medical Leave</div>
              <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--orange)', marginTop: 4 }}>
                {faculty.leaveBalance?.medical ?? 10} Days
              </div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: 12, borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Academic / Duty</div>
              <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--green)', marginTop: 4 }}>
                {faculty.leaveBalance?.academic ?? 5} Days
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 7: Training */}
      {activeTab === 'training' && (
        <div className="glass-card" style={{ padding: '16px' }}>
          <h4 style={{ margin: '0 0 12px', fontSize: '14px' }}>Completed Faculty Development Programs (FDP)</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: '12.5px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <CheckCircle2 size={16} style={{ color: 'var(--green)' }} />
              <span>AICTE-ATAL FDP on Deep Learning Pedagogy (40 Hours)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <CheckCircle2 size={16} style={{ color: 'var(--green)' }} />
              <span>Outcome-Based Education (OBE) & NBA Accreditation Masterclass</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <CheckCircle2 size={16} style={{ color: 'var(--green)' }} />
              <span>Digital Higher-Education Assessment & LMS Automation</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 8: Documents */}
      {activeTab === 'documents' && (
        <div className="glass-card" style={{ padding: '16px' }}>
          <h4 style={{ margin: '0 0 12px', fontSize: '14px' }}>Verified Institutional Credentials</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)' }}>
              <span>Doctoral Ph.D. Degree Certificate</span>
              <span className="badge badge-success">Verified</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)' }}>
              <span>Faculty Appointment Order & Terms of Employment</span>
              <span className="badge badge-success">Signed & Archived</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)' }}>
              <span>University Research Ethics & Patent Agreement</span>
              <span className="badge badge-success">Verified</span>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
