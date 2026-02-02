import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [top, setTop] = useState<boolean>(true);

  // Lógica para detectar el scroll y cambiar la transparencia
  useEffect(() => {
    const scrollHandler = () => {
      window.scrollY > 10 ? setTop(false) : setTop(true);
    };
    window.addEventListener('scroll', scrollHandler);
    return () => window.removeEventListener('scroll', scrollHandler);
  }, []);

  return (
    <nav className={`fixed w-full z-50 top-0 transition-all duration-300 ease-in-out ${
      !top ? 'bg-slate-900/80 backdrop-blur-lg border-b border-slate-800/50 shadow-lg shadow-black/5' : 'bg-transparent border-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-5 sm:px-6">
        <div className="flex items-center justify-between h-20">

          {/* LOGO & BRANDING */}
          <div className="flex-shrink-0 mr-4">
            <Link to="/" className="block group" aria-label="PlantDiseaseDetector">
              <div className="flex items-center gap-3">
                 {/* Contenedor del Logo con efecto Hover */}
                 <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-slate-800/50 border border-slate-700/50 group-hover:border-purple-500/50 group-hover:bg-purple-900/10 transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                    <img 
                        src="/logo.svg" 
                        alt="Logo" 
                        className="w-6 h-6 transition-transform duration-500 ease-out group-hover:rotate-12" 
                    />
                 </div>
                 
                 {/* Texto con Gradiente */}
                 <div className="flex flex-col leading-none">
                    <span className="text-white font-extrabold text-xl tracking-tight transition-colors duration-300">
                        Plant
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400 animate-gradient-x">
                            Disease
                        </span>
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-semibold group-hover:text-purple-400 transition-colors duration-300">
                        Detector AI
                    </span>
                 </div>
              </div>
            </Link>
          </div>

          {/* NAVEGACIÓN DESKTOP */}
          <nav className="flex flex-grow">
            <ul className="flex flex-grow justify-end flex-wrap items-center gap-4">
              <li>
                <Link 
                    to="/login" 
                    className="font-medium text-slate-300 hover:text-white px-5 py-2 rounded-full hover:bg-white/5 transition-all duration-200"
                >
                  Sign in
                </Link>
              </li>
              <li>
                <Link 
                    to="/register" 
                    className="relative inline-flex items-center justify-center px-6 py-2 overflow-hidden font-medium text-white transition duration-300 ease-out border border-purple-500 rounded-full shadow-md group"
                >
                  {/* Efecto de relleno al hover */}
                  <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-purple-600 group-hover:translate-x-0 ease">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                  </span>
                  <span className="absolute flex items-center justify-center w-full h-full text-white transition-all duration-300 transform group-hover:translate-x-full ease">Register</span>
                  <span className="relative invisible">Register</span>
                </Link>
              </li>
            </ul>
          </nav>

        </div>
      </div>
    </nav>
  );
}