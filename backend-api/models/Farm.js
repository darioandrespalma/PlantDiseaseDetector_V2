const mongoose = require('mongoose');

const FarmSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  nombre: {
    type: String,
    required: [true, 'El nombre de la finca es obligatorio'],
    trim: true
  },
  ubicacion: {
    lat: { type: Number, required: true },
    lon: { type: Number, required: true },
    direccion: String, // Ej: "Km 5 Vía Cayambe"
    provincia: String, // Ej: "Pichincha"
    ciudad: String
  },
  areaTotal: {
    type: Number, // En Hectáreas
    default: 0
  },
  tipoSuelo: {
    type: String,
    enum: ['Arcilloso', 'Arenoso', 'Franco', 'Limoso', 'Desconocido'],
    default: 'Desconocido'
  },
  // Configuración específica de la finca
  configuracion: {
    zonaHoraria: { type: String, default: 'America/Guayaquil' },
    riegoAutomata: { type: Boolean, default: false } // Para futuro IoT
  },
  activo: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Farm', FarmSchema);