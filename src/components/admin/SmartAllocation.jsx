import React, { useState, useEffect } from 'react';
import { allocationService } from '../../services/allocationService';
import { useToast } from '../../context/ToastContext';
import { StatusBadge } from '../common/PriorityBadge';
import {
  Scale,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  TrendingDown,
  Clock,
  ShieldAlert
} from 'lucide-react';

export function SmartAllocation() {
  const toast = useToast();
  const [advisors, setAdvisors] = useState([]);
  const [optimizationResult, setOptimizationResult] = useState(null);
  const [hasApplied, setHasApplied] = useState(false);

  const loadData = () => {
    setAdvisors(allocationService.getAdvisors());
    setOptimizationResult(null);
    setHasApplied(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRunOptimization = () => {
    const result = allocationService.calculateOptimization();
    setOptimizationResult(result);
    toast.info('Smart optimization calculated. Review recommendations below.');
  };

  const handleApplyOptimization = () => {
    if (!optimizationResult) return;
    try {
      allocationService.applyOptimization(optimizationResult.advisors);
      setHasApplied(true);
      setAdvisors(allocationService.getAdvisors());
      toast.success('Workload balance applied to active institutional database!');
    } catch (e) {
      toast.error('Failed to apply optimization');
    }
  };

  const overloadedCount = advisors.filter((a) => a.workload > 90).length;

  return (
    <div>
      {/* Hero Banner */}
      <div className="hero-banner">
        <div className="hero-content">
          <h2>Smart Advisor Workload & Capacity Optimizer</h2>
          <p>
            Automated, capacity-aware advising load balancing prevents faculty burnout, reduces student SLA response times, and maintains NBA 1:60 accreditation advisor ratios.
          </p>
          <div className="hero-actions">
            <button className="btn-white" onClick={handleRunOptimization}>
              <Sparkles size={16} /> ⚡ Calculate Capacity Optimization
            </button>
            <button className="btn-ghost" onClick={loadData}>
              Reset Live View
            </button>
          </div>
        </div>
      </div>

      {/* Overview Metric Row */}
      <div className="cards-grid">
        <div className="glass-card">
          <div className="metric-label">Active Advisors</div>
          <div className="metric-value">{advisors.length}</div>
          <div className="metric-delta delta-neutral">Across 4 Engineering Departments</div>
        </div>

        <div className="glass-card">
          <div className="metric-label">Overloaded Advisors (&gt;90%)</div>
          <div className="metric-value" style={{ color: overloadedCount > 0 ? 'var(--red)' : 'var(--green)' }}>
            {overloadedCount}
          </div>
          <div className="metric-delta delta-down">
            {overloadedCount > 0 ? 'Urgent rebalancing required' : 'All within healthy range'}
          </div>
        </div>

        <div className="glass-card">
          <div className="metric-label">Target Max Caseload</div>
          <div className="metric-value">85%</div>
          <div className="metric-delta delta-up">Optimal SLA & mentoring band</div>
        </div>

        <div className="glass-card">
          <div className="metric-label">Accreditation Health</div>
          <div className="metric-value">94%</div>
          <div className="metric-delta delta-up">NBA / NAAC Compliance Tier 1</div>
        </div>
      </div>

      {/* Optimization Recommendation Banner (when calculated) */}
      {optimizationResult && (
        <div
          className="glass-card"
          style={{
            marginBottom: 24,
            borderLeft: '4px solid var(--green)',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(12, 25, 45, 0.9))'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <CheckCircle2 size={20} style={{ color: 'var(--green)' }} />
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800 }}>
                Optimization Proposed: {optimizationResult.totalMoved} Students Reassigned
              </h3>
            </div>

            {!hasApplied ? (
              <button onClick={handleApplyOptimization} className="btn-primary" style={{ background: 'linear-gradient(135deg, #059669, #10b981)' }}>
                <CheckCircle2 size={16} /> Approve & Apply Optimization →
              </button>
            ) : (
              <span className="badge badge-success" style={{ padding: '6px 14px', fontSize: '12px' }}>
                Applied to Live System ✓
              </span>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 14 }}>
            <div className="glass-card" style={{ padding: '12px', background: 'rgba(0,0,0,0.2)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Estimated SLA Response Gain</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--green)', marginTop: 2 }}>
                {optimizationResult.estimatedResponseTimeImprovement}
              </div>
            </div>
            <div className="glass-card" style={{ padding: '12px', background: 'rgba(0,0,0,0.2)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Caseload Variance Reduction</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--cyan)', marginTop: 2 }}>
                {optimizationResult.capacityImprovement}
              </div>
            </div>
          </div>

          {/* Reassignment specific details */}
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px 16px', borderRadius: 'var(--radius-md)' }}>
            <b style={{ fontSize: '12.5px', color: 'var(--text-main)' }}>Recommended Advisee Reassignments:</b>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
              {optimizationResult.reassignments.map((re, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '12px', color: 'var(--text-muted)' }}>
                  <ArrowRight size={14} style={{ color: 'var(--green)' }} />
                  <span>
                    Move <b>{re.count} advisees</b> from <span style={{ color: 'var(--red)', fontWeight: 700 }}>{re.fromAdvisor}</span> to <span style={{ color: 'var(--green)', fontWeight: 700 }}>{re.toAdvisor}</span> ({re.department})
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Caseload Comparison Table */}
      <div className="glass-card table-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 800 }}>Faculty Advisor Caseload Ledger</h3>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            {optimizationResult ? 'Before vs. After Optimization Simulation' : 'Current Active State'}
          </span>
        </div>

        <table className="custom-table">
          <thead>
            <tr>
              <th>Advisor</th>
              <th>Department</th>
              <th>Current Advisees</th>
              <th>Capacity Cap</th>
              <th>Current Load</th>
              {optimizationResult && <th>Optimized Advisees</th>}
              {optimizationResult && <th>Optimized Load</th>}
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {(optimizationResult ? optimizationResult.advisors : advisors).map((adv) => {
              const curLoad = adv.beforeLoad !== undefined ? adv.beforeLoad : adv.workload;
              const afterLoad = adv.afterLoad;
              const isOverloaded = curLoad > 90;

              return (
                <tr key={adv.id} style={{ background: optimizationResult && adv.beforeStudents !== adv.afterStudents ? 'rgba(16, 185, 129, 0.04)' : 'transparent' }}>
                  <td>
                    <b>{adv.name}</b>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ID: {adv.id}</div>
                  </td>
                  <td>{adv.department}</td>
                  <td>
                    <b>{adv.beforeStudents !== undefined ? adv.beforeStudents : adv.students}</b>
                  </td>
                  <td>{adv.capacity}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div className="progress-track" style={{ width: '80px', height: 6 }}>
                        <div
                          className={`progress-fill ${curLoad > 90 ? 'red' : curLoad >= 70 ? 'orange' : 'green'}`}
                          style={{ width: `${Math.min(100, curLoad)}%` }}
                        />
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: isOverloaded ? 'var(--red)' : 'inherit' }}>
                        {curLoad}%
                      </span>
                    </div>
                  </td>

                  {optimizationResult && (
                    <td>
                      <b style={{ color: adv.beforeStudents !== adv.afterStudents ? 'var(--green)' : 'inherit' }}>
                        {adv.afterStudents}
                      </b>
                      {adv.beforeStudents !== adv.afterStudents && (
                        <span style={{ fontSize: '10.5px', marginLeft: 4, color: adv.afterStudents < adv.beforeStudents ? 'var(--green)' : 'var(--cyan)' }}>
                          ({adv.afterStudents - adv.beforeStudents > 0 ? `+${adv.afterStudents - adv.beforeStudents}` : adv.afterStudents - adv.beforeStudents})
                        </span>
                      )}
                    </td>
                  )}

                  {optimizationResult && (
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div className="progress-track" style={{ width: '80px', height: 6 }}>
                          <div
                            className={`progress-fill ${afterLoad > 90 ? 'red' : afterLoad >= 70 ? 'orange' : 'green'}`}
                            style={{ width: `${Math.min(100, afterLoad)}%` }}
                          />
                        </div>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--green)' }}>
                          {afterLoad}%
                        </span>
                      </div>
                    </td>
                  )}

                  <td>
                    <StatusBadge status={isOverloaded ? 'at risk' : curLoad >= 70 ? 'monitor' : 'healthy'} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
