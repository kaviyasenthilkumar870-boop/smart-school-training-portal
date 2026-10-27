import React from 'react';
import { useAuth, DEMO_ACCOUNTS } from '../context/AuthContext';
import { 
  GraduationCap, 
  LogOut, 
  User, 
  ShieldCheck, 
  Award, 
  Menu, 
  X,
  Building2,
  ChevronRight
} from 'lucide-react';

export default function Navbar({ activeView, setActiveView, isMobileMenuOpen, setIsMobileMenuOpen }) {
  const { user, logout, loginAsDemo, isAdmin, isStaff, isStudent } = useAuth();

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return <span className="bg-purple-100 text-purple-700 text-xs px-2.5 py-0.5 rounded-full font-semibold border border-purple-200">Main Admin</span>;
      case 'staff':
        return <span className="bg-amber-100 text-amber-800 text-xs px-2.5 py-0.5 rounded-full font-semibold border border-amber-200">Training Staff</span>;
      case 'student':
        return <span className="bg-blue-100 text-blue-700 text-xs px-2.5 py-0.5 rounded-full font-semibold border border-blue-200">Student</span>;
      default:
        return null;
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Title */}
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle Navigation"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <button 
              onClick={() => setActiveView('home')} 
              className="flex items-center space-x-2.5 text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-700 to-brand-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-brand-600 transition-colors">
                  Smart School
                </span>
                <span className="hidden sm:inline-block ml-1 text-xs px-2 py-0.5 bg-brand-50 text-brand-700 rounded-md font-medium border border-brand-100">
                  Training Portal
                </span>
              </div>
            </button>
          </div>

          {/* Quick Demo Role Switcher for Testing & Evaluators */}
          <div className="flex items-center space-x-1.5 bg-slate-100/90 p-1 rounded-xl border border-slate-200 text-xs font-medium">
            <span className="hidden sm:inline-block text-slate-500 px-2 py-1">
              Switch Role:
            </span>
            <button
              onClick={() => loginAsDemo('admin')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                isAdmin 
                  ? 'bg-purple-600 text-white font-semibold shadow-sm' 
                  : 'text-slate-600 hover:bg-white hover:text-slate-900'
              }`}
            >
              Admin
            </button>
            <button
              onClick={() => loginAsDemo('staff')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                isStaff 
                  ? 'bg-amber-600 text-white font-semibold shadow-sm' 
                  : 'text-slate-600 hover:bg-white hover:text-slate-900'
              }`}
            >
              Staff
            </button>
            <button
              onClick={() => loginAsDemo('student')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                isStudent 
                  ? 'bg-blue-600 text-white font-semibold shadow-sm' 
                  : 'text-slate-600 hover:bg-white hover:text-slate-900'
              }`}
            >
              Student
            </button>
          </div>

          {/* User Profile or Login Button */}
          <div className="flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="hidden sm:flex flex-col text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <span className="text-sm font-semibold text-slate-800">{user.name}</span>
                    {getRoleBadge(user.role)}
                  </div>
                  <span className="text-xs text-slate-500">
                    {user.schoolName || user.email}
                  </span>
                </div>

                <button
                  onClick={logout}
                  className="flex items-center space-x-1 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 rounded-lg transition-all"
                  title="Log out of portal"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setActiveView('login')}
                className="flex items-center space-x-1.5 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-sm hover:shadow transition-all"
              >
                <User className="w-4 h-4" />
                <span>Portal Login</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
