const mongoose = require('mongoose');

const cultivoSchema = new mongoose.Schema({
  nombre: { type: String, required: true, unique: true },
  nombreCientifico: String,
  categoria: { type: String, enum: ['cereal', 'fruta', 'planta'], required: true },
  
  // --- REQUISITOS CLIMÁTICOS ---
  tempOptima: {
    min: { type: Number, required: true },
    max: { type: Number, required: true }
  },
  tempGerminacion: {
    min: { type: Number, required: true },
    max: { type: Number } // Opcional
  },
  tempEmergencia: {
    min: { type: Number, required: true },
    max: { type: Number }
  },
  sensibilidadHeladas: {
    type: String,
    enum: ['baja', 'media', 'alta', 'critica'],
    required: true
  },
  
  // --- REQUISITOS HÍDRICOS ---
  reqHidricoInicial: {
    type: String,
    enum: ['muy_bajo', 'bajo', 'medio', 'alto', 'muy_alto'],
    required: true
  },
  diasLluviaNecesarios: { type: Number, default: 3 }, // Días con lluvia esperada
  lluviaMinima: { type: Number, default: 5 }, // mm necesarios
  
  // --- FASE LUNAR ---
  faseLunarOptima: {
    type: String,
    enum: ['creciente', 'llena', 'menguante', 'nueva'],
    required: true
  },
  diasCosecha: { type: Number, required: true }, // Días hasta cosecha
  
  // --- PRIORIDADES ---
  prioridadRiego: { type: Number, default: 1 }, // 1=crítico, 5=opcional
}, {
  timestamps: true
});

module.exports = mongoose.model('Cultivo', cultivoSchema);