import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { BrandLogo } from './BrandLogo';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Briefcase,
  Sliders,
  GraduationCap,
  CalendarCheck,
  TrendingUp,
  BrainCircuit,
  Megaphone,
  Calendar,
  FileBarChart,
  Settings,
  Star,
  Clock,
  User,
  LogOut
} from 'lucide-react';

export function Sidebar({ activeTab, onSelectTab }) {
  const { currentUser, role, logout } = useAuth();
  const { t } = useLanguage();

  const adminNav = [
    { id: 'command-center', label: t('nav_command_center'), icon: LayoutDashboard, section: 'Core Platform' },
    { id: 'recruit', label: t('nav_recruitment'), icon: Briefcase, section: 'Talent Acquisition' },
    { id: 'onboard', label: t('nav_onboarding'), icon: UserCheck, section: 'Talent Acquisition' },
    { id: 'faculty', label: t('nav_faculty'), icon: Users, section: 'Faculty Management' },
    { id: 'workload', label: t('nav_workload'), icon: Sliders, section: 'Faculty Management' },
    { id: 'students', label: t('nav_students'), icon: GraduationCap, section: 'Student Operations' },
    { id: 'attendance', label: t('nav_attendance'), icon: CalendarCheck, section: 'Student Operations' },
    { id: 'performance', label: t('nav_performance'), icon: TrendingUp, section: 'Intelligence' },
    { id: 'predictions', label: t('nav_predictions'), icon: BrainCircuit, section: 'Intelligence' },
    { id: 'announcements', label: t('nav_announcements'), icon: Megaphone, section: 'University Life' },
    { id: 'leave', label: t('nav_leave_mgmt'), icon: Clock, section: 'University Life' },
    { id: 'calendar', label: t('nav_calendar'), icon: Calendar, section: 'University Life' },
    { id: 'reports', label: t('nav_reports'), icon: FileBarChart, section: 'Governance' },
    { id: 'settings', label: t('nav_settings'), icon: Settings, section: 'Governance' }
  ];

  const teacherNav = [
    { id: 'teacher-dashboard', label: t('nav_teacher_dashboard'), icon: LayoutDashboard, section: 'My Workdesk' },
    { id: 'teacher-students', label: t('nav_teacher_students'), icon: GraduationCap, section: 'My Workdesk' },
    { id: 'attendance', label: t('nav_attendance'), icon: CalendarCheck, section: 'Teaching' },
    { id: 'teacher-reviews', label: t('nav_teacher_reviews'), icon: Star, section: 'Teaching' },
    { id: 'announcements', label: t('nav_announcements'), icon: Megaphone, section: 'Campus' },
    { id: 'teacher-leave', label: t('nav_teacher_leave'), icon: Clock, section: 'Campus' },
    { id: 'calendar', label: t('nav_calendar'), icon: Calendar, section: 'Campus' },
    { id: 'performance', label: 'My Performance', icon: TrendingUp, section: 'Account' },
    { id: 'teacher-profile', label: 'My Profile', icon: User, section: 'Account' }
  ];

  const studentNav = [
    { id: 'student-dashboard', label: t('nav_student_dashboard'), icon: LayoutDashboard, section: 'Student Hub' },
    { id: 'student-profile', label: 'My Profile', icon: User, section: 'Student Hub' },
    { id: 'student-attendance', label: t('nav_student_attendance'), icon: CalendarCheck, section: 'Academics' },
    { id: 'student-performance', label: t('nav_student_index'), icon: TrendingUp, section: 'Academics' },
    { id: 'student-reviews', label: t('nav_student_rate_teachers'), icon: Star, section: 'Academics' },
    { id: 'student-leave', label: 'Request Leave', icon: Clock, section: 'Services' },
    { id: 'announcements', label: t('nav_announcements'), icon: Megaphone, section: 'Services' },
    { id: 'calendar', label: t('nav_calendar'), icon: Calendar, section: 'Services' }
  ];

  const navItems = role === 'admin' ? adminNav : role === 'teacher' ? teacherNav : studentNav;

  // Group nav items by section
  const sections = navItems.reduce((acc, item) => {
    const s = item.section || 'Menu';
    if (!acc[s]) acc[s] = [];
    acc[s].push(item);
    return acc;
  }, {});

  return (
    <aside className="sidebar">
      <div className="sidebar-brand" onClick={() => onSelectTab(navItems[0].id)}>
        <BrandLogo size="md" />
      </div>

      <nav className="sidebar-nav">
        {Object.entries(sections).map(([sectionName, items]) => (
          <div key={sectionName} style={{ marginBottom: 12 }}>
            <div className="nav-section-label">{sectionName}</div>
            {items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`nav-link ${isActive ? 'active' : ''}`}
                >
                  <Icon size={17} style={{ flexShrink: 0 }} />
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '11.5px' }}>
              NEXUS PLATFORM
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-dim)' }}>
              v2.4 Enterprise Production
            </div>
          </div>
          <button
            onClick={logout}
            className="icon-btn"
            style={{ width: 28, height: 28 }}
            title="Sign Out"
          >
            <LogOut size={13} />
          </button>
        </div>
      </div>
    </aside>
  );
}
