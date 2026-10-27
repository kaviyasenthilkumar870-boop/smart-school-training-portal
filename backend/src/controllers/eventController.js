const repository = require('../store/repository');

exports.getEvents = async (req, res) => {
  try {
    const { publishedOnly, mySchoolOnly, authorizedOnly } = req.query;
    const options = {};

    if (publishedOnly === 'true') {
      options.publishedOnly = true;
    }

    // If user is a student requesting events for their school
    if (req.user && req.user.role === 'student' && mySchoolOnly === 'true') {
      options.schoolId = req.user.schoolId;
      options.publishedOnly = true;
    }

    // If user is staff requesting only events they are assigned to
    if (req.user && req.user.role === 'staff' && authorizedOnly === 'true') {
      options.staffAssignedSchoolIds = req.user.assignedSchoolIds || [];
    }

    const events = await repository.getEvents(options);
    res.json({ events });
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving events.' });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const event = await repository.getEventById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found.' });
    res.json({ event });
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving event.' });
  }
};

exports.createEvent = async (req, res) => {
  try {
    const { 
      title, 
      description, 
      category, 
      date, 
      startTime, 
      endTime, 
      venue, 
      registrationDeadline, 
      capacity, 
      eligibleSchoolIds,
      status 
    } = req.body;

    if (!title || !date || !venue || !registrationDeadline) {
      return res.status(400).json({ message: 'Title, date, venue, and registration deadline are required.' });
    }

    const newEvent = await repository.createEvent({
      title,
      description,
      category,
      date,
      startTime,
      endTime,
      venue,
      registrationDeadline,
      capacity,
      eligibleSchoolIds,
      status
    }, req.user?._id);

    res.status(201).json({ message: 'Event created successfully', event: newEvent });
  } catch (err) {
    res.status(400).json({ message: err.message || 'Error creating event.' });
  }
};

exports.publishEvent = async (req, res) => {
  try {
    const updated = await repository.publishEvent(req.params.id);
    res.json({ 
      message: `Event is now ${updated.status}.`,
      event: updated 
    });
  } catch (err) {
    res.status(400).json({ message: err.message || 'Error updating event status.' });
  }
};
