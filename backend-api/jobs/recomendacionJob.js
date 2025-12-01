const cron = require('node-cron');
const matchingEngine = require('../services/matchingEngine');

// 🕕 Ejecutar TODOS LOS DÍAS a las 6 AM (hora del servidor)
cron.schedule('0 6 * * *', async () => {
  console.log('🌅 [JOB] Generando recomendaciones diarias (modo simple)...');

  try {
    // 🔹 Por ahora: ejemplo fijo (luego lo conectas con usuarios/fincas)
    const cultivo = 'Maíz';
    const lat = -1.24;   // Ejemplo: Cevallos
    const lon = -78.62;

    const recomendaciones = await matchingEngine.generarRecomendacion(
      cultivo,
      lat,
      lon
    );

    if (recomendaciones.length > 0) {
      console.log('✅ Mejor recomendación:', {
        fecha: recomendaciones[0].fecha,
        score: recomendaciones[0].score,
        estrellas: recomendaciones[0].estrellas,
        primerMotivo: recomendaciones[0].motivos[0],
      });
    } else {
      console.log('⚠️ No se encontraron recomendaciones para hoy.');
    }
  } catch (error) {
    console.error('❌ [JOB] Error en motor de emparejamiento:', error.message);
  }
});
