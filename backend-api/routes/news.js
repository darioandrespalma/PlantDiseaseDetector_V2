// backend-api/routes/news.js
const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');

// Definimos la ruta GET /
router.get('/', newsController.getNews);

module.exports = router;