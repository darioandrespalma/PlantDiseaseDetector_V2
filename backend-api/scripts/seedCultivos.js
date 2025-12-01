// backend-api/scripts/seedCultivos.js
const path = require('path');
const mongoose = require('mongoose');
const Cultivo = require('../models/Cultivo');

// 👇 Cargar .env desde backend-api/.env
require('dotenv').config({
  path: path.join(__dirname, '..', '.env')
});

console.log('🌱 MONGODB_URI usado por seed:', process.env.MONGODB_URI);

const cultivosData = [
  {
    nombre: 'Maíz',
    nombreCientifico: 'Zea mays',
    categoria: 'cereal',
    tempOptima: { min: 20, max: 30 },
    tempGerminacion: { min: 10 },
    tempEmergencia: { min: 12 },
    sensibilidadHeladas: 'critica',
    reqHidricoInicial: 'alto',
    diasLluviaNecesarios: 3,
    lluviaMinima: 8,
    faseLunarOptima: 'creciente',
    diasCosecha: 120,
    prioridadRiego: 1
  },
  {
    nombre: 'Arroz',
    nombreCientifico: 'Oryza sativa',
    categoria: 'cereal',
    tempOptima: { min: 22, max: 32 },
    tempGerminacion: { min: 12 },
    tempEmergencia: { min: 15 },
    sensibilidadHeladas: 'alta',
    reqHidricoInicial: 'muy_alto',
    diasLluviaNecesarios: 5,
    lluviaMinima: 10,
    faseLunarOptima: 'llena',
    diasCosecha: 150,
    prioridadRiego: 1
  },
  {
    nombre: 'Café',
    nombreCientifico: 'Coffea arabica',
    categoria: 'planta',
    tempOptima: { min: 18, max: 24 },
    tempGerminacion: { min: 15 },
    tempEmergencia: { min: 16 },
    sensibilidadHeladas: 'media',
    reqHidricoInicial: 'medio',
    diasLluviaNecesarios: 4,
    lluviaMinima: 7,
    faseLunarOptima: 'menguante',
    diasCosecha: 270,
    prioridadRiego: 2
  },
  {
    nombre: 'Banano',
    nombreCientifico: 'Musa paradisiaca',
    categoria: 'fruta',
    tempOptima: { min: 25, max: 30 },
    tempGerminacion: { min: 16 },
    tempEmergencia: { min: 18 },
    sensibilidadHeladas: 'critica',
    reqHidricoInicial: 'alto',
    diasLluviaNecesarios: 4,
    lluviaMinima: 8,
    faseLunarOptima: 'creciente',
    diasCosecha: 365,
    prioridadRiego: 1
  }
];

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('✅ Conectado a Mongo para seed');

    await Cultivo.deleteMany({});
    console.log('🧹 Colección cultivos vaciada');

    const res = await Cultivo.insertMany(cultivosData);
    console.log('✅ Cultivos sembrados en DB:', res.map(c => c.nombre));

    mongoose.connection.close();
  })
  .catch(err => {
    console.error('❌ Error en seed:', err);
    process.exit(1);
  });
