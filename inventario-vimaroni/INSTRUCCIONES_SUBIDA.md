# 🚀 INSTRUCCIONES PARA SUBIR A HOSTINGER

## 📁 Archivos a preparar antes de subir:

### 1. Frontend (archivos del sitio web):
```
frontend/
├── index.html
├── style.css
├── script.js
├── logooo.png
├── mapa-almendros.jpg
└── mapa.html
```

### 2. Backend (servidor Node.js):
```
backend/
├── server.js
├── package.json
└── models/
    └── Producto.js
└── routes/
    └── productos.js
```

### 3. Archivos de configuración:
```
├── config.js
├── README.md
└── data.json
```

## 🔧 PASO A PASO EN HOSTINGER:

### PASO 1: Subir archivos del Frontend
1. **Entra a cPanel**
2. **Busca "File Manager"** (Administrador de archivos)
3. **Ve a la carpeta "public_html"**
4. **Sube todos los archivos del frontend**:
   - index.html
   - style.css
   - script.js
   - logooo.png
   - mapa-almendros.jpg

### PASO 2: Crear Base de Datos
1. **En cPanel busca "MySQL Databases"**
2. **Crear nueva base de datos**:
   - Nombre: `inventario_vimaroni`
3. **Crear usuario**:
   - Usuario: `vimaroni_user`
   - Contraseña: (genera una segura)
4. **Asignar usuario a la base de datos**

### PASO 3: Configurar Node.js (Backend)
1. **En cPanel busca "Node.js"** o "Node.js Apps"
2. **Crear nueva aplicación**:
   - Versión: Node.js 18.x o superior
   - Carpeta: `/backend`
3. **Subir archivos del backend** a la carpeta `/backend`
4. **Editar server.js** con los datos de la base de datos

### PASO 4: Configurar conexión a base de datos
Editar el archivo `server.js` con:
```javascript
// Configuración para Hostinger
const mongoURI = 'mongodb://vimaroni_user:TU_PASSWORD@localhost:27017/inventario_vimaroni';
```

### PASO 5: Instalar dependencias
1. **En cPanel > Node.js Apps**
2. **Click en tu aplicación**
3. **Run NPM Install**

### PASO 6: Iniciar la aplicación
1. **En Node.js Apps**
2. **Click "Start App"**
3. **Tu backend estará corriendo**

## 🌐 Configuración final:

### Actualizar script.js:
```javascript
// Cambiar localhost por tu dominio
const API_URL = 'https://tudominio.com:3001/api';
```

## ✅ Verificación:
1. **Frontend**: `https://tudominio.com`
2. **Backend**: `https://tudominio.com:3001/api/productos`
3. **Base de datos**: Conectada y funcionando

## 📞 Si necesitas ayuda:
- **Soporte Hostinger**: 24/7 en español
- **Chat en vivo**: Desde cPanel
- **Documentación**: Centro de ayuda Hostinger

¡Tu inventario estará online y funcionando! 🎉
