const Lote = require('../models/Lote');
const Prediction = require('../models/Prediction');

exports.getMapData = async (req, res) => {
  try {
    const userId = req.user._id;

    // 1. Obtener Lotes (para mostrar ubicación de cultivos)
    const lotes = await Lote.find({ user: userId }).select('nombre ubicacion estadoSalud cultivo');

    // 2. Obtener Alertas recientes (últimos 7 días)
    const fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() - 7);

    const alertas = await Prediction.find({
      user: userId,
      createdAt: { $gte: fechaLimite },
      // Filtramos predicciones que NO sean saludables (ajusta según tus clases de IA)
      prediction: { $nin: ['healthy', 'Saludable'] } 
    }).select('crop prediction confidence createdAt');

    res.json({
      success: true,
      lotes,
      alertas
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error cargando mapa' });
  }
};