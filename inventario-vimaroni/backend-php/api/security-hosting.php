<?php
/**
 * 🛡️ BIBLIOTECA DE SEGURIDAD EMPRESARIAL - VIMARONI HOSTING
 * Todas las funciones de seguridad para Planeta Hosting
 */

define('CONFIG_SKIP_INIT', true);
require_once '../config-hosting.php';

class SecurityManager {
    private $jwtSecret;
    private $bcryptCost;
    
    public function __construct() {
        $securityConfig = getSecurityConfig();
        $this->jwtSecret = $securityConfig['jwt_secret'];
        $this->bcryptCost = $securityConfig['bcrypt_cost'];
    }
    
    /**
     * 🔒 Hash de contraseña con bcrypt
     */
    public function hashPassword($password) {
        return password_hash($password, PASSWORD_BCRYPT, ['cost' => $this->bcryptCost]);
    }
    
    /**
     * 🔍 Verificar contraseña
     */
    public function verifyPassword($password, $hash) {
        return password_verify($password, $hash);
    }
    
    /**
     * 🔑 Generar JWT Token
     */
    public function generateJWT($userId, $username, $role) {
        $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
        $payload = json_encode([
            'id' => $userId,
            'username' => $username,
            'role' => $role,
            'iat' => time(),
            'exp' => time() + (24 * 60 * 60) // 24 horas
        ]);
        
        $base64Header = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));
        $base64Payload = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($payload));
        
        $signature = hash_hmac('sha256', $base64Header . "." . $base64Payload, $this->jwtSecret, true);
        $base64Signature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));
        
        return $base64Header . "." . $base64Payload . "." . $base64Signature;
    }
    
    /**
     * 🔍 Verificar JWT Token
     */
    public function verifyJWT($token) {
        if (!$token) return false;
        
        $parts = explode('.', $token);
        if (count($parts) !== 3) return false;
        
        [$header, $payload, $signature] = $parts;
        
        // Verificar signature
        $validSignature = hash_hmac('sha256', $header . "." . $payload, $this->jwtSecret, true);
        $validBase64Signature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($validSignature));
        
        if (!hash_equals($signature, $validBase64Signature)) return false;
        
        // Decodificar payload
        $payloadData = json_decode(base64_decode(str_replace(['-', '_'], ['+', '/'], $payload)), true);
        
        // Verificar expiración
        if ($payloadData['exp'] < time()) return false;
        
        return $payloadData;
    }
    
    /**
     * 🧹 Sanitizar inputs
     */
    public function sanitizeInput($input) {
        if (is_array($input)) {
            return array_map([$this, 'sanitizeInput'], $input);
        }
        
        if (is_string($input)) {
            return htmlspecialchars(trim($input), ENT_QUOTES, 'UTF-8');
        }
        
        return $input;
    }
}

/**
 * 🚫 Rate Limiting
 */
function applyRateLimit($key, $maxAttempts = 5, $windowMinutes = 15) {
    $securityConfig = getSecurityConfig();
    
    if (!isset($_SESSION)) {
        session_start();
    }
    
    $now = time();
    $windowSeconds = $windowMinutes * 60;
    
    if (!isset($_SESSION['rate_limits'])) {
        $_SESSION['rate_limits'] = [];
    }
    
    // Limpiar intentos antiguos
    $_SESSION['rate_limits'] = array_filter($_SESSION['rate_limits'], function($attempt) use ($now, $windowSeconds) {
        return ($now - $attempt) < $windowSeconds;
    });
    
    // Contar intentos actuales
    $currentAttempts = isset($_SESSION['rate_limits'][$key]) ? count($_SESSION['rate_limits'][$key]) : 0;
    
    if ($currentAttempts >= $maxAttempts) {
        http_response_code(429);
        die(json_encode([
            'error' => 'Demasiados intentos. Espera ' . $windowMinutes . ' minutos.',
            'retry_after' => $windowSeconds
        ]));
    }
    
    // Registrar intento actual
    if (!isset($_SESSION['rate_limits'][$key])) {
        $_SESSION['rate_limits'][$key] = [];
    }
    $_SESSION['rate_limits'][$key][] = $now;
}

/**
 * 🔐 Requerir autenticación
 */
function requireAuth() {
    $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['HTTP_X_AUTHORIZATION'] ?? '';
    
    if (!$authHeader) {
        $authHeader = getallheaders()['Authorization'] ?? '';
    }
    
    if (!$authHeader || !preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
        http_response_code(401);
        die(json_encode(['error' => 'Token de autorización requerido']));
    }
    
    $token = $matches[1];
    $security = new SecurityManager();
    $userData = $security->verifyJWT($token);
    
    if (!$userData) {
        http_response_code(401);
        die(json_encode(['error' => 'Token inválido o expirado']));
    }
    
    return $userData;
}

/**
 * 👥 Requerir roles específicos
 */
function requireRole($allowedRoles) {
    $userData = requireAuth();
    
    if (!in_array($userData['role'], $allowedRoles)) {
        http_response_code(403);
        die(json_encode(['error' => 'Permisos insuficientes para esta acción']));
    }
    
    return $userData;
}

/**
 * 🛡️ Headers de seguridad adicionales (llamados automáticamente)
 */
function setAdditionalSecurityHeaders() {
    header("X-Powered-By: Vimaroni Security System");
    header("X-Content-Type-Options: nosniff");
    header("X-Frame-Options: DENY");
    header("X-XSS-Protection: 1; mode=block");
    header("Referrer-Policy: strict-origin-when-cross-origin");
}

// Establecer headers automáticamente
setAdditionalSecurityHeaders();

?>
