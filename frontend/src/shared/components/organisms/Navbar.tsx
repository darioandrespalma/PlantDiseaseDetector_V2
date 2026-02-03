// frontend/src/shared/components/organisms/Navbar.tsx
import { useEffect } from 'react';
import { useFarmStore } from '@/features/farms/farm.store';
import { MapPin, ChevronDown, PlusCircle, Bell, User } from 'lucide-react';

export default function Navbar() {
  const { farms, currentFarm, setCurrentFarm, fetchFarms } = useFarmStore();

  useEffect(() => {
    fetchFarms();
  }, []);

  return (
    // Se quita el 'justify-between' para que el selector quede a la izquierda
    <nav className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl px-6 flex items-center sticky top-0 z-50">
      
      {/* ❌ SE ELIMINÓ EL BLOQUE DEL LOGO AQUÍ ❌ */}

      {/* --- FARM SWITCHER (SELECTOR DE FINCAS) --- */}
      {/* Se quita el margen izquierdo 'mx-6' y se pone 'mr-auto' para empujarlo a la izquierda */}
      <div className="max-w-xs mr-auto"> 
        {farms.length > 0 ? (
          <div className="relative group">
            <div className="flex items-center gap-3 bg-slate-800/50 border border-slate-700 hover:border-emerald-500/50 rounded-xl px-3 py-1.5 transition-all cursor-pointer">
              <div className="p-1.5 bg-emerald-500/10 rounded-lg text-emerald-400">
                <MapPin size={16} />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Finca Activa</p>
                <div className="text-sm font-semibold text-white flex items-center justify-between gap-2">
                  <span className="truncate">{currentFarm?.nombre || 'Seleccionar...'}</span>
                  <ChevronDown size={14} className="text-slate-500" />
                </div>
              </div>

              <select 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                value={currentFarm?._id || ''}
                onChange={(e) => setCurrentFarm(e.target.value)}
              >
                {farms.map(farm => (
                  <option key={farm._id} value={farm._id}>
                    {farm.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ) : (
          <div className="text-xs text-slate-400 flex items-center gap-2 bg-slate-800/30 px-3 py-2 rounded-lg border border-dashed border-slate-700 animate-pulse">
            <PlusCircle size={14} />
            <span>Configuración pendiente</span>
          </div>
        )}
      </div>

      {/* RIGHT ACTIONS (Se mantienen a la derecha) */}
      <div className="flex items-center gap-4">
        <button className="text-slate-400 hover:text-white transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>
        <div className="h-8 w-8 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700 text-slate-400">
          <User size={16} />
        </div>
      </div>
    </nav>
  );
}