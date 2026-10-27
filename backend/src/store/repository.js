const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { getIsConnected } = require('../config/db');

// Models
const School = require('../models/School');
const User = require('../models/User');
const Event = require('../models/Event');
const Registration = require('../models/Registration');
const Attendance = require('../models/Attendance');

const DATA_DIR = path.join(__dirname, '../../data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// In-memory cache synced with disk
let dbState = null;

// Helper: Hash password synchronously
function hashPassword(plainText) {
  return bcrypt.hashSync(plainText, 10);
}

// Initial seed data generator
function getInitialSeed() {
  const defaultPasswordHash = hashPassword('password123');

  const schools = [
    {
      _id: 'sch_greenwood_01',
      name: 'Greenwood High School',
      code: 'GHS-01',
      address: '42 Pine Valley Avenue, Sector 4',
      contactEmail: 'admin@greenwood.edu',
      contactPhone: '+1 (555) 234-5678',
      active: true,
      createdAt: new Date().toISOString()
    },
    {
      _id: 'sch_oakridge_02',
      name: 'Oakridge Academy',
      code: 'ORA-02',
      address: '88 Heritage Boulevard',
      contactEmail: 'principal@oakridge.edu',
      contactPhone: '+1 (555) 876-5432',
      active: true,
      createdAt: new Date().toISOString()
    },
    {
      _id: 'sch_riverside_03',
      name: 'Riverside STEM High',
      code: 'RSH-03',
      address: '10 Science Park Crescent',
      contactEmail: 'stem@riverside.edu',
      contactPhone: '+1 (555) 345-6789',
      active: true,
      createdAt: new Date().toISOString()
    }
  ];

  const users = [
    {
      _id: 'u_admin_01',
      name: 'Dr. Sarah Jenkins',
      email: 'admin@smartschool.edu',
      password: defaultPasswordHash,
      role: 'admin',
      schoolId: null,
      assignedSchoolIds: [],
      active: true,
      createdAt: new Date().toISOString()
    },
    {
      _id: 'u_staff_01',
      name: 'David Martinez',
      email: 'trainer.david@smartschool.edu',
      password: defaultPasswordHash,
      role: 'staff',
      schoolId: null,
      assignedSchoolIds: ['sch_greenwood_01', 'sch_oakridge_02'],
      active: true,
      createdAt: new Date().toISOString()
    },
    {
      _id: 'u_staff_02',
      name: 'Prof. Helen Clark',
      email: 'helen.trainer@smartschool.edu',
      password: defaultPasswordHash,
      role: 'staff',
      schoolId: null,
      assignedSchoolIds: ['sch_riverside_03'],
      active: true,
      createdAt: new Date().toISOString()
    },
    {
      _id: 'u_student_01',
      name: 'Emma Watson',
      email: 'emma.student@greenwood.edu',
      password: defaultPasswordHash,
      role: 'student',
      schoolId: 'sch_greenwood_01',
      assignedSchoolIds: [],
      active: true,
      createdAt: new Date().toISOString()
    },
    {
      _id: 'u_student_02',
      name: 'Marcus Bell',
      email: 'marcus.bell@greenwood.edu',
      password: defaultPasswordHash,
      role: 'student',
      schoolId: 'sch_greenwood_01',
      assignedSchoolIds: [],
      active: true,
      createdAt: new Date().toISOString()
    },
    {
      _id: 'u_student_03',
      name: 'Liam Chen',
      email: 'liam.chen@oakridge.edu',
      password: defaultPasswordHash,
      role: 'student',
      schoolId: 'sch_oakridge_02',
      assignedSchoolIds: [],
      active: true,
      createdAt: new Date().toISOString()
    },
    {
      _id: 'u_student_04',
      name: 'Sophia Patel',
      email: 'sophia.patel@riverside.edu',
      password: defaultPasswordHash,
      role: 'student',
      schoolId: 'sch_riverside_03',
      assignedSchoolIds: [],
      active: true,
      createdAt: new Date().toISOString()
    }
  ];

  const events = [
    {
      _id: 'ev_bootcamp_01',
      title: 'Artificial Intelligence & Robotics Bootcamp',
      description: 'Hands-on workshop introducing Python, neural networks, and micro-controller robotics programming.',
      category: 'Technology',
      date: '2026-11-15',
      startTime: '09:30 AM',
      endTime: '03:30 PM',
      venue: 'Central Innovation Lab & Auditorium',
      registrationDeadline: '2026-11-10',
      capacity: 60,
      eligibleSchoolIds: ['sch_greenwood_01', 'sch_oakridge_02'],
      status: 'published',
      createdBy: 'u_admin_01',
      createdAt: new Date().toISOString()
    },
    {
      _id: 'ev_cyber_02',
      title: 'Junior Cyber Safety & Ethical Hacking Symposium',
      description: 'Learn cyber threat mitigation, safe digital citizenship, and practical network vulnerability defense.',
      category: 'Cybersecurity',
      date: '2026-11-22',
      startTime: '10:00 AM',
      endTime: '01:00 PM',
      venue: 'STEM Learning Hall B',
      registrationDeadline: '2026-11-18',
      capacity: 80,
      eligibleSchoolIds: ['sch_oakridge_02', 'sch_riverside_03'],
      status: 'published',
      createdBy: 'u_admin_01',
      createdAt: new Date().toISOString()
    },
    {
      _id: 'ev_clean_03',
      title: 'Clean Energy & Environmental Science Challenge',
      description: 'Interactive team competition designing miniature solar photovoltaic cells and water filtration sensors.',
      category: 'Science',
      date: '2026-12-05',
      startTime: '09:00 AM',
      endTime: '04:00 PM',
      venue: 'Green Campus Eco Pavillion',
      registrationDeadline: '2026-11-28',
      capacity: 50,
      eligibleSchoolIds: ['sch_greenwood_01', 'sch_riverside_03'],
      status: 'published',
      createdBy: 'u_admin_01',
      createdAt: new Date().toISOString()
    }
  ];

  const registrations = [
    {
      _id: 'reg_01',
      eventId: 'ev_bootcamp_01',
      studentId: 'u_student_01',
      schoolId: 'sch_greenwood_01',
      registrationDate: '2026-10-20',
      status: 'registered',
      createdAt: new Date().toISOString()
    },
    {
      _id: 'reg_02',
      eventId: 'ev_bootcamp_01',
      studentId: 'u_student_02',
      schoolId: 'sch_greenwood_01',
      registrationDate: '2026-10-21',
      status: 'registered',
      createdAt: new Date().toISOString()
    },
    {
      _id: 'reg_03',
      eventId: 'ev_bootcamp_01',
      studentId: 'u_student_03',
      schoolId: 'sch_oakridge_02',
      registrationDate: '2026-10-22',
      status: 'registered',
      createdAt: new Date().toISOString()
    },
    {
      _id: 'reg_04',
      eventId: 'ev_clean_03',
      studentId: 'u_student_01',
      schoolId: 'sch_greenwood_01',
      registrationDate: '2026-10-24',
      status: 'registered',
      createdAt: new Date().toISOString()
    }
  ];

  const attendances = [
    {
      _id: 'att_01',
      eventId: 'ev_bootcamp_01',
      studentId: 'u_student_01',
      schoolId: 'sch_greenwood_01',
      markedByStaffId: 'u_staff_01',
      status: 'present',
      markedAt: new Date().toISOString(),
      notes: 'Active participant in lab demo'
    },
    {
      _id: 'att_02',
      eventId: 'ev_bootcamp_01',
      studentId: 'u_student_02',
      schoolId: 'sch_greenwood_01',
      markedByStaffId: 'u_staff_01',
      status: 'present',
      markedAt: new Date().toISOString(),
      notes: ''
    },
    {
      _id: 'att_03',
      eventId: 'ev_bootcamp_01',
      studentId: 'u_student_03',
      schoolId: 'sch_oakridge_02',
      markedByStaffId: 'u_staff_01',
      status: 'absent',
      markedAt: new Date().toISOString(),
      notes: 'Medical leave'
    }
  ];

  return { schools, users, events, registrations, attendances };
}

// Load database state from disk or initialize
function getDB() {
  if (dbState) return dbState;

  if (fs.existsSync(DB_FILE)) {
    try {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      dbState = JSON.parse(content);
      return dbState;
    } catch (err) {
      console.error('[Repository] Error reading db.json, reinitializing...', err);
    }
  }

  // Seed file
  dbState = getInitialSeed();
  saveDB();
  return dbState;
}

// Save database state to disk atomically
function saveDB() {
  if (!dbState) return;
  try {
    const tempPath = `${DB_FILE}.tmp`;
    fs.writeFileSync(tempPath, JSON.stringify(dbState, null, 2), 'utf-8');
    fs.renameSync(tempPath, DB_FILE);
  } catch (err) {
    console.error('[Repository] Error writing to db.json:', err);
  }
}

// =================== SCHOOL OPERATIONS ===================
const repository = {
  getSchools: async (options = {}) => {
    const db = getDB();
    let result = [...db.schools];
    if (options.activeOnly) {
      result = result.filter(s => s.active !== false);
    }
    return result;
  },

  getSchoolById: async (id) => {
    const db = getDB();
    return db.schools.find(s => s._id === id) || null;
  },

  createSchool: async (schoolData) => {
    const db = getDB();
    // Validate uniqueness of code
    const existing = db.schools.find(s => s.code.toUpperCase() === schoolData.code.toUpperCase());
    if (existing) {
      throw new Error(`School with code "${schoolData.code}" already exists.`);
    }

    const newSchool = {
      _id: `sch_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      name: schoolData.name.trim(),
      code: schoolData.code.toUpperCase().trim(),
      address: schoolData.address || '',
      contactEmail: schoolData.contactEmail || '',
      contactPhone: schoolData.contactPhone || '',
      active: true,
      createdAt: new Date().toISOString()
    };

    db.schools.unshift(newSchool);
    saveDB();

    // Also persist to MongoDB if connected
    if (getIsConnected()) {
      try {
        await School.create(newSchool);
      } catch (err) {
        console.warn('[MongoDB Sync] School insert skipped:', err.message);
      }
    }

    return newSchool;
  },

  updateSchool: async (id, updateData) => {
    const db = getDB();
    const idx = db.schools.findIndex(s => s._id === id);
    if (idx === -1) throw new Error('School not found.');

    db.schools[idx] = {
      ...db.schools[idx],
      ...updateData,
      _id: id // preserve immutable ID
    };
    saveDB();
    return db.schools[idx];
  },

  toggleSchoolStatus: async (id) => {
    const db = getDB();
    const school = db.schools.find(s => s._id === id);
    if (!school) throw new Error('School not found.');
    school.active = !school.active;
    saveDB();
    return school;
  },

  // =================== USER OPERATIONS ===================
  getUsers: async (filter = {}) => {
    const db = getDB();
    let result = db.users.map(u => {
      // populate school names
      const s = db.schools.find(sc => sc._id === u.schoolId);
      const assignedNames = (u.assignedSchoolIds || []).map(asId => {
        const found = db.schools.find(sc => sc._id === asId);
        return found ? found.name : asId;
      });

      const { password, ...safeUser } = u;
      return {
        ...safeUser,
        schoolName: s ? s.name : (u.role === 'admin' ? 'Central Administration' : ''),
        assignedSchoolNames: assignedNames
      };
    });

    if (filter.role) {
      result = result.filter(u => u.role === filter.role);
    }
    if (filter.schoolId) {
      result = result.filter(u => u.schoolId === filter.schoolId || (u.assignedSchoolIds && u.assignedSchoolIds.includes(filter.schoolId)));
    }
    return result;
  },

  getUserById: async (id) => {
    const db = getDB();
    const u = db.users.find(user => user._id === id);
    if (!u) return null;
    const s = db.schools.find(sc => sc._id === u.schoolId);
    const assignedNames = (u.assignedSchoolIds || []).map(asId => {
      const found = db.schools.find(sc => sc._id === asId);
      return found ? found.name : asId;
    });

    const { password, ...safeUser } = u;
    return {
      ...safeUser,
      schoolName: s ? s.name : '',
      assignedSchoolNames: assignedNames
    };
  },

  getUserByEmailWithPassword: async (email) => {
    const db = getDB();
    return db.users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  createUser: async (userData) => {
    const db = getDB();
    const existing = db.users.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
    if (existing) {
      throw new Error(`User with email "${userData.email}" already exists.`);
    }

    const hashedPassword = hashPassword(userData.password || 'password123');
    const newUser = {
      _id: `u_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      name: userData.name.trim(),
      email: userData.email.toLowerCase().trim(),
      password: hashedPassword,
      role: userData.role || 'student',
      schoolId: userData.schoolId || null,
      assignedSchoolIds: userData.assignedSchoolIds || [],
      active: true,
      createdAt: new Date().toISOString()
    };

    db.users.unshift(newUser);
    saveDB();

    // Return safe user without password
    const { password, ...safeUser } = newUser;
    const s = db.schools.find(sc => sc._id === safeUser.schoolId);
    return {
      ...safeUser,
      schoolName: s ? s.name : ''
    };
  },

  assignStaffSchools: async (userId, schoolIds) => {
    const db = getDB();
    const user = db.users.find(u => u._id === userId);
    if (!user) throw new Error('User not found.');
    if (user.role !== 'staff') throw new Error('Can only assign schools to staff members.');

    user.assignedSchoolIds = schoolIds;
    saveDB();
    return user;
  },

  // =================== EVENT OPERATIONS ===================
  getEvents: async (options = {}) => {
    const db = getDB();
    let list = [...db.events];

    if (options.publishedOnly) {
      list = list.filter(e => e.status === 'published');
    }

    // Filter by student's school: only events where student's school is eligible
    if (options.schoolId) {
      list = list.filter(e => 
        !e.eligibleSchoolIds || 
        e.eligibleSchoolIds.length === 0 || 
        e.eligibleSchoolIds.includes(options.schoolId)
      );
    }

    // Filter by staff's assigned schools: only events overlapping with staff's assigned schools
    if (options.staffAssignedSchoolIds && Array.isArray(options.staffAssignedSchoolIds)) {
      list = list.filter(e => 
        !e.eligibleSchoolIds ||
        e.eligibleSchoolIds.length === 0 ||
        e.eligibleSchoolIds.some(sid => options.staffAssignedSchoolIds.includes(sid))
      );
    }

    // Populate registeredCount & school names
    return list.map(ev => {
      const regCount = db.registrations.filter(r => r.eventId === ev._id && r.status === 'registered').length;
      const schoolNames = (ev.eligibleSchoolIds || []).map(sid => {
        const found = db.schools.find(s => s._id === sid);
        return found ? found.name : sid;
      });

      return {
        ...ev,
        registeredCount: regCount,
        schoolNames
      };
    });
  },

  getEventById: async (id) => {
    const db = getDB();
    const ev = db.events.find(e => e._id === id);
    if (!ev) return null;

    const regCount = db.registrations.filter(r => r.eventId === ev._id && r.status === 'registered').length;
    const schoolNames = (ev.eligibleSchoolIds || []).map(sid => {
      const found = db.schools.find(s => s._id === sid);
      return found ? found.name : sid;
    });

    return { ...ev, registeredCount: regCount, schoolNames };
  },

  createEvent: async (eventData, creatorId) => {
    const db = getDB();
    const newEvent = {
      _id: `ev_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      title: eventData.title.trim(),
      description: eventData.description || '',
      category: eventData.category || 'Technology',
      date: eventData.date,
      startTime: eventData.startTime || '10:00 AM',
      endTime: eventData.endTime || '02:00 PM',
      venue: eventData.venue,
      registrationDeadline: eventData.registrationDeadline,
      capacity: Number(eventData.capacity) || 50,
      eligibleSchoolIds: eventData.eligibleSchoolIds || [],
      status: eventData.status || 'published',
      createdBy: creatorId || null,
      createdAt: new Date().toISOString()
    };

    db.events.unshift(newEvent);
    saveDB();
    return newEvent;
  },

  publishEvent: async (id) => {
    const db = getDB();
    const ev = db.events.find(e => e._id === id);
    if (!ev) throw new Error('Event not found.');
    ev.status = ev.status === 'published' ? 'draft' : 'published';
    saveDB();
    return ev;
  },

  // =================== REGISTRATION OPERATIONS ===================
  getRegistrations: async (filter = {}) => {
    const db = getDB();
    let result = [...db.registrations];

    if (filter.studentId) {
      result = result.filter(r => r.studentId === filter.studentId);
    }
    if (filter.eventId) {
      result = result.filter(r => r.eventId === filter.eventId);
    }

    // Populate event title, date, venue, attendance status
    return result.map(reg => {
      const ev = db.events.find(e => e._id === reg.eventId);
      const att = db.attendances.find(a => a.eventId === reg.eventId && a.studentId === reg.studentId);

      return {
        ...reg,
        eventTitle: ev ? ev.title : 'Event',
        category: ev ? ev.category : 'Training',
        date: ev ? ev.date : '',
        venue: ev ? ev.venue : '',
        attendanceStatus: att ? att.status : 'pending'
      };
    });
  },

  registerStudentForEvent: async ({ eventId, studentId, schoolId }) => {
    const db = getDB();

    const ev = db.events.find(e => e._id === eventId);
    if (!ev) throw new Error('Event not found.');

    // 1. Check school eligibility
    if (ev.eligibleSchoolIds && ev.eligibleSchoolIds.length > 0) {
      if (!ev.eligibleSchoolIds.includes(schoolId)) {
        throw new Error('This training event is not open to your school.');
      }
    }

    // 2. Prevent duplicate registration
    const existing = db.registrations.find(
      r => r.eventId === eventId && r.studentId === studentId && r.status === 'registered'
    );
    if (existing) {
      throw new Error('You are already registered for this event.');
    }

    // 3. Check capacity
    const currentCount = db.registrations.filter(r => r.eventId === eventId && r.status === 'registered').length;
    if (ev.capacity && currentCount >= ev.capacity) {
      throw new Error('Registration closed: Event capacity has been reached.');
    }

    const newReg = {
      _id: `reg_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      eventId,
      studentId,
      schoolId,
      registrationDate: new Date().toISOString().split('T')[0],
      status: 'registered',
      createdAt: new Date().toISOString()
    };

    db.registrations.push(newReg);
    saveDB();
    return newReg;
  },

  cancelRegistration: async (eventId, studentId) => {
    const db = getDB();
    const reg = db.registrations.find(r => r.eventId === eventId && r.studentId === studentId);
    if (!reg) throw new Error('Registration not found.');
    reg.status = 'cancelled';
    saveDB();
    return reg;
  },

  // =================== ATTENDANCE OPERATIONS ===================
  getEventAttendanceRoster: async (eventId) => {
    const db = getDB();
    // Get all registered students for this event
    const registered = db.registrations.filter(r => r.eventId === eventId && r.status === 'registered');

    return registered.map(reg => {
      const student = db.users.find(u => u._id === reg.studentId);
      const school = db.schools.find(s => s._id === reg.schoolId);
      const att = db.attendances.find(a => a.eventId === eventId && a.studentId === reg.studentId);

      return {
        registrationId: reg._id,
        studentId: reg.studentId,
        name: student ? student.name : 'Student',
        email: student ? student.email : '',
        schoolId: reg.schoolId,
        schoolName: school ? school.name : 'School',
        registrationDate: reg.registrationDate,
        attendanceStatus: att ? att.status : 'present', // default to present on roster
        markedAt: att ? att.markedAt : null,
        notes: att ? att.notes : ''
      };
    });
  },

  saveAttendanceRecords: async (eventId, records, staffId) => {
    const db = getDB();

    records.forEach(rec => {
      const existingIdx = db.attendances.findIndex(
        a => a.eventId === eventId && a.studentId === rec.studentId
      );

      const student = db.users.find(u => u._id === rec.studentId);
      const schoolId = student?.schoolId || rec.schoolId || 'sch_unknown';

      if (existingIdx !== -1) {
        // Update existing record (prevent duplicate rows)
        db.attendances[existingIdx] = {
          ...db.attendances[existingIdx],
          status: rec.status, // 'present' | 'absent'
          markedByStaffId: staffId,
          markedAt: new Date().toISOString(),
          notes: rec.notes || db.attendances[existingIdx].notes || ''
        };
      } else {
        // Insert new verified record
        db.attendances.push({
          _id: `att_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          eventId,
          studentId: rec.studentId,
          schoolId,
          markedByStaffId: staffId,
          status: rec.status,
          markedAt: new Date().toISOString(),
          notes: rec.notes || ''
        });
      }
    });

    saveDB();
    return { success: true, count: records.length };
  },

  // =================== REPORTS & ANALYTICS ===================
  getSchoolReports: async () => {
    const db = getDB();

    return db.schools.map(school => {
      // Find all events eligible for this school
      const eligibleEvents = db.events.filter(
        e => !e.eligibleSchoolIds || e.eligibleSchoolIds.length === 0 || e.eligibleSchoolIds.includes(school._id)
      );

      // Registrations from this school
      const schoolRegs = db.registrations.filter(r => r.schoolId === school._id && r.status === 'registered');

      // Attendance records from this school
      const schoolAtts = db.attendances.filter(a => a.schoolId === school._id);
      const presentCount = schoolAtts.filter(a => a.status === 'present').length;
      const absentCount = schoolAtts.filter(a => a.status === 'absent').length;

      const totalRecorded = presentCount + absentCount;
      const rate = totalRecorded > 0 
        ? ((presentCount / totalRecorded) * 100).toFixed(1) + '%' 
        : (schoolRegs.length > 0 ? '100%' : '0%');

      return {
        schoolId: school._id,
        schoolName: school.name,
        code: school.code,
        totalEvents: eligibleEvents.length,
        totalRegistrations: schoolRegs.length,
        totalPresent: presentCount || schoolRegs.length,
        totalAbsent: absentCount,
        attendanceRate: rate
      };
    });
  }
};

module.exports = repository;
