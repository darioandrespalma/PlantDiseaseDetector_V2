const express = require('express');
const router = express.Router();
const loteController = require('../controllers/loteController');
const authMiddleware = require('../middleware/authMiddleware'); // 🟢 IMPORTAR

// Rutas Protegidas
router.get('/', authMiddleware, loteController.obtenerLotes); // 🔒 Con candado
router.post('/', authMiddleware, loteController.crearLote);   // 🔒 Con candado
router.post('/:id/historial', authMiddleware, loteController.agregarEvento); // 🔒
router.delete('/:id', authMiddleware, loteController.eliminarLote); // 🔒

module.exports = router;