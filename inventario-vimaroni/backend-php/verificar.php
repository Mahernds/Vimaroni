<?php
/**
 * 🔍 VERIFICADOR DE CONFIGURACIÓN - STOCKALMENDROS.CL
 * Verifica que todos los archivos estén correctamente configurados
 */

header('Content-Type: application/json; charset=utf-8');

$checks = [];
$errors = [];
$warnings = [];

// ========================
// 🔧 VERIFICAR CONFIG-HOSTING.PHP
// ========================
if (file_exists('config-hosting.php')) {
    $config_content = file_get_contents('config-hosting.php');
    
    // Verificar configuración de BD
    if (strpos($config_content, '10537planeta.dedicados.cl') !== false) {
        $checks[] = "✅ Servidor MySQL configurado correctamente";
    } else {
        $errors[] = "❌ Servidor MySQL no configurado";
    }
    
    if (strpos($config_content, 'stockalm_admin') !== false) {
        $checks[] = "✅ Base de datos y usuario configurados";
    } else {
        $errors[] = "❌ Base de datos o usuario no configurados";
    }
    
    if (strpos($config_content, 'stockalmendros.cl') !== false) {
        $checks[] = "✅ Dominio configurado correctamente";
    } else {
        $errors[] = "❌ Dominio no configurado";
    }
    
    if (strpos($config_content, 'AQUI_TU_CONTRASEÑA_MYSQL') !== false) {
        $warnings[] = "⚠️ Falta configurar contraseña MySQL";
    } else {
        $checks[] = "✅ Contraseña MySQL configurada";
    }
} else {
    $errors[] = "❌ Archivo config-hosting.php no encontrado";
}

// ========================
// 🔧 VERIFICAR ARCHIVOS REQUERIDOS
// ========================
$required_files = [
    'security-hosting.php' => 'Sistema de seguridad',
    'usuarios.php' => 'API de usuarios',
    'productos.php' => 'API de productos',
    'database-hosting.sql' => 'Script de base de datos'
];

foreach ($required_files as $file => $description) {
    if (file_exists($file)) {
        $checks[] = "✅ $description ($file)";
    } else {
        $errors[] = "❌ Falta $description ($file)";
    }
}

// ========================
// 🔧 VERIFICAR ARCHIVOS FRONTEND
// ========================
$frontend_files = [
    '../index.html' => 'Página principal',
    '../config-frontend.js' => 'Configuración frontend',
    '../style.css' => 'Estilos CSS',
    '../logooo.png' => 'Logo',
    '../mapa-almendros.jpg' => 'Mapa del galpón'
];

foreach ($frontend_files as $file => $description) {
    if (file_exists($file)) {
        $checks[] = "✅ $description";
    } else {
        $warnings[] = "⚠️ Falta $description ($file)";
    }
}

// ========================
// 🔧 VERIFICAR CONFIGURACIÓN FRONTEND
// ========================
if (file_exists('../config-frontend.js')) {
    $frontend_config = file_get_contents('../config-frontend.js');
    
    if (strpos($frontend_config, 'stockalmendros.cl') !== false) {
        $checks[] = "✅ Frontend configurado para stockalmendros.cl";
    } else {
        $warnings[] = "⚠️ Frontend no configurado para stockalmendros.cl";
    }
}

// ========================
// 🔧 VERIFICAR PERMISOS
// ========================
if (is_writable('.')) {
    $checks[] = "✅ Directorio API escribible";
} else {
    $warnings[] = "⚠️ Directorio API podría necesitar permisos de escritura";
}

// ========================
// 🔧 PROBAR CONEXIÓN BD (si está configurada)
// ========================
if (empty($errors) && !strpos(file_get_contents('config-hosting.php'), 'AQUI_TU_CONTRASEÑA_MYSQL')) {
    try {
        require_once 'config-hosting.php';
        $db_config = getDBConfig();
        
        $dsn = "mysql:host={$db_config['host']};dbname={$db_config['database']};charset={$db_config['charset']}";
        $pdo = new PDO($dsn, $db_config['username'], $db_config['password']);
        
        $checks[] = "✅ Conexión a base de datos exitosa";
    } catch (PDOException $e) {
        $errors[] = "❌ Error de conexión BD: " . $e->getMessage();
    }
}

// ========================
// 📊 GENERAR REPORTE
// ========================
$total_checks = count($checks);
$total_errors = count($errors);
$total_warnings = count($warnings);

$status = "ready";
if ($total_errors > 0) {
    $status = "errors";
} elseif ($total_warnings > 0) {
    $status = "warnings";
}

$report = [
    'status' => $status,
    'domain' => 'stockalmendros.cl',
    'timestamp' => date('Y-m-d H:i:s'),
    'summary' => [
        'total_checks' => $total_checks,
        'errors' => $total_errors,
        'warnings' => $total_warnings
    ],
    'checks' => $checks,
    'errors' => $errors,
    'warnings' => $warnings,
    'next_steps' => []
];

// ========================
// 📋 PRÓXIMOS PASOS
// ========================
if ($status === 'errors') {
    $report['next_steps'] = [
        "1. Subir archivos faltantes",
        "2. Verificar configuración",
        "3. Ejecutar verificador nuevamente"
    ];
} elseif ($status === 'warnings') {
    if (in_array("⚠️ Falta configurar contraseña MySQL", $warnings)) {
        $report['next_steps'] = [
            "1. Obtener contraseña MySQL de Planeta Hosting",
            "2. Editar config-hosting.php",
            "3. Ejecutar https://stockalmendros.cl/api/install.php"
        ];
    } else {
        $report['next_steps'] = [
            "1. Subir archivos frontend faltantes",
            "2. Ejecutar instalador",
            "3. Probar sistema"
        ];
    }
} else {
    $report['next_steps'] = [
        "1. Ejecutar https://stockalmendros.cl/api/install.php",
        "2. Probar login en https://stockalmendros.cl",
        "3. Cambiar contraseñas por defecto"
    ];
}

echo json_encode($report, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
?>
