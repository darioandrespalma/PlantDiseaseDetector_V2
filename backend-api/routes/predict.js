// backend-api/routes/predict.js
const express = require('express');
const router = express.Router();
const predictionController = require('../controllers/predictionController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// CORRECCIÓN 2: La ruta debe ser '/upload' para coincidir con Angular (que llama a .../api/predict/upload)
// CORRECCIÓN 3: Cambiar 'image' por 'file'. Angular envía formData.append('file', ...) y Python espera 'file'.
router.post('/upload', authMiddleware, upload.single('file'), predictionController.predictDisease);

// GET /api/predict/history
router.get('/history', authMiddleware, predictionController.getPredictionHistory);

// GET /api/predict/:id
router.get('/:id', authMiddleware, predictionController.getPredictionById);

module.exports = router;