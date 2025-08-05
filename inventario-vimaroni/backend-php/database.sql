-- Script de creación de base de datos para Vimaroni
-- Compatible con MySQL 5.7+ y Planeta Hosting

CREATE DATABASE IF NOT EXISTS vimaroni_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE vimaroni_db;

-- Tabla de usuarios
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    fullName VARCHAR(100) NOT NULL,
    role ENUM('admin', 'supervisor', 'bodeguero', 'operador') NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    createdBy VARCHAR(50),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    lastLogin TIMESTAMP NULL,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de productos
CREATE TABLE productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    marca VARCHAR(100) NOT NULL,
    sku VARCHAR(50) UNIQUE NOT NULL,
    zona VARCHAR(10) NOT NULL,
    contenedor VARCHAR(20) NOT NULL,
    cantidad INT NOT NULL DEFAULT 0,
    precio DECIMAL(10,2) DEFAULT 0.00,
    fechaVencimiento DATE NULL,
    categoria VARCHAR(100) DEFAULT 'General',
    descripcion TEXT,
    estado ENUM('activo', 'agotado', 'descontinuado') DEFAULT 'activo',
    createdBy VARCHAR(50),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_sku (sku),
    INDEX idx_zona_contenedor (zona, contenedor),
    INDEX idx_categoria (categoria),
    INDEX idx_estado (estado)
);

-- Insertar usuarios por defecto
INSERT INTO usuarios (username, password, fullName, role, createdBy) VALUES
('maher', '123456', 'Maher', 'admin', 'system'),
('supervisor', '123456', 'Supervisor', 'supervisor', 'system'),
('bodeguero', '123456', 'Bodeguero', 'bodeguero', 'system'),
('operador', '123456', 'Operador', 'operador', 'system');

-- Insertar algunos productos de ejemplo
INSERT INTO productos (nombre, marca, sku, zona, contenedor, cantidad, precio, categoria, createdBy) VALUES
('Almendras Premium', 'Vimaroni', 'ALM-001', 'A', '1', 150, 8500.00, 'Frutos Secos', 'system'),
('Nueces de California', 'Vimaroni', 'NUE-001', 'A', '2', 80, 12000.00, 'Frutos Secos', 'system'),
('Pasas Sultaninas', 'Vimaroni', 'PAS-001', 'B', '1', 200, 4500.00, 'Frutos Secos', 'system'),
('Pistachos Tostados', 'Vimaroni', 'PIS-001', 'B', '2', 45, 15000.00, 'Frutos Secos', 'system'),
('Avellanas Enteras', 'Vimaroni', 'AVE-001', 'C', '1', 90, 9500.00, 'Frutos Secos', 'system'),
('Maní Salado', 'Vimaroni', 'MAN-001', 'C', '2', 300, 3200.00, 'Frutos Secos', 'system'),
('Ciruelas Deshidratadas', 'Vimaroni', 'CIR-001', 'D', '1', 120, 6800.00, 'Frutas Deshidratadas', 'system'),
('Higos Secos', 'Vimaroni', 'HIG-001', 'D', '2', 75, 7500.00, 'Frutas Deshidratadas', 'system');

-- Mostrar resumen de la instalación
SELECT 'Usuarios creados:' as info, COUNT(*) as cantidad FROM usuarios
UNION ALL
SELECT 'Productos creados:', COUNT(*) FROM productos;
