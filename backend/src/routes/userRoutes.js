const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken, requireRole } = require('../middleware/auth');

// Admin-only user management
router.get('/', authenticateToken, requireRole('admin'), userController.getUsers);
router.post('/', authenticateToken, requireRole('admin'), userController.createUser);
router.put('/:id/assign-schools', authenticateToken, requireRole('admin'), userController.assignStaffSchools);

module.exports = router;
