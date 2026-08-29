import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

const initialNotifications = [
  {
    id: 'notif-1',
    title: 'New Announcement Published',
    message: 'Fall 2026 Mid-Semester Examination schedule has been released.',
    type: 'announcement',
    targetNav: 'announcements',
    time: '10 mins ago',
    read: false,
    roles: ['admin', 'teacher', 'student']
  },
  {
    id: 'notif-2',
    title: 'Student Leave Request Pending',
    message: 'Rahul Sharma (CSE) submitted leave request for Smart India Hackathon.',
    type: 'leave',
    targetNav: 'leave',
    time: '1 hour ago',
    read: false,
    roles: ['admin', 'teacher']
  },
  {
    id: 'notif-3',
    title: 'Advisor Overload Alert',
    message: 'Prof. Rajesh Sharma is at 96% advising capacity. Rebalancing recommended.',
    type: 'workload',
    targetNav: 'workload',
    time: '2 hours ago',
    read: false,
    roles: ['admin']
  },
  {
    id: 'notif-4',
    title: 'Candidate Interview Completed',
    message: 'Dr. Tarun Saxena completed technical interview round with score 88%.',
    type: 'recruitment',
    targetNav: 'recruit',
    time: '3 hours ago',
    read: false,
    roles: ['admin']
  },
  {
    id: 'notif-5',
    title: 'Onboarding Milestone Complete',
    message: 'Dr. Radhika Pillai completed LMS teaching setup (Step 6 of 10).',
    type: 'onboarding',
    targetNav: 'onboard',
    time: 'Yesterday',
    read: true,
    roles: ['admin']
  }
];

export function NotificationProvider({ children }) {
  const { role } = useAuth();
  const [notifications, setNotifications] = useState(initialNotifications);

  const filteredNotifications = notifications.filter(
    (n) => !n.roles || n.roles.includes(role || 'student')
  );

  const unreadCount = filteredNotifications.filter((n) => !n.read).length;

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications: filteredNotifications,
        unreadCount,
        markAsRead,
        markAllAsRead
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
