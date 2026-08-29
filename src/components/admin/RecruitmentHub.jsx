import React, { useState, useEffect } from 'react';
import { recruitmentService } from '../../services/recruitmentService';
import { useToast } from '../../context/ToastContext';
import { CandidateDetailModal } from './CandidateDetailModal';
import { StatusBadge } from '../common/PriorityBadge';
import { Modal } from '../common/Modal';
import {
  Search,
  Filter,
  Plus,
  LayoutGrid,
  List,
  Sparkles,
  Briefcase,
  GraduationCap,
  Calendar,
  Eye,
  CheckCircle2,
  Trash2
} from 'lucide-react';
import { formatDate } from '../../utils/formatters';

const PIPELINE_STAGES = [
  'Applied',
  'Screening',
  'Shortlisted',
  'Interview',
  'Selected',
  'Hired'
];

export function RecruitmentHub({ onNavigate }) {
  const toast = useToast();
  const [candidates, setCandidates] = useState([]);
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' or 'table'
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Candidate Form State
  const [newCandidateData, setNewCandidateData] = useState({
    name: '',
    email: '',
    phone: '',
    age: 32,
    department: 'CSE',
    position: 'Assistant Professor',
    qualification: 'Ph.D. in Computer Science',
    experience: 4,
    skills: 'Python, Machine Learning, Deep Learning'
  });

  const loadCandidates = () => {
    setCandidates(recruitmentService.getAllCandidates());
  };

  useEffect(() => {
    loadCandidates();
  }, []);

  const filteredCandidates = candidates.filter((c) => {
    const matchesSearch =
      !searchQuery ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      c.position.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept = !departmentFilter || c.department === departmentFilter;
    const matchesStatus = !statusFilter || c.status === statusFilter;

    return matchesSearch && matchesDept && matchesStatus;
  });

  const handleUpdateStatus = (id, newStatus) => {
    try {
      recruitmentService.updateCandidateStatus(id, newStatus);
      loadCandidates();
      if (selectedCandidate && selectedCandidate.id === id) {
        setSelectedCandidate(recruitmentService.getCandidateById(id));
      }
      toast.success(`Candidate status updated to ${newStatus}`);
    } catch (e) {
      toast.error('Failed to update candidate status');
    }
  };

  const handleHire = (id) => {
    try {
      recruitmentService.hireCandidate(id);
      loadCandidates();
      setSelectedCandidate(null);
      toast.success('Candidate successfully hired! Onboarding workflow generated.');
      // Option to jump to onboarding
    } catch (e) {
      toast.error('Error during hiring transition');
    }
  };

  const handleAddCandidate = (e) => {
    e.preventDefault();
    if (!newCandidateData.name || !newCandidateData.email) {
      toast.error('Please enter name and email');
      return;
    }

    try {
      recruitmentService.addCandidate(newCandidateData);
      loadCandidates();
      setIsAddModalOpen(false);
      setNewCandidateData({
        name: '',
        email: '',
        phone: '',
        age: 32,
        department: 'CSE',
        position: 'Assistant Professor',
        qualification: 'Ph.D. in Computer Science',
        experience: 4,
        skills: 'Python, Cloud Computing'
      });
      toast.success('New candidate registered and AI match evaluated!');
    } catch (err) {
      toast.error('Failed to register candidate');
    }
  };

  return (
    <div>
      {/* Header Banner */}
      <div className="hero-banner">
        <div className="hero-content">
          <h2>Faculty Recruitment & Talent Acquisition</h2>
          <p>
            AI-assisted candidate screening, qualification benchmarking, multi-stage applicant tracking pipeline, and 1-click onboarding dispatch.
          </p>
          <div className="hero-actions">
            <button className="btn-white" onClick={() => setIsAddModalOpen(true)}>
              <Plus size={16} /> Add Candidate Application
            </button>
            <button className="btn-ghost" onClick={() => onNavigate('onboard')}>
              View Onboarding Hub →
            </button>
          </div>
        </div>
      </div>

      {/* Toolbar & Filters */}
      <div className="glass-card" style={{ marginBottom: 20, padding: '14px 18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: '260px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={16} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-dim)' }} />
              <input
                type="text"
                placeholder="Search candidates by name, specialization, or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input"
                style={{ paddingLeft: 38, fontSize: '13px' }}
              />
            </div>

            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="form-select"
              style={{ width: '160px', fontSize: '13px' }}
            >
              <option value="">All Departments</option>
              <option value="CSE">CSE</option>
              <option value="ECE">ECE</option>
              <option value="Mechanical">Mechanical</option>
              <option value="Biotechnology">Biotechnology</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="form-select"
              style={{ width: '150px', fontSize: '13px' }}
            >
              <option value="">All Statuses</option>
              {PIPELINE_STAGES.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: 6, background: 'rgba(0,0,0,0.25)', padding: 3, borderRadius: 'var(--radius-md)' }}>
            <button
              onClick={() => setViewMode('kanban')}
              className="icon-btn"
              style={{
                width: 34,
                height: 34,
                background: viewMode === 'kanban' ? 'rgba(0, 169, 224, 0.2)' : 'transparent',
                color: viewMode === 'kanban' ? 'var(--cyan)' : 'var(--text-muted)'
              }}
              title="Kanban Pipeline View"
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className="icon-btn"
              style={{
                width: 34,
                height: 34,
                background: viewMode === 'table' ? 'rgba(0, 169, 224, 0.2)' : 'transparent',
                color: viewMode === 'table' ? 'var(--cyan)' : 'var(--text-muted)'
              }}
              title="Table Directory View"
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* KANBAN PIPELINE VIEW */}
      {viewMode === 'kanban' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(220px, 1fr))', gap: 14, overflowX: 'auto', paddingBottom: 16 }}>
          {PIPELINE_STAGES.map((stage) => {
            const stageCandidates = filteredCandidates.filter((c) => c.status === stage);

            return (
              <div
                key={stage}
                className="glass-card"
                style={{
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  background: 'rgba(10, 17, 30, 0.85)',
                  minHeight: '480px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, paddingBottom: 8, borderBottom: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.6px', color: 'var(--text-main)' }}>
                    {stage}
                  </span>
                  <span style={{ fontSize: '11px', background: 'rgba(255,255,255,0.08)', padding: '2px 7px', borderRadius: 99, fontWeight: 700 }}>
                    {stageCandidates.length}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1, overflowY: 'auto' }}>
                  {stageCandidates.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-dim)', fontSize: '11.5px' }}>
                      No candidates in {stage}
                    </div>
                  ) : (
                    stageCandidates.map((cand) => (
                      <div
                        key={cand.id}
                        onClick={() => setSelectedCandidate(cand)}
                        className="glass-card"
                        style={{
                          padding: '12px',
                          cursor: 'pointer',
                          background: 'rgba(15, 25, 45, 0.7)',
                          border: '1px solid var(--border-subtle)',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                          <b style={{ fontSize: '13px', color: 'var(--text-main)' }}>{cand.name}</b>
                          <span style={{ fontSize: '10px', color: 'var(--text-dim)' }}>{cand.department}</span>
                        </div>
                        <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginBottom: 8 }}>
                          {cand.qualification} · {cand.experience}y exp
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 6, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                          <span style={{ fontSize: '11px', fontWeight: 700, color: cand.matchScore >= 85 ? 'var(--cyan)' : 'var(--orange)', display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Sparkles size={12} /> {cand.matchScore}% Match
                          </span>
                          <Eye size={14} style={{ color: 'var(--text-dim)' }} />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE PIPELINE VIEW */
        <div className="glass-card table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Candidate</th>
                <th>Department</th>
                <th>Qualification</th>
                <th>Experience</th>
                <th>AI Match Score</th>
                <th>Pipeline Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCandidates.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                    No candidates matching current filter criteria.
                  </td>
                </tr>
              ) : (
                filteredCandidates.map((cand) => (
                  <tr key={cand.id}>
                    <td>
                      <b>{cand.name}</b>
                      <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>{cand.email}</div>
                    </td>
                    <td>{cand.department}</td>
                    <td>{cand.qualification}</td>
                    <td>{cand.experience} yrs</td>
                    <td>
                      <span style={{ fontWeight: 800, color: cand.matchScore >= 85 ? 'var(--cyan)' : 'var(--orange)' }}>
                        {cand.matchScore}%
                      </span>
                    </td>
                    <td>
                      <StatusBadge status={cand.status} />
                    </td>
                    <td>
                      <button
                        onClick={() => setSelectedCandidate(cand)}
                        className="btn-secondary"
                        style={{ padding: '6px 12px', fontSize: '12px' }}
                      >
                        <Eye size={13} /> View Match Profile
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Candidate Match Profile Modal */}
      {selectedCandidate && (
        <CandidateDetailModal
          candidate={selectedCandidate}
          isOpen={Boolean(selectedCandidate)}
          onClose={() => setSelectedCandidate(null)}
          onUpdateStatus={handleUpdateStatus}
          onHire={handleHire}
        />
      )}

      {/* Add Candidate Application Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Register Faculty Candidate Application">
        <form onSubmit={handleAddCandidate}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                required
                value={newCandidateData.name}
                onChange={(e) => setNewCandidateData((p) => ({ ...p, name: e.target.value }))}
                placeholder="Dr. Full Name"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email ID *</label>
              <input
                type="email"
                required
                value={newCandidateData.email}
                onChange={(e) => setNewCandidateData((p) => ({ ...p, email: e.target.value }))}
                placeholder="candidate@gmail.com"
                className="form-input"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Department</label>
              <select
                value={newCandidateData.department}
                onChange={(e) => setNewCandidateData((p) => ({ ...p, department: e.target.value }))}
                className="form-select"
              >
                <option value="CSE">CSE</option>
                <option value="ECE">ECE</option>
                <option value="Mechanical">Mechanical</option>
                <option value="Biotechnology">Biotechnology</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Position Tier</label>
              <select
                value={newCandidateData.position}
                onChange={(e) => setNewCandidateData((p) => ({ ...p, position: e.target.value }))}
                className="form-select"
              >
                <option value="Assistant Professor">Assistant Professor</option>
                <option value="Associate Professor">Associate Professor</option>
                <option value="Professor">Professor</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Highest Qualification</label>
              <input
                type="text"
                value={newCandidateData.qualification}
                onChange={(e) => setNewCandidateData((p) => ({ ...p, qualification: e.target.value }))}
                placeholder="Ph.D. in ..."
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Exp (Years)</label>
              <input
                type="number"
                value={newCandidateData.experience}
                onChange={(e) => setNewCandidateData((p) => ({ ...p, experience: e.target.value }))}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Specializations / Subjects</label>
            <input
              type="text"
              value={newCandidateData.skills}
              onChange={(e) => setNewCandidateData((p) => ({ ...p, skills: e.target.value }))}
              placeholder="VLSI, Machine Learning, Robotics..."
              className="form-input"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 14 }}>
            <button type="button" onClick={() => setIsAddModalOpen(false)} className="btn-ghost">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              <Sparkles size={16} /> Evaluate AI Match & Save Candidate
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
