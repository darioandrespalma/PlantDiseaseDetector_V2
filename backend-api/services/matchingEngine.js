const axios = require('axios');
const Cultivo = require('../models/Cultivo');

class MatchingEngine {
  constructor(apiKey) {
    this.apiKey = apiKey || process.env.OPENWEATHER_API_KEY;
    this.baseUrl = "https://api.openweathermap.org/data/2.5";
    
    if (!this.apiKey) {
      console.warn('⚠️ OPENWEATHER_API_KEY no configurada. Usando datos simulados.');
    }
  }

  // --- CALENDARIO LUNAR ---
  calcularFaseLunar(date = new Date()) {
    try {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      
      const c = Math.floor(365.25 * year);
      const e = Math.floor(30.6 * month);
      const jd = c + e + day - 694039.09;
      
      const phase = (jd / 29.53058867) % 1;
      
      if (phase < 0.0625) return 'nueva';
      if (phase < 0.1875) return 'creciente';
      if (phase < 0.3125) return 'cuarto_creciente';
      if (phase < 0.4375) return 'gibbosa_creciente';
      if (phase < 0.5625) return 'llena';
      if (phase < 0.6875) return 'gibbosa_menguante';
      if (phase < 0.8125) return 'cuarto_menguante';
      return 'menguante';
    } catch (error) {
      console.error('Error calculando fase lunar:', error);
      return 'creciente'; // Valor por defecto
    }
  }

  // --- FETCH CLIMA (con fallback) ---
  async getForecast7Days(lat, lon) {
    // Si no hay API key, usar datos simulados
    if (!this.apiKey || this.apiKey === 'd5b28bcaabac44f263ab63b4290709c9') {
      console.log('🌤️ Usando datos climáticos simulados (API key no válida o no configurada)');
      return this.getForecastSimulado(lat, lon);
    }

    try {
      const url = `${this.baseUrl}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${this.apiKey}&lang=es`;
      const response = await axios.get(url, { timeout: 10000 });
      const data = response.data;
      
      // Agrupar por día y calcular métricas
      const daily = {};
      data.list.forEach(item => {
        const date = new Date(item.dt * 1000).toISOString().split('T')[0];
        if (!daily[date]) {
          daily[date] = {
            date: new Date(item.dt * 1000),
            temps: [],
            lluvias: [],
            vientos: [],
            descripciones: [],
            minTemp: Infinity,
            maxTemp: -Infinity
          };
        }
        daily[date].temps.push(item.main.temp);
        daily[date].lluvias.push(item.rain?.["3h"] || 0);
        daily[date].vientos.push(item.wind.speed);
        daily[date].descripciones.push(item.weather[0].description);
        daily[date].minTemp = Math.min(daily[date].minTemp, item.main.temp_min);
        daily[date].maxTemp = Math.max(daily[date].maxTemp, item.main.temp_max);
      });

      return Object.values(daily).map(day => ({
        fecha: day.date,
        tempPromedio: day.temps.reduce((a, b) => a + b) / day.temps.length,
        tempMin: day.minTemp,
        tempMax: day.maxTemp,
        lluviaTotal: day.lluvias.reduce((a, b) => a + b, 0),
        vientoPromedio: day.vientos.reduce((a, b) => a + b) / day.vientos.length,
        descripcion: day.descripciones[0],
        faseLunar: this.calcularFaseLunar(day.date)
      }));
    } catch (error) {
      console.error('❌ Error obteniendo pronóstico real:', error.message);
      console.log('🌤️ Usando datos climáticos simulados (fallback)');
      return this.getForecastSimulado(lat, lon);
    }
  }

  // --- DATOS SIMULADOS (fallback) ---
  getForecastSimulado(lat, lon) {
    const forecast = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // Temperatura base basada en latitud
      const latNum = parseFloat(lat) || 0;
      const tempBase = 20 + (latNum * 0.5);
      const variacion = Math.sin(i * 0.5) * 5;
      const temp = tempBase + variacion;
      
      forecast.push({
        fecha: date,
        tempPromedio: Math.round(temp * 10) / 10,
        tempMin: Math.round((temp - 5) * 10) / 10,
        tempMax: Math.round((temp + 5) * 10) / 10,
        lluviaTotal: i % 3 === 0 ? (Math.random() * 10).toFixed(1) : 0,
        vientoPromedio: (10 + Math.random() * 10).toFixed(1),
        descripcion: i % 3 === 0 ? 'Lluvia ligera' : 'Parcialmente nublado',
        faseLunar: this.calcularFaseLunar(date),
        esSimulado: true
      });
    }
    
    return forecast;
  }

  // --- MOTOR DE DECISIÓN (reparado) ---
  async generarRecomendacion(cultivoNombre, lat, lon) {
    try {
      console.log(`🔍 Buscando cultivo: "${cultivoNombre}"`);
      
      // Usar método mejorado de búsqueda
      const cultivo = await Cultivo.buscarPorNombre(cultivoNombre);
      
      if (!cultivo) {
        // Obtener lista de cultivos disponibles para mensaje de error
        const cultivosDisponibles = await Cultivo.obtenerTodos();
        const nombresCultivos = cultivosDisponibles.map(c => c.nombre);
        
        const errorMsg = `Cultivo "${cultivoNombre}" no encontrado.`;
        const sugerencia = cultivosDisponibles.length > 0 
          ? `Cultivos disponibles: ${nombresCultivos.join(', ')}`
          : 'Base de datos de cultivos vacía. Ejecuta: npm run seed';
        
        throw new Error(`${errorMsg} ${sugerencia}`);
      }

      console.log(`✅ Cultivo encontrado: ${cultivo.nombre}`);
      console.log(`📍 Ubicación: (${lat}, ${lon})`);

      const forecast = await this.getForecast7Days(lat, lon);
      const recomendaciones = [];

      forecast.forEach((dia, index) => {
        let score = 0;
        let motivos = [];
        let alertas = [];

        // 1. TEMPERATURA
        const tempPromedio = parseFloat(dia.tempPromedio);
        const tempMin = parseFloat(dia.tempMin);
        
        if (tempPromedio >= cultivo.tempOptima.min && tempPromedio <= cultivo.tempOptima.max) {
          score += 40;
          motivos.push(`🌡️ Temperatura óptima: ${tempPromedio.toFixed(1)}°C (rango ideal: ${cultivo.tempOptima.min}-${cultivo.tempOptima.max}°C)`);
        } else if (cultivo.tempGerminacion && tempPromedio >= cultivo.tempGerminacion.min && tempPromedio < cultivo.tempOptima.min) {
          score += 20;
          motivos.push(`🌡️ Temperatura aceptable para germinación: ${tempPromedio.toFixed(1)}°C`);
        } else {
          score -= 10;
          alertas.push(`⚠️ Temperatura fuera de rango: ${tempPromedio.toFixed(1)}°C (ideal: ${cultivo.tempOptima.min}-${cultivo.tempOptima.max}°C)`);
        }

        // 2. HELADAS
        if (tempMin < 5 && cultivo.sensibilidadHeladas === 'critica') {
          score = 0;
          alertas.push(`❌ RIESGO CRÍTICO: Heladas previstas (${tempMin.toFixed(1)}°C)`);
        } else if (tempMin < 2 && ['alta', 'media'].includes(cultivo.sensibilidadHeladas)) {
          score -= 30;
          alertas.push(`⚠️ Riesgo de heladas: ${tempMin.toFixed(1)}°C`);
        }

        // 3. HÍDRICO - LÓGICA DE AHORRO
        const lluviasProximas = forecast.slice(index, Math.min(index + 3, forecast.length)).map(d => parseFloat(d.lluviaTotal) || 0);
        const lluviaAcumulada = lluviasProximas.reduce((a, b) => a + b, 0);
        
        if (lluviaAcumulada >= cultivo.lluviaMinima) {
          score += 35;
          motivos.push(`💧 Lluvia próxima ahorra riego: ${lluviaAcumulada.toFixed(1)}mm en próximos días`);
        } else if (cultivo.reqHidricoInicial === 'alto' || cultivo.reqHidricoInicial === 'muy_alto') {
          score -= 15;
          alertas.push(`⚠️ Riesgo de sequía: necesita riego manual`);
        }

        // 4. FASE LUNAR
        if (dia.faseLunar === cultivo.faseLunarOptima || cultivo.faseLunarOptima === 'todas') {
          score += 15;
          motivos.push(`🌙 Fase lunar óptima: ${dia.faseLunar}`);
        } else {
          motivos.push(`🌙 Fase lunar: ${dia.faseLunar} (recomendada: ${cultivo.faseLunarOptima})`);
        }

        // 5. VIENTO
        const vientoPromedio = parseFloat(dia.vientoPromedio) || 0;
        if (vientoPromedio > 30) {
          score -= 20;
          alertas.push(`💨 Viento fuerte: ${vientoPromedio.toFixed(1)} km/h`);
        } else if (vientoPromedio > 20) {
          score -= 10;
          alertas.push(`💨 Viento moderado: ${vientoPromedio.toFixed(1)} km/h`);
        }

        // Calcular estrellas (1-5)
        let estrellas;
        score = Math.max(0, Math.min(100, score)); // Asegurar entre 0-100
        
        if (score >= 80) estrellas = 5;
        else if (score >= 60) estrellas = 4;
        else if (score >= 40) estrellas = 3;
        else if (score >= 20) estrellas = 2;
        else estrellas = 1;

        recomendaciones.push({
          fecha: dia.fecha,
          fechaFormateada: dia.fecha.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
          score: Math.round(score),
          estrellas,
          motivos,
          alertas: alertas.length > 0 ? alertas : ['✅ Condiciones favorables'],
          temp: tempPromedio,
          lluvia: parseFloat(dia.lluviaTotal) || 0,
          faseLunar: dia.faseLunar,
          cultivo: cultivo.nombre,
          condiciones: {
            temperatura: `${cultivo.tempOptima.min}°C - ${cultivo.tempOptima.max}°C`,
            lluviaMinima: `${cultivo.lluviaMinima}mm`,
            faseLunarOptima: cultivo.faseLunarOptima,
            sensibilidadHeladas: cultivo.sensibilidadHeladas
          }
        });
      });

      // Ordenar por score descendente
      return recomendaciones.sort((a, b) => b.score - a.score);
      
    } catch (error) {
      console.error('❌ Error en motor de emparejamiento:', error.message);
      throw error;
    }
  }
}

// Exportar instancia con API key del environment
module.exports = new MatchingEngine(process.env.OPENWEATHER_API_KEY);