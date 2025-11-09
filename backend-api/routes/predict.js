// routes/predict.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { 
  predictDisease, 
  getPredictionHistory,
  getPredictionById
} = require('../controllers/predictionController');
const { ensurePredictionOwnership } = require('../middleware/authorizationMiddleware');

// Get user's prediction history (protected route)
router.get('/history', protect, getPredictionHistory);

// Get specific prediction by ID (protected route + IDOR protection)
router.get('/:id', protect, ensurePredictionOwnership, getPredictionById);

// Upload image and get prediction (protected route)
router.post('/upload', protect, upload.single('image'), predictDisease);

module.exports = router;