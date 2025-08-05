// Configuración de la aplicación
const CONFIG = {
    // Para desarrollo local
    development: {
        API_URL: 'http://127.0.0.1:3001'  // Backend Node.js usando misma IP
    },
    // Para producción (Planeta Hosting)
    production: {
        API_URL: 'https://tu-dominio.com'  // Cambiar por tu dominio real de Planeta Hosting
    }
};

// Detectar entorno automáticamente
const ENVIRONMENT = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'development' : 'production';

// Exportar configuración actual
const API_BASE_URL = CONFIG[ENVIRONMENT].API_URL;
