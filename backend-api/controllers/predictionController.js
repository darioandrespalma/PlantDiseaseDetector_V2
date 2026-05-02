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
  if (!crop || !['banana', 'rice', 'coffee', 'apple', 'tomato', 'corn'].includes(crop)) {
    // Eliminamos el archivo si hay error de validación para no llenar basura
    try { fs.unlinkSync(req.file.path); } catch(e){}
    return res.status(400).json({ message: 'El campo "crop" es requerido (banana, rice, coffee, apple, tomato, corn).' });
  }

  const imagePath = req.file.path;

  try {
    // 2. Preparar envío a Python
    const formData = new FormData();
    formData.append('file', fs.createReadStream(imagePath), req.file.filename);
    formData.append('crop', crop);
    // Le pasamos un query por defecto para el Agente
    formData.append('query', 'Analiza esta hoja y dame recomendaciones agronómicas.');

    // --- CORRECCIÓN 1: Apuntar al puerto 5001 (donde corre Python ahora) ---
    const IA_BASE_URL = process.env.IA_URL || 'http://127.0.0.1:7860';
    const cleanBaseUrl = IA_BASE_URL.replace(/\/$/, '');
    const aiServiceUrl = `${cleanBaseUrl}/agent/query`;


    console.log(`📡 Enviando imagen al AGENTE IA en: ${aiServiceUrl}`);
    
    const aiResponse = await axios.post(aiServiceUrl, formData, {
      headers: formData.getHeaders() // Headers multipart necesarios
    });

    // 3. Extraer la respuesta de la estructura del Agente
    const agentData = aiResponse.data;

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
        disease: agentData.technical_data.prediction,
        confidence: agentData.technical_data.confidence_percent, // Escala 0-100 real
        // Guardamos el texto redactado por Gemini/Fallback como un array para el Frontend
        recommendations: [agentData.agent_response]
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