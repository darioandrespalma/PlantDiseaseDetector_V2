# PlantDiseaseDetector V2

## 📋 Descripción General

**PlantDiseaseDetector V2** es una aplicación web avanzada para la detección y análisis de enfermedades en plantas utilizando inteligencia artificial. El sistema integra aprendizaje automático para identificar enfermedades en diferentes cultivos (Banano y Café) y proporciona recomendaciones agrícolas basadas en condiciones climáticas y calendarios lunares.

### Características Principales

- 🤖 **Detección de Enfermedades**: Modelos de IA para identificar enfermedades en Banano y Café
- 🌍 **Gestión de Lotes**: Administración completa de parcelas/lotes de cultivo con ubicación geográfica
- 📊 **Monitoreo Climático**: Integración de datos climáticos en tiempo real para recomendaciones
- 🌙 **Calendario Lunar**: Sistema de recomendaciones basadas en ciclos lunares
- 👥 **Autenticación Segura**: Sistema de usuarios con JWT y contraseñas encriptadas
- 🔄 **Comunicación en Tiempo Real**: WebSockets para actualizaciones instantáneas
- 📱 **Interfaz Responsiva**: Aplicación moderna con Angular 20 y Material Design
- 🗺️ **Mapas Interactivos**: Selector de ubicación con Leaflet

---

## 🏗️ Estructura del Proyecto

### Carpetas Principales

```
PlantDiseaseDetector_V2/
├── backend-api/          # API REST con Node.js y Express
├── frontend-app/         # Aplicación Angular
└── ia-service-python/    # Servicio de IA con Flask y Keras
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

### Estructura de Carpetas

```
backend-api/
├── config/
│   └── db.js                    # Configuración de MongoDB
├── controllers/
│   ├── authController.js        # Control de autenticación
│   ├── climateController.js     # Control de datos climáticos
│   ├── loteController.js        # CRUD de lotes/parcelas
│   └── predictionController.js  # Control de predicciones de IA
├── middleware/
│   ├── authMiddleware.js        # Validación de JWT
│   └── uploadMiddleware.js      # Gestión de carga de archivos
├── models/
│   ├── User.js                  # Esquema de Usuario
│   ├── Lote.js                  # Esquema de Lote/Parcela
│   ├── Cultivo.js               # Esquema de Cultivo
│   └── Prediction.js            # Esquema de Predicciones
├── routes/
│   ├── auth.js                  # Rutas de autenticación
│   ├── climate.js               # Rutas de clima
│   ├── lotes.js                 # Rutas de lotes
│   └── predict.js               # Rutas de predicciones
├── services/
│   └── matchingEngine.js        # Motor de coincidencia de datos
├── jobs/
│   └── recomendacionJob.js      # Job programado de recomendaciones
├── scripts/
│   └── seedCultivos.js          # Script para cargar cultivos iniciales
├── server.js                    # Archivo principal del servidor
├── package.json
└── test_env.js
```

### Modelos de Base de Datos

#### User
- username (único)
- email (único)
- password (encriptada con bcrypt)
- Timestamps

#### Lote
- nombre
- usuario (referencia a User)
- cultivo (referencia a Cultivo)
- fechaSiembra
- area (en m² o hectáreas)
- ubicacion (lat/lon)
- estadoSalud (saludable, riesgo, peligro)
- historial (registro de eventos: riego, fertilizante, plagas, etc.)

#### Cultivo
- Banano
- Café
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
