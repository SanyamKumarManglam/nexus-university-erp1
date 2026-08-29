import React, { useState, useEffect } from 'react';
import { facultyService } from '../../services/facultyService';
import { useToast } from '../../context/ToastContext';
import { FacultyDetailModal } from './FacultyDetailModal';
import { StatusBadge } from '../common/PriorityBadge';
import { Modal } from '../common/Modal';
import {
  Users,
  Search,
  Plus,
  Eye,
  Trash2,
  Edit,
  Mail,
  GraduationCap,
  ShieldCheck
} from 'lucide-react';

export function FacultyManagement({ onNavigate }) {
  const toast = useToast();
  const [facultyList, setFacultyList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Add Faculty Form State
  const [newFacultyData, setNewFacultyData] = useState({
    name: '',
    email: '',
    phone: '',
    department: 'CSE',
    role: 'Associate Professor',
    qualification: 'Ph.D.',
    experience: 6,
    subjects: 'Operating Systems, Machine Learning',
    studentsAssigned: 40,
    maxCapacity: 120
  });

  const loadData = () => {
    setFacultyList(facultyService.getAllFaculty());
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredFaculty = facultyList.filter((f) => {
    const matchesSearch =
      !searchQuery ||
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.subjects && f.subjects.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchesDept = !departmentFilter || f.department === departmentFilter;
    return matchesSearch && matchesDept;
  });

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to remove ${name} from the Faculty Directory?`)) {
      try {
        facultyService.deleteFaculty(id);
        loadData();
        toast.success(`Faculty member ${name} removed.`);
      } catch (e) {
        toast.error('Failed to delete faculty');
      }
    }
  };

  const handleAddFaculty = (e) => {
    e.preventDefault();
    if (!newFacultyData.name || !newFacultyData.email) {
      toast.error('Name and email are required');
      return;
    }

    try {
      facultyService.addFaculty(newFacultyData);
      loadData();
      setIsAddModalOpen(false);
      setNewFacultyData({
        name: '',
        email: '',
        phone: '',
        department: 'CSE',
        role: 'Associate Professor',
        qualification: 'Ph.D.',
        experience: 6,
        subjects: 'Operating Systems',
        studentsAssigned: 40,
        maxCapacity: 120
      });
      toast.success('Faculty member added to institutional directory!');
    } catch (err) {
      toast.error('Failed to add faculty');
    }
  };

  return (
    <div>
      {/* Hero Banner */}
      <div className="hero-banner">
        <div className="hero-content">
          <h2>Faculty Intelligence & Governance Directory</h2>
          <p>
            Holistic faculty tracking across all 8 academic dimensions: teaching performance, student caseloads, attendance reliability, research outputs, and retention risk prediction.
          </p>
          <div className="hero-actions">
            <button className="btn-white" onClick={() => setIsAddModalOpen(true)}>
              <Plus size={16} /> + Add Faculty Member
            </button>
            <button className="btn-ghost" onClick={() => onNavigate('workload')}>
              Run Workload Allocation →
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
                placeholder="Search faculty by name, employee ID, or subject expertise..."
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
              style={{ width: '180px', fontSize: '13px' }}
            >
              <option value="">All Departments</option>
              <option value="CSE">CSE</option>
              <option value="ECE">ECE</option>
              <option value="Mechanical">Mechanical</option>
              <option value="Biotechnology">Biotechnology</option>
            </select>
          </div>

          <div style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
            Showing <b>{filteredFaculty.length}</b> of <b>{facultyList.length}</b> faculty members
          </div>
        </div>
      </div>

      {/* Faculty Directory Table */}
      <div className="glass-card table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Faculty Member</th>
              <th>Department & Role</th>
              <th>Advisee Caseload</th>
              <th>Performance Score</th>
              <th>Retention Risk</th>
              <th>Attendance</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredFaculty.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                  No faculty found matching search criteria.
                </td>
              </tr>
            ) : (
              filteredFaculty.map((f) => {
                const loadPercent = Math.round((f.studentsAssigned / f.maxCapacity) * 100);
                let loadColor = 'green';
                if (loadPercent > 90) loadColor = 'red';
                else if (loadPercent >= 75) loadColor = 'orange';

                return (
                  <tr key={f.id}>
                    <td>
                      <b>{f.name}</b>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{f.email} · ID: {f.id}</div>
                    </td>
                    <td>
                      <div>{f.role}</div>
                      <div style={{ fontSize: '11px', color: 'var(--cyan)' }}>Dept. of {f.department}</div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', marginBottom: 4 }}>
                        <span><b>{f.studentsAssigned}</b> / {f.maxCapacity}</span>
                        <span style={{ color: loadPercent > 90 ? 'var(--red)' : 'var(--text-dim)' }}>{loadPercent}%</span>
                      </div>
                      <div className="progress-track" style={{ height: 6 }}>
                        <div className={`progress-fill ${loadColor}`} style={{ width: `${Math.min(100, loadPercent)}%` }} />
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '14px', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
                        {f.performanceScore} / 100
                      </div>
                      <div style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>Student Success: {f.studentSuccessScore}</div>
                    </td>
                    <td>
                      <StatusBadge status={f.retentionRisk === 'High' ? 'at risk' : f.retentionRisk === 'Medium' ? 'monitor' : 'healthy'} />
                    </td>
                    <td>
                      <span style={{ fontWeight: 700, color: 'var(--green)' }}>{f.attendanceRate}%</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button
                          onClick={() => setSelectedFaculty(f)}
                          className="btn-secondary"
                          style={{ padding: '6px 10px', fontSize: '11.5px' }}
                          title="Open 8-Tab Faculty Dossier"
                        >
                          <Eye size={13} /> View Dossier
                        </button>
                        <button
                          onClick={() => handleDelete(f.id, f.name)}
                          className="btn-danger"
                          style={{ padding: '6px 10px', fontSize: '11.5px' }}
                          title="Remove from Faculty Directory"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* 8-Tab Faculty Detail Modal */}
      {selectedFaculty && (
        <FacultyDetailModal
          faculty={selectedFaculty}
          isOpen={Boolean(selectedFaculty)}
          onClose={() => setSelectedFaculty(null)}
        />
      )}

      {/* Add Faculty Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add Faculty Member to Directory">
        <form onSubmit={handleAddFaculty}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                required
                value={newFacultyData.name}
                onChange={(e) => setNewFacultyData((p) => ({ ...p, name: e.target.value }))}
                placeholder="Dr. Full Name"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">University Email ID *</label>
              <input
                type="email"
                required
                value={newFacultyData.email}
                onChange={(e) => setNewFacultyData((p) => ({ ...p, email: e.target.value }))}
                placeholder="name@nexus.edu"
                className="form-input"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Department</label>
              <select
                value={newFacultyData.department}
                onChange={(e) => setNewFacultyData((p) => ({ ...p, department: e.target.value }))}
                className="form-select"
              >
                <option value="CSE">CSE</option>
                <option value="ECE">ECE</option>
                <option value="Mechanical">Mechanical</option>
                <option value="Biotechnology">Biotechnology</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Academic Rank / Role</label>
              <select
                value={newFacultyData.role}
                onChange={(e) => setNewFacultyData((p) => ({ ...p, role: e.target.value }))}
                className="form-select"
              >
                <option value="Assistant Professor">Assistant Professor</option>
                <option value="Associate Professor">Associate Professor</option>
                <option value="Professor">Professor</option>
                <option value="Professor & Head">Professor & Head</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Subjects / Course Expertise</label>
              <input
                type="text"
                value={newFacultyData.subjects}
                onChange={(e) => setNewFacultyData((p) => ({ ...p, subjects: e.target.value }))}
                placeholder="Machine Learning, Algorithms"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Max Advising Cap</label>
              <input
                type="number"
                value={newFacultyData.maxCapacity}
                onChange={(e) => setNewFacultyData((p) => ({ ...p, maxCapacity: Number(e.target.value) }))}
                className="form-input"
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 14 }}>
            <button type="button" onClick={() => setIsAddModalOpen(false)} className="btn-ghost">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save Faculty Member
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
