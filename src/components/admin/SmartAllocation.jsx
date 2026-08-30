import React, { useState, useEffect } from 'react';
import { allocationService } from '../../services/allocationService';
import { useToast } from '../../context/ToastContext';
import { useCapacity } from '../../context/CapacityContext';
import { useLanguage } from '../../context/LanguageContext';
import { StatusBadge } from '../common/PriorityBadge';
import { Modal } from '../common/Modal';
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
  Check,
  Edit2,
  PlusCircle,
  Users,
  Layers,
  XCircle,
  HelpCircle
} from 'lucide-react';

export function SmartAllocation() {
  const toast = useToast();
  const { t } = useLanguage();
  const {
    facultyCaps,
    globalCapacityCap,
    isCustom,
    getFacultyCap,
    isFacultyCustom,
    setFacultyCap,
    resetFacultyCap,
    resetAllFacultyCaps,
    validateCapInput
  } = useCapacity();

  const [advisors, setAdvisors] = useState([]);
  const [optimizationResult, setOptimizationResult] = useState(null);
  const [hasApplied, setHasApplied] = useState(false);

  // Per-faculty inline editing state
  const [editingFacultyId, setEditingFacultyId] = useState(null);
  const [editCapInput, setEditCapInput] = useState('');
  const [editCapError, setEditCapError] = useState('');

  // Workload allocation modal state
  const [allocatingFaculty, setAllocatingFaculty] = useState(null);
  const [allocateCount, setAllocateCount] = useState(3);
  const [allowOverride, setAllowOverride] = useState(false);
  const [allocateError, setAllocateError] = useState('');

  const loadData = () => {
    setAdvisors(allocationService.getAdvisors(facultyCaps, globalCapacityCap));
    setOptimizationResult(null);
    setHasApplied(false);
  };

  // Reload data when facultyCaps or globalCapacityCap changes
  useEffect(() => {
    setAdvisors(allocationService.getAdvisors(facultyCaps, globalCapacityCap));
    if (optimizationResult) {
      const updatedOpt = allocationService.calculateOptimization(facultyCaps, globalCapacityCap);
      setOptimizationResult(updatedOpt);
    }
  }, [facultyCaps, globalCapacityCap]);

  // Start editing a specific faculty member's cap
  const handleStartEdit = (adv) => {
    setEditingFacultyId(adv.id);
    setEditCapInput(String(adv.capacity));
    setEditCapError('');
  };

  const handleCancelEdit = () => {
    setEditingFacultyId(null);
    setEditCapInput('');
    setEditCapError('');
  };

  // Save manual capacity cap for a specific faculty member
  const handleSaveFacultyCap = (facultyId) => {
    const check = validateCapInput(editCapInput);
    if (!check.isValid) {
      setEditCapError(check.message);
      toast.error(check.message);
      return;
    }

    const res = setFacultyCap(facultyId, editCapInput);
    if (res.success) {
      setEditingFacultyId(null);
      setEditCapInput('');
      setEditCapError('');
      toast.success(t('msg_cap_updated', `Capacity Cap for ${facultyId} updated to ${res.value} advisees.`));
    } else {
      setEditCapError(res.error);
      toast.error(res.error);
    }
  };

  // Reset a specific faculty member's cap to default benchmark
  const handleResetFacultyCap = (facultyId, facultyName) => {
    resetFacultyCap(facultyId);
    toast.info(t('msg_cap_reset', `Capacity Cap for ${facultyName || facultyId} reset to system default.`));
  };

  // Reset all faculty to default benchmarks
  const handleResetAllToDefault = () => {
    resetAllFacultyCaps();
    toast.info(t('msg_all_caps_reset', 'All faculty capacity caps reset to system defaults.'));
  };

  const handleRunOptimization = () => {
    const result = allocationService.calculateOptimization(facultyCaps, globalCapacityCap);
    setOptimizationResult(result);
    toast.info(t('msg_opt_calculated', 'Smart capacity optimization calculated. Review recommendations below.'));
  };

  const handleApplyOptimization = () => {
    if (!optimizationResult) return;
    try {
      allocationService.applyOptimization(optimizationResult.advisors, facultyCaps, globalCapacityCap);
      setHasApplied(true);
      setAdvisors(allocationService.getAdvisors(facultyCaps, globalCapacityCap));
      toast.success(t('msg_opt_applied', 'Workload balance applied to active institutional database!'));
    } catch (e) {
      toast.error(t('msg_opt_error', 'Failed to apply optimization'));
    }
  };

  // Open allocate workload modal
  const handleOpenAllocateModal = (adv) => {
    setAllocatingFaculty(adv);
    setAllocateCount(3);
    setAllowOverride(false);
    setAllocateError('');
  };

  const handleConfirmAllocate = () => {
    if (!allocatingFaculty) return;
    const res = allocationService.allocateWorkload(allocatingFaculty.id, allocateCount, allowOverride);

    if (!res.success) {
      setAllocateError(res.error);
      toast.error(res.error);
      return;
    }

    toast.success(t('msg_workload_allocated', `Allocated +${allocateCount} advisees to ${allocatingFaculty.name}. Remaining capacity: ${res.remainingCapacity}`));
    setAllocatingFaculty(null);
    loadData();
  };

  // Derived metrics
  const overloadedCount = advisors.filter((a) => a.isOverCapacity || a.workload > 85).length;
  const customCapsCount = Object.keys(facultyCaps).length;
  const totalStudents = advisors.reduce((acc, a) => acc + a.students, 0);
  const totalCapacity = advisors.reduce((acc, a) => acc + a.capacity, 0);
  const totalRemaining = totalCapacity - totalStudents;

  return (
    <div>
      {/* Hero Banner */}
      <div className="hero-banner">
        <div className="hero-content">
          <h2>{t('workload_optimizer_title', 'Smart Advisor Workload & Capacity Optimizer')}</h2>
          <p>
            {t(
              'workload_optimizer_desc',
              'Automated, capacity-aware advising load balancing prevents faculty burnout, allows per-faculty capacity caps, and maintains accreditation compliance.'
            )}
          </p>
          <div className="hero-actions">
            <button className="btn-white" onClick={handleRunOptimization} id="btn-run-optimization">
              <Sparkles size={16} /> ⚡ {t('btn_optimize', 'Calculate Capacity Optimization')}
            </button>
            <button className="btn-ghost" onClick={loadData}>
              {t('btn_reset_live_view', 'Reset Live View')}
            </button>
          </div>
        </div>
      </div>

      {/* Global Capacity Cap & Benchmarks Info Card */}
      <div
        className="glass-card capacity-cap-card"
        style={{
          marginBottom: 24,
          border: customCapsCount > 0 ? '1px solid rgba(0, 210, 255, 0.35)' : '1px solid var(--border-subtle)'
        }}
      >
        <div
          className="capacity-cap-header"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 12
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                padding: '8px',
                borderRadius: '10px',
                background: 'rgba(0, 169, 224, 0.12)',
                color: 'var(--cyan)'
              }}
            >
              <Sliders size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '15.5px', fontWeight: 800 }}>
                {t('individual_capacity_caps_title', 'Per-Faculty Manual Capacity Caps & Headroom Control')}
              </h3>
              <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>
                {t(
                  'individual_capacity_caps_desc',
                  'Set independent capacity caps for each teacher/faculty member. Smart Allocation uses each faculty member’s custom cap to calculate remaining capacity and balance workload.'
                )}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span
              className={`badge ${customCapsCount > 0 ? 'badge-primary' : 'badge-neutral'}`}
              style={{
                padding: '6px 14px',
                fontSize: '12px',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              {customCapsCount > 0 ? (
                <>
                  <Check size={14} style={{ color: 'var(--cyan)' }} />
                  {customCapsCount} {t('lbl_custom_caps_active', 'Manual Caps Configured')}
                </>
              ) : (
                t('lbl_default_benchmarks_active', 'Default Benchmarks Active (110–160)')
              )}
            </span>

            {customCapsCount > 0 && (
              <button
                onClick={handleResetAllToDefault}
                className="btn-secondary"
                style={{ padding: '6px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: 5 }}
                title="Reset all faculty members to default benchmark capacities"
                id="btn-reset-all-caps"
              >
                <RotateCcw size={13} /> {t('btn_reset_all_defaults', 'Reset All to Defaults')}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Overview Metric Row */}
      <div className="cards-grid" style={{ marginBottom: 24 }}>
        <div className="glass-card">
          <div className="metric-label">{t('lbl_active_advisors', 'Active Advisors')}</div>
          <div className="metric-value">{advisors.length}</div>
          <div className="metric-delta delta-neutral">{t('lbl_across_depts', 'Across All Academic Departments')}</div>
        </div>

        <div className="glass-card">
          <div className="metric-label">{t('lbl_overloaded_advisors', 'Overloaded Advisors (>85% / Over Cap)')}</div>
          <div
            className="metric-value"
            style={{ color: overloadedCount > 0 ? 'var(--red)' : 'var(--green)' }}
          >
            {overloadedCount}
          </div>
          <div className="metric-delta delta-down">
            {overloadedCount > 0
              ? t('lbl_urgent_rebalancing', 'Urgent rebalancing recommended')
              : t('lbl_healthy_range', 'All within healthy capacity limits')}
          </div>
        </div>

        <div className="glass-card">
          <div className="metric-label">{t('lbl_total_remaining_headroom', 'Total Remaining Advisee Capacity')}</div>
          <div
            className="metric-value"
            style={{ color: totalRemaining > 0 ? 'var(--cyan)' : 'var(--red)' }}
          >
            +{Math.max(0, totalRemaining)}
          </div>
          <div className="metric-delta delta-up">
            {totalStudents} {t('lbl_assigned_out_of', 'assigned out of')} {totalCapacity} {t('lbl_total_cap', 'total capacity')}
          </div>
        </div>

        <div className="glass-card">
          <div className="metric-label">{t('lbl_configured_manual_caps', 'Faculty with Manual Caps')}</div>
          <div className="metric-value" style={{ color: customCapsCount > 0 ? 'var(--cyan)' : 'inherit' }}>
            {customCapsCount} / {advisors.length}
          </div>
          <div className="metric-delta delta-up">
            {customCapsCount > 0 ? t('lbl_custom_overrides_active', 'Independent caps enforced') : t('lbl_standard_benchmarks', 'Standard benchmark limits')}
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
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 14,
              flexWrap: 'wrap',
              gap: 10
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <CheckCircle2 size={20} style={{ color: 'var(--green)' }} />
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800 }}>
                {t('lbl_opt_proposed', 'Optimization Proposed')}: {optimizationResult.totalMoved} {t('lbl_students_reassigned', 'Students Reassigned')}
              </h3>
            </div>

            {!hasApplied ? (
              <button
                onClick={handleApplyOptimization}
                className="btn-primary"
                style={{ background: 'linear-gradient(135deg, #059669, #10b981)' }}
                id="btn-apply-optimization"
              >
                <CheckCircle2 size={16} /> {t('btn_approve_apply_opt', 'Approve & Apply Optimization →')}
              </button>
            ) : (
              <span className="badge badge-success" style={{ padding: '6px 14px', fontSize: '12px' }}>
                {t('lbl_applied_live', 'Applied to Live System ✓')}
              </span>
            )}
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 14,
              marginBottom: 14
            }}
          >
            <div className="glass-card" style={{ padding: '12px', background: 'rgba(0,0,0,0.2)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                {t('lbl_estimated_sla_gain', 'Estimated SLA Response Gain')}
              </div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--green)', marginTop: 2 }}>
                {optimizationResult.estimatedResponseTimeImprovement}
              </div>
            </div>
            <div className="glass-card" style={{ padding: '12px', background: 'rgba(0,0,0,0.2)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                {t('lbl_caseload_variance_red', 'Caseload Variance Reduction')}
              </div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--cyan)', marginTop: 2 }}>
                {optimizationResult.capacityImprovement}
              </div>
            </div>
          </div>

          {/* Reassignment specific details */}
          <div
            style={{
              background: 'rgba(0,0,0,0.2)',
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)'
            }}
          >
            <b style={{ fontSize: '12.5px', color: 'var(--text-main)' }}>
              {t('lbl_recommended_reassignments', 'Recommended Advisee Reassignments:')}
            </b>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
              {optimizationResult.reassignments.length > 0 ? (
                optimizationResult.reassignments.map((re, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      fontSize: '12px',
                      color: 'var(--text-muted)'
                    }}
                  >
                    <ArrowRight size={14} style={{ color: 'var(--green)' }} />
                    <span>
                      {t('lbl_move', 'Move')} <b>{re.count} {t('lbl_advisees', 'advisees')}</b> {t('lbl_from', 'from')}{' '}
                      <span style={{ color: 'var(--red)', fontWeight: 700 }}>{re.fromAdvisor}</span> {t('lbl_to', 'to')}{' '}
                      <span style={{ color: 'var(--green)', fontWeight: 700 }}>{re.toAdvisor}</span> ({re.department})
                    </span>
                  </div>
                ))
              ) : (
                <div style={{ fontSize: '12px', color: 'var(--green)' }}>
                  {t('lbl_all_within_limits', 'All faculty are already operating within target individual capacity limits. No advisee transfers needed.')}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Caseload Comparison & Individual Capacity Cap Table */}
      <div className="glass-card table-container">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
            flexWrap: 'wrap',
            gap: 10
          }}
        >
          <div>
            <h3 style={{ margin: 0, fontSize: '15.5px', fontWeight: 800 }}>
              {t('faculty_caseload_ledger_title', 'Faculty Advisor Workload & Capacity Cap Ledger')}
            </h3>
            <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: 2 }}>
              {t(
                'caseload_ledger_subtitle',
                'Each faculty member maintains an independent capacity cap. Remaining capacity = Capacity Cap - Current Workload.'
              )}
            </div>
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            {optimizationResult ? t('lbl_simulation_mode', 'Before vs. After Optimization Simulation') : t('lbl_current_state', 'Current Active State')}
          </span>
        </div>

        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>{t('th_faculty_advisor', 'Faculty / Advisor')}</th>
                <th>{t('th_department', 'Department')}</th>
                <th>{t('th_current_load', 'Current Load')}</th>
                <th style={{ minWidth: '180px' }}>{t('th_capacity_cap', 'Capacity Cap')}</th>
                <th>{t('th_remaining_capacity', 'Remaining Capacity')}</th>
                <th>{t('th_workload_percent', 'Workload %')}</th>
                {optimizationResult && <th>{t('th_optimized_load', 'Optimized Load')}</th>}
                <th>{t('th_status', 'Status')}</th>
                <th style={{ textAlign: 'right' }}>{t('th_actions', 'Actions')}</th>
              </tr>
            </thead>
            <tbody>
              {(optimizationResult ? optimizationResult.advisors : advisors).map((adv) => {
                const isEditing = editingFacultyId === adv.id;
                const isManual = isFacultyCustom(adv.id);
                const currentStudents = adv.beforeStudents !== undefined ? adv.beforeStudents : adv.students;
                const capacity = adv.capacity;
                const remaining = capacity - currentStudents;
                const curLoad = adv.beforeLoad !== undefined ? adv.beforeLoad : adv.workload;
                const afterLoad = adv.afterLoad;
                const isOverCap = currentStudents > capacity;
                const isOverloaded = curLoad > 85 || isOverCap;

                return (
                  <tr
                    key={adv.id}
                    style={{
                      background:
                        optimizationResult && adv.beforeStudents !== adv.afterStudents
                          ? 'rgba(16, 185, 129, 0.04)'
                          : isOverCap
                          ? 'rgba(239, 68, 68, 0.05)'
                          : 'transparent'
                    }}
                  >
                    {/* Faculty Name & ID */}
                    <td>
                      <b>{adv.name}</b>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ID: {adv.id}</div>
                    </td>

                    {/* Department */}
                    <td>{adv.department}</td>

                    {/* Current Load (Students) */}
                    <td>
                      <span style={{ fontSize: '14px', fontWeight: 800, color: isOverCap ? 'var(--red)' : 'var(--text-main)' }}>
                        {currentStudents}
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: 3 }}>
                        {t('lbl_advisees_short', 'advisees')}
                      </span>
                    </td>

                    {/* Capacity Cap Control (Individual) */}
                    <td>
                      {isEditing ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <input
                              type="number"
                              min="1"
                              max="500"
                              value={editCapInput}
                              onChange={(e) => {
                                setEditCapInput(e.target.value);
                                if (editCapError) setEditCapError('');
                              }}
                              className={`form-input ${editCapError ? 'input-error' : ''}`}
                              style={{ width: '80px', padding: '4px 8px', fontSize: '13px' }}
                              autoFocus
                            />
                            <button
                              type="button"
                              onClick={() => handleSaveFacultyCap(adv.id)}
                              className="btn-primary"
                              style={{ padding: '4px 8px', fontSize: '11.5px' }}
                              title="Save Capacity Cap"
                            >
                              <Check size={13} /> {t('btn_save', 'Save')}
                            </button>
                            <button
                              type="button"
                              onClick={handleCancelEdit}
                              className="btn-secondary"
                              style={{ padding: '4px 8px', fontSize: '11.5px' }}
                              title="Cancel"
                            >
                              ✕
                            </button>
                          </div>
                          {editCapError && (
                            <div style={{ fontSize: '11px', color: 'var(--red)' }}>
                              {editCapError}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                          <span
                            style={{
                              fontSize: '14px',
                              fontWeight: 800,
                              color: isManual ? 'var(--cyan)' : 'var(--text-main)'
                            }}
                          >
                            {capacity}
                          </span>

                          <span
                            className={`badge ${isManual ? 'badge-primary' : 'badge-neutral'}`}
                            style={{ fontSize: '10px', padding: '2px 6px', fontWeight: 700 }}
                          >
                            {isManual ? t('lbl_manual_cap', 'Manual Cap') : t('lbl_default_cap', 'Default')}
                          </span>

                          <button
                            type="button"
                            onClick={() => handleStartEdit(adv)}
                            className="icon-btn"
                            style={{ width: 24, height: 24, padding: 0 }}
                            title={t('btn_edit_capacity', 'Edit Capacity Cap')}
                            id={`btn-edit-cap-${adv.id}`}
                          >
                            <Edit2 size={12} />
                          </button>

                          {isManual && (
                            <button
                              type="button"
                              onClick={() => handleResetFacultyCap(adv.id, adv.name)}
                              className="icon-btn"
                              style={{ width: 24, height: 24, padding: 0 }}
                              title={t('btn_reset_faculty_default', 'Reset to Benchmark Default')}
                              id={`btn-reset-cap-${adv.id}`}
                            >
                              <RotateCcw size={12} />
                            </button>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Remaining Capacity */}
                    <td>
                      {remaining < 0 ? (
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--red)', fontWeight: 800 }}>
                          <AlertTriangle size={13} />
                          <span>{remaining} ({t('lbl_over_cap', 'Over Cap')})</span>
                        </div>
                      ) : remaining === 0 ? (
                        <span className="badge badge-warning" style={{ fontSize: '11px', fontWeight: 700 }}>
                          0 {t('lbl_capacity_full', '(Full)')}
                        </span>
                      ) : remaining <= 5 ? (
                        <span className="badge badge-warning" style={{ fontSize: '11px', fontWeight: 700 }}>
                          +{remaining} {t('lbl_left', 'left')}
                        </span>
                      ) : (
                        <span className="badge badge-success" style={{ fontSize: '11px', fontWeight: 700 }}>
                          +{remaining} {t('lbl_available', 'available')}
                        </span>
                      )}
                    </td>

                    {/* Workload % & Progress Bar */}
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div className="progress-track" style={{ width: '75px', height: 6 }}>
                          <div
                            className={`progress-fill ${curLoad > 90 || isOverCap ? 'red' : curLoad >= 70 ? 'orange' : 'green'}`}
                            style={{ width: `${Math.min(100, Math.max(0, curLoad))}%` }}
                          />
                        </div>
                        <span
                          style={{
                            fontSize: '12px',
                            fontWeight: 700,
                            color: isOverloaded ? 'var(--red)' : 'inherit'
                          }}
                        >
                          {curLoad}%
                        </span>
                      </div>
                    </td>

                    {/* Optimized Load Column if calculated */}
                    {optimizationResult && (
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <b style={{ color: adv.beforeStudents !== adv.afterStudents ? 'var(--green)' : 'inherit' }}>
                            {adv.afterStudents}
                          </b>
                          <div className="progress-track" style={{ width: '60px', height: 6 }}>
                            <div
                              className={`progress-fill ${afterLoad > 90 ? 'red' : afterLoad >= 70 ? 'orange' : 'green'}`}
                              style={{ width: `${Math.min(100, afterLoad)}%` }}
                            />
                          </div>
                          <span style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--green)' }}>
                            {afterLoad}%
                          </span>
                        </div>
                      </td>
                    )}

                    {/* Status Badge */}
                    <td>
                      <StatusBadge
                        status={isOverCap ? 'critical' : isOverloaded ? 'at risk' : curLoad >= 70 ? 'monitor' : 'healthy'}
                      />
                    </td>

                    {/* Quick Allocate Action */}
                    <td style={{ textAlign: 'right' }}>
                      <button
                        type="button"
                        onClick={() => handleOpenAllocateModal(adv)}
                        className="btn-secondary"
                        style={{ padding: '5px 10px', fontSize: '11.5px', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                        title={t('btn_allocate_students', 'Assign / Allocate New Advisees')}
                        id={`btn-allocate-${adv.id}`}
                      >
                        <PlusCircle size={13} style={{ color: 'var(--cyan)' }} />
                        <span>{t('btn_allocate', 'Allocate')}</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Workload Allocation Modal */}
      {allocatingFaculty && (
        <Modal
          isOpen={Boolean(allocatingFaculty)}
          onClose={() => setAllocatingFaculty(null)}
          title={`${t('modal_allocate_title', 'Allocate Advisees')}: ${allocatingFaculty.name}`}
          size="md"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Faculty info snapshot */}
            <div
              style={{
                background: 'rgba(0,0,0,0.25)',
                padding: '14px',
                borderRadius: 'var(--radius-md)',
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 12
              }}
            >
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{t('lbl_current_load', 'Current Load')}</div>
                <div style={{ fontSize: '16px', fontWeight: 800, marginTop: 2 }}>{allocatingFaculty.students}</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{t('lbl_capacity_cap', 'Capacity Cap')}</div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--cyan)', marginTop: 2 }}>
                  {allocatingFaculty.capacity} {allocatingFaculty.isIndividualCustom ? '(Manual)' : '(Default)'}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{t('lbl_remaining_headroom', 'Remaining Headroom')}</div>
                <div
                  style={{
                    fontSize: '16px',
                    fontWeight: 800,
                    color: allocatingFaculty.remainingCapacity > 0 ? 'var(--green)' : 'var(--red)',
                    marginTop: 2
                  }}
                >
                  {allocatingFaculty.remainingCapacity > 0 ? `+${allocatingFaculty.remainingCapacity}` : allocatingFaculty.remainingCapacity}
                </div>
              </div>
            </div>

            {/* Input field for students to add */}
            <div className="form-group">
              <label className="form-label" htmlFor="allocate-count-input">
                {t('lbl_students_to_assign', 'Number of New Advisees / Students to Allocate:')}
              </label>
              <input
                id="allocate-count-input"
                type="number"
                min="1"
                max="100"
                value={allocateCount}
                onChange={(e) => {
                  setAllocateCount(Number(e.target.value));
                  if (allocateError) setAllocateError('');
                }}
                className={`form-input ${allocateError ? 'input-error' : ''}`}
                style={{ fontSize: '14px', fontWeight: 700 }}
              />
            </div>

            {/* Simulated outcome calculation */}
            {(() => {
              const newTotal = (allocatingFaculty.students || 0) + (Number(allocateCount) || 0);
              const newRemaining = allocatingFaculty.capacity - newTotal;
              const willExceed = newTotal > allocatingFaculty.capacity;

              return (
                <div
                  style={{
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-md)',
                    background: willExceed ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                    border: `1px solid ${willExceed ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`
                  }}
                >
                  <div style={{ fontSize: '12.5px', fontWeight: 700, color: willExceed ? 'var(--red)' : 'var(--green)' }}>
                    {willExceed
                      ? `⚠️ ${t('warning_cap_breach', 'Warning: Allocation will exceed the capacity cap!')}`
                      : `✓ ${t('lbl_within_cap', 'Allocation is within individual capacity cap.')}`}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: 4 }}>
                    {t('lbl_projected_load', 'Projected workload:')} <b>{newTotal}</b> / {allocatingFaculty.capacity} {t('lbl_advisees', 'advisees')} (
                    {t('lbl_remaining', 'Remaining')}: <b style={{ color: newRemaining >= 0 ? 'var(--green)' : 'var(--red)' }}>{newRemaining}</b>)
                  </div>

                  {willExceed && (
                    <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <input
                        type="checkbox"
                        id="override-checkbox"
                        checked={allowOverride}
                        onChange={(e) => setAllowOverride(e.target.checked)}
                      />
                      <label htmlFor="override-checkbox" style={{ fontSize: '12px', color: 'var(--text-main)', cursor: 'pointer' }}>
                        {t('lbl_allow_cap_override', 'Explicitly allow capacity cap override for this allocation')}
                      </label>
                    </div>
                  )}
                </div>
              );
            })()}

            {allocateError && (
              <div style={{ color: 'var(--red)', fontSize: '12px', display: 'flex', alignItems: 'center', gap: 6 }}>
                <AlertTriangle size={14} />
                <span>{allocateError}</span>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setAllocatingFaculty(null)}
              >
                {t('btn_cancel', 'Cancel')}
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={handleConfirmAllocate}
                id="btn-confirm-allocation"
              >
                <Check size={15} /> {t('btn_confirm_allocation', 'Confirm Allocation')}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
