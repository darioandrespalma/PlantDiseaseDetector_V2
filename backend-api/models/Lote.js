const mongoose = require('mongoose');

const LoteSchema = new mongoose.Schema({
  // 1. Vinculación Jerárquica (CRÍTICO)
  farm: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Farm', 
    required: true // Todo lote debe pertenecer a una finca
  },
  user: { // Mantenemos referencia al usuario por facilidad de consulta
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  
  // 2. Vinculación Agronómica (El Cerebro)
  cultivoData: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Cultivo', // Referencia al Catálogo Maestro (seedCultivos)
    required: true 
  },

  nombre: { type: String, required: true, trim: true }, // Ej: "Sector Río"
  area: { type: Number, required: true }, // Hectáreas del lote específico
  fechaSiembra: { type: Date, default: Date.now }, // Para calcular edad del cultivo

  // 3. Estado Fitosanitario (Semáforo)
  estadoSalud: {
    type: String,
    enum: ['saludable', 'riesgo', 'peligro'],
    default: 'saludable'
  },

  // 4. Historial Operativo
  historial: [{
    tipo: {
      type: String,
      enum: ['riego', 'fertilizante', 'plaga', 'enfermedad', 'cosecha', 'nota'],
      required: true
    },
    titulo: String,
    descripcion: String,
    fecha: { type: Date, default: Date.now },
    fotoUrl: String
  }]
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Lote', LoteSchema);