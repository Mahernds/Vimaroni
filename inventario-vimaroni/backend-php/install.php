<?php
/**
 * 🚀 INSTALADOR AUTOMÁTICO VIMARONI
 * Script de instalación para Planeta Hosting
 */

// Configuración de errores para depuración
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Configuración de seguridad
header('Content-Type: text/html; charset=UTF-8');
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Instalador Vimaroni - Planeta Hosting</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: #f5f5f5;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            color: #0077b6;
            margin-bottom: 30px;
        }
        .step {
            margin: 20px 0;
            padding: 15px;
            border-left: 4px solid #0077b6;
            background: #f8f9fa;
        }
        .success {
            border-left-color: #28a745;
            background: #d4edda;
            color: #155724;
        }
        .error {
            border-left-color: #dc3545;
            background: #f8d7da;
            color: #721c24;
        }
        .warning {
            border-left-color: #ffc107;
            background: #fff3cd;
            color: #856404;
        }
        .form-group {
            margin: 15px 0;
        }
        label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
        }
        input, select {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
            box-sizing: border-box;
        }
        button {
            background: #0077b6;
            color: white;
            padding: 12px 25px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
        }
        button:hover {
            background: #005a8b;
        }
        .progress {
            width: 100%;
            height: 20px;
            background: #e9ecef;
            border-radius: 10px;
            overflow: hidden;
            margin: 20px 0;
        }
        .progress-bar {
            height: 100%;
            background: #0077b6;
            transition: width 0.3s ease;
        }
        .credentials {
            background: #e8f4f8;
            padding: 15px;
            border-radius: 5px;
            margin: 15px 0;
        }
        .credentials h4 {
            margin-top: 0;
            color: #0077b6;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 Instalador Vimaroni</h1>
            <p>Sistema de Inventario para Planeta Hosting</p>
        </div>

        <?php
        if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
            
            if ($_POST['action'] === 'install') {
                // Procesar instalación
                $domain = $_POST['domain'];
                $db_name = $_POST['db_name'];
                $db_user = $_POST['db_user'];
                $db_pass = $_POST['db_pass'];
                $db_host = $_POST['db_host'];
                $table_prefix = $_POST['table_prefix'] ?? '';
                
                echo '<div class="step">🔧 Iniciando instalación...</div>';
                echo '<div class="progress"><div class="progress-bar" style="width: 10%"></div></div>';
                
                // Paso 1: Verificar conexión a base de datos
                try {
                    $dsn = "mysql:host=$db_host;dbname=$db_name;charset=utf8mb4";
                    $pdo = new PDO($dsn, $db_user, $db_pass, [
                        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    ]);
                    echo '<div class="step success">✅ Conexión a base de datos exitosa</div>';
                    echo '<script>document.querySelector(".progress-bar").style.width = "30%";</script>';
                } catch (PDOException $e) {
                    echo '<div class="step error">❌ Error de conexión a BD: ' . htmlspecialchars($e->getMessage()) . '</div>';
                    exit;
                }
                
                // Paso 2: Crear configuración
                $config_content = "<?php
/**
 * 🔧 CONFIGURACIÓN HOSTING - VIMARONI
 * Configuración automática generada por el instalador
 */

// ========================
// 🗄️ CONFIGURACIÓN DE BASE DE DATOS
// ========================
define('DB_HOST', '$db_host');
define('DB_NAME', '$db_name');
define('DB_USER', '$db_user');
define('DB_PASS', '$db_pass');
define('DB_CHARSET', 'utf8mb4');

// ========================
// 🌐 CONFIGURACIÓN DEL DOMINIO
// ========================
define('SITE_URL', 'https://$domain');
define('API_URL', 'https://$domain/api');

// ========================
// 🔐 CONFIGURACIÓN DE SEGURIDAD
// ========================
define('JWT_SECRET', '" . bin2hex(random_bytes(32)) . "');
define('BCRYPT_COST', 12);
define('SESSION_LIFETIME', 86400); // 24 horas

// ========================
// ⚡ CONFIGURACIÓN DE RATE LIMITING
// ========================
define('RATE_LIMIT_REQUESTS', 60);
define('RATE_LIMIT_WINDOW', 60); // 60 requests per minute

// ========================
// 📊 CONFIGURACIÓN DE LOGGING
// ========================
define('LOG_ERRORS', true);
define('LOG_ACCESS', true);

// ========================
// 🔧 CONFIGURACIÓN ADICIONAL
// ========================
define('TIMEZONE', 'America/Santiago');
define('DEBUG_MODE', false);
define('TABLE_PREFIX', '$table_prefix');

// Establecer zona horaria
date_default_timezone_set(TIMEZONE);

// Función para conectar a la base de datos
function getDBConnection() {
    try {
        \$dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=' . DB_CHARSET;
        \$pdo = new PDO(\$dsn, DB_USER, DB_PASS, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8mb4'
        ]);
        return \$pdo;
    } catch (PDOException \$e) {
        error_log('Database connection error: ' . \$e->getMessage());
        throw new Exception('Error de conexión a la base de datos');
    }
}

// Función para logging
function logMessage(\$message, \$type = 'info') {
    if (LOG_ERRORS || LOG_ACCESS) {
        \$timestamp = date('Y-m-d H:i:s');
        \$log_entry = \"[\$timestamp] [\$type] \$message\" . PHP_EOL;
        file_put_contents('logs/vimaroni.log', \$log_entry, FILE_APPEND | LOCK_EX);
    }
}
?>";
                
                if (file_put_contents('config-hosting.php', $config_content)) {
                    echo '<div class="step success">✅ Archivo de configuración creado</div>';
                    echo '<script>document.querySelector(".progress-bar").style.width = "50%";</script>';
                } else {
                    echo '<div class="step error">❌ Error al crear archivo de configuración</div>';
                    exit;
                }
                
                // Paso 3: Crear directorio de logs
                if (!is_dir('logs')) {
                    mkdir('logs', 0755, true);
                }
                
                // Paso 4: Ejecutar SQL de instalación
                try {
                    $sql = file_get_contents('database-hosting.sql');
                    $sql = str_replace('vimaroni_', $table_prefix, $sql);
                    
                    $statements = explode(';', $sql);
                    foreach ($statements as $statement) {
                        $statement = trim($statement);
                        if (!empty($statement)) {
                            $pdo->exec($statement);
                        }
                    }
                    echo '<div class="step success">✅ Base de datos configurada correctamente</div>';
                    echo '<script>document.querySelector(".progress-bar").style.width = "80%";</script>';
                } catch (PDOException $e) {
                    echo '<div class="step error">❌ Error al configurar BD: ' . htmlspecialchars($e->getMessage()) . '</div>';
                    exit;
                }
                
                // Paso 5: Configurar frontend
                $frontend_config = file_get_contents('frontend/config-frontend.js');
                $frontend_config = str_replace('AQUI_TU_DOMINIO.COM', $domain, $frontend_config);
                
                if (file_put_contents('frontend/config-frontend.js', $frontend_config)) {
                    echo '<div class="step success">✅ Frontend configurado</div>';
                    echo '<script>document.querySelector(".progress-bar").style.width = "100%";</script>';
                } else {
                    echo '<div class="step error">❌ Error al configurar frontend</div>';
                    exit;
                }
                
                // Paso 6: Instalación completada
                echo '<div class="step success">🎉 ¡Instalación completada exitosamente!</div>';
                
                // Mostrar credenciales por defecto
                echo '<div class="credentials">';
                echo '<h4>🔑 Credenciales por Defecto</h4>';
                echo '<p><strong>Administrador:</strong> admin / admin123</p>';
                echo '<p><strong>Supervisor:</strong> supervisor / super123</p>';
                echo '<p><strong>Bodeguero:</strong> bodeguero / bodega123</p>';
                echo '<p><strong>Operador:</strong> operador / oper123</p>';
                echo '<br>';
                echo '<p><strong>🌐 Tu sistema está disponible en:</strong> <a href="https://' . $domain . '" target="_blank">https://' . $domain . '</a></p>';
                echo '</div>';
                
                echo '<div class="step warning">⚠️ Por seguridad, elimina este archivo (install.php) después de la instalación</div>';
                
                // Botón para eliminar instalador
                echo '<form method="post" style="text-align: center; margin-top: 20px;">';
                echo '<input type="hidden" name="action" value="cleanup">';
                echo '<button type="submit">🗑️ Eliminar Instalador</button>';
                echo '</form>';
                
            } elseif ($_POST['action'] === 'cleanup') {
                // Eliminar archivo de instalación
                if (unlink(__FILE__)) {
                    echo '<div class="step success">✅ Instalador eliminado correctamente</div>';
                    echo '<p style="text-align: center;"><a href="/">🏠 Ir al Sistema</a></p>';
                } else {
                    echo '<div class="step error">❌ Error al eliminar instalador. Elimínalo manualmente.</div>';
                }
            }
            
        } else {
            // Mostrar formulario de instalación
        ?>
        
        <div class="step">
            <h3>📋 Información de Configuración</h3>
            <p>Completa los siguientes datos para configurar tu sistema Vimaroni:</p>
        </div>
        
        <form method="post">
            <input type="hidden" name="action" value="install">
            
            <h4>🌐 Configuración del Sitio</h4>
            <div class="form-group">
                <label for="domain">Dominio (sin https://):</label>
                <input type="text" id="domain" name="domain" value="stockalmendros.cl" required>
            </div>
            
            <h4>🗄️ Configuración de Base de Datos</h4>
            <div class="form-group">
                <label for="db_host">Servidor de BD:</label>
                <input type="text" id="db_host" name="db_host" value="10537planeta.dedicados.cl" required>
            </div>
            
            <div class="form-group">
                <label for="db_name">Nombre de la Base de Datos:</label>
                <input type="text" id="db_name" name="db_name" value="stockalm_admin" required>
            </div>
            
            <div class="form-group">
                <label for="db_user">Usuario de BD:</label>
                <input type="text" id="db_user" name="db_user" value="stockalm_admin" required>
            </div>
            
            <div class="form-group">
                <label for="db_pass">Contraseña de BD:</label>
                <input type="password" id="db_pass" name="db_pass" required>
            </div>
            
            <div class="form-group">
                <label for="table_prefix">Prefijo de Tablas (opcional):</label>
                <input type="text" id="table_prefix" name="table_prefix" placeholder="vim_">
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
                <button type="submit">🚀 Instalar Vimaroni</button>
            </div>
        </form>
        
        <div class="step warning">
            <h4>⚠️ Importante</h4>
            <ul>
                <li>Asegúrate de que la base de datos ya esté creada</li>
                <li>El usuario de BD debe tener permisos completos</li>
                <li>Verifica que el dominio apunte a tu hosting</li>
                <li>Este instalador se eliminará automáticamente después de la instalación</li>
            </ul>
        </div>
        
        <?php } ?>
    </div>
</body>
</html>
