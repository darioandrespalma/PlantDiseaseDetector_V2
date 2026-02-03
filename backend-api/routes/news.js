const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');
const authMiddleware = require('../middleware/authMiddleware');

// Noticias generales (Público o Privado, tú decides. Aquí lo dejo protegido)
router.get('/', authMiddleware, newsController.getNews);

// Precios de mercado
router.get('/prices', authMiddleware, newsController.getMarketPrices);

module.exports = router;