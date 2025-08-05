# MIGRACIÓN A MYSQL PARA PLANETA HOSTING

## ¿Qué necesito cambiar?

### 1. Base de Datos: MongoDB → MySQL
- Cambiar de Mongoose a MySQL/Sequelize
- Convertir esquemas de MongoDB a tablas MySQL
- Migrar datos existentes

### 2. Backend: Node.js → PHP
- Convertir las APIs de Node.js a PHP
- Usar PDO o MySQLi para conexiones
- Mantener la misma funcionalidad

### 3. Frontend: 
- ✅ NO necesita cambios (HTML/CSS/JS funciona igual)
- Solo cambiar URLs de API

## Estructura Nueva:

```
inventario-vimaroni/
├── frontend/          (✅ Sin cambios)
│   ├── index.html
│   ├── style.css
│   └── script.js
├── backend-php/       (🆕 Nuevo)
│   ├── api/
│   │   ├── productos.php
│   │   ├── usuarios.php
│   │   └── config.php
│   └── database.sql   (🆕 Esquema MySQL)
└── docs/
```

## Ventajas de MySQL:
- ✅ Compatible con Planeta Hosting
- ✅ Más barato (hosting compartido)
- ✅ cPanel incluido
- ✅ Backup automático
- ✅ Soporte 24/7 en español

## Desventajas:
- 🔄 Requiere migración (1-2 días trabajo)
- 📝 Backend en PHP en lugar de Node.js

¿Quieres que haga la migración completa a MySQL/PHP?
