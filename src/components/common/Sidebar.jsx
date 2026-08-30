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
    { id: 'command-center', label: t('nav_command_center', 'Command Center'), icon: LayoutDashboard, sectionKey: 'section_core_platform', defaultSection: 'Core Platform' },
    { id: 'recruit', label: t('nav_recruitment', 'Recruitment'), icon: Briefcase, sectionKey: 'section_talent_acquisition', defaultSection: 'Talent Acquisition' },
    { id: 'onboard', label: t('nav_onboarding', 'Onboarding'), icon: UserCheck, sectionKey: 'section_talent_acquisition', defaultSection: 'Talent Acquisition' },
    { id: 'faculty', label: t('nav_faculty', 'Faculty Directory'), icon: Users, sectionKey: 'section_faculty_management', defaultSection: 'Faculty Management' },
    { id: 'workload', label: t('nav_workload', 'Smart Allocation'), icon: Sliders, sectionKey: 'section_faculty_management', defaultSection: 'Faculty Management' },
    { id: 'students', label: t('nav_students', 'Student Directory'), icon: GraduationCap, sectionKey: 'section_student_operations', defaultSection: 'Student Operations' },
    { id: 'attendance', label: t('nav_attendance', 'Attendance Hub'), icon: CalendarCheck, sectionKey: 'section_student_operations', defaultSection: 'Student Operations' },
    { id: 'performance', label: t('nav_performance', 'Performance'), icon: TrendingUp, sectionKey: 'section_intelligence', defaultSection: 'Intelligence' },
    { id: 'predictions', label: t('nav_predictions', 'Predictive Intelligence'), icon: BrainCircuit, sectionKey: 'section_intelligence', defaultSection: 'Intelligence' },
    { id: 'announcements', label: t('nav_announcements', 'Announcements'), icon: Megaphone, sectionKey: 'section_university_life', defaultSection: 'University Life' },
    { id: 'leave', label: t('nav_leave_mgmt', 'Leave Management'), icon: Clock, sectionKey: 'section_university_life', defaultSection: 'University Life' },
    { id: 'calendar', label: t('nav_calendar', 'University Calendar'), icon: Calendar, sectionKey: 'section_university_life', defaultSection: 'University Life' },
    { id: 'reports', label: t('nav_reports', 'Reports & Analytics'), icon: FileBarChart, sectionKey: 'section_governance', defaultSection: 'Governance' },
    { id: 'settings', label: t('nav_settings', 'System Settings'), icon: Settings, sectionKey: 'section_governance', defaultSection: 'Governance' }
  ];

  const teacherNav = [
    { id: 'teacher-dashboard', label: t('nav_teacher_dashboard', 'Teacher Workdesk'), icon: LayoutDashboard, sectionKey: 'section_my_workdesk', defaultSection: 'My Workdesk' },
    { id: 'teacher-students', label: t('nav_teacher_students', 'My Students'), icon: GraduationCap, sectionKey: 'section_my_workdesk', defaultSection: 'My Workdesk' },
    { id: 'attendance', label: t('nav_attendance', 'Attendance'), icon: CalendarCheck, sectionKey: 'section_teaching', defaultSection: 'Teaching' },
    { id: 'teacher-reviews', label: t('nav_teacher_reviews', 'Student Reviews'), icon: Star, sectionKey: 'section_teaching', defaultSection: 'Teaching' },
    { id: 'announcements', label: t('nav_announcements', 'Announcements'), icon: Megaphone, sectionKey: 'section_campus', defaultSection: 'Campus' },
    { id: 'teacher-leave', label: t('nav_teacher_leave', 'Leave Requests'), icon: Clock, sectionKey: 'section_campus', defaultSection: 'Campus' },
    { id: 'calendar', label: t('nav_calendar', 'Calendar'), icon: Calendar, sectionKey: 'section_campus', defaultSection: 'Campus' },
    { id: 'performance', label: t('nav_my_performance', 'My Performance'), icon: TrendingUp, sectionKey: 'section_account', defaultSection: 'Account' },
    { id: 'teacher-profile', label: t('nav_teacher_profile', 'My Profile'), icon: User, sectionKey: 'section_account', defaultSection: 'Account' }
  ];

  const studentNav = [
    { id: 'student-dashboard', label: t('nav_student_dashboard', 'Student Portal'), icon: LayoutDashboard, sectionKey: 'section_student_hub', defaultSection: 'Student Hub' },
    { id: 'student-profile', label: t('nav_student_profile', 'My Profile'), icon: User, sectionKey: 'section_student_hub', defaultSection: 'Student Hub' },
    { id: 'student-attendance', label: t('nav_student_attendance', 'Attendance'), icon: CalendarCheck, sectionKey: 'section_academics', defaultSection: 'Academics' },
    { id: 'student-performance', label: t('nav_student_index', 'My Student Index'), icon: TrendingUp, sectionKey: 'section_academics', defaultSection: 'Academics' },
    { id: 'student-reviews', label: t('nav_student_rate_teachers', 'Review Faculty'), icon: Star, sectionKey: 'section_academics', defaultSection: 'Academics' },
    { id: 'student-leave', label: t('nav_request_leave', 'Request Leave'), icon: Clock, sectionKey: 'section_services', defaultSection: 'Services' },
    { id: 'announcements', label: t('nav_announcements', 'Announcements'), icon: Megaphone, sectionKey: 'section_services', defaultSection: 'Services' },
    { id: 'calendar', label: t('nav_calendar', 'Calendar'), icon: Calendar, sectionKey: 'section_services', defaultSection: 'Services' }
  ];

  const navItems = role === 'admin' ? adminNav : role === 'teacher' ? teacherNav : studentNav;

  // Group nav items by section
  const sections = navItems.reduce((acc, item) => {
    const s = item.sectionKey ? t(item.sectionKey, item.defaultSection) : (item.section || 'Menu');
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
              {t('nexus_platform', 'NEXUS PLATFORM')}
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-dim)' }}>
              {t('app_version', 'v2.4 Enterprise Production')}
            </div>
          </div>
          <button
            onClick={logout}
            className="icon-btn"
            style={{ width: 28, height: 28 }}
            title={t('btn_logout', 'Sign Out')}
          >
            <LogOut size={13} />
          </button>
        </div>
      </div>
    </aside>
  );
}
