import React, { useRef, useEffect } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { useLanguage } from '../../context/LanguageContext';
import { Bell, CheckCheck, Megaphone, Calendar, UserCheck, AlertTriangle, Briefcase } from 'lucide-react';

export function NotificationDrawer({ isOpen, onClose, onNavigate }) {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();
  const { t } = useLanguage();
  const drawerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target) && isOpen) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleItemClick = (notif) => {
    markAsRead(notif.id);
    onClose();
    if (onNavigate && notif.targetNav) {
      onNavigate(notif.targetNav);
    }
  };

  return (
    <div
      ref={drawerRef}
      className="dropdown-menu"
      style={{
        width: '360px',
        right: 0,
        top: 'calc(100% + 10px)',
        padding: '0',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-lg)'
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '14px 18px',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'var(--bg-surface)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Bell size={16} style={{ color: 'var(--cyan)' }} />
          <span style={{ fontWeight: 800, fontSize: '13.5px' }}>{t('notifications', 'Notifications')}</span>
        </div>
        <button
          onClick={markAllAsRead}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--cyan)',
            fontSize: '11.5px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 4
          }}
        >
          <CheckCheck size={14} /> {t('btn_mark_all_read', 'Mark all read')}
        </button>
      </div>

      <div style={{ maxHeight: '380px', overflowY: 'auto', padding: '8px' }}>
        {notifications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-muted)', fontSize: '12.5px' }}>
            {t('no_new_notifications', 'No new notifications')}
          </div>
        ) : (
          notifications.map((notif) => {
            let Icon = Bell;
            let iconColor = 'var(--cyan)';

            if (notif.type === 'announcement') { Icon = Megaphone; iconColor = 'var(--orange)'; }
            else if (notif.type === 'leave') { Icon = Calendar; iconColor = 'var(--purple-light)'; }
            else if (notif.type === 'workload') { Icon = AlertTriangle; iconColor = 'var(--red)'; }
            else if (notif.type === 'recruitment') { Icon = Briefcase; iconColor = 'var(--green)'; }
            else if (notif.type === 'onboarding') { Icon = UserCheck; iconColor = 'var(--cyan)'; }

            return (
              <div
                key={notif.id}
                onClick={() => handleItemClick(notif)}
                style={{
                  display: 'flex',
                  gap: 12,
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: 4,
                  cursor: 'pointer',
                  background: notif.read ? 'transparent' : 'rgba(0, 169, 224, 0.07)',
                  border: notif.read ? '1px solid transparent' : '1px solid rgba(0, 169, 224, 0.15)',
                  transition: 'all 0.2s ease'
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: 'rgba(255,255,255,0.05)',
                    display: 'grid',
                    placeItems: 'center',
                    color: iconColor,
                    flexShrink: 0,
                    marginTop: 2
                  }}
                >
                  <Icon size={16} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <b style={{ fontSize: '12.5px', color: 'var(--text-main)' }}>{notif.title}</b>
                    {!notif.read && (
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--cyan)' }}></span>
                    )}
                  </div>
                  <p style={{ margin: '3px 0 0', fontSize: '11.5px', color: 'var(--text-muted)', lineHeight: 1.35 }}>
                    {notif.message}
                  </p>
                  <span style={{ fontSize: '10px', color: 'var(--text-dim)', marginTop: 4, display: 'block' }}>
                    {notif.time}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
