const Task = require('../models/Task');

// Listar tareas (con filtros opcionales)
exports.getTasks = async (req, res) => {
  try {
    const { estado, desde, hasta } = req.query;
    let query = { user: req.user._id };

    if (estado) query.estado = estado;
    if (desde && hasta) {
      query.fechaProgramada = { $gte: new Date(desde), $lte: new Date(hasta) };
    }

    const tasks = await Task.find(query).sort({ fechaProgramada: 1 }).populate('lote', 'nombre');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo tareas' });
  }
};

// Crear Tarea
exports.createTask = async (req, res) => {
  try {
    // Aquí podrías agregar validación extra: ¿La fecha cae en buena luna?
    const newTask = await Task.create({
      ...req.body,
      user: req.user._id
    });
    res.status(201).json(newTask);
  } catch (error) {
    res.status(400).json({ message: 'Error creando tarea', error: error.message });
  }
};

// Completar/Editar Tarea
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );
    if (!task) return res.status(404).json({ message: 'Tarea no encontrada' });
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error actualizando tarea' });
  }
};

// Eliminar Tarea
exports.deleteTask = async (req, res) => {
  try {
    await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    res.json({ message: 'Tarea eliminada' });
  } catch (error) {
    res.status(500).json({ message: 'Error eliminando tarea' });
  }
};