import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import Modal from '../../components/Modal';
import Badge from '../../components/Badge';
import Alert from '../../components/Alert';
import EmptyState from '../../components/EmptyState';
import LoadingSpinner from '../../components/LoadingSpinner';
import { 
  Users, 
  UserPlus, 
  Search, 
  Building2, 
  ShieldCheck, 
  GraduationCap, 
  Edit3, 
  Check, 
  X,
  Mail
} from 'lucide-react';

export default function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('all');
  const [schoolFilter, setSchoolFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [alert, setAlert] = useState(null);

  // Create User Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: 'password123',
    role: 'student',
    schoolId: '',
    assignedSchoolIds: []
  });

  // Assign Staff Modal
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [assignedSchoolsList, setAssignedSchoolsList] = useState([]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [usersRes, schoolsRes] = await Promise.allSettled([
        api.getUsers(),
        api.getSchools()
      ]);

      if (schoolsRes.status === 'fulfilled' && schoolsRes.value.schools) {
        setSchools(schoolsRes.value.schools);
      } else {
        setSchools([
          { _id: 'sch_greenwood_01', name: 'Greenwood High School', code: 'GHS-01' },
          { _id: 'sch_oakridge_02', name: 'Oakridge Academy', code: 'ORA-02' },
          { _id: 'sch_riverside_03', name: 'Riverside STEM High', code: 'RSH-03' }
        ]);
      }

      if (usersRes.status === 'fulfilled' && usersRes.value.users) {
        setUsers(usersRes.value.users);
      } else {
        setUsers([
          {
            _id: 'u_1',
            name: 'Dr. Sarah Jenkins',
            email: 'admin@smartschool.edu',
            role: 'admin',
            schoolName: 'Central Admin',
            active: true
          },
          {
            _id: 'u_2',
            name: 'David Martinez',
            email: 'trainer.david@smartschool.edu',
            role: 'staff',
            assignedSchoolIds: ['sch_greenwood_01', 'sch_oakridge_02'],
            assignedSchoolNames: ['Greenwood High School', 'Oakridge Academy'],
            active: true
          },
          {
            _id: 'u_3',
            name: 'Prof. Helen Clark',
            email: 'helen.trainer@smartschool.edu',
            role: 'staff',
            assignedSchoolIds: ['sch_riverside_03'],
            assignedSchoolNames: ['Riverside STEM High'],
            active: true
          },
          {
            _id: 'u_4',
            name: 'Emma Watson',
            email: 'emma.student@greenwood.edu',
            role: 'student',
            schoolId: 'sch_greenwood_01',
            schoolName: 'Greenwood High School',
            active: true
          },
          {
            _id: 'u_5',
            name: 'Liam Chen',
            email: 'liam.chen@oakridge.edu',
            role: 'student',
            schoolId: 'sch_oakridge_02',
            schoolName: 'Oakridge Academy',
            active: true
          },
          {
            _id: 'u_6',
            name: 'Sophia Patel',
            email: 'sophia.patel@riverside.edu',
            role: 'student',
            schoolId: 'sch_riverside_03',
            schoolName: 'Riverside STEM High',
            active: true
          }
        ]);
      }
    } catch (err) {
      console.warn('User load fallback');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      setAlert({ type: 'error', message: 'Name and email are required.' });
      return;
    }

    try {
      const payload = { ...formData };
      if (payload.role === 'student' && !payload.schoolId && schools.length > 0) {
        payload.schoolId = schools[0]._id;
      }

      await api.createUser(payload);
      setAlert({ type: 'success', message: `Account created for ${payload.name} (${payload.role}).` });
      setIsAddModalOpen(false);
      setFormData({
        name: '',
        email: '',
        password: 'password123',
        role: 'student',
        schoolId: schools[0]?._id || '',
        assignedSchoolIds: []
      });
      await loadData();
    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Failed to create user.' });
    }
  };

  const openAssignModal = (staff) => {
    setSelectedStaff(staff);
    setAssignedSchoolsList(staff.assignedSchoolIds || []);
    setIsAssignModalOpen(true);
  };

  const handleSaveStaffAssignments = async () => {
    if (!selectedStaff) return;
    try {
      await api.assignStaffSchools(selectedStaff._id, assignedSchoolsList);
      setAlert({ 
        type: 'success', 
        message: `School assignments updated for ${selectedStaff.name}.` 
      });
      setIsAssignModalOpen(false);
      await loadData();
    } catch (err) {
      setAlert({ type: 'error', message: 'Failed to update assignments.' });
    }
  };

  const toggleSchoolInAssignment = (schoolId) => {
    setAssignedSchoolsList(prev => 
      prev.includes(schoolId) 
        ? prev.filter(id => id !== schoolId) 
        : [...prev, schoolId]
    );
  };

  const filteredUsers = users.filter(u => {
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesSchool = schoolFilter === 'all' || 
      u.schoolId === schoolFilter || 
      (u.assignedSchoolIds && u.assignedSchoolIds.includes(schoolFilter));
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || 
      u.email.toLowerCase().includes(search.toLowerCase());
    return matchesRole && matchesSchool && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">User & Account Directory</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage student registrations, staff training credentials, and multi-school authorizations
          </p>
        </div>
        <button
          onClick={() => {
            setFormData(prev => ({ ...prev, schoolId: schools[0]?._id || '' }));
            setIsAddModalOpen(true);
          }}
          className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white shadow-sm transition"
        >
          <UserPlus className="w-4 h-4" />
          <span>Create New User</span>
        </button>
      </div>

      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-700"
          >
            <option value="all">All Roles</option>
            <option value="student">Students</option>
            <option value="staff">Training Staff</option>
            <option value="admin">Administrators</option>
          </select>

          {/* School Filter */}
          <select
            value={schoolFilter}
            onChange={(e) => setSchoolFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-700 max-w-xs"
          >
            <option value="all">All Schools</option>
            {schools.map(s => (
              <option key={s._id} value={s._id}>{s.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* User Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <LoadingSpinner text="Loading user accounts..." />
        ) : filteredUsers.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No users found"
            description="No user accounts match the selected filters. Add a new account to populate the directory."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Account Holder</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">School Association</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 text-sm">{u.name}</div>
                      <div className="text-slate-400 text-[11px] flex items-center mt-0.5">
                        <Mail className="w-3 h-3 mr-1 text-slate-400" />
                        <span>{u.email}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                        u.role === 'admin' 
                          ? 'bg-purple-100 text-purple-700' 
                          : u.role === 'staff' 
                          ? 'bg-amber-100 text-amber-800' 
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {u.role === 'admin' ? 'Administrator' : u.role === 'staff' ? 'Training Staff' : 'Student'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-700">
                      {u.role === 'student' && (
                        <div className="flex items-center text-xs font-medium text-slate-800">
                          <Building2 className="w-3.5 h-3.5 mr-1 text-slate-400" />
                          <span>{u.schoolName || 'Greenwood High School'}</span>
                        </div>
                      )}
                      {u.role === 'staff' && (
                        <div>
                          <div className="flex flex-wrap gap-1">
                            {u.assignedSchoolNames && u.assignedSchoolNames.length > 0 ? (
                              u.assignedSchoolNames.map((name, idx) => (
                                <span key={idx} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-medium border border-slate-200">
                                  {name}
                                </span>
                              ))
                            ) : (
                              <span className="text-slate-400 text-[11px] italic">No assigned schools</span>
                            )}
                          </div>
                        </div>
                      )}
                      {u.role === 'admin' && (
                        <span className="text-xs text-purple-700 font-medium">All Schools (System Admin)</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <Badge variant={u.active !== false ? 'success' : 'inactive'}>
                        {u.active !== false ? 'Active' : 'Suspended'}
                      </Badge>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {u.role === 'staff' && (
                        <button
                          onClick={() => openAssignModal(u)}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-200 transition"
                        >
                          Assign Schools
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create User Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Create New User Account"
      >
        <form onSubmit={handleCreateUser} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="e.g. Alex Johnson"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="alex@school.edu"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Temporary Password *
            </label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              User Role *
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="student">Student</option>
              <option value="staff">Training Staff</option>
              <option value="admin">Main Administrator</option>
            </select>
          </div>

          {formData.role === 'student' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Enrolled School *
              </label>
              <select
                value={formData.schoolId}
                onChange={(e) => setFormData({ ...formData, schoolId: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {schools.map(s => (
                  <option key={s._id} value={s._id}>{s.name} ({s.code})</option>
                ))}
              </select>
            </div>
          )}

          <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white rounded-xl shadow-sm transition"
            >
              Create Account
            </button>
          </div>
        </form>
      </Modal>

      {/* Assign Staff to Schools Modal */}
      <Modal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        title={`Assign Schools to ${selectedStaff?.name || 'Staff'}`}
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-500 leading-relaxed">
            Select the schools this training instructor is authorized to access and conduct attendance verification for:
          </p>

          <div className="space-y-2 border border-slate-200 rounded-xl p-3 max-h-60 overflow-y-auto">
            {schools.map(sch => {
              const isChecked = assignedSchoolsList.includes(sch._id);
              return (
                <label
                  key={sch._id}
                  className={`flex items-center justify-between p-2.5 rounded-lg border text-xs cursor-pointer transition ${
                    isChecked ? 'bg-brand-50/80 border-brand-200 text-brand-900 font-semibold' : 'border-slate-100 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleSchoolInAssignment(sch._id)}
                      className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                    />
                    <span>{sch.name}</span>
                  </div>
                  <span className="font-mono text-[10px] text-slate-400">{sch.code}</span>
                </label>
              );
            })}
          </div>

          <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAssignModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveStaffAssignments}
              className="px-4 py-2 text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white rounded-xl shadow-sm transition"
            >
              Save Assigned Schools
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
