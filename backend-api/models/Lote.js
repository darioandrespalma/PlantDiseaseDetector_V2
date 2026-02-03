const mongoose = require('mongoose');

const LoteSchema = new mongoose.Schema({
  // 1. Vinculación Jerárquica
  farm: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Farm', 
    required: true 
  },
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  
  // 2. Vinculación Agronómica
  cultivoData: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Cultivo', 
    required: true 
  },

  nombre: { type: String, required: true, trim: true }, 
  area: { type: Number, required: true }, // Hectáreas
  fechaSiembra: { type: Date, default: Date.now }, 

  // Geolocalización del Lote (Opcional, para pintar polígonos o pines)
  ubicacion: {
    lat: Number,
    lon: Number
  },

  // Estado Lógico
  activo: { type: Boolean, default: true }, // Para borrado lógico

  // 3. Estado Fitosanitario
  estadoSalud: {
    type: String,
    enum: ['saludable', 'riesgo', 'peligro'],
    default: 'saludable'
  },

  historial: [{
    tipo: { type: String, enum: ['riego', 'fertilizante', 'plaga', 'nota'], required: true },
    titulo: String,
    descripcion: String,
    fecha: { type: Date, default: Date.now }
  }]
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Lote', LoteSchema);