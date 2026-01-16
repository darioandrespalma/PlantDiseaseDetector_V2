const matchingEngine = require('../services/matchingEngine'); // Tu archivo con la clase
const Lote = require('../models/Lote'); // Si necesitas buscar por lote

exports.getRecomendaciones = async (req, res) => {
  try {
    // El frontend puede enviar ?loteId=XYZ o directamente ?cultivo=Maiz&lat=...&lon=...
    const { loteId, cultivo, lat, lon } = req.query;

    let nombreCultivo = cultivo;
    let latitud = lat;
    let longitud = lon;

    // Si envían Lote ID, buscamos los datos en la BD
    if (loteId) {
      const lote = await Lote.findById(loteId).populate('cultivo');
      if (!lote) return res.status(404).json({ message: 'Lote no encontrado' });
      
      nombreCultivo = lote.cultivo.nombre;
      latitud = lote.ubicacion.lat;
      longitud = lote.ubicacion.lon;
    }

    if (!nombreCultivo || !latitud || !longitud) {
      return res.status(400).json({ message: 'Faltan datos: cultivo, lat y lon requeridos.' });
    }

    // 🔥 Aquí usamos tu motor lógico
    const recomendaciones = await matchingEngine.generarRecomendacion(nombreCultivo, latitud, longitud);

    res.json({
      cultivo: nombreCultivo,
      ubicacion: { lat: latitud, lon: longitud },
      recomendaciones
    });

  } catch (error) {
    console.error('Error generando recomendaciones:', error);
    res.status(500).json({ message: error.message });
  }
};