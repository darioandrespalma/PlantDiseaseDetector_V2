const express = require('express');
const router = express.Router();
const farmController = require('../controllers/farmController');
const authMiddleware = require('../middleware/authMiddleware');

// Todas las rutas protegidas
router.use(authMiddleware);

router.get('/', farmController.getFarms); // Listar para el Dropdown
router.post('/', farmController.createFarm); // Crear nueva finca
router.get('/:farmId', farmController.getFarmSummary); // Detalle

module.exports = router;