const express = require('express');
const router = express.Router();
const schoolController = require('../controllers/schoolController');
const { authenticateToken, requireRole } = require('../middleware/auth');

// Public or authenticated list
router.get('/', schoolController.getSchools);
router.get('/:id', schoolController.getSchoolById);

// Admin-only management routes
router.post('/', authenticateToken, requireRole('admin'), schoolController.createSchool);
router.put('/:id', authenticateToken, requireRole('admin'), schoolController.updateSchool);
router.patch('/:id/toggle', authenticateToken, requireRole('admin'), schoolController.toggleSchoolStatus);

module.exports = router;
