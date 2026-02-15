// backend-api/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // 1. Obtener token del header
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ success: false, message: 'Acceso denegado. No hay token.' });
  }

  try {
    // 2. Verificar que exista el secreto en entorno
    if (!process.env.JWT_SECRET) {
        throw new Error('FATAL: JWT_SECRET no está definido en las variables de entorno.');
    }

    // 3. Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 4. Normalizar usuario (Mantiene tu lógica de compatibilidad)
    if (decoded.user) {
        req.user = decoded.user; 
    } else if (decoded._id || decoded.id) {
        req.user = { _id: decoded._id || decoded.id };
    } else {
        req.user = decoded;
    }

    // Fix _id vs id
    if (req.user && req.user.id && !req.user._id) {
        req.user._id = req.user.id;
    }

    // console.log('✅ Auth ID:', req.user._id); // Descomentar solo para debug
    next();
  } catch (err) {
    // Mensaje genérico para no dar pistas al atacante
    console.error('❌ Error de Autenticación:', err.message);
    res.status(401).json({ success: false, message: 'Token no válido o sesión expirada.' });
  }
};