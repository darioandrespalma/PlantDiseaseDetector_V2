const express = require('express');
const router = express.Router();
const loteController = require('../controllers/loteController');
const authMiddleware = require('../middleware/authMiddleware');

// Rutas
router.get('/', authMiddleware, loteController.obtenerLotesConRecomendaciones); // 👈 Cambiamos a la función inteligente
router.post('/', authMiddleware, loteController.crearLote);
router.post('/aceptar-recomendacion', authMiddleware, loteController.aceptarRecomendacion); // 👈 Nueva
router.delete('/:id', authMiddleware, loteController.eliminarLote);

module.exports = router;