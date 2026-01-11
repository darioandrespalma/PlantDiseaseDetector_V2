const mongoose = require('mongoose');

const cultivoSchema = new mongoose.Schema({
  nombre: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true
  },
  nombreCientifico: {
    type: String,
    default: ''
  },
  categoria: { 
    type: String, 
    enum: ['cereal', 'fruta', 'planta', 'hortaliza', 'tubérculo', 'leguminosa', 'otro'],
    required: true
  },
  
  // --- REQUISITOS CLIMÁTICOS ---
  tempOptima: {
    min: { type: Number, required: true },
    max: { type: Number, required: true }
  },
  tempGerminacion: {
    min: { type: Number, required: true },
    max: { type: Number }
  },
  tempEmergencia: {
    min: { type: Number },
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
  diasLluviaNecesarios: { 
    type: Number, 
    default: 3
  },
  lluviaMinima: { 
    type: Number, 
    default: 5
  },
  
  // --- FASE LUNAR ---
  faseLunarOptima: {
    type: String,
    enum: ['creciente', 'llena', 'menguante', 'nueva', 'todas'],
    required: true
  },
  diasCosecha: { 
    type: Number, 
    required: true
  },
  
  // --- PRIORIDADES ---
  prioridadRiego: { 
    type: Number, 
    default: 1,
    min: 1,
    max: 5
  },

  // --- CAMPOS ADICIONALES PARA COMPATIBILIDAD ---
  descripcion: {
    type: String,
    default: ''
  },
  activo: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Método para buscar cultivo (insensible a acentos y mayúsculas)
cultivoSchema.statics.buscarPorNombre = async function(nombre) {
  if (!nombre) return null;
  
  // Normalizar nombre (remover acentos, minúsculas)
  const nombreNormalizado = nombre
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
  
  // Buscar con regex insensible
  return this.findOne({
    $or: [
      { nombre: { $regex: new RegExp(`^${nombreNormalizado}$`, 'i') } },
      { nombre: { $regex: new RegExp(`^${nombre}$`, 'i') } }
    ],
    activo: true
  });
};

// Método para obtener todos los cultivos activos
cultivoSchema.statics.obtenerTodos = async function() {
  return this.find({ activo: true }).sort({ nombre: 1 });
};

// Middleware para actualizar updatedAt
cultivoSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Cultivo = mongoose.model('Cultivo', cultivoSchema);
module.exports = Cultivo;