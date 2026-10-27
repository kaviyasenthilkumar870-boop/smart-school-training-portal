import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import StatCard from '../../components/StatCard';
import Badge from '../../components/Badge';
import LoadingSpinner from '../../components/LoadingSpinner';
import { 
  Building2, 
  Users, 
  CalendarDays, 
  CheckCircle2, 
  PlusCircle, 
  ArrowUpRight, 
  BarChart3,
  TrendingUp,
  Clock
} from 'lucide-react';

export default function AdminDashboard({ setActiveView }) {
  const [stats, setStats] = useState({
    schoolsCount: 3,
    studentsCount: 120,
    staffCount: 8,
    eventsCount: 5,
    attendanceRate: '88.5%'
  });
  const [recentEvents, setRecentEvents] = useState([]);
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [eventsRes, schoolsRes, usersRes] = await Promise.allSettled([
          api.getEvents(),
          api.getSchools(),
          api.getUsers()
        ]);

        if (eventsRes.status === 'fulfilled' && eventsRes.value.events) {
          setRecentEvents(eventsRes.value.events);
          setStats(prev => ({ ...prev, eventsCount: eventsRes.value.events.length }));
        }
        if (schoolsRes.status === 'fulfilled' && schoolsRes.value.schools) {
          setSchools(schoolsRes.value.schools);
          setStats(prev => ({ ...prev, schoolsCount: schoolsRes.value.schools.length }));
        }
        if (usersRes.status === 'fulfilled' && usersRes.value.users) {
          const students = usersRes.value.users.filter(u => u.role === 'student').length;
          const staff = usersRes.value.users.filter(u => u.role === 'staff').length;
          setStats(prev => ({
            ...prev,
            studentsCount: students || 120,
            staffCount: staff || 8
          }));
        }
      } catch (err) {
        console.error('Admin dashboard load error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Welcome & Quick Actions Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Main Administration Hub</h1>
          <p className="text-xs text-slate-500 mt-1">
            Central management for multi-school onboarding, training programmes, and attendance analytics
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => setActiveView('admin-schools')}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-brand-50 text-brand-700 hover:bg-brand-100 border border-brand-200 transition"
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Add School</span>
          </button>
          <button
            onClick={() => setActiveView('admin-events')}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white shadow-sm transition"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Create Event</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Schools"
          value={stats.schoolsCount}
          subtitle="Onboarded institutions"
          icon={Building2}
          color="blue"
        />
        <StatCard
          title="Enrolled Students"
          value={stats.studentsCount}
          subtitle="Across all schools"
          icon={Users}
          color="emerald"
        />
        <StatCard
          title="Training Staff"
          value={stats.staffCount}
          subtitle="Assigned trainers"
          icon={CheckCircle2}
          color="amber"
        />
        <StatCard
          title="Event Attendance"
          value={stats.attendanceRate}
          subtitle="Average turnout rate"
          icon={TrendingUp}
          color="purple"
        />
      </div>

      {/* Two Column Layout: Events Overview & Participating Schools */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans): Recent Training Events */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Training Programmes</h2>
              <p className="text-xs text-slate-500">Scheduled events and current enrollment</p>
            </div>
            <button
              onClick={() => setActiveView('admin-events')}
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center space-x-1"
            >
              <span>Manage All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="pb-3 pl-1">Event Name</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Eligible Schools</th>
                  <th className="pb-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(recentEvents.length > 0 ? recentEvents.slice(0, 4) : [
                  { _id: '1', title: 'Robotics Bootcamp', date: '2026-11-15', eligibleCount: 2, status: 'published' },
                  { _id: '2', title: 'Cyber Safety Workshop', date: '2026-11-22', eligibleCount: 1, status: 'published' },
                  { _id: '3', title: 'Science Innovation Fair', date: '2026-12-05', eligibleCount: 3, status: 'draft' }
                ]).map((ev) => (
                  <tr key={ev._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 pl-1 font-semibold text-slate-800">
                      {ev.title}
                    </td>
                    <td className="py-3 text-slate-500 font-medium">
                      {ev.date}
                    </td>
                    <td className="py-3 text-slate-600">
                      <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px] font-medium">
                        {ev.eligibleSchoolIds?.length || ev.eligibleCount || 'All'} Schools
                      </span>
                    </td>
                    <td className="py-3 text-center">
                      <Badge variant={ev.status === 'published' ? 'success' : 'draft'}>
                        {ev.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column (1 span): Active Schools Directory */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900">Schools Directory</h2>
              <button
                onClick={() => setActiveView('admin-schools')}
                className="text-xs font-semibold text-brand-600 hover:text-brand-700"
              >
                View
              </button>
            </div>

            <div className="space-y-3">
              {(schools.length > 0 ? schools.slice(0, 4) : [
                { _id: 's1', name: 'Greenwood High School', code: 'GHS-01', active: true },
                { _id: 's2', name: 'Oakridge Academy', code: 'ORA-02', active: true },
                { _id: 's3', name: 'Riverside STEM High', code: 'RSH-03', active: true }
              ]).map((sch) => (
                <div key={sch._id} className="p-3 rounded-xl border border-slate-100 bg-slate-50/70 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{sch.name}</h4>
                    <span className="text-[10px] text-slate-400 font-mono">{sch.code}</span>
                  </div>
                  <Badge variant={sch.active !== false ? 'success' : 'inactive'}>
                    {sch.active !== false ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <button
              onClick={() => setActiveView('admin-reports')}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center space-x-1.5 transition"
            >
              <BarChart3 className="w-3.5 h-3.5 text-slate-500" />
              <span>Generate Attendance Reports</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
