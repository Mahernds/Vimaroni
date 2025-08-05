const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Cargar variables de entorno
require('dotenv').config();

const app = express();

// Seguridad con Helmet
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Rate limiting global
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // máximo 100 requests por IP
    message: { error: 'Demasiadas solicitudes. Intenta más tarde.' },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(globalLimiter);

// Configuración CORS más segura
const corsOptions = {
    origin: [
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        process.env.FRONTEND_URL || 'http://localhost:3000'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));

// Conexión a MongoDB usando variable de entorno
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/vimaroni';
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Rutas
const productosRouter = require('./routes/productos');
const usuariosRouter = require('./routes/usuarios');

app.use('/api/productos', productosRouter);
app.use('/api/usuarios', usuariosRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
    console.log(`Base de datos: ${MONGODB_URI.includes('localhost') ? 'Local' : 'Remota'}`);
});