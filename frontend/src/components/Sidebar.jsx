import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  CalendarDays, 
  ClipboardCheck, 
  BarChart3, 
  Home, 
  Award,
  Sparkles,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export default function Sidebar({ activeView, setActiveView, closeMobileMenu }) {
  const { user, isAdmin, isStaff, isStudent, loginAsDemo } = useAuth();

  const handleNavClick = (viewId) => {
    setActiveView(viewId);
    if (closeMobileMenu) closeMobileMenu();
  };

  const navItemClass = (viewId) => `
    w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all
    ${activeView === viewId 
      ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20 font-semibold' 
      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}
  `;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-full min-h-[calc(100vh-4rem)]">
      {/* User Context Banner in Sidebar */}
      {user && (
        <div className="p-4 mx-3 my-3 bg-gradient-to-br from-brand-50 to-blue-50/60 rounded-2xl border border-brand-100/80">
          <div className="text-xs font-semibold text-brand-700 uppercase tracking-wider mb-1 flex items-center space-x-1">
            <Sparkles className="w-3.5 h-3.5 text-brand-500" />
            <span>Active Portal</span>
          </div>
          <div className="text-sm font-bold text-slate-900 truncate">
            {user.schoolName || (isAdmin ? 'Central Administration' : 'School Portal')}
          </div>
          <div className="text-xs text-slate-500 truncate mt-0.5">
            Role: <span className="font-semibold capitalize text-brand-800">{user.role}</span>
          </div>

          {/* Quick Role Switcher Buttons Inside Sidebar */}
          <div className="mt-3 pt-2.5 border-t border-brand-200/50 flex items-center gap-1">
            <button
              onClick={() => loginAsDemo('admin')}
              className={`flex-1 py-1 rounded-lg text-[10px] font-bold text-center transition ${isAdmin ? 'bg-purple-600 text-white shadow-sm' : 'bg-white/80 hover:bg-white text-slate-700'}`}
            >
              Admin
            </button>
            <button
              onClick={() => loginAsDemo('staff')}
              className={`flex-1 py-1 rounded-lg text-[10px] font-bold text-center transition ${isStaff ? 'bg-amber-600 text-white shadow-sm' : 'bg-white/80 hover:bg-white text-slate-700'}`}
            >
              Staff
            </button>
            <button
              onClick={() => loginAsDemo('student')}
              className={`flex-1 py-1 rounded-lg text-[10px] font-bold text-center transition ${isStudent ? 'bg-blue-600 text-white shadow-sm' : 'bg-white/80 hover:bg-white text-slate-700'}`}
            >
              Student
            </button>
          </div>
        </div>
      )}

      {/* Main Navigation List */}
      <div className="flex-1 px-3 py-2 space-y-1">
        {/* Public Views */}
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3.5 py-1.5">
          General
        </div>
        <button 
          onClick={() => handleNavClick('home')}
          className={navItemClass('home')}
        >
          <Home className="w-4 h-4" />
          <span>Public Home</span>
        </button>

        {/* Admin Navigation */}
        {isAdmin && (
          <>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3.5 pt-4 pb-1.5">
              Admin Workspace
            </div>
            <button 
              onClick={() => handleNavClick('admin-dashboard')}
              className={navItemClass('admin-dashboard')}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Admin Overview</span>
            </button>
            <button 
              onClick={() => handleNavClick('admin-schools')}
              className={navItemClass('admin-schools')}
            >
              <Building2 className="w-4 h-4" />
              <span>School Management</span>
            </button>
            <button 
              onClick={() => handleNavClick('admin-users')}
              className={navItemClass('admin-users')}
            >
              <Users className="w-4 h-4" />
              <span>Users & Staff</span>
            </button>
            <button 
              onClick={() => handleNavClick('admin-events')}
              className={navItemClass('admin-events')}
            >
              <CalendarDays className="w-4 h-4" />
              <span>Event Management</span>
            </button>
            <button 
              onClick={() => handleNavClick('staff-attendance')}
              className={navItemClass('staff-attendance')}
            >
              <ClipboardCheck className="w-4 h-4" />
              <span>Mark Attendance</span>
            </button>
            <button 
              onClick={() => handleNavClick('admin-reports')}
              className={navItemClass('admin-reports')}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Attendance Reports</span>
            </button>
          </>
        )}

        {/* Staff Navigation */}
        {isStaff && (
          <>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3.5 pt-4 pb-1.5">
              Staff Workspace
            </div>
            <button 
              onClick={() => handleNavClick('staff-dashboard')}
              className={navItemClass('staff-dashboard')}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Staff Dashboard</span>
            </button>
            <button 
              onClick={() => handleNavClick('staff-attendance')}
              className={navItemClass('staff-attendance')}
            >
              <ClipboardCheck className="w-4 h-4" />
              <span>Mark Attendance</span>
            </button>
          </>
        )}

        {/* Student Navigation */}
        {isStudent && (
          <>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3.5 pt-4 pb-1.5">
              Student Workspace
            </div>
            <button 
              onClick={() => handleNavClick('student-dashboard')}
              className={navItemClass('student-dashboard')}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>My Dashboard</span>
            </button>
            <button 
              onClick={() => handleNavClick('student-register')}
              className={navItemClass('student-register')}
            >
              <CalendarDays className="w-4 h-4" />
              <span>Browse & Register</span>
            </button>
            <button 
              onClick={() => handleNavClick('student-history')}
              className={navItemClass('student-history')}
            >
              <Award className="w-4 h-4" />
              <span>Past Attendance</span>
            </button>
          </>
        )}
      </div>

      {/* Role Protection Guidance footer in sidebar */}
      <div className="p-4 border-t border-slate-200 text-xs text-slate-500 bg-slate-50/50">
        <div className="flex items-center space-x-1.5 text-slate-700 font-semibold mb-1">
          <ShieldCheck className="w-4 h-4 text-brand-600" />
          <span>Role-Based Access</span>
        </div>
        <p className="text-[11px] leading-relaxed text-slate-500">
          Backend validated RBAC active. Each school's data is isolated.
        </p>
      </div>
    </aside>
  );
}
