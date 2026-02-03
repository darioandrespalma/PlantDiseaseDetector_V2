const Farm = require('../models/Farm');
const Lote = require('../models/Lote');

// Obtener todas las fincas del usuario
exports.getFarms = async (req, res) => {
  try {
    const farms = await Farm.find({ user: req.user._id, activo: true })
      .select('nombre ubicacion areaTotal tipoSuelo');
    
    res.json({ success: true, data: farms });
  } catch (error) {
    console.error('Error obteniendo fincas:', error);
    res.status(500).json({ success: false, message: 'Error al cargar fincas' });
  }
};

// Crear una nueva finca
exports.createFarm = async (req, res) => {
  try {
    const { nombre, ubicacion, areaTotal, tipoSuelo } = req.body;

    // Validación básica
    if (!nombre || !ubicacion?.lat || !ubicacion?.lon) {
      return res.status(400).json({ 
        success: false, 
        message: 'Nombre y ubicación (GPS) son obligatorios' 
      });
    }

    const newFarm = new Farm({
      user: req.user._id,
      nombre,
      ubicacion,
      areaTotal,
      tipoSuelo
    });

    await newFarm.save();

    res.status(201).json({ 
      success: true, 
      message: 'Finca registrada exitosamente', 
      data: newFarm 
    });
  } catch (error) {
    console.error('Error creando finca:', error);
    res.status(500).json({ success: false, message: 'No se pudo registrar la finca' });
  }
};

// Obtener resumen de una finca específica
exports.getFarmSummary = async (req, res) => {
  try {
    const { farmId } = req.params;
    
    const farm = await Farm.findOne({ _id: farmId, user: req.user._id });
    if (!farm) {
      return res.status(404).json({ success: false, message: 'Finca no encontrada' });
    }

    // Contar lotes de esta finca
    const lotesCount = await Lote.countDocuments({ farm: farmId });
    
    // Aquí conectaríamos con el clima específico de la finca
    // (Lógica que implementaremos en el dashboardController)

    res.json({
      success: true,
      data: {
        farm,
        stats: {
          totalLotes: lotesCount
        }
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Error obteniendo detalles' });
  }
};