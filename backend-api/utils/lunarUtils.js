const SunCalc = require('suncalc');

const getLunarPhase = (date = new Date()) => {
  const illumination = SunCalc.getMoonIllumination(date);
  const phaseValue = illumination.phase; 

  // Mapeo preciso para agricultura
  if (phaseValue < 0.03 || phaseValue > 0.97) return { id: 'new_moon', label: 'Luna Nueva', advice: 'Poda de formación y limpieza.' };
  if (phaseValue < 0.22) return { id: 'waxing_crescent', label: 'Luna Creciente', advice: 'Estimular crecimiento vegetativo.' };
  if (phaseValue < 0.28) return { id: 'first_quarter', label: 'Cuarto Creciente', advice: 'Siembra de hortalizas de fruto.' };
  if (phaseValue < 0.47) return { id: 'waxing_gibbous', label: 'Gibosa Creciente', advice: 'Cosecha para consumo inmediato.' };
  if (phaseValue < 0.53) return { id: 'full_moon', label: 'Luna Llena', advice: 'Evitar podas drásticas.' };
  if (phaseValue < 0.72) return { id: 'waning_gibbous', label: 'Gibosa Menguante', advice: 'Siembra de tubérculos y raíces.' };
  if (phaseValue < 0.78) return { id: 'last_quarter', label: 'Cuarto Menguante', advice: 'Control de plagas y transplantes.' };
  return { id: 'waning_crescent', label: 'Luna Menguante', advice: 'Reposo del suelo y abono.' };
};

module.exports = { getLunarPhase };