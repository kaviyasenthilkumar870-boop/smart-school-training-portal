const repository = require('../store/repository');

exports.getUsers = async (req, res) => {
  try {
    const { role, schoolId } = req.query;
    const users = await repository.getUsers({ role, schoolId });
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users directory.' });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role, schoolId, assignedSchoolIds } = req.body;
    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required.' });
    }

    const user = await repository.createUser({
      name,
      email,
      password,
      role,
      schoolId,
      assignedSchoolIds
    });

    res.status(201).json({ message: 'User created successfully', user });
  } catch (err) {
    res.status(400).json({ message: err.message || 'Error creating user.' });
  }
};

exports.assignStaffSchools = async (req, res) => {
  try {
    const { schoolIds } = req.body;
    if (!Array.isArray(schoolIds)) {
      return res.status(400).json({ message: 'schoolIds must be an array of school identifiers.' });
    }

    const updated = await repository.assignStaffSchools(req.params.id, schoolIds);
    res.json({ message: 'Staff school assignments updated successfully', user: updated });
  } catch (err) {
    res.status(400).json({ message: err.message || 'Error assigning staff schools.' });
  }
};
