const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // 1. Obtener el token del header (Formato: "Bearer <token>")
  const token = req.header('Authorization')?.replace('Bearer ', '');

  // 2. Si no hay token, denegar acceso
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Acceso denegado. No hay token de autenticación.' 
    });
  }

  try {
    // 3. Verificar el token usando la clave secreta
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretoseguro123');
    
    // 4. Guardar los datos del usuario en la petición (req.user)
    req.user = decoded.user;
    
    // 5. Continuar a la siguiente función (el controlador)
    next();
  } catch (err) {
    res.status(401).json({ 
      success: false, 
      message: 'Token no válido o expirado.' 
    });
  }
};