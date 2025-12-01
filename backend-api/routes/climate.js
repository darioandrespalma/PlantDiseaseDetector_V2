const express = require("express");
const router = express.Router();
const {
  getTodayClimate,
  getForecast7Days,
  getAgroRecommendation,
} = require("../controllers/climateController");

const matchingEngine = require("../services/matchingEngine");

// Rutas existentes
router.get("/today", getTodayClimate);
router.get("/forecast", getForecast7Days);
router.get("/agro", getAgroRecommendation);

// --- NUEVA RUTA: MOTOR DE EMPAREJAMIENTO ---
router.get("/recomendacion", async (req, res) => {
  const { cultivo, lat, lon } = req.query;

  if (!cultivo || !lat || !lon) {
    return res.status(400).json({ 
      error: "Parámetros requeridos: cultivo, lat, lon" 
    });
  }

  try {
    const recomendaciones = await matchingEngine.generarRecomendacion(cultivo, lat, lon);
    
    // Retornar solo las top 3 recomendaciones
    res.json({
      success: true,
      recomendaciones: recomendaciones.slice(0, 3),
      generado: new Date()
    });
  } catch (error) {
    console.error("Error motor de emparejamiento:", error);
    res.status(500).json({ 
      error: "Error generando recomendación",
      details: error.message 
    });
  }
});

module.exports = router;