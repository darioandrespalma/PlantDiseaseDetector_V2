# Backend API - Plant Disease Detector V2

## 📌 Descripción

API REST desarrollada con **Node.js + Express** que proporciona toda la lógica de negocio para la aplicación PlantDiseaseDetector. Gestiona:

- 🔐 Autenticación de usuarios (JWT)
- 📸 Procesamiento de predicciones de IA
- 🌾 Gestión de lotes/parcelas
- 🌤️ Datos climáticos
- 💾 Persistencia en MongoDB
- 🔄 Comunicación en tiempo real (WebSockets)

---

## 🚀 Instalación Rápida

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
echo "FRONTEND_URL=http://localhost:4200
MONGO_URI=mongodb://localhost:27017/plant_disease_detector
JWT_SECRET=tu_clave_secreta
PORT=5000
IA_SERVICE_URL=http://localhost:5001" > .env

# 3. Cargar cultivos iniciales (IMPORTANTE)
npm run seed

# 4. Iniciar servidor en desarrollo
npm run dev
```

El servidor estará disponible en `http://localhost:5000`

---

## 📋 Scripts Disponibles

```bash
npm start           # Inicia servidor en producción
npm run dev         # Inicia con nodemon (desarrollo, recarga automática)
npm run seed        # Carga cultivos iniciales en BD
npm run seed:force  # Borra y recarga todos los cultivos
npm test            # Ejecuta suite de tests
```

---

## 🏗️ Estructura de Carpetas

```
backend-api/
├── config/
│   └── db.js                    # Configuración de conexión MongoDB
├── controllers/
│   ├── authController.js        # Lógica de autenticación
│   ├── climateController.js     # Gestión de datos climáticos
│   ├── loteController.js        # CRUD de lotes
│   └── predictionController.js  # Procesamiento de predicciones
├── middleware/
│   ├── authMiddleware.js        # Validación de JWT
│   └── uploadMiddleware.js      # Configuración de Multer
├── models/
│   ├── User.js                  # Esquema de Usuario
│   ├── Lote.js                  # Esquema de Lote/Parcela
│   ├── Cultivo.js               # Esquema de Cultivo
│   └── Prediction.js            # Esquema de Predicción
├── routes/
│   ├── auth.js                  # Rutas: /api/auth/*
│   ├── climate.js               # Rutas: /api/climate/*
│   ├── lotes.js                 # Rutas: /api/lotes/*
│   └── predict.js               # Rutas: /api/predict/*
├── services/
│   └── matchingEngine.js        # Motor de recomendaciones
├── jobs/
│   └── recomendacionJob.js      # Tareas programadas (cron)
├── scripts/
│   └── seedCultivos.js          # Población inicial de BD
├── uploads/                     # Carpeta para imágenes subidas
├── server.js                    # Punto de entrada principal
├── test_env.js                  # Configuración de tests
├── package.json
└── .env                         # Variables de entorno (crear)
```

---

## 🔐 Autenticación (JWT)

### Endpoints de Autenticación

#### Registro
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "agricultor01",
  "email": "agricultor@example.com",
  "password": "contraseña123"
}

Response: 201
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "_id": "...",
    "username": "agricultor01",
    "email": "agricultor@example.com"
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "agricultor@example.com",
  "password": "contraseña123"
}

Response: 200
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { ... }
}
```

#### Obtener Perfil
```http
GET /api/auth/me
Authorization: Bearer {token}

Response: 200
{
  "_id": "...",
  "username": "agricultor01",
  "email": "agricultor@example.com",
  "createdAt": "2024-01-14T10:30:00Z"
}
```

---

## 🌾 Lotes (Parcelas/Cultivos)

### Listar Lotes del Usuario
```http
GET /api/lotes
Authorization: Bearer {token}

Response: 200
{
  "lotes": [
    {
      "_id": "...",
      "nombre": "Parcela Norte",
      "cultivo": { "_id": "...", "nombre": "Banano" },
      "area": 1000,
      "estadoSalud": "saludable",
      "ubicacion": { "lat": 4.5231, "lon": -75.5123 },
      "fechaSiembra": "2024-01-10T00:00:00Z"
    }
  ]
}
```

### Crear Lote
```http
POST /api/lotes
Authorization: Bearer {token}
Content-Type: application/json

{
  "nombre": "Parcela Norte",
  "cultivo": "{cultivoId}",
  "area": 1000,
  "ubicacion": {
    "lat": 4.5231,
    "lon": -75.5123
  },
  "fechaSiembra": "2024-01-10"
}

Response: 201
{ _id, nombre, cultivo, ... }
```

### Obtener Lote por ID
```http
GET /api/lotes/{loteId}
Authorization: Bearer {token}

Response: 200
{ ... detalles del lote ... }
```

### Actualizar Lote
```http
PUT /api/lotes/{loteId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "nombre": "Parcela Norte Actualizada",
  "area": 1200,
  "estadoSalud": "riesgo"
}

Response: 200
{ ... lote actualizado ... }
```

### Eliminar Lote
```http
DELETE /api/lotes/{loteId}
Authorization: Bearer {token}

Response: 200
{ message: "Lote eliminado" }
```

### Agregar Evento al Historial
```http
POST /api/lotes/{loteId}/historial
Authorization: Bearer {token}
Content-Type: application/json

{
  "tipo": "enfermedad",
  "titulo": "Detección de Sigatoka",
  "descripcion": "Sigatoka Negra detectada en hojas"
}

Response: 201
{ ... historial actualizado ... }
```

---

## 📸 Predicciones (IA)

### Realizar Predicción
```http
POST /api/predict
Authorization: Bearer {token}
Content-Type: multipart/form-data

Form Fields:
- image: [archivo de imagen]
- crop: "banana" | "rice" | "coffee"
- loteId: "{loteId}"

Response: 200
{
  "_id": "...",
  "crop": "banana",
  "prediction": "pestalotiopsis",
  "confidence": 0.9847,
  "classes": {
    "cordana": 0.01,
    "healthy": 0.002,
    "pestalotiopsis": 0.9847,
    "sigatoka": 0.0033
  },
  "timestamp": "2024-01-14T15:30:00Z"
}
```

### Obtener Predicción por ID
```http
GET /api/predict/{predictionId}
Authorization: Bearer {token}

Response: 200
{ ... detalles de la predicción ... }
```

### Listar Predicciones de un Lote
```http
GET /api/predict/lote/{loteId}
Authorization: Bearer {token}

Response: 200
{
  "predictions": [ ... ]
}
```

---

## 🌤️ Clima

### Obtener Datos Climáticos
```http
GET /api/climate/datos?lat=4.5231&lon=-75.5123
Authorization: Bearer {token}

Response: 200
{
  "temperatura": 28.5,
  "humedad": 75,
  "presion": 1013.25,
  "velocidad_viento": 12,
  "precipitacion": 5.2,
  "ubicacion": "Medellín, Colombia"
}
```

### Obtener Pronóstico
```http
GET /api/climate/forecast?lat=4.5231&lon=-75.5123&days=7
Authorization: Bearer {token}

Response: 200
{
  "forecast": [ ... datos de 7 días ... ]
}
```

---

## 🌙 Recomendaciones

### Obtener Recomendaciones (Auto)
```http
GET /api/recommendations/{loteId}
Authorization: Bearer {token}

Response: 200
{
  "recommendations": [
    {
      "tipo": "riego",
      "titulo": "Riego recomendado",
      "descripcion": "Condiciones secas detectadas",
      "urgencia": "alta"
    },
    {
      "tipo": "lunar",
      "titulo": "Fase lunar óptima",
      "descripcion": "Luna creciente ideal para siembra",
      "urgencia": "media"
    }
  ]
}
```

---

## 📊 Cultivos (Catálogo)

### Listar Cultivos
```http
GET /api/cultivos
Authorization: Bearer {token}

Response: 200
{
  "cultivos": [
    {
      "_id": "...",
      "nombre": "Banano",
      "descripcion": "Plátano de exportación",
      "enfermedades": ["cordana", "pestalotiopsis", "sigatoka"]
    },
    {
      "_id": "...",
      "nombre": "Arroz",
      "descripcion": "Arroz de riego",
      "enfermedades": ["ManchaMarron", "Tizon"]
    },
    {
      "_id": "...",
      "nombre": "Café",
      "descripcion": "Café Arábigo",
      "enfermedades": ["rust", "miner"]
    }
  ]
}
```

---

## ⚙️ Configuración de Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# FRONTEND
FRONTEND_URL=http://localhost:4200

# DATABASE
MONGO_URI=mongodb://localhost:27017/plant_disease_detector

# JWT
JWT_SECRET=tu_clave_super_secreta_aqui_cambiar_en_produccion
JWT_EXPIRE=7d

# SERVER
PORT=5000
NODE_ENV=development

# IA SERVICE
IA_SERVICE_URL=http://localhost:5001

# OPTIONAL
LOG_LEVEL=info
```

---

## 🔄 WebSockets (Socket.IO)

El servidor implementa WebSockets para comunicación en tiempo real:

### Eventos del Cliente al Servidor

```javascript
// Conectar
socket.on('connect', () => {
  console.log('Conectado al servidor');
});

// Notificar nueva predicción
socket.emit('prediction', { loteId, predictionData });

// Actualizar estado de lote
socket.emit('updateLoteStatus', { loteId, status });
```

### Eventos del Servidor al Cliente

```javascript
// Recibir predicción completada
socket.on('predictionComplete', (data) => {
  console.log('Predicción:', data);
});

// Recibir actualización de lote
socket.on('loteUpdated', (lote) => {
  console.log('Lote actualizado:', lote);
});
```

---

## 🛡️ Seguridad

### Middlewares de Seguridad

- **helmet**: Headers de seguridad HTTP
- **cors**: Control de origen cruzado
- **authMiddleware**: Validación de JWT en rutas protegidas
- **bcryptjs**: Hashing de contraseñas

### Validación de Entrada

Todas las rutas validan entrada. Ejemplo:

```javascript
// Validación automática en auth
- email: debe ser un email válido
- password: mínimo 6 caracteres
- username: no vacío
```

---

## 📝 Tareas Programadas

### RecomendacionJob (node-cron)

Se ejecuta automáticamente para:
- Generar recomendaciones diarias basadas en clima lunar
- Actualizar estado de salud de lotes
- Enviar notificaciones (WebSocket)

---

## 🧪 Testing

```bash
npm test
```

Nota: Tests deben estar configurados en `test_env.js`

---

## 🐛 Logging

El servidor usa **morgan** para logging de HTTP requests:

```
GET /api/lotes 200 12.345 ms - 1234
POST /api/auth/login 200 45.678 ms - 567
```

---

## 📱 Manejo de Archivos

### Uploads con Multer

- **Ruta**: `/backend-api/uploads/`
- **Tamaño máximo**: Configurable en `uploadMiddleware.js`
- **Tipos permitidos**: JPG, PNG, WebP (para imágenes de plantas)

---

## 🔗 Relaciones de Base de Datos

```
User (1) ──────── (N) Lote
                   │
                   ├─── (1) Cultivo
                   │
                   └─── (N) Prediction
                   │
                   └─── (N) Historial

Lote (1) ──────── (1) Cultivo
```

---

## 📊 Ejemplos Completos

### Flujo Completo: Crear Lote y Predecir

```bash
# 1. Registrar usuario
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "agricultor01",
    "email": "agri@example.com",
    "password": "pass123"
  }'

# Response: { token, user }
# Guardar token

# 2. Crear lote
curl -X POST http://localhost:5000/api/lotes \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Parcela A",
    "cultivo": "{cultivoIdBanano}",
    "area": 1000,
    "ubicacion": { "lat": 4.5, "lon": -75.5 }
  }'

# Response: { _id: "loteId", ... }

# 3. Realizar predicción
curl -X POST http://localhost:5000/api/predict \
  -H "Authorization: Bearer {token}" \
  -F "image=@/path/to/leaf.jpg" \
  -F "crop=banana" \
  -F "loteId=loteId"

# Response: { prediction, confidence, ... }

# 4. Ver recomendaciones
curl http://localhost:5000/api/recommendations/loteId \
  -H "Authorization: Bearer {token}"

# Response: { recommendations: [...] }
```

---

## 🚨 Códigos de Error Comunes

| Código | Mensaje | Solución |
|--------|---------|----------|
| 400 | Bad Request | Verifica JSON y parámetros |
| 401 | Unauthorized | Token inválido o expirado |
| 403 | Forbidden | No tienes permisos |
| 404 | Not Found | Recurso no existe |
| 500 | Server Error | Error en el servidor, revisa logs |

---

## 📈 Performance

- **Índices MongoDB**: Email y username en User para búsquedas rápidas
- **Paginación**: Implementada en listados
- **Caché**: Socket.IO para datos en tiempo real
- **Compresión**: Gzip habilitado en respuestas

---

## 🔧 Troubleshooting

### MongoDB no conecta
```bash
# Verificar que MongoDB esté corriendo
# Windows: services.msc → buscar MongoDB
# Linux: sudo systemctl status mongod
# Mac: brew services list | grep mongo
```

### Puerto 5000 en uso
```bash
# Cambiar puerto en .env
PORT=5001
```

### Token JWT expirado
```
Solicitar nuevo token con login
```

### CORS error
```
Verificar FRONTEND_URL en .env coincida con origen real
```

---

## 📞 Soporte

Para debugging:
1. Revisa logs de consola del servidor
2. Abre DevTools del navegador (F12) → Network tab
3. Verifica variables en .env
4. Consulta modelos en `/models/`

---

**Versión**: 1.0.0  
**Última actualización**: 14 de Enero de 2026
