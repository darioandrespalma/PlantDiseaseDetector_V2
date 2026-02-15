const DailyRecommendation = require('../models/DailyRecommendation');

/**
 * Analiza un lote específico contra el clima actual
 * @param {Object} lote - Documento del lote con cultivoData populado
 * @param {Object} clima - Objeto {temp, rain, humidity}
 */
exports.analyzeLot = async (lote, clima) => {
    const cultivo = lote.cultivoData;
    if (!cultivo) return null; // Si no hay cultivo, no hay reglas

    // 1. Calcular Edad
    const hoy = new Date();
    const siembra = new Date(lote.fechaSiembra);
    hoy.setHours(0,0,0,0);
    siembra.setHours(0,0,0,0);
    let diasEdad = Math.floor((hoy - siembra) / (1000 * 60 * 60 * 24));
    if (diasEdad < 0) diasEdad = 0;

    const alertas = [];

    // --- REGLA 1: ESTRÉS HÍDRICO (Sequía) ---
    // Si llueve menos del mínimo requerido por el cultivo
    const minLluvia = cultivo.lluviaMinima || 10;
    if (clima.rain < minLluvia) {
        alertas.push({
            tipo: 'riego',
            mensaje: `⚠️ Alerta de Sequía: ${cultivo.nombre} tiene ${diasEdad} días y requiere agua.`,
            accion: `Activar riego. Clima actual: ${clima.desc}, Lluvia: ${clima.rain}mm.`,
            prioridad: 'alta'
        });
    }

    // --- REGLA 2: ESTRÉS TÉRMICO (Calor Extremo) ---
    // Si la temperatura supera el máximo del cultivo
    const maxTemp = cultivo.tempOptima?.max || 35;
    if (clima.temp > maxTemp) {
        alertas.push({
            tipo: 'general',
            mensaje: `🔥 Golpe de Calor: ${clima.temp}°C excede el óptimo de ${cultivo.nombre}.`,
            accion: `Aumentar hidratación y verificar sombras si aplica.`,
            prioridad: 'media'
        });
    }

    // --- REGLA 3: RIESGO DE HONGOS (Humedad Alta) ---
    // Si hay mucha humedad y calor, el hongo prolifera
    if (clima.humidity > 85 && clima.temp > 24) {
        alertas.push({
            tipo: 'fitosanitario',
            mensaje: `🍄 Riesgo Fúngico Alto: Humedad ${clima.humidity}% y calor.`,
            accion: `Monitorear hojas por Sigatoka o Royas. Aplicar preventivo si es necesario.`,
            prioridad: 'alta'
        });
    }

    // 3. Guardar Alertas en Base de Datos
    // Borramos alertas viejas de hoy para no duplicar
    const startToday = new Date(); startToday.setHours(0,0,0,0);
    await DailyRecommendation.deleteMany({ lote: lote._id, fechaGeneracion: { $gte: startToday } });

    const recomendacionesGuardadas = [];
    
    for (const alerta of alertas) {
        const recomendacion = new DailyRecommendation({
            lote: lote._id,
            tipo: alerta.tipo,
            mensaje: alerta.mensaje,
            accionSugerida: alerta.accion,
            estado: 'pendiente'
        });
        await recomendacion.save();
        recomendacionesGuardadas.push(recomendacion);
    }

    return recomendacionesGuardadas;
};