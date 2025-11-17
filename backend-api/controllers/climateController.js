const axios = require("axios");

const API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";

// ------------------------------
// 1. Clima actual
// ------------------------------
exports.getTodayClimate = async (req, res) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ error: "lat y lon son requeridos" });
  }

  try {
    const url = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
    const { data } = await axios.get(url);

    const today = {
      temperature: data.main.temp,
      humidity: data.main.humidity,
      wind: data.wind.speed,
      rain: data.rain?.["1h"] || 0,
      description: data.weather[0].description,
      city: data.name,
    };

    res.json(today);
  } catch (error) {
    console.error(
      "Error clima hoy:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Error obteniendo el clima actual" });
  }
};

// ------------------------------
// 2. Pronóstico (hasta 5 días)
// ------------------------------
exports.getForecast7Days = async (req, res) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ error: "lat y lon son requeridos" });
  }

  try {
    // 5 días / 3 h por llamada (gratis)
    const url = `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
    const { data } = await axios.get(url);

    // Aquí no viene "daily", viene "list" (cada 3 horas)
    const forecast = data.list.map((item) => ({
      date: new Date(item.dt * 1000),
      temp: item.main.temp,
      humidity: item.main.humidity,
      rain: item.rain?.["3h"] || 0,
      wind: item.wind.speed,
      description: item.weather[0].description,
    }));

    res.json({ forecast });
  } catch (error) {
    console.error(
      "Error forecast:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Error obteniendo pronóstico" });
  }
};

// ---------------------------------------
// 3. Recomendación agrícola simple (sin luna)
// ---------------------------------------
exports.getAgroRecommendation = async (req, res) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ error: "lat y lon son requeridos" });
  }

  try {
    const url = `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
    const { data } = await axios.get(url);

    // Tomamos los próximos 7 registros (aprox. 1 día) para ejemplo
    const days = data.list.slice(0, 7);

    const recommendations = days.map((item) => {
      const temp = item.main.temp;
      const rain = item.rain?.["3h"] || 0;

      let rainAdvice =
        rain > 10 ? "Evitar sembrar (lluvia fuerte)." : "Lluvia ligera o nula.";

      let tempAdvice =
        temp < 18
          ? "Temperatura baja, usar protección."
          : temp > 32
          ? "Temperatura alta, riesgo de estrés."
          : "Temperatura óptima.";

      return {
        date: new Date(item.dt * 1000),
        temperature: temp,
        rain,
        recommendation: `${rainAdvice} ${tempAdvice}`,
      };
    });

    res.json({ recommendations });
  } catch (error) {
    console.error(
      "Error recomendación:",
      error.response?.data || error.message
    );
    res
      .status(500)
      .json({ error: "Error generando recomendación agrícola" });
  }
};
