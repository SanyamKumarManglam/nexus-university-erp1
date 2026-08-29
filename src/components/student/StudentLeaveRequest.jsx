import React, { useState, useEffect } from 'react';
import { leaveService } from '../../services/leaveService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { StatusBadge } from '../common/PriorityBadge';
import { Modal } from '../common/Modal';
import { Clock, Plus, Send, Calendar, CheckCircle2, FileText } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export function StudentLeaveRequest() {
  const { currentUser } = useAuth();
  const toast = useToast();

  const [myLeaves, setMyLeaves] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    leaveCategory: 'Medical Leave',
    startDate: new Date().toISOString().slice(0, 10),
    endDate: new Date().toISOString().slice(0, 10),
    reason: '',
    documentAttachment: ''
  });

  const loadData = () => {
    const list = leaveService.getLeavesByApplicant(currentUser?.id || 'STU-001');
    setMyLeaves(list);
  };

  useEffect(() => {
    loadData();
  }, [currentUser]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.reason) {
      toast.error('Please enter a reason for leave');
      return;
    }

    try {
      leaveService.submitLeaveRequest({
        applicantId: currentUser?.id || 'STU-001',
        applicantName: currentUser?.name || 'Rahul Sharma',
        applicantDepartment: currentUser?.department || 'CSE',
        applicantRole: 'student',
        leaveCategory: formData.leaveCategory,
        startDate: formData.startDate,
        endDate: formData.endDate,
        reason: formData.reason,
        documentAttachment: formData.documentAttachment,
        reviewerId: currentUser?.advisorId || 'T004',
        reviewerName: currentUser?.advisorName || 'Prof. Rajesh Sharma'
      });

      toast.success('Leave application submitted to assigned Faculty Advisor!');
      setIsModalOpen(false);
      setFormData({
        leaveCategory: 'Medical Leave',
        startDate: new Date().toISOString().slice(0, 10),
        endDate: new Date().toISOString().slice(0, 10),
        reason: '',
        documentAttachment: ''
      });
      loadData();
    } catch (err) {
      toast.error('Failed to submit leave request');
    }
  };

  return (
    <div>
      <div className="hero-banner">
        <div className="hero-content">
          <h2>Student Leave Applications & Absence Approvals</h2>
          <p>
            Submit leave requests for medical recovery, academic competitions, or family events directly to your faculty advisor. Approved leaves are excused from attendance deficit flags.
          </p>
          <div className="hero-actions">
            <button className="btn-white" onClick={() => setIsModalOpen(true)}>
              <Plus size={16} /> + Submit Leave Request
            </button>
          </div>
        </div>
      </div>

      {/* Leave Application Ledger */}
      <div className="glass-card table-container">
        <h3 style={{ margin: '0 0 14px', fontSize: '15px', fontWeight: 800 }}>
          My Submitted Leave Applications
        </h3>

        <table className="custom-table">
          <thead>
            <tr>
              <th>Application ID</th>
              <th>Category</th>
              <th>Date Duration</th>
              <th>Total Days</th>
              <th>Reason</th>
              <th>Advisor Reviewer</th>
              <th>Status</th>
              <th>Advisor Comments</th>
            </tr>
          </thead>
          <tbody>
            {myLeaves.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                  No leave requests submitted yet.
                </td>
              </tr>
            ) : (
              myLeaves.map((l) => (
                <tr key={l.id}>
                  <td><b>{l.id}</b></td>
                  <td>
                    <span className="badge badge-purple" style={{ textTransform: 'none' }}>
                      {l.leaveCategory}
                    </span>
                  </td>
                  <td>{formatDate(l.startDate)} → {formatDate(l.endDate)}</td>
                  <td><b>{l.totalDays} Days</b></td>
                  <td>
                    <div style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={l.reason}>
                      {l.reason}
                    </div>
                  </td>
                  <td>{l.reviewerName}</td>
                  <td>
                    <StatusBadge status={l.status.toLowerCase()} />
                  </td>
                  <td>
                    <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                      {l.reviewerComment || '—'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Submit Leave Application Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Submit Student Leave Application">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Leave Category</label>
            <select
              value={formData.leaveCategory}
              onChange={(e) => setFormData((p) => ({ ...p, leaveCategory: e.target.value }))}
              className="form-select"
            >
              <option value="Medical Leave">Medical Leave</option>
              <option value="Academic / Hackathon">Academic / Hackathon / Conference</option>
              <option value="Personal / Family">Personal / Family Emergency</option>
              <option value="Casual Leave">Casual Leave</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Start Date *</label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => setFormData((p) => ({ ...p, startDate: e.target.value, endDate: p.endDate < e.target.value ? e.target.value : p.endDate }))}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">End Date *</label>
              <input
                type="date"
                required
                value={formData.endDate}
                onChange={(e) => setFormData((p) => ({ ...p, endDate: e.target.value }))}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Reason for Leave *</label>
            <textarea
              required
              rows={3}
              value={formData.reason}
              onChange={(e) => setFormData((p) => ({ ...p, reason: e.target.value }))}
              placeholder="State reason clearly for advisor approval..."
              className="form-textarea"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 14 }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn-ghost">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              <Send size={15} /> Submit Application to Advisor
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
