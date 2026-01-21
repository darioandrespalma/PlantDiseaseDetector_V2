const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Rutas Públicas (Sin authMiddleware)
router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;