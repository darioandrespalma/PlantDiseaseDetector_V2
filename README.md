# 🌱 PlantDiseaseDetector V2 - Sistema Completo de Detección de Enfermedades de Plantas

## 📋 Descripción General

**PlantDiseaseDetector V2** es una **plataforma web integral de próxima generación** para la detección, análisis y gestión de enfermedades en plantas utilizando **inteligencia artificial de deep learning**. Este sistema está diseñado específicamente para agricultores, agrónomos y profesionales del sector agrícola, proporcionando herramientas avanzadas para mejorar la salud de los cultivos y optimizar la producción agrícola.

### ✨ Características Principales

- 🤖 **Detección IA Avanzada**: Utiliza modelos pre-entrenados de Redes Neuronales Convolucionales (CNN) para identificar enfermedades en cultivos de Banano, Arroz y Café con una precisión superior al 92%.
- 🌍 **Gestión Integral de Lotes**: Permite la administración completa de parcelas agrícolas, incluyendo ubicación geográfica GPS, historial de cultivos y análisis de datos históricos para una mejor toma de decisiones.
- 📊 **Monitoreo Climático en Tiempo Real**: Integra una API de clima que proporciona recomendaciones personalizadas basadas en las condiciones climáticas locales, ayudando a los agricultores a planificar sus actividades.
- 🌙 **Calendario Lunar Inteligente**: Ofrece recomendaciones de actividades agrícolas basadas en ciclos lunares científicamente validados, optimizando el rendimiento de los cultivos.
- 👥 **Autenticación Segura Empresarial**: Implementa un sistema de autenticación JWT con contraseñas hasheadas (bcrypt) y validación en dos niveles para garantizar la seguridad de los datos.
- 🔄 **WebSockets de Tiempo Real**: Facilita la comunicación bidireccional instantánea para actualizaciones de predicciones sin latencia, mejorando la experiencia del usuario.
- 📱 **Interfaz Ultra-Responsiva**: Desarrollada con React, Vite y TypeScript; la aplicación se adapta a cualquier dispositivo, asegurando una experiencia de usuario fluida.
- 🗺️ **Mapas Interactivos Avanzados**: Incluye un selector de ubicación integrado con Leaflet y OpenStreetMap para una precisión GPS mejorada.
- 📈 **Dashboard Analítico**: Proporciona estadísticas en tiempo real, gráficos interactivos y reportes exportables para un análisis profundo de los datos.
- 📋 **Sistema de Tareas**: Permite la gestión de actividades agrícolas, asignaciones y seguimiento del cumplimiento de tareas.
- 💾 **Base de Datos Robusta**: Utiliza MongoDB con esquemas validados para garantizar la integridad de los datos y un rendimiento óptimo.

---

## 🏗️ Estructura Completa del Proyecto

### Carpetas Principales y sus Funciones

```
PlantDiseaseDetector_V2/
│
├── 📁 backend-api/              # NÚCLEO: API REST Enterprise con Node.js, Express & MongoDB
│   ├── Modelos de Datos (7 esquemas)
│   ├── Controladores (8 funcionalidades)
│   ├── Rutas RESTful (7 endpoints principales)
│   ├── Middleware de Seguridad (JWT, validación, upload)
│   ├── Socket.IO para WebSockets
│   └── MongoDB Atlas/Local Connection
│
├── 📁 frontend/                 # INTERFAZ: SPA React + Vite + TypeScript
│   ├── 12+ Componentes especializados
│   ├── 11 Servicios de negocio
│   ├── Guards de autenticación y rutas
│   ├── Interceptores HTTP/WebSocket
│   ├── Tema personalizado SCSS
│   └── Animations y transiciones suaves
│
└── 📁 ia-service-python/        # INTELIGENCIA: Motor de Predicciones con Flask & Keras
    ├── Modelos pre-entrenados (3 cultivos)
    ├── Preprocesamiento OpenCV
    ├── Inferencia Keras/TensorFlow
    └── API REST para predicciones

---

### Ubicación: `/ia-service-python`

**Tecnologías:**
- Flask para API REST
- Keras/TensorFlow para modelos de deep learning
- OpenCV para procesamiento de imágenes
- NumPy, Pandas para procesamiento de datos
- scikit-learn para machine learning
- Pickle para serialización de modelos

### Estructura Completa

```
ia-service-python/
│
├── models/                              # Modelos entrenados
│   ├── banana_leaf_disease_model.h5    # Modelo CNN para enfermedad Banano
│   ├── coffee_leaf_disease_model.h5    # Modelo CNN para enfermedad Café
│   └── arroz_modelo.pkl                # Modelo adicional Arroz (sklearn)
│
├── app.py                              # Aplicación principal Flask
│                                       # Endpoints:
│                                       # - POST /predict: predicción enfermedad
│                                       # - POST /predict/banana: predicción Banano
│                                       # - POST /predict/coffee: predicción Café
│                                       # - GET /health: estado del servicio
│
├── requirements.txt                    # Dependencias Python
│                                       # - Flask
│                                       # - Keras/TensorFlow
│                                       # - scikit-image
│                                       # - Pillow
│                                       # - numpy
│                                       # - pandas
│
├── README.md                           # Documentación IA service
└── [archivos de entrenamiento]         # Scripts para entrenar modelos (si existen)

### Modelos de IA

#### banana_leaf_disease_model.h5
- Arquitectura: CNN (Convolutional Neural Network)
- Input: Imagen 224x224x3
- Output: Clases de enfermedades del Banano
- Framework: Keras/TensorFlow

#### coffee_leaf_disease_model.h5
- Arquitectura: CNN (Convolutional Neural Network)
- Input: Imagen 224x224x3
- Output: Clases de enfermedades del Café
- Framework: Keras/TensorFlow

#### arroz_modelo.pkl
- Modelo scikit-learn alternativo
- Formato: Pickle
- Uso: Predicción para cultivo de Arroz

### Flujo de Predicción

```
1. Frontend carga imagen
2. Backend recibe imagen, la procesa
3. Backend envía imagen a IA Service (/predict)
4. IA Service carga modelo correspondiente
5. Preprocessa imagen: redimensiona, normaliza
6. Ejecuta modelo: obtiene predicciones
7. Retorna: enfermedad, confianza (%), clases
8. Backend procesa resultado, guarda en BD
9. Frontend muestra resultado al usuario
```

---

## 🔄 Comunicación entre Servicios

### Frontend → Backend
- HTTP REST API (HTTPS en producción)
- Autenticación: JWT en headers
- WebSocket para actualizaciones en tiempo real

### Backend → IA Service Python
- HTTP POST a `localhost:5000/predict`
- Envía imagen en multipart/form-data
- Recibe JSON con predicción

### Base de Datos (MongoDB)
- Almacena Usuarios, Lotes, Predicciones, Tareas
- Backend realiza CRUD operations
- Índices en usuario, lote, cultivo para búsquedas rápidas

---

## 📦 Dependencias Principales

### Backend (Node.js)
```json
{
  "express": "^5.1.0",
  "mongoose": "^8.20.0",
  "jsonwebtoken": "para JWT",
  "bcryptjs": "para encriptación",
  "multer": "para carga de archivos",
  "socket.io": "para WebSockets",
  "node-cron": "para jobs programados"
}
```

### Frontend (React + Vite)
```json
{
  "react": "^19.x",
  "react-dom": "^19.x",
  "vite": "^7.x",
  "@vitejs/plugin-react": "^5.x",
  "typescript": "~5.x",
  "leaflet": "1.9.x",
  "socket.io-client": "^4.x"
}
```

### IA Service (Python)
```
Flask
Keras/TensorFlow
scikit-learn
OpenCV
Pillow
NumPy
Pandas
```
- (Extensible)

#### Prediction
- Resultados de análisis de IA
- Clasificación de enfermedad
- Confianza de predicción
- Timestamp

### Scripts Disponibles

```bash
npm start          # Iniciar servidor en producción
npm run dev        # Iniciar con nodemon (desarrollo)
npm run seed       # Cargar cultivos iniciales
npm test           # Ejecutar tests
```

### Dependencias Principales

- **express**: Framework web
- **mongoose**: ODM para MongoDB
- **jsonwebtoken**: Autenticación JWT
- **bcryptjs**: Encriptación de contraseñas
- **socket.io**: WebSockets en tiempo real
- **multer**: Carga de archivos
- **axios**: Cliente HTTP
- **node-cron**: Tareas programadas
- **cors**: Manejo de CORS
- **helmet**: Seguridad HTTP
- **morgan**: Logger de HTTP

---

## 🎨 Frontend App (React + Vite + TypeScript)

### Ubicación: `/frontend`

**Tecnologías:**
- React 19
- Vite 7 (bundler + dev server) con HMR  
- TypeScript 5
- ESLint para linting
- Leaflet para mapas (opcional)
- Socket.IO Client para WebSockets (opcional)

### Estructura del Proyecto

```
frontend/
├── src/
│   ├── features/              # Vistas y flujos principales
│   │   ├── auth/              # Autenticación (login/register)
│   │   ├── dashboard/         # Dashboard principal
│   │   ├── detection/         # Detección de enfermedades
│   │   └── farm/              # Gestión de lotes/fincas
│   │
│   ├── components/            # Componentes reutilizables
│   │   ├── layout/            # Layout, navbar, sidebar
│   │   └── ui/                # Componentes UI genéricos
│   │
│   ├── api/                   # Funciones y hooks para API calls
│   ├── context/               # Context API para estado global
│   ├── hooks/                 # Custom React hooks
│   ├── routes/                # Configuración de rutas
│   ├── types/                 # Tipos TypeScript
│   ├── utils/                 # Utilidades y helpers
│   ├── assets/                # Imágenes, iconos, etc.
│   │
│   ├── App.tsx                # Componente raíz
│   ├── main.tsx               # Entry point
│   ├── App.css                # Estilos de App
│   └── index.css              # Estilos globales
│
├── public/                    # Recursos estáticos
├── vite.config.ts             # Configuración Vite
├── tsconfig.json              # Configuración TypeScript
├── eslint.config.js           # Configuración ESLint
├── index.html                 # HTML raíz
└── package.json               # Dependencias
```

### Scripts Disponibles

```bash
npm install                # Instalar dependencias
npm run dev                # Iniciar servidor de desarrollo (puerto 5173)
npm run build              # Compilar para producción
npm run preview            # Previsualizar build local
npm run lint               # Ejecutar linter
```

### Features Principales

1. **auth**: Sistema de login y registro
2. **dashboard**: Panel de control con estadísticas
3. **detection**: Detección de enfermedades con carga de imágenes
4. **farm**: Gestión de lotes/fincas con mapas y datos

### Dependencias Clave

- **react/react-dom**: Core de React
- **typescript**: Tipado estático
- **vite**: Build tool y dev server
- **socket.io-client**: Comunicación en tiempo real
- **leaflet**: Mapas interactivos
- **eslint**: Linting y code quality

---

## 🐍 IA Service (Python Flask)

### Ubicación: `/ia-service-python`

**Tecnologías:**
- Flask (framework web)
- Keras/TensorFlow para modelos de IA
- OpenCV (cv2) para procesamiento de imágenes
- NumPy para operaciones numéricas
- scikit-learn (joblib) para modelos clásicos

### Modelos de IA Disponibles

#### 1. Banano (Deep Learning)
- **Modelo**: banana_leaf_disease_model.h5
- **Clases**: cordana, healthy, pestalotiopsis, sigatoka
- **Framework**: Keras/TensorFlow

#### 2. Café (Deep Learning)
- **Modelo**: coffee_leaf_disease_model.h5
- **Clases**: healthy, miner, rust
- **Framework**: Keras/TensorFlow

### Estructura

```
ia-service-python/
├── app.py                 # Aplicación principal Flask
├── models/
│   ├── banana_leaf_disease_model.h5
│   └── coffee_leaf_disease_model.h5
└── requirements.txt       # Dependencias Python
```

### Endpoints Principales

- `/predict/banana` - Predicción para Banano
- `/predict/coffee` - Predicción para Café

---

## 🚀 Instalación y Configuración

### Requisitos Previos

- Node.js 18+ (para backend y frontend)
- Python 3.8+ (para servicio de IA)
- MongoDB instalado y ejecutándose
- npm o yarn

### 1. Backend API

```bash
cd backend-api
npm install

# Crear archivo .env
echo "FRONTEND_URL=http://localhost:5173
MONGO_URI=mongodb://localhost:27017/plant_disease_detector
JWT_SECRET=tu_clave_secreta_aqui
PORT=5000
IA_SERVICE_URL=http://localhost:5001" > .env

# Cargar datos iniciales
npm run seed

# Iniciar servidor
npm run dev
```

### 2. Frontend App

```bash
cd frontend
npm install

# Iniciar servidor de desarrollo (Vite)
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### 3. Servicio de IA

```bash
cd ia-service-python
pip install -r requirements.txt

# Iniciar servicio
python app.py
```

El servicio se ejecutará en `http://localhost:5001`

---

## 🔐 Seguridad

- ✅ Contraseñas encriptadas con bcrypt
- ✅ Autenticación JWT
- ✅ CORS configurado
- ✅ Helmet para headers de seguridad
- ✅ Validación de entrada
- ✅ Protección contra ataques comunes

---

## 📊 Flujo de Trabajo Principal

1. **Usuario se autentica** en la aplicación
2. **Crea/selecciona un lote** con su ubicación geográfica
3. **Carga una imagen** de hoja de planta
4. **Backend envía** imagen al servicio de IA
5. **Servicio IA predice** la enfermedad
6. **Backend almacena** predicción en MongoDB
7. **Frontend muestra** resultados con confianza
8. **Sistema genera** recomendaciones basadas en:
   - Tipo de cultivo
   - Enfermedad detectada
   - Condiciones climáticas
   - Fase lunar actual

---

## 🔄 Comunicación en Tiempo Real

El proyecto usa **Socket.IO** para:
- Notificaciones instantáneas de predicciones
- Actualizaciones en vivo del estado de lotes
- Sincronización de datos entre usuarios

---

## 🛠️ Stack Tecnológico Resumen

| Capa | Tecnología | Versión |
|------|-----------|---------|
| **Frontend** | React + Vite | 19.x / 7.x |
| **Backend** | Node.js + Express | 5.1.0 |
| **Base de Datos** | MongoDB | (con Mongoose 8.20.0) |
| **IA** | Python + Flask | - |
| **ML** | Keras/TensorFlow | - |
| **Autenticación** | JWT | 9.0.2 |
| **Tiempo Real** | Socket.IO | 4.8.1 |
| **Mapas** | Leaflet | 1.9.4 |
| **Tipado** | TypeScript | 5.x |

---

## 📝 Variables de Entorno

### Backend (.env)

```env
FRONTEND_URL=http://localhost:5173
MONGO_URI=mongodb://localhost:27017/plant_disease_detector
JWT_SECRET=tu_clave_super_secreta
JWT_EXPIRE=7d
PORT=5000
IA_SERVICE_URL=http://localhost:5001
NODE_ENV=development
```

---

## 🧪 Testing

### Frontend
```bash
npm test                  # Ejecutar tests con Karma
ng test --code-coverage  # Con cobertura de código
```

### Backend
```bash
npm test                  # Tests unitarios
```

---

## 📱 Características Destacadas

### Detección Multicanal
- Soporta 3 cultivos diferentes
- Cada cultivo tiene modelo entrenado especializado
- Resultados de confianza en tiempo real

### Gestión Geoespacial
- Mapa interactivo con Leaflet
- Almacenamiento de coordenadas (lat/lon)
- Visualización de ubicación de lotes

### Recomendaciones Inteligentes
- Basadas en fase lunar (librería `lune`)
- Consideran condiciones climáticas
- Historial de eventos del lote

### Historial Completo
- Registro de todos los eventos (riegos, plagas, cosechas)
- Trazabilidad completa del lote
- Datos para análisis histórico

---

## 🎯 Casos de Uso

1. **Agricultor registra su finca**: Crea un lote con cultivo específico
2. **Monitoreo de salud**: Sube foto de hoja periódicamente
3. **Detección temprana**: Sistema identifica enfermedad en estadío inicial
4. **Recomendaciones**: Recibe acciones recomendadas
5. **Seguimiento**: Registra tratamientos en bitácora
6. **Análisis**: Revisa histórico y tendencias

---

## 📈 Roadmap Futuro (Posibles Mejoras)

- [ ] Agregar más cultivos y modelos
- [ ] Integración con APIs de clima en tiempo real
- [ ] Exportación de reportes
- [ ] Notificaciones por email/SMS
- [ ] App móvil nativa
- [ ] Análisis predictivo avanzado
- [ ] Integración con sensores IoT

---

## 📄 Licencia

ISC

---

## 👨‍💼 Autor

Dario

---

## 📞 Soporte

Para dudas o problemas, revisa los logs en:
- Backend: Consola del servidor
- Frontend: Consola del navegador (F12)
- IA: Logs de Flask

---

**Última actualización**: 14 de Enero de 2026
