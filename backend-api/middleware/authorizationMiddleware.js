// backend-api/middleware/authorizationMiddleware.js
const Prediction = require('../models/Prediction');

/**
 * Middleware genérico para verificar que el usuario autenticado es dueño del recurso.
 * @param {Model} Model - Modelo de Mongoose (ej. Prediction)
 * @param {string} resourceIdParam - Nombre del parámetro en req.params (por defecto 'id')
 * @param {string} ownerField - Campo en el documento que referencia al propietario (por defecto 'user')
 */
const resourceOwner = (Model, resourceIdParam = 'id', ownerField = 'user') => {
  return async (req, res, next) => {
    try {
      const resourceId = req.params[resourceIdParam];
      if (!resourceId) {
        return res.status(400).json({ message: 'ID del recurso requerido' });
      }

      const resource = await Model.findById(resourceId).select('+user');
      if (!resource) {
        return res.status(404).json({ message: 'Recurso no encontrado' });
      }

      // Compara como strings para evitar problemas de ObjectId vs string
      const ownerId = resource[ownerField]?.toString();
      const requesterId = req.user?.id;

      if (ownerId !== requesterId) {
        return res.status(403).json({ message: 'Acceso denegado' });
      }

      // Opcional: adjuntar recurso al request para evitar doble consulta en el controlador
      req.resource = resource;
      next();
    } catch (error) {
      console.error('Error en verificación de propiedad:', error);
      res.status(500).json({ message: 'Error interno al verificar acceso' });
    }
  };
};

// Exporta instancias preconfiguradas
module.exports = {
  ensurePredictionOwnership: resourceOwner(Prediction, 'id', 'user'),
};