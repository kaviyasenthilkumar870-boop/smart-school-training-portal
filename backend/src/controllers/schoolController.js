const repository = require('../store/repository');

exports.getSchools = async (req, res) => {
  try {
    const schools = await repository.getSchools();
    res.json({ schools });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching schools list.' });
  }
};

exports.getSchoolById = async (req, res) => {
  try {
    const school = await repository.getSchoolById(req.params.id);
    if (!school) return res.status(404).json({ message: 'School not found.' });
    res.json({ school });
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving school.' });
  }
};

exports.createSchool = async (req, res) => {
  try {
    const { name, code, address, contactEmail, contactPhone } = req.body;
    if (!name || !code) {
      return res.status(400).json({ message: 'School name and code are required.' });
    }

    const school = await repository.createSchool({
      name,
      code,
      address,
      contactEmail,
      contactPhone
    });

    res.status(201).json({ message: 'School created successfully', school });
  } catch (err) {
    res.status(400).json({ message: err.message || 'Error creating school.' });
  }
};

exports.updateSchool = async (req, res) => {
  try {
    const updated = await repository.updateSchool(req.params.id, req.body);
    res.json({ message: 'School updated successfully', school: updated });
  } catch (err) {
    res.status(400).json({ message: err.message || 'Error updating school.' });
  }
};

exports.toggleSchoolStatus = async (req, res) => {
  try {
    const school = await repository.toggleSchoolStatus(req.params.id);
    res.json({ 
      message: `School "${school.name}" is now ${school.active ? 'active' : 'deactivated'}.`,
      school 
    });
  } catch (err) {
    res.status(400).json({ message: err.message || 'Error toggling school status.' });
  }
};
