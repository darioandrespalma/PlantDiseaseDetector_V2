require('dotenv').config(); 
const express = require('express');
const http = require('http'); 
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const { Server } = require('socket.io');
const connectDB = require('./config/db');

// --- Importación de Controladores ---
const cultivoController = require('./controllers/cultivoController');

// --- Importación de Rutas ---
const authRoutes = require('./routes/auth');
const predictRoutes = require('./routes/predict');
const climateRoutes = require('./routes/climate');
const loteRoutes = require('./routes/lotes'); // ✅ Solo una vez
const taskRoutes = require('./routes/tasks');      
const dashboardRoutes = require('./routes/dashboard');
const newsRoutes = require('./routes/news');
const Bulletin = require('./models/Bulletin'); // Modelo para ruta inline

// --- Configuración Inicial ---
const app = express();
const httpServer = http.createServer(app); 

// 🟢 CONFIGURACIÓN PUERTO: Usa el del .env (3000)
const PORT = process.env.PORT || 3000;

// 🟢 CORS ROBUSTO: Permite Angular en localhost y 127.0.0.1
const allowedOrigins = [
  'http://localhost:4200',
  'http://127.0.0.1:4200',
  process.env.FRONTEND_URL
].filter(Boolean);

// --- Conexión a Base de Datos ---
connectDB();

// --- Configuración de Socket.IO ---
const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

app.set('io', io);

// Eventos de WebSockets
io.on('connection', (socket) => {
  console.log(`🔌 Cliente conectado: ${socket.id}`);
  socket.on('join_room', (userId) => {
    socket.join(`user_${userId}`);
  });
});

// --- Middlewares Globales ---
app.use(helmet({ crossOriginResourcePolicy: false })); 
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(morgan('dev')); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// --- Archivos Estáticos ---
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- Definición de Endpoints (API) ---
app.use('/api/auth', authRoutes);
app.use('/api/predict', predictRoutes); 
app.use('/api/climate', climateRoutes);
app.use('/api/lotes', loteRoutes);
app.use('/api/tasks', taskRoutes);         
app.use('/api/dashboard', dashboardRoutes); 
app.use('/api/news', newsRoutes);

// ✅ RUTA CULTIVOS (Necesaria para el selector del mapa)
const routerCultivos = express.Router();
routerCultivos.get('/', cultivoController.obtenerCultivos);
app.use('/api/cultivos', routerCultivos);

// --- Ruta Boletín ---
app.get('/api/bulletin', async (req, res) => {
  try {
    const news = await Bulletin.find().sort({ fechaPublicacion: -1 }).limit(10);
    res.json(news);
  } catch (err) {
    res.status(500).json({ message: 'Error obteniendo noticias' });
  }
});

// --- Health Check ---
app.get('/', (req, res) => {
  res.send(`🌿 Plant Disease Detector V2 API - Running on Port ${PORT}`);
});

// --- Cron Jobs ---
require('./jobs/recomendacionJob'); 

// --- Manejo de Errores Global ---
app.use((err, req, res, next) => {
  console.error('🔥 Error:', err.stack);
  res.status(500).json({ success: false, message: 'Error interno', error: err.message });
});

// --- Iniciar Servidor ---
// Escuchamos en 0.0.0.0 para asegurar visibilidad en la red local
httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`=================================`);
  console.log(`🚀 Servidor corriendo en puerto: ${PORT}`);
  console.log(`🔗 Orígenes permitidos: ${allowedOrigins.join(', ')}`);
  console.log(`=================================`);
});