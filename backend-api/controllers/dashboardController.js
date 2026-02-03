const Lote = require('../models/Lote');
const Prediction = require('../models/Prediction');
const recommendationEngine = require('../services/recommendationEngine'); // Importar el nuevo servicio

exports.getDashboardSummary = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // 1. Obtener coordenadas del Query String (si el frontend las envía)
    const { lat, lon } = req.query;

    // 2. Ejecutar lógica en paralelo (Base de Datos + API Clima)
    const [totalLotes, lotesEnRiesgo, ultimaPrediccion, recomendacion] = await Promise.all([
      Lote.countDocuments({ user: userId }),
      Lote.countDocuments({ user: userId, estadoSalud: { $ne: 'saludable' } }),
      Prediction.findOne({ user: userId }).sort({ createdAt: -1 }).lean(),
      // Llamamos al motor de recomendación con las coordenadas
      recommendationEngine.getAdvice(lat, lon) 
    ]);

    // 3. Armar respuesta segura
    const nombreUsuario = req.user.username || (req.user.email ? req.user.email.split('@')[0] : 'Agricultor');

    res.json({
      success: true,
      data: {
        usuario: nombreUsuario,
        clima: {
          ubicacion: recomendacion.location,
          temp: recomendacion.temp,
          descripcion: recomendacion.weatherDesc,
        },
        lunar: {
          fase: recomendacion.lunarPhase,
          mensaje: recomendacion.advice
        },
        estadisticas: {
          totalLotes,
          lotesSanos: Math.max(0, totalLotes - lotesEnRiesgo),
          lotesAlerta: lotesEnRiesgo,
        },
        actividadReciente: ultimaPrediccion ? {
            crop: ultimaPrediccion.crop,
            prediction: ultimaPrediccion.prediction,
            confidence: Number(ultimaPrediccion.confidence),
            createdAt: ultimaPrediccion.createdAt
        } : null
      }
    });

  } catch (error) {
    console.error('❌ Error Dashboard:', error);
    // Enviar error 500 pero con estructura JSON válida
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};