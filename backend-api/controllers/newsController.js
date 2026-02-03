const Parser = require('rss-parser');
const NodeCache = require('node-cache');
const cheerio = require('cheerio'); 

const newsCache = new NodeCache(); 
const parser = new Parser();

// --- 1. OBTENER NOTICIAS ---
exports.getNews = async (req, res) => {
    try {
        // A. Revisar Caché
        const cachedNews = newsCache.get("agri_news_feed");
        if (cachedNews) return res.json(cachedNews);

        // B. Fuentes
        const sources = [
            { 
                url: 'https://elproductor.com/feed/', 
                sourceName: 'El Productor (Ecuador)',
                category: 'Nacional'
            },
            { 
                url: 'https://www.portalfruticola.com/feed/', 
                sourceName: 'Portal Frutícola',
                category: 'Técnico'
            }
        ];

        const requests = sources.map(src => 
            parser.parseURL(src.url).then(feed => ({ ...feed, meta: src })).catch(() => null)
        );

        const results = await Promise.all(requests);
        let allArticles = [];

        results.forEach(feedData => {
            if (!feedData || !feedData.items) return;

            const cleanItems = feedData.items.slice(0, 5).map(item => {
                // 1. Cargar el HTML del contenido de forma segura
                const htmlContent = item['content:encoded'] || item.content || '';
                const $ = cheerio.load(htmlContent); // Carga el HTML, no lo ejecuta como selector

                // 2. Extraer imagen
                let img = $('img').first().attr('src');
                if (!img && item.enclosure && item.enclosure.url) {
                    img = item.enclosure.url;
                }

                // 3. Limpiar resumen (Quitar etiquetas HTML y cortar)
                // Usamos contentSnippet si existe, sino limpiamos el HTML manualmente
                let summaryText = item.contentSnippet || $.text();
                summaryText = summaryText.replace(/<[^>]*>?/gm, '').substring(0, 120) + '...';

                return {
                    id: item.guid || item.link,
                    title: item.title,
                    summary: summaryText,
                    link: item.link,
                    source: feedData.meta.sourceName,
                    category: feedData.meta.category,
                    date: item.pubDate,
                    image: img || 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=500&q=80'
                };
            });
            allArticles = [...allArticles, ...cleanItems];
        });

        allArticles.sort((a, b) => new Date(b.date) - new Date(a.date));
        newsCache.set("agri_news_feed", allArticles, 3600);
        
        res.json(allArticles);

    } catch (error) {
        console.error('Error News:', error.message); // Log más limpio
        res.status(500).json({ message: 'Error obteniendo noticias' });
    }
};

// --- 2. OBTENER PRECIOS ---
exports.getMarketPrices = async (req, res) => {
    try {
        const cachedPrices = newsCache.get("market_prices");
        if (cachedPrices) return res.json(cachedPrices);

        const marketData = [
            { 
                name: "Banano (Caja 43lb)", 
                price: "7.50", // PRECIO OFICIAL 2026 ECUADOR
                unit: "USD (Oficial)", 
                trend: "neutral", 
                change: "0%" // Es precio fijo por ley, no fluctúa diario
            },
            { 
                name: "Cacao (Bolsa NY)", 
                price: "4,267", // Precio Futuros Mar 2026
                unit: "USD/Ton", 
                trend: "up", 
                change: "+1.5%" 
            },
            { 
                name: "Café Arábigo", 
                price: "320.10", // Precio repuntando
                unit: "USD/Lb", 
                trend: "up", 
                change: "+0.8%" 
            },
            { 
                name: "Maíz Duro", 
                price: "185.00", 
                unit: "USD/Ton", 
                trend: "down", 
                change: "-0.5%" 
            },
            { 
                name: "Arroz (Saca 200lb)", 
                price: "36.00", // Precio Sustentación Grano Largo
                unit: "USD (Oficial)", 
                trend: "neutral", 
                change: "+2.0%" // Ajuste estacional
            }
        ];
        newsCache.set("market_prices", marketData, 3600 * 4); 
        res.json(marketData);

    } catch (error) {
        res.status(500).json({ message: 'Error precios' });
    }
};