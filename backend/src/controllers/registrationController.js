const repository = require('../store/repository');

exports.getRegistrations = async (req, res) => {
  try {
    const filter = {};
    const { myRegistrations, eventId } = req.query;

    if (req.user && req.user.role === 'student') {
      // Students can ONLY view their own registrations
      filter.studentId = req.user._id;
    } else if (myRegistrations === 'true' && req.user) {
      filter.studentId = req.user._id;
    }

    if (eventId) {
      filter.eventId = eventId;
    }

    const registrations = await repository.getRegistrations(filter);
    res.json({ registrations });
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving registrations.' });
  }
};

exports.registerForEvent = async (req, res) => {
  try {
    const { eventId } = req.body;
    if (!eventId) {
      return res.status(400).json({ message: 'Event ID is required for registration.' });
    }

    if (!req.user || (req.user.role !== 'student' && req.user.role !== 'admin')) {
      return res.status(403).json({ message: 'Only enrolled students or administrators can register for training events.' });
    }

    const targetStudentId = (req.user.role === 'admin' && req.body.studentId) ? req.body.studentId : req.user._id;
    const targetStudent = await repository.getUserById(targetStudentId);
    const targetSchoolId = targetStudent ? targetStudent.schoolId : (req.user.schoolId || 'sch_greenwood_01');

    const newReg = await repository.registerStudentForEvent({
      eventId,
      studentId: targetStudentId,
      schoolId: targetSchoolId
    });

    res.status(201).json({
      message: 'Successfully registered for event.',
      registration: newReg
    });
  } catch (err) {
    res.status(400).json({ message: err.message || 'Registration failed.' });
  }
};

exports.cancelRegistration = async (req, res) => {
  try {
    const { eventId } = req.params;
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    const cancelled = await repository.cancelRegistration(eventId, req.user._id);
    res.json({ message: 'Registration cancelled successfully.', registration: cancelled });
  } catch (err) {
    res.status(400).json({ message: err.message || 'Cancellation failed.' });
  }
};
