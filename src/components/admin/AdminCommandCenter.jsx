import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useCapacity } from '../../context/CapacityContext';
import { useToast } from '../../context/ToastContext';
import { storageService } from '../../services/storageService';
import {
  Users,
  GraduationCap,
  Scale,
  TrendingUp,
  AlertTriangle,
  Clock,
  UserCheck,
  Briefcase,
  Megaphone,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  CheckCircle,
  Sliders,
  RotateCcw,
  Check
} from 'lucide-react';
import { StatusBadge, PriorityBadge } from '../common/PriorityBadge';
import { RadialProgress } from '../common/RadialProgress';

export function AdminCommandCenter({ onNavigate }) {
  const { currentUser } = useAuth();
  const { t } = useLanguage();
  const toast = useToast();
  const { capacityCap, isCustom, setCapacityCap, resetCapacityCap, getEffectiveCap, validateCapInput } = useCapacity();

  const [facultyList, setFacultyList] = useState([]);
  const [studentList, setStudentList] = useState([]);
  const [candidateList, setCandidateList] = useState([]);
  const [onboardingList, setOnboardingList] = useState([]);
  const [leaveList, setLeaveList] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  // Local state for capacity cap inline control
  const [inlineCapInput, setInlineCapInput] = useState(capacityCap ? String(capacityCap) : '');
  const [inlineError, setInlineError] = useState('');
  const [isEditingCap, setIsEditingCap] = useState(false);

  useEffect(() => {
    setInlineCapInput(capacityCap ? String(capacityCap) : '');
    setInlineError('');
  }, [capacityCap]);

  const handleSaveInlineCap = (e) => {
    if (e) e.preventDefault();
    const check = validateCapInput(inlineCapInput);
    if (!check.isValid) {
      setInlineError(check.message);
      toast.error(check.message);
      return;
    }
    setInlineError('');
    const res = setCapacityCap(inlineCapInput);
    if (res.success) {
      toast.success(`Capacity Cap updated to ${res.value} advisees.`);
      setIsEditingCap(false);
    }
  };

  const handleResetInlineCap = () => {
    resetCapacityCap();
    setInlineCapInput('');
    setInlineError('');
    setIsEditingCap(false);
    toast.info('Capacity Cap reset to benchmark defaults.');
  };

  useEffect(() => {
    setFacultyList(storageService.getFaculty());
    setStudentList(storageService.getStudents());
    setCandidateList(storageService.getCandidates());
    setOnboardingList(storageService.getOnboarding());
    setLeaveList(storageService.getLeaveRequests());
    setAnnouncements(storageService.getAnnouncements());
  }, []);

  // Compute live KPIs with dynamic capacity cap
  const totalFaculty = facultyList.length;
  const totalStudents = studentList.length;
  const overloadedAdvisors = facultyList.filter((f) => {
    const effectiveCap = getEffectiveCap(f.maxCapacity);
    return (f.studentsAssigned / effectiveCap) > 0.9;
  });
  const atRiskFaculty = facultyList.filter((f) => f.retentionRisk === 'High');
  const atRiskStudents = studentList.filter((s) => s.riskLevel === 'At Risk' || s.riskLevel === 'Critical');
  
  const avgAttendance = studentList.length
    ? Math.round(studentList.reduce((a, s) => a + (s.attendance || 0), 0) / studentList.length)
    : 92;

  const avgStudentIndex = studentList.length
    ? Math.round(studentList.reduce((a, s) => a + (s.studentIndex || 0), 0) / studentList.length)
    : 84;

  const pendingStudentLeaves = leaveList.filter((l) => l.type === 'student' && l.status === 'Pending').length;
  const pendingTeacherLeaves = leaveList.filter((l) => l.type === 'teacher' && l.status === 'Pending').length;
  const pendingOnboardingTasks = onboardingList.filter((o) => o.status === 'In Progress').length;
  const pendingRecruitmentApprovals = candidateList.filter((c) => c.status === 'Applied' || c.status === 'Screening').length;

  return (
    <div className="command-center-container">
      {/* Hero Banner */}
      <div className="hero-banner">
        <div className="hero-content">
          <h2>{t('welcome_back', 'Welcome back')}, {currentUser?.name || 'Administrator'} 👋</h2>
          <p>
            {t('cmd_hero_desc_prefix', 'Nexus University Operating Platform is actively monitoring')} {totalFaculty} {t('lbl_faculty_members', 'faculty members')}, {totalStudents} {t('lbl_enrolled_students', 'enrolled students')}, {t('cmd_hero_desc_suffix', 'and institutional academic health across 4 engineering departments.')}
          </p>
          <div className="hero-actions">
            <button className="btn-white" onClick={() => onNavigate('workload')}>
              <Scale size={16} /> ⚡ {t('btn_optimize', 'Calculate Capacity Optimization')}
            </button>
            <button className="btn-ghost" onClick={() => onNavigate('recruit')}>
              <Briefcase size={16} /> + {t('btn_add_candidate', 'Add Candidate')}
            </button>
            <button className="btn-ghost" onClick={() => onNavigate('leave')}>
              <Clock size={16} /> {t('btn_review_leave', 'Review Leave')} ({pendingTeacherLeaves + pendingStudentLeaves})
            </button>
          </div>
        </div>
      </div>

      {/* Core Metrics Grid */}
      <div className="cards-grid">
        <div className="glass-card metric-card" onClick={() => onNavigate('faculty')} style={{ cursor: 'pointer' }}>
          <div>
            <div className="metric-label">{t('lbl_total_faculty_staff', 'Total Faculty & Staff')}</div>
            <div className="metric-value">{totalFaculty}</div>
            <div className="metric-delta delta-up">
              <span>↑ 8 {t('lbl_new_this_year', 'new this academic year')}</span>
            </div>
          </div>
          <div className="metric-icon-box">
            <Users size={20} />
          </div>
        </div>

        <div className="glass-card metric-card" onClick={() => onNavigate('students')} style={{ cursor: 'pointer' }}>
          <div>
            <div className="metric-label">{t('lbl_enrolled_students_metric', 'Enrolled Students')}</div>
            <div className="metric-value">{totalStudents}</div>
            <div className="metric-delta delta-neutral">
              <span>{t('lbl_across_engineering_streams', 'Across 4 core engineering streams')}</span>
            </div>
          </div>
          <div className="metric-icon-box" style={{ color: 'var(--purple-light)', background: 'rgba(124, 58, 237, 0.12)' }}>
            <GraduationCap size={20} />
          </div>
        </div>

        <div className="glass-card metric-card" onClick={() => onNavigate('workload')} style={{ cursor: 'pointer' }}>
          <div>
            <div className="metric-label">{t('lbl_faculty_advising_load', 'Faculty Advising Load')}</div>
            <div className="metric-value">{overloadedAdvisors.length > 0 ? `${overloadedAdvisors.length} ${t('status_overloaded', 'Overloaded')}` : t('status_balanced', 'Balanced')}</div>
            <div className={`metric-delta ${overloadedAdvisors.length > 0 ? 'delta-down' : 'delta-up'}`}>
              <span>{overloadedAdvisors.length > 0 ? t('lbl_urgent_rebalancing', 'Rebalancing recommended') : t('lbl_capacity_healthy', 'Capacity healthy (<85%)')}</span>
            </div>
          </div>
          <div className="metric-icon-box" style={{ color: 'var(--orange)', background: 'rgba(245, 158, 11, 0.12)' }}>
            <Scale size={20} />
          </div>
        </div>

        <div className="glass-card metric-card" onClick={() => onNavigate('attendance')} style={{ cursor: 'pointer' }}>
          <div>
            <div className="metric-label">{t('lbl_university_attendance', 'University Attendance')}</div>
            <div className="metric-value">{avgAttendance}%</div>
            <div className="metric-delta delta-up">
              <span>↑ 3.2% {t('lbl_vs_prev_semester', 'vs previous semester')}</span>
            </div>
          </div>
          <div className="metric-icon-box" style={{ color: 'var(--green)', background: 'rgba(16, 185, 129, 0.12)' }}>
            <TrendingUp size={20} />
          </div>
        </div>
      </div>

      {/* TODAY'S PRIORITIES SECTION (Clickable badges requirement) */}
      <div className="glass-card" style={{ marginBottom: 24, borderLeft: '4px solid var(--cyan)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Sparkles size={18} style={{ color: 'var(--cyan)' }} />
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800 }}>
              {t('today_priorities')}
            </h3>
          </div>
          <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
            Real-time action queue
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 12 }}>
          {/* Overloaded Advisors Priority */}
          <div
            onClick={() => onNavigate('workload')}
            className="insight-card"
            style={{ cursor: 'pointer', margin: 0, border: '1px solid rgba(239, 68, 68, 0.25)', background: 'rgba(239, 68, 68, 0.06)' }}
          >
            <AlertTriangle size={18} style={{ color: 'var(--red)', marginTop: 2, flexShrink: 0 }} />
            <div>
              <b style={{ color: 'var(--red)', fontSize: '12.5px' }}>{overloadedAdvisors.length} advisors overloaded</b>
              <p style={{ margin: '2px 0 0', fontSize: '11px', color: 'var(--text-muted)' }}>Click to run Smart Allocation →</p>
            </div>
          </div>

          {/* Onboarding Pending Priority */}
          <div
            onClick={() => onNavigate('onboard')}
            className="insight-card"
            style={{ cursor: 'pointer', margin: 0, border: '1px solid rgba(0, 210, 255, 0.25)', background: 'rgba(0, 210, 255, 0.06)' }}
          >
            <UserCheck size={18} style={{ color: 'var(--cyan)', marginTop: 2, flexShrink: 0 }} />
            <div>
              <b style={{ color: 'var(--cyan)', fontSize: '12.5px' }}>{pendingOnboardingTasks} onboarding workflows</b>
              <p style={{ margin: '2px 0 0', fontSize: '11px', color: 'var(--text-muted)' }}>Track candidate milestones →</p>
            </div>
          </div>

          {/* Student Leaves Priority */}
          <div
            onClick={() => onNavigate('leave')}
            className="insight-card"
            style={{ cursor: 'pointer', margin: 0, border: '1px solid rgba(245, 158, 11, 0.25)', background: 'rgba(245, 158, 11, 0.06)' }}
          >
            <Clock size={18} style={{ color: 'var(--orange)', marginTop: 2, flexShrink: 0 }} />
            <div>
              <b style={{ color: 'var(--orange)', fontSize: '12.5px' }}>{pendingStudentLeaves} student leave requests</b>
              <p style={{ margin: '2px 0 0', fontSize: '11px', color: 'var(--text-muted)' }}>Assigned advisor review queue →</p>
            </div>
          </div>

          {/* Teacher Leaves Priority */}
          <div
            onClick={() => onNavigate('leave')}
            className="insight-card"
            style={{ cursor: 'pointer', margin: 0, border: '1px solid rgba(124, 58, 237, 0.25)', background: 'rgba(124, 58, 237, 0.06)' }}
          >
            <Clock size={18} style={{ color: 'var(--purple-light)', marginTop: 2, flexShrink: 0 }} />
            <div>
              <b style={{ color: 'var(--purple-light)', fontSize: '12.5px' }}>{pendingTeacherLeaves} faculty leave requests</b>
              <p style={{ margin: '2px 0 0', fontSize: '11px', color: 'var(--text-muted)' }}>Administrator approval required →</p>
            </div>
          </div>

          {/* Recruitment Approvals Priority */}
          <div
            onClick={() => onNavigate('recruit')}
            className="insight-card"
            style={{ cursor: 'pointer', margin: 0, border: '1px solid rgba(16, 185, 129, 0.25)', background: 'rgba(16, 185, 129, 0.06)' }}
          >
            <Briefcase size={18} style={{ color: 'var(--green)', marginTop: 2, flexShrink: 0 }} />
            <div>
              <b style={{ color: 'var(--green)', fontSize: '12.5px' }}>{pendingRecruitmentApprovals} candidates pending review</b>
              <p style={{ margin: '2px 0 0', fontSize: '11px', color: 'var(--text-muted)' }}>Evaluate AI candidate matches →</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Two-Column Analytics */}
      <div className="grid-2">
        {/* Left: Advisor Workload Live Health */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 800 }}>Faculty Advisor Caseload</h3>
                <span
                  className={`badge ${isCustom ? 'badge-primary' : 'badge-neutral'}`}
                  style={{ fontSize: '10.5px', padding: '2px 8px' }}
                >
                  {isCustom ? `Cap: ${capacityCap}` : 'Default Caps'}
                </span>
              </div>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                {isCustom ? `Evaluated against manual ${capacityCap} limit` : 'Live capacity tracking across departments'}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <button
                className="btn-secondary"
                style={{ padding: '5px 10px', fontSize: '11.5px', display: 'flex', alignItems: 'center', gap: 4 }}
                onClick={() => setIsEditingCap(!isEditingCap)}
                title="Configure Capacity Cap"
              >
                <Sliders size={13} /> {isEditingCap ? 'Close' : 'Set Cap'}
              </button>
              <button className="btn-secondary" onClick={() => onNavigate('workload')}>
                View Optimizer →
              </button>
            </div>
          </div>

          {/* Quick Inline Capacity Cap Adjuster */}
          {isEditingCap && (
            <div
              style={{
                background: 'rgba(0, 169, 224, 0.07)',
                border: '1px solid rgba(0, 210, 255, 0.25)',
                borderRadius: 'var(--radius-md)',
                padding: '10px 14px',
                marginBottom: 16,
                animation: 'fadeIn 0.2s ease'
              }}
            >
              <form onSubmit={handleSaveInlineCap} style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-main)' }}>
                  Set Cap:
                </label>
                <input
                  type="number"
                  min="10"
                  max="500"
                  value={inlineCapInput}
                  onChange={(e) => {
                    setInlineCapInput(e.target.value);
                    if (inlineError) setInlineError('');
                  }}
                  placeholder="e.g. 120"
                  className="form-input"
                  style={{ width: '90px', padding: '5px 8px', fontSize: '12px' }}
                />
                <button type="submit" className="btn-primary" style={{ padding: '5px 12px', fontSize: '12px' }}>
                  Apply
                </button>
                {isCustom && (
                  <button
                    type="button"
                    onClick={handleResetInlineCap}
                    className="btn-secondary"
                    style={{ padding: '5px 10px', fontSize: '12px' }}
                  >
                    Reset
                  </button>
                )}
              </form>
              {inlineError && (
                <div style={{ color: 'var(--red)', fontSize: '11px', marginTop: 4 }}>
                  {inlineError}
                </div>
              )}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {facultyList.slice(0, 5).map((f) => {
              const effectiveCap = getEffectiveCap(f.maxCapacity);
              const loadPercent = Math.round((f.studentsAssigned / effectiveCap) * 100);
              let barColor = 'green';
              if (loadPercent > 90) barColor = 'red';
              else if (loadPercent >= 75) barColor = 'orange';

              return (
                <div key={f.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginBottom: 5 }}>
                    <span style={{ fontWeight: 700 }}>{f.name} ({f.department})</span>
                    <span style={{ color: 'var(--text-muted)' }}>
                      <b>{f.studentsAssigned}</b> / <span style={{ color: isCustom ? 'var(--cyan)' : 'inherit', fontWeight: 600 }}>{effectiveCap}</span> advisees ({loadPercent}%)
                    </span>
                  </div>
                  <div className="progress-track">
                    <div className={`progress-fill ${barColor}`} style={{ width: `${Math.min(100, loadPercent)}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: AI Intelligence Insights */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 800 }}>NEXUS AI Intelligence Insights</h3>
            <span style={{ fontSize: '11px', color: 'var(--cyan)', fontWeight: 700 }}>DETECT → PREDICT</span>
          </div>

          <div className="insight-card">
            <div className="insight-dot" style={{ background: 'var(--red)' }} />
            <div className="insight-content">
              <b>Caseload Disparity Detected in CSE</b>
              <p>Prof. Rajesh Sharma (96%) and Dr. Karthik Rao (97%) are near maximum capacity. Recommend rebalancing 30 students to Dr. Sunita Rao (50%).</p>
            </div>
          </div>

          <div className="insight-card">
            <div className="insight-dot" style={{ background: 'var(--green)' }} />
            <div className="insight-content">
              <b>Onboarding Velocity High</b>
              <p>Faculty onboarding completion rate is at 87%. Dr. Radhika Pillai is on track for final council sign-off this week.</p>
            </div>
          </div>

          <div className="insight-card">
            <div className="insight-dot" style={{ background: 'var(--orange)' }} />
            <div className="insight-content">
              <b>At-Risk Student Support Alert</b>
              <p>{atRiskStudents.length} students have composite indices below 65. Recommend proactive advisor outreach before mid-term exams.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Lifecycle KPIs Radial Row */}
      <div className="section-header">
        <h3>Institutional Lifecycle KPIs</h3>
        <span>Aggregate University Metrics</span>
      </div>

      <div className="grid-3">
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px' }}>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 600 }}>Avg. Student Index</div>
            <div style={{ fontSize: '26px', fontWeight: 800, margin: '4px 0 2px', fontFamily: 'var(--font-mono)' }}>{avgStudentIndex} / 100</div>
            <div style={{ fontSize: '11.5px', color: 'var(--green)', fontWeight: 700 }}>Healthy Academic Band</div>
          </div>
          <RadialProgress value={avgStudentIndex} size={76} strokeWidth={7} sublabel="" />
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px' }}>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 600 }}>Faculty Retention Rate</div>
            <div style={{ fontSize: '26px', fontWeight: 800, margin: '4px 0 2px', fontFamily: 'var(--font-mono)' }}>92%</div>
            <div style={{ fontSize: '11.5px', color: 'var(--green)', fontWeight: 700 }}>↑ 4% vs National Benchmark</div>
          </div>
          <RadialProgress value={92} size={76} strokeWidth={7} sublabel="" />
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px' }}>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 600 }}>Onboarding Completion</div>
            <div style={{ fontSize: '26px', fontWeight: 800, margin: '4px 0 2px', fontFamily: 'var(--font-mono)' }}>87%</div>
            <div style={{ fontSize: '11.5px', color: 'var(--cyan)', fontWeight: 700 }}>Avg. 18 days to Active</div>
          </div>
          <RadialProgress value={87} size={76} strokeWidth={7} sublabel="" />
        </div>
      </div>
    </div>
  );
}
