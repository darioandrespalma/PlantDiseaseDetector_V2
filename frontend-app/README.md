# Frontend App - Plant Disease Detector V2

## 📱 Descripción

Aplicación web moderna desarrollada con **Angular 20** que proporciona una interfaz intuitiva para:

- 🔐 Autenticación de usuarios
- 🌾 Gestión de lotes y fincas
- 📸 Carga y análisis de imágenes
- 📊 Visualización de resultados
- 🗺️ Mapas interactivos
- 📅 Calendario lunar
- 💡 Sistema de recomendaciones
- 🎨 Diseño responsive con Material Design

---

## 🚀 Instalación Rápida

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo
npm start
```

La aplicación estará disponible en `http://localhost:4200`

---

## 📋 Scripts Disponibles

```bash
npm start              # Inicia servidor de desarrollo (puerto 4200)
npm run build          # Compilar para producción
npm run watch          # Compilación en modo watch
npm test               # Ejecutar tests unitarios con Karma
npm run test:coverage  # Tests con cobertura de código
npm run lint           # Ejecutar linter (si configurado)
ng generate component  # Generar nuevo componente Angular
ng generate service    # Generar nuevo servicio
```

---

## 🏗️ Estructura de Carpetas

```
frontend-app/
├── src/
│   ├── app/
│   │   ├── animations/
│   │   │   └── auth-animations.ts        # Animaciones de login/register
│   │   │
│   │   ├── components/
│   │   │   ├── biblioteca/               # Biblioteca de cultivos
│   │   │   ├── dashboard/                # Panel principal
│   │   │   ├── detection/                # Detector de enfermedades
│   │   │   ├── finca/                    # Gestión de lotes/fincas
│   │   │   ├── login/                    # Autenticación
│   │   │   ├── lunar-calendar/           # Calendario lunar
│   │   │   ├── main-layout/              # Layout principal con navbar
│   │   │   ├── map-selector/             # Selector de ubicación (Leaflet)
│   │   │   ├── recomendacion/            # Recomendaciones
│   │   │   ├── register/                 # Registro de usuarios
│   │   │   ├── result/                   # Resultados de predicción
│   │   │   └── tareas/                   # Bitácora de tareas
│   │   │
│   │   ├── guards/
│   │   │   └── auth-guard.ts             # Protección de rutas
│   │   │
│   │   ├── interceptors/
│   │   │   └── auth.interceptor.ts       # Inyección de JWT en requests
│   │   │
│   │   ├── services/
│   │   │   ├── auth.ts                   # Autenticación
│   │   │   ├── climate.ts                # Datos climáticos
│   │   │   ├── finca.service.ts          # Gestión de lotes
│   │   │   ├── predict.ts                # Predicciones de IA
│   │   │   ├── theme.ts                  # Temas de UI
│   │   │   ├── toast.ts                  # Notificaciones
│   │   │   └── websocket.ts              # WebSockets
│   │   │
│   │   ├── app.ts                        # Componente raíz
│   │   └── app.routes.ts                 # Enrutamiento
│   │
│   ├── environments/
│   │   └── environment.development.ts    # Variables de entorno
│   │
│   ├── styles.scss                       # Estilos globales
│   ├── custom-theme.scss                 # Tema Material Design personalizado
│   ├── index.html                        # HTML principal
│   └── main.ts                           # Bootstrap de la aplicación
│
├── angular.json                          # Configuración de Angular CLI
├── tsconfig.json                         # Configuración TypeScript
├── package.json
└── README.md
```

---

## 🧩 Componentes Principales

### 1. **Login Component** - Inicio de Sesión
- Formulario de email/contraseña
- Validación de entrada
- Animaciones suaves
- Enlace a registro
- Manejo de errores

### 2. **Register Component** - Registro de Usuarios
- Formulario completo (username, email, contraseña)
- Validación en tiempo real
- Confirmación de contraseña
- Redirección a login tras registro exitoso

### 3. **Dashboard Component** - Panel Principal
- Resumen de lotes del usuario
- Estadísticas de salud
- Historial reciente de predicciones
- Gráficos visuales
- Accesos rápidos

### 4. **Finca Component** - Gestión de Lotes
- Listado de lotes/parcelas del usuario
- Crear nuevo lote (modal/formulario)
- Editar información del lote
- Eliminar lote
- Mapa con ubicaciones de lotes
- Estado de salud visual (semáforo)

### 5. **Detection Component** - Detector de Enfermedades
- Selección de cultivo (Banano, Arroz, Café)
- Upload de imagen (drag & drop soportado)
- Preview de imagen
- Selección de lote
- Envío a backend para análisis
- Barra de progreso durante procesamiento

### 6. **Result Component** - Resultados
- Visualización de predicción
- Gráfico de confianza
- Lista de probabilidades por clase
- Detalles de la enfermedad
- Historial de predicciones del lote

### 7. **Recomendacion Component** - Sistema de Recomendaciones
- Listado de recomendaciones personalizadas
- Recomendaciones por fase lunar
- Recomendaciones climáticas
- Marcar por urgencia (alta, media, baja)
- Filtrado y búsqueda

### 8. **Tareas Component** - Bitácora de Eventos
- Timeline de actividades del lote
- Tipos: riego, fertilizante, plaga, enfermedad, cosecha, nota
- Agregar nuevo evento
- Filtrar por tipo
- Fechas y descripción

### 9. **Lunar Calendar Component** - Calendario Lunar
- Visualización de fases lunares
- Recomendaciones por fase
- Calendario interactivo para seleccionar fechas
- Información astronómica

### 10. **Biblioteca Component** - Información de Cultivos
- Base de conocimiento de cultivos
- Enfermedades por cultivo
- Síntomas y características
- Tratamientos recomendados
- Búsqueda y filtrado

### 11. **Map Selector Component** - Selector de Ubicación
- Mapa interactivo con Leaflet
- Selección de coordenadas (click en mapa)
- Búsqueda de direcciones
- Mostrar coordenadas (lat/lon)
- Múltiples marcadores

### 12. **Main Layout Component** - Estructura Principal
- Navbar con usuario conectado
- Sidebar con menú de navegación
- Botón de logout
- Responde a breakpoints móvil/desktop

---

## 🔐 Autenticación

### AuthService

```typescript
// Métodos principales
login(email: string, password: string): Observable<AuthResponse>
register(username: string, email: string, password: string): Observable<AuthResponse>
logout(): void
getCurrentUser(): User | null
getToken(): string | null
isAuthenticated(): boolean
```

### AuthGuard

Protege rutas que requieren autenticación:

```typescript
// Automáticamente redirige a login si no está autenticado
```

### AuthInterceptor

Inyecta automáticamente token JWT en headers de todos los requests al backend.

---

## 🌐 Servicios Principales

| Servicio | Función |
|----------|---------|
| **AuthService** | Autenticación, login, registro, manejo de sesión |
| **PredictService** | Subida de imágenes y predicciones de IA |
| **FincaService** | CRUD de lotes, historial, eventos |
| **ClimateService** | Obtener datos climáticos y pronósticos |
| **WebSocketService** | Conexión en tiempo real con servidor |
| **ThemeService** | Gestión de temas (claro/oscuro) |
| **ToastService** | Notificaciones tipo toast |

---

## 🛣️ Rutas de la Aplicación

```
/login                          → Login Component
/register                       → Register Component
/app                           → Main Layout (protegido)
├── /app/dashboard             → Dashboard Component
├── /app/finca                 → Finca Component
├── /app/detection             → Detection Component
├── /app/result                → Result Component
├── /app/tareas                → Tareas Component
├── /app/recomendacion         → Recomendacion Component
├── /app/biblioteca            → Biblioteca Component
└── /app/lunar-calendar        → Lunar Calendar Component
```

---

## 🎨 Estilos y Temas

- **Material Design 3** con Angular Material 20
- **Tema personalizado** en `custom-theme.scss`
- **Responsive** con CSS Grid y Flexbox
- **Animaciones suaves** con Angular Animations
- **Modo claro/oscuro** configurable

---

## 🔄 Comunicación en Tiempo Real

Usa **Socket.IO** para:
- Notificaciones de predicciones completadas
- Actualizaciones de estado de lotes
- Sincronización de datos entre usuarios

---

## 📊 Flujos Principales

### Flujo: Registrar y Login
1. Usuario accede a `/register`
2. Completa formulario (username, email, password)
3. AuthService.register() → POST `/api/auth/register`
4. Backend crea usuario, retorna token
5. Token guardado en localStorage
6. Redirección a `/app/dashboard`

### Flujo: Detectar Enfermedad
1. Usuario va a `/app/detection`
2. Selecciona cultivo (Banano/Arroz/Café)
3. Sube imagen de hoja
4. PredictService.uploadImage() → POST `/api/predict`
5. Backend envía a servicio IA (Python)
6. IA retorna predicción con confianza
7. Resultado guardado en MongoDB
8. Redirige a `/app/result`
9. WebSocket notifica actualización
10. Historial se actualiza automáticamente

### Flujo: Gestionar Lotes
1. Usuario va a `/app/finca`
2. FincaService obtiene sus lotes
3. Se muestran en cards/tabla
4. Click en "Crear lote" → Modal
5. Selecciona cultivo y cultivo
6. MapSelectorComponent → elige ubicación en mapa
7. POST `/api/lotes` crea nuevo lote
8. Actualiza lista automáticamente
9. ToastService muestra confirmación

---

## 🧪 Testing

### Ejecutar Tests

```bash
npm test                      # Unit tests
npm run test:coverage         # Con cobertura de código
```

### Archivos de Test

Todos los componentes y servicios incluyen `.spec.ts` para tests unitarios.

---

## 📦 Dependencias Principales

```json
{
  "@angular/core": "20.3.0",
  "@angular/material": "20.2.11",
  "@angular/animations": "20.3.9",
  "@angular/router": "20.3.0",
  "@angular/forms": "20.3.0",
  "rxjs": "7.8.0",
  "socket.io-client": "4.8.1",
  "leaflet": "1.9.4",
  "ngx-toastr": "19.1.0"
}
```

---

## 🚀 Build para Producción

```bash
npm run build

# Output: dist/frontend-app/
# Servir con: npm run serve:ssr:frontend-app
```

---

## 🐛 Troubleshooting

| Problema | Solución |
|----------|----------|
| Port 4200 en uso | `ng serve --port 4201` |
| CORS errors | Verifica FRONTEND_URL en backend .env |
| Token expirado | Usuario se redirige a login automáticamente |
| WebSocket no conecta | Verifica backend corriendo en puerto 5000 |

---

## 📱 Responsive Design

- ✅ Móvil (xs: <600px)
- ✅ Tablet (sm: 600-1279px)
- ✅ Desktop (lg: 1280px+)

---

## 🎯 Buenas Prácticas

✅ **Hacer**
- Usar typed forms
- Unsubscribe con OnDestroy
- Usar async pipe en templates
- Componentes pequeños
- Lazy loading

❌ **No Hacer**
- Subscriptions sin unsubscribe
- Lógica en templates
- Componentes gigantes
- Variables globales

---

**Versión**: 0.0.0  
**Última actualización**: 14 de Enero de 2026
