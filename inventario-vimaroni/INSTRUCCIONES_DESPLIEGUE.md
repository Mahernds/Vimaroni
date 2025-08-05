# Guía de Despliegue para PLANETA HOSTING

## 🎯 **MIGRACIÓN COMPLETA A MYSQL/PHP**

Tu sistema ha sido **completamente migrado** de MongoDB/Node.js a MySQL/PHP para ser 100% compatible con **Planeta Hosting**. 

## 📋 **Estructura del Sistema Nuevo**

```
inventario-vimaroni/
├── frontend/                  ✅ (Subir a public_html)
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   ├── config.js             ✅ Configuración automática
│   └── logooo.png
├── backend-php/              ✅ (Subir a public_html)
│   ├── .htaccess             ✅ URLs amigables
│   ├── database.sql          ✅ Script de base de datos
│   └── api/
│       ├── config.php        ✅ Conexión MySQL
│       ├── usuarios.php      ✅ API de usuarios
│       └── productos.php     ✅ API de productos
└── docs/
```

---

## 🚀 **INSTALACIÓN EN PLANETA HOSTING**

### **PASO 1: Crear Base de Datos MySQL**

1. **Entra a cPanel** de tu Planeta Hosting
2. **Ve a "Bases de datos MySQL"**
3. **Crea una nueva base de datos**:
   - Nombre: `tu_usuario_vimaroni_db`
   - Usuario: `tu_usuario_mysql`
   - Contraseña: `tu_password_mysql`
4. **Ejecuta el script SQL**:
   - Ve a phpMyAdmin
   - Selecciona tu base de datos
   - Ve a "Importar"
   - Sube el archivo `backend-php/database.sql`
   - Haz clic en "Ejecutar"

### **PASO 2: Configurar Conexión de Base de Datos**

Edita el archivo `backend-php/api/config.php`:

```php
// Configuración para Planeta Hosting (líneas 9-12)
private $host_prod = "localhost";
private $db_name_prod = "tu_usuario_vimaroni_db";    // ← TU BASE DE DATOS
private $username_prod = "tu_usuario_mysql";        // ← TU USUARIO
private $password_prod = "tu_password_mysql";       // ← TU CONTRASEÑA
```

### **PASO 3: Configurar Dominio Frontend**

Edita el archivo `frontend/config.js`:

```javascript
production: {
    API_URL: 'https://tu-dominio.com'  // ← TU DOMINIO REAL
}
```

### **PASO 4: Subir Archivos**

**Via Administrador de Archivos de cPanel:**

1. **Sube FRONTEND** a `public_html/`:
   ```
   public_html/
   ├── index.html
   ├── style.css
   ├── config.js
   ├── logooo.png
   └── mapa-almendros.jpg
   ```

2. **Sube BACKEND** a `public_html/`:
   ```
   public_html/
   ├── .htaccess          ← Importante para URLs
   └── api/
       ├── config.php
       ├── usuarios.php
       └── productos.php
   ```

---

## ✅ **VERIFICACIÓN**

### **1. Verificar Base de Datos**
- Entra a phpMyAdmin
- Verifica que las tablas `usuarios` y `productos` existan
- Verifica que tengas los usuarios por defecto

### **2. Verificar APIs**
- Ve a: `https://tu-dominio.com/api/usuarios`
- Debes ver la lista de usuarios JSON
- Ve a: `https://tu-dominio.com/api/productos`
- Debes ver la lista de productos JSON

### **3. Verificar Frontend**
- Ve a: `https://tu-dominio.com`
- Debes ver la pantalla de login
- Prueba login con: `maher` / `123456`

---

## 🔐 **USUARIOS POR DEFECTO**

| Usuario     | Contraseña | Rol        |
|-------------|------------|------------|
| `maher`     | `123456`   | admin      |
| `supervisor`| `123456`   | supervisor |
| `bodeguero` | `123456`   | bodeguero  |
| `operador`  | `123456`   | operador   |

---

## 🛠️ **PLANES RECOMENDADOS DE PLANETA HOSTING**

### **Hosting Profesional - $59.900/año** ⭐ RECOMENDADO
- ✅ 30 GB espacio SSD (suficiente para tu sistema)
- ✅ 10 Bases MySQL (solo necesitas 1)
- ✅ Dominio gratis (.cl o .com)
- ✅ SSL incluido
- ✅ cPanel incluido

### **Hosting Personal - $49.900/año** 💰 ECONÓMICO
- ✅ 15 GB espacio SSD
- ✅ 3 Bases MySQL
- ❌ No incluye dominio

---

## 🔧 **VENTAJAS DE LA MIGRACIÓN**

### **✅ Lo que GANASTE:**
- **100% Compatible** con hosting compartido
- **Más económico** (~$60.000/año vs $960.000/año VPS)
- **Soporte 24/7** en español de Planeta Hosting
- **cPanel incluido** (fácil administración)
- **MySQL estándar** (más confiable para inventarios)
- **Backup automático** incluido
- **SSL gratuito** incluido

### **✅ Lo que SE MANTIENE:**
- **Misma funcionalidad** exacta
- **Mismo diseño** y interfaz
- **Mismos paneles** por rol
- **Mismo sistema** de usuarios
- **Mismas estadísticas** reales
- **Mismo mensaje** de bienvenida

---

## 🎯 **MIGRACIÓN COMPLETADA**

✅ **Base de datos**: MongoDB → MySQL  
✅ **Backend**: Node.js → PHP  
✅ **APIs**: REST completamente funcional  
✅ **Frontend**: Sin cambios (mismo código)  
✅ **Funcionalidad**: 100% mantenida  
✅ **Usuarios**: Migrados con mismos datos  
✅ **Productos**: Migrados con productos de ejemplo  

**Tu sistema está listo para Planeta Hosting** 🚀
