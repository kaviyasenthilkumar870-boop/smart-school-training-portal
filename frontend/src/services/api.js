/**
 * API Service for Smart School Training Portal
 * Handles client-server communication with JWT authentication
 */

const API_BASE = import.meta.env.VITE_API_URL || '/api';

// Helper to get auth headers with JWT token
export function getAuthHeaders() {
  const token = localStorage.getItem('smart_school_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

// Generic fetch wrapper with error handling
async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = getAuthHeaders();

  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...options.headers
      }
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const fallbackMsg = res.status === 500 
        ? 'Backend API error (check if backend server on port 5050 is running)' 
        : `Request failed with status ${res.status}`;
      throw new Error(data.message || fallbackMsg);
    }

    return data;
  } catch (err) {
    // Re-throw with clear message
    throw err;
  }
}

export const api = {
  // Auth
  login: (credentials) => request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  }),
  getMe: () => request('/auth/me'),

  // Schools
  getSchools: (params = '') => request(`/schools${params}`),
  getSchoolById: (id) => request(`/schools/${id}`),
  createSchool: (data) => request('/schools', { method: 'POST', body: JSON.stringify(data) }),
  updateSchool: (id, data) => request(`/schools/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  toggleSchoolStatus: (id) => request(`/schools/${id}/toggle`, { method: 'PATCH' }),

  // Users
  getUsers: (params = '') => request(`/users${params}`),
  createUser: (data) => request('/users', { method: 'POST', body: JSON.stringify(data) }),
  updateUser: (id, data) => request(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  assignStaffSchools: (id, schoolIds) => request(`/users/${id}/assign-schools`, {
    method: 'PUT',
    body: JSON.stringify({ schoolIds })
  }),

  // Events
  getEvents: (params = '') => request(`/events${params}`),
  getEventById: (id) => request(`/events/${id}`),
  createEvent: (data) => request('/events', { method: 'POST', body: JSON.stringify(data) }),
  updateEvent: (id, data) => request(`/events/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  publishEvent: (id) => request(`/events/${id}/publish`, { method: 'PATCH' }),

  // Registrations
  getRegistrations: (params = '') => request(`/registrations${params}`),
  registerForEvent: (eventId, studentId = null) => request('/registrations', {
    method: 'POST',
    body: JSON.stringify({ eventId, studentId })
  }),
  cancelRegistration: (eventId) => request(`/registrations/${eventId}`, { method: 'DELETE' }),

  // Attendance
  getEventAttendance: (eventId) => request(`/attendance/event/${eventId}`),
  markAttendance: (eventId, records) => request(`/attendance/event/${eventId}`, {
    method: 'POST',
    body: JSON.stringify({ records }) // [{ studentId, status: 'present'|'absent', notes }]
  }),

  // Reports
  getSchoolReport: () => request('/reports/schools'),
  getEventReport: (eventId) => request(`/reports/events/${eventId}`)
};
