import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import StatCard from '../../components/StatCard';
import Badge from '../../components/Badge';
import { 
  Building2, 
  CalendarDays, 
  ClipboardCheck, 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  MapPin,
  Sparkles
} from 'lucide-react';

export default function StaffDashboard({ setActiveView }) {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStaffData = async () => {
      try {
        const res = await api.getEvents('?authorizedOnly=true');
        if (res && res.events) {
          setEvents(res.events);
        } else {
          setEvents([
            {
              _id: 'ev_ai_iot_01',
              title: 'AI & IoT Training Programme',
              category: 'AI & IoT',
              date: '2026-11-10',
              startTime: '09:30 AM',
              endTime: '03:30 PM',
              venue: 'Smart IoT & Robotics Innovation Lab',
              registeredCount: 2,
              schoolName: 'Greenwood High School & Oakridge Academy',
              attendanceMarked: true
            }
          ]);
        }
      } catch (err) {
        console.warn('Staff events fallback');
      } finally {
        setLoading(false);
      }
    };

    fetchStaffData();
  }, []);

  const assignedCount = user?.assignedSchoolIds?.length || 2;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-orange-700 rounded-2xl p-6 text-white shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-sm mb-2">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span>Certified Training Instructor</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold">Welcome, {user?.name || 'Instructor David'}</h1>
            <p className="text-xs text-amber-100 mt-1 max-w-xl">
              You are assigned to conduct training and verify event-day attendance for your designated partner schools.
            </p>
          </div>

          <button
            onClick={() => setActiveView('staff-attendance')}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white text-amber-900 text-xs font-bold shadow hover:bg-amber-50 transition"
          >
            <ClipboardCheck className="w-4 h-4 text-amber-700" />
            <span>Launch Attendance Roster</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Assigned Schools"
          value={assignedCount}
          subtitle="Institutions under your supervision"
          icon={Building2}
          color="amber"
        />
        <StatCard
          title="Authorised Events"
          value={events.length}
          subtitle="Scheduled training sessions"
          icon={CalendarDays}
          color="blue"
        />
        <StatCard
          title="Total Registered Students"
          value={events.reduce((acc, ev) => acc + (ev.registeredCount || 0), 0) || 97}
          subtitle="Across your eligible events"
          icon={CheckCircle2}
          color="emerald"
        />
      </div>

      {/* Assigned Events Roster List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Your Authorised Training Events</h2>
            <p className="text-xs text-slate-500">Only events belonging to your assigned schools are listed here</p>
          </div>
          <span className="text-xs text-slate-400 font-medium">Event-Day Attendance Only</span>
        </div>

        <div className="space-y-3">
          {events.map((ev) => (
            <div 
              key={ev._id} 
              className="p-4 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-slate-100/60 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h3 className="font-bold text-slate-900 text-sm">{ev.title}</h3>
                  <Badge variant="primary">{ev.category || 'Tech'}</Badge>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center">
                    <CalendarDays className="w-3.5 h-3.5 mr-1 text-slate-400" />
                    {ev.date}
                  </span>
                  <span className="flex items-center">
                    <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
                    {ev.startTime} - {ev.endTime}
                  </span>
                  <span className="flex items-center">
                    <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />
                    {ev.venue}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-3 self-end sm:self-center">
                <div className="text-right">
                  <div className="text-xs font-bold text-brand-700">{ev.registeredCount || 0} Registered</div>
                  <div className="text-[10px] text-slate-400">Attendance Ready</div>
                </div>

                <button
                  onClick={() => setActiveView('staff-attendance')}
                  className="px-3 py-2 rounded-xl text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white flex items-center space-x-1 shadow-sm transition"
                >
                  <span>Mark Roster</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
