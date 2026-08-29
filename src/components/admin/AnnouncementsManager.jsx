import React, { useState, useEffect } from 'react';
import { announcementService } from '../../services/announcementService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { PriorityBadge } from '../common/PriorityBadge';
import { Modal } from '../common/Modal';
import {
  Megaphone,
  Plus,
  Trash2,
  Edit,
  Calendar,
  Users,
  Search,
  Filter,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export function AnnouncementsManager() {
  const { currentUser, role } = useAuth();
  const toast = useToast();

  const [announcements, setAnnouncements] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    message: '',
    priority: 'Normal',
    audience: 'Everyone',
    targetDepartment: '',
    targetClass: ''
  });

  const loadData = () => {
    setAnnouncements(announcementService.getAllAnnouncements());
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = announcements.filter((a) => {
    const matchesSearch =
      !searchQuery ||
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.message.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPriority = !priorityFilter || a.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      title: '',
      message: '',
      priority: 'Normal',
      audience: 'Everyone',
      targetDepartment: '',
      targetClass: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (ann) => {
    setEditingId(ann.id);
    setFormData({
      title: ann.title,
      message: ann.message,
      priority: ann.priority,
      audience: ann.audience,
      targetDepartment: ann.targetDepartment || '',
      targetClass: ann.targetClass || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id, title) => {
    if (window.confirm(`Delete announcement "${title}"?`)) {
      try {
        announcementService.deleteAnnouncement(id);
        loadData();
        toast.success('Announcement deleted');
      } catch (e) {
        toast.error('Failed to delete');
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.message) {
      toast.error('Title and message are required');
      return;
    }

    try {
      if (editingId) {
        announcementService.updateAnnouncement(editingId, formData);
        toast.success('Announcement updated');
      } else {
        announcementService.createAnnouncement({
          ...formData,
          authorId: currentUser?.id || 'ADM-01',
          authorName: currentUser?.name || 'Administrator'
        });
        toast.success('Announcement published and dispatched!');
      }
      loadData();
      setIsModalOpen(false);
    } catch (err) {
      toast.error('Failed to publish announcement');
    }
  };

  return (
    <div>
      <div className="hero-banner">
        <div className="hero-content">
          <h2>Central Announcements Hub</h2>
          <p>
            Publish targeted institutional broadcasts across departments, faculty channels, and student cohorts with multi-tier priority tagging.
          </p>
          {(role === 'admin' || role === 'teacher') && (
            <div className="hero-actions">
              <button className="btn-white" onClick={handleOpenCreate}>
                <Plus size={16} /> + Publish New Announcement
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-card" style={{ marginBottom: 20, padding: '14px 18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: '260px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={16} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-dim)' }} />
              <input
                type="text"
                placeholder="Search announcements by title or content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input"
                style={{ paddingLeft: 38, fontSize: '13px' }}
              />
            </div>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="form-select"
              style={{ width: '150px', fontSize: '13px' }}
            >
              <option value="">All Priorities</option>
              <option value="Urgent">Urgent</option>
              <option value="Important">Important</option>
              <option value="Normal">Normal</option>
            </select>
          </div>

          <div style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
            Showing <b>{filtered.length}</b> announcements
          </div>
        </div>
      </div>

      {/* Announcements List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {filtered.length === 0 ? (
          <div className="glass-card" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            No announcements found matching filter criteria.
          </div>
        ) : (
          filtered.map((ann) => (
            <div
              key={ann.id}
              className="glass-card"
              style={{
                borderLeft: ann.priority === 'Urgent' ? '4px solid var(--red)' : ann.priority === 'Important' ? '4px solid var(--orange)' : '4px solid var(--cyan)',
                padding: '20px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10, marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <PriorityBadge priority={ann.priority} />
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: 'var(--text-main)' }}>
                    {ann.title}
                  </h3>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Calendar size={13} /> {formatDate(ann.publishDate)}
                  </span>
                  {(role === 'admin' || ann.authorId === currentUser?.id) && (
                    <div style={{ display: 'flex', gap: 4, marginLeft: 8 }}>
                      <button onClick={() => handleOpenEdit(ann)} className="icon-btn" style={{ width: 28, height: 28 }} title="Edit">
                        <Edit size={13} />
                      </button>
                      <button onClick={() => handleDelete(ann.id, ann.title)} className="icon-btn" style={{ width: 28, height: 28, color: 'var(--red)' }} title="Delete">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <p style={{ margin: '8px 0 14px', fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                {ann.message}
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.05)', fontSize: '11.5px', color: 'var(--text-dim)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Users size={13} style={{ color: 'var(--cyan)' }} />
                  Target Audience: <b>{ann.audience}</b> {ann.targetDepartment && `(${ann.targetDepartment})`} {ann.targetClass && `(${ann.targetClass})`}
                </span>
                <span>By: <b>{ann.authorName}</b></span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create / Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit Announcement' : 'Publish Institutional Announcement'}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Announcement Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
              placeholder="e.g. Mid-Semester Timetable Released"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Broadcast Message *</label>
            <textarea
              required
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData((p) => ({ ...p, message: e.target.value }))}
              placeholder="Enter full notice body..."
              className="form-textarea"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Priority Tag</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData((p) => ({ ...p, priority: e.target.value }))}
                className="form-select"
              >
                <option value="Normal">Normal</option>
                <option value="Important">Important</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Target Audience</label>
              <select
                value={formData.audience}
                onChange={(e) => setFormData((p) => ({ ...p, audience: e.target.value }))}
                className="form-select"
              >
                <option value="Everyone">Everyone</option>
                <option value="Teachers">Teachers / Faculty Only</option>
                <option value="Students">Students Only</option>
                <option value="Specific Department">Specific Department</option>
                <option value="Specific Class">Specific Class</option>
              </select>
            </div>
          </div>

          {formData.audience === 'Specific Department' && (
            <div className="form-group">
              <label className="form-label">Select Department</label>
              <select
                value={formData.targetDepartment}
                onChange={(e) => setFormData((p) => ({ ...p, targetDepartment: e.target.value }))}
                className="form-select"
              >
                <option value="CSE">CSE</option>
                <option value="ECE">ECE</option>
                <option value="Mechanical">Mechanical</option>
                <option value="Biotechnology">Biotechnology</option>
              </select>
            </div>
          )}

          {formData.audience === 'Specific Class' && (
            <div className="form-group">
              <label className="form-label">Enter Class Code</label>
              <input
                type="text"
                value={formData.targetClass}
                onChange={(e) => setFormData((p) => ({ ...p, targetClass: e.target.value }))}
                placeholder="e.g. CSE-3A"
                className="form-input"
              />
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-end', gap: 10, marginTop: 16 }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn-ghost">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {editingId ? 'Save Changes' : 'Broadcast Announcement'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
