const { body, validationResult } = require('express-validator');

// Función helper para procesar errores
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

exports.validateLogin = [
  body('email').isEmail().withMessage('Email inválido'),
  body('password').notEmpty().withMessage('Contraseña requerida'),
  validate
];

exports.validateTask = [
  body('titulo').notEmpty().trim().escape().withMessage('Título requerido'),
  body('tipo').isIn(['Riego', 'Fertilizacion', 'Siembra', 'Cosecha', 'Poda', 'Monitoreo', 'Otro']),
  body('fechaProgramada').isISO8601().toDate().withMessage('Fecha inválida'),
  validate
];

exports.validateLote = [
  body('nombre').notEmpty().trim().escape(),
  body('area').isNumeric(),
  validate
];