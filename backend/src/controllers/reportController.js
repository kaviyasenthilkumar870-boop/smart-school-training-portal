const repository = require('../store/repository');

exports.getSchoolReports = async (req, res) => {
  try {
    const reports = await repository.getSchoolReports();
    res.json({ reports });
  } catch (err) {
    res.status(500).json({ message: 'Error compiling school reports.' });
  }
};
