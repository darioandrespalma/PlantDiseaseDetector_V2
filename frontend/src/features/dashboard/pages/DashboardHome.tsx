import { useEffect, useState } from 'react';
import { Activity, AlertTriangle, CheckCircle2, Moon, Sprout, ArrowRight, Flower2, Coffee, MapPin, CloudSun } from 'lucide-react';
import DashboardLayout from '@/shared/components/templates/DashboardLayout';
import { dashboardService, DashboardSummary } from '../api/dashboard.service';
import { Link } from 'react-router-dom';

// ... (MANTÉN TUS FUNCIONES HELPERS: getCropIcon, getPredictionColor, etc.) ...
// Copia aquí las funciones getCropIcon, getPredictionColor, formatConfidence, getBarWidth que te di antes

export default function DashboardHome() {
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [geoError, setGeoError] = useState(false);

  useEffect(() => {
    // Función para llamar al servicio
    const fetchData = async (lat?: number, lon?: number) => {
      try {
        const result = await dashboardService.getSummary(lat, lon);
        setData(result);
      } catch (error) {
        console.error("Error cargando dashboard", error);
      } finally {
        setLoading(false);
      }
    };

    // LÓGICA DE GEOLOCALIZACIÓN
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Éxito: tenemos coordenadas
          fetchData(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.warn("Ubicación denegada o error:", error.message);
          setGeoError(true);
          fetchData(); // Cargar sin coordenadas (backend usará default)
        }
      );
    } else {
      fetchData(); // Navegador no soporta geo
    }
  }, []);

  if (loading) {
    return (
       // ... (MANTÉN TU LOADING SPINNER) ...
       <DashboardLayout>Loading...</DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-8 animate-fade-in-up flex flex-col md:flex-row justify-between md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Hola, <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 capitalize">{data?.usuario || 'Agricultor'}</span> 👋
          </h1>
          <p className="text-slate-400 mt-2">
            {data?.clima.temp !== null ? (
               <span className="flex items-center gap-2">
                 <MapPin size={14} className="text-emerald-400"/> {data?.clima.ubicacion}: {data?.clima.temp}°C, {data?.clima.descripcion}
               </span>
            ) : (
               "Resumen del estado de tus cultivos."
            )}
          </p>
        </div>
        {geoError && (
          <div className="text-xs text-amber-400 bg-amber-900/20 px-3 py-1 rounded border border-amber-500/30">
            ⚠ Ubicación desactivada. Clima no preciso.
          </div>
        )}
      </div>

      {/* GRID DE ESTADÍSTICAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        {/* ... (MANTÉN TUS CARDS DE LOTES AQUÍ IGUAL QUE ANTES) ... */}
        {/* Solo voy a modificar la CARD DE FASE LUNAR para que sea más PRO */}

        {/* Card Fase Lunar + Recomendación */}
        <div className="bg-gradient-to-br from-indigo-900/60 to-purple-900/60 border border-purple-500/30 p-6 rounded-2xl relative overflow-hidden group">
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div>
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-purple-300">
                        <Moon size={18} />
                        <span className="text-xs font-bold uppercase tracking-wider">Ciclo Lunar</span>
                    </div>
                    {data?.clima.temp && <CloudSun size={18} className="text-blue-300" />}
                </div>
                <div className="text-xl font-bold text-white capitalize leading-tight mb-2">
                {data?.lunar.fase}
                </div>
            </div>
            
            <div className="mt-2 text-xs text-indigo-100 bg-white/10 p-3 rounded-lg backdrop-blur-sm border border-white/10 leading-relaxed">
              <span className="font-bold text-emerald-300">Tip:</span> {data?.lunar.mensaje}
            </div>
          </div>
          
          {/* Decoración */}
          <div className="absolute -right-4 -bottom-4 text-purple-500/10 group-hover:text-purple-500/20 transition-colors">
            <Moon size={100} />
          </div>
        </div>

        {/* ... (LAS OTRAS CARDS DE ESTADÍSTICAS VAN AQUÍ) ... */}
        
      </div>

      {/* ... (MANTÉN LA SECCIÓN INFERIOR DE ACTIVIDAD RECIENTE Y MAPA IGUAL QUE ANTES) ... */}
      {/* Recuerda usar las funciones seguras getPredictionColor y comprobaciones ?. */}

    </DashboardLayout>
  );
}