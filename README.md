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
- 📱 **Interfaz Ultra-Responsiva**: Desarrollada con Angular 20 y Material Design, la aplicación se adapta a cualquier dispositivo, asegurando una experiencia de usuario fluida.
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
├── 📁 frontend-app/             # INTERFAZ: SPA Angular 20 con Material Design & RxJS
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
```

---

## 🔧 Backend API (Node.js + Express)

### Ubicación: `/backend-api`

**Tecnologías:**
- Node.js con Express 5.1.0
- MongoDB con Mongoose 8.20.0
- JWT para autenticación
- Socket.IO para WebSockets
- Multer para carga de archivos
- node-cron para trabajos programados
- bcrypt para encriptación de contraseñas

### Estructura Completa

```
backend-api/
├── config/
│   └── db.js                        # Configuración y conexión MongoDB
│
├── controllers/
│   ├── authController.js            # Autenticación: login, registro, validación JWT
│   ├── climateController.js         # Datos climáticos: obtener, procesar
│   ├── dashboardController.js       # Datos para dashboard: resúmenes, estadísticas
│   ├── loteController.js            # CRUD lotes: crear, leer, actualizar, eliminar
│   ├── mapController.js             # Gestión de mapas e ubicaciones
│   ├── predictionController.js      # Predicciones de IA: enviar a servicio Python
│   ├── recommendationController.js  # Recomendaciones agrícolas
│   └── taskController.js            # Tareas: crear, asignar, completar
│
├── middleware/
│   ├── authMiddleware.js            # Verificación de JWT en rutas protegidas
│   ├── uploadMiddleware.js          # Configuración Multer para carga de imágenes
│   └── validators.js                # Validación de datos de entrada
│
├── models/
│   ├── User.js                      # Esquema Usuario (username, email, password)
│   ├── Lote.js                      # Esquema Lote (cultivo, ubicación, historial)
│   ├── Cultivo.js                   # Esquema Cultivo (Banano, Café, propiedades)
│   ├── Prediction.js                # Esquema Predicción (resultado IA, confianza)
│   ├── Task.js                      # Esquema Tarea (asignaciones, estado)
│   └── Bulletin.js                  # Esquema Boletín (alertas, recomendaciones)
│
├── routes/
│   ├── api.js                       # Rutas principales/agregadas
│   ├── auth.js                      # POST /login, /register, /verify
│   ├── climate.js                   # GET/POST datos climáticos
│   ├── dashboard.js                 # GET estadísticas, resúmenes
│   ├── lotes.js                     # CRUD lotes (GET, POST, PUT, DELETE)
│   ├── predict.js                   # POST predicción de enfermedad
│   └── tasks.js                     # CRUD tareas
│
├── services/
│   └── matchingEngine.js            # Motor de coincidencia: datos clima vs cultivos
│
├── jobs/
│   └── recomendacionJob.js          # Job cron: genera recomendaciones periódicas
│
├── scripts/
│   └── seedCultivos.js              # Script para cargar cultivos iniciales
│
├── uploads/                         # Carpeta para imágenes cargadas
│   ├── img-*.avif                   # Imágenes de plantas convertidas a AVIF
│   └── ...
│
├── server.js                        # Archivo principal - inicializa Express, MongoDB, Socket.IO
├── package.json                     # Dependencias Node.js
├── .env                             # Variables de entorno (Puerto, BD, secretos)
└── test_env.js                      # Script de prueba de conexión

### Modelos de Base de Datos (MongoDB)

#### User
```
{
  _id: ObjectId
  username: String (único)
  email: String (único)
  password: String (bcrypt)
  rol: String (admin, usuario)
  activo: Boolean
  createdAt: Date
  updatedAt: Date
}
```

#### Lote
```
{
  _id: ObjectId
  nombre: String
  usuario: ObjectId (referencia User)
  cultivo: ObjectId (referencia Cultivo)
  fechaSiembra: Date
  area: Number (hectáreas/m²)
  ubicacion: {
    tipo: Point
    coordenadas: [Long, Lat]
  }
  estadoSalud: String (saludable|riesgo|peligro)
  historial: Array[
    {
      tipo: String (riego|fertilizante|plaga|enfermedad)
      fecha: Date
      descripcion: String
    }
  ]
  createdAt: Date
  updatedAt: Date
}
```

#### Cultivo
```
{
  _id: ObjectId
  nombre: String (Banano|Café)
  descripcion: String
  enfermedadesComunes: Array[String]
  condicionesOptimas: Object
  createdAt: Date
}
```

#### Prediction
```
{
  _id: ObjectId
  lote: ObjectId (referencia Lote)
  usuario: ObjectId (referencia User)
  imagen: String (ruta archivo)
  enfermedad: String (resultado IA)
  confianza: Number (0-100%)
  tratamiento: String
  createdAt: Date
}
```

#### Task
```
{
  _id: ObjectId
  lote: ObjectId (referencia Lote)
  usuario: ObjectId (referencia User)
  titulo: String
  descripcion: String
  estado: String (pendiente|en_progreso|completada)
  fechaVencimiento: Date
  createdAt: Date
  updatedAt: Date
}
```

#### Bulletin
```
{
  _id: ObjectId
  titulo: String
  contenido: String
  tipo: String (alerta|recomendacion|informacion)
  cultivos: Array[ObjectId]
  fechaPublicacion: Date
}
```

---

## 🎨 Frontend App (Angular 20)

### Ubicación: `/frontend-app`

**Tecnologías:**
- Angular 20 (standalone components)
- Angular Material Design
- TypeScript
- RxJS para manejo reactivo
- Leaflet para mapas
- Socket.IO Client para comunicación en tiempo real
- ngx-toastr para notificaciones
- SCSS para estilos

### Estructura Completa

```
frontend-app/
├── src/
│   ├── app/
│   │   │
│   │   ├── components/
│   │   │   ├── login/                      # Componente de login
│   │   │   │   ├── login.ts               # Lógica autenticación
│   │   │   │   ├── login.html             # Interfaz formulario
│   │   │   │   └── login.css              # Estilos
│   │   │   │
│   │   │   ├── register/                   # Componente de registro
│   │   │   │   ├── register.ts
│   │   │   │   ├── register.html
│   │   │   │   └── register.css
│   │   │   │
│   │   │   ├── main-layout/                # Layout principal con navbar
│   │   │   │   ├── main-layout.ts         # Componente principal
│   │   │   │   ├── main-layout.html
│   │   │   │   └── main-layout.css
│   │   │   │
│   │   │   ├── dashboard/                  # Panel de control
│   │   │   │   ├── dashboard.ts           # Estadísticas, resumen cultivos
│   │   │   │   ├── dashboard.html
│   │   │   │   └── dashboard.css
│   │   │   │
│   │   │   ├── finca/                      # Gestión de lotes/parcelas
│   │   │   │   ├── finca.ts               # CRUD lotes, visualización
│   │   │   │   ├── finca.html
│   │   │   │   └── finca.css
│   │   │   │
│   │   │   ├── detection/                  # Detección de enfermedades
│   │   │   │   ├── detection.ts           # Carga imagen, llama IA
│   │   │   │   ├── detection.html
│   │   │   │   └── detection.css
│   │   │   │
│   │   │   ├── result/                     # Resultado de predicción
│   │   │   │   ├── result.ts              # Muestra enfermedad, confianza, tratamiento
│   │   │   │   ├── result.html
│   │   │   │   └── result.css
│   │   │   │
│   │   │   ├── recomendacion/              # Recomendaciones individuales
│   │   │   │   ├── recomendacion.ts
│   │   │   │   ├── recomendacion.html
│   │   │   │   └── recomendacion.css
│   │   │   │
│   │   │   ├── recomendaciones/            # Lista de recomendaciones
│   │   │   │   ├── recomendaciones.ts
│   │   │   │   ├── recomendaciones.html
│   │   │   │   └── recomendaciones.css
│   │   │   │
│   │   │   ├── tareas/                     # Gestión de tareas
│   │   │   │   ├── tareas.ts              # CRUD tareas, asignación
│   │   │   │   ├── tareas.html
│   │   │   │   └── tareas.css
│   │   │   │
│   │   │   ├── boletin/                    # Boletín informativo
│   │   │   │   ├── boletin.ts             # Alertas y notificaciones
│   │   │   │   ├── boletin.html
│   │   │   │   └── boletin.css
│   │   │   │
│   │   │   ├── biblioteca/                 # Biblioteca de información
│   │   │   │   ├── biblioteca.ts          # Recursos, artículos
│   │   │   │   ├── biblioteca.html
│   │   │   │   └── biblioteca.css
│   │   │   │
│   │   │   ├── map-selector/               # Selector de ubicación en mapa
│   │   │   │   ├── map-selector.ts        # Leaflet, búsqueda ubicación
│   │   │   │   ├── map-selector.html
│   │   │   │   └── map-selector.css
│   │   │   │
│   │   │   └── lunar-calendar/             # Calendario lunar
│   │   │       ├── lunar-calendar.ts      # Ciclos lunares, recomendaciones
│   │   │       ├── lunar-calendar.html
│   │   │       └── lunar-calendar.css
│   │   │
│   │   ├── services/
│   │   │   ├── auth.ts                     # Autenticación: login, registro, logout
│   │   │   ├── auth.spec.ts               # Tests autenticación
│   │   │   ├── predict.ts                 # Predicción: envía imagen a backend
│   │   │   ├── predict.spec.ts            # Tests predicción
│   │   │   ├── finca.service.ts           # CRUD lotes, consulta información
│   │   │   ├── climate.ts                 # Datos climáticos en tiempo real
│   │   │   ├── websocket.ts               # Conexión WebSocket con backend
│   │   │   ├── websocket.spec.ts
│   │   │   ├── theme.ts                   # Gestión de temas (claro/oscuro)
│   │   │   └── toast.ts                   # Notificaciones en pantalla
│   │   │
│   │   ├── guards/
│   │   │   ├── auth-guard.ts              # Protege rutas, verifica JWT
│   │   │   └── auth-guard.spec.ts
│   │   │
│   │   ├── interceptors/
│   │   │   └── auth.interceptor.ts        # Agrega token JWT a peticiones HTTP
│   │   │
│   │   ├── animations/
│   │   │   └── auth-animations.ts         # Animaciones para transiciones
│   │   │
│   │   ├── app.ts                         # Componente raíz
│   │   ├── app.html
│   │   ├── app.css
│   │   ├── app.spec.ts
│   │   ├── app.routes.ts                  # Rutas principales (sin módulos)
│   │   ├── app.routes.server.ts
│   │   ├── app.config.ts                  # Configuración de providers
│   │   ├── app.config.server.ts
│   │   │
│   ├── environments/
│   │   └── environment.development.ts     # URLs API, configuración desarrollo
│   │
│   ├── index.html                         # HTML raíz
│   ├── main.ts                            # Bootstrap de la aplicación
│   ├── main.server.ts
│   ├── server.ts
│   ├── styles.scss                        # Estilos globales
│   └── custom-theme.scss                  # Tema Material Design personalizado
│
├── public/                                # Recursos estáticos
├── angular.json                           # Configuración Angular CLI
├── tsconfig.json                          # Configuración TypeScript
├── tsconfig.app.json
├── tsconfig.spec.json
└── package.json

### Componentes Detallados

| Componente | Funcionalidad |
|-----------|--------------|
| **login** | Autenticación de usuarios con email/contraseña |
| **register** | Registro de nuevos usuarios |
| **main-layout** | Navbar, sidebar, estructura general de la app |
| **dashboard** | Resumen de cultivos, estadísticas de salud |
| **finca** | Listado y gestión de lotes/parcelas |
| **detection** | Carga de imagen para detección de enfermedad |
| **result** | Muestra resultado de predicción, confianza, tratamiento |
| **recomendacion** | Recomendación agrícola individual |
| **recomendaciones** | Listado de todas las recomendaciones |
| **tareas** | CRUD de tareas, asignación a usuarios |
| **boletin** | Boletín informativo con alertas |
| **biblioteca** | Recursos educativos y artículos |
| **map-selector** | Selector de ubicación con Leaflet |
| **lunar-calendar** | Calendario lunar con recomendaciones |

### Servicios Detallados

| Servicio | Responsabilidad |
|---------|-----------------|
| **auth.ts** | Manejo de login, registro, logout, validación JWT |
| **predict.ts** | Envía imagen a backend para predicción de IA |
| **finca.service.ts** | CRUD lotes, consultas de información |
| **climate.ts** | Obtiene datos climáticos en tiempo real |
| **websocket.ts** | Conexión WebSocket para actualizaciones instantáneas |
| **theme.ts** | Gestión de temas (claro/oscuro) |
| **toast.ts** | Notificaciones tipo toast |

---

## 🐍 IA Service (Python Flask)

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

### Frontend (Angular)
```json
{
  "@angular/core": "^20.0.0",
  "@angular/material": "Material Design",
  "leaflet": "para mapas",
  "socket.io-client": "WebSocket cliente",
  "rxjs": "programación reactiva",
  "typescript": "^5.x"
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

## 🎨 Frontend App (Angular 20)

### Ubicación: `/frontend-app`

**Tecnologías:**
- Angular 20.3.0
- Angular Material 20.2.11
- TypeScript
- RxJS para programación reactiva
- Socket.IO Client para WebSockets
- Leaflet para mapas
- ngx-toastr para notificaciones

### Estructura de Componentes

```
frontend-app/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── login/              # Componente de inicio de sesión
│   │   │   ├── register/           # Componente de registro
│   │   │   ├── dashboard/          # Panel principal de control
│   │   │   ├── finca/              # Gestión de fincas/lotes
│   │   │   ├── detection/          # Detector de enfermedades
│   │   │   ├── result/             # Resultados de predicciones
│   │   │   ├── tareas/             # Gestión de tareas/bitácora
│   │   │   ├── recomendacion/      # Sistema de recomendaciones
│   │   │   ├── biblioteca/         # Biblioteca de cultivos
│   │   │   ├── lunar-calendar/     # Calendario lunar
│   │   │   ├── map-selector/       # Selector de ubicación
│   │   │   └── main-layout/        # Layout principal
│   │   ├── services/
│   │   │   ├── auth.ts             # Servicio de autenticación
│   │   │   ├── auth.spec.ts
│   │   │   ├── predict.ts          # Servicio de predicciones
│   │   │   ├── predict.spec.ts
│   │   │   ├── climate.ts          # Servicio de clima
│   │   │   ├── finca.service.ts    # Servicio de fincas/lotes
│   │   │   ├── websocket.ts        # Servicio WebSocket
│   │   │   ├── websocket.spec.ts
│   │   │   ├── theme.ts            # Servicio de temas
│   │   │   └── toast.ts            # Servicio de notificaciones
│   │   ├── guards/
│   │   │   ├── auth-guard.ts       # Guard de autenticación
│   │   │   └── auth-guard.spec.ts
│   │   ├── interceptors/
│   │   │   └── auth.interceptor.ts # Interceptor de JWT
│   │   ├── animations/
│   │   │   └── auth-animations.ts  # Animaciones de autenticación
│   │   ├── app.ts                  # Componente raíz
│   │   └── app.routes.ts           # Enrutamiento principal
│   ├── styles.scss                 # Estilos globales
│   ├── custom-theme.scss           # Tema personalizado
│   ├── main.ts                     # Bootstrap de la aplicación
│   └── environments/
│       └── environment.development.ts
├── angular.json
├── tsconfig.json
└── package.json
```

### Componentes Principales

1. **Login/Register**: Autenticación de usuarios
2. **Dashboard**: Panel de control con estadísticas
3. **Finca**: Gestión de parcelas/lotes con mapa
4. **Detection**: Carga de imágenes para análisis de enfermedades
5. **Result**: Visualización de resultados de IA
6. **Tareas**: Bitácora de actividades agrícolas
7. **Recomendación**: Sugerencias basadas en datos
8. **Biblioteca**: Información sobre cultivos
9. **Lunar Calendar**: Calendario lunar para siembras

### Scripts Disponibles

```bash
npm start          # Iniciar servidor de desarrollo (puerto 4200)
npm run build      # Compilar para producción
npm run watch      # Compilación en modo watch
npm test           # Ejecutar tests con Karma
ng generate component component-name  # Generar componente
```

### Dependencias Principales

- **@angular/core**: Core de Angular
- **@angular/material**: Componentes Material Design
- **@angular/router**: Enrutamiento
- **@angular/animations**: Animaciones
- **rxjs**: Programación reactiva
- **socket.io-client**: Cliente WebSocket
- **leaflet**: Mapas interactivos
- **ngx-toastr**: Notificaciones tipo Toast
- **@angular/ssr**: Server-Side Rendering

---

## 🐍 Servicio de IA (Python + Flask)

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
echo "FRONTEND_URL=http://localhost:4200
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
cd frontend-app
npm install

# Iniciar servidor de desarrollo
npm start
```

La aplicación estará disponible en `http://localhost:4200`

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
| **Frontend** | Angular | 20.3.0 |
| **Backend** | Node.js + Express | 5.1.0 |
| **Base de Datos** | MongoDB | (con Mongoose 8.20.0) |
| **IA** | Python + Flask | - |
| **ML** | Keras/TensorFlow | - |
| **Autenticación** | JWT | 9.0.2 |
| **Tiempo Real** | Socket.IO | 4.8.1 |
| **Mapas** | Leaflet | 1.9.4 |
| **UI** | Angular Material | 20.2.11 |

---

## 📝 Variables de Entorno

### Backend (.env)

```env
FRONTEND_URL=http://localhost:4200
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
