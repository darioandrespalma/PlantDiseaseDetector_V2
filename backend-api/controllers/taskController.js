const Task = require('../models/Task');

// Obtener tareas (Soporta filtro por Lote y rango de fechas)
exports.getTasks = async (req, res) => {
  try {
    const { loteId, mes, anio } = req.query;
    let query = { user: req.user._id };

    // Filtro por Lote (para el selector rápido)
    if (loteId && loteId !== 'todos') {
      query.lote = loteId;
    }

    // Filtro por Mes (Opcional, para no cargar todas las tareas de la historia)
    if (mes && anio) {
      const startDate = new Date(anio, mes, 1);
      const endDate = new Date(anio, Number(mes) + 1, 0);
      query.fechaProgramada = { $gte: startDate, $lte: endDate };
    }

    const tasks = await Task.find(query)
      .populate('lote', 'nombre') // Traer el nombre del lote
      .sort({ fechaProgramada: 1 });

    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error obteniendo tareas' });
  }
};

// Crear Tarea (Usado por el Calendario y por el Mapa)
exports.createTask = async (req, res) => {
  try {
    const { titulo, tipo, fechaProgramada, loteId, notas } = req.body;

    const newTask = new Task({
      user: req.user._id,
      lote: loteId || null, // Puede ser null si es una tarea general
      titulo,
      tipo,
      fechaProgramada,
      notas,
      estado: 'Pendiente'
    });

    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(400).json({ message: 'Error creando tarea', error: error.message });
  }
};

// Actualizar estado (Checkbox)
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body, // Ej: { completada: true }
      { new: true }
    );
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error actualizando tarea' });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    res.json({ message: 'Tarea eliminada' });
  } catch (error) {
    res.status(500).json({ message: 'Error eliminando tarea' });
  }
};