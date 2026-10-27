import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

// Public Views
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';

// Admin Views
import AdminDashboard from './pages/admin/AdminDashboard';
import SchoolManagementPage from './pages/admin/SchoolManagementPage';
import UserManagementPage from './pages/admin/UserManagementPage';
import EventManagementPage from './pages/admin/EventManagementPage';
import ReportsPage from './pages/admin/ReportsPage';

// Staff Views
import StaffDashboard from './pages/staff/StaffDashboard';
import AttendancePage from './pages/staff/AttendancePage';

// Student Views
import StudentDashboard from './pages/student/StudentDashboard';
import EventRegistrationPage from './pages/student/EventRegistrationPage';
import MyHistoryPage from './pages/student/MyHistoryPage';

function PortalContent() {
  const { user, isAdmin, isStaff, isStudent, isAuthenticated } = useAuth();
  const [activeView, setActiveView] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Auto-redirect if trying to access unauthorized views
  useEffect(() => {
    if (activeView.startsWith('admin-') && !isAdmin) {
      setActiveView(isAuthenticated ? (isStaff ? 'staff-dashboard' : 'student-dashboard') : 'login');
    } else if (activeView.startsWith('staff-') && !isStaff && !isAdmin) {
      setActiveView(isAuthenticated ? (isAdmin ? 'admin-dashboard' : 'student-dashboard') : 'login');
    } else if (activeView.startsWith('student-') && !isStudent && !isAdmin) {
      setActiveView(isAuthenticated ? (isAdmin ? 'admin-dashboard' : 'staff-dashboard') : 'login');
    }
  }, [activeView, isAdmin, isStaff, isStudent, isAuthenticated]);

  const renderCurrentView = () => {
    switch (activeView) {
      case 'home':
        return <HomePage setActiveView={setActiveView} />;
      case 'login':
        return <LoginPage setActiveView={setActiveView} />;

      // Admin Pages
      case 'admin-dashboard':
        return <AdminDashboard setActiveView={setActiveView} />;
      case 'admin-schools':
        return <SchoolManagementPage />;
      case 'admin-users':
        return <UserManagementPage />;
      case 'admin-events':
        return <EventManagementPage />;
      case 'admin-reports':
        return <ReportsPage />;

      // Staff Pages
      case 'staff-dashboard':
        return <StaffDashboard setActiveView={setActiveView} />;
      case 'staff-attendance':
        return <AttendancePage />;

      // Student Pages
      case 'student-dashboard':
        return <StudentDashboard setActiveView={setActiveView} />;
      case 'student-register':
        return <EventRegistrationPage />;
      case 'student-history':
        return <MyHistoryPage />;

      default:
        return <NotFoundPage setActiveView={setActiveView} />;
    }
  };

  const isFullWidthPage = activeView === 'home' || activeView === 'login';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Top Application Navbar */}
      <Navbar
        activeView={activeView}
        setActiveView={setActiveView}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      {/* Main Layout Container */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Desktop Sidebar (hidden on public home & login, or displayed for easy access) */}
        {!isFullWidthPage && (
          <div className="hidden lg:block shrink-0">
            <Sidebar
              activeView={activeView}
              setActiveView={setActiveView}
            />
          </div>
        )}

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 lg:hidden flex">
            <div 
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <div className="relative w-64 bg-white z-50 h-full shadow-2xl">
              <Sidebar
                activeView={activeView}
                setActiveView={setActiveView}
                closeMobileMenu={() => setIsMobileMenuOpen(false)}
              />
            </div>
          </div>
        )}

        {/* Dynamic Page Content Viewport */}
        <main className={`flex-1 p-4 sm:p-6 lg:p-8 min-w-0 ${isFullWidthPage ? 'max-w-6xl mx-auto' : ''}`}>
          {renderCurrentView()}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-800">Smart School Training Portal</span>
            <span>•</span>
            <span>Multi-School Architecture</span>
          </div>
          <div className="flex items-center space-x-4">
            <button onClick={() => setActiveView('home')} className="hover:text-slate-800 transition">
              Home
            </button>
            <button onClick={() => setActiveView('login')} className="hover:text-slate-800 transition">
              Portal Sign In
            </button>
            <span>v1.0.0 (Production Ready)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <PortalContent />
    </AuthProvider>
  );
}
