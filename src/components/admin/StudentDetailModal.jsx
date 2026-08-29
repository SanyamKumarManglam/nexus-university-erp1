import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { StatusBadge } from '../common/PriorityBadge';
import { RadialProgress } from '../common/RadialProgress';
import { studentService } from '../../services/studentService';
import { facultyService } from '../../services/facultyService';
import { useToast } from '../../context/ToastContext';
import {
  GraduationCap,
  Mail,
  Phone,
  User,
  CalendarCheck,
  TrendingUp,
  AlertTriangle,
  Award,
  Sparkles,
  BookOpen,
  CheckCircle2
} from 'lucide-react';

export function StudentDetailModal({ student, isOpen, onClose, onRefresh }) {
  const toast = useToast();
  const [isEditingAdvisor, setIsEditingAdvisor] = useState(false);
  const [selectedAdvisorId, setSelectedAdvisorId] = useState(student?.advisorId || '');
  const facultyList = facultyService.getAllFaculty();

  if (!student) return null;

  const breakdown = student.indexBreakdown || {
    attendance: student.attendance || 85,
    performance: 82,
    engagement: 80,
    assignments: 80,
    reviews: 84
  };

  const handleSaveAdvisor = () => {
    const adv = facultyList.find((f) => f.id === selectedAdvisorId);
    if (!adv) return;

    try {
      studentService.assignAdvisor(student.id, adv.id, adv.name);
      setIsEditingAdvisor(false);
      if (onRefresh) onRefresh();
      toast.success(`Assigned advisor updated to ${adv.name}`);
    } catch (e) {
      toast.error('Failed to update advisor');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${student.name} — Student Academic Dossier`} maxWidth="720px">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {/* Header Profile Summary */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', background: 'rgba(0, 169, 224, 0.06)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '16px' }}>
          <div>
            <h3 style={{ margin: '0 0 4px', fontSize: '18px', fontWeight: 800 }}>{student.name}</h3>
            <div style={{ fontSize: '13px', color: 'var(--cyan)', fontWeight: 600 }}>
              {student.program} · Semester {student.semester} ({student.section})
            </div>
            <div style={{ display: 'flex', gap: 14, marginTop: 8, fontSize: '12px', color: 'var(--text-muted)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Mail size={13} /> {student.email}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Phone size={13} /> {student.phone}</span>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ marginBottom: 4 }}>
              <StatusBadge status={student.riskLevel.toLowerCase()} />
            </div>
            <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Roll: {student.rollNumber}</span>
          </div>
        </div>

        {/* INNOVATIVE STUDENT INDEX RADIAL GAUGE & FACTOR BREAKDOWN */}
        <div className="glass-card" style={{ background: 'linear-gradient(135deg, rgba(12, 25, 45, 0.8), rgba(20, 35, 60, 0.8))', border: '1px solid rgba(0, 210, 255, 0.25)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Sparkles size={18} style={{ color: 'var(--cyan)' }} />
              <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 800 }}>
                NEXUS Student Composite Index
              </h4>
            </div>
            <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: 600 }}>
              Weighted Holistic Support Metric
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 20, alignItems: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <RadialProgress value={student.studentIndex} size={100} strokeWidth={9} sublabel="/ 100" />
              <div style={{ fontSize: '11px', fontWeight: 700, marginTop: 4, color: student.studentIndex >= 80 ? 'var(--green)' : student.studentIndex >= 60 ? 'var(--orange)' : 'var(--red)' }}>
                {student.riskLevel} Tier
              </div>
            </div>

            {/* Composite Breakdown Factors */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', marginBottom: 3 }}>
                  <span>Classroom Attendance</span>
                  <b>{breakdown.attendance}%</b>
                </div>
                <div className="progress-track" style={{ height: 6 }}>
                  <div className={`progress-fill ${breakdown.attendance >= 80 ? 'green' : 'red'}`} style={{ width: `${breakdown.attendance}%` }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', marginBottom: 3 }}>
                  <span>Academic Performance & Grades</span>
                  <b>{breakdown.performance}%</b>
                </div>
                <div className="progress-track" style={{ height: 6 }}>
                  <div className="progress-fill green" style={{ width: `${breakdown.performance}%` }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', marginBottom: 3 }}>
                  <span>Assignment & Lab Completion</span>
                  <b>{breakdown.assignments}%</b>
                </div>
                <div className="progress-track" style={{ height: 6 }}>
                  <div className="progress-fill orange" style={{ width: `${breakdown.assignments}%` }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', marginBottom: 3 }}>
                  <span>Class Participation & Peer Engagement</span>
                  <b>{breakdown.engagement}%</b>
                </div>
                <div className="progress-track" style={{ height: 6 }}>
                  <div className="progress-fill green" style={{ width: `${breakdown.engagement}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 14, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: '11px', color: 'var(--text-dim)', fontStyle: 'italic' }}>
            ℹ Institutional Notice: The Student Index is a multi-dimensional support indicator designed to trigger early, proactive mentorship interventions. It is not a punitive judgment or final transcript grade.
          </div>
        </div>

        {/* Assigned Mentors & Advisors Box */}
        <div className="glass-card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <b style={{ fontSize: '13px', color: 'var(--text-main)' }}>Assigned Faculty Mentors</b>
            {!isEditingAdvisor ? (
              <button
                type="button"
                onClick={() => setIsEditingAdvisor(true)}
                className="btn-secondary"
                style={{ padding: '4px 10px', fontSize: '11.5px' }}
              >
                Reassign Advisor
              </button>
            ) : (
              <div style={{ display: 'flex', gap: 6 }}>
                <button
                  type="button"
                  onClick={handleSaveAdvisor}
                  className="btn-primary"
                  style={{ padding: '4px 10px', fontSize: '11.5px' }}
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingAdvisor(false)}
                  className="btn-ghost"
                  style={{ padding: '4px 10px', fontSize: '11.5px' }}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '10px 12px', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Assigned Academic Advisor</div>
              {!isEditingAdvisor ? (
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--cyan)', marginTop: 2 }}>
                  {student.advisorName}
                </div>
              ) : (
                <select
                  value={selectedAdvisorId}
                  onChange={(e) => setSelectedAdvisorId(e.target.value)}
                  className="form-select"
                  style={{ marginTop: 4, padding: '4px 8px', fontSize: '12px' }}
                >
                  {facultyList.map((f) => (
                    <option key={f.id} value={f.id}>{f.name} ({f.department})</option>
                  ))}
                </select>
              )}
            </div>

            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '10px 12px', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Course Instructor</div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)', marginTop: 2 }}>
                {student.assignedTeacherName || 'Dr. Karthik Rao'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
