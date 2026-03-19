import { ReactNode, useState } from 'react';
import Navbar from '../organisms/Navbar'; 
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Sprout, ScanLine, FileText, Settings, Leaf, Menu, X } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const location = useLocation();
  const { user } = useAuthStore();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // 1. Configuración eliminada de este array (Perfecto)
  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Resumen', path: '/dashboard' },
    { icon: <Sprout size={20} />, label: 'Mis Lotes', path: '/lotes' },
    { icon: <ScanLine size={20} />, label: 'Nueva Predicción', path: '/nueva-prediccion' },
    { icon: <FileText size={20} />, label: 'Noticias', path: '/noticias' },
  ];

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 font-sans overflow-hidden">
      
      {/* --- BARRA MÓVIL SUPERIOR (Aparece SOLO en móviles) --- */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900/80 border-b border-slate-800 backdrop-blur-md flex items-center justify-between px-4 z-40">
        <div className="flex items-center gap-2">
          <div className="bg-emerald-500/10 p-1.5 rounded-lg text-emerald-400">
            <Leaf size={20} />
          </div>
          <span className="font-bold text-base text-white">PlantDetector</span>
        </div>
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 text-slate-300 hover:text-white transition-colors"
          aria-label="Toggle mobile menu"
        >
          {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* --- OVERLAY MÓVIL (Fondo oscuro al abrir el menú en celular) --- */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* --- SIDEBAR (IZQUIERDA) --- */}
      {/* CORRECCIÓN: Clases de Tailwind arregladas para que en escritorio (md:) siempre se vea */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 border-r border-slate-800 bg-slate-900 flex flex-col
        transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0 md:bg-slate-900/50
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo Sidebar (Solo visible en PC, en móvil ya está en la barra superior) */}
        <div className="hidden md:flex h-16 items-center gap-2 px-6 border-b border-slate-800">
          <div className="bg-emerald-500/10 p-1.5 rounded-lg text-emerald-400">
            <Leaf size={24} />
          </div>
          <span className="font-bold text-lg text-white">PlantDetector</span>
        </div>

        {/* Espaciador para móvil para que el menú no se pegue arriba */}
        <div className="md:hidden h-4" />

        {/* Menú */}
        <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                  isActive 
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {item.icon}
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* 2. Botón de Configuración en el Perfil (Excelente) */}
        <div className="p-4 border-t border-slate-800">
          <Link 
            to="/configuracion"
            onClick={() => setIsMobileOpen(false)}
            className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 cursor-pointer transition-all group"
          >
            <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold text-white uppercase shrink-0">
              {user?.name ? user.name.charAt(0) : 'U'}
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-xs font-bold text-white truncate group-hover:text-purple-300 transition-colors">
                {user?.name || 'Usuario'}
              </p>
              <p className="text-[10px] text-slate-400 truncate">Plan Free</p>
            </div>
            <Settings size={16} className="text-slate-400 group-hover:text-white transition-colors shrink-0" />
          </Link>
        </div>
      </aside>

      {/* --- CONTENIDO PRINCIPAL (DERECHA) --- */}
      <div className="flex-1 flex flex-col min-w-0 md:mt-0 mt-16">
        
        {/* Navbar con el selector de fincas */}
        <Navbar />

        {/* Área de Scroll */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 relative scroll-smooth">
           <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-900/20 via-slate-950 to-slate-950 -z-10 pointer-events-none"></div>
           
           <div className="max-w-7xl mx-auto">
             {children}
           </div>
        </main>
      </div>

    </div>
  );
}