const Lote = require('../models/Lote');
const Cultivo = require('../models/Cultivo'); // Asegúrate que este modelo exista
const Task = require('../models/Task'); 

// ✅ 1. Obtener Lotes Inteligentes (Filtrados por Finca)
exports.obtenerLotesConRecomendaciones = async (req, res) => {
  try {
    const { farmId } = req.query; // Recibimos el ID de la finca actual desde el Frontend

    if (!farmId) {
        return res.status(400).json({ success: false, error: 'Se requiere farmId' });
    }

    // Buscamos lotes de ESA finca y ESE usuario
    const lotes = await Lote.find({ 
        user: req.user._id, 
        farm: farmId,
        activo: true 
    }).populate('cultivoData'); // Traemos la info del catálogo agronómico

    const lotesConData = lotes.map(lote => {
      const loteObj = lote.toObject();
      const cultivo = lote.cultivoData;
      
      // A. Calcular Edad Fenológica
      const diasEdad = Math.floor((new Date() - new Date(lote.fechaSiembra)) / (1000 * 60 * 60 * 24));
      
      // B. Motor de Recomendaciones (Simulado con lógica real)
      // En producción, aquí consultarías una API de clima real para la ubicación de la finca
      const climaSimulado = { lluvia: 0, temp: 28 }; // Ejemplo: Sequía
      const recomendaciones = [];

      if (cultivo) {
          // Regla 1: Riego
          if (climaSimulado.lluvia < (cultivo.lluviaMinima || 10)) {
             recomendaciones.push({
                tipo: 'riego',
                mensaje: `Déficit hídrico (Edad: ${diasEdad} días)`,
                accionSugerida: `Riego suplementario recomendado para ${cultivo.nombre}.`,
                prioridad: 'alta'
             });
          }
      }

      return {
        ...loteObj,
        edadDias: diasEdad,
        recomendacionesDelDia: recomendaciones
      };
    });

    res.json({ success: true, data: lotesConData });

  } catch (error) {
    console.error("Error obtenerLotes:", error);
    res.status(500).json({ success: false, error: 'Error del servidor' });
  }
};

// ✅ 2. Crear Nuevo Lote (Vinculado a Finca)
exports.crearLote = async (req, res) => {
  try {
    // Recibimos farmId del body
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
    
    // Devolvemos el lote populado para que el frontend lo muestre bonito de una vez
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
    
    // Validamos que el lote exista
    const lote = await Lote.findById(loteId);
    if(!lote) return res.status(404).json({message: "Lote no encontrado"});

    const nuevaTarea = new Task({
      user: req.user._id,
      farm: lote.farm, // Asignamos la tarea a la misma finca del lote
      title: `Auto: ${mensaje}`,
      description: `${accion} en lote ${lote.nombre}`,
      status: 'pending',
      date: new Date(),
      priority: 'high',
      type: 'riego' // Por defecto, o dinámico según el mensaje
    });

    await nuevaTarea.save();
    res.json({ success: true, message: 'Tarea generada', tarea: nuevaTarea });

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