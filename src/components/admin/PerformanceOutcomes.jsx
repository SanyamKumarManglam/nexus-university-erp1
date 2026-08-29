import React from 'react';
import { facultyService } from '../../services/facultyService';
import { useToast } from '../../context/ToastContext';
import { TrendingUp, Award, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

export function PerformanceOutcomes() {
  const toast = useToast();
  const facultyList = facultyService.getAllFaculty();

  const handleCreateActionPlan = () => {
    toast.success('Action plan generated for ECE Section B and assigned to Department Chair.');
  };

  return (
    <div>
      <div className="hero-banner">
        <div className="hero-content">
          <h2>Faculty Performance & Learning Outcomes</h2>
          <p>
            Correlate faculty pedagogical activity with actual student outcome metrics, course completion benchmarks, and student satisfaction index.
          </p>
        </div>
      </div>

      <div className="cards-grid">
        <div className="glass-card">
          <div className="metric-label">Institutional Attendance</div>
          <div className="metric-value">91%</div>
          <div className="metric-delta delta-up">↑ 3% this month</div>
        </div>

        <div className="glass-card">
          <div className="metric-label">Course Completion</div>
          <div className="metric-value">94%</div>
          <div className="metric-delta delta-up">↑ 8% this term</div>
        </div>

        <div className="glass-card">
          <div className="metric-label">Student Satisfaction</div>
          <div className="metric-value">4.6 / 5</div>
          <div className="metric-delta delta-up">Based on 2,048 responses</div>
        </div>

        <div className="glass-card">
          <div className="metric-label">Teaching Index</div>
          <div className="metric-value">89 / 100</div>
          <div className="metric-delta delta-up">Healthy Band</div>
        </div>
      </div>

      <div className="grid-2">
        {/* Outcome Scorecard Table */}
        <div className="glass-card table-container">
          <h3 style={{ margin: '0 0 14px', fontSize: '15px', fontWeight: 800 }}>
            Faculty Outcome Scorecard
          </h3>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Faculty</th>
                <th>Student Success</th>
                <th>Course Completion</th>
                <th>Excellence Score</th>
              </tr>
            </thead>
            <tbody>
              {facultyList.slice(0, 6).map((f) => (
                <tr key={f.id}>
                  <td>
                    <b>{f.name}</b>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{f.department}</div>
                  </td>
                  <td><b>{f.studentSuccessScore}%</b></td>
                  <td><b>{Math.min(99, f.studentSuccessScore + 5)}%</b></td>
                  <td>
                    <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--cyan)', fontFamily: 'var(--font-mono)' }}>
                      {f.performanceScore}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* AI Action Center */}
        <div className="glass-card">
          <h3 style={{ margin: '0 0 14px', fontSize: '15px', fontWeight: 800 }}>
            AI Pedagogy Action Center
          </h3>

          <div className="insight-card">
            <div className="insight-dot" style={{ background: 'var(--orange)' }} />
            <div className="insight-content">
              <b>Section-Level Engagement Disparity</b>
              <p>ECE Section B assignment completion is 12% below department average. Recommend flipped classroom modules.</p>
            </div>
          </div>

          <div className="insight-card">
            <div className="insight-dot" style={{ background: 'var(--green)' }} />
            <div className="insight-content">
              <b>High Placement Preparedness in CSE</b>
              <p>Machine Learning course practical assessments completed at 96% accuracy across Section 3A.</p>
            </div>
          </div>

          <button onClick={handleCreateActionPlan} className="btn-secondary" style={{ width: '100%', justifyContent: 'center', marginTop: 12 }}>
            <Sparkles size={16} /> Create Departmental Action Plan
          </button>
        </div>
      </div>
    </div>
  );
}
