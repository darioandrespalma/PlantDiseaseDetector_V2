const express = require('express');
const router = express.Router();
const loteController = require('../controllers/loteController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, loteController.obtenerLotesConRecomendaciones); 
router.post('/', authMiddleware, loteController.crearLote);
router.post('/aceptar-recomendacion', authMiddleware, loteController.aceptarRecomendacion); 
router.delete('/:id', authMiddleware, loteController.eliminarLote);

module.exports = router;