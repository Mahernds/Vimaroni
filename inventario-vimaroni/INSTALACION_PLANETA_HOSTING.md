# 🚀 GUÍA DE INSTALACIÓN - PLANETA HOSTING

## 📋 INFORMACIÓN REQUERIDA

Para completar la instalación en Planeta Hosting, necesito los siguientes datos:

### 🔗 INFORMACIÓN DEL HOSTING
- **Dominio:** _____________________ (ej: www.vimaroni.com)
- **Subdominio (si aplica):** _____________________ (ej: inventario.vimaroni.com)

### 🗄️ INFORMACIÓN DE BASE DE DATOS
- **Nombre de la BD:** _____________________
- **Usuario de BD:** _____________________
- **Contraseña de BD:** _____________________
- **Servidor de BD:** _____________________ (usualmente: localhost o mysql.planetahosting.cl)

### 🔐 INFORMACIÓN ADICIONAL
- **Prefijo de tablas (opcional):** _____________________ (ej: vim_ )
- **Panel de hosting:** Cpanel / DirectAdmin / Otro: _____________________

---

## 📁 ARCHIVOS LISTOS PARA SUBIR

Una vez que proporciones la información anterior, tendrás estos archivos configurados:

### Backend PHP (Carpeta: `backend-php/`)
```
backend-php/
├── config-hosting.php      ✅ Configurado con tus datos
├── database-hosting.sql    ✅ Script de instalación de BD
├── api/
│   ├── security-hosting.php    ✅ Sistema de seguridad
│   ├── productos.php          ✅ API de productos
│   └── usuarios.php           ✅ API de usuarios
└── install.php             🔜 Script de instalación
```

### Frontend (Carpeta: `frontend/`)
```
frontend/
├── index.html              ✅ Página principal
├── style.css              ✅ Estilos
├── config-frontend.js     ✅ Configurado con tu dominio
├── logooo.png            ✅ Logo
└── mapa-almendros.jpg    ✅ Imagen del mapa
```

---

## 🔧 PASOS DE INSTALACIÓN

### Paso 1: Configuración Inicial
1. Completa la información requerida arriba
2. Te configuraré automáticamente todos los archivos
3. Recibirás un paquete listo para subir

### Paso 2: Subida de Archivos
1. Sube todos los archivos de `frontend/` a la carpeta pública de tu hosting
2. Sube todos los archivos de `backend-php/` a una carpeta `api/` dentro de tu hosting

### Paso 3: Configuración de Base de Datos
1. Accede a phpMyAdmin en tu panel de hosting
2. Crea una nueva base de datos con el nombre que me indiques
3. Importa el archivo `database-hosting.sql`

### Paso 4: Configuración de URLs
1. Abrir `config-frontend.js` 
2. Reemplazar `AQUI_TU_DOMINIO.COM` con tu dominio real

### Paso 5: Verificación
1. Accede a tu dominio
2. Usa las credenciales por defecto:
   - **Admin:** admin / admin123
   - **Supervisor:** supervisor / super123
   - **Bodeguero:** bodeguero / bodega123
   - **Operador:** operador / oper123

---

## 🛡️ CARACTERÍSTICAS DE SEGURIDAD

### ✅ Implementadas
- 🔐 Autenticación JWT
- 🔒 Contraseñas encriptadas con bcrypt
- 🚦 Rate limiting (máximo 5 intentos por minuto)
- 🛡️ Headers de seguridad (CORS, CSP, etc.)
- 👮 Control de roles y permisos
- 🚫 Protección contra inyección SQL
- 🔍 Validación de entrada de datos

### 🔒 Configuración de Seguridad
- Tokens JWT válidos por 24 horas
- Sesiones seguras con renovación automática
- Logs de acceso y errores
- Protección contra fuerza bruta

---

## 📞 SOPORTE POST-INSTALACIÓN

### 🆘 Si algo no funciona:
1. **Verifica la conexión a BD:** Revisa las credenciales en `config-hosting.php`
2. **Revisa permisos:** Los archivos PHP deben tener permisos 644
3. **Verifica URLs:** Asegúrate que las rutas en `config-frontend.js` sean correctas
4. **Revisa logs:** Consulta los logs de error de tu hosting

### 🔄 Para cambiar contraseñas:
- Accede como admin al panel de usuarios
- Edita cualquier usuario y asigna nuevas contraseñas
- El sistema encriptará automáticamente las nuevas contraseñas

### 📊 Para respaldar datos:
- Exporta la base de datos desde phpMyAdmin
- Guarda una copia de los archivos subidos

---

## ⚡ OPTIMIZACIONES INCLUIDAS

- ⚡ Frontend optimizado para carga rápida
- 📱 Totalmente responsive para móviles
- 🔄 Renovación automática de sesiones
- 💾 Caché de datos para mejor rendimiento
- 🚀 Código minificado y optimizado

---

## 📋 PRÓXIMOS PASOS

**Envíame la información requerida en la parte superior y en pocos minutos tendrás:**

1. ✅ Todos los archivos configurados con tus datos reales
2. ✅ URLs y conexiones de BD actualizadas
3. ✅ Sistema completamente funcional
4. ✅ Instrucciones específicas para tu hosting
5. ✅ Script de instalación automatizada

**¡Tu sistema estará listo para producción en menos de 15 minutos!**
