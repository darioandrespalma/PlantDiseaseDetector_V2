# 🌱 PlantDiseaseDetector V2 - Guía Completa

## 📖 Inicio Rápido (Setup Completo)

Este proyecto consta de **3 servicios independientes** que deben ejecutarse simultáneamente:

### 1️⃣ Backend API (Node.js)
```bash
cd backend-api
npm install
npm run seed          # ⚠️ IMPORTANTE: Carga los cultivos iniciales
npm run dev           # Escucha en http://localhost:5000
```

### 2️⃣ Frontend App (Angular)
```bash
cd frontend-app
npm install
npm start             # Abre http://localhost:4200
```

### 3️⃣ Servicio IA (Python)
```bash
cd ia-service-python
python -m venv venv
source venv/bin/activate  # o: venv\Scripts\activate en Windows
pip install -r requirements.txt
python app.py             # Escucha en http://localhost:5001
```

### ✅ Resultado
Abre tu navegador en `http://localhost:4200` y ¡listo!

---

## 📁 Archivos Importantes

Cada carpeta tiene su propio README con documentación detallada:

- **[README.md](./README.md)** - Este archivo (overview general)
- **[backend-api/README.md](./backend-api/README.md)** - API REST y endpoints
- **[frontend-app/README.md](./frontend-app/README.md)** - Aplicación Angular
- **[ia-service-python/README.md](./ia-service-python/README.md)** - Servicio de IA

---

## 🏗️ Arquitectura General

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Angular 20)                     │
│              http://localhost:4200                           │
├─────────────────────────────────────────────────────────────┤
│                         WebSocket                            │
├─────────────────────────────────────────────────────────────┤
│                   Backend API (Express)                      │
│              http://localhost:5000                           │
├─────────┬─────────────────────────────────┬─────────────────┤
│         │                                 │                 │
│   MongoDB                    Python IA Service          Socket.IO
│  (Datos)              http://localhost:5001            (Tiempo Real)
└─────────────────────────────────────────────────────────────┘
```

### Flujo de Datos

```
Usuario carga imagen → Frontend envía a Backend → Backend envía a IA
                    ↓                              ↓
                   JWT                     OpenCV + Keras
                   (Auth)                  (Predicción)
                    ↓                              ↓
            Backend valida              IA retorna resultado
            Base de datos               (enfermedad + confianza)
                    ↓                              ↓
                 MongoDB          Backend almacena predicción
                                           ↓
                        Frontend recibe (WebSocket)
                        Muestra resultado al usuario
```

---

## 🔑 Conceptos Clave

### 1. **JWT (JSON Web Tokens)**
- Token de autenticación generado en login
- Se envía en header: `Authorization: Bearer {token}`
- Protege rutas del backend
- Se almacena en `localStorage` del navegador

### 2. **WebSockets (Socket.IO)**
- Comunicación bidireccional en tiempo real
- Backend notifica al frontend de predicciones completadas
- Actualización instantánea de datos

### 3. **Modelos de IA**
- **Banano**: Detecta 4 enfermedades (Cordana, Pestalotiopsis, Sigatoka)
- **Arroz**: Detecta 3 enfermedades (Mancha Marrón, Tizón)
- **Café**: Detecta 3 enfermedades (Roya, Minador)

### 4. **MongoDB**
- Base de datos NoSQL
- Colecciones: Users, Lotes, Predictions, Cultivos
- Requerida para ejecutar el backend

---

## 📚 Estructura de Datos Clave

### Usuario
```json
{
  "_id": "ObjectId",
  "username": "agricultor01",
  "email": "agricultor@example.com",
  "password": "hash_bcrypt",
  "createdAt": "2024-01-14T10:30:00Z"
}
```

### Lote (Parcela)
```json
{
  "_id": "ObjectId",
  "nombre": "Parcela Norte",
  "usuario": "ObjectId",
  "cultivo": "ObjectId",
  "fechaSiembra": "2024-01-10T00:00:00Z",
  "area": 1000,
  "ubicacion": { "lat": 4.5231, "lon": -75.5123 },
  "estadoSalud": "saludable",
  "historial": [
    {
      "tipo": "riego",
      "titulo": "Riego mañana",
      "descripcion": "Riego completo de la parcela",
      "fecha": "2024-01-14T15:30:00Z"
    }
  ]
}
```

### Predicción
```json
{
  "_id": "ObjectId",
  "crop": "banana",
  "prediction": "pestalotiopsis",
  "confidence": 0.9847,
  "classes": {
    "cordana": 0.0056,
    "healthy": 0.0018,
    "pestalotiopsis": 0.9847,
    "sigatoka": 0.0079
  },
  "timestamp": "2024-01-14T15:30:45.123Z"
}
```

---

## 🚀 Casos de Uso Principales

### Caso 1: Nuevo Usuario se Registra
```
1. Usuario accede a http://localhost:4200/register
2. Completa: username, email, contraseña
3. POST /api/auth/register (Backend)
4. Backend crea usuario en MongoDB
5. Retorna JWT token
6. Frontend guarda token en localStorage
7. Redirige a /app/dashboard
```

### Caso 2: Detectar Enfermedad en Planta
```
1. Usuario sube imagen en /app/detection
2. Selecciona cultivo (ej: Banano)
3. Frontend realiza POST /api/predict (multipart/form-data)
4. Backend recibe imagen y cultivo
5. Backend envía imagen a IA Service
6. IA Service (Python):
   - Carga imagen con OpenCV
   - Pasa por red neuronal Keras
   - Retorna predicción + confianza
7. Backend almacena en MongoDB (Predictions)
8. Backend emite WebSocket → Frontend
9. Frontend muestra resultado en /app/result
10. Usuario puede guardar en historial del lote
```

### Caso 3: Ver Recomendaciones
```
1. Usuario va a /app/recomendacion
2. Frontend solicita /api/recommendations/{loteId}
3. Backend consulta:
   - Datos climáticos
   - Fase lunar actual (librería 'lune')
   - Historial del lote
   - Enfermedad última detectada
4. Backend genera recomendaciones personalizadas
5. Retorna a Frontend
6. Frontend muestra recomendaciones ordenadas por urgencia
```

---

## ⚙️ Variables de Entorno

### Backend (.env)
```env
# Frontend Origin
FRONTEND_URL=http://localhost:4200

# Database
MONGO_URI=mongodb://localhost:27017/plant_disease_detector

# JWT
JWT_SECRET=tu_clave_super_secreta_cambiar_en_produccion
JWT_EXPIRE=7d

# Server
PORT=5000
NODE_ENV=development

# IA Service
IA_SERVICE_URL=http://localhost:5001
```

### Frontend (environment.development.ts)
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api',
  socketUrl: 'http://localhost:5000',
  iaServiceUrl: 'http://localhost:5001'
};
```

---

## 🧪 Testing y Debugging

### Verificar que todo está conectado

```bash
# 1. Backend activo?
curl http://localhost:5000/api/cultivos

# 2. Frontend en navegador?
http://localhost:4200

# 3. IA Service activo?
curl http://localhost:5001/health

# 4. MongoDB corriendo?
# Windows: services.msc → MongoDB
# Linux: sudo systemctl status mongod
# Mac: brew services list | grep mongo
```

### Logs Útiles

**Backend**: Abre consola/terminal donde corre `npm run dev`
- Busca: `Server running on port 5000`
- Busca: `MongoDB connected`

**Frontend**: Abre DevTools (F12)
- Console tab → busca errores
- Network tab → revisa requests HTTP
- Storage tab → localStorage contiene token

**IA Service**: Abre consola/terminal donde corre `python app.py`
- Busca: `Model loaded`
- Busca: `Running on http://0.0.0.0:5001`

---

## 🐛 Problemas Comunes y Soluciones

| Problema | Causa | Solución |
|----------|-------|----------|
| CORS error en frontend | Backend no acepta requests | Verifica FRONTEND_URL en .env |
| MongoDB connection failed | MongoDB no está instalado/corriendo | Instala MongoDB o inicia el servicio |
| IA predictions fail | Modelos no existen en `models/` | Descarga los modelos `.h5` y `.pkl` |
| Port 5000 en uso | Otro proceso usando puerto | Cambia PORT en .env a 5001, 5002, etc |
| Token expirado | JWT expirado después de 7 días | Usuario debe hacer login nuevamente |
| WebSocket not connecting | Backend no tiene Socket.IO activado | Verifica `server.js` línea que crea `io` |

---

## 📊 Stack Tecnológico Completo

| Componente | Tecnología | Versión | Puerto |
|-----------|-----------|---------|--------|
| Frontend | Angular | 20.3.0 | 4200 |
| Backend | Node.js + Express | 5.1.0 | 5000 |
| Base de Datos | MongoDB | - | 27017 |
| IA | Python + Flask | - | 5001 |
| ML | Keras/TensorFlow | - | - |
| Auth | JWT | 9.0.2 | - |
| Tiempo Real | Socket.IO | 4.8.1 | - |
| Mapas | Leaflet | 1.9.4 | - |
| UI | Angular Material | 20.2.11 | - |

---

## 🔐 Seguridad

✅ **Implementado:**
- Contraseñas hasheadas con bcrypt
- JWT para autenticación
- CORS configurado
- Helmet para headers HTTP
- Validación de entrada

⚠️ **Para Producción:**
- [ ] Cambiar JWT_SECRET a algo más seguro
- [ ] Usar HTTPS/TLS
- [ ] Configurar CORS con dominio específico
- [ ] Agregar rate limiting
- [ ] Agregar autenticación de 2 factores
- [ ] Usar variables de entorno seguras

---

## 🚀 Deployment (Producción)

### Frontend (Vercel/Netlify)
```bash
npm run build
# Subir carpeta dist/frontend-app/ a Vercel/Netlify
```

### Backend (Heroku/AWS/Railway)
```bash
npm start
# Configurar variables de entorno en plataforma
```

### IA Service (AWS/Google Cloud)
```bash
pip install -r requirements.txt
python app.py
# O usar Docker
```

---

## 📈 Performance Tips

- Lazy loading en rutas Angular ✅
- Caching de datos en servicios
- Índices en MongoDB para búsquedas
- Compresión gzip en backend
- Minificación en build producción

---

## 📞 Soporte y Documentación

1. **README específico de cada módulo:**
   - [Backend API](./backend-api/README.md)
   - [Frontend App](./frontend-app/README.md)
   - [IA Service](./ia-service-python/README.md)

2. **Comandos útiles:**
   ```bash
   # Backend
   npm run seed              # Cargar cultivos iniciales
   npm run dev              # Modo desarrollo
   
   # Frontend
   npm start               # Servidor desarrollo
   npm run build           # Compilar producción
   
   # IA
   python app.py          # Iniciar servicio
   ```

3. **Debugging:**
   - F12 en navegador → Console/Network
   - Revisa logs en terminal de backend
   - Usa `curl` para testear endpoints

---

## 🎯 Roadmap Futuro

- [ ] Agregar más cultivos y modelos
- [ ] Integración con APIs de clima en tiempo real (OpenWeatherMap)
- [ ] Exportación de reportes (PDF)
- [ ] Notificaciones por email/SMS
- [ ] App móvil nativa (React Native/Flutter)
- [ ] Análisis predictivo avanzado
- [ ] Integración con sensores IoT
- [ ] Machine Learning mejorado con fine-tuning

---

## 📄 Licencia

ISC

---

## 👨‍💻 Autor

Dario

---

## 📅 Información General

- **Fecha de Creación**: 14 de Enero de 2026
- **Última Actualización**: 14 de Enero de 2026
- **Versión**: 2.0
- **Estado**: En desarrollo

---

## 🤝 Contribuir

Para contribuir al proyecto:
1. Crea un branch: `git checkout -b feature/nueva-funcionalidad`
2. Haz commits descriptivos
3. Push a tu branch
4. Crea un Pull Request

---

**¡Gracias por usar PlantDiseaseDetector V2!** 🌱
