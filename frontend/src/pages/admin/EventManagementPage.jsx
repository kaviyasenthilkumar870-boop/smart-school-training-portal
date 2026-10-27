import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import Modal from '../../components/Modal';
import Badge from '../../components/Badge';
import Alert from '../../components/Alert';
import EmptyState from '../../components/EmptyState';
import LoadingSpinner from '../../components/LoadingSpinner';
import { 
  CalendarDays, 
  Plus, 
  Search, 
  Building2, 
  Clock, 
  MapPin, 
  Users, 
  Globe, 
  Eye, 
  Check, 
  CalendarCheck
} from 'lucide-react';

export default function EventManagementPage() {
  const [events, setEvents] = useState([]);
  const [schools, setSchools] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [alert, setAlert] = useState(null);

  // Roster / Enroll Modal State
  const [isRosterModalOpen, setIsRosterModalOpen] = useState(false);
  const [activeEventForRoster, setActiveEventForRoster] = useState(null);
  const [rosterParticipants, setRosterParticipants] = useState([]);
  const [studentToEnroll, setStudentToEnroll] = useState('');
  const [enrolling, setEnrolling] = useState(false);
  const [modalAlert, setModalAlert] = useState(null);

  // Create Event Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Technology',
    date: '2026-11-20',
    startTime: '10:00 AM',
    endTime: '02:00 PM',
    venue: 'Main Science & Tech Auditorium',
    registrationDeadline: '2026-11-15',
    capacity: 60,
    eligibleSchoolIds: [],
    status: 'published'
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [eventsRes, schoolsRes, usersRes] = await Promise.allSettled([
        api.getEvents(),
        api.getSchools(),
        api.getUsers('?role=student')
      ]);

      if (schoolsRes.status === 'fulfilled' && schoolsRes.value.schools) {
        setSchools(schoolsRes.value.schools);
      } else {
        setSchools([
          { _id: 'sch_greenwood_01', name: 'Greenwood High School', code: 'GHS-01' },
          { _id: 'sch_oakridge_02', name: 'Oakridge Academy', code: 'ORA-02' }
        ]);
      }

      if (usersRes.status === 'fulfilled' && usersRes.value.users) {
        const studentsOnly = usersRes.value.users.filter(u => u.role === 'student');
        setAllStudents(studentsOnly);
        if (studentsOnly.length > 0) setStudentToEnroll(studentsOnly[0]._id);
      }

      if (eventsRes.status === 'fulfilled' && eventsRes.value.events) {
        setEvents(eventsRes.value.events);
      } else {
        setEvents([
          {
            _id: 'ev_1',
            title: 'Artificial Intelligence & Robotics Bootcamp',
            description: 'Hands-on workshop introducing Python, neural networks, and micro-controller robotics programming.',
            category: 'Technology',
            date: '2026-11-15',
            startTime: '09:30 AM',
            endTime: '03:30 PM',
            venue: 'Central Innovation Lab & Auditorium',
            registrationDeadline: '2026-11-10',
            capacity: 60,
            registeredCount: 42,
            eligibleSchoolIds: ['sch_greenwood_01', 'sch_oakridge_02'],
            status: 'published'
          },
          {
            _id: 'ev_2',
            title: 'Junior Cyber Safety & Ethical Hacking Symposium',
            description: 'Learn cyber threat mitigation, safe digital citizenship, and practical network vulnerability defense.',
            category: 'Cybersecurity',
            date: '2026-11-22',
            startTime: '10:00 AM',
            endTime: '01:00 PM',
            venue: 'STEM Learning Hall B',
            registrationDeadline: '2026-11-18',
            capacity: 80,
            registeredCount: 55,
            eligibleSchoolIds: ['sch_oakridge_02', 'sch_riverside_03'],
            status: 'published'
          },
          {
            _id: 'ev_3',
            title: 'Clean Energy & Environmental Science Challenge',
            description: 'Interactive team competition designing miniature solar photovoltaic cells and water filtration sensors.',
            category: 'Science',
            date: '2026-12-05',
            startTime: '09:00 AM',
            endTime: '04:00 PM',
            venue: 'Green Campus Eco Pavillion',
            registrationDeadline: '2026-11-28',
            capacity: 50,
            registeredCount: 30,
            eligibleSchoolIds: ['sch_greenwood_01'],
            status: 'draft'
          }
        ]);
      }
    } catch (err) {
      console.warn('Events fallback');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setFormData({
      title: '',
      description: '',
      category: 'Technology',
      date: '2026-11-25',
      startTime: '10:00 AM',
      endTime: '02:00 PM',
      venue: 'Main Innovation Hall',
      registrationDeadline: '2026-11-20',
      capacity: 50,
      eligibleSchoolIds: schools.map(s => s._id), // Default: eligible for all currently
      status: 'published'
    });
    setIsModalOpen(true);
  };

  const handleToggleSchoolEligibility = (schoolId) => {
    setFormData(prev => {
      const exists = prev.eligibleSchoolIds.includes(schoolId);
      return {
        ...prev,
        eligibleSchoolIds: exists 
          ? prev.eligibleSchoolIds.filter(id => id !== schoolId) 
          : [...prev.eligibleSchoolIds, schoolId]
      };
    });
  };

  const handleSelectAllSchools = () => {
    if (formData.eligibleSchoolIds.length === schools.length) {
      setFormData(prev => ({ ...prev, eligibleSchoolIds: [] }));
    } else {
      setFormData(prev => ({ ...prev, eligibleSchoolIds: schools.map(s => s._id) }));
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setAlert({ type: 'error', message: 'Event title is required.' });
      return;
    }
    if (formData.eligibleSchoolIds.length === 0) {
      setAlert({ type: 'error', message: 'Select at least one eligible school for this training event.' });
      return;
    }

    try {
      await api.createEvent(formData);
      setAlert({ type: 'success', message: `Training programme "${formData.title}" scheduled successfully.` });
      setIsModalOpen(false);
      await loadData();
    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Failed to create event.' });
    }
  };

  const handlePublishToggle = async (ev) => {
    try {
      await api.publishEvent(ev._id);
      await loadData();
      setAlert({ 
        type: 'info', 
        message: `Event "${ev.title}" status updated.` 
      });
    } catch (err) {
      setAlert({ type: 'error', message: 'Failed to update event status.' });
    }
  };

  const openRosterModal = async (ev) => {
    setActiveEventForRoster(ev);
    setIsRosterModalOpen(true);
    setModalAlert(null);
    try {
      const res = await api.getEventAttendance(ev._id);
      if (res && res.participants) {
        setRosterParticipants(res.participants);
      } else {
        setRosterParticipants([]);
      }
    } catch (err) {
      console.warn('Error loading roster:', err);
    }
  };

  const handleEnrollStudent = async (e) => {
    e.preventDefault();
    if (!studentToEnroll || !activeEventForRoster) return;
    setEnrolling(true);
    setModalAlert(null);

    try {
      await api.registerForEvent(activeEventForRoster._id, studentToEnroll);
      setModalAlert({ type: 'success', message: 'Student successfully enrolled into event!' });
      
      // Refresh roster modal
      const res = await api.getEventAttendance(activeEventForRoster._id);
      if (res && res.participants) {
        setRosterParticipants(res.participants);
      }
      await loadData();
    } catch (err) {
      setModalAlert({ type: 'error', message: err.message || 'Enrollment failed.' });
    } finally {
      setEnrolling(false);
    }
  };

  const filteredEvents = events.filter(e => {
    const matchesSearch = e.title.toLowerCase().includes(search.toLowerCase()) || 
      (e.venue && e.venue.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || e.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Training Event Management</h1>
          <p className="text-xs text-slate-500 mt-1">
            Publish workshops, define multi-school eligibility rules, and manage registration quotas
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Event</span>
        </button>
      </div>

      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or venue..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-700"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
          </select>
        </div>
      </div>

      {/* Events Table / Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <LoadingSpinner text="Loading events..." />
        ) : filteredEvents.length === 0 ? (
          <EmptyState
            icon={CalendarDays}
            title="No events scheduled"
            description="Create your first training programme and configure eligible schools."
            action={
              <button
                onClick={openCreateModal}
                className="px-3.5 py-2 text-xs font-semibold bg-brand-600 text-white rounded-xl"
              >
                Create Event Now
              </button>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Event Details</th>
                  <th className="py-3.5 px-4">Date & Time</th>
                  <th className="py-3.5 px-4">Eligible Schools</th>
                  <th className="py-3.5 px-4">Enrolled / Cap</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEvents.map((ev) => {
                  const eligibleNames = schools
                    .filter(s => ev.eligibleSchoolIds?.includes(s._id))
                    .map(s => s.name);

                  return (
                    <tr key={ev._id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="font-bold text-slate-900 text-sm">{ev.title}</div>
                        <div className="text-slate-400 text-[11px] flex items-center mt-0.5">
                          <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                          <span className="truncate">{ev.venue}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-700 whitespace-nowrap">
                        <div className="font-semibold text-slate-800">{ev.date}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{ev.startTime} - {ev.endTime}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {eligibleNames.length > 0 ? (
                            eligibleNames.map((name, idx) => (
                              <span key={idx} className="bg-blue-50 text-brand-700 px-2 py-0.5 rounded text-[10px] font-medium border border-blue-100">
                                {name}
                              </span>
                            ))
                          ) : (
                            <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded text-[10px] font-medium border border-purple-100">
                              All Active Schools
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-medium text-slate-800 whitespace-nowrap">
                        <span className="font-bold text-brand-700">{ev.registeredCount || 0}</span>
                        <span className="text-slate-400"> / {ev.capacity || '∞'}</span>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <Badge variant={ev.status === 'published' ? 'success' : 'draft'}>
                          {ev.status}
                        </Badge>
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-2">
                        <button
                          onClick={() => openRosterModal(ev)}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-200 transition"
                        >
                          Enroll / Roster
                        </button>
                        <button
                          onClick={() => handlePublishToggle(ev)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition ${
                            ev.status === 'published'
                              ? 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                          }`}
                        >
                          {ev.status === 'published' ? 'Unpublish' : 'Publish'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Event Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Schedule New Training Programme"
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Event Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="e.g. Artificial Intelligence Workshop"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="Technology">Technology</option>
                <option value="Cybersecurity">Cybersecurity</option>
                <option value="Science">Science</option>
                <option value="Robotics">Robotics</option>
                <option value="Leadership">Leadership</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Event Date *
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Description & Objectives
            </label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="Programme curriculum, requirements, and expected learning outcomes..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Start Time
              </label>
              <input
                type="text"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="10:00 AM"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                End Time
              </label>
              <input
                type="text"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="02:00 PM"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Max Capacity
              </label>
              <input
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Venue Location *
              </label>
              <input
                type="text"
                required
                value={formData.venue}
                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="Auditorium / Lab Room"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Registration Deadline *
              </label>
              <input
                type="date"
                required
                value={formData.registrationDeadline}
                onChange={(e) => setFormData({ ...formData, registrationDeadline: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          {/* Eligible Schools Checkbox Group */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Eligible Participating Schools *
              </label>
              <button
                type="button"
                onClick={handleSelectAllSchools}
                className="text-[11px] font-semibold text-brand-600 hover:text-brand-700"
              >
                {formData.eligibleSchoolIds.length === schools.length ? 'Deselect All' : 'Select All Schools'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 border border-slate-200 rounded-xl p-3 max-h-40 overflow-y-auto">
              {schools.map(s => {
                const checked = formData.eligibleSchoolIds.includes(s._id);
                return (
                  <label
                    key={s._id}
                    className={`flex items-center space-x-2 p-2 rounded-lg border text-xs cursor-pointer transition ${
                      checked ? 'bg-brand-50/80 border-brand-200 font-semibold text-brand-900' : 'border-slate-100 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleToggleSchoolEligibility(s._id)}
                      className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                    />
                    <span className="truncate">{s.name}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white rounded-xl shadow-sm transition"
            >
              Schedule Programme
            </button>
          </div>
        </form>
      </Modal>
      {/* Manage Roster & Directly Enroll Student Modal */}
      <Modal
        isOpen={isRosterModalOpen}
        onClose={() => { setIsRosterModalOpen(false); setModalAlert(null); }}
        title={`Enrolled Students: ${activeEventForRoster?.title || 'Event'}`}
        maxWidth="max-w-2xl"
      >
        <div className="space-y-4">
          {modalAlert && (
            <Alert
              type={modalAlert.type}
              message={modalAlert.message}
              onClose={() => setModalAlert(null)}
            />
          )}
          {/* Direct Enroll Form */}
          <form onSubmit={handleEnrollStudent} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
              <Plus className="w-4 h-4 text-brand-600" />
              <span>Admin Direct Student Enrollment:</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 items-center">
              <select
                value={studentToEnroll}
                onChange={(e) => setStudentToEnroll(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-800"
              >
                {allStudents.map(st => (
                  <option key={st._id} value={st._id}>
                    {st.name} ({st.schoolName || st.email})
                  </option>
                ))}
              </select>

              <button
                type="submit"
                disabled={enrolling || allStudents.length === 0}
                className="w-full sm:w-auto px-4 py-2 text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white rounded-xl shadow-sm transition whitespace-nowrap disabled:opacity-50"
              >
                {enrolling ? 'Enrolling...' : '+ Enroll Student'}
              </button>
            </div>
          </form>

          {/* Enrolled Students Table */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Currently Registered Roster ({rosterParticipants.length}):
            </h4>

            {rosterParticipants.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-4 text-center border border-dashed rounded-xl">
                No students enrolled in this event yet. Use the form above to enroll students.
              </p>
            ) : (
              <div className="border border-slate-200 rounded-xl overflow-hidden max-h-56 overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-500 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Student Name</th>
                      <th className="py-2.5 px-3">School</th>
                      <th className="py-2.5 px-3">Attendance Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {rosterParticipants.map(p => (
                      <tr key={p.studentId} className="hover:bg-slate-50">
                        <td className="py-2 px-3 font-semibold text-slate-800">
                          {p.name}
                          <span className="block text-[10px] text-slate-400 font-normal">{p.email}</span>
                        </td>
                        <td className="py-2 px-3 text-slate-600">
                          {p.schoolName}
                        </td>
                        <td className="py-2 px-3">
                          <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold ${
                            p.attendanceStatus === 'present' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {p.attendanceStatus || 'pending'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={() => setIsRosterModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
