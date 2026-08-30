import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useLanguage } from '../../context/LanguageContext';
import { BrandLogo } from '../common/BrandLogo';
import { Shield, Lock, Mail, User, ArrowRight, CheckCircle2, Globe } from 'lucide-react';

export function LoginPage({ onSwitchToRegister }) {
  const { login, loading } = useAuth();
  const toast = useToast();
  const { t, currentLang, changeLanguage, availableLanguages, languageNames } = useLanguage();

  const [email, setEmail] = useState('admin@nexus.edu');
  const [password, setPassword] = useState('admin');
  const [role, setRole] = useState('admin');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await login(email, password, role);
      toast.success(`${t('welcome_to_nexus', 'Welcome to NEXUS')}, ${role.toUpperCase()}!`);
    } catch (err) {
      setError(err.message || t('login_failed', 'Login failed. Please check your credentials.'));
      toast.error(err.message || t('login_failed', 'Login failed'));
    }
  };

  const handleQuickFill = (roleType) => {
    setRole(roleType);
    if (roleType === 'admin') {
      setEmail('admin@nexus.edu');
      setPassword('admin');
    } else if (roleType === 'teacher') {
      setEmail('teacher@nexus.edu');
      setPassword('teacher');
    } else if (roleType === 'student') {
      setEmail('student@nexus.edu');
      setPassword('student');
    }
    setError('');
  };

  return (
    <div className="login-screen">
      {/* Top language selector in login */}
      <div style={{ position: 'absolute', top: 20, right: 20, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.06)', padding: '6px 12px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-subtle)' }}>
          <Globe size={14} style={{ color: 'var(--cyan)' }} />
          <select
            value={currentLang}
            onChange={(e) => changeLanguage(e.target.value)}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', fontSize: '12px', fontWeight: 700, outline: 'none', cursor: 'pointer' }}
          >
            {availableLanguages.map((code) => (
              <option key={code} value={code} style={{ background: '#0b1329', color: '#fff' }}>
                {languageNames[code]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="login-box" style={{ maxWidth: '440px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
          <BrandLogo size="lg" showText={false} />
        </div>

        <h2 style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 4px', letterSpacing: '-0.5px' }}>
          {t('app_name', 'NEXUS UNIVERSITY')}
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: 20 }}>
          {t('app_tagline', 'Faculty Intelligence & Operating Platform')}
        </p>

        {/* Quick Demo Role Selector */}
        <div style={{ marginBottom: 18, background: 'rgba(0,0,0,0.25)', padding: 4, borderRadius: 'var(--radius-md)', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4 }}>
          <button
            type="button"
            onClick={() => handleQuickFill('admin')}
            style={{
              padding: '7px 4px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              fontSize: '11.5px',
              fontWeight: 700,
              cursor: 'pointer',
              background: role === 'admin' ? 'linear-gradient(135deg, var(--blue-dark), var(--blue))' : 'transparent',
              color: role === 'admin' ? '#fff' : 'var(--text-muted)',
              transition: 'all 0.2s ease'
            }}
          >
            {t('role_admin', 'Admin')}
          </button>
          <button
            type="button"
            onClick={() => handleQuickFill('teacher')}
            style={{
              padding: '7px 4px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              fontSize: '11.5px',
              fontWeight: 700,
              cursor: 'pointer',
              background: role === 'teacher' ? 'linear-gradient(135deg, var(--purple), var(--indigo))' : 'transparent',
              color: role === 'teacher' ? '#fff' : 'var(--text-muted)',
              transition: 'all 0.2s ease'
            }}
          >
            {t('role_teacher', 'Teacher')}
          </button>
          <button
            type="button"
            onClick={() => handleQuickFill('student')}
            style={{
              padding: '7px 4px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              fontSize: '11.5px',
              fontWeight: 700,
              cursor: 'pointer',
              background: role === 'student' ? 'linear-gradient(135deg, #059669, #10b981)' : 'transparent',
              color: role === 'student' ? '#fff' : 'var(--text-muted)',
              transition: 'all 0.2s ease'
            }}
          >
            {t('role_student', 'Student')}
          </button>
        </div>

        {error && (
          <div
            style={{
              background: 'var(--red-bg)',
              border: '1px solid var(--red-border)',
              color: 'var(--red)',
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              fontSize: '12px',
              marginBottom: 16,
              textAlign: 'left'
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ textAlign: 'left', marginBottom: 12 }}>
            <label className="form-label">{t('lbl_university_email', 'University Email ID')}</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-dim)' }} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@nexus.edu"
                className="form-input"
                style={{ paddingLeft: 38 }}
              />
            </div>
          </div>

          <div className="form-group" style={{ textAlign: 'left', marginBottom: 16 }}>
            <label className="form-label">{t('lbl_password', 'Password')}</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-dim)' }} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="form-input"
                style={{ paddingLeft: 38 }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '12px', marginTop: 8 }}
          >
            {loading ? t('lbl_authenticating', 'Authenticating Session...') : `${t('btn_login', 'Sign In')} →`}
          </button>
        </form>

        <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
          <span style={{ color: 'var(--text-muted)' }}>{t('lbl_new_to_nexus', 'New to NEXUS University?')}</span>
          <button
            type="button"
            onClick={onSwitchToRegister}
            style={{ background: 'none', border: 'none', color: 'var(--cyan)', fontWeight: 700, cursor: 'pointer' }}
          >
            {t('btn_register', 'Register Account')}
          </button>
        </div>

        <div style={{ marginTop: 14, fontSize: '11px', color: 'var(--text-dim)' }}>
          {t('lbl_demo_quick_fill', 'Demo quick-fill active · Passwords securely masked')}
        </div>
      </div>
    </div>
  );
}
