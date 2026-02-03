const Farm = require('../models/Farm');
const Lote = require('../models/Lote');
const Task = require('../models/Task');
const Prediction = require('../models/Prediction');
const recommendationEngine = require('../services/recommendationEngine');

exports.getDashboardSummary = async (req, res) => {
  try {
    const userId = req.user._id;
    // Recibimos farmId opcional desde el selector del frontend
    const { farmId } = req.query;

    // ---------------------------------------------------------
    // 1. GESTIÓN DEL CONTEXTO (Multi-Finca)
    // ---------------------------------------------------------
    let currentFarm = null;

    if (farmId) {
      // Si el usuario seleccionó una finca específica
      currentFarm = await Farm.findOne({ _id: farmId, user: userId });
    } else {
      // Si no, cargamos la finca por defecto (la primera creada)
      currentFarm = await Farm.findOne({ user: userId }).sort({ createdAt: 1 });
    }

    // CASO ONBOARDING: El usuario no tiene ninguna finca creada
    if (!currentFarm) {
      return res.json({
        success: true,
        data: {
          mode: 'setup_required', // Frontend debe mostrar: "Bienvenido, crea tu primera finca"
          usuario: req.user.username || (req.user.email ? req.user.email.split('@')[0] : 'Agricultor')
        }
      });
    }

    // ---------------------------------------------------------
    // 2. PREPARACIÓN DE DATOS
    // ---------------------------------------------------------
    
    // Usamos las coordenadas DE LA FINCA (No del usuario)
    const { lat, lon } = currentFarm.ubicacion;

    // Filtro base: Todo lo que busquemos debe ser de ESTA finca
    const farmFilter = { farm: currentFarm._id };

    // Fechas para la Agenda (Tareas)
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const manana = new Date(hoy);
    manana.setDate(manana.getDate() + 1);

    // ---------------------------------------------------------
    // 3. EJECUCIÓN PARALELA (High Performance)
    // ---------------------------------------------------------
    const [
      totalLotes, 
      lotesEnRiesgo, 
      ultimaPrediccion, 
      recomendacion,
      tareasPendientes,
      tareasAtrasadas
    ] = await Promise.all([
      // A. Estadísticas de Lotes (Filtrado por Finca)
      Lote.countDocuments(farmFilter),
      Lote.countDocuments({ ...farmFilter, estadoSalud: { $ne: 'saludable' } }),

      // B. Última Predicción de IA (Global del usuario, o podrías filtrarla por finca si guardas ese dato)
      Prediction.findOne({ user: userId }).sort({ createdAt: -1 }).lean(),

      // C. Motor de Recomendación (Clima de la Finca + Luna)
      recommendationEngine.getAdvice(lat, lon),

      // D. Agenda: Tareas para HOY (Filtradas por Usuario - Idealmente añadir farm a TaskSchema)
      Task.find({ 
        user: userId, 
        estado: 'Pendiente',
        fechaProgramada: { $gte: hoy, $lt: manana }
      }).sort({ prioridad: -1 }).limit(3).lean(),

      // E. Agenda: Tareas Atrasadas
      Task.countDocuments({
        user: userId,
        estado: 'Pendiente',
        fechaProgramada: { $lt: hoy }
      })
    ]);

    // ---------------------------------------------------------
    // 4. RESPUESTA JSON ESTRUCTURADA
    // ---------------------------------------------------------
    const nombreUsuario = req.user.username || (req.user.email ? req.user.email.split('@')[0] : 'Agricultor');

    res.json({
      success: true,
      data: {
        mode: 'active', // Indica que hay datos para mostrar
        usuario: nombreUsuario,
        
        // Contexto actual para el Frontend (Navbar)
        context: {
          farmId: currentFarm._id,
          farmName: currentFarm.nombre,
          ubicacion: currentFarm.ubicacion
        },

        // Datos Climáticos y Lunares (De la Finca)
        clima: {
          ubicacion: currentFarm.nombre, // Ej: "Hacienda Cayambe"
          temp: recomendacion.temp,
          descripcion: recomendacion.weatherDesc,
        },
        lunar: {
          fase: recomendacion.lunarPhase,
          mensaje: recomendacion.advice
        },

        // Estadísticas Operativas
        estadisticas: {
          totalLotes,
          lotesSanos: Math.max(0, totalLotes - lotesEnRiesgo),
          lotesAlerta: lotesEnRiesgo,
        },

        // Módulo de IA
        actividadReciente: ultimaPrediccion ? {
            crop: ultimaPrediccion.crop,
            prediction: ultimaPrediccion.result.disease, // Ajustado a tu modelo Prediction
            confidence: Number(ultimaPrediccion.result.confidence),
            createdAt: ultimaPrediccion.createdAt
        } : null,

        // Módulo de Agenda (Task Force)
        agenda: {
            tareasHoy: tareasPendientes,
            totalAtrasadas: tareasAtrasadas
        }
      }
    });

  } catch (error) {
    console.error('❌ Error Crítico en Dashboard:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error interno al generar el resumen.',
      debug: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};