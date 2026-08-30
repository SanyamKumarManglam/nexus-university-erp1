import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { LayoutDashboard, Users, CalendarCheck, Clock, Megaphone, Star, User } from 'lucide-react';

export function MobileNav({ activeTab, onSelectTab }) {
  const { role } = useAuth();
  const { t } = useLanguage();

  const adminItems = [
    { id: 'command-center', label: t('nav_command_center', 'Home'), icon: LayoutDashboard },
    { id: 'faculty', label: t('nav_faculty', 'Faculty'), icon: Users },
    { id: 'attendance', label: t('nav_attendance', 'Attend'), icon: CalendarCheck },
    { id: 'leave', label: t('nav_leave_mgmt', 'Leave'), icon: Clock },
    { id: 'announcements', label: t('nav_announcements', 'News'), icon: Megaphone }
  ];

  const teacherItems = [
    { id: 'teacher-dashboard', label: t('nav_teacher_dashboard', 'Home'), icon: LayoutDashboard },
    { id: 'attendance', label: t('nav_attendance', 'Attend'), icon: CalendarCheck },
    { id: 'teacher-reviews', label: t('nav_teacher_reviews', 'Reviews'), icon: Star },
    { id: 'teacher-leave', label: t('nav_teacher_leave', 'Leave'), icon: Clock },
    { id: 'teacher-profile', label: t('nav_teacher_profile', 'Profile'), icon: User }
  ];

  const studentItems = [
    { id: 'student-dashboard', label: t('nav_student_dashboard', 'Home'), icon: LayoutDashboard },
    { id: 'student-attendance', label: t('nav_student_attendance', 'Attend'), icon: CalendarCheck },
    { id: 'student-reviews', label: t('nav_student_rate_teachers', 'Review'), icon: Star },
    { id: 'student-leave', label: t('nav_request_leave', 'Leave'), icon: Clock },
    { id: 'student-profile', label: t('nav_student_profile', 'Profile'), icon: User }
  ];

  const items = role === 'admin' ? adminItems : role === 'teacher' ? teacherItems : studentItems;

  return (
    <nav className="mobile-bottom-nav">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;

        return (
          <button
            key={item.id}
            onClick={() => onSelectTab(item.id)}
            className={`mobile-nav-item ${isActive ? 'active' : ''}`}
          >
            <Icon size={20} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
