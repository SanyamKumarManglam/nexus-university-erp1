import React, { useState, useEffect } from 'react';
import { onboardingService } from '../../services/onboardingService';
import { onboardingStepsList } from '../../data/mockOnboarding';
import { useToast } from '../../context/ToastContext';
import { StatusBadge } from '../common/PriorityBadge';
import {
  UserCheck,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  FileText,
  User,
  Calendar,
  Sparkles,
  Award
} from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export function FacultyOnboarding({ onNavigate }) {
  const toast = useToast();
  const [onboardingList, setOnboardingList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const loadData = () => {
    const list = onboardingService.getAllOnboarding();
    setOnboardingList(list);
  };

  useEffect(() => {
    loadData();
  }, []);

  const currentCandidate = onboardingList[currentIndex] || null;

  const handleToggleStep = (stepId) => {
    if (!currentCandidate) return;
    try {
      onboardingService.toggleStep(currentCandidate.id, stepId);
      loadData();
      toast.info(`Milestone ${stepId} updated`);
    } catch (e) {
      toast.error('Failed to update step');
    }
  };

  const handleCompleteOnboarding = () => {
    if (!currentCandidate) return;
    try {
      onboardingService.completeOnboarding(currentCandidate.id);
      loadData();
      toast.success(`${currentCandidate.candidateName} promoted to Active Faculty Directory!`);
    } catch (e) {
      toast.error('Failed to complete onboarding');
    }
  };

  const handleLanguageChange = (e) => {
    if (!currentCandidate) return;
    onboardingService.updateLanguage(currentCandidate.id, e.target.value);
    loadData();
    toast.info(`Preferred orientation language updated to ${e.target.value}`);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : onboardingList.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < onboardingList.length - 1 ? prev + 1 : 0));
  };

  if (!currentCandidate) {
    return (
      <div className="glass-card" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <UserCheck size={48} style={{ color: 'var(--cyan)', margin: '0 auto 16px' }} />
        <h3>No Candidates in Active Onboarding</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '13px', maxWidth: '400px', margin: '0 auto 20px' }}>
          When candidates are hired in the Recruitment module, an onboarding workflow is automatically spawned.
        </p>
        <button className="btn-primary" onClick={() => onNavigate('recruit')}>
          Go to Recruitment Hub →
        </button>
      </div>
    );
  }

  const isAllComplete = currentCandidate.completedSteps.length === 10;

  return (
    <div>
      {/* Hero Banner */}
      <div className="hero-banner">
        <div className="hero-content">
          <h2>Faculty Onboarding & Institutional Induction</h2>
          <p>
            Structured 10-step institutional onboarding pipeline ensuring KYC compliance, pedagogical training, digital workspace setup, and senior mentor pairing.
          </p>
          <div className="hero-actions">
            <button className="btn-white" onClick={() => onNavigate('faculty')}>
              View Active Faculty Directory →
            </button>
          </div>
        </div>
      </div>

      {/* Candidate Navigation Header Bar */}
      <div className="glass-card" style={{ marginBottom: 20, padding: '14px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
              Candidate <b>{currentIndex + 1}</b> of <b>{onboardingList.length}</b>
            </span>
            <div style={{ display: 'flex', gap: 6 }}>
              <button onClick={handlePrev} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }}>
                <ChevronLeft size={15} /> Previous Candidate
              </button>
              <button onClick={handleNext} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }}>
                Next Candidate <ChevronRight size={15} />
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Preferred Language:</span>
            <select
              value={currentCandidate.preferredLanguage || 'English'}
              onChange={handleLanguageChange}
              className="form-select"
              style={{ width: '130px', padding: '6px 10px', fontSize: '12px' }}
            >
              <option value="English">English</option>
              <option value="Hindi">हिंदी (Hindi)</option>
              <option value="Tamil">தமிழ் (Tamil)</option>
              <option value="Telugu">తెలుగు (Telugu)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Candidate Card & Journey */}
      <div className="grid-2">
        {/* Left: Candidate Milestone Checklist */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <div>
              <h3 style={{ margin: '0 0 4px', fontSize: '19px', fontWeight: 800 }}>
                {currentCandidate.candidateName}
              </h3>
              <div style={{ fontSize: '13px', color: 'var(--cyan)', fontWeight: 600 }}>
                {currentCandidate.department} · {currentCandidate.role}
              </div>
              <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: 4 }}>
                Assigned HR: <b>{currentCandidate.assignedHR}</b> · Mentor: <b>{currentCandidate.assignedMentor}</b>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--cyan)', fontFamily: 'var(--font-mono)', lineHeight: 1 }}>
                {currentCandidate.progressPercent}%
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: 2 }}>
                {currentCandidate.completedSteps.length} of 10 Steps
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="progress-track" style={{ height: 10, marginBottom: 20 }}>
            <div
              className={`progress-fill ${currentCandidate.progressPercent >= 80 ? 'green' : 'orange'}`}
              style={{ width: `${currentCandidate.progressPercent}%` }}
            />
          </div>

          {/* 10 Milestone Steps Checkboxes */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {onboardingStepsList.map((step) => {
              const isChecked = currentCandidate.completedSteps.includes(step.id);

              return (
                <label
                  key={step.id}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 12,
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    background: isChecked ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                    border: isChecked ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleToggleStep(step.id)}
                    style={{ marginTop: 3, width: 16, height: 16, accentColor: 'var(--cyan)', cursor: 'pointer' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <b style={{ fontSize: '12.5px', color: isChecked ? 'var(--text-main)' : 'var(--text-muted)' }}>
                        {step.id}. {step.title}
                      </b>
                      {isChecked && <CheckCircle2 size={14} style={{ color: 'var(--green)' }} />}
                    </div>
                    <p style={{ margin: '2px 0 0', fontSize: '11.5px', color: 'var(--text-dim)' }}>
                      {step.description}
                    </p>
                  </div>
                </label>
              );
            })}
          </div>

          {/* Finalize Button */}
          <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Target Due Date: <b>{formatDate(currentCandidate.dueDate)}</b>
            </span>

            <button
              onClick={handleCompleteOnboarding}
              disabled={isAllComplete && currentCandidate.status === 'Completed'}
              className="btn-primary"
              style={{
                background: currentCandidate.status === 'Completed'
                  ? 'rgba(16, 185, 129, 0.2)'
                  : 'linear-gradient(135deg, #059669, #10b981)'
              }}
            >
              <Award size={16} />
              {currentCandidate.status === 'Completed' ? 'Onboarding Completed ✓' : 'Mark Onboarding Complete →'}
            </button>
          </div>
        </div>

        {/* Right: Onboarding Journey Timeline & Missing Documents */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Missing Documents Warning Card */}
          <div className="glass-card">
            <h4 style={{ margin: '0 0 10px', fontSize: '14px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
              <FileText size={16} style={{ color: 'var(--orange)' }} />
              Document Compliance & Verification
            </h4>

            {currentCandidate.missingDocuments && currentCandidate.missingDocuments.length > 0 ? (
              <div style={{ background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.25)', borderRadius: 'var(--radius-md)', padding: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '12px', color: 'var(--orange)', fontWeight: 700, marginBottom: 6 }}>
                  <AlertCircle size={14} /> Pending Compliance Documents:
                </div>
                <ul style={{ margin: '0 0 0 18px', fontSize: '12px', color: 'var(--text-muted)' }}>
                  {currentCandidate.missingDocuments.map((doc, idx) => (
                    <li key={idx}>{doc}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: 'var(--radius-md)', padding: '12px', fontSize: '12px', color: 'var(--green)' }}>
                <CheckCircle2 size={16} /> All statutory and academic credentials verified.
              </div>
            )}
          </div>

          {/* Journey Timeline */}
          <div className="glass-card">
            <h4 style={{ margin: '0 0 14px', fontSize: '14px', fontWeight: 700 }}>
              Onboarding Journey Milestones
            </h4>

            <div style={{ borderLeft: '2px solid rgba(0, 169, 224, 0.3)', marginLeft: 8, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: -24, top: 4, width: 10, height: 10, borderRadius: '50%', background: 'var(--cyan)', boxShadow: '0 0 8px var(--cyan)' }} />
                <b style={{ fontSize: '12.5px' }}>KYC & Academic Verification</b>
                <div style={{ fontSize: '11px', color: 'var(--green)' }}>Completed · Verified</div>
              </div>

              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: -24, top: 4, width: 10, height: 10, borderRadius: '50%', background: currentCandidate.completedSteps.includes(6) ? 'var(--cyan)' : 'var(--text-dim)' }} />
                <b style={{ fontSize: '12.5px' }}>LMS Setup & Course Allotment</b>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  {currentCandidate.completedSteps.includes(6) ? 'Completed' : 'Pending Action'}
                </div>
              </div>

              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: -24, top: 4, width: 10, height: 10, borderRadius: '50%', background: currentCandidate.completedSteps.includes(8) ? 'var(--cyan)' : 'var(--text-dim)' }} />
                <b style={{ fontSize: '12.5px' }}>Department Senior Mentorship</b>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Assigned to {currentCandidate.assignedMentor}
                </div>
              </div>

              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: -24, top: 4, width: 10, height: 10, borderRadius: '50%', background: isAllComplete ? 'var(--green)' : 'var(--text-dim)' }} />
                <b style={{ fontSize: '12.5px' }}>Dean & Academic Council Final Sign-Off</b>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  {isAllComplete ? 'Approved for Faculty Directory' : 'Pending Step 10 Completion'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
