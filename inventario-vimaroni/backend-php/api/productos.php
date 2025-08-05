<?php
/**
 * 🛡️ API de Productos SEGURA - VIMARONI HOSTING
 * Lista para Planeta Hosting con máxima seguridad
 */

require_once '../config-hosting.php';
require_once 'security-hosting.php';

$method = $_SERVER['REQUEST_METHOD'];
$request = $_SERVER['REQUEST_URI'];
$security = new SecurityManager();

// Extraer la acción de la URL
$path = parse_url($request, PHP_URL_PATH);
$segments = explode('/', trim($path, '/'));
$action = end($segments);

try {
    $db = getSecureDB();
    
    switch ($method) {
        case 'GET':
            // 🔒 Lectura de productos (requiere autenticación)
            $userData = requireAuth();
            
            if ($action === 'productos' || empty($action)) {
                // Obtener todos los productos
                $search = $_GET['search'] ?? '';
                $search = $security->sanitizeInput($search);
                
                if (!empty($search)) {
                    // Búsqueda por nombre o SKU
                    $stmt = $db->prepare("SELECT * FROM productos WHERE (nombre LIKE ? OR sku LIKE ?) AND estado != 'descontinuado' ORDER BY nombre");
                    $searchTerm = "%{$search}%";
                    $stmt->execute([$searchTerm, $searchTerm]);
                } else {
                    // Obtener todos los productos activos
                    $stmt = $db->prepare("SELECT * FROM productos WHERE estado != 'descontinuado' ORDER BY zona, contenedor, nombre");
                    $stmt->execute();
                }
                
                $products = $stmt->fetchAll();
                echo json_encode($products);
                
            } else {
                // Obtener producto específico por ID
                $productId = intval($action);
                $stmt = $db->prepare("SELECT * FROM productos WHERE id = ?");
                $stmt->execute([$productId]);
                $product = $stmt->fetch();
                
                if ($product) {
                    echo json_encode($product);
                } else {
                    http_response_code(404);
                    echo json_encode(['error' => 'Producto no encontrado']);
                }
            }
            break;
            
        case 'POST':
            // 🔒 Crear producto (admin, bodeguero, supervisor)
            $userData = requireRole(['admin', 'bodeguero', 'supervisor']);
            
            $input = json_decode(file_get_contents('php://input'), true);
            $data = $security->sanitizeInput($input);
            
            // Validar campos requeridos
            $required = ['nombre', 'marca', 'sku', 'zona', 'contenedor'];
            foreach ($required as $field) {
                if (!isset($data[$field]) || empty($data[$field])) {
                    http_response_code(400);
                    echo json_encode(['error' => "El campo {$field} es requerido"]);
                    exit();
                }
            }
            
            // Verificar que el SKU no exista
            $checkStmt = $db->prepare("SELECT id FROM productos WHERE sku = ?");
            $checkStmt->execute([$data['sku']]);
            if ($checkStmt->fetch()) {
                http_response_code(400);
                echo json_encode(['error' => 'El SKU ya existe']);
                break;
            }
            
            // Preparar datos con valores por defecto
            $cantidad = intval($data['cantidad'] ?? 0);
            $precio = floatval($data['precio'] ?? 0);
            $fechaVencimiento = !empty($data['fechaVencimiento']) ? $data['fechaVencimiento'] : null;
            $categoria = $data['categoria'] ?? 'General';
            $descripcion = $data['descripcion'] ?? '';
            $createdBy = $userData['username'];
            
            // Crear producto
            $stmt = $db->prepare("INSERT INTO productos (nombre, marca, sku, zona, contenedor, cantidad, precio, fechaVencimiento, categoria, descripcion, createdBy, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())");
            $success = $stmt->execute([
                $data['nombre'],
                $data['marca'],
                $data['sku'],
                $data['zona'],
                $data['contenedor'],
                $cantidad,
                $precio,
                $fechaVencimiento,
                $categoria,
                $descripcion,
                $createdBy
            ]);
            
            if ($success) {
                $newProductId = $db->lastInsertId();
                
                // Obtener el producto creado
                $getStmt = $db->prepare("SELECT * FROM productos WHERE id = ?");
                $getStmt->execute([$newProductId]);
                $newProduct = $getStmt->fetch();
                
                http_response_code(201);
                echo json_encode($newProduct);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Error al crear producto']);
            }
            break;
            
        case 'PUT':
            // 🔒 Actualizar producto (admin, bodeguero, supervisor)
            $userData = requireRole(['admin', 'bodeguero', 'supervisor']);
            
            // Extraer ID del producto de la URL
            $productId = null;
            foreach ($segments as $i => $segment) {
                if ($segment === 'productos' && isset($segments[$i + 1])) {
                    $productId = intval($segments[$i + 1]);
                    break;
                }
            }
            
            if (!$productId || $productId <= 0) {
                http_response_code(400);
                echo json_encode(['error' => 'ID de producto inválido']);
                break;
            }
            
            $input = json_decode(file_get_contents('php://input'), true);
            $data = $security->sanitizeInput($input);
            
            // Verificar que el producto exista
            $checkStmt = $db->prepare("SELECT id FROM productos WHERE id = ?");
            $checkStmt->execute([$productId]);
            if (!$checkStmt->fetch()) {
                http_response_code(404);
                echo json_encode(['error' => 'Producto no encontrado']);
                break;
            }
            
            // Si se actualiza el SKU, verificar que no exista en otro producto
            if (isset($data['sku'])) {
                $skuCheckStmt = $db->prepare("SELECT id FROM productos WHERE sku = ? AND id != ?");
                $skuCheckStmt->execute([$data['sku'], $productId]);
                if ($skuCheckStmt->fetch()) {
                    http_response_code(400);
                    echo json_encode(['error' => 'El SKU ya existe en otro producto']);
                    break;
                }
            }
            
            // Construir query dinámico basado en campos enviados
            $fields = [];
            $values = [];
            
            $allowedFields = ['nombre', 'marca', 'sku', 'zona', 'contenedor', 'cantidad', 'precio', 'fechaVencimiento', 'categoria', 'descripcion', 'estado'];
            foreach ($allowedFields as $field) {
                if (isset($data[$field])) {
                    $fields[] = "{$field} = ?";
                    $values[] = $data[$field];
                }
            }
            
            if (empty($fields)) {
                http_response_code(400);
                echo json_encode(['error' => 'No hay campos para actualizar']);
                break;
            }
            
            // Agregar campo de actualización
            $fields[] = "updatedBy = ?";
            $values[] = $userData['username'];
            $fields[] = "updatedAt = NOW()";
            
            $values[] = $productId; // Para el WHERE
            
            $sql = "UPDATE productos SET " . implode(', ', $fields) . " WHERE id = ?";
            $stmt = $db->prepare($sql);
            $success = $stmt->execute($values);
            
            if ($success) {
                // Obtener producto actualizado
                $getStmt = $db->prepare("SELECT * FROM productos WHERE id = ?");
                $getStmt->execute([$productId]);
                $updatedProduct = $getStmt->fetch();
                
                echo json_encode($updatedProduct);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Error al actualizar producto']);
            }
            break;
            
        case 'DELETE':
            // 🔒 Eliminar producto (solo admin y supervisor)
            $userData = requireRole(['admin', 'supervisor']);
            
            // Extraer ID del producto de la URL
            $productId = null;
            foreach ($segments as $i => $segment) {
                if ($segment === 'productos' && isset($segments[$i + 1])) {
                    $productId = intval($segments[$i + 1]);
                    break;
                }
            }
            
            if (!$productId || $productId <= 0) {
                http_response_code(400);
                echo json_encode(['error' => 'ID de producto inválido']);
                break;
            }
            
            $stmt = $db->prepare("UPDATE productos SET estado = 'descontinuado', updatedBy = ?, updatedAt = NOW() WHERE id = ?");
            $success = $stmt->execute([$userData['username'], $productId]);
            
            if ($success) {
                echo json_encode(['message' => 'Producto eliminado exitosamente']);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Error al eliminar producto']);
            }
            break;
            
        default:
            http_response_code(405);
            echo json_encode(['error' => 'Método no permitido']);
            break;
    }
    
} catch (Exception $e) {
    error_log("Error en productos.php: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Error interno del servidor']);
}
?>
?>
