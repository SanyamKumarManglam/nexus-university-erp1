import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { RadialProgress } from '../common/RadialProgress';
import { StatusBadge } from '../common/PriorityBadge';
import { TrendingUp, Sparkles, Award, BookOpen, CheckCircle2, ShieldCheck } from 'lucide-react';

export function StudentPerformanceView() {
  const { currentUser } = useAuth();
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const allStudents = storageService.getStudents();
    const cur = allStudents.find((s) => s.id === currentUser?.id || s.name === currentUser?.name) || allStudents[0];
    setStudent(cur);
  }, [currentUser]);

  if (!student) return null;

  const breakdown = student.indexBreakdown || {
    attendance: 94,
    performance: 86,
    engagement: 90,
    assignments: 85,
    reviews: 85
  };

  return (
    <div>
      <div className="hero-banner">
        <div className="hero-content">
          <h2>Student Index & Academic Standing</h2>
          <p>
            The NEXUS Student Index is a multi-dimensional composite indicator combining lecture engagement, assignment mastery, exam performance, and advisor interactions.
          </p>
        </div>
      </div>

      <div className="grid-2">
        {/* Left: Big Radial Gauge */}
        <div className="glass-card" style={{ textAlign: 'center', padding: '30px 20px' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: '17px', fontWeight: 800 }}>
            Composite Student Index
          </h3>

          <RadialProgress value={student.studentIndex} size={150} strokeWidth={13} sublabel="/ 100" />

          <div style={{ marginTop: 14 }}>
            <StatusBadge status={student.riskLevel.toLowerCase()} />
          </div>

          <p style={{ margin: '14px 0 0', fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: 1.5, maxWidth: '340px', marginInline: 'auto' }}>
            Your composite score places you in the <b>{student.riskLevel}</b> academic band. Keep up consistent lab submissions and classroom participation.
          </p>
        </div>

        {/* Right: Detailed Factor Breakdown */}
        <div className="glass-card">
          <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 800 }}>
            Weighted Factor Breakdown
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: 4 }}>
                <span style={{ fontWeight: 600 }}>Lecture & Lab Attendance</span>
                <b style={{ color: 'var(--cyan)' }}>{breakdown.attendance}%</b>
              </div>
              <div className="progress-track" style={{ height: 8 }}>
                <div className="progress-fill green" style={{ width: `${breakdown.attendance}%` }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: 4 }}>
                <span style={{ fontWeight: 600 }}>Academic Examination Performance</span>
                <b style={{ color: 'var(--cyan)' }}>{breakdown.performance}%</b>
              </div>
              <div className="progress-track" style={{ height: 8 }}>
                <div className="progress-fill green" style={{ width: `${breakdown.performance}%` }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: 4 }}>
                <span style={{ fontWeight: 600 }}>Assignment & Project Completion</span>
                <b style={{ color: 'var(--cyan)' }}>{breakdown.assignments}%</b>
              </div>
              <div className="progress-track" style={{ height: 8 }}>
                <div className="progress-fill orange" style={{ width: `${breakdown.assignments}%` }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: 4 }}>
                <span style={{ fontWeight: 600 }}>Classroom Participation & Engagement</span>
                <b style={{ color: 'var(--cyan)' }}>{breakdown.engagement}%</b>
              </div>
              <div className="progress-track" style={{ height: 8 }}>
                <div className="progress-fill green" style={{ width: `${breakdown.engagement}%` }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: 4 }}>
                <span style={{ fontWeight: 600 }}>Faculty Feedback & Peer Reviews</span>
                <b style={{ color: 'var(--cyan)' }}>{breakdown.reviews}%</b>
              </div>
              <div className="progress-track" style={{ height: 8 }}>
                <div className="progress-fill green" style={{ width: `${breakdown.reviews}%` }} />
              </div>
            </div>
          </div>

          <div style={{ marginTop: 20, padding: '12px', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-md)', fontSize: '11px', color: 'var(--text-dim)' }}>
            ℹ Purpose: The Student Index is designed solely for early intervention and tailored academic guidance.
          </div>
        </div>
      </div>
    </div>
  );
}
