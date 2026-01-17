const express = require('express');
const router = express.Router();
const loteController = require('../controllers/loteController');
const authMiddleware = require('../middleware/authMiddleware');

// Validamos que el controlador se haya cargado bien
if (!loteController.obtenerLotes || !loteController.crearLote) {
    console.error("🔥 ERROR CRÍTICO: Faltan funciones en loteController.js");
}

// Definición de Rutas
router.get('/', authMiddleware, loteController.obtenerLotes); 
router.post('/', authMiddleware, loteController.crearLote);   
router.post('/:id/historial', authMiddleware, loteController.agregarEvento); 
router.delete('/:id', authMiddleware, loteController.eliminarLote); 

module.exports = router;