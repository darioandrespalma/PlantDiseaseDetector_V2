const express = require('express');
const router = express.Router();
const predictionController = require('../controllers/predictionController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// POST /api/predict - Requiere token e imagen
router.post('/', authMiddleware, upload.single('image'), predictionController.predictDisease);

// GET /api/predict/history - Historial del usuario
router.get('/history', authMiddleware, predictionController.getPredictionHistory);

// GET /api/predict/:id - Detalle
router.get('/:id', authMiddleware, predictionController.getPredictionById);

module.exports = router;