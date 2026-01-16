const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const contactRoutes = require('./routes/contactRoutes');
const app = express();

// --- 1. CONFIGURACIÓN DE SEGURIDAD (Helmet) ---
// Protege tu app de vulnerabilidades web conocidas configurando cabeceras HTTP
app.use(helmet());

// --- 2. CONFIGURACIÓN DE CORS ---
// Solo permitimos que tu Frontend (en desarrollo o producción) acceda a la API
const allowedOrigins = [
  'http://localhost:3000', // React (Create React App)
  'http://localhost:5173', // React (Vite)
  'https://www.visualcore.cl' // Tu futuro dominio real
];

const corsOptions = {
  origin: function (origin, callback) {
    // Permitimos peticiones sin origen (como Postman) o si están en la lista blanca
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Bloqueado por políticas de seguridad CORS de Visual Core'));
    }
  },
  methods: ['GET', 'POST'],
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// --- 3. CONFIGURACIÓN DE RATE LIMIT (Protección anti-spam) ---
// Evita que una misma IP sature el formulario enviando demasiados mensajes
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // Ventana de 15 minutos
  max: 5, // Límite de 5 mensajes por IP cada 15 minutos
  message: {
    success: false,
    error: 'Demasiados intentos. Por seguridad, intenta de nuevo en 15 minutos.'
  }
});

// --- 4. MIDDLEWARES DE PARSEO ---
app.use(express.json()); // Permite recibir y entender JSON en las peticiones

// --- 5. RUTAS ---
// Aplicamos el limitador específicamente a la ruta de contacto
app.use('/api/contacto', contactLimiter, contactRoutes);

// --- 6. CONEXIÓN A MONGODB ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Conectado a MongoDB (Base de datos segura)'))
  .catch(err => console.error('❌ Error de conexión:', err));

// Ruta de salud de la API
app.get('/', (req, res) => {
  res.status(200).json({ mensaje: 'API de Visual Core Digital funcionando y protegida' });
});

// --- 7. INICIO DEL SERVIDOR ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor robusto corriendo en puerto ${PORT}`);
});