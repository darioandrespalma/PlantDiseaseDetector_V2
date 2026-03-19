/* ---------------------------------------------------------
   ICONOS DE CARACTERÍSTICAS (Features)
--------------------------------------------------------- */

import { twMerge } from 'tailwind-merge';

interface IconProps {
    className?: string;
}

export const IconAI = ({ className }: IconProps) => {
  const baseClasses = "w-12 h-12 text-purple-500";
  const combinedClasses = twMerge(baseClasses, className);
  return (
    <svg className={combinedClasses} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="12" r="3" className="fill-cyan-400/50 animate-pulse" />
    </svg>
  );
};

export const IconSpeed = ({ className }: IconProps) => {
  const baseClasses = "w-12 h-12 text-cyan-400";
  const combinedClasses = twMerge(baseClasses, className);
  return (
    <svg className={combinedClasses} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 6V12L16 14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 2V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
};

export const IconCloud = ({ className }: IconProps) => {
  const baseClasses = "w-12 h-12 text-emerald-400";
  const combinedClasses = twMerge(baseClasses, className);
  return (
    <svg className={combinedClasses} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 16.2422C2.79401 15.435 2 14.0602 2 12.5C2 10.1564 3.79151 8.23129 6.07974 8.01937C6.54785 4.33497 9.77266 1.5 13.5 1.5C17.8055 1.5 21.4045 4.5661 22.1931 8.71077C23.2755 9.55462 24 10.9238 24 12.5C24 15.2614 21.7614 17.5 19 17.5H5C4.653 17.5 4.3162 17.4628 4 16.2422Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
      <path d="M12 12V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M8 18L12 22L16 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
};

/* ---------------------------------------------------------
   ICONOS DE CÓMO FUNCIONA (Steps)
--------------------------------------------------------- */

export const IconUpload = ({ className }: IconProps) => {
  const baseClasses = "w-8 h-8 text-white";
  const combinedClasses = twMerge(baseClasses, className);
  return (
    <svg className={combinedClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
  );
};

export const IconAnalyze = ({ className }: IconProps) => {
  const baseClasses = "w-8 h-8 text-white";
  const combinedClasses = twMerge(baseClasses, className);
  return (
    <svg className={combinedClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  );
};

export const IconResult = ({ className }: IconProps) => {
  const baseClasses = "w-8 h-8 text-white";
  const combinedClasses = twMerge(baseClasses, className);
  return (
    <svg className={combinedClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
};