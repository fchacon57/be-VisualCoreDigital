const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const contactRoutes = require('./routes/contactRoutes');

const app = express();

// --- NUEVA CONFIGURACIÓN: CONFIAR EN EL PROXY DE RENDER ---
app.set('trust proxy', 1); 

// --- 1. CONFIGURACIÓN DE SEGURIDAD (Helmet) ---
app.use(helmet());

// --- 2. CONFIGURACIÓN DE CORS ---
// Limpiamos la URL de producción para evitar errores por "/" al final
const prodOrigin = process.env.FRONTEND_URL ? process.env.FRONTEND_URL.replace(/\/$/, "") : null;

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  prodOrigin
].filter(Boolean); // Elimina valores nulos si FRONTEND_URL no está definido

const corsOptions = {
  origin: function (origin, callback) {
    // Permitir peticiones sin origen (como Postman o llamadas entre servidores)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error(`❌ Origen no permitido por CORS: ${origin}`);
      callback(new Error('Bloqueado por políticas de seguridad CORS de Visual Core'));
    }
  },
  methods: ['GET', 'POST'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// --- 3. CONFIGURACIÓN DE RATE LIMIT ---
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 5, 
  standardHeaders: true, // Informa el límite en los headers
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Demasiados intentos. Por seguridad, intenta de nuevo en 15 minutos.'
  }
});

// --- 4. MIDDLEWARES DE PARSEO ---
app.use(express.json());

// --- 5. RUTAS ---
app.use('/api/contacto', contactLimiter, contactRoutes);

// --- 6. CONEXIÓN A MONGODB ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Conectado a MongoDB (Base de datos segura)'))
  .catch(err => console.error('❌ Error de conexión:', err));

app.get('/', (req, res) => {
  res.status(200).json({ mensaje: 'API de Visual Core Digital funcionando y protegida' });
});

// --- 7. INICIO DEL SERVIDOR ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor robusto corriendo en puerto ${PORT}`);
});