import { useEffect, useState } from 'react';
import DashboardLayout from '@/shared/components/templates/DashboardLayout';
import { newsService, NewsArticle, MarketPrice } from '../api/news.service';
import { TrendingUp, TrendingDown, Minus, ExternalLink, Calendar, Newspaper } from 'lucide-react';

export default function NewsPage() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [prices, setPrices] = useState<MarketPrice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInfo = async () => {
      setLoading(true);
      try {
        const [newsData, pricesData] = await Promise.all([
          newsService.getLatestNews(),
          newsService.getMarketPrices()
        ]);
        setNews(newsData);
        setPrices(pricesData);
      } catch (error) {
        console.error("Error cargando noticias", error);
      } finally {
        setLoading(false);
      }
    };
    loadInfo();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in-up">
        
        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-bold text-white">Mercado y Noticias</h1>
          <p className="text-slate-400">Actualidad del sector agropecuario en tiempo real.</p>
        </div>

        {/* 1. CINTA DE PRECIOS (MARKET TICKER) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {loading ? (
             [...Array(5)].map((_, i) => <div key={i} className="h-24 bg-slate-800/50 rounded-xl animate-pulse" />)
          ) : (
            prices.map((item, idx) => (
              <div key={idx} className="bg-slate-800/60 border border-slate-700/50 p-4 rounded-xl flex flex-col justify-between hover:border-emerald-500/30 transition-all">
                <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">{item.name}</div>
                <div className="text-xl font-bold text-white">{item.price} <span className="text-[10px] text-slate-500 font-normal">{item.unit}</span></div>
                
                <div className={`flex items-center gap-1 text-xs mt-2 font-medium ${
                  item.trend === 'up' ? 'text-emerald-400' : 
                  item.trend === 'down' ? 'text-red-400' : 'text-slate-400'
                }`}>
                  {item.trend === 'up' && <TrendingUp size={14} />}
                  {item.trend === 'down' && <TrendingDown size={14} />}
                  {item.trend === 'neutral' && <Minus size={14} />}
                  {item.change}
                </div>
              </div>
            ))
          )}
        </div>

        {/* 2. GRID DE NOTICIAS */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Newspaper size={20} className="text-purple-400"/> Últimas Noticias
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
               [...Array(6)].map((_, i) => <div key={i} className="h-80 bg-slate-800/50 rounded-xl animate-pulse" />)
            ) : (
              news.map((article) => (
                <article key={article.id} className="bg-slate-800/40 border border-slate-700/50 rounded-2xl overflow-hidden hover:bg-slate-800/80 transition-all group flex flex-col h-full">
                  
                  {/* Imagen */}
                  <div className="h-48 overflow-hidden relative">
                    <img 
                      src={article.image} 
                      alt={article.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => (e.currentTarget.src = 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=500&q=80')} 
                    />
                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white border border-white/10">
                      {article.source}
                    </div>
                  </div>

                  {/* Contenido */}
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
                      <Calendar size={12} />
                      {new Date(article.date).toLocaleDateString()}
                      <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                      <span className="text-emerald-400 font-medium">{article.category}</span>
                    </div>

                    <h3 className="text-lg font-bold text-white mb-2 leading-snug line-clamp-2 group-hover:text-emerald-400 transition-colors">
                      {article.title}
                    </h3>
                    
                    <p className="text-sm text-slate-400 line-clamp-3 mb-4 flex-1">
                      {article.summary}
                    </p>

                    <a 
                      href={article.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-purple-400 hover:text-purple-300 transition-colors mt-auto"
                    >
                      Leer completo <ExternalLink size={14} />
                    </a>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}