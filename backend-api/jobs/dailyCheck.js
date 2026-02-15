const cron = require('node-cron');
const Farm = require('../models/Farm');
const Lote = require('../models/Lote');
const weatherService = require('../services/weatherService');
const agronomicEngine = require('../services/agronomicEngine');

const runDailyAnalysis = async () => {
    console.log('🌅 Iniciando Análisis Agronómico Diario...', new Date().toLocaleString());

    try {
        // 1. Obtener todas las fincas activas
        const fincas = await Farm.find({});
        
        let totalRecomendaciones = 0;

        // 2. Iterar por cada finca
        for (const finca of fincas) {
            // A. Obtener Clima de la Finca
            const clima = await weatherService.getWeatherForFarm(finca.ubicacion.lat, finca.ubicacion.lon);
            console.log(`📍 Analizando Finca: ${finca.nombre} | Clima: ${clima.temp}°C, ${clima.desc}`);

            // B. Obtener Lotes de la Finca
            const lotes = await Lote.find({ farm: finca._id, activo: true }).populate('cultivoData');

            // C. Analizar cada lote
            for (const lote of lotes) {
                const resultados = await agronomicEngine.analyzeLot(lote, clima);
                if (resultados) totalRecomendaciones += resultados.length;
            }
        }

        console.log(`✅ Análisis finalizado. Se generaron ${totalRecomendaciones} recomendaciones nuevas.`);

    } catch (error) {
        console.error('❌ Error crítico en el Job Diario:', error);
    }
};

// Programar tarea: Todos los días a las 06:00 AM ('0 6 * * *')
// Para pruebas rápidas usaremos cada minuto: '* * * * *' (CAMBIAR A '0 6 * * *' EN PRODUCCIÓN)
const task = cron.schedule('0 6 * * *', runDailyAnalysis, {
    scheduled: false // Lo iniciaremos manualmente en app.js
});

module.exports = { start: () => task.start(), runNow: runDailyAnalysis };