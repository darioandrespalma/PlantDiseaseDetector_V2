const Lote = require('../models/Lote');
const Prediction = require('../models/Prediction');
// Asegúrate de que matchingEngine exista, si no, comenta las líneas de fase lunar temporalmente
const matchingEngine = require('../services/matchingEngine'); 

exports.getDashboardSummary = async (req, res) => {
  try {
    const userId = req.user._id;

    // 1. Fase Lunar (Calculada o Simulada)
    const faseLunar = matchingEngine ? matchingEngine.calcularFaseLunar(new Date()) : 'creciente';
    
    // 2. Resumen de Lotes
    const lotes = await Lote.find({ user: userId });
    const totalLotes = lotes.length;
    // Asumiendo que 'estadoSalud' puede ser 'saludable', 'riesgo', 'enfermo'
    const lotesEnRiesgo = lotes.filter(l => l.estadoSalud !== 'saludable').length;

    // 3. Última predicción
    const ultimaPrediccion = await Prediction.findOne({ user: userId })
      .sort({ createdAt: -1 })
      .select('crop prediction confidence createdAt');

    res.json({
      success: true,
      data: {
        usuario: req.user.username,
        lunar: {
          fase: faseLunar,
          mensaje: "Fase lunar actual calculada."
        },
        estadisticas: {
          totalLotes,
          lotesSanos: totalLotes - lotesEnRiesgo,
          lotesAlerta: lotesEnRiesgo,
        },
        actividadReciente: ultimaPrediccion
      }
    });

  } catch (error) {
    console.error('Error Dashboard:', error);
    res.status(500).json({ success: false, message: 'Error cargando dashboard' });
  }
};