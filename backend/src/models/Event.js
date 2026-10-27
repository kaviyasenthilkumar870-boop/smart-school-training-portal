const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    default: 'Technology'
  },
  date: {
    type: String,
    required: [true, 'Event date is required'] // Format: YYYY-MM-DD
  },
  startTime: {
    type: String,
    default: '10:00 AM'
  },
  endTime: {
    type: String,
    default: '02:00 PM'
  },
  venue: {
    type: String,
    required: [true, 'Venue location is required']
  },
  registrationDeadline: {
    type: String,
    required: [true, 'Registration deadline is required'] // Format: YYYY-MM-DD
  },
  capacity: {
    type: Number,
    default: 50
  },
  // Multi-school eligibility: which schools can participate in this event
  eligibleSchoolIds: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'completed', 'cancelled'],
    default: 'published'
  },
  createdBy: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Event', eventSchema);
