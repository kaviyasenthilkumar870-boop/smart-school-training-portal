const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  eventId: {
    type: String,
    required: [true, 'Event ID is required']
  },
  studentId: {
    type: String,
    required: [true, 'Student ID is required']
  },
  schoolId: {
    type: String,
    required: [true, 'School ID is required']
  },
  markedByStaffId: {
    type: String,
    required: [true, 'Staff ID who marked attendance is required']
  },
  status: {
    type: String,
    enum: ['present', 'absent'],
    default: 'present'
  },
  markedAt: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String,
    default: ''
  }
});

// Compound unique index to strictly prevent duplicate attendance records for the same event and student
attendanceSchema.index({ eventId: 1, studentId: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
