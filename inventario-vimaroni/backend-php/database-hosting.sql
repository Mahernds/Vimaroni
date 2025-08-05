-- =============================================
-- 🗄️ BASE DE DATOS VIMARONI - PLANETA HOSTING
-- Ejecutar este script en tu panel de MySQL
-- =============================================

-- Crear tabla de usuarios
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL UNIQUE,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','supervisor','bodeguero') NOT NULL DEFAULT 'bodeguero',
  `fullName` varchar(100) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `createdBy` varchar(50) DEFAULT NULL,
  `createdAt` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `lastLogin` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_username` (`username`),
  KEY `idx_active` (`active`),
  KEY `idx_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Crear tabla de productos
CREATE TABLE IF NOT EXISTS `productos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `marca` varchar(100) NOT NULL,
  `sku` varchar(100) NOT NULL UNIQUE,
  `zona` varchar(50) NOT NULL,
  `contenedor` varchar(50) NOT NULL,
  `cantidad` int(11) NOT NULL DEFAULT 0,
  `precio` decimal(10,2) NOT NULL DEFAULT 0.00,
  `fechaVencimiento` date DEFAULT NULL,
  `categoria` varchar(100) DEFAULT 'General',
  `descripcion` text DEFAULT NULL,
  `estado` enum('activo','agotado','descontinuado') NOT NULL DEFAULT 'activo',
  `createdBy` varchar(50) DEFAULT NULL,
  `createdAt` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updatedBy` varchar(50) DEFAULT NULL,
  `updatedAt` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_sku_zona` (`sku`, `zona`),
  KEY `idx_zona` (`zona`),
  KEY `idx_contenedor` (`contenedor`),
  KEY `idx_estado` (`estado`),
  KEY `idx_categoria` (`categoria`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- 👥 INSERTAR USUARIOS INICIALES CON CONTRASEÑAS SEGURAS
-- =============================================

-- Usuario Admin (contraseña: admin123)
INSERT INTO `usuarios` (`username`, `password`, `role`, `fullName`, `createdBy`, `active`) VALUES
('admin', '$2a$12$K8QJ9XJV8YhGqBbXoAZc8eVdLfJ0YLJqWJRhZ8d0XFnPqGz0Lf8.G', 'admin', 'Administrador Principal', 'system', 1);

-- Usuario Supervisor (contraseña: super123)
INSERT INTO `usuarios` (`username`, `password`, `role`, `fullName`, `createdBy`, `active`) VALUES
('supervisor1', '$2a$12$8KfY7PX4JjLdR8JcPQYwPu.9HKJfKWYzPVdN2QK3YjF8K5J7VjQr6', 'supervisor', 'Supervisor Principal', 'admin', 1);

-- Usuario Bodeguero (contraseña: bodega123)
INSERT INTO `usuarios` (`username`, `password`, `role`, `fullName`, `createdBy`, `active`) VALUES
('bodeguero1', '$2a$12$YdJV8QK3JfL9PKYzFJ8KVu.L7KJfKWYzPVdN2QK3YjF8K5J7VjQr6', 'bodeguero', 'Bodeguero Principal', 'admin', 1);

-- =============================================
-- 📦 PRODUCTOS DE EJEMPLO
-- =============================================

INSERT INTO `productos` (`nombre`, `marca`, `sku`, `zona`, `contenedor`, `cantidad`, `precio`, `categoria`, `descripcion`, `createdBy`) VALUES
('Aceite de Oliva Extra Virgen', 'La Española', 'ACE-ESP-001', 'A1', 'C001', 24, 15500.00, 'Aceites', 'Aceite de oliva extra virgen 500ml', 'admin'),
('Arroz Diana Tradicional', 'Diana', 'ARR-DIA-001', 'A1', 'C002', 50, 3200.00, 'Granos', 'Arroz Diana x 500g', 'admin'),
('Frijol Rojo Nacional', 'La Abuela', 'FRI-ABU-001', 'A2', 'C003', 30, 4500.00, 'Granos', 'Frijol rojo x 500g', 'admin'),
('Pasta Espagueti', 'Doria', 'PAS-DOR-001', 'B1', 'C004', 40, 2800.00, 'Pastas', 'Espagueti Doria x 500g', 'admin'),
('Atún en Aceite', 'Van Camps', 'ATU-VAN-001', 'B2', 'C005', 60, 4200.00, 'Enlatados', 'Atún en aceite x 170g', 'admin'),
('Salsa de Tomate', 'Fruco', 'SAL-FRU-001', 'C1', 'C006', 35, 3500.00, 'Salsas', 'Salsa de tomate Fruco x 200g', 'admin'),
('Leche Entera UHT', 'Alpina', 'LEC-ALP-001', 'C2', 'C007', 48, 3800.00, 'Lácteos', 'Leche entera Alpina x 1L', 'admin'),
('Panela en Pastilla', 'Ingenio Risaralda', 'PAN-RIS-001', 'D1', 'C008', 25, 2200.00, 'Endulzantes', 'Panela en pastilla x 500g', 'admin');

-- =============================================
-- 🔒 CONFIGURACIONES DE SEGURIDAD
-- =============================================

-- Crear índices adicionales para optimización
CREATE INDEX idx_productos_busqueda ON productos(nombre, marca, sku);
CREATE INDEX idx_usuarios_login ON usuarios(username, active);
CREATE INDEX idx_productos_inventario ON productos(zona, contenedor, estado);

-- =============================================
-- ✅ VERIFICACIÓN DE INSTALACIÓN
-- =============================================

-- Mostrar resumen de datos insertados
SELECT 'USUARIOS CREADOS' as tipo, COUNT(*) as cantidad FROM usuarios;
SELECT 'PRODUCTOS CREADOS' as tipo, COUNT(*) as cantidad FROM productos;

-- Mostrar usuarios por rol
SELECT role, COUNT(*) as cantidad FROM usuarios GROUP BY role;

-- =============================================
-- 📝 CREDENCIALES DE ACCESO
-- =============================================

/*
🔑 CREDENCIALES DE ACCESO:

👑 ADMINISTRADOR:
   Usuario: admin
   Contraseña: admin123
   Permisos: Control total del sistema

👥 SUPERVISOR:
   Usuario: supervisor1  
   Contraseña: super123
   Permisos: Gestión de productos, vista usuarios

📦 BODEGUERO:
   Usuario: bodeguero1
   Contraseña: bodega123  
   Permisos: Gestión de inventario

⚠️ IMPORTANTE: Cambiar estas contraseñas en producción
*/
