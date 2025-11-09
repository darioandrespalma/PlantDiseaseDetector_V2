// routes/auth.js
const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { loginLimiter } = require('../middleware/rateLimiters');

// Register new user (sin rate limit, pero podrías agregarlo si lo deseas)
router.post('/register', register);

// Login user (con protección contra bruteforce)
router.post('/login', loginLimiter, login);

module.exports = router;