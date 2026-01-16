const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const mapController = require('../controllers/mapController');
const auth = require('../middleware/authMiddleware');

router.get('/summary', auth, dashboardController.getDashboardSummary);
router.get('/map', auth, mapController.getMapData);

module.exports = router;