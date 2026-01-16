const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const mapController = require('../controllers/mapController');
const authMiddleware = require('../middleware/authMiddleware');

// GET /api/dashboard/summary
router.get('/summary', authMiddleware, dashboardController.getDashboardSummary);

// GET /api/dashboard/map
router.get('/map', authMiddleware, mapController.getMapData);

module.exports = router;