// backend-api/models/Prediction.js
const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  crop: { // <--- Nuevo campo
    type: String,
    enum: ['banana', 'rice', 'coffee'],
    required: true
  },
  imagePath: {
    type: String,
    required: true
  },
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