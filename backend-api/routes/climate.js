const express = require("express");
const router = express.Router();
const {
  getTodayClimate,
  getForecast7Days,
  getAgroRecommendation,
} = require("../controllers/climateController");

// Rutas del clima
router.get("/today", getTodayClimate);
router.get("/forecast", getForecast7Days);
router.get("/agro", getAgroRecommendation);

module.exports = router;
