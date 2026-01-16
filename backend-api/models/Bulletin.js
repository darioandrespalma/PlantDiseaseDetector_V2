const mongoose = require('mongoose');

const BulletinSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  cuerpo: { type: String, required: true },
  nivelAlerta: { 
    type: String, 
    enum: ['Info', 'Alerta', 'Peligro'], 
    default: 'Info' 
  },
  region: { type: String, default: 'General' }, // Ej: "Pichincha"
  fechaPublicacion: { type: Date, default: Date.now },
  fuente: String // Ej: "Agrocalidad"
});

module.exports = mongoose.model('Bulletin', BulletinSchema);