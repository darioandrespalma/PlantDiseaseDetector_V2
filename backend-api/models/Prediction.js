const mongoose = require('mongoose');

const predictionSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    imagePath: {
      type: String,
      required: true,
    },
    result: {
      disease: {
        type: String,
        required: true,
      },
      confidence: {
        type: Number,
        required: true,
      },
      recommendations: {
        type: String,
        required: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

const Prediction = mongoose.model('Prediction', predictionSchema);

module.exports = Prediction;