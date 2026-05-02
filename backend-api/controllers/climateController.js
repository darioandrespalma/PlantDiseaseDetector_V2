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
    // 1. Obtener la matemática pura de tu motor lógico
    const recomendaciones = await matchingEngine.generarRecomendacion(cultivo, lat, lon);
    const climaHoy = recomendaciones[0]; // Tomamos el pronóstico y alertas de HOY
    
    // 2. Empacar los datos crudos para la IA
    const payloadIA = {
      cultivo: cultivo,
      clima: {
        temp: climaHoy.temp,
        lluvia: climaHoy.lluvia,
        condicion: climaHoy.condiciones.temperatura // Info extra que saca tu motor
      },
      fase_lunar: climaHoy.faseLunar,
      alertas_tecnicas: climaHoy.alertas // Ej: ["Riesgo CRÍTICO: Heladas...", "Viento fuerte"]
    };

    // 3. Enviar a Python (Flask)
    const IA_BASE_URL = process.env.IA_URL || 'http://127.0.0.1:7860';
    const aiServiceUrl = `${IA_BASE_URL.replace(/\/$/, '')}/agent/climate`;
    
    console.log(`📡 Solicitando redacción al Agente Climático en: ${aiServiceUrl}`);
    const aiResponse = await axios.post(aiServiceUrl, payloadIA);


    // 4. Enviar todo listo al Frontend
    res.json({
      success: true,
      data: {
        cultivo,
        ubicacion: { lat: parseFloat(lat), lon: parseFloat(lon) },
        mensaje_ia: aiResponse.data.agent_response, // El texto redactado por Gemini
        datos_tecnicos: climaHoy // Para que el frontend pinte los iconos de lluvia/temp
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