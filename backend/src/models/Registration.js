const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
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
  registrationDate: {
    type: String,
    default: () => new Date().toISOString().split('T')[0]
  },
  status: {
    type: String,
    enum: ['registered', 'cancelled'],
    default: 'registered'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compound unique index to strictly prevent duplicate registration for the same event
registrationSchema.index({ eventId: 1, studentId: 1 }, { unique: true });

module.exports = mongoose.model('Registration', registrationSchema);
