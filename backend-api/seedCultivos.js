// seedCultivos.js - Script para poblar la base de datos con cultivos iniciales
const mongoose = require('mongoose');
const Cultivo = require('./models/Cultivo');

// Datos iniciales de cultivos
const cultivosIniciales = [
  {
    nombre: 'Maíz',
    nombreCientifico: 'Zea mays',
    categoria: 'cereal',
    descripcion: 'Cereal de la familia Poaceae, originario de América. Alto valor nutritivo.',
    tempOptima: { min: 18, max: 32 },
    tempGerminacion: { min: 10, max: 40 },
    sensibilidadHeladas: 'critica',
    reqHidricoInicial: 'alto',
    diasLluviaNecesarios: 3,
    lluviaMinima: 10,
    faseLunarOptima: 'creciente',
    diasCosecha: 90,
    prioridadRiego: 1
  },
  {
    nombre: 'Tomate',
    nombreCientifico: 'Solanum lycopersicum',
    categoria: 'hortaliza',
    descripcion: 'Planta de la familia Solanaceae, fruto rojo comestible.',
    tempOptima: { min: 20, max: 30 },
    tempGerminacion: { min: 15, max: 35 },
    sensibilidadHeladas: 'alta',
    reqHidricoInicial: 'medio',
    diasLluviaNecesarios: 2,
    lluviaMinima: 5,
    faseLunarOptima: 'creciente',
    diasCosecha: 70,
    prioridadRiego: 2
  },
  {
    nombre: 'Papa',
    nombreCientifico: 'Solanum tuberosum',
    categoria: 'tubérculo',
    descripcion: 'Tubérculo de la familia Solanaceae, alimento básico mundial.',
    tempOptima: { min: 15, max: 25 },
    tempGerminacion: { min: 10, max: 30 },
    sensibilidadHeladas: 'media',
    reqHidricoInicial: 'medio',
    diasLluviaNecesarios: 3,
    lluviaMinima: 8,
    faseLunarOptima: 'menguante',
    diasCosecha: 120,
    prioridadRiego: 3
  },
  {
    nombre: 'Arroz',
    nombreCientifico: 'Oryza sativa',
    categoria: 'cereal',
    descripcion: 'Cereal de la familia Poaceae, alimento básico en muchas culturas.',
    tempOptima: { min: 20, max: 35 },
    tempGerminacion: { min: 18, max: 40 },
    sensibilidadHeladas: 'alta',
    reqHidricoInicial: 'muy_alto',
    diasLluviaNecesarios: 5,
    lluviaMinima: 15,
    faseLunarOptima: 'creciente',
    diasCosecha: 150,
    prioridadRiego: 1
  },
  {
    nombre: 'Café',
    nombreCientifico: 'Coffea arabica',
    categoria: 'otro',
    descripcion: 'Arbusto de la familia Rubiaceae, granos para bebida estimulante.',
    tempOptima: { min: 18, max: 24 },
    tempGerminacion: { min: 15, max: 30 },
    sensibilidadHeladas: 'alta',
    reqHidricoInicial: 'alto',
    diasLluviaNecesarios: 4,
    lluviaMinima: 12,
    faseLunarOptima: 'todas',
    diasCosecha: 270,
    prioridadRiego: 2
  },
  {
    nombre: 'Frijol',
    nombreCientifico: 'Phaseolus vulgaris',
    categoria: 'leguminosa',
    descripcion: 'Planta leguminosa, fuente importante de proteínas.',
    tempOptima: { min: 20, max: 28 },
    tempGerminacion: { min: 15, max: 35 },
    sensibilidadHeladas: 'media',
    reqHidricoInicial: 'medio',
    diasLluviaNecesarios: 3,
    lluviaMinima: 6,
    faseLunarOptima: 'creciente',
    diasCosecha: 80,
    prioridadRiego: 2
  },
  {
    nombre: 'Cebolla',
    nombreCientifico: 'Allium cepa',
    categoria: 'hortaliza',
    descripcion: 'Planta bulbosa de la familia Amaryllidaceae.',
    tempOptima: { min: 13, max: 24 },
    tempGerminacion: { min: 10, max: 30 },
    sensibilidadHeladas: 'baja',
    reqHidricoInicial: 'medio',
    diasLluviaNecesarios: 2,
    lluviaMinima: 4,
    faseLunarOptima: 'menguante',
    diasCosecha: 100,
    prioridadRiego: 3
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Iniciando proceso de seed de cultivos...');
    
    // Conectar a MongoDB usando la URI del environment
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/PlantDetectorDB';
    await mongoose.connect(mongoURI);
    console.log('✅ Conectado a MongoDB:', mongoose.connection.host);

    // Verificar si ya hay cultivos
    const count = await Cultivo.countDocuments();
    console.log(`📊 Cultivos existentes en la base de datos: ${count}`);

    // Preguntar si se quiere limpiar (solo si hay datos)
    let limpiar = false;
    if (count > 0) {
      const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
      });

      await new Promise((resolve) => {
        readline.question(`¿Desea limpiar los ${count} cultivos existentes? (s/N): `, (answer) => {
          limpiar = answer.toLowerCase() === 's';
          readline.close();
          resolve();
        });
      });
    }

    if (limpiar || count === 0) {
      if (count > 0) {
        await Cultivo.deleteMany({});
        console.log('🗑️  Colección Cultivo limpiada');
      }

      // Insertar cultivos iniciales
      for (const cultivoData of cultivosIniciales) {
        const cultivo = new Cultivo(cultivoData);
        await cultivo.save();
        console.log(`✅ Insertado: ${cultivo.nombre}`);
      }

      // Verificar inserción
      const total = await Cultivo.countDocuments();
      console.log(`📊 Total cultivos en base de datos: ${total}`);
    } else {
      console.log('📝 Manteniendo cultivos existentes. Agregando solo si no existen...');
      
      // Insertar solo cultivos que no existen
      for (const cultivoData of cultivosIniciales) {
        const existe = await Cultivo.findOne({ nombre: cultivoData.nombre });
        if (!existe) {
          const cultivo = new Cultivo(cultivoData);
          await cultivo.save();
          console.log(`✅ Insertado: ${cultivo.nombre}`);
        } else {
          console.log(`⏭️  Saltando: ${cultivoData.nombre} (ya existe)`);
        }
      }
    }

    // Listar cultivos disponibles
    const cultivos = await Cultivo.find({}, 'nombre categoria diasCosecha');
    console.log('\n📋 Cultivos disponibles en la base de datos:');
    cultivos.forEach((c, i) => {
      console.log(`   ${i + 1}. ${c.nombre} (${c.categoria}) - Cosecha: ${c.diasCosecha} días`);
    });

    console.log('\n🎉 Proceso de seed completado exitosamente!');
    console.log('💡 Para probar, use:');
    console.log('   GET /api/climate/cultivos - Listar todos los cultivos');
    console.log('   GET /api/climate/recomendacion?cultivo=Maíz&lat=-1.297&lon=-78.618 - Obtener recomendaciones');
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error al poblar la base de datos:', error);
    process.exit(1);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  seedDatabase();
}

module.exports = { cultivosIniciales, seedDatabase };