const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Rutas Públicas (Sin authMiddleware)
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.put('/reset-password/:token', authController.resetPassword);

module.exports = router;