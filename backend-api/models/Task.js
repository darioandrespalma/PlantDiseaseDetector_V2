const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lote: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lote',
    required: false // Puede ser una tarea general no ligada a un lote
  },
  titulo: {
    type: String,
    required: [true, 'El título es obligatorio'],
    trim: true
  },
  tipo: {
    type: String,
    enum: ['Riego', 'Fertilizacion', 'Siembra', 'Cosecha', 'Poda', 'Monitoreo', 'Otro'],
    required: true
  },
  fechaProgramada: {
    type: Date,
    required: true
  },
  estado: {
    type: String,
    enum: ['Pendiente', 'Completada', 'Cancelada'],
    default: 'Pendiente'
  },
  notas: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Task', TaskSchema);