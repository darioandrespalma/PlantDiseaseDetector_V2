// backend-api/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ success: false, message: 'Acceso denegado. No hay token.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretoseguro123');
    
    // 1. Asignar el usuario decodificado
    if (decoded.user) {
        req.user = decoded.user; 
    } else if (decoded._id || decoded.id) {
        req.user = { _id: decoded._id || decoded.id };
    } else {
        req.user = decoded;
    }

    // --- FIX CRÍTICO: Normalizar 'id' a '_id' ---
    // Si el token trae 'id' pero no '_id', copiamos el valor para que Mongoose no falle.
    if (req.user && req.user.id && !req.user._id) {
        req.user._id = req.user.id;
    }
    // --------------------------------------------

    console.log('✅ Usuario autenticado ID:', req.user._id); // Debug para confirmar

    next();
  } catch (err) {
    console.error('❌ Error Auth:', err.message);
    res.status(401).json({ success: false, message: 'Token no válido.' });
  }
};