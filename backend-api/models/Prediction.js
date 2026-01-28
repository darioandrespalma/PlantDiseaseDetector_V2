// backend-api/models/Prediction.js
const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  crop: {
    type: String,
    enum: ['banana', 'rice', 'coffee'],
    required: true
  },
  imagePath: {
    type: String,
    required: true
  },
  // --- NUEVO: Geolocalización (GeoJSON) ---
  location: {
    type: {
      type: String,
      enum: ['Point'], 
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [Longitud, Latitud] (Importante: Mongo usa Long, Lat)
      index: '2dsphere' // Índice para búsquedas rápidas en mapas
    }
  },
  // ----------------------------------------
  result: {
    disease: {
      type: String,
      required: true
    },
    confidence: {
      type: Number,
      required: true
    },
    recommendations: {
      type: [String],
      default: []
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Prediction', predictionSchema);