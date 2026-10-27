const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { authenticateToken, requireRole } = require('../middleware/auth');

// School attendance analytics
router.get('/schools', authenticateToken, requireRole('admin', 'staff'), reportController.getSchoolReports);

module.exports = router;
