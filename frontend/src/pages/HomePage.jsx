import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import Badge from '../components/Badge';
import { 
  GraduationCap, 
  Calendar, 
  MapPin, 
  Users, 
  CheckCircle2, 
  ArrowRight, 
  Building2, 
  ShieldCheck, 
  Clock, 
  Sparkles,
  Award
} from 'lucide-react';

export default function HomePage({ setActiveView }) {
  const { user, loginAsDemo } = useAuth();
  const [events, setEvents] = useState([]);
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsRes, schoolsRes] = await Promise.allSettled([
          api.getEvents('?publishedOnly=true'),
          api.getSchools()
        ]);

        if (eventsRes.status === 'fulfilled' && eventsRes.value.events) {
          setEvents(eventsRes.value.events);
        } else {
          setEvents([
            {
              _id: 'ev_ai_iot_01',
              title: 'AI & IoT Training Programme',
              description: 'Comprehensive hands-on training on Artificial Intelligence and Internet of Things (IoT). Students build smart connected sensor devices, edge computing nodes, and integrate AI classification models.',
              category: 'AI & IoT',
              date: '2026-11-10',
              startTime: '09:30 AM',
              endTime: '03:30 PM',
              venue: 'Smart IoT & Robotics Innovation Lab',
              registrationDeadline: '2026-11-05',
              capacity: 50,
              registeredCount: 2,
              schoolNames: ['Greenwood High School', 'Oakridge Academy']
            }
          ]);
        }

        if (schoolsRes.status === 'fulfilled' && schoolsRes.value.schools) {
          setSchools(schoolsRes.value.schools);
        } else {
          setSchools([
            { _id: 'sch_greenwood_01', name: 'Greenwood High School', code: 'GHS-01', studentCount: 140 },
            { _id: 'sch_oakridge_02', name: 'Oakridge Academy', code: 'ORA-02', studentCount: 120 }
          ]);
        }
      } catch (err) {
        console.error('Home load error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 via-brand-600 to-indigo-800 text-white p-8 sm:p-12 shadow-xl shadow-brand-700/10">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-semibold backdrop-blur-sm mb-4 border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>Multi-School Training & Event Management</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Empower Tomorrow's Leaders Across Every School
          </h1>

          <p className="mt-4 text-base sm:text-lg text-brand-100 font-normal leading-relaxed max-w-2xl">
            One single, unified platform connecting school administrations, specialised training staff, and students. Manage inter-school training programs, registrations, and real-time event-day attendance seamlessly.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {user ? (
              <button
                onClick={() => {
                  if (user.role === 'admin') setActiveView('admin-dashboard');
                  else if (user.role === 'staff') setActiveView('staff-dashboard');
                  else setActiveView('student-dashboard');
                }}
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-white text-brand-700 font-bold hover:bg-brand-50 shadow-md hover:shadow-lg transition-all"
              >
                <span>Go to My Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => setActiveView('login')}
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-white text-brand-700 font-bold hover:bg-brand-50 shadow-md hover:shadow-lg transition-all"
              >
                <span>Portal Login</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={() => {
                const el = document.getElementById('upcoming-programmes');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium border border-white/20 backdrop-blur-sm transition-all"
            >
              <span>Explore Programmes</span>
            </button>
          </div>
        </div>

        {/* Decorative background shapes */}
        <div className="absolute -right-16 -top-24 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-12 -bottom-20 w-80 h-80 bg-brand-400/20 rounded-full blur-2xl pointer-events-none" />
      </section>

      {/* 3 Core Roles Section */}
      <section className="space-y-4">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900">Designed for Every School Stakeholder</h2>
          <p className="text-sm text-slate-500 mt-1">
            Strict role-based access control guarantees privacy, school data isolation, and accurate event reporting.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {/* Student Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center mb-4">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Student Portal</h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Browse training events open to your school, register with one click, track your attendance record, and download certificates.
            </p>
            <ul className="mt-4 space-y-2 text-xs text-slate-600">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>School-specific event eligibility</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>Prevents duplicate registrations</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>Verified event attendance history</span>
              </li>
            </ul>
            <button
              onClick={() => loginAsDemo('student')}
              className="mt-6 w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors"
            >
              Test As Student Demo
            </button>
          </div>

          {/* Staff Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center mb-4">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Training Staff</h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Authorised staff view assigned schools and conducted workshops. Mark registered students Present or Absent on the event day.
            </p>
            <ul className="mt-4 space-y-2 text-xs text-slate-600">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>Assigned school scoping</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>Event-day Present / Absent roster</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>Instant CSV attendance export</span>
              </li>
            </ul>
            <button
              onClick={() => loginAsDemo('staff')}
              className="mt-6 w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-amber-50 hover:bg-amber-100 text-amber-700 transition-colors"
            >
              Test As Staff Demo
            </button>
          </div>

          {/* Main Admin Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Main Administrator</h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Add new schools on demand, manage student & staff accounts, assign staff to schools, publish multi-school events, and inspect reports.
            </p>
            <ul className="mt-4 space-y-2 text-xs text-slate-600">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>Add, edit, deactivate schools</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>Multi-school eligibility rules</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>Comprehensive attendance statistics</span>
              </li>
            </ul>
            <button
              onClick={() => loginAsDemo('admin')}
              className="mt-6 w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-purple-50 hover:bg-purple-100 text-purple-700 transition-colors"
            >
              Test As Admin Demo
            </button>
          </div>
        </div>
      </section>

      {/* Upcoming Training Programmes Section */}
      <section id="upcoming-programmes" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Upcoming Training Programmes</h2>
            <p className="text-sm text-slate-500 mt-0.5">Explore active workshops conducted across participating schools</p>
          </div>
          <span className="text-xs text-slate-500 mt-2 sm:mt-0 font-medium">
            Showing {events.length} open programmes
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((ev) => (
            <div 
              key={ev._id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
            >
              <div className="p-6">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <Badge variant="primary">{ev.category || 'Training'}</Badge>
                  <span className="text-[11px] font-semibold text-slate-500 flex items-center">
                    <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
                    {ev.date}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-600 transition-colors leading-snug">
                  {ev.title}
                </h3>

                <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                  {ev.description}
                </p>

                <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                  <div className="flex items-center space-x-2 text-slate-600">
                    <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span>{ev.startTime} - {ev.endTime}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-600">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span className="truncate">{ev.venue}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-600">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span className="text-[11px] text-brand-700 font-medium">
                      {ev.schoolNames ? ev.schoolNames.join(', ') : 'All registered schools'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-100 flex items-center justify-between">
                <div className="text-[11px] text-slate-500">
                  Deadline: <span className="font-semibold text-slate-700">{ev.registrationDeadline}</span>
                </div>
                <button
                  onClick={() => {
                    if (user && user.role === 'student') {
                      setActiveView('student-register');
                    } else if (!user) {
                      setActiveView('login');
                    } else {
                      setActiveView('admin-events');
                    }
                  }}
                  className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center space-x-1"
                >
                  <span>Register</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Participating Schools Banner */}
      <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="flex items-center space-x-2 mb-4">
          <Building2 className="w-5 h-5 text-brand-600" />
          <h2 className="text-lg font-bold text-slate-900">Participating School Network</h2>
        </div>
        <p className="text-xs text-slate-500 mb-6 max-w-xl">
          The portal connects independent schools into a shared training infrastructure while ensuring each school retains its own students, assigned staff, and attendance logs.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {schools.map((sch) => (
            <div key={sch._id} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100/70 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-brand-700 bg-brand-100/80 px-2 py-0.5 rounded-md">
                  {sch.code}
                </span>
                <span className="text-[11px] text-slate-500">Active</span>
              </div>
              <h4 className="font-bold text-sm text-slate-900 mt-2">{sch.name}</h4>
              <p className="text-xs text-slate-500 mt-1">Verified School Partner</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
