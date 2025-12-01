const axios = require('axios');
const Cultivo = require('../models/Cultivo');

class MatchingEngine {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = "https://api.openweathermap.org/data/2.5";
  }

  // --- CALENDARIO LUNAR ---
  calcularFaseLunar(date = new Date()) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    const c = Math.floor(365.25 * year);
    const e = Math.floor(30.6 * month);
    const jd = c + e + day - 723244;
    
    const b = (jd / 29.53058867) % 1;
    const fase = Math.floor(b * 8 + 0.5) & 7;
    
    const fases = ['nueva', 'creciente', 'cuarto_creciente', 'gibbosa_creciente', 
                   'llena', 'gibbosa_menguante', 'cuarto_menguante', 'menguante'];
    return fases[fase];
  }

  // --- FETCH CLIMA ---
  async getForecast7Days(lat, lon) {
    const url = `${this.baseUrl}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${this.apiKey}`;
    const { data } = await axios.get(url);
    
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
  }

  // --- MOTOR DE DECISIÓN ---
  async generarRecomendacion(cultivoNombre, lat, lon) {
    const cultivo = await Cultivo.findOne({ nombre: new RegExp(cultivoNombre, 'i') });
    if (!cultivo) throw new Error(`Cultivo ${cultivoNombre} no encontrado`);

    const forecast = await this.getForecast7Days(lat, lon);
    const recomendaciones = [];

    forecast.forEach(dia => {
      let score = 0;
      let motivos = [];
      let alertas = [];

      // 1. TEMPERATURA
      if (dia.tempPromedio >= cultivo.tempOptima.min && dia.tempPromedio <= cultivo.tempOptima.max) {
        score += 40;
        motivos.push(`Temperatura óptima: ${dia.tempPromedio.toFixed(1)}°C`);
      } else if (dia.tempPromedio >= cultivo.tempGerminacion.min && dia.tempPromedio < cultivo.tempOptima.min) {
        score += 20;
        motivos.push(`Temperatura aceptable para germinación: ${dia.tempPromedio.toFixed(1)}°C`);
      } else {
        alertas.push(`Temperatura fuera de rango: ${dia.tempPromedio.toFixed(1)}°C`);
      }

      // 2. HELADAS
      if (dia.tempMin < 5 && cultivo.sensibilidadHeladas === 'critica') {
        score = 0;
        alertas.push(`❌ RIESGO CRÍTICO: Heladas previstas (${dia.tempMin.toFixed(1)}°C)`);
      }

      // 3. HÍDRICO - LÓGICA DE AHORRO
      const lluviasProximas = forecast.slice(0, 3).map(d => d.lluviaTotal);
      const lluviaAcumulada = lluviasProximas.reduce((a, b) => a + b, 0);
      
      if (lluviaAcumulada >= cultivo.lluviaMinima) {
        score += 35;
        motivos.push(`💧 Lluvia próxima ahorra riego: ${lluviaAcumulada.toFixed(1)}mm en 3 días`);
      } else if (cultivo.reqHidricoInicial === 'alto') {
        alertas.push(`⚠️ Riesgo de sequía: necesita riego manual`);
      }

      // 4. FASE LUNAR
      if (dia.faseLunar === cultivo.faseLunarOptima) {
        score += 15;
        motivos.push(`🌙 Fase lunar óptima: ${dia.faseLunar}`);
      } else {
        motivos.push(`🌙 Fase lunar: ${dia.faseLunar} (recomendada: ${cultivo.faseLunarOptima})`);
      }

      // 5. CALCULAR ESTRELLAS
      const estrellas = score >= 80 ? 5 : score >= 60 ? 4 : score >= 40 ? 3 : score >= 20 ? 2 : 1;

      recomendaciones.push({
        fecha: dia.fecha,
        score,
        estrellas,
        motivos,
        alertas,
        temp: dia.tempPromedio,
        lluvia: dia.lluviaTotal,
        faseLunar: dia.faseLunar,
        cultivo: cultivo.nombre
      });
    });

    // Ordenar por score descendente
    return recomendaciones.sort((a, b) => b.score - a.score);
  }
}

module.exports = new MatchingEngine(process.env.OPENWEATHER_API_KEY);