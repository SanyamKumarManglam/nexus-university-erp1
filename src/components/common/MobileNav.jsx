import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Users, CalendarCheck, Clock, Megaphone, Star, User } from 'lucide-react';

export function MobileNav({ activeTab, onSelectTab }) {
  const { role } = useAuth();

  const adminItems = [
    { id: 'command-center', label: 'Home', icon: LayoutDashboard },
    { id: 'faculty', label: 'Faculty', icon: Users },
    { id: 'attendance', label: 'Attend', icon: CalendarCheck },
    { id: 'leave', label: 'Leave', icon: Clock },
    { id: 'announcements', label: 'News', icon: Megaphone }
  ];

  const teacherItems = [
    { id: 'teacher-dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'attendance', label: 'Attend', icon: CalendarCheck },
    { id: 'teacher-reviews', label: 'Reviews', icon: Star },
    { id: 'teacher-leave', label: 'Leave', icon: Clock },
    { id: 'teacher-profile', label: 'Profile', icon: User }
  ];

  const studentItems = [
    { id: 'student-dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'student-attendance', label: 'Attend', icon: CalendarCheck },
    { id: 'student-reviews', label: 'Review', icon: Star },
    { id: 'student-leave', label: 'Leave', icon: Clock },
    { id: 'student-profile', label: 'Profile', icon: User }
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
