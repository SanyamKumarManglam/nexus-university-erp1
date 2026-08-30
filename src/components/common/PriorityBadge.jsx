import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

export function PriorityBadge({ priority }) {
  const { t } = useLanguage();
  const p = (priority || 'Normal').toLowerCase();

  if (p === 'urgent') {
    return (
      <span
        className="badge badge-danger"
        style={{
          boxShadow: '0 0 12px rgba(239, 68, 68, 0.45)',
          animation: 'pulse 2s infinite'
        }}
      >
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ef4444' }}></span>
        {t('priority_urgent', 'URGENT')}
      </span>
    );
  }

  if (p === 'important') {
    return (
      <span className="badge badge-warning">
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#f59e0b' }}></span>
        {t('priority_important', 'IMPORTANT')}
      </span>
    );
  }

  return (
    <span className="badge badge-info">
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00d2ff' }}></span>
      {t('priority_normal', 'NORMAL')}
    </span>
  );
}

export function StatusBadge({ status }) {
  const { t } = useLanguage();
  const s = (status || '').toLowerCase().trim();
  const key = 'status_' + s.replace(/[\s-]+/g, '_');
  const translatedStatus = t(key, status);
  
  if (s === 'healthy' || s === 'approved' || s === 'completed' || s === 'hired' || s === 'verified' || s === 'available' || s === 'balanced') {
    return <span className="badge badge-success">{translatedStatus}</span>;
  }
  if (s === 'monitor' || s === 'pending' || s === 'screening' || s === 'shortlisted' || s === 'in progress') {
    return <span className="badge badge-warning">{translatedStatus}</span>;
  }
  if (s === 'at risk' || s === 'critical' || s === 'rejected' || s === 'overloaded' || s === 'critical overload') {
    return <span className="badge badge-danger">{translatedStatus}</span>;
  }
  return <span className="badge badge-purple">{translatedStatus}</span>;
}
