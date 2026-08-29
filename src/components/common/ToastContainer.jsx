import React from 'react';
import { useToast } from '../../context/ToastContext';
import { useContext } from 'react';
import { ToastProvider } from '../../context/ToastContext';
import { CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

// Extract actual toasts array via direct hook or component
export function ToastContainer({ toasts = [] }) {
  if (!toasts.length) return null;

  return (
    <div className="toast-container">
      {toasts.map((t) => {
        let Icon = Info;
        let borderColor = 'var(--cyan)';
        let iconColor = 'var(--cyan)';

        if (t.type === 'success') {
          Icon = CheckCircle;
          borderColor = 'var(--green)';
          iconColor = 'var(--green)';
        } else if (t.type === 'error') {
          Icon = AlertCircle;
          borderColor = 'var(--red)';
          iconColor = 'var(--red)';
        } else if (t.type === 'warning') {
          Icon = AlertTriangle;
          borderColor = 'var(--orange)';
          iconColor = 'var(--orange)';
        }

        return (
          <div
            key={t.id}
            className="toast-item"
            style={{ borderLeft: `4px solid ${borderColor}` }}
          >
            <Icon size={18} style={{ color: iconColor, flexShrink: 0 }} />
            <div style={{ fontSize: '12.5px', lineHeight: 1.4 }}>{t.message}</div>
          </div>
        );
      })}
    </div>
  );
}
