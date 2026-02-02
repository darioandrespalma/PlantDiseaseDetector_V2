export default function GridPattern() {
  return (
    <div className="absolute inset-0 -z-30 overflow-hidden pointer-events-none">
      {/* Gradientes de atmósfera sofisticados */}
      {/* Glow superior izquierdo - Púrpura profundo */}
      <div className="absolute -top-1/4 -left-1/4 w-3/5 h-3/5 rounded-full bg-purple-600/15 blur-[140px] opacity-80" style={{
        animation: 'float-slow 8s ease-in-out infinite'
      }} />
      
      {/* Glow central - Cian */}
      <div className="absolute top-1/3 left-1/2 w-1/2 h-1/2 rounded-full bg-cyan-500/10 blur-[160px] opacity-60" style={{
        animation: 'float-slow 10s ease-in-out infinite 2s'
      }} />
      
      {/* Glow inferior derecho - Esmeralda */}
      <div className="absolute -bottom-1/4 -right-1/4 w-3/5 h-3/5 rounded-full bg-emerald-600/10 blur-[140px] opacity-70" style={{
        animation: 'float-slow 9s ease-in-out infinite 1s'
      }} />

      {/* SVG Grid Pattern - Mejorado */}
      <svg
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
        style={{
          background: 'radial-gradient(circle at 30% 50%, rgba(168, 85, 247, 0.05) 0%, transparent 50%)'
        }}
      >
        <defs>
          {/* Patrón de malla principal */}
          <pattern
            id="grid-main"
            width={50}
            height={50}
            patternUnits="userSpaceOnUse"
          >
            {/* Líneas principales - Muy sutiles */}
            <path 
              d="M 50 0 L 0 0 0 50" 
              fill="none" 
              stroke="rgba(255, 255, 255, 0.08)" 
              strokeWidth="0.5"
            />
            {/* Puntos en intersecciones */}
            <circle 
              cx="0" 
              cy="0" 
              r="0.8" 
              fill="rgba(168, 85, 247, 0.15)"
            />
          </pattern>

          {/* Patrón de malla secundaria más fina */}
          <pattern
            id="grid-fine"
            width={25}
            height={25}
            patternUnits="userSpaceOnUse"
          >
            <path 
              d="M 25 0 L 0 0 0 25" 
              fill="none" 
              stroke="rgba(255, 255, 255, 0.03)" 
              strokeWidth="0.3"
            />
          </pattern>

          {/* Degradado para efectos */}
          <radialGradient id="glow-gradient">
            <stop offset="0%" stopColor="rgba(168, 85, 247, 0.3)" />
            <stop offset="100%" stopColor="rgba(168, 85, 247, 0)" />
          </radialGradient>
        </defs>

        {/* Capa 1: Malla fina de fondo */}
        <rect width="100%" height="100%" fill="url(#grid-fine)" />
        
        {/* Capa 2: Malla principal */}
        <rect 
          width="100%" 
          height="100%" 
          fill="url(#grid-main)"
          mask="url(#fade-mask)"
        />

        {/* Puntos de datos animados - Cuadros que brillan */}
        <g className="data-points">
          {/* Grupo de puntos 1 */}
          <rect 
            x="10%" y="20%" 
            width="60" height="60" 
            fill="none" 
            stroke="rgba(168, 85, 247, 0.3)" 
            strokeWidth="1"
            opacity="0"
            style={{
              animation: 'pulse-glow 4s ease-in-out infinite'
            }}
          />
          
          {/* Grupo de puntos 2 */}
          <rect 
            x="70%" y="60%" 
            width="80" height="80" 
            fill="none" 
            stroke="rgba(34, 211, 238, 0.25)" 
            strokeWidth="1"
            opacity="0"
            style={{
              animation: 'pulse-glow 5s ease-in-out infinite 1s'
            }}
          />
          
          {/* Grupo de puntos 3 */}
          <rect 
            x="20%" y="70%" 
            width="70" height="70" 
            fill="none" 
            stroke="rgba(16, 185, 129, 0.2)" 
            strokeWidth="1"
            opacity="0"
            style={{
              animation: 'pulse-glow 4.5s ease-in-out infinite 0.5s'
            }}
          />
        </g>

        {/* Líneas conectoras sutiles */}
        <g stroke="rgba(168, 85, 247, 0.08)" strokeWidth="0.5" opacity="0.5">
          <line x1="15%" y1="25%" x2="75%" y2="65%" />
          <line x1="80%" y1="30%" x2="30%" y2="75%" />
          <line x1="25%" y1="15%" x2="85%" y2="45%" />
        </g>

        {/* Máscara de desvanecimiento radial */}
        <mask id="fade-mask">
          <defs>
            <radialGradient id="fade-gradient" cx="50%" cy="30%">
              <stop offset="0%" stopColor="white" stopOpacity="1" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#fade-gradient)" />
        </mask>
      </svg>

      {/* Capa de vidrio sutil */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.05) 0%, transparent 50%, rgba(16, 185, 129, 0.05) 100%)'
        }}
      />

      {/* Animaciones CSS personalizadas */}
      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          25% { transform: translateY(-20px) translateX(10px); }
          50% { transform: translateY(-40px) translateX(0px); }
          75% { transform: translateY(-20px) translateX(-10px); }
        }

        @keyframes pulse-glow {
          0%, 100% { 
            opacity: 0;
            filter: blur(0px);
          }
          50% { 
            opacity: 0.6;
            filter: blur(4px);
          }
        }

        .delay-1000 {
          animation-delay: 1s;
        }

        .delay-700 {
          animation-delay: 0.7s;
        }
      `}</style>
    </div>
  );
}