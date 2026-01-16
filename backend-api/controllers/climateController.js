const matchingEngine = require("../services/matchingEngine");
const Cultivo = require("../models/Cultivo");
const axios = require("axios"); // Si usas axios para clima actual

// 1. Obtener Recomendaciones Complejas
exports.getRecomendacion = async (req, res) => {
  const { cultivo, lat, lon } = req.query;

  // Validaciones
  if (!cultivo || !lat || !lon) {
    return res.status(400).json({ success: false, error: "Faltan parámetros: cultivo, lat, lon" });
  }

  try {
    const recomendaciones = await matchingEngine.generarRecomendacion(cultivo, lat, lon);
    const topRecomendaciones = recomendaciones.slice(0, 3);
    
    res.json({
      success: true,
      data: {
        cultivo,
        ubicacion: { lat: parseFloat(lat), lon: parseFloat(lon) },
        topRecomendaciones
      }
    });
  } catch (error) {
    console.error("❌ Error en recomendación:", error.message);
    
    // Manejo de "Cultivo no encontrado"
    if (error.message.includes('no encontrado') || error.message.includes('Cultivo')) {
        const disponibles = await Cultivo.find({ activo: true }).select('nombre');
        return res.status(404).json({
            success: false,
            error: `Cultivo "${cultivo}" no soportado actualmente.`,
            disponibles: disponibles.map(c => c.nombre)
        });
    }
    res.status(500).json({ success: false, error: "Error interno al generar recomendaciones" });
  }
};

// 2. Listar Cultivos Disponibles
exports.getCultivos = async (req, res) => {
  try {
    const cultivos = await Cultivo.obtenerTodos();
    res.json({ success: true, data: { cultivos } });
  } catch (error) {
    res.status(500).json({ success: false, error: "Error al obtener cultivos" });
  }
};

// 3. Detalle de un Cultivo
exports.getCultivoDetalle = async (req, res) => {
  try {
    const { nombre } = req.params;
    const cultivo = await Cultivo.buscarPorNombre(nombre);
    if (!cultivo) return res.status(404).json({ success: false, error: "Cultivo no encontrado" });
    res.json({ success: true, data: cultivo });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 4. Clima Actual (Simple)
exports.getTodayClimate = async (req, res) => {
    // Implementa tu lógica simple aquí o usa matchingEngine si tiene método
    res.json({ message: "Endpoint clima hoy funcionando" }); 
};

// 5. Pronóstico (Simple)
exports.getForecast = async (req, res) => {
    res.json({ message: "Endpoint pronóstico funcionando" });
};