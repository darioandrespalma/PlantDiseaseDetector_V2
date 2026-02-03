import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Sprout, ScanEye, LogOut, Settings, Leaf, Scale3D } from 'lucide-react';
import { useAuthStore } from '@/shared/store/auth.store';
import GridPattern from '../ui/GridPattern';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { logout, user } = useAuthStore();
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Resumen', path: '/dashboard' },
    { icon: Sprout, label: 'Mis Lotes', path: '/dashboard/lotes' },
    { icon: ScanEye, label: 'Nueva Predicción', path: '/dashboard/predict' },
    
    { icon: Scale3D, label: 'Noticias', path: 'dashboard/news' },
    { icon: Settings, label: 'Configuración', path: '/dashboard/settings' },
  ];

  return (
    <div className="flex h-screen bg-slate-900 font-sans text-slate-300 overflow-hidden selection:bg-purple-500 selection:text-white">
      
      {/* FONDO GLOBAL FIJO */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-slate-900" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="opacity-20 mix-blend-overlay">
            <GridPattern />
        </div>
      </div>

      {/* SIDEBAR (Barra Lateral) */}
      <aside className="w-64 bg-slate-900/80 backdrop-blur-xl border-r border-slate-800 flex flex-col hidden md:flex z-20">
        {/* Logo Area */}
        <div className="h-20 flex items-center px-6 border-b border-slate-800">
          <div className="flex items-center gap-2 text-white font-bold text-lg">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Leaf size={18} className="text-slate-900" />
            </div>
            PlantDetector
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-3 space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25' 
                    : 'hover:bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <item.icon size={20} className={isActive ? 'text-white' : 'text-slate-500 group-hover:text-purple-400'} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Footer */}
        <div className="p-4 border-t border-slate-800">
          <div className="bg-slate-800/50 rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white border border-slate-600">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="text-sm">
                <p className="text-white font-medium truncate w-24">{user?.name}</p>
                <p className="text-xs text-slate-500">Plan Free</p>
              </div>
            </div>
            <button onClick={logout} className="text-slate-400 hover:text-red-400 transition-colors">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 flex flex-col overflow-hidden relative z-10">
        
        {/* Topbar Mobile (Solo visible en móviles) */}
        <header className="h-16 bg-slate-900/80 backdrop-blur border-b border-slate-800 md:hidden flex items-center px-4 justify-between">
           <span className="font-bold text-white">PlantDetector</span>
           <button onClick={logout}><LogOut size={20} /></button>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          <div className="max-w-6xl mx-auto">
             {children}
          </div>
        </div>
      </main>
    </div>
  );
}