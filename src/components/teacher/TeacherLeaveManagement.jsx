import React, { useState, useEffect } from 'react';
import { leaveService } from '../../services/leaveService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { StatusBadge } from '../common/PriorityBadge';
import { Modal } from '../common/Modal';
import {
  Clock,
  Plus,
  Calendar,
  Send,
  CheckCircle2,
  FileText,
  AlertCircle
} from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export function TeacherLeaveManagement() {
  const { currentUser } = useAuth();
  const toast = useToast();

  const [myLeaves, setMyLeaves] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    leaveCategory: 'Casual Leave',
    startDate: new Date().toISOString().slice(0, 10),
    endDate: new Date().toISOString().slice(0, 10),
    reason: '',
    documentAttachment: ''
  });

  const loadData = () => {
    const list = leaveService.getLeavesByApplicant(currentUser?.id || 'T001');
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
        applicantId: currentUser?.id || 'T001',
        applicantName: currentUser?.name || 'Dr. Ananya Mehta',
        applicantDepartment: currentUser?.department || 'ECE',
        applicantRole: 'teacher',
        leaveCategory: formData.leaveCategory,
        startDate: formData.startDate,
        endDate: formData.endDate,
        reason: formData.reason,
        documentAttachment: formData.documentAttachment,
        reviewerId: 'U-ADM-01',
        reviewerName: 'Dr. Rajeshwari Sundaram (Dean Academic Affairs)'
      });

      toast.success('Leave application submitted to Dean Academic Affairs for approval!');
      setIsModalOpen(false);
      setFormData({
        leaveCategory: 'Casual Leave',
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
          <h2>Faculty Leave Management & Duty Requests</h2>
          <p>
            Submit leave requests for academic conferences, FDP duty, or personal days directly to University Administration.
          </p>
          <div className="hero-actions">
            <button className="btn-white" onClick={() => setIsModalOpen(true)}>
              <Plus size={16} /> + Submit Leave Application
            </button>
          </div>
        </div>
      </div>

      {/* Leave Balance Overview Cards */}
      <div className="cards-grid">
        <div className="glass-card">
          <div className="metric-label">Casual Leave Balance</div>
          <div className="metric-value">6 Days</div>
          <div className="metric-delta delta-neutral">Annual quota: 12 days</div>
        </div>

        <div className="glass-card">
          <div className="metric-label">Academic / Duty Leave</div>
          <div className="metric-value">4 Days</div>
          <div className="metric-delta delta-up">For conferences and FDPs</div>
        </div>

        <div className="glass-card">
          <div className="metric-label">Medical Leave Balance</div>
          <div className="metric-value">8 Days</div>
          <div className="metric-delta delta-neutral">Requires medical certificate</div>
        </div>

        <div className="glass-card">
          <div className="metric-label">Pending Requests</div>
          <div className="metric-value">
            {myLeaves.filter((l) => l.status === 'Pending').length}
          </div>
          <div className="metric-delta delta-neutral">Awaiting Dean review</div>
        </div>
      </div>

      {/* Leave Ledger Table */}
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
              <th>Reason Stated</th>
              <th>Admin Reviewer</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {myLeaves.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                  No leave requests submitted yet.
                </td>
              </tr>
            ) : (
              myLeaves.map((l) => (
                <tr key={l.id}>
                  <td>
                    <b>{l.id}</b>
                  </td>
                  <td>
                    <span className="badge badge-purple" style={{ textTransform: 'none' }}>
                      {l.leaveCategory}
                    </span>
                  </td>
                  <td>
                    {formatDate(l.startDate)} → {formatDate(l.endDate)}
                  </td>
                  <td>
                    <b>{l.totalDays} Days</b>
                  </td>
                  <td>
                    <div style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={l.reason}>
                      {l.reason}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: '12px' }}>{l.reviewerName}</div>
                  </td>
                  <td>
                    <StatusBadge status={l.status.toLowerCase()} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Submit Leave Application Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Faculty Leave & Duty Request">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Leave Category</label>
            <select
              value={formData.leaveCategory}
              onChange={(e) => setFormData((p) => ({ ...p, leaveCategory: e.target.value }))}
              className="form-select"
            >
              <option value="Casual Leave">Casual Leave</option>
              <option value="Academic / Duty Leave">Academic / Duty Leave (Conference / Workshop)</option>
              <option value="Medical Leave">Medical Leave</option>
              <option value="Special Sabbatical">Special Sabbatical</option>
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
            <label className="form-label">Reason for Absence / Duty Details *</label>
            <textarea
              required
              rows={3}
              value={formData.reason}
              onChange={(e) => setFormData((p) => ({ ...p, reason: e.target.value }))}
              placeholder="State reason, conference name, or duty location..."
              className="form-textarea"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 14 }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn-ghost">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              <Send size={15} /> Submit Application to Dean
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
