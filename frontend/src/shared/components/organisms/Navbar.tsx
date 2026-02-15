// frontend/src/shared/components/organisms/Navbar.tsx
import { useEffect } from 'react';
import { useFarmStore } from '@/features/farms/store/farm.store';
// 1. Importamos el hook de autenticación (Ajusta la ruta si es diferente)
import { useAuthStore } from '@/store/auth.store'; 
import { MapPin, ChevronDown, PlusCircle, Bell, User, LogOut } from 'lucide-react';

export default function Navbar() {
  const { farms, currentFarm, setCurrentFarm, fetchFarms } = useFarmStore();
  // 2. Obtenemos la función de logout del store (o limpiamos manualmente si no existe)
  const logout = useAuthStore((state: any) => state.logout); 

  useEffect(() => {
    // Protección: Solo cargar granjas si hay token (evita el error 401 si recargas)
    const token = localStorage.getItem('token');
    if (token) {
        fetchFarms();
    }
  }, []);

  // 3. Función para manejar el cierre de sesión
  const handleLogout = () => {
    // A) Si tienes método en el store:
    if (logout) logout();
    
    // B) Limpieza manual de seguridad (Respaldo):
    localStorage.removeItem('token');
    localStorage.removeItem('user'); // Si guardas datos de usuario
    
    // C) Redirección forzada para limpiar estado de memoria
    window.location.href = '/login';
  };

  return (
    <nav className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl px-6 flex items-center sticky top-0 z-50">
      
      {/* --- FARM SWITCHER (IZQUIERDA) --- */}
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

      {/* --- RIGHT ACTIONS (DERECHA) --- */}
      <div className="flex items-center gap-3">
        {/* Notificaciones */}
        <button className="text-slate-400 hover:text-white transition-colors relative p-2">
          <Bell size={20} />
          <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>
        
        {/* Separador vertical visual */}
        <div className="h-6 w-px bg-slate-800 mx-1"></div>

        {/* Perfil (Solo visual por ahora) */}
        <div className="h-8 w-8 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700 text-slate-400 cursor-default">
          <User size={16} />
        </div>

        {/* --- BOTÓN DE SALIR (NUEVO) --- */}
        <button 
            onClick={handleLogout}
            title="Cerrar Sesión"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all border border-transparent hover:border-red-500/20 group"
        >
            <span className="text-sm font-medium hidden sm:block group-hover:text-red-400">Salir</span>
            <LogOut size={18} />
        </button>
      </div>
    </nav>
  );
}