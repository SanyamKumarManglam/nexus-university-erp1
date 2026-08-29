import React, { useState, useEffect } from 'react';
import { calendarService } from '../../services/calendarService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Modal } from '../common/Modal';
import {
  Calendar,
  Plus,
  Trash2,
  Edit,
  Clock,
  MapPin,
  Tag,
  Filter,
  CheckCircle2
} from 'lucide-react';
import { formatDate } from '../../utils/formatters';

const CATEGORY_COLORS = {
  'WORKING DAY': 'var(--cyan)',
  'HOLIDAY': 'var(--green)',
  'EVENT': 'var(--purple-light)',
  'EXAM': 'var(--red)',
  'FDP': 'var(--orange)',
  'CLOSURE': '#e11d48'
};

export function UniversityCalendar() {
  const { role } = useAuth();
  const toast = useToast();

  const [events, setEvents] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    category: 'EVENT',
    date: new Date().toISOString().slice(0, 10),
    endDate: new Date().toISOString().slice(0, 10),
    description: '',
    location: 'Campus Wide',
    department: 'All'
  });

  const loadData = () => {
    setEvents(calendarService.getAllEvents());
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredEvents = events.filter((e) => {
    if (!selectedCategory) return true;
    return e.category === selectedCategory;
  });

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      title: '',
      category: 'EVENT',
      date: new Date().toISOString().slice(0, 10),
      endDate: new Date().toISOString().slice(0, 10),
      description: '',
      location: 'Campus Wide',
      department: 'All'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (evt) => {
    setEditingId(evt.id);
    setFormData({
      title: evt.title,
      category: evt.category,
      date: evt.date,
      endDate: evt.endDate || evt.date,
      description: evt.description || '',
      location: evt.location || 'Campus Wide',
      department: evt.department || 'All'
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id, title) => {
    if (window.confirm(`Delete calendar event "${title}"?`)) {
      try {
        calendarService.deleteEvent(id);
        loadData();
        toast.success('Calendar entry deleted');
      } catch (e) {
        toast.error('Failed to delete event');
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.date) {
      toast.error('Title and start date are required');
      return;
    }

    try {
      if (editingId) {
        calendarService.updateEvent(editingId, formData);
        toast.success('Event updated');
      } else {
        calendarService.addEvent(formData);
        toast.success('Calendar event added');
      }
      loadData();
      setIsModalOpen(false);
    } catch (err) {
      toast.error('Failed to save calendar event');
    }
  };

  return (
    <div>
      <div className="hero-banner">
        <div className="hero-content">
          <h2>University Academic Calendar & Event Scheduler</h2>
          <p>
            Official institutional schedule tracking working days, statutory holidays, mid-term/final examinations, faculty development programs (FDP), and campus festivals.
          </p>
          {role === 'admin' && (
            <div className="hero-actions">
              <button className="btn-white" onClick={handleOpenCreate}>
                <Plus size={16} /> + Add Calendar Event
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Category Pills Filter Bar */}
      <div className="glass-card" style={{ marginBottom: 20, padding: '12px 18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <button
              onClick={() => setSelectedCategory('')}
              className={`tab-btn ${!selectedCategory ? 'active' : ''}`}
              style={{ padding: '6px 12px', fontSize: '12px' }}
            >
              All Events ({events.length})
            </button>
            {['WORKING DAY', 'HOLIDAY', 'EXAM', 'EVENT', 'FDP'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`tab-btn ${selectedCategory === cat ? 'active' : ''}`}
                style={{ padding: '6px 12px', fontSize: '12px' }}
              >
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: CATEGORY_COLORS[cat] || '#fff', display: 'inline-block', marginRight: 6 }}></span>
                {cat}
              </button>
            ))}
          </div>

          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Showing <b>{filteredEvents.length}</b> events
          </span>
        </div>
      </div>

      {/* Events Timeline / List */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
        {filteredEvents.map((evt) => {
          const color = CATEGORY_COLORS[evt.category] || 'var(--cyan)';

          return (
            <div
              key={evt.id}
              className="glass-card"
              style={{
                borderTop: `4px solid ${color}`,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '18px'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <span
                    style={{
                      fontSize: '10.5px',
                      fontWeight: 800,
                      color,
                      background: 'rgba(255,255,255,0.05)',
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-full)',
                      border: `1px solid ${color}44`
                    }}
                  >
                    {evt.category}
                  </span>

                  {role === 'admin' && (
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button onClick={() => handleOpenEdit(evt)} className="icon-btn" style={{ width: 26, height: 26 }} title="Edit">
                        <Edit size={12} />
                      </button>
                      <button onClick={() => handleDelete(evt.id, evt.title)} className="icon-btn" style={{ width: 26, height: 26, color: 'var(--red)' }} title="Delete">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  )}
                </div>

                <h3 style={{ margin: '0 0 6px', fontSize: '15px', fontWeight: 800, color: 'var(--text-main)' }}>
                  {evt.title}
                </h3>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.45 }}>
                  {evt.description}
                </p>
              </div>

              <div style={{ marginTop: 14, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11.5px', color: 'var(--text-dim)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Calendar size={13} style={{ color }} /> {formatDate(evt.date)}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <MapPin size={13} /> {evt.location}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Event Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit Calendar Event' : 'Add University Calendar Event'}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Event / Entry Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
              placeholder="e.g. Mid-Semester Examinations"
              className="form-input"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))}
                className="form-select"
              >
                <option value="WORKING DAY">WORKING DAY</option>
                <option value="HOLIDAY">HOLIDAY</option>
                <option value="EXAM">EXAM</option>
                <option value="EVENT">EVENT</option>
                <option value="FDP">FDP (Faculty Dev)</option>
                <option value="CLOSURE">UNIVERSITY CLOSURE</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Location / Venue</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData((p) => ({ ...p, location: e.target.value }))}
                placeholder="Auditorium / Campus Wide"
                className="form-input"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Start Date *</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData((p) => ({ ...p, date: e.target.value, endDate: p.endDate < e.target.value ? e.target.value : p.endDate }))}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">End Date</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData((p) => ({ ...p, endDate: e.target.value }))}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description / Instructions</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
              placeholder="Provide event notes, attendance instructions, etc."
              className="form-textarea"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 14 }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn-ghost">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {editingId ? 'Save Event Changes' : 'Schedule Event'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
