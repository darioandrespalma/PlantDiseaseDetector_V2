// backend-api/seedCultivos.js
require('dotenv').config();
const mongoose = require('mongoose');

// ---------------------------------------------------------
// 1. DEFINICIÓN DEL SCHEMA EXPANDIDO (Nivel Ingeniero Agrónomo)
// ---------------------------------------------------------
// Definimos el esquema aquí mismo para asegurar que el seed funcione 
// independientemente de cómo esté tu archivo 'models/Cultivo.js' actual.

const EtapaFenologicaSchema = new mongoose.Schema({
  nombre: String,
  duracionDias: Number,
  requerimientoAgua: { type: String, enum: ['bajo', 'medio', 'alto', 'muy_alto'] }
}, { _id: false });

const CultivoSchema = new mongoose.Schema({
  nombre: { type: String, unique: true, required: true },
  nombreCientifico: String,
  categoria: String,
  descripcion: String,
  
  // Clima
  tempOptima: { min: Number, max: Number },
  tempGerminacion: { min: Number, max: Number },
  sensibilidadHeladas: String,
  
  // Agua
  reqHidricoInicial: String,
  lluviaMinima: Number,
  diasLluviaNecesarios: Number,
  prioridadRiego: Number,
  
  // Ciclo
  faseLunarOptima: String,
  diasCosecha: Number,

  // --- NUEVOS CAMPOS TÉCNICOS ---
  etapasFenologicas: [EtapaFenologicaSchema],
  
  requerimientosSuelo: {
    ph: { min: Number, max: Number },
    textura: String,
    drenaje: String
  },
  
  densidadSiembra: {
    plantasPorHectarea: Number,
    distanciaSiembra: String
  },
  
  planFertilizacion: {
    nitrogeno: String,
    fosforo: String,
    potasio: String,
    nota: String
  },
  
  manejoFitosanitario: {
    plagasComunes: [String],
    enfermedadesComunes: [String]
  },
  
  rendimientoEsperado: {
    toneladasPorHectarea: Number
  },
  activo: { type: Boolean, default: true }
});

// Usamos el modelo existente o creamos uno nuevo para el script
const Cultivo = mongoose.models.Cultivo || mongoose.model('Cultivo', CultivoSchema);

// ---------------------------------------------------------
// 2. DATOS MAESTROS (Tu lista enriquecida)
// ---------------------------------------------------------
const cultivosEcuador = [
  // --- EXPORTACIÓN / INDUSTRIALES ---
  {
    nombre: 'Banano',
    nombreCientifico: 'Musa × paradisiaca',
    categoria: 'frutal',
    descripcion: 'El "Oro Verde". Cultivo insignia de la Costa. Requiere calor y humedad constante.',
    tempOptima: { min: 22, max: 30 },
    tempGerminacion: { min: 20, max: 35 },
    sensibilidadHeladas: 'critica',
    reqHidricoInicial: 'muy_alto',
    lluviaMinima: 100,
    diasLluviaNecesarios: 5,
    prioridadRiego: 1,
    faseLunarOptima: 'creciente',
    diasCosecha: 280,
    etapasFenologicas: [
      { nombre: "Emisión de hijuelos", duracionDias: 30, requerimientoAgua: "medio" },
      { nombre: "Vegetativa", duracionDias: 120, requerimientoAgua: "alto" },
      { nombre: "Floración/Embuche", duracionDias: 90, requerimientoAgua: "muy_alto" },
      { nombre: "Llenado de fruto", duracionDias: 90, requerimientoAgua: "alto" },
      { nombre: "Maduración/Cosecha", duracionDias: 60, requerimientoAgua: "medio" }
    ],
    requerimientosSuelo: {
      ph: { min: 5.5, max: 6.5 },
      textura: "Franco-arenoso a franco-arcilloso",
      drenaje: "Exige excelente drenaje, tolerancia nula a encharcamiento"
    },
    densidadSiembra: {
      plantasPorHectarea: 1100,
      distanciaSiembra: "2.5m x 3.0m (Zona Norte) hasta 3.0m x 3.0m (Zona Central)"
    },
    planFertilizacion: {
      nitrogeno: "Alto",
      fosforo: "Medio",
      potasio: "Muy Alto",
      nota: "Aplicar potasio en llenado de fruto. N en etapa vegetativa"
    },
    manejoFitosanitario: {
      plagasComunes: ["Picudo Negro (Cosmopolites sordidus)", "Gusano Cogollero", "Ácaros"],
      enfermedadesComunes: ["Sigatoka Negra", "Moko (Ralstonia solanacearum)", "Mal de Panamá"]
    },
    rendimientoEsperado: {
      toneladasPorHectarea: 45
    }
  },
  {
    nombre: 'Cacao',
    nombreCientifico: 'Theobroma cacao',
    categoria: 'industrial',
    descripcion: 'Cacao Fino de Aroma. Requiere sombra parcial en sus primeras etapas.',
    tempOptima: { min: 23, max: 30 },
    tempGerminacion: { min: 25, max: 35 },
    sensibilidadHeladas: 'critica',
    reqHidricoInicial: 'alto',
    lluviaMinima: 120,
    diasLluviaNecesarios: 4,
    prioridadRiego: 2,
    faseLunarOptima: 'creciente',
    diasCosecha: 1095,
    etapasFenologicas: [
      { nombre: "Vivero/Germinación", duracionDias: 90, requerimientoAgua: "medio" },
      { nombre: "Crecimiento juvenil", duracionDias: 730, requerimientoAgua: "medio" },
      { nombre: "Floración", duracionDias: 45, requerimientoAgua: "alto" },
      { nombre: "Cuajado y Maduración", duracionDias: 170, requerimientoAgua: "medio" }
    ],
    requerimientosSuelo: {
      ph: { min: 6.0, max: 7.5 },
      textura: "Franco-arcilloso a arcilloso",
      drenaje: "Buen drenaje, profundidad >80cm"
    },
    densidadSiembra: {
      plantasPorHectarea: 1100,
      distanciaSiembra: "3.0m x 3.0m (sistema de tres árboles sombra por cacao)"
    },
    planFertilizacion: {
      nitrogeno: "Medio",
      fosforo: "Alto",
      potasio: "Alto",
      nota: "Incrementar K en fase productiva. Ca y Mg importantes"
    },
    manejoFitosanitario: {
      plagasComunes: ["Mazorquero (Conotrachelus humeropictus)", "Polilla del Cacao", "Ácaros"],
      enfermedadesComunes: ["Monilia (Moniliophthora roreri)", "Mal de Machete (Phytophthora)", "Escoba de Bruja"]
    },
    rendimientoEsperado: {
      toneladasPorHectarea: 1.2
    }
  },
  {
    nombre: 'Palma Africana',
    nombreCientifico: 'Elaeis guineensis',
    categoria: 'industrial',
    descripcion: 'Cultivo oleaginoso de zonas tropicales húmedas (Esmeraldas, Los Ríos).',
    tempOptima: { min: 24, max: 28 },
    tempGerminacion: { min: 25, max: 35 },
    sensibilidadHeladas: 'critica',
    reqHidricoInicial: 'alto',
    lluviaMinima: 150,
    diasLluviaNecesarios: 5,
    prioridadRiego: 2,
    faseLunarOptima: 'todas',
    diasCosecha: 1460,
    etapasFenologicas: [
      { nombre: "Vivero", duracionDias: 365, requerimientoAgua: "medio" },
      { nombre: "Crecimiento vegetativo", duracionDias: 1095, requerimientoAgua: "alto" },
      { nombre: "Floración antesis", duracionDias: 30, requerimientoAgua: "alto" },
      { nombre: "Formación de racimos", duracionDias: 150, requerimientoAgua: "medio" }
    ],
    requerimientosSuelo: {
      ph: { min: 4.0, max: 6.0 },
      textura: "Franco-arcilloso profundo",
      drenaje: "Tolera temporalmente encharcamiento pero prefiere buen drenaje"
    },
    densidadSiembra: {
      plantasPorHectarea: 143,
      distanciaSiembra: "9.0m x 9.0m en triángulo (sistema triangular)"
    },
    planFertilizacion: {
      nitrogeno: "Alto",
      fosforo: "Medio",
      potasio: "Alto",
      nota: "Boro crítico para polinización. N y K continuo en plantación adulta"
    },
    manejoFitosanitario: {
      plagasComunes: ["Comején", "Picudo de la Palma", "Cigarrón"],
      enfermedadesComunes: ["Marchitez Sorpresiva", "Pudrición del Cogollo", "Antracnosis"]
    },
    rendimientoEsperado: {
      toneladasPorHectarea: 18
    }
  },
  {
    nombre: 'Rosas',
    nombreCientifico: 'Rosa spp.',
    categoria: 'flor',
    descripcion: 'Flor de exportación principal de la Sierra (Cayambe, Cotopaxi). Alta tecnología.',
    tempOptima: { min: 14, max: 24 },
    tempGerminacion: { min: 15, max: 25 },
    sensibilidadHeladas: 'media',
    reqHidricoInicial: 'alto',
    lluviaMinima: 80,
    diasLluviaNecesarios: 3,
    prioridadRiego: 1,
    faseLunarOptima: 'creciente',
    diasCosecha: 70,
    etapasFenologicas: [
      { nombre: "Enraizamiento", duracionDias: 45, requerimientoAgua: "medio" },
      { nombre: "Pimpollo/Tallo", duracionDias: 35, requerimientoAgua: "alto" },
      { nombre: "Floración/Corte", duracionDias: 50, requerimientoAgua: "alto" },
      { nombre: "Reposo inducido", duracionDias: 20, requerimientoAgua: "bajo" }
    ],
    requerimientosSuelo: {
      ph: { min: 5.5, max: 6.5 },
      textura: "Franco-arenoso con alta materia orgánica",
      drenaje: "Drenaje perfecto, invernadero controlado"
    },
    densidadSiembra: {
      plantasPorHectarea: 80000,
      distanciaSiembra: "20cm x 15cm (alta densidad invernadero)"
    },
    planFertilizacion: {
      nitrogeno: "Alto",
      fosforo: "Medio",
      potasio: "Alto",
      nota: "Fertilización fertirrigación diaria. Calcio para pared celular"
    },
    manejoFitosanitario: {
      plagasComunes: ["Ácaros (Tetranychus)", "Trips", "Pulgón"],
      enfermedadesComunes: ["Mildeo Polvoso (Oidium)", "Mildeo Velloso (Peronospora)", "Botrytis"]
    },
    rendimientoEsperado: {
      toneladasPorHectarea: 0.25
    }
  },

  // --- SIERRA ---
  {
    nombre: 'Papa',
    nombreCientifico: 'Solanum tuberosum',
    categoria: 'tubérculo',
    descripcion: 'Alimento básico andino (Superchola, Única). Sensible a tizón tardío.',
    tempOptima: { min: 12, max: 20 },
    tempGerminacion: { min: 10, max: 25 },
    sensibilidadHeladas: 'media',
    reqHidricoInicial: 'medio',
    lluviaMinima: 60,
    diasLluviaNecesarios: 2,
    prioridadRiego: 3,
    faseLunarOptima: 'menguante',
    diasCosecha: 150,
    etapasFenologicas: [
      { nombre: "Germinación/Emergencia", duracionDias: 25, requerimientoAgua: "bajo" },
      { nombre: "Desarrollo foliar", duracionDias: 35, requerimientoAgua: "medio" },
      { nombre: "Tubercización", duracionDias: 40, requerimientoAgua: "alto" },
      { nombre: "Engrosamiento", duracionDias: 35, requerimientoAgua: "medio" },
      { nombre: "Maduración/Senescencia", duracionDias: 15, requerimientoAgua: "bajo" }
    ],
    requerimientosSuelo: {
      ph: { min: 5.0, max: 6.0 },
      textura: "Franco-arenoso suelto",
      drenaje: "Drenaje excelente, profundidad >40cm, evitar suelos compactados"
    },
    densidadSiembra: {
      plantasPorHectarea: 40000,
      distanciaSiembra: "0.9m entre surcos, 0.3m entre plantas"
    },
    planFertilizacion: {
      nitrogeno: "Alto",
      fosforo: "Alto",
      potasio: "Muy Alto",
      nota: "K crítico en tubercización. Evitar N excesivo post-floración"
    },
    manejoFitosanitario: {
      plagasComunes: ["Gusano Blanco (Premnotrypes)", "Pulgón", "Polilla"],
      enfermedadesComunes: ["Tizón Tardío (Phytophthora infestans)", "Gota (Alternaria)", "Rizoctonia"]
    },
    rendimientoEsperado: {
      toneladasPorHectarea: 25
    }
  },
  {
    nombre: 'Brócoli',
    nombreCientifico: 'Brassica oleracea var. italica',
    categoria: 'hortaliza',
    descripcion: 'Hortaliza de exportación en Cotopaxi. Requiere frío.',
    tempOptima: { min: 10, max: 18 },
    tempGerminacion: { min: 10, max: 25 },
    sensibilidadHeladas: 'baja',
    reqHidricoInicial: 'alto',
    lluviaMinima: 90,
    diasLluviaNecesarios: 3,
    prioridadRiego: 2,
    faseLunarOptima: 'creciente',
    diasCosecha: 90,
    etapasFenologicas: [
      { nombre: "Almacigo", duracionDias: 30, requerimientoAgua: "medio" },
      { nombre: "Crecimiento vegetativo", duracionDias: 35, requerimientoAgua: "alto" },
      { nombre: "Inducción floral", duracionDias: 10, requerimientoAgua: "medio" },
      { nombre: "Formación de cabeza", duracionDias: 15, requerimientoAgua: "alto" },
      { nombre: "Cosecha", duracionDias: 5, requerimientoAgua: "medio" }
    ],
    requerimientosSuelo: {
      ph: { min: 6.0, max: 7.0 },
      textura: "Franco-arcilloso fértil",
      drenaje: "Buen drenaje, evitar encharcamiento"
    },
    densidadSiembra: {
      plantasPorHectarea: 45000,
      distanciaSiembra: "0.5m x 0.4m (doble hilera)"
    },
    planFertilizacion: {
      nitrogeno: "Alto",
      fosforo: "Alto",
      potasio: "Alto",
      nota: "Boro crítico para evitar cabezas huecas. N continuo"
    },
    manejoFitosanitario: {
      plagasComunes: ["Pulgón", "Mariposa de la Col", "Trips"],
      enfermedadesComunes: ["Mildiu Velloso", "Alternaria", "Black Rot (bacteriosis)"]
    },
    rendimientoEsperado: {
      toneladasPorHectarea: 18
    }
  },
  {
    nombre: 'Maíz Suave (Choclo)',
    nombreCientifico: 'Zea mays',
    categoria: 'cereal',
    descripcion: 'Maíz de altura para consumo fresco.',
    tempOptima: { min: 12, max: 24 },
    tempGerminacion: { min: 12, max: 30 },
    sensibilidadHeladas: 'alta',
    reqHidricoInicial: 'medio',
    lluviaMinima: 60,
    diasLluviaNecesarios: 2,
    prioridadRiego: 3,
    faseLunarOptima: 'creciente',
    diasCosecha: 180,
    etapasFenologicas: [
      { nombre: "Emergencia", duracionDias: 10, requerimientoAgua: "medio" },
      { nombre: "Hojas en V", duracionDias: 40, requerimientoAgua: "bajo" },
      { nombre: "Floración", duracionDias: 20, requerimientoAgua: "alto" },
      { nombre: "Llenado de grano", duracionDias: 60, requerimientoAgua: "medio" },
      { nombre: "Maduración", duracionDias: 50, requerimientoAgua: "bajo" }
    ],
    requerimientosSuelo: {
      ph: { min: 5.5, max: 7.0 },
      textura: "Franco-arcilloso profundo",
      drenaje: "Moderado, tolera algo de humedad"
    },
    densidadSiembra: {
      plantasPorHectarea: 55000,
      distanciaSiembra: "0.8m entre surcos, 0.2m entre plantas"
    },
    planFertilizacion: {
      nitrogeno: "Alto",
      fosforo: "Alto",
      potasio: "Medio",
      nota: "N en etapa vegetativa y floración. Evitar estrés hídrico en polinización"
    },
    manejoFitosanitario: {
      plagasComunes: ["Gusano Cogollero", "Barrenador del Tallo", "Chinche de la panoja"],
      enfermedadesComunes: ["Roya Común", "Mal de Río Cuarto", "Carbon de la Mazorca"]
    },
    rendimientoEsperado: {
      toneladasPorHectarea: 12
    }
  },
  {
    nombre: 'Quinua',
    nombreCientifico: 'Chenopodium quinoa',
    categoria: 'cereal',
    descripcion: 'El "Grano de Oro" andino. Muy resistente a condiciones adversas.',
    tempOptima: { min: 8, max: 22 },
    tempGerminacion: { min: 5, max: 25 },
    sensibilidadHeladas: 'baja',
    reqHidricoInicial: 'bajo',
    lluviaMinima: 30,
    diasLluviaNecesarios: 1,
    prioridadRiego: 5,
    faseLunarOptima: 'creciente',
    diasCosecha: 160,
    etapasFenologicas: [
      { nombre: "Emergencia", duracionDias: 10, requerimientoAgua: "bajo" },
      { nombre: "Roseta", duracionDias: 40, requerimientoAgua: "bajo" },
      { nombre: "Encañado/Floración", duracionDias: 50, requerimientoAgua: "medio" },
      { nombre: "Granado", duracionDias: 40, requerimientoAgua: "bajo" },
      { nombre: "Maduración", duracionDias: 20, requerimientoAgua: "bajo" }
    ],
    requerimientosSuelo: {
      ph: { min: 6.0, max: 8.5 },
      textura: "Arenoso-franco, tolera suelos salinos",
      drenaje: "Drenaje moderado, soporta sequía extrema"
    },
    densidadSiembra: {
      plantasPorHectarea: 80000,
      distanciaSiembra: "0.25m x 0.5m (sobre sembrado controlado)"
    },
    planFertilizacion: {
      nitrogeno: "Bajo",
      fosforo: "Medio",
      potasio: "Medio",
      nota: "Exigente en fósforo. Evitar exceso de nitrógeno"
    },
    manejoFitosanitario: {
      plagasComunes: ["Ticona (Eurysacca)", "Gusano de la panoja", "Pulgón"],
      enfermedadesComunes: ["Mancha de Ascochyta", "Mildiu", "Oidio"]
    },
    rendimientoEsperado: {
      toneladasPorHectarea: 1.5
    }
  },

  // --- COSTA / TROPICAL ---
  {
    nombre: 'Arroz',
    nombreCientifico: 'Oryza sativa',
    categoria: 'cereal',
    descripcion: 'Base de la dieta costeña (Guayas, Los Ríos). Requiere inundación.',
    tempOptima: { min: 22, max: 32 },
    tempGerminacion: { min: 20, max: 40 },
    sensibilidadHeladas: 'critica',
    reqHidricoInicial: 'muy_alto',
    lluviaMinima: 200,
    diasLluviaNecesarios: 6,
    prioridadRiego: 1,
    faseLunarOptima: 'creciente',
    diasCosecha: 120,
    etapasFenologicas: [
      { nombre: "Germinación", duracionDias: 10, requerimientoAgua: "muy_alto" },
      { nombre: "Macollamiento", duracionDias: 30, requerimientoAgua: "muy_alto" },
      { nombre: "Embuchamiento", duracionDias: 30, requerimientoAgua: "muy_alto" },
      { nombre: "Floración/Espigado", duracionDias: 30, requerimientoAgua: "alto" },
      { nombre: "Llenado", duracionDias: 15, requerimientoAgua: "medio" },
      { nombre: "Maduración", duracionDias: 15, requerimientoAgua: "bajo" }
    ],
    requerimientosSuelo: {
      ph: { min: 5.0, max: 6.5 },
      textura: "Arcilloso pesado (franco-arcilloso)",
      drenaje: "Impermeable para mantener lámina de agua"
    },
    densidadSiembra: {
      plantasPorHectarea: 250,
      distanciaSiembra: "Siembra al vuelo o en surcos a 20cm"
    },
    planFertilizacion: {
      nitrogeno: "Muy Alto",
      fosforo: "Medio",
      potasio: "Medio",
      nota: "N fraccionado (3 aplicaciones). Silicio fortalece tallo"
    },
    manejoFitosanitario: {
      plagasComunes: ["Arenal (Tagosodes)", "Gusano de Cogollo", "Chinche"],
      enfermedadesComunes: ["Piriculariosis", "Mancha Blanca", "Añublo de la Vaina"]
    },
    rendimientoEsperado: {
      toneladasPorHectarea: 8
    }
  },
  {
    nombre: 'Plátano (Verde/Macho)',
    nombreCientifico: 'Musa balbisiana',
    categoria: 'frutal',
    descripcion: 'Variedad Barraganete (El Carmen). Más rústico que el banano.',
    tempOptima: { min: 24, max: 32 },
    tempGerminacion: { min: 20, max: 35 },
    sensibilidadHeladas: 'critica',
    reqHidricoInicial: 'alto',
    lluviaMinima: 100,
    diasLluviaNecesarios: 4,
    prioridadRiego: 2,
    faseLunarOptima: 'creciente',
    diasCosecha: 300,
    etapasFenologicas: [
      { nombre: "Desarrollo de hijuelos", duracionDias: 60, requerimientoAgua: "medio" },
      { nombre: "Desarrollo vegetativo", duracionDias: 120, requerimientoAgua: "alto" },
      { nombre: "Floración", duracionDias: 60, requerimientoAgua: "alto" },
      { nombre: "Llenado de racimo", duracionDias: 90, requerimientoAgua: "alto" }
    ],
    requerimientosSuelo: {
      ph: { min: 5.5, max: 7.0 },
      textura: "Franco-arcilloso",
      drenaje: "Buen drenaje, más tolerante a humedad que banano"
    },
    densidadSiembra: {
      plantasPorHectarea: 800,
      distanciaSiembra: "3.5m x 3.5m"
    },
    planFertilizacion: {
      nitrogeno: "Alto",
      fosforo: "Medio",
      potasio: "Alto",
      nota: "Similar al banano pero menos exigente"
    },
    manejoFitosanitario: {
      plagasComunes: ["Picudo Negro", "Gusano Cogollero"],
      enfermedadesComunes: ["Sigatoka Negra", "Mal de Panamá"]
    },
    rendimientoEsperado: {
      toneladasPorHectarea: 35
    }
  },
  {
    nombre: 'Maracuyá',
    nombreCientifico: 'Passiflora edulis',
    categoria: 'frutal',
    descripcion: 'Fruta de la pasión. Trepadora vigorosa.',
    tempOptima: { min: 22, max: 28 },
    tempGerminacion: { min: 20, max: 30 },
    sensibilidadHeladas: 'alta',
    reqHidricoInicial: 'medio',
    lluviaMinima: 80,
    diasLluviaNecesarios: 3,
    prioridadRiego: 3,
    faseLunarOptima: 'creciente',
    diasCosecha: 240,
    etapasFenologicas: [
      { nombre: "Establecimiento", duracionDias: 60, requerimientoAgua: "medio" },
      { nombre: "Crecimiento vegetativo", duracionDias: 90, requerimientoAgua: "medio" },
      { nombre: "Floración continua", duracionDias: 90, requerimientoAgua: "alto" }
    ],
    requerimientosSuelo: {
      ph: { min: 5.5, max: 6.5 },
      textura: "Franco-arenoso",
      drenaje: "Excelente drenaje, raíces sensibles a asfixia"
    },
    densidadSiembra: {
      plantasPorHectarea: 2000,
      distanciaSiembra: "3.0m entre hileras, 2.0m entre plantas (tutorado)"
    },
    planFertilizacion: {
      nitrogeno: "Alto",
      fosforo: "Medio",
      potasio: "Alto",
      nota: "K fundamental para calidad de jugo y azúcar"
    },
    manejoFitosanitario: {
      plagasComunes: ["Ácaros", "Gusano defoliador", "Mosca blanca"],
      enfermedadesComunes: ["Fusariosis", "Antracnosis", "Virus del Mosaico"]
    },
    rendimientoEsperado: {
      toneladasPorHectarea: 15
    }
  },
  {
    nombre: 'Pitahaya',
    nombreCientifico: 'Selenicereus megalanthus',
    categoria: 'frutal',
    descripcion: 'Fruta del Dragón (Palora). Cactácea epífita.',
    tempOptima: { min: 18, max: 26 },
    tempGerminacion: { min: 20, max: 30 },
    sensibilidadHeladas: 'media',
    reqHidricoInicial: 'bajo',
    lluviaMinima: 40,
    diasLluviaNecesarios: 2,
    prioridadRiego: 4,
    faseLunarOptima: 'llena',
    diasCosecha: 365,
    etapasFenologicas: [
      { nombre: "Enraizamiento", duracionDias: 60, requerimientoAgua: "bajo" },
      { nombre: "Crecimiento", duracionDias: 180, requerimientoAgua: "bajo" },
      { nombre: "Inducción floral", duracionDias: 30, requerimientoAgua: "muy_bajo" },
      { nombre: "Floración/Fructificación", duracionDias: 120, requerimientoAgua: "medio" }
    ],
    requerimientosSuelo: {
      ph: { min: 5.5, max: 6.5 },
      textura: "Franco-arenoso muy drenado",
      drenaje: "Drenaje excesivo, cero tolerancia a encharcamiento"
    },
    densidadSiembra: {
      plantasPorHectarea: 1600,
      distanciaSiembra: "4.0m x 2.5m (poste tutorado)"
    },
    planFertilizacion: {
      nitrogeno: "Medio",
      fosforo: "Medio",
      potasio: "Alto",
      nota: "Suspender riego en inducción floral. K mejora coloración"
    },
    manejoFitosanitario: {
      plagasComunes: ["Gusano barrenador", "Cochinillas", "Araña roja"],
      enfermedadesComunes: ["Antracnosis", "Pudrición de raíz (exceso agua)", "Mancha bacteriana"]
    },
    rendimientoEsperado: {
      toneladasPorHectarea: 12
    }
  },
  {
    nombre: 'Tomate de Árbol',
    nombreCientifico: 'Solanum betaceum',
    categoria: 'frutal',
    descripcion: 'Frutal andino de clima templado.',
    tempOptima: { min: 14, max: 22 },
    tempGerminacion: { min: 15, max: 25 },
    sensibilidadHeladas: 'alta',
    reqHidricoInicial: 'medio',
    lluviaMinima: 60,
    diasLluviaNecesarios: 3,
    prioridadRiego: 3,
    faseLunarOptima: 'creciente',
    diasCosecha: 240,
    etapasFenologicas: [
      { nombre: "Vivero", duracionDias: 90, requerimientoAgua: "medio" },
      { nombre: "Crecimiento vegetativo", duracionDias: 120, requerimientoAgua: "medio" },
      { nombre: "Floración", duracionDias: 30, requerimientoAgua: "alto" }
    ],
    requerimientosSuelo: {
      ph: { min: 5.5, max: 7.0 },
      textura: "Franco-arcilloso",
      drenaje: "Buen drenaje"
    },
    densidadSiembra: {
      plantasPorHectarea: 1100,
      distanciaSiembra: "3.0m x 3.0m"
    },
    planFertilizacion: {
      nitrogeno: "Medio",
      fosforo: "Medio",
      potasio: "Medio",
      nota: "Balanceado NPK. Materia orgánica importante"
    },
    manejoFitosanitario: {
      plagasComunes: ["Polilla del Tomate de Árbol", "Ácaros", "Trips"],
      enfermedadesComunes: ["Antracnosis", "Phytophthora", "Mosaico"]
    },
    rendimientoEsperado: {
      toneladasPorHectarea: 20
    }
  },
  {
    nombre: 'Aguacate (Hass)',
    nombreCientifico: 'Persea americana',
    categoria: 'frutal',
    descripcion: 'Oro verde de la sierra norte. Sensible a encharcamientos.',
    tempOptima: { min: 16, max: 24 },
    tempGerminacion: { min: 18, max: 28 },
    sensibilidadHeladas: 'media',
    reqHidricoInicial: 'medio',
    lluviaMinima: 70,
    diasLluviaNecesarios: 2,
    prioridadRiego: 2,
    faseLunarOptima: 'creciente',
    diasCosecha: 730,
    etapasFenologicas: [
      { nombre: "Juvenil", duracionDias: 730, requerimientoAgua: "medio" },
      { nombre: "Floración/Fructificación", duracionDias: 180, requerimientoAgua: "alto" }
    ],
    requerimientosSuelo: {
      ph: { min: 5.5, max: 7.0 },
      textura: "Franco-arenoso drenado",
      drenaje: "Drenaje excelente, raíces muy sensibles a asfixia"
    },
    densidadSiembra: {
      plantasPorHectarea: 300,
      distanciaSiembra: "6.0m x 6.0m (adulto)"
    },
    planFertilizacion: {
      nitrogeno: "Medio",
      fosforo: "Bajo",
      potasio: "Alto",
      nota: "Zn y B importantes. Evitar calcáreos"
    },
    manejoFitosanitario: {
      plagasComunes: ["Barrenadores", "Trips", "Ardillas"],
      enfermedadesComunes: ["Tristeza del Aguacate", "Antracnosis", "Pudrición de raíz"]
    },
    rendimientoEsperado: {
      toneladasPorHectarea: 10
    }
  },
  {
    nombre: 'Cebolla Colorada',
    nombreCientifico: 'Allium cepa',
    categoria: 'hortaliza',
    descripcion: 'Bulbo para consumo. Santa Elena y Sierra.',
    tempOptima: { min: 18, max: 28 },
    tempGerminacion: { min: 15, max: 30 },
    sensibilidadHeladas: 'baja',
    reqHidricoInicial: 'medio',
    lluviaMinima: 40,
    diasLluviaNecesarios: 2,
    prioridadRiego: 3,
    faseLunarOptima: 'menguante',
    diasCosecha: 110,
    etapasFenologicas: [
      { nombre: "Germinación", duracionDias: 10, requerimientoAgua: "medio" },
      { nombre: "Hojas", duracionDias: 60, requerimientoAgua: "alto" },
      { nombre: "Engrosamiento bulbo", duracionDias: 35, requerimientoAgua: "medio" },
      { nombre: "Maduración", duracionDias: 15, requerimientoAgua: "bajo" }
    ],
    requerimientosSuelo: {
      ph: { min: 6.0, max: 7.0 },
      textura: "Franco-arenoso suelto",
      drenaje: "Buen drenaje, suelo profundo"
    },
    densidadSiembra: {
      plantasPorHectarea: 600000,
      distanciaSiembra: "Directa: surcos 0.3m entre líneas"
    },
    planFertilizacion: {
      nitrogeno: "Alto",
      fosforo: "Alto",
      potasio: "Alto",
      nota: "Reducir N en engrosamiento para evitar bulbos verdes"
    },
    manejoFitosanitario: {
      plagasComunes: ["Trips", "Pulgón", "Minador de hoja"],
      enfermedadesComunes: ["Pudrición de cuello (Botrytis)", "Mildiu", "Púrpura de la cebolla"]
    },
    rendimientoEsperado: {
      toneladasPorHectarea: 25
    }
  }
];

// ---------------------------------------------------------
// 3. LÓGICA DE EJECUCIÓN (SEED)
// ---------------------------------------------------------
async function seedDatabase() {
  try {
    console.log('🌱 Conectando a MongoDB para sembrar conocimientos agronómicos...');
    
    // Conectar a la base de datos
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/PlantDetectorDB';
    await mongoose.connect(mongoURI);
    console.log(`✅ Conectado a BD: ${mongoose.connection.name}`);

    let actualizados = 0;

    for (const data of cultivosEcuador) {
      // Upsert: Crea si no existe, actualiza si existe
      await Cultivo.findOneAndUpdate(
        { nombre: data.nombre }, 
        data, 
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      actualizados++;
      process.stdout.write(`.`); // Feedback visual
    }

    console.log(`\n\n🌾 ¡Proceso Terminado!`);
    console.log(`📦 Cultivos procesados: ${actualizados}`);
    console.log(`🧠 Base de conocimientos actualizada con datos técnicos.`);
    
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Error Crítico:', error);
    process.exit(1);
  }
}

// Ejecutar
seedDatabase();