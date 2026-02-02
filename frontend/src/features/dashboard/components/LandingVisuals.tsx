/* ---------------------------------------------------------
   ICONOS DE CARACTERÍSTICAS (Features)
--------------------------------------------------------- */

export const IconAI = () => (
  <svg className="w-12 h-12 text-purple-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="12" r="3" className="fill-cyan-400/50 animate-pulse" />
  </svg>
);

export const IconSpeed = () => (
  <svg className="w-12 h-12 text-cyan-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 6V12L16 14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 2V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const IconCloud = () => (
  <svg className="w-12 h-12 text-emerald-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 16.2422C2.79401 15.435 2 14.0602 2 12.5C2 10.1564 3.79151 8.23129 6.07974 8.01937C6.54785 4.33497 9.77266 1.5 13.5 1.5C17.8055 1.5 21.4045 4.5661 22.1931 8.71077C23.2755 9.55462 24 10.9238 24 12.5C24 15.2614 21.7614 17.5 19 17.5H5C4.653 17.5 4.3162 17.4628 4 16.2422Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
    <path d="M12 12V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M8 18L12 22L16 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

/* ---------------------------------------------------------
   IMAGEN HERO PRINCIPAL (SVG)
--------------------------------------------------------- */

export const HeroImageSVG = () => (
  <svg viewBox="0 0 800 500" className="w-full h-full drop-shadow-2xl">
    <defs>
      <linearGradient id="screen-grad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#1e293b" stopOpacity="0.8"/>
        <stop offset="100%" stopColor="#0f172a" stopOpacity="0.9"/>
      </linearGradient>
      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
      </pattern>
    </defs>
    
    <rect x="50" y="20" width="700" height="460" rx="20" fill="url(#screen-grad)" stroke="#334155" strokeWidth="2"/>
    <rect x="50" y="20" width="700" height="460" rx="20" fill="url(#grid)" />

    <rect x="90" y="60" width="150" height="40" rx="8" fill="rgba(124, 58, 237, 0.2)" />
    <rect x="90" y="120" width="200" height="10" rx="5" fill="rgba(255,255,255,0.1)" />
    <rect x="90" y="140" width="140" height="10" rx="5" fill="rgba(255,255,255,0.1)" />

    <path transform="translate(350, 150) scale(4)" d="M12 2C7.5 2 4 6 4 11C4 16.5 8 21 12 22C16 21 20 16.5 20 11C20 6 16.5 2 12 2ZM12 20C9.5 19 6 15.5 6 11C6 7.5 8.5 4 12 4C15.5 4 18 7.5 18 11C18 15.5 14.5 19 12 20Z" fill="#4ade80" opacity="0.8" />
    
    <line x1="250" y1="100" x2="550" y2="100" stroke="#a855f7" strokeWidth="2" className="animate-[scan_3s_ease-in-out_infinite]">
        <animate attributeName="y1" values="100;400;100" dur="4s" repeatCount="indefinite" />
        <animate attributeName="y2" values="100;400;100" dur="4s" repeatCount="indefinite" />
    </line>
    
    <g transform="translate(500, 300)">
        <rect width="180" height="100" rx="10" fill="rgba(15, 23, 42, 0.9)" stroke="#4ade80" strokeWidth="1" />
        <text x="20" y="30" fill="white" fontFamily="sans-serif" fontSize="14" fontWeight="bold">Diagnosis:</text>
        <text x="20" y="55" fill="#4ade80" fontFamily="sans-serif" fontSize="18">Healthy</text>
        <rect x="20" y="70" width="140" height="6" rx="3" fill="#334155" />
        <rect x="20" y="70" width="130" height="6" rx="3" fill="#4ade80" />
    </g>
  </svg>
);

/* ---------------------------------------------------------
   ICONOS DE CÓMO FUNCIONA (NUEVOS)
--------------------------------------------------------- */

export const IconUpload = () => (
  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
  </svg>
);

export const IconAnalyze = () => (
  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
  </svg>
);

export const IconResult = () => (
  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);