import { Link } from 'react-router-dom';
import Navbar from '@/shared/components/organisms/Navbar';
import GridPattern from '@/shared/components/ui/GridPattern';
import HeroDashboard from '@/features/dashboard/components/HeroDashboard';
import { IconAI, IconSpeed, IconCloud, IconUpload, IconAnalyze, IconResult } from '@/features/dashboard/components/LandingVisuals';

export default function LandingPage() {
  return (
    // 🔴 CAMBIO CLAVE AQUÍ: Cambiamos 'bg-slate-900' por 'bg-transparent'
    // para que no tape el fondo fijo de atrás.
    <div className="flex flex-col min-h-screen overflow-hidden bg-transparent font-sans text-slate-300 selection:bg-purple-500 selection:text-white relative">
      
      {/* ==========================================
          FONDO FIJO (Grid + Glow)
          Este div se queda quieto mientras haces scroll
      ========================================== */}
      <div className="fixed inset-0 -z-50 bg-slate-900">
          {/* 1. El resplandor superior */}
          <div className="absolute top-0 left-0 right-0 h-[600px] bg-hero-glow pointer-events-none opacity-100" />
          
          {/* 2. La malla tecnológica (Aumenté un poco la opacidad para asegurar que se vea) */}
          <div className="absolute inset-0 opacity-60 mix-blend-overlay">
            <GridPattern /> 
          </div>
      </div>

      <Navbar />

      {/* ==========================================
          1. HERO SECTION
      ========================================== */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-16">
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-slate-800/80 text-purple-300 text-xs font-medium mb-8 backdrop-blur-md shadow-lg shadow-purple-900/20">
               <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                </span>
               v2.0 IA Avanzada Disponible
            </div>

            {/* Titulo */}
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-white leading-[1.1] drop-shadow-sm">
              Protege tus cultivos con <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-cyan-400 to-emerald-400 animate-gradient-x">
                Inteligencia Artificial
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              La plataforma definitiva para el monitoreo agrícola. Detecta enfermedades en segundos, gestiona tus lotes y maximiza tu producción.
            </p>
            
            {/* Botones */}
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/register" className="inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-purple-600 rounded-full hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-500/25 hover:-translate-y-1">
                Comenzar Gratis -&gt;
              </Link>
              <a href="#how-it-works" className="inline-flex items-center justify-center px-8 py-4 font-medium text-slate-300 transition-all duration-200 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-full hover:text-white hover:bg-slate-800">
                Ver Demo
              </a>
            </div>
          </div>

          {/* Hero Visual (SVG Dashboard) */}
          <div className="relative max-w-5xl mx-auto">
             <HeroDashboard />
          </div>

        </div>
      </section>

      {/* ==========================================
          STATS SECTION
      ========================================== */}
      {/* Añadimos bg-slate-900/50 para oscurecer un poco la malla aquí y que se lea mejor */}
      <section className="py-10 border-y border-slate-800 bg-slate-900/60 backdrop-blur-sm relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                {[
                    { label: "Precisión IA", value: "98%" },
                    { label: "Agricultores", value: "500+" },
                    { label: "Análisis/Día", value: "2.5k" },
                    { label: "Cultivos", value: "3 Tipos" },
                ].map((stat, index) => (
                    <div key={index} className="space-y-1">
                        <div className="text-3xl md:text-4xl font-extrabold text-white">{stat.value}</div>
                        <div className="text-sm font-medium text-purple-400 uppercase tracking-wider">{stat.label}</div>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* ==========================================
          CÓMO FUNCIONA
      ========================================== */}
      <section id="how-it-works" className="py-24 relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Flujo de trabajo simplificado</h2>
                <p className="text-slate-400 max-w-2xl mx-auto">Sin configuraciones complejas. Tecnología avanzada al alcance de tu mano.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-12 relative">
                {/* Línea conectora */}
                <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent -z-10" />

                {/* Pasos */}
                <div className="relative flex flex-col items-center text-center group">
                    <div className="w-24 h-24 rounded-2xl bg-slate-800 border border-slate-700 shadow-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-purple-500/50 transition-all duration-300 z-10">
                        <IconUpload />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">1. Sube tu Foto</h3>
                    <p className="text-slate-400 text-sm">Toma una foto de la hoja afectada con tu celular o súbela desde tu PC.</p>
                </div>

                <div className="relative flex flex-col items-center text-center group">
                    <div className="w-24 h-24 rounded-2xl bg-slate-800 border border-slate-700 shadow-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-cyan-500/50 transition-all duration-300 z-10">
                        <IconAnalyze />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">2. Análisis IA</h3>
                    <p className="text-slate-400 text-sm">Nuestros algoritmos procesan la imagen en la nube en milisegundos.</p>
                </div>

                <div className="relative flex flex-col items-center text-center group">
                    <div className="w-24 h-24 rounded-2xl bg-slate-800 border border-slate-700 shadow-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-emerald-500/50 transition-all duration-300 z-10">
                        <IconResult />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">3. Resultados</h3>
                    <p className="text-slate-400 text-sm">Recibe el diagnóstico y una guía de tratamiento certificada.</p>
                </div>
            </div>
        </div>
      </section>

      {/* ==========================================
          FEATURES GRID
      ========================================== */}
      <section className="py-20 bg-slate-900/40 border-y border-slate-800/50 relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid md:grid-cols-3 gap-8">
                <div className="p-8 bg-slate-800/40 rounded-3xl border border-slate-700/50 hover:bg-slate-800 transition-colors duration-300 group backdrop-blur-sm">
                    <div className="mb-4 text-purple-400"><IconAI /></div>
                    <h3 className="text-xl font-bold text-white mb-3">Diagnóstico IA</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">Modelos entrenados para detectar enfermedades en Banano, Café y Arroz.</p>
                </div>
                <div className="p-8 bg-slate-800/40 rounded-3xl border border-slate-700/50 hover:bg-slate-800 transition-colors duration-300 group backdrop-blur-sm">
                    <div className="mb-4 text-cyan-400"><IconSpeed /></div>
                    <h3 className="text-xl font-bold text-white mb-3">Tiempo Real</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">No esperes días. Obtén resultados inmediatos y actúa rápido.</p>
                </div>
                <div className="p-8 bg-slate-800/40 rounded-3xl border border-slate-700/50 hover:bg-slate-800 transition-colors duration-300 group backdrop-blur-sm">
                    <div className="mb-4 text-emerald-400"><IconCloud /></div>
                    <h3 className="text-xl font-bold text-white mb-3">Cloud History</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">Registro digital completo de la salud de todos tus lotes.</p>
                </div>
            </div>
        </div>
      </section>

      {/* ==========================================
          CTA FINAL
      ========================================== */}
      <section className="py-24 relative overflow-hidden z-10">
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/40 to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">¿Listo para modernizar tu cultivo?</h2>
            <p className="text-slate-300 mb-10 text-lg max-w-2xl mx-auto">Únete a la revolución agrícola digital. Prueba nuestra herramienta hoy mismo.</p>
            <Link to="/register" className="inline-block px-12 py-5 bg-white text-slate-900 font-bold text-lg rounded-full hover:bg-gray-100 hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)]">
                Crear Cuenta Gratis
            </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-slate-800 bg-slate-950 relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
                <div className="col-span-2 md:col-span-1">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold">P</div>
                        <span className="text-white font-bold text-lg">PlantDetector</span>
                    </div>
                    <p className="text-slate-500 text-sm leading-relaxed">
                        Inteligencia artificial aplicada a la agricultura de precisión.
                    </p>
                </div>
                <div>
                    <h4 className="text-white font-bold mb-4">Producto</h4>
                    <ul className="space-y-2 text-sm text-slate-400">
                        <li><a href="#" className="hover:text-purple-400 transition-colors">Características</a></li>
                        <li><a href="#" className="hover:text-purple-400 transition-colors">Precios</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-white font-bold mb-4">Recursos</h4>
                    <ul className="space-y-2 text-sm text-slate-400">
                        <li><a href="#" className="hover:text-purple-400 transition-colors">Blog</a></li>
                        <li><a href="#" className="hover:text-purple-400 transition-colors">Soporte</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-white font-bold mb-4">Legal</h4>
                    <ul className="space-y-2 text-sm text-slate-400">
                        <li><a href="#" className="hover:text-purple-400 transition-colors">Privacidad</a></li>
                    </ul>
                </div>
            </div>
            <div className="pt-8 border-t border-slate-900 text-center text-slate-600 text-sm">
                <p>&copy; {new Date().getFullYear()} PlantDiseaseDetector AI. Todos los derechos reservados.</p>
            </div>
        </div>
      </footer>

    </div>
  );
}