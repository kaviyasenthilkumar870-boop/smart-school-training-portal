import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import StatCard from '../../components/StatCard';
import Badge from '../../components/Badge';
import { 
  GraduationCap, 
  CalendarDays, 
  CheckCircle2, 
  Award, 
  ArrowRight, 
  Clock, 
  MapPin, 
  Building2, 
  Bell,
  Sparkles
} from 'lucide-react';

export default function StudentDashboard({ setActiveView }) {
  const { user } = useAuth();
  const [availableEvents, setAvailableEvents] = useState([]);
  const [myRegistrations, setMyRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const [eventsRes, regsRes] = await Promise.allSettled([
          api.getEvents('?mySchoolOnly=true'),
          api.getRegistrations('?myRegistrations=true')
        ]);

        if (eventsRes.status === 'fulfilled' && eventsRes.value.events) {
          setAvailableEvents(eventsRes.value.events);
        } else {
          setAvailableEvents([
            {
              _id: 'ev_ai_iot_01',
              title: 'AI & IoT Training Programme',
              category: 'AI & IoT',
              date: '2026-11-10',
              startTime: '09:30 AM',
              endTime: '03:30 PM',
              venue: 'Smart IoT & Robotics Innovation Lab',
              registrationDeadline: '2026-11-05',
              capacity: 50,
              registeredCount: 2
            }
          ]);
        }

        if (regsRes.status === 'fulfilled' && regsRes.value.registrations) {
          setMyRegistrations(regsRes.value.registrations);
        } else {
          setMyRegistrations([
            {
              _id: 'reg_ai_iot_01',
              eventId: 'ev_ai_iot_01',
              eventTitle: 'AI & IoT Training Programme',
              date: '2026-11-10',
              status: 'confirmed',
              attendanceStatus: 'present'
            }
          ]);
        }
      } catch (err) {
        console.warn('Student load fallback');
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Student Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-brand-600 to-indigo-700 rounded-2xl p-6 text-white shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-sm mb-2">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span>Enrolled at {user?.schoolName || 'Greenwood High School'}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold">Welcome, {user?.name || 'Emma Watson'}</h1>
            <p className="text-xs text-blue-100 mt-1 max-w-xl">
              Explore hands-on skill training programmes tailored specifically for students at your school.
            </p>
          </div>

          <button
            onClick={() => setActiveView('student-register')}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white text-brand-700 text-xs font-bold shadow hover:bg-brand-50 transition"
          >
            <span>Browse Available Programmes</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Eligible Programmes"
          value={availableEvents.length}
          subtitle="Open for your school"
          icon={CalendarDays}
          color="blue"
        />
        <StatCard
          title="My Registered Events"
          value={myRegistrations.length}
          subtitle="Confirmed workshop seats"
          icon={CheckCircle2}
          color="emerald"
        />
        <StatCard
          title="Verified Attendance"
          value={myRegistrations.filter(r => r.attendanceStatus === 'present').length}
          subtitle="Events attended and stamped"
          icon={Award}
          color="purple"
        />
      </div>

      {/* Two Column Layout: Recommended for My School & Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans): Events open for my school */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Training Programmes for Your School</h2>
              <p className="text-xs text-slate-500">Events matching your school's eligibility</p>
            </div>
            <button
              onClick={() => setActiveView('student-register')}
              className="text-xs font-semibold text-brand-600 hover:text-brand-700"
            >
              View All
            </button>
          </div>

          <div className="space-y-3">
            {availableEvents.slice(0, 3).map((ev) => {
              const isRegistered = myRegistrations.some(r => r.eventId === ev._id);
              return (
                <div 
                  key={ev._id}
                  className="p-4 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-slate-100/60 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-bold text-slate-900 text-sm">{ev.title}</h4>
                      <Badge variant="primary">{ev.category || 'Tech'}</Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center">
                        <CalendarDays className="w-3.5 h-3.5 mr-1 text-slate-400" />
                        {ev.date}
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
                        {ev.startTime}
                      </span>
                      <span className="flex items-center">
                        <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />
                        {ev.venue}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 self-end sm:self-center">
                    {isRegistered ? (
                      <span className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Registered</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => setActiveView('student-register')}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white transition shadow-sm"
                      >
                        Register Now
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Portal Announcements & Certificate Notice */}
        <div className="space-y-4">
          {/* Announcements Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center space-x-2 text-slate-900 font-bold text-base mb-3">
              <Bell className="w-4 h-4 text-brand-600" />
              <h3>Announcements</h3>
            </div>
            
            <div className="space-y-3 text-xs text-slate-600">
              <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100">
                <span className="font-bold text-brand-900 block mb-1">Bring Your Student ID Card</span>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Training instructors will scan or verify your student ID on the event day before admitting entry to the session.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-100">
                <span className="font-bold text-amber-900 block mb-1">Attendance Certificate Policy</span>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Certificates are automatically made available in your dashboard within 24 hours of verified attendance.
                </p>
              </div>
            </div>
          </div>

          {/* Quick past attendance button */}
          <button
            onClick={() => setActiveView('student-history')}
            className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold flex items-center justify-between shadow-sm transition"
          >
            <div className="flex items-center space-x-2">
              <Award className="w-4 h-4 text-purple-600" />
              <span>View Past Attendance & Certificates</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>
    </div>
  );
}
