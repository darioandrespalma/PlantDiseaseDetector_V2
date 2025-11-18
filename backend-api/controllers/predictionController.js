// backend-api/controllers/predictionController.js
const Prediction = require('../models/Prediction');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

exports.predictDisease = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No se subió ningún archivo de imagen.' });
  }

  // --- NUEVO: Obtener el cultivo enviado desde el frontend ---
  const { crop } = req.body;
  if (!crop || !['banana', 'rice', 'coffee'].includes(crop)) {
    return res.status(400).json({ message: 'Crop es requerido y debe ser "banana", "rice" o "coffee".' });
  }

  const imagePath = req.file.path;

  try {
    const formData = new FormData();
    formData.append('file', fs.createReadStream(imagePath), req.file.filename);
    formData.append('crop', crop); // <--- PASAR EL CULTIVO AL SERVICIO PYTHON

    const aiServiceUrl = 'http://localhost:5000/predict';
    const aiResponse = await axios.post(aiServiceUrl, formData, {
      headers: formData.getHeaders()
    });

    // --- Guardar en base de datos ---
    const prediction = await Prediction.create({
      user: req.user._id,
      imagePath: req.file.filename,
      crop: crop, // <--- GUARDAR EL CULTIVO EN LA BASE DE DATOS
      result: {
        disease: aiResponse.data.prediction, // Cambié de `disease` a `prediction` como en tu servicio Python
        confidence: aiResponse.data.confidence,
        recommendations: aiResponse.data.recommendations
      }
    });

    // --- Notificar por WebSocket ---
    const io = req.app.get('io');
    io.to(`user_${req.user._id}`).emit('prediction_result', prediction);

    res.status(201).json(prediction);

  } catch (error) {
    console.error('Error en predictDisease:', error.message);
    res.status(500).json({ message: 'Error del servidor al procesar la predicción' });

  } finally {
    try {
      fs.unlinkSync(imagePath);
    } catch (err) {
      console.error('Error al borrar el archivo temporal:', err.message);
    }
  }
};

// --- Funciones para el historial (sin cambios) ---
exports.getPredictionHistory = async (req, res) => {
  try {
    const predictions = await Prediction.find({ user: req.user._id })
                                      .sort({ createdAt: -1 });
    res.json(predictions);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el historial' });
  }
};

exports.getPredictionById = async (req, res) => {
  try {
    const prediction = await Prediction.findById(req.params.id);

    if (prediction && prediction.user.equals(req.user._id)) {
      res.json(prediction);
    } else {
      res.status(404).json({ message: 'Predicción no encontrada o no autorizada' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la predicción' });
  }
};