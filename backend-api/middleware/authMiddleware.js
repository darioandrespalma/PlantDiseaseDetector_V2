// backend-api/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  let token;

  // 1. Leer el token del header 'Authorization'
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 2. Obtener el token (ej. "Bearer eyJhbG...")
      token = req.headers.authorization.split(' ')[1];

      // 3. Verificar el token usando tu clave secreta
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 4. Obtener el usuario de la BD y adjuntarlo al objeto 'req'
      // Esto permite que los siguientes controladores sepan QUIÉN está haciendo la petición
      req.user = await User.findById(decoded.id).select('-password');
      
      next(); // El token es válido, continuar
    } catch (error) {
      res.status(401).json({ message: 'No autorizado, el token falló' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'No autorizado, no hay token' });
  }
};