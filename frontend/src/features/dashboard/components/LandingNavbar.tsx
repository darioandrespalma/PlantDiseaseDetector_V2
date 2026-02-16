import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);

  // Efecto para que el navbar cambie de color al hacer scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-slate-950/80 backdrop-blur-md border-b border-slate-800 py-3' : 'bg-transparent py-5'
    }`}>
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        
        {/* LOGO */}
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-purple-500/20">
             P
           </div>
           <span className="text-xl font-bold text-white tracking-tight">
             Plant<span className="text-purple-400">Detector</span>
           </span>
        </div>

        {/* LINKS (Desktop) */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
           <a href="#features" className="hover:text-white transition-colors">Características</a>
           <a href="#how-it-works" className="hover:text-white transition-colors">Cómo funciona</a>
           <a href="#" className="hover:text-white transition-colors">Precios</a>
        </div>

        {/* AUTH BUTTONS */}
        <div className="flex items-center gap-4">
           <Link to="/login" className="text-sm font-medium text-white hover:text-purple-300 transition-colors">
             Iniciar Sesión
           </Link>
           <Link 
             to="/register" 
             className="hidden sm:inline-flex px-4 py-2 bg-white text-slate-900 text-sm font-bold rounded-full hover:bg-gray-100 hover:scale-105 transition-all shadow-lg shadow-white/10"
           >
             Registrarse
           </Link>
        </div>

      </div>
    </nav>
  );
}