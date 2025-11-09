// backend-api/middleware/rateLimiters.js
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // 5 intentos por IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Demasiados intentos de inicio de sesión. Inténtalo de nuevo en 15 minutos.',
  },
});

module.exports = {
  loginLimiter,
};