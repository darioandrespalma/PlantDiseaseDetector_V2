export default function HeroDashboard() {
  return (
    <div className="relative group">
      {/* 1. Efecto de Resplandor detrás de la imagen */}
      <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
      
      {/* 2. El Marco de la Ventana (Glassmorphism) */}
      <div className="relative rounded-xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden ring-1 ring-white/10">
        
        {/* Barra de Título (Estilo Mac) */}
        <div className="h-8 bg-slate-800/50 border-b border-slate-700 flex items-center px-4 space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
          <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/50" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/50" />
          <div className="ml-4 h-2 w-32 bg-slate-700 rounded-full opacity-50" />
        </div>

        {/* Contenido del Dashboard (Dibujado con SVG) */}
        <div className="relative bg-slate-900 aspect-[16/10] p-4 grid grid-cols-12 gap-4">
            
            {/* Sidebar Falso */}
            <div className="col-span-3 bg-slate-800/30 rounded-lg border border-slate-700/50 p-3 flex flex-col gap-3">
                <div className="h-8 w-8 bg-purple-600/20 rounded-md mb-4 border border-purple-500/30" />
                <div className="h-2 w-16 bg-slate-700 rounded-full" />
                <div className="h-2 w-12 bg-slate-700 rounded-full" />
                <div className="h-2 w-20 bg-slate-700 rounded-full" />
                <div className="mt-auto h-20 w-full bg-gradient-to-t from-purple-500/10 to-transparent rounded-lg" />
            </div>

            {/* Área Principal */}
            <div className="col-span-9 flex flex-col gap-4">
                
                {/* Header Area */}
                <div className="h-12 w-full bg-slate-800/30 rounded-lg border border-slate-700/50 flex items-center px-4 justify-between">
                    <div className="h-2 w-32 bg-slate-600 rounded-full" />
                    <div className="h-8 w-8 rounded-full bg-slate-700" />
                </div>

                <div className="flex gap-4 h-full">
                    {/* Tarjeta Principal (Imagen de Planta) */}
                    <div className="flex-1 bg-slate-800/30 rounded-lg border border-slate-700/50 relative overflow-hidden group-hover:border-purple-500/30 transition-colors">
                        <div className="absolute inset-0 flex items-center justify-center">
                            {/* Icono de Escaneo */}
                            <svg className="w-16 h-16 text-emerald-500 opacity-80 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {/* Línea de escaneo */}
                            <div className="absolute inset-x-0 h-0.5 bg-purple-500/50 top-0 animate-[scan_3s_linear_infinite]" />
                        </div>
                        <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur p-3 rounded-lg border border-emerald-500/30">
                            <div className="flex justify-between items-center">
                                <div className="h-2 w-20 bg-emerald-500/50 rounded-full" />
                                <div className="text-xs text-emerald-400 font-mono">98% Healthy</div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Column */}
                    <div className="w-1/3 flex flex-col gap-3">
                        <div className="flex-1 bg-slate-800/30 rounded-lg border border-slate-700/50 p-3">
                            <div className="h-2 w-10 bg-slate-600 rounded-full mb-2" />
                            <div className="h-6 w-full bg-gradient-to-r from-purple-500/20 to-transparent rounded" />
                        </div>
                        <div className="flex-1 bg-slate-800/30 rounded-lg border border-slate-700/50 p-3">
                            <div className="h-2 w-10 bg-slate-600 rounded-full mb-2" />
                            <div className="h-6 w-full bg-gradient-to-r from-cyan-500/20 to-transparent rounded" />
                        </div>
                        <div className="flex-1 bg-slate-800/30 rounded-lg border border-slate-700/50 p-3 relative overflow-hidden">
                             {/* Mini Grafico SVG */}
                             <svg className="absolute bottom-0 left-0 right-0 h-10 w-full text-purple-500/20" viewBox="0 0 100 40" preserveAspectRatio="none">
                                 <path d="M0 40 L0 30 Q 20 10 40 30 T 80 20 L 100 30 L 100 40 Z" fill="currentColor" />
                                 <path d="M0 30 Q 20 10 40 30 T 80 20 L 100 30" stroke="currentColor" fill="none" strokeWidth="2" />
                             </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}