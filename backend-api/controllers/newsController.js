// backend-api/controllers/newsController.js
const Parser = require('rss-parser');
const axios = require('axios');
const NodeCache = require('node-cache');

// Cache de 1 hora para no saturar y responder rápido
const newsCache = new NodeCache({ stdTTL: 3600 });
const parser = new Parser();

exports.getNews = async (req, res) => {
    try {
        // 1. Revisar Caché
        const cachedNews = newsCache.get("agri_news");
        if (cachedNews) {
            return res.json(cachedNews);
        }

        // 2. Definir fuentes
        // Fuente A: El Productor (Noticias de Ecuador)
        const feedUrl = 'https://elproductor.com/feed/';
        
        // Fuente B: NewsAPI (Complemento) - REEMPLAZA CON TU API KEY
        // Si no tienes API Key, comenta esta parte o regístrate en newsapi.org
        const apiKey = process.env.NEWS_API_KEY || 'TU_CLAVE_API_AQUI'; 
        const apiUrl = `https://newsapi.org/v2/everything?q=agricultura+ecuador&language=es&sortBy=publishedAt&apiKey=${apiKey}`;

        const promises = [
            parser.parseURL(feedUrl).catch(e => null), // Capturamos error para que no falle todo
            axios.get(apiUrl).catch(e => null)
        ];

        const [feedResult, apiResult] = await Promise.all(promises);

        let articles = [];

        // Procesar RSS (El Productor - Ecuador)
        if (feedResult && feedResult.items) {
            const localNews = feedResult.items.slice(0, 6).map(item => ({
                title: item.title,
                summary: item.contentSnippet ? item.contentSnippet.substring(0, 150) + '...' : 'Sin descripción',
                link: item.link,
                source: 'El Productor (Ecuador)',
                date: item.pubDate,
                image: extractImage(item.content) || 'https://via.placeholder.com/300x200?text=Noticia+Agricola' // Imagen por defecto
            }));
            articles = [...articles, ...localNews];
        }

        // Procesar NewsAPI (Opcional)
        if (apiResult && apiResult.data && apiResult.data.articles) {
            const apiNews = apiResult.data.articles.slice(0, 4).map(item => ({
                title: item.title,
                summary: item.description,
                link: item.url,
                source: item.source.name,
                date: item.publishedAt,
                image: item.urlToImage || 'https://via.placeholder.com/300x200?text=Agro+Tech'
            }));
            articles = [...articles, ...apiNews];
        }

        // 3. Guardar en Caché y Responder
        newsCache.set("agri_news", articles);
        res.json(articles);

    } catch (error) {
        console.error('Error en noticias:', error);
        res.status(500).json({ msg: 'Error al obtener noticias' });
    }
};

// Función auxiliar para sacar imágenes del HTML del RSS
function extractImage(content) {
    if (!content) return null;
    const imgRegex = /<img[^>]+src="([^">]+)"/;
    const match = content.match(imgRegex);
    return match ? match[1] : null;
}