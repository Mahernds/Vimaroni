<?php
/**
 * 🛡️ Librería de Seguridad para Vimaroni
 * Implementa todas las medidas de seguridad empresarial
 */

class SecurityManager {
    private $jwtSecret = 'vimaroni_secret_key_2024_php';
    private $rateLimitFile = __DIR__ . '/rate_limits.json';
    
    /**
     * 🔑 Generar JWT Token
     */
    public function generateJWT($userId, $username, $role) {
        $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
        $payload = json_encode([
            'id' => $userId,
            'username' => $username,
            'role' => $role,
            'exp' => time() + (24 * 60 * 60) // 24 horas
        ]);
        
        $headerEncoded = $this->base64urlEncode($header);
        $payloadEncoded = $this->base64urlEncode($payload);
        
        $signature = hash_hmac('sha256', $headerEncoded . "." . $payloadEncoded, $this->jwtSecret, true);
        $signatureEncoded = $this->base64urlEncode($signature);
        
        return $headerEncoded . "." . $payloadEncoded . "." . $signatureEncoded;
    }
    
    /**
     * 🔍 Verificar JWT Token
     */
    public function verifyJWT($token) {
        if (!$token) return false;
        
        $parts = explode('.', $token);
        if (count($parts) !== 3) return false;
        
        $header = $this->base64urlDecode($parts[0]);
        $payload = $this->base64urlDecode($parts[1]);
        $signature = $this->base64urlDecode($parts[2]);
        
        $expectedSignature = hash_hmac('sha256', $parts[0] . "." . $parts[1], $this->jwtSecret, true);
        
        if (!hash_equals($expectedSignature, $signature)) return false;
        
        $payloadData = json_decode($payload, true);
        if ($payloadData['exp'] < time()) return false;
        
        return $payloadData;
    }
    
    /**
     * 🔒 Hash de contraseña con bcrypt
     */
    public function hashPassword($password) {
        return password_hash($password, PASSWORD_BCRYPT, ['cost' => 10]);
    }
    
    /**
     * ✅ Verificar contraseña
     */
    public function verifyPassword($password, $hash) {
        return password_verify($password, $hash);
    }
    
    /**
     * 🚨 Rate Limiting
     */
    public function checkRateLimit($identifier, $maxAttempts = 5, $windowMinutes = 15) {
        $now = time();
        $windowStart = $now - ($windowMinutes * 60);
        
        // Leer intentos existentes
        $attempts = $this->getRateLimitData();
        
        // Limpiar intentos antiguos
        if (isset($attempts[$identifier])) {
            $attempts[$identifier] = array_filter($attempts[$identifier], function($timestamp) use ($windowStart) {
                return $timestamp > $windowStart;
            });
        }
        
        // Verificar límite
        $currentAttempts = isset($attempts[$identifier]) ? count($attempts[$identifier]) : 0;
        
        if ($currentAttempts >= $maxAttempts) {
            return false; // Límite excedido
        }
        
        // Registrar nuevo intento
        if (!isset($attempts[$identifier])) {
            $attempts[$identifier] = [];
        }
        $attempts[$identifier][] = $now;
        
        // Guardar datos
        $this->saveRateLimitData($attempts);
        
        return true; // Permitido
    }
    
    /**
     * 🛡️ Headers de seguridad
     */
    public function setSecurityHeaders() {
        header('X-Content-Type-Options: nosniff');
        header('X-Frame-Options: DENY');
        header('X-XSS-Protection: 1; mode=block');
        header('Strict-Transport-Security: max-age=31536000; includeSubDomains');
        header('Referrer-Policy: strict-origin-when-cross-origin');
        header('Content-Security-Policy: default-src \'self\'');
    }
    
    /**
     * 🔐 Verificar permisos de rol
     */
    public function checkRole($userRole, $allowedRoles) {
        return in_array($userRole, $allowedRoles);
    }
    
    /**
     * 🧹 Sanitizar entrada
     */
    public function sanitizeInput($input) {
        if (is_array($input)) {
            return array_map([$this, 'sanitizeInput'], $input);
        }
        return htmlspecialchars(trim($input), ENT_QUOTES, 'UTF-8');
    }
    
    // Funciones auxiliares privadas
    private function base64urlEncode($data) {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }
    
    private function base64urlDecode($data) {
        return base64_decode(str_pad(strtr($data, '-_', '+/'), strlen($data) % 4, '=', STR_PAD_RIGHT));
    }
    
    private function getRateLimitData() {
        if (!file_exists($this->rateLimitFile)) {
            return [];
        }
        $data = file_get_contents($this->rateLimitFile);
        return json_decode($data, true) ?: [];
    }
    
    private function saveRateLimitData($data) {
        file_put_contents($this->rateLimitFile, json_encode($data));
    }
}

/**
 * 🔒 Middleware de autenticación
 */
function requireAuth() {
    $security = new SecurityManager();
    
    // Obtener token del header Authorization
    $headers = apache_request_headers();
    $authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : '';
    
    if (!$authHeader || !preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
        http_response_code(401);
        echo json_encode(['error' => 'Token de acceso requerido']);
        exit();
    }
    
    $token = $matches[1];
    $userData = $security->verifyJWT($token);
    
    if (!$userData) {
        http_response_code(403);
        echo json_encode(['error' => 'Token inválido o expirado']);
        exit();
    }
    
    return $userData;
}

/**
 * 🛡️ Middleware de roles
 */
function requireRole($allowedRoles) {
    $userData = requireAuth();
    $security = new SecurityManager();
    
    if (!$security->checkRole($userData['role'], $allowedRoles)) {
        http_response_code(403);
        echo json_encode(['error' => 'Permisos insuficientes']);
        exit();
    }
    
    return $userData;
}

/**
 * 🚨 Middleware de rate limiting
 */
function applyRateLimit($identifier, $maxAttempts = 5, $windowMinutes = 15) {
    $security = new SecurityManager();
    
    if (!$security->checkRateLimit($identifier, $maxAttempts, $windowMinutes)) {
        http_response_code(429);
        echo json_encode(['error' => "Demasiados intentos. Intenta en {$windowMinutes} minutos."]);
        exit();
    }
}

/**
 * 🌐 Headers CORS seguros
 */
function setCorsHeaders() {
    $security = new SecurityManager();
    $security->setSecurityHeaders();
    
    // CORS específico para desarrollo y producción
    $allowedOrigins = [
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        // Agregar tu dominio de producción aquí
    ];
    
    $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
    
    if (in_array($origin, $allowedOrigins)) {
        header("Access-Control-Allow-Origin: {$origin}");
    }
    
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    header('Access-Control-Allow-Credentials: true');
    
    // Manejar preflight OPTIONS
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit();
    }
}

?>
