import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { BrandLogo } from '../common/BrandLogo';
import { validateRegistration } from '../../utils/validation';
import { User, Mail, Phone, Lock, Calendar, ArrowLeft, CheckCircle2 } from 'lucide-react';

export function RegisterPage({ onSwitchToLogin }) {
  const { register, loading } = useAuth();
  const toast = useToast();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'teacher',
    department: 'CSE'
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const validation = validateRegistration(formData);
    if (!validation.valid) {
      setErrors(validation.errors);
      toast.error('Please resolve the errors highlighted below.');
      return;
    }

    try {
      await register(formData);
      toast.success('Registration successful! Welcome to NEXUS.');
    } catch (err) {
      toast.error(err.message || 'Registration failed.');
      setErrors({ form: err.message });
    }
  };

  return (
    <div className="login-screen" style={{ overflowY: 'auto', padding: '30px 16px' }}>
      <div className="login-box" style={{ maxWidth: '520px', textAlign: 'left' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <button
            type="button"
            onClick={onSwitchToLogin}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: '12.5px',
              fontWeight: 600
            }}
          >
            <ArrowLeft size={16} /> Back to Sign In
          </button>
          <BrandLogo size="sm" />
        </div>

        <h2 style={{ fontSize: '22px', fontWeight: 800, margin: '0 0 4px', color: 'var(--text-main)' }}>
          Create University Account
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: 20 }}>
          Join the NEXUS institutional operating ecosystem
        </p>

        {errors.form && (
          <div
            style={{
              background: 'var(--red-bg)',
              border: '1px solid var(--red-border)',
              color: 'var(--red)',
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              fontSize: '12px',
              marginBottom: 16
            }}
          >
            {errors.form}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* First & Last Name */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">First Name *</label>
              <input
                type="text"
                name="firstName"
                required
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Dr. / Prof. / First"
                className="form-input"
              />
              {errors.firstName && <div className="form-error">{errors.firstName}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Last Name *</label>
              <input
                type="text"
                name="lastName"
                required
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last Name"
                className="form-input"
              />
              {errors.lastName && <div className="form-error">{errors.lastName}</div>}
            </div>
          </div>

          {/* Age & Department */}
          <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Age *</label>
              <input
                type="number"
                name="age"
                required
                min={16}
                max={100}
                value={formData.age}
                onChange={handleChange}
                placeholder="Age"
                className="form-input"
              />
              {errors.age && <div className="form-error">{errors.age}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Department</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="form-select"
              >
                <option value="CSE">Computer Science & Eng (CSE)</option>
                <option value="ECE">Electronics & Comm (ECE)</option>
                <option value="Mechanical">Mechanical Engineering</option>
                <option value="Biotechnology">Biotechnology</option>
                <option value="Operations">University Operations</option>
              </select>
            </div>
          </div>

          {/* Email & Phone */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Email ID *</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="user@nexus.edu"
                className="form-input"
              />
              {errors.email && <div className="form-error">{errors.email}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number *</label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 98765 00000"
                className="form-input"
              />
              {errors.phone && <div className="form-error">{errors.phone}</div>}
            </div>
          </div>

          {/* Role Selection */}
          <div className="form-group">
            <label className="form-label">Select University Role *</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {['admin', 'teacher', 'student'].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setFormData((p) => ({ ...p, role: r }))}
                  style={{
                    padding: '9px 8px',
                    borderRadius: 'var(--radius-md)',
                    border: formData.role === r ? '1.5px solid var(--cyan)' : '1px solid var(--border-subtle)',
                    background: formData.role === r ? 'rgba(0, 169, 224, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                    color: formData.role === r ? '#ffffff' : 'var(--text-muted)',
                    fontWeight: 700,
                    fontSize: '12px',
                    textTransform: 'capitalize',
                    cursor: 'pointer'
                  }}
                >
                  {r === 'admin' ? 'Administrator' : r === 'teacher' ? 'Teacher / Faculty' : 'Student'}
                </button>
              ))}
            </div>
            {errors.role && <div className="form-error">{errors.role}</div>}
          </div>

          {/* Password & Confirm Password */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Password *</label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Min. 6 chars"
                className="form-input"
              />
              {errors.password && <div className="form-error">{errors.password}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password *</label>
              <input
                type="password"
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Repeat password"
                className="form-input"
              />
              {errors.confirmPassword && <div className="form-error">{errors.confirmPassword}</div>}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '12px', marginTop: 10 }}
          >
            {loading ? 'Creating University Account...' : 'Complete Registration →'}
          </button>
        </form>

        <div style={{ marginTop: 18, textAlign: 'center', fontSize: '12px', color: 'var(--text-dim)' }}>
          Already have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            style={{ background: 'none', border: 'none', color: 'var(--cyan)', fontWeight: 700, cursor: 'pointer' }}
          >
            Sign in here
          </button>
        </div>
      </div>
    </div>
  );
}
