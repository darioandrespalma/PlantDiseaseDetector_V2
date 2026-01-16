const express = require('express');
const router = express.Router();
const climateController = require('../controllers/climateController');
const authMiddleware = require('../middleware/authMiddleware'); // Opcional si quieres protegerlas

// Rutas Públicas o Privadas (agrega authMiddleware si es necesario)
router.get('/recomendacion', climateController.getRecomendacion);
router.get('/cultivos', climateController.getCultivos);
router.get('/cultivos/:nombre', climateController.getCultivoDetalle);

// Rutas Legacy (Clima simple)
router.get('/datos', climateController.getTodayClimate);
router.get('/forecast', climateController.getForecast);

module.exports = router;