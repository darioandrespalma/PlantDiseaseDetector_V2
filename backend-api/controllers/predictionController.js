// backend-api/controllers/predictionController.js
const Prediction = require('../models/Prediction');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const mongoose = require('mongoose');


exports.predictDisease = async (req, res) => {
  // 1. Validación inicial
  if (!req.file) {
    return res.status(400).json({ message: 'No se subió ningún archivo. Asegúrate de enviar el campo "file".' });
  }

  const { crop, lat, lon } = req.body;
  if (!crop || !['banana', 'rice', 'coffee'].includes(crop)) {
    // Eliminamos el archivo si hay error de validación para no llenar basura
    try { fs.unlinkSync(req.file.path); } catch(e){}
    return res.status(400).json({ message: 'El campo "crop" es requerido (banana, rice, coffee).' });
  }

  const imagePath = req.file.path;

  try {
    // 2. Preparar envío a Python
    const formData = new FormData();
    formData.append('file', fs.createReadStream(imagePath), req.file.filename);
    formData.append('crop', crop);

    // --- CORRECCIÓN 1: Apuntar al puerto 5001 (donde corre Python ahora) ---
    const IA_BASE_URL = process.env.IA_URL || 'http://127.0.0.1:5001';

    const cleanBaseUrl = IA_BASE_URL.replace(/\/$/, '');

    const aiServiceUrl = `${cleanBaseUrl}/predict`;

    console.log(`📡 Enviando imagen a la IA en: ${aiServiceUrl}`);
    
    const aiResponse = await axios.post(aiServiceUrl, formData, {
      headers: formData.getHeaders() // Headers multipart necesarios
    });

    // 3. Generar recomendaciones (Tu Python no las envía, así que las simulamos aquí o ponemos un default)
    // Esto evita que falle al guardar en Mongo si el campo es obligatorio
    const defaultRecs = aiResponse.data.prediction === 'healthy' 
        ? ['Continuar con el monitoreo regular.', 'Mantener buenas prácticas de riego.']
        : ['Aislar la planta afectada.', 'Consultar con un agrónomo para fungicidas específicos.'];

    // --- Construir Objeto de Ubicación ---
    let locationData = undefined;
    if (lat && lon) {
        locationData = {
            type: 'Point',
            coordinates: [parseFloat(lon), parseFloat(lat)] // Mongo: [Lon, Lat]
        };
    }


    // --- Guardar en base de datos ---
    const prediction = await Prediction.create({
      user: req.user._id,
      imagePath: req.file.filename, // Guardamos solo el nombre del archivo
      crop: crop,
      location: locationData, // <--- Guardamos ubicación
      result: {
        disease: aiResponse.data.prediction,
        confidence: aiResponse.data.confidence,
        // Usamos lo que venga de Python, o el default si no existe
        recommendations: aiResponse.data.recommendations || defaultRecs 
      }
    });

    // --- Notificar por WebSocket ---
    // Verificamos si Socket.io está disponible antes de usarlo
    const io = req.app.get('io');
    if (io) {
        io.to(`user_${req.user._id}`).emit('prediction_result', prediction);
    }

    res.status(201).json(prediction);

  } catch (error) {
    console.error('Error en predictDisease:', error.message);
    // Si el error viene de Python (axios)
    if (error.response) {
        return res.status(error.response.status).json(error.response.data);
    }
    res.status(500).json({ message: 'Error del servidor al procesar la predicción' });

  } finally {
    // 4. Limpieza: Borrar imagen temporal de la carpeta uploads (opcional, pero recomendado)
    // Si quieres mantener la imagen para servirla al front, comenta este bloque.
    /*
    try {
      if (fs.existsSync(imagePath)) {
          // fs.unlinkSync(imagePath); // Descomenta si NO quieres guardar las imágenes en disco
      }
    } catch (err) {
      console.error('Error borrando temp:', err.message);
    }
    */
  }
};

// ... (El resto de funciones getPredictionHistory y getById déjalas igual)
exports.getPredictionHistory = async (req, res) => {
    try {
      const predictions = await Prediction.find({ user: req.user._id }).sort({ createdAt: -1 });
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
        res.status(404).json({ message: 'No encontrado' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error servidor' });
    }
};