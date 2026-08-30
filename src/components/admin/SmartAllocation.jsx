import React, { useState, useEffect } from 'react';
import { allocationService } from '../../services/allocationService';
import { useToast } from '../../context/ToastContext';
import { useCapacity } from '../../context/CapacityContext';
import { StatusBadge } from '../common/PriorityBadge';
import {
  Scale,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  TrendingDown,
  Clock,
  ShieldAlert,
  Sliders,
  RotateCcw,
  Info,
  Check
} from 'lucide-react';

export function SmartAllocation() {
  const toast = useToast();
  const { capacityCap, isCustom, setCapacityCap, resetCapacityCap, validateCapInput } = useCapacity();

  const [advisors, setAdvisors] = useState([]);
  const [optimizationResult, setOptimizationResult] = useState(null);
  const [hasApplied, setHasApplied] = useState(false);

  // Local state for capacity cap input
  const [inputCap, setInputCap] = useState(capacityCap ? String(capacityCap) : '');
  const [inputError, setInputError] = useState('');

  // Keep input synchronized with global capacityCap
  useEffect(() => {
    setInputCap(capacityCap ? String(capacityCap) : '');
    setInputError('');
  }, [capacityCap]);

  const loadData = () => {
    setAdvisors(allocationService.getAdvisors(capacityCap));
    setOptimizationResult(null);
    setHasApplied(false);
  };

  // Reload data when active capacityCap changes
  useEffect(() => {
    setAdvisors(allocationService.getAdvisors(capacityCap));
    if (optimizationResult) {
      // Recalculate optimization immediately with new capacity cap
      const updatedOpt = allocationService.calculateOptimization(capacityCap);
      setOptimizationResult(updatedOpt);
    }
  }, [capacityCap]);

  const handleApplyCap = (e) => {
    if (e) e.preventDefault();
    const check = validateCapInput(inputCap);
    if (!check.isValid) {
      setInputError(check.message);
      toast.error(check.message);
      return;
    }

    setInputError('');
    const res = setCapacityCap(inputCap);
    if (res.success) {
      toast.success(`Capacity Cap updated to ${res.value} advisees per faculty member.`);
    }
  };

  const handleResetCap = () => {
    resetCapacityCap();
    setInputCap('');
    setInputError('');
    toast.info('Capacity Cap reset to individual benchmark defaults.');
  };

  const handlePresetCap = (val) => {
    setInputCap(String(val));
    setInputError('');
    const res = setCapacityCap(val);
    if (res.success) {
      toast.success(`Applied ${val} advisees Capacity Cap preset.`);
    }
  };

  const handleRunOptimization = () => {
    const result = allocationService.calculateOptimization(capacityCap);
    setOptimizationResult(result);
    toast.info('Smart capacity optimization calculated. Review recommendations below.');
  };

  const handleApplyOptimization = () => {
    if (!optimizationResult) return;
    try {
      allocationService.applyOptimization(optimizationResult.advisors, capacityCap);
      setHasApplied(true);
      setAdvisors(allocationService.getAdvisors(capacityCap));
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

      {/* Capacity Cap Control Panel */}
      <div className="glass-card capacity-cap-card" style={{ marginBottom: 24, border: isCustom ? '1px solid rgba(0, 210, 255, 0.35)' : '1px solid var(--border-subtle)' }}>
        <div className="capacity-cap-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(0, 169, 224, 0.12)', color: 'var(--cyan)' }}>
              <Sliders size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '15.5px', fontWeight: 800 }}>
                Manual Capacity Cap Configuration
              </h3>
              <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>
                Set a uniform maximum advisee ceiling to override individual defaults and rebalance caseloads dynamically.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              className={`badge ${isCustom ? 'badge-primary' : 'badge-neutral'}`}
              style={{
                padding: '6px 14px',
                fontSize: '12px',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              {isCustom ? (
                <>
                  <Check size={14} style={{ color: 'var(--cyan)' }} /> Active Cap: {capacityCap} advisees
                </>
              ) : (
                'Benchmark Default Active (110–160)'
              )}
            </span>

            {isCustom && (
              <button
                onClick={handleResetCap}
                className="btn-secondary"
                style={{ padding: '6px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: 5 }}
                title="Reset to benchmark default capacities"
              >
                <RotateCcw size={13} /> Reset Default
              </button>
            )}
          </div>
        </div>

        {/* Input Form & Quick Presets */}
        <form onSubmit={handleApplyCap} className="capacity-cap-form" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: '1 1 280px', maxWidth: '420px' }}>
            <label htmlFor="capacity-cap-input" style={{ fontSize: '12.5px', fontWeight: 700, whiteSpace: 'nowrap', color: 'var(--text-main)' }}>
              Capacity Cap (advisees):
            </label>
            <div style={{ position: 'relative', flex: 1 }}>
              <input
                id="capacity-cap-input"
                type="number"
                min="10"
                max="500"
                value={inputCap}
                onChange={(e) => {
                  setInputCap(e.target.value);
                  if (inputError) setInputError('');
                }}
                placeholder="e.g. 120"
                className={`form-input ${inputError ? 'input-error' : ''}`}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '13px'
                }}
              />
            </div>
            <button
              type="submit"
              className="btn-primary"
              style={{ padding: '9px 16px', fontSize: '13px', whiteSpace: 'nowrap' }}
            >
              Apply Cap
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <span style={{ fontSize: '11.5px', color: 'var(--text-dim)', fontWeight: 600 }}>Quick Presets:</span>
            {[100, 120, 140, 150].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => handlePresetCap(val)}
                className={`btn-secondary ${capacityCap === val ? 'preset-active' : ''}`}
                style={{
                  padding: '5px 10px',
                  fontSize: '11.5px',
                  borderRadius: '6px',
                  background: capacityCap === val ? 'rgba(0, 169, 224, 0.2)' : undefined,
                  borderColor: capacityCap === val ? 'var(--cyan)' : undefined,
                  color: capacityCap === val ? 'var(--cyan)' : undefined
                }}
              >
                {val} Cap
              </button>
            ))}
          </div>
        </form>

        {inputError && (
          <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 6, color: 'var(--red)', fontSize: '12px' }}>
            <AlertTriangle size={14} />
            <span>{inputError}</span>
          </div>
        )}
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
          <div className="metric-label">Active Capacity Cap</div>
          <div className="metric-value" style={{ color: isCustom ? 'var(--cyan)' : 'inherit' }}>
            {isCustom ? `${capacityCap}` : 'Default'}
          </div>
          <div className="metric-delta delta-up">
            {isCustom ? 'Manual ceiling applied' : '110–160 benchmark range'}
          </div>
        </div>

        <div className="glass-card">
          <div className="metric-label">Accreditation Health</div>
          <div className="metric-value">
            {overloadedCount === 0 ? '98%' : overloadedCount <= 2 ? '94%' : '86%'}
          </div>
          <div className="metric-delta delta-up">
            {overloadedCount === 0 ? 'Optimal Compliance' : 'NBA / NAAC Compliance Tier 1'}
          </div>
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <CheckCircle2 size={20} style={{ color: 'var(--green)' }} />
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800 }}>
                Optimization Proposed: {optimizationResult.totalMoved} Students Reassigned
                {optimizationResult.capacityCapUsed && (
                  <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--cyan)', marginLeft: 8 }}>
                    (Simulated at {optimizationResult.capacityCapUsed} capacity cap)
                  </span>
                )}
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
              {optimizationResult.reassignments.length > 0 ? (
                optimizationResult.reassignments.map((re, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '12px', color: 'var(--text-muted)' }}>
                    <ArrowRight size={14} style={{ color: 'var(--green)' }} />
                    <span>
                      Move <b>{re.count} advisees</b> from <span style={{ color: 'var(--red)', fontWeight: 700 }}>{re.fromAdvisor}</span> to <span style={{ color: 'var(--green)', fontWeight: 700 }}>{re.toAdvisor}</span> ({re.department})
                    </span>
                  </div>
                ))
              ) : (
                <div style={{ fontSize: '12px', color: 'var(--green)' }}>
                  All faculty are already operating within target capacity limits. No advisee transfers needed.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Caseload Comparison Table */}
      <div className="glass-card table-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 800 }}>Faculty Advisor Caseload Ledger</h3>
            <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: 2 }}>
              {isCustom ? (
                <span>Evaluated with manual <b>{capacityCap} advisees</b> capacity cap</span>
              ) : (
                <span>Evaluated with individual default capacity benchmarks</span>
              )}
            </div>
          </div>
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
                  <td>
                    <span style={{ fontWeight: 700, color: isCustom ? 'var(--cyan)' : 'inherit' }}>
                      {adv.capacity}
                    </span>
                    {isCustom && (
                      <span style={{ fontSize: '10px', color: 'var(--cyan)', marginLeft: 4 }}>(Cap)</span>
                    )}
                  </td>
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
