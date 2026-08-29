import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { User, Mail, Phone, GraduationCap, Save, ShieldCheck } from 'lucide-react';
import { getInitials } from '../../utils/formatters';

export function StudentProfile() {
  const { currentUser, updateProfile } = useAuth();
  const toast = useToast();

  const [phone, setPhone] = useState(currentUser?.phone || '+91 91234 56789');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile({ phone });
      toast.success('Student contact details updated!');
    } catch (err) {
      toast.error('Failed to update profile');
    }
  };

  return (
    <div>
      <div className="hero-banner">
        <div className="hero-content">
          <h2>Student Profile & Academic Credentials</h2>
          <p>
            Official university student enrollment profile and academic branch records.
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
                {currentUser?.program || 'B.Tech Computer Science & Engineering'}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: 2 }}>
                Roll Number: {currentUser?.rollNumber || '2023CSE0104'}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">University Email ID (Institutional SSO)</label>
              <input
                type="email"
                disabled
                value={currentUser?.email || 'student@nexus.edu'}
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

            <button type="submit" className="btn-primary" style={{ marginTop: 10 }}>
              <Save size={15} /> Save Contact Details
            </button>
          </form>
        </div>

        <div className="glass-card">
          <h3 style={{ margin: '0 0 12px', fontSize: '15px', fontWeight: 800 }}>
            Enrolled Academic Program
          </h3>
          <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div><b>Degree:</b> Bachelor of Technology (B.Tech)</div>
            <div><b>Department:</b> Computer Science & Engineering (CSE)</div>
            <div><b>Academic Standing:</b> Good Standing (CGPA: 8.7)</div>
            <div><b>Assigned Faculty Advisor:</b> Prof. Rajesh Sharma</div>
          </div>
          <div style={{ marginTop: 16, padding: '12px', background: 'rgba(0, 169, 224, 0.08)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: 8, fontSize: '12px', color: 'var(--cyan)' }}>
            <ShieldCheck size={18} /> Student Verification: Active Matriculation Verified
          </div>
        </div>
      </div>
    </div>
  );
}
