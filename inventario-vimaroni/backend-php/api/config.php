<?php
// Configuración de base de datos para Planeta Hosting
class Database {
    // Configuración para localhost (desarrollo)
    private $host_local = "localhost";
    private $db_name_local = "vimaroni_db";
    private $username_local = "root";
    private $password_local = "";
    
    // Configuración para Planeta Hosting (producción)
    // CAMBIAR ESTOS VALORES cuando tengas tu hosting
    private $host_prod = "localhost"; // Generalmente localhost en hosting compartido
    private $db_name_prod = "tu_usuario_vimaroni_db"; // Formato: usuario_nombredb
    private $username_prod = "tu_usuario_mysql"; // Tu usuario de MySQL
    private $password_prod = "tu_password_mysql"; // Tu contraseña de MySQL
    
    public $conn;
    
    public function getConnection() {
        $this->conn = null;
        
        try {
            // Detectar si estamos en desarrollo o producción
            $isLocal = ($_SERVER['HTTP_HOST'] == 'localhost' || strpos($_SERVER['HTTP_HOST'], '127.0.0.1') !== false);
            
            if ($isLocal) {
                // Configuración local
                $dsn = "mysql:host=" . $this->host_local . ";dbname=" . $this->db_name_local . ";charset=utf8mb4";
                $this->conn = new PDO($dsn, $this->username_local, $this->password_local);
            } else {
                // Configuración de producción (Planeta Hosting)
                $dsn = "mysql:host=" . $this->host_prod . ";dbname=" . $this->db_name_prod . ";charset=utf8mb4";
                $this->conn = new PDO($dsn, $this->username_prod, $this->password_prod);
            }
            
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
            
        } catch(PDOException $exception) {
            error_log("Error de conexión: " . $exception->getMessage());
            echo json_encode(array("error" => "Error de conexión a la base de datos"));
            die();
        }
        
        return $this->conn;
    }
}

// Función para obtener conexión rápida
function getDB() {
    $database = new Database();
    return $database->getConnection();
}

// Headers CORS para permitir requests desde el frontend
function setCorsHeaders() {
    // Permitir origen específico en producción, localhost en desarrollo
    $allowedOrigins = [
        'http://localhost:3000',
        'https://tu-dominio.com', // Cambiar por tu dominio real
        'https://www.tu-dominio.com'
    ];
    
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    
    if (in_array($origin, $allowedOrigins)) {
        header("Access-Control-Allow-Origin: " . $origin);
    }
    
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
    header("Access-Control-Allow-Credentials: true");
    header("Content-Type: application/json; charset=UTF-8");
    
    // Manejar preflight requests
    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        http_response_code(200);
        exit();
    }
}

// Función para validar entrada JSON
function getJsonInput() {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(400);
        echo json_encode(array("error" => "JSON inválido"));
        exit();
    }
    
    return $data;
}

// Función para respuesta exitosa
function successResponse($data, $message = "Operación exitosa") {
    echo json_encode(array(
        "success" => true,
        "message" => $message,
        "data" => $data
    ));
}

// Función para respuesta de error
function errorResponse($message, $code = 400) {
    http_response_code($code);
    echo json_encode(array(
        "success" => false,
        "error" => $message
    ));
}
?>
