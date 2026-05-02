// frontend/src/shared/components/organisms/Navbar.tsx
import { useEffect } from 'react';
import { useFarmStore } from '@/features/farms/store/farm.store';
// 1. IMPORTAR AUTH STORE
import { useAuthStore } from '@/store/auth.store'; 
// 2. AGREGAR ICONO LogOut
import { MapPin, ChevronDown, PlusCircle, Bell, User, LogOut } from 'lucide-react';

export default function Navbar() {
  const { farms, currentFarm, setCurrentFarm, fetchFarms } = useFarmStore();
  // 3. OBTENER FUNCIÓN LOGOUT
  const logout = useAuthStore((state: any) => state.logout); 

  useEffect(() => {
    fetchFarms();
  }, []);

  // 4. FUNCIÓN PARA SALIR
  const handleLogout = () => {
    if (logout) logout();
    localStorage.clear(); // Limpia todo el storage por seguridad
    window.location.href = '/login';
  };

  return (
    <nav className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl px-3 sm:px-6 flex items-center sticky top-0 z-50 w-full overflow-hidden">
      
      {/* SECCIÓN IZQUIERDA (INTACTA) */}
      <div className="max-w-xs mr-auto"> 
        {farms.length > 0 ? (
          <div className="relative group">
            <div className="flex items-center gap-3 bg-slate-800/50 border border-slate-700 hover:border-emerald-500/50 rounded-xl px-3 py-1.5 transition-all cursor-pointer">
              <div className="p-1.5 bg-emerald-500/10 rounded-lg text-emerald-400">
                <MapPin size={16} />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold hidden sm:block">Finca Activa</p>
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

      {/* SECCIÓN DERECHA (CON EL BOTÓN NUEVO) */}
      <div className="flex items-center gap-2 sm:gap-4">
        <button className="text-slate-400 hover:text-white transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>
        
        <div className="hidden sm:flex h-8 w-8 bg-slate-800 rounded-full items-center justify-center border border-slate-700 text-slate-400">
          <User size={16} />
        </div>

        {/* --- 5. AQUÍ ESTÁ EL BOTÓN DE SALIR --- */}
        <button 
            onClick={handleLogout}
            title="Cerrar Sesión"
            className="text-slate-400 hover:text-red-400 hover:bg-red-500/10 p-2 rounded-lg transition-all"
        >
            <LogOut size={20} />
        </button>
      </div>
    </nav>
  );
}