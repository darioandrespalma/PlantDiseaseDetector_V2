const mongoose = require('mongoose');

const DailyRecommendationSchema = new mongoose.Schema({
  lote: { type: mongoose.Schema.Types.ObjectId, ref: 'Lote', required: true },
  tipo: { 
    type: String, 
    enum: ['riego', 'fertilizacion', 'fitosanitario', 'general'],
    required: true 
  },
  mensaje: { type: String, required: true }, // Ej: "Aumentar riego por ola de calor"
  accionSugerida: { type: String, required: true }, // Ej: "Regar 2 horas"
  fechaGeneracion: { type: Date, default: Date.now },
  estado: { 
    type: String, 
    enum: ['pendiente', 'aceptada', 'rechazada'], 
    default: 'pendiente' 
  },
  // Si se acepta, guardamos el ID de la tarea creada
  tareaRelacionada: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' }
});

module.exports = mongoose.model('DailyRecommendation', DailyRecommendationSchema);