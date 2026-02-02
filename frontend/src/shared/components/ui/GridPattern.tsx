import { useEffect, useRef } from 'react';

export default function GridPattern() {
  return (
    <div className="absolute inset-0 -z-30 overflow-hidden pointer-events-none">
      {/* 1. Gradientes de atmósfera (Glows respirando) */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-900/20 blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-900/10 blur-[120px] animate-pulse delay-1000" />

      {/* 2. El SVG de la Malla (Grid) */}
      <svg
        className="absolute inset-0 h-full w-full stroke-white/20 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="grid-pattern"
            width={40}
            height={40}
            x="50%"
            y={-1}
            patternUnits="userSpaceOnUse"
          >
            <path d="M.5 40V.5H40" fill="none" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" strokeWidth={0} fill="url(#grid-pattern)" />
        
        {/* Cuadros que se iluminan aleatoriamente (Efecto Data) */}
        <svg x="50%" y={-1} className="overflow-visible fill-white/5">
          <path
            d="M-100.5 0h41v41h-41zM-140.5 0h41v41h-41zM80.5 40h41v41h-41z"
            className="animate-pulse"
          />
          <path
            d="M-200.5 120h41v41h-41zM20.5 200h41v41h-41z"
            className="animate-pulse delay-700"
          />
        </svg>
      </svg>
    </div>
  );
}