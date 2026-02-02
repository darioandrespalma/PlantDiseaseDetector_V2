import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import DarkVeil from '@/shared/components/ui/DarkVeil';
import logo from '/public/logo.svg'; // Asegúrate de tener tu logo.svg en public

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    // Flex-col para tener Header arriba y contenido centrado
    <div className="relative min-h-screen flex flex-col overflow-hidden font-sans">
      
      {/* 1. FONDO ANIMADO PÚRPURA (Estilo Open React) */}
      <div className="fixed inset-0 z-0">
        <DarkVeil 
          hueShift={0.55} // 0.55 vira hacia morados/azules profundos
          noiseIntensity={0.08} 
          scanlineIntensity={0.15}
          warpAmount={0.3}
          speed={0.2}
        />
        {/* Capa extra de oscurecimiento para legibilidad */}
        <div className="absolute inset-0 bg-gray-900/60 pointer-events-none" />
      </div>

      {/* 2. HEADER / NAVBAR SIMPLE (Logo) */}
      <header className="relative z-20 w-full max-w-6xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 group">
                {/* Logo Placeholder - reemplaza src con tu logo real */}
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-[0_0_15px_rgba(124,58,237,0.5)] group-hover:scale-110 transition-transform">
                    P
                </div>
                <span className="text-xl font-bold tracking-tight text-white group-hover:text-purple-300 transition-colors">
                    Plant<span className="text-purple-500">Detector</span>
                </span>
            </Link>
        </div>
      </header>

      {/* 3. CONTENIDO PRINCIPAL */}
      <main className="relative z-10 flex-grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
            
            {/* Encabezado del Formulario */}
            <div className="text-center mb-10 animate-fade-in-up">
                <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-purple-400 drop-shadow-sm pb-2">
                    {title}
                </h1>
                <p className="text-gray-400 text-lg mt-2">
                    {subtitle}
                </p>
            </div>

            {/* Tarjeta del Formulario (Estilo Open Template) */}
            <div className="bg-gray-800/40 backdrop-blur-xl border border-gray-700/50 p-8 rounded-2xl shadow-2xl animate-fade-in-up delay-100">
                {children}
            </div>

        </div>
      </main>

    </div>
  );
}