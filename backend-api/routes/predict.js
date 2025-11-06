const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { 
  predictDisease, 
  getPredictionHistory,
  getPredictionById
} = require('../controllers/predictionController');

// Get user's prediction history (protected route)
router.get('/history', protect, getPredictionHistory);

// Get specific prediction by ID (protected route)
router.get('/:id', protect, getPredictionById);

// Upload image and get prediction (protected route)
router.post('/upload', protect, upload.single('image'), predictDisease);

module.exports = router;