<?php
/**
 * 🌐 CONFIGURACIÓN PLANETA HOSTING - VIMARONI
 * Edita estos valores con los datos de tu hosting
 */

// ========================
// 🔧 CONFIGURACIÓN HOSTING
// ========================

// Datos de tu base de datos MySQL (los recibirás de Planeta Hosting)
$DB_CONFIG = [
    'host' => '10537planeta.dedicados.cl',           // ✅ Servidor MySQL configurado
    'database' => 'stockalm_admin',                  // ✅ Base de datos configurada
    'username' => 'stockalm_admin',                  // ✅ Usuario MySQL configurado
    'password' => 'Malloco1#',                       // ✅ Contraseña configurada
    'charset' => 'utf8mb4',
    'collation' => 'utf8mb4_unicode_ci'
];

// Tu dominio (actualizar cuando tengas el hosting)
$DOMAIN_CONFIG = [
    'frontend_url' => 'https://stockalmendros.cl',  // ✅ Dominio configurado
    'api_url' => 'https://stockalmendros.cl/api',   // ✅ API URL configurada
];

// Configuración de seguridad
$SECURITY_CONFIG = [
    'jwt_secret' => 'vimaroni_secret_key_2024_' . md5('stockalmendros.cl'),  // ✅ Secreto configurado
    'bcrypt_cost' => 12,
    'rate_limit_attempts' => 5,
    'rate_limit_window' => 900, // 15 minutos
];

// ========================
// 🛡️ FUNCIÓN DE CONEXIÓN SEGURA
// ========================
function getSecureDB() {
    global $DB_CONFIG;
    
    try {
        $dsn = "mysql:host={$DB_CONFIG['host']};dbname={$DB_CONFIG['database']};charset={$DB_CONFIG['charset']}";
        
        $options = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
            PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES {$DB_CONFIG['charset']} COLLATE {$DB_CONFIG['collation']}"
        ];
        
        return new PDO($dsn, $DB_CONFIG['username'], $DB_CONFIG['password'], $options);
    } catch (PDOException $e) {
        error_log("Database connection error: " . $e->getMessage());
        http_response_code(500);
        die(json_encode(['error' => 'Error de conexión a la base de datos']));
    }
}

// ========================
// 🔒 HEADERS DE SEGURIDAD
// ========================
function setProductionSecurityHeaders() {
    global $DOMAIN_CONFIG;
    
    // CORS para producción
    header("Access-Control-Allow-Origin: {$DOMAIN_CONFIG['frontend_url']}");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    header("Access-Control-Allow-Credentials: true");
    
    // Headers de seguridad empresarial
    header("X-Frame-Options: DENY");
    header("X-Content-Type-Options: nosniff");
    header("X-XSS-Protection: 1; mode=block");
    header("Referrer-Policy: strict-origin-when-cross-origin");
    header("Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self';");
    header("Strict-Transport-Security: max-age=31536000; includeSubDomains");
    header("Permissions-Policy: geolocation=(), microphone=(), camera=()");
    
    // Content-Type JSON
    header("Content-Type: application/json; charset=utf-8");
    
    // Manejar OPTIONS preflight
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit();
    }
}

// ========================
// 🔍 FUNCIÓN DE VERIFICACIÓN
// ========================
function verifyConfiguration() {
    global $DB_CONFIG, $DOMAIN_CONFIG;
    
    $errors = [];
    
    // Verificar que se hayan configurado los datos
    if (strpos($DB_CONFIG['host'], 'AQUI_TU_') !== false) {
        $errors[] = "Configura el host de la base de datos";
    }
    
    if (strpos($DB_CONFIG['database'], 'AQUI_TU_') !== false) {
        $errors[] = "Configura el nombre de la base de datos";
    }
    
    if (strpos($DB_CONFIG['username'], 'AQUI_TU_') !== false) {
        $errors[] = "Configura el usuario MySQL";
    }
    
    if (strpos($DB_CONFIG['password'], 'AQUI_TU_') !== false) {
        $errors[] = "Configura la contraseña MySQL";
    }
    
    if (strpos($DOMAIN_CONFIG['frontend_url'], 'AQUI_TU_') !== false) {
        $errors[] = "Configura tu dominio";
    }
    
    if (!empty($errors)) {
        http_response_code(500);
        die(json_encode([
            'error' => 'Configuración incompleta',
            'missing' => $errors,
            'instructions' => 'Edita config-hosting.php con los datos de tu hosting'
        ]));
    }
    
    return true;
}

// ========================
// 🚀 FUNCIÓN DE INICIALIZACIÓN
// ========================
function initializeForProduction() {
    // Verificar configuración
    verifyConfiguration();
    
    // Establecer headers de seguridad
    setProductionSecurityHeaders();
    
    // Configurar zona horaria
    date_default_timezone_set('America/Bogota');
    
    // Configurar logs de errores
    ini_set('display_errors', 0);
    ini_set('log_errors', 1);
    
    return true;
}

// ========================
// 📊 OBTENER CONFIGURACIONES
// ========================
function getDBConfig() {
    global $DB_CONFIG;
    return $DB_CONFIG;
}

function getDomainConfig() {
    global $DOMAIN_CONFIG;
    return $DOMAIN_CONFIG;
}

function getSecurityConfig() {
    global $SECURITY_CONFIG;
    return $SECURITY_CONFIG;
}

// ========================
// ✅ AUTO-INICIALIZACIÓN
// ========================
if (!defined('CONFIG_SKIP_INIT')) {
    initializeForProduction();
}

?>
