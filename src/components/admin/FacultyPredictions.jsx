import React from 'react';
import { facultyService } from '../../services/facultyService';
import { StatusBadge } from '../common/PriorityBadge';
import { BrainCircuit, AlertTriangle, CheckCircle2, ShieldAlert, Sparkles, ArrowRight } from 'lucide-react';

export function FacultyPredictions({ onNavigate }) {
  const facultyList = facultyService.getAllFaculty();

  return (
    <div>
      <div className="hero-banner">
        <div className="hero-content">
          <h2>Predictive Intelligence & Faculty Retention Risk</h2>
          <p>
            Early risk detection model predicts faculty overload, burnout velocity, and retention risk before attrition occurs. Transparent factors highlight actionable rebalancing interventions.
          </p>
          <div className="hero-actions">
            <button className="btn-white" onClick={() => onNavigate('workload')}>
              ⚡ Go to Smart Workload Optimizer
            </button>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {facultyList.map((f) => {
          const isHigh = f.retentionRisk === 'High';
          const isMed = f.retentionRisk === 'Medium';

          return (
            <div
              key={f.id}
              className="glass-card"
              style={{
                borderLeft: isHigh ? '4px solid var(--red)' : isMed ? '4px solid var(--orange)' : '4px solid var(--green)',
                padding: '20px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10, marginBottom: 14 }}>
                <div>
                  <h3 style={{ margin: '0 0 3px', fontSize: '17px', fontWeight: 800 }}>{f.name}</h3>
                  <div style={{ fontSize: '12.5px', color: 'var(--cyan)' }}>
                    {f.role} · Department of {f.department} · {f.studentsAssigned} advisees ({f.workloadPercent}% load)
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>Retention Risk:</span>
                  <StatusBadge status={isHigh ? 'at risk' : isMed ? 'monitor' : 'healthy'} />
                </div>
              </div>

              {/* Transparent Contributing Factors */}
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '14px', borderRadius: 'var(--radius-md)', marginBottom: 12 }}>
                <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-dim)', letterSpacing: '0.6px', marginBottom: 8 }}>
                  Transparent Model Contributing Factors:
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10, fontSize: '12px' }}>
                  <div style={{ color: f.workloadPercent > 90 ? 'var(--red)' : 'var(--text-muted)' }}>
                    <b>Advising Workload:</b> {f.retentionFactors?.workload || `${f.workloadPercent}%`}
                  </div>
                  <div style={{ color: isHigh ? 'var(--orange)' : 'var(--text-muted)' }}>
                    <b>Response SLA Trend:</b> {f.retentionFactors?.slaDecay || 'Within normal SLA limits'}
                  </div>
                  <div style={{ color: 'var(--text-muted)' }}>
                    <b>Student Engagement:</b> {f.retentionFactors?.studentEngagement || 'Healthy'}
                  </div>
                  <div style={{ color: 'var(--text-muted)' }}>
                    <b>Leave Frequency:</b> {f.retentionFactors?.leaveFrequency || 'Normal'}
                  </div>
                </div>
              </div>

              {/* Actionable Prescriptive Recommendation */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '12.5px' }}>
                  <Sparkles size={16} style={{ color: 'var(--cyan)', flexShrink: 0 }} />
                  <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>
                    <b>Recommendation:</b> {f.recommendation}
                  </span>
                </div>

                {isHigh && (
                  <button onClick={() => onNavigate('workload')} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }}>
                    Rebalance Caseload →
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
