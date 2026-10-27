const express = require('express');
const router = express.Router();
const registrationController = require('../controllers/registrationController');
const { authenticateToken, requireRole } = require('../middleware/auth');

router.get('/', authenticateToken, registrationController.getRegistrations);
router.post('/', authenticateToken, requireRole('student', 'admin'), registrationController.registerForEvent);
router.delete('/:eventId', authenticateToken, registrationController.cancelRegistration);

module.exports = router;
