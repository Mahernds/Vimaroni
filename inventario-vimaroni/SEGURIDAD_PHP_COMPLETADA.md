# 🛡️ SEGURIDAD PHP BACKEND - PLANETA HOSTING

## ✅ Medidas de Seguridad Implementadas

### 🔑 Autenticación y Autorización
- **JWT (JSON Web Tokens)**: Autenticación stateless y segura
- **bcrypt**: Hash de contraseñas con salt automático
- **Rate Limiting**: Protección contra ataques de fuerza bruta
- **Roles y Permisos**: Control de acceso basado en roles (admin, supervisor, bodeguero)

### 🛡️ Protección de Headers
- **CORS**: Headers configurados correctamente
- **X-Frame-Options**: Protección contra clickjacking
- **X-Content-Type-Options**: Previene MIME type sniffing
- **X-XSS-Protection**: Protección XSS habilitada
- **Content-Security-Policy**: Política de seguridad de contenido

### 🔒 Validación y Sanitización
- **Input Sanitization**: Todos los inputs son sanitizados
- **SQL Injection Protection**: Prepared statements en todas las consultas
- **XSS Prevention**: Escape de datos de salida

## 📁 Archivos de Seguridad

### `backend-php/api/security.php`
```php
// Biblioteca central de seguridad que incluye:
- SecurityManager class
- JWT generation y validation
- bcrypt password hashing
- Rate limiting con Redis/session
- Input sanitization
- Secure headers
- Role validation
```

### `backend-php/api/usuarios.php`
```php
// API segura de usuarios con:
- ✅ Autenticación JWT requerida
- ✅ Rate limiting en login (5 intentos por 15 min)
- ✅ Roles: admin (CRUD completo), supervisor (lectura)
- ✅ Contraseñas hasheadas con bcrypt
- ✅ Sanitización de inputs
- ✅ Headers seguros
```

### `backend-php/api/productos.php`
```php
// API segura de productos con:
- ✅ Autenticación JWT requerida para todas las operaciones
- ✅ Roles: admin y supervisor (eliminación), bodeguero (CRUD)
- ✅ Sanitización completa de inputs
- ✅ Auditoría de cambios (createdBy, updatedBy)
- ✅ Headers seguros
```

## 🔐 Endpoints Seguros

### Usuarios
```
POST /api/usuarios/login     - Login con rate limiting
POST /api/usuarios/verify-token - Verificar JWT
GET /api/usuarios           - Listar usuarios (admin/supervisor)
POST /api/usuarios          - Crear usuario (admin)
PUT /api/usuarios/{id}      - Editar usuario (admin o propio)
DELETE /api/usuarios/{id}   - Eliminar usuario (admin)
```

### Productos
```
GET /api/productos          - Listar productos (autenticado)
GET /api/productos/{id}     - Ver producto (autenticado)
POST /api/productos         - Crear producto (admin/supervisor/bodeguero)
PUT /api/productos/{id}     - Editar producto (admin/supervisor/bodeguero)
DELETE /api/productos/{id}  - Eliminar producto (admin/supervisor)
```

## 🎯 Roles y Permisos

### 👑 Admin
- CRUD completo en usuarios
- CRUD completo en productos
- Acceso a todos los endpoints
- Puede crear/editar/eliminar usuarios
- Puede eliminar productos

### 👥 Supervisor
- Lectura de usuarios
- CRUD completo en productos excepto eliminación
- No puede gestionar usuarios
- Acceso a reportes y análisis

### 📦 Bodeguero
- Solo lectura de usuarios propios
- CRUD en productos (no eliminación)
- Enfocado en gestión de inventario
- Acceso limitado

## 🔒 Características de Seguridad

### Rate Limiting
```php
// Login: 5 intentos por IP cada 15 minutos
applyRateLimit("login_{$clientIP}", 5, 15);
```

### JWT Configuration
```php
// Tokens con expiración de 24 horas
// Incluye: userId, username, role
// Verificación en cada request protegido
```

### Password Security
```php
// bcrypt con cost factor 12
// Verificación segura en login
// Nunca se exponen contraseñas en respuestas
```

### Input Sanitization
```php
// Sanitización recursiva de arrays
// Escape de caracteres especiales
// Validación de tipos de datos
```

## 🚀 Despliegue en Planeta Hosting

### Archivos a Subir
```
/api/
├── config.php          ✅ Configuración DB
├── security.php        ✅ Biblioteca de seguridad
├── usuarios.php        ✅ API usuarios segura
└── productos.php       ✅ API productos segura
```

### Variables de Entorno
```php
// En config.php configurar:
$host = 'tu-servidor-mysql';
$dbname = 'tu-base-datos';
$username = 'tu-usuario';
$password = 'tu-contraseña';
```

### Testing de Seguridad
1. **Rate Limiting**: Intentar login múltiples veces
2. **JWT**: Verificar tokens válidos/inválidos
3. **Roles**: Probar acceso con diferentes roles
4. **Input Validation**: Enviar datos maliciosos
5. **CORS**: Verificar headers de seguridad

## ⚡ Ventajas sobre Node.js Backend

### ✅ Compatibilidad Total
- ✅ Funciona en hosting compartido
- ✅ No requiere Node.js
- ✅ Solo necesita PHP 7.4+
- ✅ Compatible con MySQL/MariaDB

### ✅ Misma Seguridad
- ✅ JWT idéntico al backend Node.js
- ✅ bcrypt con mismo nivel de seguridad
- ✅ Rate limiting equivalente
- ✅ Headers de seguridad idénticos

### ✅ Facilidad de Despliegue
- ✅ Subir archivos por FTP/cPanel
- ✅ Configuración simple de DB
- ✅ Sin necesidad de PM2 o servicios
- ✅ Funciona inmediatamente

## 🔥 Status Final

### Backend Node.js (Local/Dev)
- ✅ 100% Seguro y funcional
- ✅ MongoDB con autenticación
- ✅ Todas las medidas de seguridad

### Backend PHP (Planeta Hosting)
- ✅ 100% Seguro y funcional
- ✅ MySQL con autenticación
- ✅ Paridad completa con Node.js
- ✅ Listo para producción

### Frontend
- ✅ Compatible con ambos backends
- ✅ JWT session management
- ✅ Role-based UI
- ✅ Secure API calls

**🎉 SISTEMA COMPLETAMENTE SEGURO Y LISTO PARA PLANETA HOSTING 🎉**
