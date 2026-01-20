const Lote = require('../models/Lote');
const Cultivo = require('../models/Cultivo');
const DailyRecommendation = require('../models/DailyRecommendation');
const Task = require('../models/Task'); // Asumo que tienes un modelo Task

// ✅ 1. Obtener todos los lotes del usuario (Faltaba esta función)
exports.obtenerLotes = async (req, res) => {
  try {
    // Busca lotes activos que pertenezcan al usuario logueado (req.user._id)
    const lotes = await Lote.find({ 
      usuario: req.user._id, 
      activo: true 
    })
    .populate('cultivo', 'nombre') // Traer el nombre del cultivo
    .sort({ createdAt: -1 });

    res.json({ success: true, data: lotes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Error al obtener los lotes' });
  }
};

// ✅ 2. Crear nuevo lote (Tu código actualizado con Alertas y Ubicación)
exports.crearLote = async (req, res) => {
  try {
    const { 
      nombre, 
      cultivoId, 
      lat, 
      lon, 
      alertasActivas, 
      frecuenciaAlertas 
    } = req.body;

    const nuevoLote = new Lote({
      nombre,
      usuario: req.user._id, // Viene del authMiddleware
      cultivo: cultivoId,
      ubicacion: {
        lat,
        lon
      },
      alertasClima: {
        activas: alertasActivas || false,
        frecuencia: frecuenciaAlertas || 'semanal'
      },
      historial: [{
        tipo: 'nota',
        titulo: 'Finca Creada',
        descripcion: 'Registro inicial en el sistema.'
      }]
    });
    
    await nuevoLote.save();
    res.status(201).json({ success: true, data: nuevoLote, message: 'Finca registrada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, error: 'Error al crear la finca. Verifica los datos.' });
  }
};

// ✅ 3. Agregar Evento al Historial (Faltaba esta función)
exports.agregarEvento = async (req, res) => {
  try {
    const { id } = req.params;
    const { tipo, titulo, descripcion } = req.body;

    const lote = await Lote.findOne({ _id: id, usuario: req.user._id });
    
    if (!lote) {
      return res.status(404).json({ success: false, error: 'Lote no encontrado o no autorizado' });
    }

    lote.historial.push({
      tipo,
      titulo,
      descripcion,
      fecha: new Date()
    });

    await lote.save(); // Esto dispara el pre('save') del modelo para actualizar el semáforo
    res.json({ success: true, message: 'Evento agregado', data: lote });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Error al registrar evento' });
  }
};

// ✅ 4. Eliminar Lote (Borrado lógico) (Faltaba esta función)
exports.eliminarLote = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Solo marcamos activo: false, no lo borramos de la BD
    await Lote.findOneAndUpdate(
      { _id: id, usuario: req.user._id },
      { activo: false }
    );

    res.json({ success: true, message: 'Lote eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Error al eliminar lote' });
  }
};

exports.obtenerLotesConRecomendaciones = async (req, res) => {
  try {
    const lotes = await Lote.find({ usuario: req.user._id, activo: true })
      .populate('cultivo');

    // Array enriquecido
    const lotesConData = [];

    for (let lote of lotes) {
      // 1. Simulación rápida de clima (Aquí conectarías OpenWeatherApi en producción)
      const climaHoy = { temp: 24, lluvia: 0, humedad: 40 }; // Ejemplo: Día seco y caluroso
      
      // 2. GENERAR RECOMENDACIONES EN TIEMPO REAL (O buscarlas de la BD si ya existen hoy)
      // Por simplicidad, las generamos al vuelo para este demo:
      const recomendaciones = [];

      // Lógica de Riego
      if (climaHoy.lluvia < lote.cultivo.lluviaMinima) {
         recomendaciones.push({
            tipo: 'riego',
            mensaje: `Baja precipitación detectada (${climaHoy.lluvia}mm).`,
            accionSugerida: 'Activar riego por 45 minutos hoy en la tarde.',
            estado: 'pendiente'
         });
      }

      // Lógica de Temperatura
      if (climaHoy.temp > lote.cultivo.tempOptima.max) {
         recomendaciones.push({
            tipo: 'general',
            mensaje: `Ola de calor (${climaHoy.temp}°C).`,
            accionSugerida: 'Revisar humedad del suelo y proteger plántulas jóvenes.',
            estado: 'pendiente'
         });
      }

      lotesConData.push({
        ...lote.toObject(),
        recomendacionesDelDia: recomendaciones
      });
    }

    res.json({ success: true, data: lotesConData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Error analizando lotes' });
  }
};

// ✅ NUEVA FUNCIÓN: Aceptar Recomendación -> Convertir en Tarea
exports.aceptarRecomendacion = async (req, res) => {
  try {
    const { loteId, mensaje, accion } = req.body;
    
    // Crear la tarea automáticamente
    const nuevaTarea = new Task({
      user: req.user._id, // Asegúrate que tu modelo Task use 'user' o 'usuario'
      title: `Auto: ${mensaje}`, // Ej: Auto: Baja precipitación...
      description: accion,
      status: 'pending',
      date: new Date(),
      priority: 'high'
    });

    await nuevaTarea.save();

    res.json({ success: true, message: 'Tarea creada automáticamente', tarea: nuevaTarea });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Error creando tarea' });
  }
};

// ✅ NUEVA FUNCIÓN: Eliminar Lote
exports.eliminarLote = async (req, res) => {
  try {
    await Lote.findByIdAndUpdate(req.params.id, { activo: false });
    res.json({ success: true, message: 'Lote eliminado' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error eliminando lote' });
  }
};



