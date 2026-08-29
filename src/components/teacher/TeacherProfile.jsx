import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { User, Mail, Phone, BookOpen, Save, ShieldCheck } from 'lucide-react';
import { getInitials } from '../../utils/formatters';

export function TeacherProfile() {
  const { currentUser, updateProfile } = useAuth();
  const toast = useToast();

  const [phone, setPhone] = useState(currentUser?.phone || '+91 98765 43210');
  const [department, setDepartment] = useState(currentUser?.department || 'ECE');
  const [subjects, setSubjects] = useState('VLSI Design, Embedded Systems, Digital Electronics');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile({ phone, department });
      toast.success('Faculty profile details updated!');
    } catch (err) {
      toast.error('Failed to update profile');
    }
  };

  return (
    <div>
      <div className="hero-banner">
        <div className="hero-content">
          <h2>Faculty Profile & Preferences</h2>
          <p>
            Manage non-sensitive institutional directory details, office contact information, and teaching specializations.
          </p>
        </div>
      </div>

      <div className="grid-2">
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
            <div className="avatar-circle" style={{ width: 54, height: 54, fontSize: '18px' }}>
              {getInitials(currentUser?.name)}
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>{currentUser?.name}</h3>
              <div style={{ fontSize: '12.5px', color: 'var(--cyan)' }}>
                {currentUser?.designation || 'Associate Professor'} · Dept. of {currentUser?.department || 'ECE'}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: 2 }}>
                University Faculty ID: {currentUser?.id}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">University Email (Read-Only)</label>
              <input
                type="email"
                disabled
                value={currentUser?.email || 'teacher@nexus.edu'}
                className="form-input"
                style={{ opacity: 0.7, cursor: 'not-allowed' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Contact Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="form-select"
              >
                <option value="CSE">Computer Science & Engineering</option>
                <option value="ECE">Electronics & Communication</option>
                <option value="Mechanical">Mechanical Engineering</option>
                <option value="Biotechnology">Biotechnology</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Teaching Specializations</label>
              <input
                type="text"
                value={subjects}
                onChange={(e) => setSubjects(e.target.value)}
                className="form-input"
              />
            </div>

            <button type="submit" className="btn-primary" style={{ marginTop: 10 }}>
              <Save size={15} /> Save Profile Changes
            </button>
          </form>
        </div>

        <div className="glass-card">
          <h3 style={{ margin: '0 0 12px', fontSize: '15px', fontWeight: 800 }}>
            Security & Authentication
          </h3>
          <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            <p>Your account is authenticated via institutional Single Sign-On session tokens. Passwords and cryptographic tokens are protected with zero-exposure policies.</p>
          </div>
          <div style={{ marginTop: 16, padding: '12px', background: 'rgba(0, 169, 224, 0.08)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: 8, fontSize: '12px', color: 'var(--cyan)' }}>
            <ShieldCheck size={18} /> Role Authorization: Teacher / Faculty Verified
          </div>
        </div>
      </div>
    </div>
  );
}
