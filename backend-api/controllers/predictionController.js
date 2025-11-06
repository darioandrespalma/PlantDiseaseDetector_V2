// backend-api/controllers/predictionController.js
const Prediction = require('../models/Prediction');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs'); // File System

// --- Función principal (CORREGIDA) ---
exports.predictDisease = async (req, res) => {
  // 1. Verificar si el archivo fue subido por el middleware
  if (!req.file) {
    return res.status(400).json({ message: 'No se subió ningún archivo de imagen.' });
  }

  const imagePath = req.file.path; // Ruta al archivo temporal

  try {
    // 2. Preparar el archivo para enviarlo a la API de Python
    const formData = new FormData();
    formData.append('file', fs.createReadStream(imagePath), req.file.filename);

    // 3. Llamar a la API de Python (que está en el puerto 5000)
    const aiServiceUrl = 'http://localhost:5000/predict';
    const aiResponse = await axios.post(aiServiceUrl, formData, {
      headers: formData.getHeaders()
    });

    // 4. Guardar el resultado en tu base de datos MongoDB
    const prediction = await Prediction.create({
      user: req.user._id, // ID del usuario (de authMiddleware)
      imagePath: req.file.filename,
      result: {
        disease: aiResponse.data.disease,
        confidence: aiResponse.data.confidence,
        recommendations: aiResponse.data.recommendations
      }
    });

    // 5. Enviar notificación por WebSocket al frontend
    const io = req.app.get('io'); // Obtener 'io' de server.js
    io.to(`user_${req.user._id}`).emit('prediction_result', prediction);

    // 6. Enviar la respuesta HTTP 201 (Creado)
    res.status(201).json(prediction);

  } catch (error) {
    // 7. Manejo de errores
    console.error('Error en predictDisease:', error.message);
    res.status(500).json({ message: 'Error del servidor al procesar la predicción' });
  
  } finally {
    // 8. (SOLUCIÓN) Borrar el archivo temporal SIEMPRE
    // Este bloque se ejecuta tanto si 'try' tiene éxito como si 'catch' falla.
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