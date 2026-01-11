const Lote = require('../models/Lote');

// Obtener todos los lotes del usuario
exports.obtenerLotes = async (req, res) => {
  try {
    // IMPORTANTE: Aquí asumo que req.user.id viene de tu authMiddleware
    // Si no usas auth todavía, tendremos que pasar el ID manualmente por ahora.
    const lotes = await Lote.find({ usuario: req.user?.id || req.body.usuarioId, activo: true })
      .populate('cultivo', 'nombre tempOptima diasCosecha') // Traer datos del cultivo
      .sort({ createdAt: -1 });

    res.json({ success: true, data: lotes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Error al obtener lotes' });
  }
};

// Crear nuevo lote
exports.crearLote = async (req, res) => {
  try {
    const nuevoLote = new Lote({
      ...req.body,
      usuario: req.user?.id || req.body.usuario // Fallback si no hay auth
    });
    
    await nuevoLote.save();
    res.status(201).json({ success: true, data: nuevoLote, message: 'Lote creado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, error: 'Error al crear lote' });
  }
};

// Agregar evento al historial (Esto actualiza el semáforo automáticamente)
exports.agregarEvento = async (req, res) => {
  try {
    const { id } = req.params;
    const evento = req.body; // { tipo: 'plaga', titulo: '...', descripcion: '...' }

    const lote = await Lote.findById(id);
    if (!lote) return res.status(404).json({ success: false, error: 'Lote no encontrado' });

    lote.historial.push(evento);
    await lote.save(); // Aquí se dispara el middleware del modelo para actualizar estadoSalud

    res.json({ success: true, data: lote, message: 'Evento registrado' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error al registrar evento' });
  }
};

// Eliminar lote (Borrado lógico)
exports.eliminarLote = async (req, res) => {
  try {
    await Lote.findByIdAndUpdate(req.params.id, { activo: false });
    res.json({ success: true, message: 'Lote eliminado' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error al eliminar lote' });
  }
};