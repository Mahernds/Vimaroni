// Configuración para hosting tradicional
const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  // URL de MongoDB (cambiar por la del hosting)
  mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/vimaroni_inventario',
  
  // Puerto del servidor
  port: process.env.PORT || 3001,
  
  // URLs del frontend
  frontendUrl: isProduction 
    ? 'https://tu-dominio.com' 
    : 'http://localhost:8000',
    
  // Configuración CORS
  corsOptions: {
    origin: isProduction 
      ? 'https://tu-dominio.com'
      : ['http://localhost:8000', 'http://127.0.0.1:8000'],
    credentials: true
  }
};
