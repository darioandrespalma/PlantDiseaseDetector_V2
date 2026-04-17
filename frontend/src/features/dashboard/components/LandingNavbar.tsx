import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Efecto para que el navbar cambie de color al hacer scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Función para cerrar el menú móvil
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
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

          {/* AUTH BUTTONS (Desktop) */}
          <div className="hidden md:flex items-center gap-4">
             <Link to="/login" className="text-sm font-medium text-white hover:text-purple-300 transition-colors">
               Iniciar Sesión
             </Link>
             <Link 
               to="/register" 
               className="px-4 py-2 bg-white text-slate-900 text-sm font-bold rounded-full hover:bg-gray-100 hover:scale-105 transition-all shadow-lg shadow-white/10"
             >
               Registrarse
             </Link>
          </div>

          {/* BOTÓN HAMBURGUESA (Móvil) */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-white hover:text-purple-300 transition-colors"
            aria-label="Toggle mobile menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

        </div>
      </nav>

      {/* MENÚ MÓVIL (Drawer/Overlay) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-xl" onClick={closeMobileMenu}></div>
          <div className="relative flex flex-col items-center justify-center h-full text-white">
            <button
              onClick={closeMobileMenu}
              className="absolute top-6 right-6 p-2 text-white hover:text-purple-300 transition-colors"
              aria-label="Close mobile menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="flex flex-col items-center gap-8 text-lg font-medium">
              <a href="#features" className="py-4 hover:text-purple-300 transition-colors" onClick={closeMobileMenu}>Características</a>
              <a href="#how-it-works" className="py-4 hover:text-purple-300 transition-colors" onClick={closeMobileMenu}>Cómo funciona</a>
              <a href="#" className="py-4 hover:text-purple-300 transition-colors" onClick={closeMobileMenu}>Precios</a>
              <div className="flex flex-col items-center gap-4 mt-8">
                <Link to="/login" className="py-4 text-white hover:text-purple-300 transition-colors" onClick={closeMobileMenu}>
                  Iniciar Sesión
                </Link>
                <Link 
                  to="/register" 
                  className="px-6 py-3 bg-white text-slate-900 text-sm font-bold rounded-full hover:bg-gray-100 hover:scale-105 transition-all shadow-lg shadow-white/10"
                  onClick={closeMobileMenu}
                >
                  Registrarse
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}