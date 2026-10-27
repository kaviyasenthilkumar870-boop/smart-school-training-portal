const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { authenticateToken, requireRole } = require('../middleware/auth');

// Optional auth for public viewing / scoped viewing
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return next();

  const jwt = require('jsonwebtoken');
  const JWT_SECRET = process.env.JWT_SECRET || 'smart_school_portal_secret_key_dev_2026';
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (!err) req.user = user;
    next();
  });
};

router.get('/', optionalAuth, eventController.getEvents);
router.get('/:id', optionalAuth, eventController.getEventById);

// Admin-only event mutations
router.post('/', authenticateToken, requireRole('admin'), eventController.createEvent);
router.patch('/:id/publish', authenticateToken, requireRole('admin'), eventController.publishEvent);

module.exports = router;
