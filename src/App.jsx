import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { useLanguage } from './context/LanguageContext';
import { useToast } from './context/ToastContext';
import { ToastContainer } from './components/common/ToastContainer';
import { ToastProvider } from './context/ToastContext';
import { CapacityProvider } from './context/CapacityContext';
import { Monitor, Smartphone, X } from 'lucide-react';

// Common Components
import { Topbar } from './components/common/Topbar';
import { Sidebar } from './components/common/Sidebar';
import { MobileNav } from './components/common/MobileNav';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { CursorTrail } from './components/common/CursorTrail';

// Auth Components
import { LoginPage } from './components/auth/LoginPage';
import { RegisterPage } from './components/auth/RegisterPage';

// Admin Components
import { AdminCommandCenter } from './components/admin/AdminCommandCenter';
import { RecruitmentHub } from './components/admin/RecruitmentHub';
import { FacultyOnboarding } from './components/admin/FacultyOnboarding';
import { FacultyManagement } from './components/admin/FacultyManagement';
import { SmartAllocation } from './components/admin/SmartAllocation';
import { StudentManagement } from './components/admin/StudentManagement';
import { PerformanceOutcomes } from './components/admin/PerformanceOutcomes';
import { FacultyPredictions } from './components/admin/FacultyPredictions';
import { AnnouncementsManager } from './components/admin/AnnouncementsManager';
import { LeaveApprovalCenter } from './components/admin/LeaveApprovalCenter';
import { UniversityCalendar } from './components/admin/UniversityCalendar';
import { ReportsCenter } from './components/admin/ReportsCenter';
import { SystemSettings } from './components/admin/SystemSettings';

// Teacher Components
import { TeacherDashboard } from './components/teacher/TeacherDashboard';
import { TeacherAttendanceView } from './components/teacher/TeacherAttendanceView';
import { TeacherStudentReviews } from './components/teacher/TeacherStudentReviews';
import { TeacherLeaveManagement } from './components/teacher/TeacherLeaveManagement';
import { TeacherProfile } from './components/teacher/TeacherProfile';

// Student Components
import { StudentDashboard } from './components/student/StudentDashboard';
import { StudentAttendanceView } from './components/student/StudentAttendanceView';
import { StudentPerformanceView } from './components/student/StudentPerformanceView';
import { TeacherReviewSubmission } from './components/student/TeacherReviewSubmission';
import { StudentLeaveRequest } from './components/student/StudentLeaveRequest';
import { StudentProfile } from './components/student/StudentProfile';

// Copilot
import { FacultyCopilotDrawer } from './components/copilot/FacultyCopilotDrawer';

export function AppContent() {
  const { isAuthenticated, role, currentUser } = useAuth();
  const { t } = useLanguage();

  const [authView, setAuthView] = useState('login'); // 'login' or 'register'
  const [activeTab, setActiveTab] = useState(() => {
    return role === 'admin' ? 'command-center' : role === 'teacher' ? 'teacher-dashboard' : 'student-dashboard';
  });

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);

  // Responsive View Switcher Mode: 'desktop' | 'mobile'
  const [viewMode, setViewMode] = useState(() => {
    try {
      return sessionStorage.getItem('nexus_view_mode_pref') || 'desktop';
    } catch {
      return 'desktop';
    }
  });

  const handleSetViewMode = (mode) => {
    setViewMode(mode);
    try {
      sessionStorage.setItem('nexus_view_mode_pref', mode);
    } catch {}
  };

  // Sync activeTab when role changes on login/logout
  useEffect(() => {
    if (role === 'admin') setActiveTab('command-center');
    else if (role === 'teacher') setActiveTab('teacher-dashboard');
    else if (role === 'student') setActiveTab('student-dashboard');
  }, [role]);

  // Handle global search navigation
  const handleGlobalNavigate = (targetTab, payload) => {
    if (payload === 'search-open') {
      setIsSearchOpen(true);
      return;
    }
    if (targetTab) {
      setActiveTab(targetTab);
    }
  };

  // If not authenticated, render Login/Register
  if (!isAuthenticated) {
    return (
      <div className="auth-wrapper">
        <CursorTrail />
        {authView === 'login' ? (
          <LoginPage onSwitchToRegister={() => setAuthView('register')} />
        ) : (
          <RegisterPage onSwitchToLogin={() => setAuthView('login')} />
        )}
      </div>
    );
  }

  // Determine Title & Subtitle for Topbar
  // Determine Title & Subtitle for Topbar
  const getPageMeta = () => {
    const titles = {
      'command-center': { title: t('nav_command_center', 'Command Center'), subtitle: t('meta_sub_command_center', 'Institutional Command & Executive Operations') },
      'recruit': { title: t('nav_recruitment', 'Recruitment'), subtitle: t('meta_sub_recruit', 'Faculty Talent Acquisition & AI Matching') },
      'onboard': { title: t('nav_onboarding', 'Faculty Onboarding'), subtitle: t('meta_sub_onboard', '10-Step Institutional Induction Workflow') },
      'faculty': { title: t('nav_faculty', 'Faculty Directory'), subtitle: t('meta_sub_faculty', 'Faculty Directory & Academic Dossiers') },
      'workload': { title: t('nav_workload', 'Smart Allocation'), subtitle: t('meta_sub_workload', 'Capacity-Aware Advisor Workload Optimizer') },
      'students': { title: t('nav_students', 'Student Directory'), subtitle: t('meta_sub_students', 'Student Directory & Composite Index Tracking') },
      'attendance': { title: t('nav_attendance', 'Attendance Hub'), subtitle: t('meta_sub_attendance', 'Real-Time Classroom Attendance Verification') },
      'performance': { title: t('nav_performance', 'Performance & Outcomes'), subtitle: t('meta_sub_performance', 'Faculty Outcomes & Teaching Excellence') },
      'predictions': { title: t('nav_predictions', 'Predictive Intelligence'), subtitle: t('meta_sub_predictions', 'Predictive Intelligence & Retention Risk') },
      'announcements': { title: t('nav_announcements', 'Announcements'), subtitle: t('meta_sub_announcements', 'Central Multi-Tier Announcement Board') },
      'leave': { title: t('nav_leave_mgmt', 'Leave Management'), subtitle: t('meta_sub_leave', 'Two-Tiered Institutional Leave Governance') },
      'calendar': { title: t('nav_calendar', 'University Calendar'), subtitle: t('meta_sub_calendar', 'University Academic & Event Schedule') },
      'reports': { title: t('nav_reports', 'Reports & Analytics'), subtitle: t('meta_sub_reports', 'Audit-Grade Analytics & CSV Exports') },
      'settings': { title: t('nav_settings', 'System Settings'), subtitle: t('meta_sub_settings', 'System Configurations & Database Backup') },

      'teacher-dashboard': { title: t('nav_teacher_dashboard', 'Teacher Workdesk'), subtitle: t('meta_sub_teacher_dashboard', 'Faculty Workdesk & Assigned Mentee Overview') },
      'teacher-students': { title: t('nav_teacher_students', 'My Mentee Roster'), subtitle: t('meta_sub_teacher_students', 'Assigned Student Directory & Risk Alerts') },
      'teacher-reviews': { title: t('nav_teacher_reviews', 'Student Reviews'), subtitle: t('meta_sub_teacher_reviews', 'Submit Qualitative & Quantitative Evaluations') },
      'teacher-leave': { title: t('nav_teacher_leave', 'My Leave Applications'), subtitle: t('meta_sub_teacher_leave', 'Duty & Absence Requests to Dean') },
      'teacher-profile': { title: t('nav_teacher_profile', 'Faculty Profile'), subtitle: t('meta_sub_teacher_profile', 'Academic Credentials & Preferences') },

      'student-dashboard': { title: t('nav_student_dashboard', 'Student Portal'), subtitle: t('meta_sub_student_dashboard', 'Student Hub & Academic Progress') },
      'student-profile': { title: t('nav_student_profile', 'Student Profile'), subtitle: t('meta_sub_student_profile', 'Enrollment & Degree Program Information') },
      'student-attendance': { title: t('nav_student_attendance', 'Lecture Attendance'), subtitle: t('meta_sub_student_attendance', 'Personal Biometric & Class Attendance Record') },
      'student-performance': { title: t('nav_student_index', 'My Student Index'), subtitle: t('meta_sub_student_performance', 'Composite Academic Health & Mentorship Metric') },
      'student-reviews': { title: t('nav_student_reviews', 'Faculty Course Evaluations'), subtitle: t('meta_sub_student_reviews', 'Constructive Instruction Feedback Portal') },
      'student-leave': { title: t('nav_student_leave', 'Absence Applications'), subtitle: t('meta_sub_student_leave', 'Submit Leave Requests to Assigned Advisor') }
    };

    return titles[activeTab] || { title: t('app_name', 'NEXUS University'), subtitle: t('academic_operating_platform', 'Academic Operating Platform') };
  };

  const { title: pageTitle, subtitle: pageSubtitle } = getPageMeta();

  // Role-Based Route Guarding & Component Rendering
  const renderMainContent = () => {
    // Admin Views
    if (role === 'admin') {
      switch (activeTab) {
        case 'command-center':
          return <AdminCommandCenter onNavigate={setActiveTab} />;
        case 'recruit':
          return <RecruitmentHub onNavigate={setActiveTab} />;
        case 'onboard':
          return <FacultyOnboarding onNavigate={setActiveTab} />;
        case 'faculty':
          return <FacultyManagement onNavigate={setActiveTab} />;
        case 'workload':
          return <SmartAllocation />;
        case 'students':
          return <StudentManagement onNavigate={setActiveTab} />;
        case 'attendance':
          return <TeacherAttendanceView />;
        case 'performance':
          return <PerformanceOutcomes />;
        case 'predictions':
          return <FacultyPredictions onNavigate={setActiveTab} />;
        case 'announcements':
          return <AnnouncementsManager />;
        case 'leave':
          return <LeaveApprovalCenter />;
        case 'calendar':
          return <UniversityCalendar />;
        case 'reports':
          return <ReportsCenter />;
        case 'settings':
          return <SystemSettings />;
        default:
          return <AdminCommandCenter onNavigate={setActiveTab} />;
      }
    }

    // Teacher Views
    if (role === 'teacher') {
      switch (activeTab) {
        case 'teacher-dashboard':
          return <TeacherDashboard onNavigate={setActiveTab} />;
        case 'teacher-students':
          return <StudentManagement onNavigate={setActiveTab} />;
        case 'attendance':
          return <TeacherAttendanceView />;
        case 'teacher-reviews':
          return <TeacherStudentReviews />;
        case 'announcements':
          return <AnnouncementsManager />;
        case 'teacher-leave':
          return <TeacherLeaveManagement />;
        case 'calendar':
          return <UniversityCalendar />;
        case 'performance':
          return <PerformanceOutcomes />;
        case 'teacher-profile':
          return <TeacherProfile />;
        default:
          return <TeacherDashboard onNavigate={setActiveTab} />;
      }
    }

    // Student Views
    if (role === 'student') {
      switch (activeTab) {
        case 'student-dashboard':
          return <StudentDashboard onNavigate={setActiveTab} />;
        case 'student-profile':
          return <StudentProfile />;
        case 'student-attendance':
          return <StudentAttendanceView />;
        case 'student-performance':
          return <StudentPerformanceView />;
        case 'student-reviews':
          return <TeacherReviewSubmission />;
        case 'student-leave':
          return <StudentLeaveRequest />;
        case 'announcements':
          return <AnnouncementsManager />;
        case 'calendar':
          return <UniversityCalendar />;
        default:
          return <StudentDashboard onNavigate={setActiveTab} />;
      }
    }

    return null;
  };

  // Render Mobile Phone Simulation Frame when Mobile View is selected
  if (viewMode === 'mobile') {
    return (
      <div className="mobile-preview-backdrop">
        <CursorTrail />

        {/* Top Control Bar */}
        <div className="mobile-preview-topbar">
          <div className="mobile-preview-title">
            <Smartphone size={16} style={{ color: 'var(--cyan)' }} />
            <span>Responsive Mobile View (Phone Device Simulator)</span>
          </div>

          <div className="mobile-preview-actions">
            <button
              type="button"
              className="btn-primary"
              style={{ padding: '6px 14px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: 6 }}
              onClick={() => handleSetViewMode('desktop')}
            >
              <Monitor size={14} /> Switch to Desktop View
            </button>
          </div>
        </div>

        {/* Realistic Mobile Device Mockup */}
        <div className="mobile-device-frame">
          {/* Status Bar */}
          <div className="device-status-bar">
            <span className="status-time">9:41</span>
            <div className="dynamic-island-notch">
              <div className="notch-camera" />
            </div>
            <div className="status-icons">
              <span style={{ fontSize: '10px', fontWeight: 800 }}>5G</span>
              <span>📶</span>
              <span>🔋</span>
            </div>
          </div>

          {/* Interactive Screen Viewport */}
          <div className="device-screen-viewport">
            <div className="app-container mobile-view-forced">
              {/* Main Content Area */}
              <div className="main-wrapper">
                <Topbar
                  activePageTitle={pageTitle}
                  activePageSubtitle={pageSubtitle}
                  onOpenSearch={() => setIsSearchOpen(true)}
                  onOpenCopilot={() => setIsCopilotOpen(true)}
                  onNavigate={handleGlobalNavigate}
                  viewMode={viewMode}
                  onSetViewMode={handleSetViewMode}
                />

                <main className="content-area">
                  {renderMainContent()}
                </main>
              </div>

              {/* Mobile Bottom Navigation Bar */}
              <MobileNav activeTab={activeTab} onSelectTab={setActiveTab} />
            </div>
          </div>
        </div>

        {/* Global Search Modal */}
        <GlobalSearchModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          onNavigate={handleGlobalNavigate}
        />

        {/* AI Copilot Drawer */}
        <FacultyCopilotDrawer
          isOpen={isCopilotOpen}
          onClose={() => setIsCopilotOpen(false)}
          onNavigate={handleGlobalNavigate}
        />
      </div>
    );
  }

  // Standard Desktop Layout
  return (
    <div className="app-container">
      <CursorTrail />

      {/* Sidebar */}
      <Sidebar activeTab={activeTab} onSelectTab={setActiveTab} />

      {/* Main Content Area */}
      <div className="main-wrapper">
        <Topbar
          activePageTitle={pageTitle}
          activePageSubtitle={pageSubtitle}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenCopilot={() => setIsCopilotOpen(true)}
          onNavigate={handleGlobalNavigate}
          viewMode={viewMode}
          onSetViewMode={handleSetViewMode}
        />

        <main className="content-area">
          {renderMainContent()}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar for narrow screens */}
      <MobileNav activeTab={activeTab} onSelectTab={setActiveTab} />

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={handleGlobalNavigate}
      />

      {/* AI Copilot Drawer */}
      <FacultyCopilotDrawer
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        onNavigate={handleGlobalNavigate}
      />
    </div>
  );
}

export default function App() {
  return (
    <CapacityProvider>
      <AppContent />
    </CapacityProvider>
  );
}
