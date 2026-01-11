const express = require("express");
const router = express.Router();
const matchingEngine = require("../services/matchingEngine");
const Cultivo = require("../models/Cultivo");

// --- RUTA DE RECOMENDACIÓN MEJORADA ---
router.get("/recomendacion", async (req, res) => {
  const { cultivo, lat, lon } = req.query;

  // Validación de parámetros
  if (!cultivo || !lat || !lon) {
    return res.status(400).json({ 
      success: false,
      error: "Parámetros requeridos: cultivo, lat, lon" 
    });
  }

  // Validar que lat y lon sean números
  const latNum = parseFloat(lat);
  const lonNum = parseFloat(lon);
  if (isNaN(latNum) || isNaN(lonNum)) {
    return res.status(400).json({ 
      success: false,
      error: "Latitud y longitud deben ser números válidos" 
    });
  }

  try {
    console.log(`🌱 [CLIMATE] Solicitando recomendación para: ${cultivo} en (${lat}, ${lon})`);
    
    const recomendaciones = await matchingEngine.generarRecomendacion(cultivo, lat, lon);
    
    // Retornar las top 3 recomendaciones
    const topRecomendaciones = recomendaciones.slice(0, 3);
    
    res.json({
      success: true,
      data: {
        cultivo: cultivo,
        ubicacion: { lat: latNum, lon: lonNum },
        totalRecomendaciones: recomendaciones.length,
        topRecomendaciones: topRecomendaciones,
        fechaGeneracion: new Date().toISOString(),
        mensaje: topRecomendaciones.length > 0 
          ? `✅ Encontradas ${topRecomendaciones.length} recomendaciones óptimas para ${cultivo}` 
          : '⚠️ No se encontraron recomendaciones óptimas para las fechas analizadas'
      }
    });
    
  } catch (error) {
    console.error("❌ [CLIMATE] Error en motor de emparejamiento:", error.message);
    
    // Manejo específico de error "cultivo no encontrado"
    if (error.message.includes('no encontrado') || error.message.includes('Cultivo')) {
      try {
        // Obtener lista de cultivos disponibles
        const cultivosDisponibles = await Cultivo.obtenerTodos();
        const nombresCultivos = cultivosDisponibles.map(c => c.nombre);
        
        return res.status(404).json({ 
          success: false,
          error: `Cultivo "${cultivo}" no encontrado`,
          sugerencia: 'Verifique el nombre del cultivo',
          cultivosDisponibles: nombresCultivos,
          totalDisponibles: nombresCultivos.length,
          solucion: 'Ejecute "npm run seed" para poblar la base de datos'
        });
      } catch (dbError) {
        console.error('❌ Error al obtener cultivos:', dbError);
        return res.status(404).json({ 
          success: false,
          error: `Cultivo "${cultivo}" no encontrado`,
          solucion: 'Ejecute "npm run seed" para poblar la base de datos'
        });
      }
    }
    
    // Error general
    res.status(500).json({ 
      success: false,
      error: "Error generando recomendación climática",
      detalles: process.env.NODE_ENV === 'development' ? error.message : undefined,
      timestamp: new Date().toISOString()
    });
  }
});

// --- NUEVA RUTA: LISTA DE CULTIVOS DISPONIBLES ---
router.get("/cultivos", async (req, res) => {
  try {
    const cultivos = await Cultivo.obtenerTodos();
    
    if (cultivos.length === 0) {
      return res.status(404).json({
        success: false,
        error: "No hay cultivos en la base de datos",
        solucion: "Ejecute 'npm run seed' para poblar la base de datos"
      });
    }
    
    res.json({
      success: true,
      data: {
        total: cultivos.length,
        cultivos: cultivos.map(c => ({
          id: c._id,
          nombre: c.nombre,
          nombreCientifico: c.nombreCientifico || 'No disponible',
          categoria: c.categoria,
          descripcion: c.descripcion || 'Sin descripción',
          diasCosecha: c.diasCosecha,
          condiciones: {
            temperatura: `${c.tempOptima.min}°C - ${c.tempOptima.max}°C`,
            lluviaMinima: `${c.lluviaMinima}mm`,
            faseLunarOptima: c.faseLunarOptima,
            sensibilidadHeladas: c.sensibilidadHeladas
          }
        }))
      }
    });
  } catch (error) {
    console.error("❌ [CLIMATE] Error al obtener cultivos:", error);
    res.status(500).json({ 
      success: false,
      error: "Error al obtener lista de cultivos" 
    });
  }
});

// --- NUEVA RUTA: INFORMACIÓN DE UN CULTIVO ESPECÍFICO ---
router.get("/cultivos/:nombre", async (req, res) => {
  try {
    const { nombre } = req.params;
    const cultivo = await Cultivo.buscarPorNombre(nombre);
    
    if (!cultivo) {
      // Obtener lista de cultivos para sugerencia
      const cultivosDisponibles = await Cultivo.obtenerTodos();
      const nombresCultivos = cultivosDisponibles.map(c => c.nombre);
      
      return res.status(404).json({ 
        success: false,
        error: `Cultivo "${nombre}" no encontrado`,
        sugerencia: 'Cultivos disponibles',
        cultivosDisponibles: nombresCultivos
      });
    }
    
    res.json({
      success: true,
      data: {
        ...cultivo.toObject(),
        condiciones: {
          temperatura: `${cultivo.tempOptima.min}°C - ${cultivo.tempOptima.max}°C`,
          lluviaMinima: `${cultivo.lluviaMinima}mm`,
          faseLunarOptima: cultivo.faseLunarOptima
        }
      }
    });
  } catch (error) {
    console.error("❌ [CLIMATE] Error al obtener cultivo:", error);
    res.status(500).json({ 
      success: false,
      error: "Error al obtener información del cultivo" 
    });
  }
});

// --- RUTAS EXISTENTES (mantener compatibilidad) ---
router.get("/today", (req, res) => {
  // Ruta existente - mantener funcionalidad
  res.json({
    success: true,
    message: "Endpoint /today - implementar según necesidad",
    data: {
      temperatura: 22.5,
      humedad: 65,
      descripcion: "Soleado"
    }
  });
});

router.get("/forecast", (req, res) => {
  // Ruta existente - mantener funcionalidad
  res.json({
    success: true,
    message: "Endpoint /forecast - implementar según necesidad",
    data: []
  });
});

router.get("/agro", (req, res) => {
  // Ruta existente - mantener funcionalidad
  res.json({
    success: true,
    message: "Endpoint /agro - implementar según necesidad",
    data: []
  });
});

module.exports = router;