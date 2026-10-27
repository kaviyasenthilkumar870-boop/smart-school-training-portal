const repository = require('../store/repository');

exports.getEventAttendance = async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await repository.getEventById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found.' });
    }

    // Role-based authorization: if staff, check that staff is assigned to this event's school(s)
    if (req.user && req.user.role === 'staff') {
      const assigned = req.user.assignedSchoolIds || [];
      const isEligible = !event.eligibleSchoolIds || 
        event.eligibleSchoolIds.length === 0 || 
        event.eligibleSchoolIds.some(sid => assigned.includes(sid));

      if (!isEligible) {
        return res.status(403).json({ message: 'You are not authorised to access attendance for this school event.' });
      }
    }

    const participants = await repository.getEventAttendanceRoster(eventId);
    res.json({ event, participants });
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving event attendance roster.' });
  }
};

exports.markAttendance = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { records } = req.body;

    if (!Array.isArray(records)) {
      return res.status(400).json({ message: 'Records must be an array of attendance items.' });
    }

    const event = await repository.getEventById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found.' });
    }

    // Verify staff authorization
    if (req.user && req.user.role === 'staff') {
      const assigned = req.user.assignedSchoolIds || [];
      const isEligible = !event.eligibleSchoolIds || 
        event.eligibleSchoolIds.length === 0 || 
        event.eligibleSchoolIds.some(sid => assigned.includes(sid));

      if (!isEligible) {
        return res.status(403).json({ message: 'You are not authorised to record attendance for this event.' });
      }
    }

    const result = await repository.saveAttendanceRecords(
      eventId, 
      records, 
      req.user?._id || 'u_staff_01'
    );

    res.json({
      message: `Event attendance verified and recorded for ${result.count} participants.`,
      result
    });
  } catch (err) {
    res.status(400).json({ message: err.message || 'Error recording event attendance.' });
  }
};
