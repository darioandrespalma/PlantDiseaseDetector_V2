// backend-api/fixCultivos.js
const mongoose = require('mongoose');
require('dotenv').config();

// Esquema mínimo necesario
const CultivoSchema = new mongoose.Schema({}, { strict: false });
const Cultivo = mongoose.model('Cultivo', CultivoSchema);

async function fixData() {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/PlantDetectorDB';
    await mongoose.connect(mongoURI);
    console.log('✅ Conectado a MongoDB...');

    // Actualizar todos los cultivos para que tengan activo: true
    const resultado = await Cultivo.updateMany(
      {}, // Filtro: Todos
      { $set: { activo: true } } // Acción: Poner activo en true
    );

    console.log(`✨ Se actualizaron ${resultado.modifiedCount} cultivos.`);
    console.log('Ahora todos tienen "activo: true".');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    process.exit();
  }
}

fixData();