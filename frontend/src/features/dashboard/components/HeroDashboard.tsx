// frontend/src/features/dashboard/components/HeroDashboard.tsx

import { useEffect, useState } from 'react';

// Tip: Para producción, usa una imagen real de tu app.
// Por ahora, usamos una imagen de placeholder de alta calidad de una hoja.
const PLANT_IMAGE_URL = "https://images.unsplash.com/photo-1599595493657-57685c437432?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3";

export default function HeroDashboard() {
  // Estado para simular la carga y el análisis
  const [analyzing, setAnalyzing] = useState(true);

  // Simulación del proceso de análisis
  useEffect(() => {
    const timer = setTimeout(() => setAnalyzing(false), 3500); // 3.5 segundos de "análisis"
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative group perspective-1000">
      {/* 1. Efecto de Resplandor Ambiental (Glow) detrás de la imagen */}
      <div className="absolute -inset-2 bg-gradient-to-r from-purple-600/30 via-cyan-500/30 to-emerald-500/30 rounded-3xl blur-2xl opacity-40 group-hover:opacity-60 transition duration-1000 group-hover:duration-200 animate-pulse-slow" />
      
      {/* 2. El Marco de la Ventana (Glassmorphism Avanzado) */}
      {/* Añadimos una ligera rotación 3D para dar profundidad */}
      <div className="relative rounded-2xl bg-slate-900/80 border border-slate-700/50 shadow-[0_20px_50px_rgba(8,_112,_184,_0.1)] overflow-hidden ring-1 ring-white/10 backdrop-blur-xl transform transition-transform duration-500 group-hover:scale-[1.01] group-hover:rotate-x-1">
        
        {/* Barra de Título (Estilo Mac OS Dark) */}
        <div className="h-9 bg-slate-800/80 border-b border-slate-700/80 flex items-center px-4 justify-between backdrop-blur-md">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80 shadow-sm" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80 shadow-sm" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80 shadow-sm" />
          </div>
          <div className="text-xs text-slate-400 font-medium flex items-center">
             <svg className="w-4 h-4 mr-2 text-purple-400" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2"/><path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2"/><path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2"/></svg>
             PlantDetector AI - Dashboard
          </div>
          <div className="w-4" /> {/* Espaciador para centrar el texto */}
        </div>

        {/* Contenido Principal del Dashboard */}
        <div className="relative bg-slate-950/50 aspect-[16/10] p-5 flex flex-col lg:grid lg:grid-cols-12 gap-5">
            
            {/* Sidebar (Navegación Simulada) */}
            <div className="hidden lg:flex lg:col-span-3 bg-slate-900/60 rounded-xl border border-slate-800/80 p-4 flex flex-col gap-4 backdrop-blur-sm">
                <div className="h-10 w-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg mb-4 shadow-lg shadow-purple-500/20 flex items-center justify-center text-white font-bold">P</div>
                
                {/* Ítems de Menú Activos/Inactivos */}
                <div className="h-8 w-full bg-slate-800 rounded-lg border border-purple-500/30 flex items-center px-3 gap-3 relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-500" />
                    <div className="h-2 w-2 rounded-full bg-purple-400 animate-pulse" />
                    <div className="h-2 w-20 bg-purple-100/20 rounded-full" />
                </div>
                <div className="h-8 w-full rounded-lg flex items-center px-3 gap-3 opacity-50">
                    <div className="h-2 w-2 rounded-full bg-slate-600" />
                    <div className="h-2 w-16 bg-slate-700 rounded-full" />
                </div>
                <div className="h-8 w-full rounded-lg flex items-center px-3 gap-3 opacity-50">
                    <div className="h-2 w-2 rounded-full bg-slate-600" />
                    <div className="h-2 w-24 bg-slate-700 rounded-full" />
                </div>
                
                <div className="mt-auto p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                    <div className="text-[10px] text-slate-400 mb-1">Estado del Sistema</div>
                    <div className="flex items-center gap-2 text-xs text-emerald-400">
                        <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span></span>
                        Online - v2.1.0
                    </div>
                </div>
            </div>

            {/* Área Principal */}
            <div className="flex-1 lg:col-span-9 flex flex-col gap-5">
                
                {/* Header Area (Buscador y Perfil) */}
                <div className="h-14 w-full bg-slate-900/60 rounded-xl border border-slate-800/80 flex items-center px-5 justify-between backdrop-blur-sm">
                    <div className="flex items-center gap-3 bg-slate-800/50 py-2 px-3 rounded-lg border border-slate-700/30 w-full sm:w-64">
                        <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        <div className="h-2 w-32 bg-slate-700/50 rounded-full" />
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative"><div className="h-2 w-2 bg-red-500 rounded-full absolute top-0 right-0 ring-2 ring-slate-900" /><svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg></div>
                        <div className="h-9 w-9 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 shadow-sm border-2 border-slate-800" />
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-5 h-full">
                    
                    {/* === TARJETA PRINCIPAL: VISUALIZACIÓN DE IA === */}
                    <div className="flex-1 lg:flex-[3] bg-slate-900/80 rounded-xl border border-slate-800/80 relative overflow-hidden group-hover:border-purple-500/30 transition-all duration-500 shadow-inner">
                        
                        {/* Imagen de Fondo (Planta) */}
                        <img src={PLANT_IMAGE_URL} alt="Análisis de Hoja" className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay grayscale-[30%] group-hover:grayscale-0 transition-all duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-slate-900/20" />

                        {/* CAPA DE ANÁLISIS IA */}
                        <div className="absolute inset-0 z-10 p-6 flex flex-col justify-between">
                            
                            {/* Header del Análisis */}
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-white font-bold text-lg flex items-center gap-2">
                                        Análisis en Tiempo Real
                                        {analyzing && <span className="flex h-2 w-2 relative"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span></span>}
                                    </h3>
                                    <p className="text-slate-400 text-sm">ID Muestra: #AF-2024-X9Y</p>
                                </div>
                                <div className="px-3 py-1 rounded-full bg-slate-950/70 border border-slate-700 backdrop-blur text-xs font-mono text-cyan-300 flex items-center gap-2">
                                    <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
                                    Procesando Nube...
                                </div>
                            </div>

                            {/* ELEMENTOS VISUALES DEL ESCÁNER */}
                            <div className="absolute inset-0 pointer-events-none">
                                {/* Línea de Escaneo Láser */}
                                <div className={`absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-purple-500 to-transparent z-20 ${analyzing ? 'animate-scan-down' : 'opacity-0'}`} style={{top: '30%'}} />
                                
                                {/* Bounding Box (Cuadro de Detección) */}
                                <div className={`absolute border-2 border-dashed border-purple-400/70 rounded-lg z-10 transition-all duration-700 ${analyzing ? 'opacity-0 scale-90' : 'opacity-100 scale-100'}`} style={{ top: '20%', left: '20%', width: '60%', height: '40%' }}>
                                    {/* Puntos de interés */}
                                    <div className="absolute top-0 left-0 -mt-1 -ml-1 w-2 h-2 bg-purple-500" /><div className="absolute top-0 right-0 -mt-1 -mr-1 w-2 h-2 bg-purple-500" /><div className="absolute bottom-0 left-0 -mb-1 -ml-1 w-2 h-2 bg-purple-500" /><div className="absolute bottom-0 right-0 -mb-1 -mr-1 w-2 h-2 bg-purple-500" />
                                    {/* Etiqueta */}
                                    {!analyzing && (
                                        <div className="absolute -top-8 left-0 bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded animate-fade-in-up">
                                            Mancha Foliar Detectada (98.5%)
                                        </div>
                                    )}
                                </div>

                                {/* Mapa de Calor Simulado */}
                                <div className={`absolute bg-red-500/20 blur-xl rounded-full mix-blend-color-dodge transition-all duration-1000 ${analyzing ? 'opacity-0' : 'opacity-60'}`} style={{ top: '30%', left: '30%', width: '40%', height: '40%' }} />
                            </div>


                            {/* Footer del Análisis (Resultados) */}
                            <div className={`bg-slate-900/90 backdrop-blur-md p-4 rounded-xl border border-slate-700/50 transition-all duration-500 ${analyzing ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}>
                                <div className="flex justify-between items-center mb-2">
                                    <div className="font-bold text-white flex items-center gap-2">
                                        <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        Diagnóstico Final
                                    </div>
                                    <div className="text-sm text-purple-300 font-mono">Confianza: 98.5%</div>
                                </div>
                                <div className="space-y-2">
                                    <div>
                                        <div className="flex justify-between text-xs text-slate-400 mb-1"><span>Salud General</span><span>85/100</span></div>
                                        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-emerald-500 to-purple-500 w-[85%]" /></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* === COLUMNA DE ESTADÍSTICAS === */}
                    <div className="flex-1 lg:flex-[2] flex flex-col gap-4">
                        
                        {/* Mini Gráfico 1: Métricas */}
                        <div className="flex-1 bg-slate-900/60 rounded-xl border border-slate-800/80 p-4 backdrop-blur-sm flex flex-col justify-between">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">Área Afectada</div>
                                    <div className="text-2xl font-extrabold text-white mt-1">12.4% <span className="text-sm text-red-400 font-medium">↑ 2%</span></div>
                                </div>
                                <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg></div>
                            </div>
                            {/* Gráfico de líneas simulado (SVG) */}
                            <div className="h-12 mt-3 relative overflow-hidden">
                                <svg className="absolute bottom-0 left-0 right-0 h-full w-full text-purple-500" viewBox="0 0 100 40" preserveAspectRatio="none">
                                    <defs><linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="currentColor" stopOpacity="0.3" /><stop offset="100%" stopColor="currentColor" stopOpacity="0" /></linearGradient></defs>
                                    <path d="M0 30 Q 10 35, 20 32 T 40 25 T 60 28 T 80 15 L 100 20 L 100 40 L 0 40 Z" fill="url(#grad1)" />
                                    <path d="M0 30 Q 10 35, 20 32 T 40 25 T 60 28 T 80 15 L 100 20" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
                                </svg>
                            </div>
                        </div>

                        {/* Mini Gráfico 2: Actividad Reciente */}
                        <div className="flex-1 bg-slate-900/60 rounded-xl border border-slate-800/80 p-4 backdrop-blur-sm overflow-hidden relative">
                            <div className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-3">Actividad del Lote</div>
                            <div className="space-y-3 relative z-10">
                                <div className="flex items-center gap-3 text-sm">
                                    <div className="w-2 h-2 rounded-full bg-cyan-400 ring-4 ring-cyan-400/20" />
                                    <span className="text-slate-300 flex-1 truncate">Nuevo escaneo Lote B-12</span>
                                    <span className="text-slate-500 text-xs">2m</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <div className="w-2 h-2 rounded-full bg-emerald-400 ring-4 ring-emerald-400/20" />
                                    <span className="text-slate-300 flex-1 truncate">Sincronización completada</span>
                                    <span className="text-slate-500 text-xs">1h</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm opacity-60">
                                    <div className="w-2 h-2 rounded-full bg-slate-500" />
                                    <span className="text-slate-400 flex-1 truncate">Alerta climática</span>
                                    <span className="text-slate-600 text-xs">3h</span>
                                </div>
                            </div>
                            {/* Elemento decorativo de fondo */}
                            <div className="absolute -right-5 -bottom-5 w-24 h-24 bg-cyan-500/10 rounded-full blur-xl" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
