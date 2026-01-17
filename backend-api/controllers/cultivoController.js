// backend-api/controllers/cultivoController.js
const Cultivo = require('../models/Cultivo');

exports.obtenerCultivos = async (req, res) => {
  try {
    // Busca todos los cultivos activos
    const cultivos = await Cultivo.find({ activo: true }).sort({ nombre: 1 });
    res.json({ success: true, data: cultivos });
  } catch (error) {
    console.error("Error al obtener cultivos:", error);
    res.status(500).json({ success: false, error: 'Error obteniendo cultivos' });
  }
};