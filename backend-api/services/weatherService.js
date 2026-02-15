const axios = require('axios');

// Asegúrate de tener esto en tu archivo .env: OPENWEATHER_API_KEY=tu_api_key_real
const API_KEY = process.env.OPENWEATHER_API_KEY; 

exports.getWeatherForFarm = async (lat, lon) => {
    // Validación Estricta: Sin coordenadas o sin API Key, no funcionamos.
    if (!API_KEY) throw new Error("Falta configuración de API Key de Clima (OPENWEATHER_API_KEY)");
    if (!lat || !lon) throw new Error("La finca no tiene coordenadas GPS válidas.");

    try {
        // Petición REAL a los servidores de OpenWeather
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=es`;
        const response = await axios.get(url);

        // Retornamos SOLO datos reales
        return {
            temp: response.data.main.temp,
            humidity: response.data.main.humidity,
            rain: response.data.rain ? (response.data.rain['1h'] || 0) : 0, // Lluvia real última hora
            desc: response.data.weather[0].description, // Ej: "cielo claro", "lluvia moderada"
            icon: response.data.weather[0].icon,
            source: 'real_api'
        };
    } catch (error) {
        console.error("❌ Error conectando con proveedor de clima:", error.message);
        // En producción, es mejor lanzar el error que inventar datos
        throw new Error("Servicio de clima no disponible temporalmente.");
    }
};