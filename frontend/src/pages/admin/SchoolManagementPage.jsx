import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import Modal from '../../components/Modal';
import Badge from '../../components/Badge';
import Alert from '../../components/Alert';
import EmptyState from '../../components/EmptyState';
import LoadingSpinner from '../../components/LoadingSpinner';
import { 
  Building2, 
  Plus, 
  Search, 
  Edit2, 
  Power, 
  CheckCircle2, 
  MapPin, 
  Mail, 
  Phone
} from 'lucide-react';

export default function SchoolManagementPage() {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [alert, setAlert] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSchool, setEditingSchool] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    address: '',
    contactEmail: '',
    contactPhone: ''
  });

  const loadSchools = async () => {
    try {
      setLoading(true);
      const res = await api.getSchools();
      if (res && res.schools) {
        setSchools(res.schools);
      }
    } catch (err) {
      console.warn('Load schools error:', err);
      // Fallback demo schools if API is waiting
      setSchools([
        {
          _id: 'sch_greenwood_01',
          name: 'Greenwood High School',
          code: 'GHS-01',
          address: '42 Pine Valley Avenue, Sector 4',
          contactEmail: 'admin@greenwood.edu',
          contactPhone: '+1 (555) 234-5678',
          active: true,
          studentCount: 142
        },
        {
          _id: 'sch_oakridge_02',
          name: 'Oakridge Academy',
          code: 'ORA-02',
          address: '88 Heritage Boulevard',
          contactEmail: 'principal@oakridge.edu',
          contactPhone: '+1 (555) 876-5432',
          active: true,
          studentCount: 98
        },
        {
          _id: 'sch_riverside_03',
          name: 'Riverside STEM High',
          code: 'RSH-03',
          address: '10 Science Park Crescent',
          contactEmail: 'stem@riverside.edu',
          contactPhone: '+1 (555) 345-6789',
          active: true,
          studentCount: 110
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSchools();
  }, []);

  const openAddModal = () => {
    setEditingSchool(null);
    setFormData({
      name: '',
      code: '',
      address: '',
      contactEmail: '',
      contactPhone: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (sch) => {
    setEditingSchool(sch);
    setFormData({
      name: sch.name,
      code: sch.code,
      address: sch.address || '',
      contactEmail: sch.contactEmail || '',
      contactPhone: sch.contactPhone || ''
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.code.trim()) {
      setAlert({ type: 'error', message: 'School Name and Code are required.' });
      return;
    }

    try {
      if (editingSchool) {
        await api.updateSchool(editingSchool._id, formData);
        setAlert({ type: 'success', message: `School "${formData.name}" updated successfully.` });
      } else {
        await api.createSchool(formData);
        setAlert({ type: 'success', message: `New school "${formData.name}" added successfully.` });
      }
      setIsModalOpen(false);
      await loadSchools();
    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Operation failed.' });
    }
  };

  const handleToggleStatus = async (sch) => {
    try {
      await api.toggleSchoolStatus(sch._id);
      await loadSchools();
      setAlert({ 
        type: 'info', 
        message: `School "${sch.name}" status updated.` 
      });
    } catch (err) {
      setAlert({ type: 'error', message: 'Could not update school status.' });
    }
  };

  const filteredSchools = schools.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Title & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">School Network Management</h1>
          <p className="text-xs text-slate-500 mt-1">
            Register and manage institutions eligible for portal training programmes
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add New School</span>
        </button>
      </div>

      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by school name or code..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
        <span className="text-xs text-slate-500 font-medium hidden sm:inline">
          Total Schools: <span className="font-bold text-slate-800">{schools.length}</span>
        </span>
      </div>

      {/* Schools Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <LoadingSpinner text="Loading schools..." />
        ) : filteredSchools.length === 0 ? (
          <EmptyState
            icon={Building2}
            title="No schools found"
            description="No institutions match your search criteria. Add a new school to get started."
            action={
              <button
                onClick={openAddModal}
                className="px-3.5 py-2 text-xs font-semibold bg-brand-600 text-white rounded-xl"
              >
                Add School Now
              </button>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-4">School Details</th>
                  <th className="py-3.5 px-4">Code</th>
                  <th className="py-3.5 px-4">Contact Info</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSchools.map((sch) => (
                  <tr key={sch._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 text-sm">{sch.name}</div>
                      <div className="text-slate-400 text-[11px] flex items-center mt-0.5">
                        <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                        <span className="truncate max-w-xs">{sch.address || 'Address not specified'}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-brand-700">
                      {sch.code}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 space-y-0.5">
                      <div className="flex items-center text-[11px]">
                        <Mail className="w-3 h-3 mr-1 text-slate-400" />
                        <span>{sch.contactEmail || 'N/A'}</span>
                      </div>
                      <div className="flex items-center text-[11px] text-slate-400">
                        <Phone className="w-3 h-3 mr-1 text-slate-400" />
                        <span>{sch.contactPhone || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <Badge variant={sch.active !== false ? 'success' : 'inactive'}>
                        {sch.active !== false ? 'Active' : 'Deactivated'}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => openEditModal(sch)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-brand-600 hover:bg-brand-50 transition"
                        title="Edit school"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(sch)}
                        className={`p-1.5 rounded-lg transition ${
                          sch.active !== false
                            ? 'text-slate-500 hover:text-rose-600 hover:bg-rose-50'
                            : 'text-slate-500 hover:text-emerald-600 hover:bg-emerald-50'
                        }`}
                        title={sch.active !== false ? 'Deactivate School' : 'Activate School'}
                      >
                        <Power className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit School Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSchool ? 'Edit School Details' : 'Add New Institution'}
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              School Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="e.g. Greenwood High School"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              School Code / Identifier *
            </label>
            <input
              type="text"
              required
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              className="w-full px-3 py-2 text-xs font-mono uppercase rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="e.g. GHS-01"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Physical Campus Address
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="e.g. 42 Pine Valley Avenue, Sector 4"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Admin Email
              </label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="admin@greenwood.edu"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="+1 (555) 000-0000"
              />
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
              {editingSchool ? 'Save Changes' : 'Create School'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
