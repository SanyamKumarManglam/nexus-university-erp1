import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useNotifications } from '../../context/NotificationContext';
import { useToast } from '../../context/ToastContext';
import {
  Search,
  Bell,
  Sun,
  Moon,
  Globe,
  Sparkles,
  User,
  Settings,
  LogOut,
  ChevronDown,
  HelpCircle,
  ShieldCheck,
  Monitor,
  Smartphone
} from 'lucide-react';
import { NotificationDrawer } from './NotificationDrawer';
import { getInitials } from '../../utils/formatters';

export function Topbar({
  activePageTitle,
  activePageSubtitle,
  onOpenSearch,
  onOpenCopilot,
  onNavigate,
  viewMode = 'desktop',
  onSetViewMode
}) {
  const { currentUser, role, logout } = useAuth();
  const { currentLang, changeLanguage, languageNames, availableLanguages, t } = useLanguage();
  const { unreadCount } = useNotifications();
  const toast = useToast();

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('nexus_theme_pref') || 'dark';
  });

  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const langRef = useRef(null);
  const userMenuRef = useRef(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('nexus_theme_pref', theme);
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    toast.info(nextTheme === 'dark' ? 'Futuristic Dark Mode Activated' : 'Institutional Light Mode Activated');
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setIsLangMenuOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = async () => {
    setIsUserMenuOpen(false);
    await logout();
    toast.success('You have been signed out safely.');
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <div className="page-title">
          <h1>{activePageTitle || 'NEXUS University'}</h1>
          <p>{activePageSubtitle || 'Intelligent Academic Operations Platform'}</p>
        </div>
      </div>

      <div className="topbar-actions">
        {/* Global Search Button */}
        <button className="search-trigger-btn" onClick={onOpenSearch}>
          <Search size={15} />
          <span>{t('btn_search')}</span>
          <kbd className="search-kbd">Ctrl K</kbd>
        </button>

        {/* Desktop / Mobile Responsive View Switcher */}
        {onSetViewMode && (
          <div className="view-switcher-toggle" title="Switch layout preview mode">
            <button
              type="button"
              className={`view-switcher-btn ${viewMode === 'desktop' ? 'active' : ''}`}
              onClick={() => {
                onSetViewMode('desktop');
                toast.info(t('msg_switched_desktop', 'Switched to Desktop View'));
              }}
              title="Desktop View (Full Screen)"
            >
              <Monitor size={14} />
              <span>{t('desktop_view', 'Desktop')}</span>
            </button>
            <button
              type="button"
              className={`view-switcher-btn ${viewMode === 'mobile' ? 'active' : ''}`}
              onClick={() => {
                onSetViewMode('mobile');
                toast.info(t('msg_switched_mobile', 'Switched to Mobile View (Realistic Phone Preview)'));
              }}
              title="Mobile View (Interactive Phone Preview)"
            >
              <Smartphone size={14} />
              <span>{t('mobile_view', 'Mobile')}</span>
            </button>
          </div>
        )}

        {/* AI Copilot Launcher */}
        <button
          className="btn-secondary"
          style={{ padding: '8px 14px', borderRadius: 'var(--radius-full)' }}
          onClick={onOpenCopilot}
          title="Open NEXUS Intelligence Copilot"
        >
          <Sparkles size={15} style={{ color: 'var(--cyan)' }} />
          <span>{t('ai_copilot_short', 'Copilot')}</span>
        </button>

        {/* Language Selector Dropdown */}
        <div className="relative" ref={langRef} style={{ position: 'relative' }}>
          <button
            className="icon-btn"
            onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
            title="Switch UI Language"
            style={{ width: 'auto', padding: '0 10px', gap: '6px', display: 'flex' }}
          >
            <Globe size={16} />
            <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase' }}>
              {currentLang}
            </span>
            <ChevronDown size={13} />
          </button>

          {isLangMenuOpen && (
            <div className="dropdown-menu" style={{ width: '180px' }}>
              <div className="dropdown-header">
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-dim)' }}>
                  {t('select_language', 'SELECT LANGUAGE')}
                </span>
              </div>
              {availableLanguages.map((langKey) => (
                <button
                  key={langKey}
                  onClick={() => {
                    changeLanguage(langKey);
                    setIsLangMenuOpen(false);
                    toast.info(`${t('msg_lang_switched', 'Language switched to')} ${languageNames[langKey]}`);
                  }}
                  className={`dropdown-item ${currentLang === langKey ? 'text-cyan-400 font-bold' : ''}`}
                  style={{
                    color: currentLang === langKey ? 'var(--cyan)' : 'inherit',
                    background: currentLang === langKey ? 'rgba(0,169,224,0.1)' : 'transparent'
                  }}
                >
                  {languageNames[langKey]}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Theme Toggle Button */}
        <button className="icon-btn" onClick={toggleTheme} title="Toggle Dark / Light Theme">
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        {/* Notification Bell */}
        <div style={{ position: 'relative' }}>
          <button
            className="icon-btn"
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            title={t('notifications', 'Notifications')}
          >
            <Bell size={17} />
            {unreadCount > 0 && <span className="icon-badge-count">{unreadCount}</span>}
          </button>

          <NotificationDrawer
            isOpen={isNotifOpen}
            onClose={() => setIsNotifOpen(false)}
            onNavigate={onNavigate}
          />
        </div>

        {/* User Profile Menu */}
        <div className="user-menu-wrapper" ref={userMenuRef}>
          <button
            className="user-profile-btn"
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
          >
            <div className="avatar-circle">
              {getInitials(currentUser?.name)}
            </div>
            <div className="user-info">
              <div className="user-name">{currentUser?.name || 'User'}</div>
              <div className="user-role-badge">
                {currentUser?.role === 'admin' ? t('role_admin', 'Administrator') : currentUser?.role === 'teacher' ? t('role_teacher', 'Faculty / Teacher') : t('role_student', 'Student')}
              </div>
            </div>
            <ChevronDown size={14} style={{ color: 'var(--text-dim)' }} />
          </button>

          {isUserMenuOpen && (
            <div className="dropdown-menu">
              <div className="dropdown-header">
                <div style={{ fontWeight: 800, fontSize: '13px', color: 'var(--text-main)' }}>
                  {currentUser?.name}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  {currentUser?.email}
                </div>
              </div>

              <button
                className="dropdown-item"
                onClick={() => {
                  setIsUserMenuOpen(false);
                  onNavigate(currentUser?.role === 'student' ? 'student-profile' : currentUser?.role === 'teacher' ? 'teacher-profile' : 'settings');
                }}
              >
                <User size={15} />
                <span>{t('my_profile', 'My Profile')}</span>
              </button>

              <button
                className="dropdown-item"
                onClick={() => {
                  setIsUserMenuOpen(false);
                  onNavigate('settings');
                }}
              >
                <Settings size={15} />
                <span>{currentUser?.role === 'admin' ? t('nav_settings', 'System Settings') : t('nav_preferences', 'Preferences')}</span>
              </button>

              <button
                className="dropdown-item"
                onClick={() => {
                  setIsUserMenuOpen(false);
                  setIsNotifOpen(true);
                }}
              >
                <Bell size={15} />
                <span>{t('notifications', 'Notifications')} ({unreadCount})</span>
              </button>

              <button
                className="dropdown-item"
                onClick={() => {
                  setIsUserMenuOpen(false);
                  setIsLangMenuOpen(true);
                }}
              >
                <Globe size={15} />
                <span>{t('nav_language', 'Language')} ({languageNames[currentLang]})</span>
              </button>

              <div style={{ borderTop: '1px solid var(--border-subtle)', margin: '6px 0' }} />

              <button className="dropdown-item danger" onClick={handleLogout}>
                <LogOut size={15} />
                <span>{t('btn_logout')}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
