import { ReactNode } from 'react';
import Navbar from '../organisms/Navbar'; // <--- IMPORTAMOS EL NAVBAR AQUÍ
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Sprout, ScanLine, FileText, Settings, Leaf } from 'lucide-react';

// Si ya tienes tu propio componente Sidebar separado, úsalo. 
// Si tenías el código del Sidebar "hardcodeado" aquí, asegúrate de no borrarlo.
// Aquí te presento la estructura ideal:

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const location = useLocation();

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Resumen', path: '/dashboard' },
    { icon: <Sprout size={20} />, label: 'Mis Lotes', path: '/lotes' },
    { icon: <ScanLine size={20} />, label: 'Nueva Predicción', path: '/nueva-prediccion' },
    { icon: <FileText size={20} />, label: 'Noticias', path: '/noticias' },
    { icon: <Settings size={20} />, label: 'Configuración', path: '/configuracion' },
  ];

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 font-sans overflow-hidden">
      
      {/* --- SIDEBAR (IZQUIERDA) --- */}
      <aside className="w-64 border-r border-slate-800 bg-slate-900/50 hidden md:flex flex-col">
        {/* Logo Sidebar */}
        <div className="h-16 flex items-center gap-2 px-6 border-b border-slate-800">
          <div className="bg-emerald-500/10 p-1.5 rounded-lg text-emerald-400">
            <Leaf size={24} />
          </div>
          <span className="font-bold text-lg text-white">PlantDetector</span>
        </div>

        {/* Menú */}
        <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
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

        {/* Footer Sidebar */}
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-800/50">
            <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold text-white">
              D
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">Dario</p>
              <p className="text-[10px] text-slate-400 truncate">Plan Free</p>
            </div>
          </div>
        </div>
      </aside>

      {/* --- CONTENIDO PRINCIPAL (DERECHA) --- */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* 🚀 AQUÍ ESTÁ EL NAVBAR CON EL SELECTOR DE FINCAS 🚀 */}
        <Navbar />

        {/* Área de Scroll */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 relative scroll-smooth">
           {/* Fondo decorativo opcional */}
           <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-900/20 via-slate-950 to-slate-950 -z-10 pointer-events-none"></div>
           
           {/* El contenido de las páginas (DashboardHome, etc) */}
           <div className="max-w-7xl mx-auto">
             {children}
           </div>
        </main>
      </div>

    </div>
  );
}