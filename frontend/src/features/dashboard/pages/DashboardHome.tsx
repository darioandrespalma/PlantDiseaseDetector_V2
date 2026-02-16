import { useEffect, useState } from 'react';
import { useFarmStore } from '@/features/farms/farm.store'; // Importado desde features/farms
import { dashboardService, DashboardSummary } from '../api/dashboard.service';
import DashboardLayout from '@/shared/components/templates/DashboardLayout';
import { Link } from 'react-router-dom';
import { 
  Activity, AlertTriangle, CheckCircle2, Moon, Sprout, 
  ArrowRight, Flower2, Coffee, Map, Plus, 
  CalendarClock, CheckSquare, AlertCircle, MapPin 
} from 'lucide-react';

// --- HELPERS VISUALES ---
const getCropIcon = (crop: string) => {
  const name = (crop || '').toLowerCase();
  if (name.includes('banana')) return <Flower2 className="text-yellow-500" size={32} />;
  if (name.includes('coffe') || name.includes('café')) return <Coffee className="text-orange-700" size={32} />;
  return <Sprout className="text-emerald-500" size={32} />;
};

const getPredictionColor = (pred?: string) => {
  if (!pred) return 'text-slate-400';
  const safePred = pred.toLowerCase();
  if (safePred.includes('healthy') || safePred.includes('saludable')) return 'text-emerald-400';
  return 'text-red-400';
};

const formatConfidence = (val?: number) => {
  if (val === undefined || val === null || isNaN(val)) return "0%";
  return `${(val * 100).toFixed(1)}%`;
};

// --- COMPONENTE PRINCIPAL ---
export default function DashboardHome() {
  const { currentFarm, createFarm } = useFarmStore();
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Estado para el formulario de nueva finca
  const [isCreating, setIsCreating] = useState(false);
  const [newFarmName, setNewFarmName] = useState('');
  
  // Estado de Ubicación (Default: Quito) + Estado de carga del GPS
  const [newFarmLoc, setNewFarmLoc] = useState({ lat: -0.1807, lon: -78.4678 });
  const [locating, setLocating] = useState(false);

  // 1. CARGA DE DATOS
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const result = await dashboardService.getSummary(currentFarm?._id);
        setData(result);
        
        // Si no hay fincas, activar modo creación y buscar GPS automáticamente
        if (result && result.mode === 'setup_required') {
          setIsCreating(true);
          getUserLocation(); // 🚀 Auto-detectar ubicación al abrir onboarding
        }
      } catch (error) {
        console.error("Error cargando dashboard", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [currentFarm]);

  // 2. FUNCIÓN OBTENER GPS (Navegador)
  const getUserLocation = () => {
    if (!navigator.geolocation) return;
    
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setNewFarmLoc({
          lat: position.coords.latitude,
          lon: position.coords.longitude
        });
        setLocating(false);
      },
      (error) => {
        console.warn("No se pudo obtener ubicación:", error.message);
        setLocating(false);
      }
    );
  };

  // 3. CREACIÓN DE FINCA
  const handleCreateFarm = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const success = await createFarm({
      nombre: newFarmName,
      ubicacion: newFarmLoc,
      areaTotal: 10 // Valor inicial temporal
    });
    if (success) {
      setIsCreating(false);
      // El store actualiza currentFarm automáticamente
    } else {
      setLoading(false);
    }
  };

  // --- VISTA DE CARGA ---
  if (loading && !data) {
    return (
      <DashboardLayout>
        <div className="flex h-full items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  // --- VISTA ONBOARDING (CREAR PRIMERA FINCA) ---
  if (isCreating || data?.mode === 'setup_required') {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto mt-10 animate-fade-in-up">
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-8 text-center shadow-2xl">
            <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-400 border border-emerald-500/20">
              <Map size={40} />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Bienvenido a AgriManager</h2>
            <p className="text-slate-400 mb-8 max-w-md mx-auto">
              Para comenzar a usar la inteligencia artificial y el monitoreo, necesitamos registrar tu primera unidad productiva.
            </p>

            <form onSubmit={handleCreateFarm} className="space-y-5 max-w-md mx-auto text-left">
              {/* Input Nombre */}
              <div>
                <label className="text-sm font-medium text-slate-300 block mb-1.5">Nombre de la Finca</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ej: Hacienda Santa Clara"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-600"
                  value={newFarmName}
                  onChange={e => setNewFarmName(e.target.value)}
                />
              </div>
              
              {/* Inputs Coordenadas */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="text-sm font-medium text-slate-300 block mb-1.5">Latitud</label>
                   <input type="number" step="any" className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none" 
                     value={newFarmLoc.lat} onChange={e => setNewFarmLoc({...newFarmLoc, lat: Number(e.target.value)})} />
                </div>
                <div>
                   <label className="text-sm font-medium text-slate-300 block mb-1.5">Longitud</label>
                   <input type="number" step="any" className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none" 
                     value={newFarmLoc.lon} onChange={e => setNewFarmLoc({...newFarmLoc, lon: Number(e.target.value)})} />
                </div>
              </div>

              {/* Botón GPS */}
              <div className="text-right">
                <button 
                  type="button" 
                  onClick={getUserLocation}
                  disabled={locating}
                  className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 ml-auto transition-colors"
                >
                  {locating ? (
                    <span className="animate-pulse">Detectando ubicación...</span>
                  ) : (
                    <>
                      <MapPin size={12} /> Usar mi ubicación actual
                    </>
                  )}
                </button>
              </div>
              
              {/* Botón Submit */}
              <div className="pt-2">
                <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20">
                  <Plus size={20} /> Registrar Finca y Comenzar
                </button>
              </div>
            </form>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // --- VISTA DASHBOARD NORMAL ---
  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8 animate-fade-in-up flex flex-col md:flex-row justify-between md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Hola, <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 capitalize">{data?.usuario}</span> 👋
          </h1>
          <p className="text-slate-400 mt-2 flex items-center gap-2">
             <Map size={16} className="text-emerald-400" />
             {data?.clima.ubicacion}: {data?.clima.temp !== null ? `${data?.clima.temp}°C, ${data?.clima.descripcion}` : 'Sin datos climáticos'}
          </p>
        </div>
      </div>

      {/* GRID DE ESTADÍSTICAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          icon={<Sprout size={24} />} 
          title="Lotes registrados" 
          value={data?.estadisticas.totalLotes || 0} 
          color="blue" 
          status="Activos" 
        />
        <StatCard 
          icon={<CheckCircle2 size={24} />} 
          title="Cultivos saludables" 
          value={data?.estadisticas.lotesSanos || 0} 
          color="emerald" 
        />
        <StatCard 
          icon={<AlertTriangle size={24} />} 
          title="Requieren revisión" 
          value={data?.estadisticas.lotesAlerta || 0} 
          color="red" 
          pulse={!!data?.estadisticas.lotesAlerta}
          badge={data?.estadisticas.lotesAlerta ? "Atención" : null}
        />

        {/* Fase Lunar */}
        <div className="bg-gradient-to-br from-indigo-900/60 to-purple-900/60 border border-purple-500/30 p-6 rounded-2xl relative overflow-hidden group">
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div>
                <div className="flex items-center gap-2 text-purple-300 mb-2">
                    <Moon size={18} />
                    <span className="text-xs font-bold uppercase tracking-wider">Ciclo Lunar</span>
                </div>
                <div className="text-xl font-bold text-white capitalize leading-tight mb-2">
                {data?.lunar.fase}
                </div>
            </div>
            <div className="mt-2 text-xs text-indigo-100 bg-white/10 p-3 rounded-lg backdrop-blur-sm border border-white/10 leading-relaxed">
              <span className="font-bold text-emerald-300">Tip:</span> {data?.lunar.mensaje}
            </div>
          </div>
          <div className="absolute -right-4 -bottom-4 text-purple-500/10 group-hover:text-purple-500/20 transition-colors">
            <Moon size={100} />
          </div>
        </div>
      </div>

      {/* SECCIÓN INFERIOR: Grid de 3 Columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* COLUMNA 1: Actividad Reciente */}
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Activity size={18} className="text-purple-400" />
              Último Análisis
            </h3>
            <Link to="/historial" className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1">
              Ver todo <ArrowRight size={14} />
            </Link>
          </div>

          {data?.actividadReciente ? (
            <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700 flex items-center gap-4">
              <div className="h-14 w-14 bg-slate-800 rounded-lg flex items-center justify-center border border-slate-700">
                {getCropIcon(data.actividadReciente.crop)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between mb-1">
                  <h4 className="font-bold text-white capitalize truncate">{data.actividadReciente.crop}</h4>
                  <span className="text-xs text-slate-500 shrink-0">
                    {new Date(data.actividadReciente.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm mb-1">
                  <span className={`font-medium ${getPredictionColor(data.actividadReciente.prediction)}`}>
                    {data.actividadReciente.prediction || 'Pendiente'}
                  </span>
                </div>
                <div className="text-xs text-slate-500">
                  Confianza: {formatConfidence(data.actividadReciente.confidence)}
                </div>
              </div>
            </div>
          ) : (
             <div className="text-center py-8 text-slate-500 border border-dashed border-slate-700 rounded-xl">
               <p className="text-sm">Sin análisis recientes</p>
               <Link to="/nueva-prediccion" className="text-xs text-emerald-400 mt-2 block">Realizar análisis</Link>
             </div>
          )}
        </div>

        {/* COLUMNA 2: AGENDA DEL DÍA */}
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <CalendarClock size={18} className="text-blue-400" />
              Agenda Hoy
            </h3>
            <Link to="/calendario" className="text-xs bg-slate-700 px-2 py-1 rounded text-slate-300">Calendario</Link>
          </div>

          <div className="flex-1 flex flex-col gap-3">
             {/* Alerta Atrasos */}
             {data?.agenda?.totalAtrasadas ? (
               <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-center gap-3 animate-pulse">
                 <AlertCircle className="text-red-400 shrink-0" size={18} />
                 <div>
                   <p className="text-xs font-bold text-red-300">¡Atención!</p>
                   <p className="text-[10px] text-red-200/70">{data.agenda.totalAtrasadas} tareas atrasadas.</p>
                 </div>
               </div>
             ) : null}

             {data?.agenda?.tareasHoy && data.agenda.tareasHoy.length > 0 ? (
                data.agenda.tareasHoy.map((task) => (
                  <div key={task._id} className="bg-slate-900/50 p-2.5 rounded-lg border border-slate-700/50 flex items-center gap-3">
                    <div className={`p-1.5 rounded-full ${task.prioridad === 'alta' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
                      <CheckSquare size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-200 truncate">{task.titulo}</p>
                      <span className="text-[10px] text-slate-500 capitalize">{task.tipo}</span>
                    </div>
                  </div>
                ))
             ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
                  <CheckSquare size={24} className="mb-2 opacity-20" />
                  <p className="text-xs">Todo al día</p>
                </div>
             )}
          </div>
        </div>

        {/* COLUMNA 3: Mapa */}
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6 flex flex-col">
           <h3 className="text-lg font-bold text-white mb-4">Mapa de Calor</h3>
           <div className="flex-1 bg-slate-900 rounded-xl border border-slate-700 relative overflow-hidden group min-h-[150px]">
             <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/World_map_blank_without_borders.svg/1000px-World_map_blank_without_borders.svg.png')] bg-cover bg-center opacity-20 group-hover:opacity-30 transition-all"></div>
             <div className="absolute inset-0 flex items-center justify-center">
                <button className="px-4 py-2 bg-slate-800/80 backdrop-blur text-white text-sm rounded-lg border border-slate-600 hover:bg-slate-700 transition-colors">
                  Ver Lotes
                </button>
             </div>
           </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

// Subcomponente StatCard
function StatCard({ icon, title, value, color, status, badge, pulse }: any) {
  const colorMap: any = {
    blue: "bg-blue-500/10 text-blue-400",
    emerald: "bg-emerald-500/10 text-emerald-400",
    red: "bg-red-500/10 text-red-400",
  };

  return (
    <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 p-6 rounded-2xl">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-lg ${colorMap[color]} ${pulse ? 'animate-pulse' : ''}`}>
          {icon}
        </div>
        {status && <span className="text-xs font-medium bg-slate-700 text-slate-300 px-2 py-1 rounded-full">{status}</span>}
        {badge && <span className="text-xs font-medium bg-red-500/20 text-red-300 px-2 py-1 rounded-full border border-red-500/20">{badge}</span>}
      </div>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm text-slate-400">{title}</div>
    </div>
  );
}