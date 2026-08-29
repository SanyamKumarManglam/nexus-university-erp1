import React from 'react';

export function PriorityBadge({ priority }) {
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
        URGENT
      </span>
    );
  }

  if (p === 'important') {
    return (
      <span className="badge badge-warning">
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#f59e0b' }}></span>
        IMPORTANT
      </span>
    );
  }

  return (
    <span className="badge badge-info">
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00d2ff' }}></span>
      NORMAL
    </span>
  );
}

export function StatusBadge({ status }) {
  const s = (status || '').toLowerCase();
  
  if (s === 'healthy' || s === 'approved' || s === 'completed' || s === 'hired' || s === 'verified') {
    return <span className="badge badge-success">{status}</span>;
  }
  if (s === 'monitor' || s === 'pending' || s === 'screening' || s === 'shortlisted' || s === 'in progress') {
    return <span className="badge badge-warning">{status}</span>;
  }
  if (s === 'at risk' || s === 'critical' || s === 'rejected' || s === 'overloaded') {
    return <span className="badge badge-danger">{status}</span>;
  }
  return <span className="badge badge-purple">{status}</span>;
}
