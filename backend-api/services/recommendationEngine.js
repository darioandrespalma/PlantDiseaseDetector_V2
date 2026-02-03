const axios = require('axios');
const SunCalc = require('suncalc'); // Usamos SunCalc para la fase exacta
require('dotenv').config();

const API_KEY = process.env.OPENWEATHER_API_KEY;

class RecommendationEngine {
  
  /**
   * Obtiene datos climáticos y genera recomendación agrícola
   */
  async getAdvice(lat, lon) {
    try {
      // 1. Validar coordenadas
      if (!lat || !lon) {
        return this.getDefaultAdvice();
      }

      // 2. Consultar OpenWeatherMap
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=es&appid=${API_KEY}`;
      const response = await axios.get(url, { timeout: 5000 }); // Timeout de 5s para no colgar el dashboard
      const weather = response.data;

      // 3. Calcular Fase Lunar Exacta
      const lunarPhase = this.calculateLunarPhase(new Date());

      // 4. Generar Recomendación Contextual
      const recommendation = this.generateStrategy(weather, lunarPhase);

      return {
        location: weather.name,
        temp: Math.round(weather.main.temp),
        humidity: weather.main.humidity,
        weatherDesc: weather.weather[0].description,
        lunarPhase: lunarPhase.label,
        advice: recommendation
      };

    } catch (error) {
      console.error('⚠️ Error en RecommendationEngine:', error.message);
      return this.getDefaultAdvice(); // Fallback seguro
    }
  }

  calculateLunarPhase(date) {
    const moon = SunCalc.getMoonIllumination(date);
    const phase = moon.phase;

    if (phase < 0.03 || phase > 0.97) return { id: 'new', label: 'Luna Nueva' };
    if (phase < 0.25) return { id: 'waxing_crescent', label: 'Luna Creciente' };
    if (phase < 0.28) return { id: 'first_quarter', label: 'Cuarto Creciente' };
    if (phase < 0.50) return { id: 'waxing_gibbous', label: 'Gibosa Creciente' };
    if (phase < 0.53) return { id: 'full', label: 'Luna Llena' };
    if (phase < 0.75) return { id: 'waning_gibbous', label: 'Gibosa Menguante' };
    if (phase < 0.78) return { id: 'last_quarter', label: 'Cuarto Menguante' };
    return { id: 'waning_crescent', label: 'Luna Menguante' };
  }

  generateStrategy(weather, lunar) {
    const isRaining = weather.weather[0].main.toLowerCase().includes('rain') || weather.weather[0].main.toLowerCase().includes('drizzle');
    
    // Lógica combinada: Clima + Luna
    if (isRaining) {
      return "🌧️ Lluvia detectada: Suspender riego y fertilización foliar. Aproveche para recolección de agua.";
    }

    switch (lunar.id) {
      case 'new':
        return "🌑 Fase ideal para poda de limpieza, aporque y abonado del suelo. No sembrar aún.";
      case 'waxing_crescent':
      case 'first_quarter':
      case 'waxing_gibbous':
        return "🌱 La savia sube. Excelente momento para sembrar hortalizas de hoja y fruto (tomate, maíz).";
      case 'full':
        return "🌕 Máxima vitalidad. Coseche frutos para consumo inmediato. Evite podas drásticas hoy.";
      case 'waning_gibbous':
      case 'last_quarter':
      case 'waning_crescent':
        return "🥕 La savia baja. Ideal para sembrar raíces (zanahoria, papa) y trasplantes. Aplicar abono.";
      default:
        return "Monitoree sus cultivos y verifique la humedad del suelo.";
    }
  }

  getDefaultAdvice() {
    // Si falla la API o no hay ubicación
    const lunar = this.calculateLunarPhase(new Date());
    return {
      location: 'Ubicación desconocida',
      temp: null,
      lunarPhase: lunar.label,
      advice: "Activa la ubicación para recomendaciones climáticas precisas."
    };
  }
}

module.exports = new RecommendationEngine();