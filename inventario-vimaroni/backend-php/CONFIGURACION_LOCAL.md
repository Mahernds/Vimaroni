# CONFIGURACIÓN LOCAL SIN PHP

## Opción 1: Usar datos simulados (para prueba rápida)

1. Renombra `config.js` a `config.js.backup`
2. Crea un nuevo `config.js`:

```javascript
// Configuración de prueba con datos simulados
const CONFIG = {
    development: {
        API_URL: 'http://localhost:3000/api-simulada'
    },
    production: {
        API_URL: 'https://tu-dominio.com'
    }
};

const ENVIRONMENT = 'development';
const API_BASE_URL = CONFIG[ENVIRONMENT].API_URL;

// Datos simulados para prueba local
window.API_SIMULADA = {
    usuarios: [
        {id: 1, username: 'maher', fullName: 'Maher', role: 'admin', active: true},
        {id: 2, username: 'bodeguero', fullName: 'Bodeguero', role: 'bodeguero', active: true}
    ],
    productos: [
        {id: 1, nombre: 'Almendras Premium', marca: 'Vimaroni', sku: 'ALM-001', zona: 'A', contenedor: '1', cantidad: 150, precio: 8500},
        {id: 2, nombre: 'Nueces California', marca: 'Vimaroni', sku: 'NUE-001', zona: 'A', contenedor: '2', cantidad: 80, precio: 12000}
    ]
};
```

## Opción 2: Instalar XAMPP (recomendado)

1. **Descarga XAMPP**: https://www.apachefriends.org/download.html
2. **Instala** XAMPP en `C:\xampp`
3. **Inicia** Apache y MySQL desde XAMPP Control Panel
4. **Copia** la carpeta `backend-php` a `C:\xampp\htdocs\vimaroni`
5. **Ve a**: `http://localhost/vimaroni`

## Opción 3: Usar el sistema Node.js actual (temporal)

Si quieres probar rápidamente sin cambios:

```bash
cd backend
node server.js
```

Luego en otra terminal:
```bash
cd frontend  
python -m http.server 3000
```

Tu sistema funcionará en `http://localhost:3000` usando MongoDB.
