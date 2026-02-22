// backend-api/server.js
require('dotenv').config(); 
const express = require('express');
const http = require('http'); 
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const dailyJob = require('./jobs/dailyCheck');

// --- Importaciones ---
const cultivoController = require('./controllers/cultivoController');
const authRoutes = require('./routes/auth');
const predictRoutes = require('./routes/predict');
const climateRoutes = require('./routes/climate');
const loteRoutes = require('./routes/lotes');
const taskRoutes = require('./routes/tasks');       
const dashboardRoutes = require('./routes/dashboard');
const newsRoutes = require('./routes/news');
const farmRoutes = require('./routes/farmRoutes');
const Bulletin = require('./models/Bulletin'); 

// --- Configuración Inicial ---
const app = express();
const httpServer = http.createServer(app); 
const PORT = process.env.PORT || 3000;

// ==========================================
// 1. CORS (CRÍTICO: DEBE IR PRIMERO)
// ==========================================
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:4200',
  'http://127.0.0.1:5173',
  process.env.FRONTEND_URL
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('🚫 Origen bloqueado por CORS:', origin);
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// ==========================================
// 2. PARSEO Y LOGS (Lectura de datos)
// ==========================================
// MOVIDO AQUÍ: Necesitamos leer los datos antes de sanitizarlos
app.use(morgan('dev')); 
app.use(express.json({ limit: '10kb' })); 
app.use(express.urlencoded({ extended: true }));
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log('📁 Carpeta "uploads" creada exitosamente.');
}

app.use('/uploads', express.static(uploadDir));

// ==========================================
// 3. SEGURIDAD (Sanitización y Protección)
// ==========================================

// Helmet
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// ✅ MOVIDO AQUÍ (CORRECCIÓN DEL ERROR):
// Ahora que express.json ya corrió, mongoSanitize puede leer y limpiar req.body y req.query sin romperse.
// app.use(mongoSanitize());

// Rate Limiter Global
const globalLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, 
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api', globalLimiter);

// Rate Limiter Auth
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { success: false, message: 'Demasiados intentos. Bloqueado por 15 min.' }
});

// ==========================================
// 4. CONEXIONES (DB & SOCKETS)
// ==========================================
connectDB();

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true
  }
});
app.set('io', io);

io.on('connection', (socket) => {
  console.log(`🔌 Cliente conectado: ${socket.id}`);
  socket.on('join_room', (userId) => {
    socket.join(`user_${userId}`);
  });
});

// ==========================================
// 5. RUTAS
// ==========================================
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/predict', predictRoutes); 
app.use('/api/climate', climateRoutes);
app.use('/api/lotes', loteRoutes);
app.use('/api/tasks', taskRoutes);         
app.use('/api/dashboard', dashboardRoutes); 
app.use('/api/news', newsRoutes);
app.use('/api/farms', farmRoutes);

const routerCultivos = express.Router();
routerCultivos.get('/', cultivoController.obtenerCultivos);
app.use('/api/cultivos', routerCultivos);

app.get('/api/bulletin', async (req, res) => {
  try {
    const news = await Bulletin.find().sort({ fechaPublicacion: -1 }).limit(10);
    res.json(news);
  } catch (err) {
    res.status(500).json({ message: 'Error obteniendo noticias' });
  }
});

app.get('/', (req, res) => {
  res.send(`🌿 Plant Disease Detector V2 API - Secured`);
});

// Cron Jobs
try {
    dailyJob.start(); 
    console.log('✅ Cron Job de Análisis Diario: ACTIVADO');
} catch (e) {
    console.warn('⚠️ Error Cron:', e.message);
}

// Error Handling
app.use((err, req, res, next) => {
  console.error('🔥 Error Global:', err.stack);
  res.status(500).json({ success: false, message: 'Error interno del servidor', error: err.message });
});

// Start
httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`=================================`);
  console.log(`🚀 Servidor Seguro en puerto: ${PORT}`);
  console.log(`🔗 CORS habilitado para: ${allowedOrigins.join(', ')}`);
  console.log(`=================================`);
});