require('dotenv').config(); // 1. Cargar variables de entorno al inicio
const express = require('express');
const http = require('http'); // Necesario para unir Express + Socket.IO
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const { Server } = require('socket.io');
const connectDB = require('./config/db');

// --- Importación de Modelos (para rutas inline) ---
const Bulletin = require('./models/Bulletin');

// --- Importación de Rutas ---
const authRoutes = require('./routes/auth');
const predictRoutes = require('./routes/predict');
const climateRoutes = require('./routes/climate');
const loteRoutes = require('./routes/lotes');
const taskRoutes = require('./routes/tasks');      // ✅ Nueva ruta: Tareas
const dashboardRoutes = require('./routes/dashboard'); // ✅ Nueva ruta: Dashboard

// --- Configuración Inicial ---
const app = express();
const httpServer = http.createServer(app); // Creamos el servidor HTTP envolviendo a Express
const PORT = process.env.PORT || 5000;
const FRONTEND_ORIGIN = process.env.FRONTEND_URL || 'http://localhost:4200';

// --- Conexión a Base de Datos ---
connectDB();

// --- Configuración de Socket.IO ---
const io = new Server(httpServer, {
  cors: {
    origin: FRONTEND_ORIGIN,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Guardamos 'io' en la app para usarlo en los controladores (req.app.get('io'))
app.set('io', io);

// Eventos de WebSockets
io.on('connection', (socket) => {
  console.log(`🔌 Cliente conectado: ${socket.id}`);

  // Unirse a sala personal (para notificaciones privadas)
  socket.on('join_room', (userId) => {
    socket.join(`user_${userId}`);
    console.log(`👤 Usuario unido a sala: user_${userId}`);
  });

  socket.on('disconnect', () => {
    console.log('❌ Cliente desconectado');
  });
});

// --- Middlewares Globales ---
app.use(helmet({ crossOriginResourcePolicy: false })); // Seguridad Headers (ajustado para cargar imágenes)
app.use(cors({
  origin: FRONTEND_ORIGIN,
  credentials: true
}));
app.use(morgan('dev')); // Logging de peticiones en consola
app.use(express.json()); // Parsear JSON body
app.use(express.urlencoded({ extended: true }));

// --- Servir Archivos Estáticos (Imágenes subidas) ---
// Permite acceder a http://localhost:5000/uploads/imagen.jpg
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- Definición de Endpoints (API) ---
app.use('/api/auth', authRoutes);
app.use('/api/predict', predictRoutes); // Este controlador ya maneja la lógica con Python
app.use('/api/climate', climateRoutes);
app.use('/api/lotes', loteRoutes);
app.use('/api/tasks', taskRoutes);         // ✅ CRUD de Tareas
app.use('/api/dashboard', dashboardRoutes); // ✅ Resumen para la Home

// --- Ruta Boletín (Inline por simplicidad) ---
app.get('/api/bulletin', async (req, res) => {
  try {
    // Obtener boletines recientes (últimos 10)
    const news = await Bulletin.find().sort({ fechaPublicacion: -1 }).limit(10);
    res.json(news);
  } catch (err) {
    console.error('Error boletín:', err);
    res.status(500).json({ message: 'Error obteniendo noticias' });
  }
});

// --- Health Check (Para verificar que el servidor vive) ---
app.get('/', (req, res) => {
  res.send('🌿 Plant Disease Detector V2 API - Online & Ready');
});

// --- Tareas Programadas (Cron Jobs) ---
// Se ejecuta en segundo plano (ej. recomendaciones diarias)
require('./jobs/recomendacionJob'); 

// --- Manejo de Errores Global ---
app.use((err, req, res, next) => {
  console.error('🔥 Error no controlado:', err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Error interno del servidor', 
    error: process.env.NODE_ENV === 'development' ? err.message : {} 
  });
});

// --- Iniciar Servidor ---
// ⚠️ IMPORTANTE: Usamos httpServer.listen, NO app.listen para que funcionen los Sockets
httpServer.listen(PORT, () => {
  console.log(`=================================`);
  console.log(`🚀 Servidor corriendo en puerto: ${PORT}`);
  console.log(`🔗 Frontend permitido: ${FRONTEND_ORIGIN}`);
  console.log(`📡 Socket.IO activo`);
  console.log(`=================================`);
});