import React from 'react';
import { Modal } from '../common/Modal';
import { StatusBadge } from '../common/PriorityBadge';
import { RadialProgress } from '../common/RadialProgress';
import { User, Mail, Phone, Calendar, Briefcase, GraduationCap, Sparkles, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export function CandidateDetailModal({ candidate, isOpen, onClose, onUpdateStatus, onHire }) {
  if (!candidate) return null;

  const assessment = candidate.aiAssessment || {
    matchPercent: candidate.matchScore || 85,
    strengths: ['Relevant domain experience', 'Strong academic qualification'],
    concerns: ['Orientation required for institutional workflow'],
    recommendation: 'Recommended for interview evaluation.'
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Candidate Profile & AI Match Intelligence" maxWidth="720px">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Candidate Header Summary */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', background: 'rgba(0, 169, 224, 0.06)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '16px' }}>
          <div>
            <h3 style={{ margin: '0 0 4px', fontSize: '18px', fontWeight: 800 }}>{candidate.name}</h3>
            <div style={{ fontSize: '13px', color: 'var(--cyan)', fontWeight: 600 }}>{candidate.position}</div>
            <div style={{ display: 'flex', gap: 14, marginTop: 8, fontSize: '12px', color: 'var(--text-muted)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Mail size={13} /> {candidate.email}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Phone size={13} /> {candidate.phone}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Calendar size={13} /> Applied: {formatDate(candidate.applicationDate)}</span>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ marginBottom: 4 }}>
              <StatusBadge status={candidate.status} />
            </div>
            <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>ID: {candidate.id}</span>
          </div>
        </div>

        {/* AI Candidate Match Score Box */}
        <div style={{ background: 'linear-gradient(135deg, rgba(12, 25, 45, 0.9), rgba(20, 35, 60, 0.9))', border: '1px solid rgba(0, 210, 255, 0.3)', borderRadius: 'var(--radius-lg)', padding: '18px 20px', boxShadow: 'var(--shadow-glow)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Sparkles size={18} style={{ color: 'var(--cyan)' }} />
              <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: 'var(--text-main)' }}>
                NEXUS AI Candidate Match Assessment
              </h4>
            </div>
            <span style={{ fontSize: '11px', background: 'rgba(0,210,255,0.15)', color: 'var(--cyan)', padding: '2px 8px', borderRadius: 'var(--radius-full)', fontWeight: 700 }}>
              Algorithmic Recommendation
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr', gap: 18, alignItems: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <RadialProgress value={assessment.matchPercent} size={90} strokeWidth={8} sublabel="Suitability" />
            </div>

            <div>
              <div style={{ marginBottom: 8 }}>
                <b style={{ fontSize: '12px', color: 'var(--green)' }}>Key Strengths:</b>
                <ul style={{ margin: '4px 0 0 16px', fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  {assessment.strengths.map((st, i) => (
                    <li key={i}>{st}</li>
                  ))}
                </ul>
              </div>

              {assessment.concerns && assessment.concerns.length > 0 && (
                <div>
                  <b style={{ fontSize: '12px', color: 'var(--orange)' }}>Potential Concerns & Onboarding Focus:</b>
                  <ul style={{ margin: '4px 0 0 16px', fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                    {assessment.concerns.map((cn, i) => (
                      <li key={i}>{cn}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.08)', fontSize: '11px', color: 'var(--text-dim)', fontStyle: 'italic' }}>
            ⚠ Important Notice: The AI Match score is an automated decision-support indicator based on resume keywords, academic tenure, and publication metrics. The final selection and hiring authority rests solely with the University Selection Committee.
          </div>
        </div>

        {/* Academic & Professional Details Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div className="glass-card" style={{ padding: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '12.5px', fontWeight: 700, color: 'var(--text-main)', marginBottom: 8 }}>
              <GraduationCap size={16} style={{ color: 'var(--cyan)' }} />
              <span>Qualification & Background</span>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              <div><b>Degree:</b> {candidate.qualification}</div>
              <div><b>Department:</b> {candidate.department}</div>
              <div><b>Experience:</b> {candidate.experience} years teaching/research</div>
              <div><b>Age:</b> {candidate.age} years</div>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '12.5px', fontWeight: 700, color: 'var(--text-main)', marginBottom: 8 }}>
              <Briefcase size={16} style={{ color: 'var(--purple-light)' }} />
              <span>Core Specializations & Skills</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {candidate.skills.map((skill, i) => (
                <span key={i} className="badge badge-purple" style={{ textTransform: 'none', fontSize: '11px' }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Pipeline Progression Actions */}
        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
          <button
            type="button"
            onClick={() => onUpdateStatus(candidate.id, 'Rejected')}
            className="btn-danger"
          >
            <XCircle size={15} /> Reject Candidate
          </button>

          <div style={{ display: 'flex', gap: 8 }}>
            {candidate.status === 'Applied' && (
              <button
                type="button"
                onClick={() => onUpdateStatus(candidate.id, 'Screening')}
                className="btn-secondary"
              >
                Move to Screening →
              </button>
            )}

            {(candidate.status === 'Applied' || candidate.status === 'Screening') && (
              <button
                type="button"
                onClick={() => onUpdateStatus(candidate.id, 'Shortlisted')}
                className="btn-secondary"
              >
                Shortlist for Interview →
              </button>
            )}

            {candidate.status === 'Shortlisted' && (
              <button
                type="button"
                onClick={() => onUpdateStatus(candidate.id, 'Interview')}
                className="btn-primary"
              >
                Schedule & Move to Interview →
              </button>
            )}

            {candidate.status === 'Interview' && (
              <button
                type="button"
                onClick={() => onUpdateStatus(candidate.id, 'Selected')}
                className="btn-primary"
              >
                Mark Interview Passed & Select →
              </button>
            )}

            {(candidate.status === 'Selected' || candidate.status === 'Interview' || candidate.status === 'Shortlisted') && (
              <button
                type="button"
                onClick={() => onHire(candidate.id)}
                className="btn-primary"
                style={{ background: 'linear-gradient(135deg, #059669, #10b981)' }}
              >
                <CheckCircle2 size={16} /> Hire & Start Onboarding Workflow
              </button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
