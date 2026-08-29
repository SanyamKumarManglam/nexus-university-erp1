import React, { useState, useEffect } from 'react';
import { studentService } from '../../services/studentService';
import { useToast } from '../../context/ToastContext';
import { StudentDetailModal } from './StudentDetailModal';
import { StatusBadge } from '../common/PriorityBadge';
import { Modal } from '../common/Modal';
import {
  GraduationCap,
  Search,
  Plus,
  Eye,
  ArrowUpDown,
  Filter,
  AlertTriangle,
  Sparkles
} from 'lucide-react';

export function StudentManagement({ onNavigate }) {
  const toast = useToast();
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [riskFilter, setRiskFilter] = useState('');
  const [sortBy, setSortBy] = useState('studentIndex'); // 'studentIndex', 'attendance', 'name', 'semester'
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Student Form
  const [newStudentData, setNewStudentData] = useState({
    name: '',
    email: '',
    phone: '',
    age: 20,
    department: 'CSE',
    program: 'B.Tech CSE',
    semester: 4,
    attendance: 88,
    advisorName: 'Prof. Rajesh Sharma'
  });

  const loadData = () => {
    setStudents(studentService.getAllStudents());
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredStudents = students
    .filter((s) => {
      const matchesSearch =
        !searchQuery ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDept = !departmentFilter || s.department === departmentFilter;
      const matchesRisk = !riskFilter || s.riskLevel.toLowerCase() === riskFilter.toLowerCase();

      return matchesSearch && matchesDept && matchesRisk;
    })
    .sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];

      if (typeof valA === 'string') {
        return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return sortOrder === 'asc' ? valA - valB : valB - valA;
    });

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleAddStudent = (e) => {
    e.preventDefault();
    if (!newStudentData.name || !newStudentData.email) {
      toast.error('Name and email are required');
      return;
    }

    try {
      studentService.addStudent(newStudentData);
      loadData();
      setIsAddModalOpen(false);
      setNewStudentData({
        name: '',
        email: '',
        phone: '',
        age: 20,
        department: 'CSE',
        program: 'B.Tech CSE',
        semester: 4,
        attendance: 88,
        advisorName: 'Prof. Rajesh Sharma'
      });
      toast.success('Student enrolled and Student Index initialized!');
    } catch (err) {
      toast.error('Failed to add student');
    }
  };

  return (
    <div>
      {/* Hero Banner */}
      <div className="hero-banner">
        <div className="hero-content">
          <h2>Student Management & Mentorship Intelligence</h2>
          <p>
            Holistic student operating hub tracking composite student index scores (0–100), automated early warning flags, attendance compliance, and advisor caseload distribution.
          </p>
          <div className="hero-actions">
            <button className="btn-white" onClick={() => setIsAddModalOpen(true)}>
              <Plus size={16} /> + Enroll New Student
            </button>
            <button className="btn-ghost" onClick={() => onNavigate('attendance')}>
              View Class Attendance Hub →
            </button>
          </div>
        </div>
      </div>

      {/* Toolbar & Filter Controls */}
      <div className="glass-card" style={{ marginBottom: 20, padding: '14px 18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: '260px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={16} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-dim)' }} />
              <input
                type="text"
                placeholder="Search by student name, roll number, or email..."
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
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="form-select"
              style={{ width: '160px', fontSize: '13px' }}
            >
              <option value="">All Risk Tiers</option>
              <option value="healthy">Healthy (80–100)</option>
              <option value="monitor">Monitor (60–79)</option>
              <option value="at risk">At Risk (40–59)</option>
              <option value="critical">Critical (&lt;40)</option>
            </select>
          </div>

          <div style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
            Showing <b>{filteredStudents.length}</b> of <b>{students.length}</b> enrolled students
          </div>
        </div>
      </div>

      {/* Student Directory Table */}
      <div className="glass-card table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  Student <ArrowUpDown size={12} />
                </span>
              </th>
              <th>Department & Sem</th>
              <th>Assigned Advisor</th>
              <th onClick={() => handleSort('attendance')} style={{ cursor: 'pointer' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  Attendance <ArrowUpDown size={12} />
                </span>
              </th>
              <th onClick={() => handleSort('studentIndex')} style={{ cursor: 'pointer' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  Student Index <ArrowUpDown size={12} />
                </span>
              </th>
              <th>Risk Tier</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                  No students found matching current filter query.
                </td>
              </tr>
            ) : (
              filteredStudents.map((s) => (
                <tr key={s.id}>
                  <td>
                    <b>{s.name}</b>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{s.rollNumber} · {s.email}</div>
                  </td>
                  <td>
                    <div>{s.program}</div>
                    <div style={{ fontSize: '11px', color: 'var(--cyan)' }}>Sem {s.semester} ({s.section})</div>
                  </td>
                  <td>
                    <div style={{ fontSize: '12px' }}>{s.advisorName}</div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 700, color: s.attendance >= 80 ? 'var(--green)' : s.attendance >= 70 ? 'var(--orange)' : 'var(--red)' }}>
                      {s.attendance}%
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: '14px', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
                        {s.studentIndex} / 100
                      </span>
                    </div>
                  </td>
                  <td>
                    <StatusBadge status={s.riskLevel.toLowerCase()} />
                  </td>
                  <td>
                    <button
                      onClick={() => setSelectedStudent(s)}
                      className="btn-secondary"
                      style={{ padding: '6px 12px', fontSize: '11.5px' }}
                    >
                      <Eye size={13} /> View Dossier
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Student Dossier Modal */}
      {selectedStudent && (
        <StudentDetailModal
          student={selectedStudent}
          isOpen={Boolean(selectedStudent)}
          onClose={() => setSelectedStudent(null)}
          onRefresh={loadData}
        />
      )}

      {/* Enroll Student Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Enroll Undergraduate Student">
        <form onSubmit={handleAddStudent}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                required
                value={newStudentData.name}
                onChange={(e) => setNewStudentData((p) => ({ ...p, name: e.target.value }))}
                placeholder="Student Full Name"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email ID *</label>
              <input
                type="email"
                required
                value={newStudentData.email}
                onChange={(e) => setNewStudentData((p) => ({ ...p, email: e.target.value }))}
                placeholder="student@nexus.edu"
                className="form-input"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Department</label>
              <select
                value={newStudentData.department}
                onChange={(e) => setNewStudentData((p) => ({ ...p, department: e.target.value, program: `B.Tech ${e.target.value}` }))}
                className="form-select"
              >
                <option value="CSE">CSE</option>
                <option value="ECE">ECE</option>
                <option value="Mechanical">Mechanical</option>
                <option value="Biotechnology">Biotechnology</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Current Semester</label>
              <select
                value={newStudentData.semester}
                onChange={(e) => setNewStudentData((p) => ({ ...p, semester: Number(e.target.value) }))}
                className="form-select"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((sm) => (
                  <option key={sm} value={sm}>Semester {sm}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 14 }}>
            <button type="button" onClick={() => setIsAddModalOpen(false)} className="btn-ghost">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Complete Enrollment
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
