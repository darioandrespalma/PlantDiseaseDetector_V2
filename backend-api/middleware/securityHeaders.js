// backend-api/middleware/securityHeaders.js
const helmet = require('helmet');

const securityHeaders = helmet({
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      'default-src': ["'self'"],
      'script-src': ["'self'", "'unsafe-inline'"], // necesario para algunos SDKs o inline scripts si los usas
      'connect-src': ["'self'", process.env.FRONTEND_URL || 'http://localhost:5173'],
      'img-src': ["'self'", 'data:', 'https:'], // para imágenes de predicción y uploads
      'font-src': ["'self'", 'https:'],
      'object-src': ["'none'"],
      'base-uri': ["'self'"],
      'frame-ancestors': ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false, // evita romper carga de imágenes externas si es necesario
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  crossOriginOpenerPolicy: { policy: 'same-origin' },
  hidePoweredBy: true,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
  xssFilter: true,
  noSniff: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
});

module.exports = securityHeaders;