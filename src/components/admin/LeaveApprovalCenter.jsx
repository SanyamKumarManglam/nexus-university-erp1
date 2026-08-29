import React, { useState, useEffect } from 'react';
import { leaveService } from '../../services/leaveService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { StatusBadge } from '../common/PriorityBadge';
import { Modal } from '../common/Modal';
import {
  Clock,
  CheckCircle2,
  XCircle,
  Calendar,
  User,
  FileText,
  MessageSquare,
  Search,
  Filter
} from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export function LeaveApprovalCenter() {
  const { currentUser, role } = useAuth();
  const toast = useToast();

  const [leaves, setLeaves] = useState([]);
  const [activeTab, setActiveTab] = useState(role === 'admin' ? 'faculty' : 'student'); // 'faculty' or 'student'
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [reviewerComment, setReviewerComment] = useState('');

  const loadData = () => {
    setLeaves(leaveService.getAllLeaves());
  };

  useEffect(() => {
    loadData();
  }, []);

  const facultyLeaves = leaves.filter((l) => l.type === 'teacher');
  const studentLeaves = leaves.filter((l) => l.type === 'student');

  const currentList = activeTab === 'faculty' ? facultyLeaves : studentLeaves;

  const handleOpenReview = (leave) => {
    setSelectedLeave(leave);
    setReviewerComment(leave.reviewerComment || '');
    setReviewModalOpen(true);
  };

  const handleUpdateStatus = (newStatus) => {
    if (!selectedLeave) return;

    try {
      leaveService.updateLeaveStatus(selectedLeave.id, newStatus, reviewerComment);
      loadData();
      setReviewModalOpen(false);
      toast.success(`Leave request ${newStatus.toLowerCase()} successfully!`);
    } catch (e) {
      toast.error('Failed to update leave status');
    }
  };

  return (
    <div>
      <div className="hero-banner">
        <div className="hero-content">
          <h2>Institutional Leave Governance Center</h2>
          <p>
            Two-tiered automated leave workflows: Administrators govern faculty and duty leaves; authorized academic advisors approve student absence requests.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="glass-card" style={{ marginBottom: 20, padding: '12px 18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div className="tabs-container" style={{ margin: 0, border: 'none' }}>
            <button
              onClick={() => setActiveTab('faculty')}
              className={`tab-btn ${activeTab === 'faculty' ? 'active' : ''}`}
            >
              Faculty Leaves ({facultyLeaves.filter((l) => l.status === 'Pending').length} Pending)
            </button>
            <button
              onClick={() => setActiveTab('student')}
              className={`tab-btn ${activeTab === 'student' ? 'active' : ''}`}
            >
              Student Leaves ({studentLeaves.filter((l) => l.status === 'Pending').length} Pending)
            </button>
          </div>

          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Showing <b>{currentList.length}</b> total requests
          </span>
        </div>
      </div>

      {/* Leaves Table */}
      <div className="glass-card table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Applicant</th>
              <th>Category</th>
              <th>Date Duration</th>
              <th>Days</th>
              <th>Reason</th>
              <th>Assigned Reviewer</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentList.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                  No leave records found in this category.
                </td>
              </tr>
            ) : (
              currentList.map((leave) => (
                <tr key={leave.id}>
                  <td>
                    <b>{leave.applicantName}</b>
                    <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                      {leave.applicantDepartment} · {leave.applicantRole}
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-purple" style={{ textTransform: 'none', fontSize: '11.5px' }}>
                      {leave.leaveCategory}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontSize: '12px' }}>
                      {formatDate(leave.startDate)} → {formatDate(leave.endDate)}
                    </div>
                  </td>
                  <td>
                    <b>{leave.totalDays}d</b>
                  </td>
                  <td>
                    <div style={{ fontSize: '12px', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={leave.reason}>
                      {leave.reason}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: '12px' }}>{leave.reviewerName}</div>
                  </td>
                  <td>
                    <StatusBadge status={leave.status.toLowerCase()} />
                  </td>
                  <td>
                    <button
                      onClick={() => handleOpenReview(leave)}
                      className="btn-secondary"
                      style={{ padding: '6px 12px', fontSize: '11.5px' }}
                    >
                      Review Request
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Review Modal */}
      {selectedLeave && (
        <Modal isOpen={reviewModalOpen} onClose={() => setReviewModalOpen(false)} title="Review Leave Application">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <b style={{ fontSize: '15px', color: 'var(--text-main)' }}>{selectedLeave.applicantName}</b>
                <StatusBadge status={selectedLeave.status.toLowerCase()} />
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Department of {selectedLeave.applicantDepartment} · {selectedLeave.applicantRole}
              </div>
              <div style={{ fontSize: '12.5px', marginTop: 8 }}>
                <b>Dates:</b> {formatDate(selectedLeave.startDate)} to {formatDate(selectedLeave.endDate)} ({selectedLeave.totalDays} Days)
              </div>
              <div style={{ fontSize: '12.5px', marginTop: 4 }}>
                <b>Category:</b> {selectedLeave.leaveCategory}
              </div>
            </div>

            <div>
              <b style={{ fontSize: '12.5px', color: 'var(--text-main)' }}>Reason Stated by Applicant:</b>
              <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.02)', padding: '10px 12px', borderRadius: 'var(--radius-md)' }}>
                {selectedLeave.reason}
              </p>
            </div>

            <div className="form-group">
              <label className="form-label">Reviewer Comments / Substitute Instructions</label>
              <textarea
                rows={3}
                value={reviewerComment}
                onChange={(e) => setReviewerComment(e.target.value)}
                placeholder="e.g. Duty leave approved. Substitute lectures assigned..."
                className="form-textarea"
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
              <button
                type="button"
                onClick={() => handleUpdateStatus('Rejected')}
                className="btn-danger"
              >
                <XCircle size={15} /> Reject Request
              </button>

              <div style={{ display: 'flex', gap: 8 }}>
                <button type="button" onClick={() => setReviewModalOpen(false)} className="btn-ghost">
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateStatus('Approved')}
                  className="btn-primary"
                  style={{ background: 'linear-gradient(135deg, #059669, #10b981)' }}
                >
                  <CheckCircle2 size={16} /> Grant & Approve Leave
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
