const express = require('express');
const router = express.Router();
const { register, login, forgotPassword, resetPassword } = require('../controllers/authController');
const { loginLimiter } = require('../middleware/rateLimiters');

// Register new user
router.post('/register', register);

// Login user
router.post('/login', loginLimiter, login);

// Forgot Password
router.post('/forgot-password', forgotPassword);

// Reset Password
router.post('/reset-password', resetPassword);

module.exports = router;