import { useEffect, useState } from 'react';
import { Activity, AlertTriangle, CheckCircle2, Moon, Sprout, ArrowRight } from 'lucide-react';
import DashboardLayout from '@/shared/components/templates/DashboardLayout';
import { dashboardService, DashboardSummary } from '../api/dashboard.service';

export default function DashboardHome() {
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const result = await dashboardService.getSummary();
        setData(result);
      } catch (error) {
        console.error("Error cargando dashboard", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-full items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Header de Bienvenida */}
      <div className="mb-8 animate-fade-in-up">
        <h1 className="text-3xl font-bold text-white">
          Hola, <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">{data?.usuario}</span> 👋
        </h1>
        <p className="text-slate-400 mt-2">Aquí tienes el resumen del estado de tus cultivos hoy.</p>
      </div>

      {/* GRID DE ESTADÍSTICAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        {/* Card 1: Total Lotes */}
        <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 p-6 rounded-2xl hover:bg-slate-800/60 transition-colors group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400 group-hover:bg-blue-500/20 transition-colors">
              <Sprout size={24} />
            </div>
            <span className="text-xs font-medium bg-slate-700 text-slate-300 px-2 py-1 rounded-full">Activos</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{data?.estadisticas.totalLotes}</div>
          <div className="text-sm text-slate-400">Lotes registrados</div>
        </div>

        {/* Card 2: Lotes Sanos */}
        <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 p-6 rounded-2xl hover:bg-slate-800/60 transition-colors group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-400 group-hover:bg-emerald-500/20 transition-colors">
              <CheckCircle2 size={24} />
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{data?.estadisticas.lotesSanos}</div>
          <div className="text-sm text-slate-400">Cultivos saludables</div>
        </div>

        {/* Card 3: Lotes en Riesgo */}
        <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 p-6 rounded-2xl hover:bg-slate-800/60 transition-colors group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-red-500/10 rounded-lg text-red-400 group-hover:bg-red-500/20 transition-colors animate-pulse">
              <AlertTriangle size={24} />
            </div>
            {data?.estadisticas.lotesAlerta ? (
               <span className="text-xs font-medium bg-red-500/20 text-red-300 px-2 py-1 rounded-full border border-red-500/20">Atención</span>
            ) : null}
          </div>
          <div className="text-3xl font-bold text-white mb-1">{data?.estadisticas.lotesAlerta}</div>
          <div className="text-sm text-slate-400">Requieren revisión</div>
        </div>

        {/* Card 4: Fase Lunar */}
        <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-purple-500/20 p-6 rounded-2xl relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3 text-purple-300">
              <Moon size={20} />
              <span className="text-sm font-bold uppercase tracking-wider">Fase Lunar</span>
            </div>
            <div className="text-xl font-bold text-white capitalize">{data?.lunar.fase}</div>
            <div className="text-xs text-purple-200/70 mt-1">{data?.lunar.mensaje}</div>
          </div>
          {/* Decoración de fondo */}
          <div className="absolute -right-4 -bottom-4 text-purple-500/10">
            <Moon size={100} />
          </div>
        </div>
      </div>

      {/* SECCIÓN INFERIOR: Actividad Reciente + Mapa (Placeholder) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Actividad Reciente */}
        <div className="lg:col-span-2 bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Activity size={18} className="text-purple-400" />
              Último Análisis IA
            </h3>
            <button className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors">
              Ver historial <ArrowRight size={14} />
            </button>
          </div>

          {data?.actividadReciente ? (
            <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700 flex items-center gap-4">
              {/* Icono del cultivo (Placeholder) */}
              <div className="h-16 w-16 bg-slate-800 rounded-lg flex items-center justify-center border border-slate-700">
                 <Sprout className="text-emerald-500" size={32} />
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <h4 className="font-bold text-white capitalize">{data.actividadReciente.crop}</h4>
                  <span className="text-xs text-slate-500">
                    {new Date(data.actividadReciente.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-slate-400">Diagnóstico:</span>
                  <span className={`font-medium ${data.actividadReciente.prediction === 'Healthy' ? 'text-emerald-400' : 'text-red-400'}`}>
                    {data.actividadReciente.prediction}
                  </span>
                </div>
                <div className="mt-2 w-full bg-slate-700 rounded-full h-1.5">
                  <div 
                    className="bg-purple-500 h-1.5 rounded-full" 
                    style={{ width: `${(data.actividadReciente.confidence * 100).toFixed(0)}%` }}
                  ></div>
                </div>
                <div className="text-xs text-right text-slate-500 mt-1">
                  Confianza: {(data.actividadReciente.confidence * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-10 text-slate-500">
              <p>No hay análisis recientes.</p>
              <button className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm transition-colors">
                Realizar primer análisis
              </button>
            </div>
          )}
        </div>

        {/* Mapa (Placeholder Visual) */}
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6 flex flex-col">
           <h3 className="text-lg font-bold text-white mb-4">Mapa de Calor</h3>
           <div className="flex-1 bg-slate-900 rounded-xl border border-slate-700 relative overflow-hidden group">
              {/* Simulación de mapa */}
              <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/-78.5, -0.2, 10, 0, 0/400x300')] bg-cover bg-center opacity-50 grayscale group-hover:grayscale-0 transition-all duration-500"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                 <button className="px-4 py-2 bg-slate-800/80 backdrop-blur text-white text-sm rounded-lg border border-slate-600 hover:bg-slate-700 transition-colors">
                    Explorar Mapa Completo
                 </button>
              </div>
           </div>
        </div>

      </div>
    </DashboardLayout>
  );
}