/**
 * 🌐 CONFIGURACIÓN FRONTEND - PLANETA HOSTING
 * Edita estas URLs con tu dominio de hosting
 */

// ========================
// 🔧 CONFIGURACIÓN DE HOSTING
// ========================

const HOSTING_CONFIG = {
    // Tu dominio de Planeta Hosting (✅ CONFIGURADO)
    DOMAIN: 'stockalmendros.cl',  // ✅ Dominio configurado
    
    // URLs de la API (se generan automáticamente)
    API_BASE_URL: 'https://stockalmendros.cl/api',
    
    // Endpoints específicos
    ENDPOINTS: {
        login: '/usuarios/login',
        verifyToken: '/usuarios/verify-token',
        usuarios: '/usuarios',
        productos: '/productos'
    },
    
    // Configuración de desarrollo local (para testing)
    DEV_CONFIG: {
        API_BASE_URL: 'http://localhost:8000/api',
        FRONTEND_URL: 'http://localhost:3000'
    }
};

// ========================
// 🔍 DETECTAR ENTORNO
// ========================

function getEnvironmentConfig() {
    const hostname = window.location.hostname;
    
    // Si estamos en localhost, usar configuración de desarrollo
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return HOSTING_CONFIG.DEV_CONFIG;
    }
    
    // Si no se ha configurado el dominio
    if (HOSTING_CONFIG.DOMAIN.includes('AQUI_TU_')) {
        console.warn('⚠️ CONFIGURACIÓN PENDIENTE: Edita config-frontend.js con tu dominio');
        return HOSTING_CONFIG.DEV_CONFIG;
    }
    
    // Configuración de producción
    return {
        API_BASE_URL: HOSTING_CONFIG.API_BASE_URL.replace('AQUI_TU_DOMINIO.COM', HOSTING_CONFIG.DOMAIN),
        FRONTEND_URL: `https://${HOSTING_CONFIG.DOMAIN}`
    };
}

// ========================
// 📡 CONFIGURACIÓN GLOBAL
// ========================

const CONFIG = getEnvironmentConfig();

// Generar URLs completas de endpoints
CONFIG.ENDPOINTS = {};
Object.keys(HOSTING_CONFIG.ENDPOINTS).forEach(key => {
    CONFIG.ENDPOINTS[key] = CONFIG.API_BASE_URL + HOSTING_CONFIG.ENDPOINTS[key];
});

// ========================
// 🔐 FUNCIONES DE API SEGURAS
// ========================

/**
 * Realizar petición autenticada a la API
 */
async function apiRequest(endpoint, options = {}) {
    const token = localStorage.getItem('authToken');
    
    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        },
        ...options
    };
    
    // Agregar token si existe
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    try {
        const response = await fetch(endpoint, config);
        
        if (!response.ok) {
            if (response.status === 401) {
                // Token expirado, limpiar y redirigir al login
                localStorage.removeItem('authToken');
                localStorage.removeItem('currentUser');
                window.location.href = '/';
                return;
            }
            
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API Request Error:', error);
        throw error;
    }
}

/**
 * Login de usuario
 */
async function loginUser(username, password) {
    return await apiRequest(CONFIG.ENDPOINTS.login, {
        method: 'POST',
        body: JSON.stringify({ username, password })
    });
}

/**
 * Verificar token
 */
async function verifyToken() {
    return await apiRequest(CONFIG.ENDPOINTS.verifyToken, {
        method: 'POST'
    });
}

/**
 * Obtener usuarios
 */
async function getUsers() {
    return await apiRequest(CONFIG.ENDPOINTS.usuarios);
}

/**
 * Crear usuario
 */
async function createUser(userData) {
    return await apiRequest(CONFIG.ENDPOINTS.usuarios, {
        method: 'POST',
        body: JSON.stringify(userData)
    });
}

/**
 * Obtener productos
 */
async function getProducts(search = '') {
    const url = search ? 
        `${CONFIG.ENDPOINTS.productos}?search=${encodeURIComponent(search)}` : 
        CONFIG.ENDPOINTS.productos;
    
    return await apiRequest(url);
}

/**
 * Crear producto
 */
async function createProduct(productData) {
    return await apiRequest(CONFIG.ENDPOINTS.productos, {
        method: 'POST',
        body: JSON.stringify(productData)
    });
}

// ========================
// 🎯 INFORMACIÓN DE CONFIGURACIÓN
// ========================

console.log('🚀 Vimaroni Frontend Configurado');
console.log('📍 Entorno:', CONFIG.API_BASE_URL.includes('localhost') ? 'Desarrollo' : 'Producción');
console.log('🔌 API Base URL:', CONFIG.API_BASE_URL);

// Exportar configuración global
window.VIMARONI_CONFIG = CONFIG;
window.VIMARONI_API = {
    loginUser,
    verifyToken,
    getUsers,
    createUser,
    getProducts,
    createProduct,
    apiRequest
};
