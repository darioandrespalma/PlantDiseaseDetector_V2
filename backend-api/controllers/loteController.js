// backend-api/controllers/loteController.js
const Lote = require('../models/Lote');
const Farm = require('../models/Farm'); // Necesario para obtener Lat/Lon de la finca
const Cultivo = require('../models/Cultivo'); 
const Task = require('../models/Task'); 
const weatherService = require('../services/weatherService'); // Servicio de Clima Real

// ✅ 1. Obtener Lotes Inteligentes (Con Clima Real)
exports.obtenerLotesConRecomendaciones = async (req, res) => {
  try {
    const { farmId } = req.query; 

    if (!farmId) return res.status(400).json({ success: false, error: 'Se requiere farmId' });

    // A. Obtener la Finca Real para sacar sus Coordenadas
    const finca = await Farm.findById(farmId);
    if (!finca) return res.status(404).json({ success: false, error: 'Finca no encontrada' });

    // B. Obtener Clima REAL en tiempo real para esa ubicación
    let climaReal = null;
    try {
        // Esto consulta a OpenWeatherMap usando las coordenadas de la finca
        climaReal = await weatherService.getWeatherForFarm(finca.ubicacion.lat, finca.ubicacion.lon);
    } catch (err) {
        console.warn("⚠️ Advertencia: No se pudo obtener clima real:", err.message);
        // El sistema sigue funcionando, pero sin generar alertas climáticas nuevas
    }

    // C. Obtener Lotes de esa finca
    const lotes = await Lote.find({ 
        user: req.user._id, 
        farm: farmId,
        activo: true 
    }).populate('cultivoData'); 

    // D. Procesar cada lote (The Decision Engine)
    const lotesConData = lotes.map(lote => {
      const loteObj = lote.toObject();
      const cultivo = lote.cultivoData;
      
      // --- 1. Cálculo de Edad Robusto ---
      const hoy = new Date();
      const siembra = new Date(lote.fechaSiembra);
      
      // Normalizamos a medianoche para evitar decimales o errores de horas
      hoy.setHours(0,0,0,0);
      siembra.setHours(0,0,0,0);
      
      let diasEdad = Math.floor((hoy - siembra) / (1000 * 60 * 60 * 24));
      if (diasEdad < 0) diasEdad = 0; // Protección contra zonas horarias

      // --- 2. Motor de Recomendaciones (REAL) ---
      const recomendaciones = [];

      // Solo ejecutamos reglas si tenemos clima REAL y datos del cultivo
      if (cultivo && climaReal) {
          
          // Regla: Déficit Hídrico (Sequía)
          // Si la lluvia actual es menor al mínimo requerido por el cultivo
          const minLluvia = cultivo.lluviaMinima || 5;
          if (climaReal.rain < minLluvia) {
             recomendaciones.push({
                tipo: 'riego',
                mensaje: `⚠️ Sequía detectada (Lluvia: ${climaReal.rain}mm)`,
                accionSugerida: `El cultivo requiere ${minLluvia}mm. Activar riego.`,
                prioridad: 'alta'
             });
          }

          // Regla: Estrés Térmico (Calor)
          if (cultivo.tempOptima && climaReal.temp > (cultivo.tempOptima.max || 35)) {
             recomendaciones.push({
                tipo: 'general',
                mensaje: `🔥 Calor excesivo (${climaReal.temp}°C)`,
                accionSugerida: `Temperatura supera el máximo de ${cultivo.tempOptima.max}°C. Verificar hidratación.`,
                prioridad: 'media'
             });
          }

          // Regla: Riesgo Fúngico (Humedad + Calor)
          if (climaReal.humidity > 85 && climaReal.temp > 24) {
            recomendaciones.push({
                tipo: 'fitosanitario',
                mensaje: `🍄 Riesgo de Hongos Alto`,
                accionSugerida: `Humedad del ${climaReal.humidity}% favorece Sigatoka/Roya. Monitorear.`,
                prioridad: 'alta'
             });
          }
      }

      return {
        ...loteObj,
        edadDias: diasEdad,
        recomendacionesDelDia: recomendaciones,
        // Enviamos el clima al frontend por si queremos mostrarlo en la tarjeta
        climaSnapshot: climaReal 
      };
    });

    res.json({ success: true, data: lotesConData });

  } catch (error) {
    console.error("Error obtenerLotes:", error);
    res.status(500).json({ success: false, error: 'Error del servidor' });
  }
};

// ✅ 2. Crear Nuevo Lote
exports.crearLote = async (req, res) => {
  try {
    const { farmId, nombre, cultivoId, area, fechaSiembra, lat, lon } = req.body;

    if (!farmId || !cultivoId) {
        return res.status(400).json({ success: false, message: "Faltan datos obligatorios (Finca o Cultivo)" });
    }

    const nuevoLote = new Lote({
      user: req.user._id,
      farm: farmId,
      cultivoData: cultivoId,
      nombre,
      area: area || 1,
      fechaSiembra: fechaSiembra || new Date(),
      ubicacion: { lat, lon },
      historial: [{
        tipo: 'nota',
        titulo: 'Creación',
        descripcion: 'Lote registrado en el sistema.'
      }]
    });
    
    await nuevoLote.save();
    
    // Devolvemos el lote populado para visualizarlo inmediatamente
    const lotePoblado = await Lote.findById(nuevoLote._id).populate('cultivoData');
    
    res.status(201).json({ success: true, data: lotePoblado, message: 'Lote creado exitosamente' });

  } catch (error) {
    console.error("Error crearLote:", error);
    res.status(400).json({ success: false, error: error.message });
  }
};

// ✅ 3. Aceptar Recomendación (Convertir a Tarea)
exports.aceptarRecomendacion = async (req, res) => {
  try {
    const { loteId, mensaje, accion } = req.body;
    
    const lote = await Lote.findById(loteId);
    if(!lote) return res.status(404).json({message: "Lote no encontrado"});

    const nuevaTarea = new Task({
      user: req.user._id,
      farm: lote.farm,
      title: `Auto: ${mensaje}`,
      description: `${accion} en lote ${lote.nombre}`,
      status: 'pending',
      date: new Date(),
      priority: 'high',
      type: 'riego'
    });

    await nuevaTarea.save();
    res.json({ success: true, message: 'Tarea generada correctamente', tarea: nuevaTarea });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Error creando tarea' });
  }
};

// ✅ 4. Eliminar Lote
exports.eliminarLote = async (req, res) => {
  try {
    await Lote.findOneAndUpdate(
        { _id: req.params.id, user: req.user._id }, 
        { activo: false }
    );
    res.json({ success: true, message: 'Lote archivado' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error eliminando lote' });
  }
};